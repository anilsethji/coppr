import { createClient } from '@/lib/supabase/server';
import { ZerodhaAdapter, AngelOneAdapter, MT5Adapter } from '@/lib/brokers/adapters';
import { BinanceFuturesAdapter } from '@/lib/brokers/BinanceFuturesAdapter';

export class PropagationService {
    /**
     * FANS OUT A MASTER SIGNAL TO ALL SUBSCRIBERS
     * @param strategyId The strategy broadcasting
     * @param signalPayload Original signal data
     * @param providedKey Security key from the Master Bot
     */
    static async fanOut(strategyId: string, signalPayload: any, providedKey?: string, customClient?: any) {
        const supabase = customClient || createClient();
        console.log(`[PROPAGATION] Starting Authorized Fan-out for Strategy ${strategyId}`);

        // 0. VERIFY MASTER SECURITY KEY
        const { data: strategy, error: sError } = await supabase
            .from('strategies')
            .select('master_signal_key')
            .eq('id', strategyId)
            .single();

        if (sError || !strategy) {
            console.error('[PROPAGATION] Security Abort: Strategy not found or unauthorized.');
            return;
        }

        if (strategy.master_signal_key !== providedKey) {
            console.error('[PROPAGATION] Security Alert: Invalid Master Key provided for broadcast.');
            // Log security event
            await supabase.from('signal_logs').insert({
                strategy_id: strategyId,
                status: 'REJECTED',
                message: 'UNAUTHORIZED_BROADCAST_ATTEMPT'
            });
            return;
        }

        // 1. Fetch Active Subscribers with their Broker Accounts
        const { data: subscribers, error } = await supabase
            .from('user_strategies')
            .select(`
                id, 
                user_id, 
                engine_mode,
                engine_value,
                leverage_override,
                is_paused,
                broker_account_id,
                broker_accounts!broker_account_id (*)
            `)
            .eq('strategy_id', strategyId)
            .eq('status', 'ACTIVE')
            .eq('sync_active', true);

        if (error || !subscribers) {
            console.error('[PROPAGATION] Failed to fetch subscribers:', error?.message);
            return;
        }

        console.log(`[PROPAGATION] Found ${subscribers.length} candidate nodes.`);

        const propagationPromises = subscribers.map(async (sub: any) => {
            try {
                // Determine Broker Adapter
                const broker = (Array.isArray(sub.broker_accounts) ? sub.broker_accounts[0] : sub.broker_accounts) as any;
                
                if (!broker) {
                    await this.logEvent(sub.id, "EXECUTION_FAIL", { error: "No linked broker account found.", status: 'FAILED' }, supabase);
                    return;
                }

                // ABORT IF PAUSED (Manual or Auto-Kill)
                if (sub.is_paused) {
                    console.log(`[PROPAGATION] Node ${sub.id} is PAUSED. Dropping signal.`);
                    await this.logEvent(sub.id, "NODE_PAUSED", { message: sub.last_kill_reason || "Global stop active.", status: 'SKIPPED' }, supabase);
                    return;
                }

                let adapter;
                switch (broker.broker_type) {
                    case 'ZERODHA': adapter = new ZerodhaAdapter(); break;
                    case 'ANGELONE': adapter = new AngelOneAdapter(); break;
                    case 'MT5': adapter = new MT5Adapter(); break;
                    case 'BINANCE_FUTURES': adapter = new BinanceFuturesAdapter(); break;
                    default: 
                        await this.logEvent(sub.id, "EXECUTION_FAIL", { error: `Unsupported broker type: ${broker.broker_type}`, status: 'FAILED' }, supabase);
                        return;
                }

                // PRE-FLIGHT WATCHDOG: DRAWDOWN PROTECTION
                const currentBalance = await adapter.getAccountBalance({ 
                    account_id: broker.account_id,
                    api_key: broker.api_key,
                    api_secret: broker.api_secret
                });
                const baseBalance = sub.base_balance || currentBalance;
                const threshold = sub.drawdown_threshold || 50.0;
                const currentDrawdown = ((baseBalance - currentBalance) / baseBalance) * 100;

                if (currentDrawdown > threshold) {
                    console.error(`[WATCHDOG] Node ${sub.id} triggered Kill-Switch! Drawdown: ${currentDrawdown.toFixed(2)}% > ${threshold}%`);
                    // PERSIST KILL SWITCH
                    await supabase.from('user_strategies')
                        .update({ is_paused: true, last_kill_reason: 'CRITICAL_DRAWDOWN_REACHED' })
                        .eq('id', sub.id);
                        
                    await this.logEvent(sub.id, "AUTO_KILL", { 
                        reason: 'CRITICAL_DRAWDOWN_REACHED', 
                        drawdown: currentDrawdown, 
                        threshold,
                        status: 'KILLED' 
                    }, supabase);
                    return;
                }

                // Calculate Order (risk adjustment)
                const calculatedQty = await this.calculateQuantity(sub, signalPayload, adapter, {
                    account_id: broker.account_id,
                    api_key: broker.api_key,
                    api_secret: broker.api_secret
                });

                const order = {
                    symbol: signalPayload.symbol,
                    action: signalPayload.action,
                    quantity: calculatedQty,
                    orderType: signalPayload.order_type || 'MARKET',
                    limitPrice: signalPayload.limit_price,
                    price: signalPayload.price,
                    sl: signalPayload.sl,
                    tp: signalPayload.tp,
                    leverage: sub.leverage_override || 1
                };

                // Place Order
                const result = await adapter.placeOrder(order, {
                    account_id: broker.account_id,
                    api_key: broker.api_key,
                    api_secret: broker.api_secret
                });

                if (result.success) {
                    await this.logEvent(sub.id, "EXECUTED", { orderId: result.orderId || 'N/A', order, status: 'SUCCESS' }, supabase);
                } else {
                    await this.logEvent(sub.id, "EXECUTION_FAIL", { error: result.error || "Order execution failed.", status: 'FAILED' }, supabase);
                }

            } catch (err: any) {
                console.error(`[PROPAGATION] Critical Fault for sub ${sub.id}:`, err.message);
                await this.logEvent(sub.id, "EXECUTION_FAIL", { error: err.message, status: 'FAILED' }, supabase);
            }
        });

        await Promise.allSettled(propagationPromises);
        console.log(`[PROPAGATION] Fan-out complete for Strategy ${strategyId}`);
    }

    private static async logEvent(subId: string, action: string, details: any, supabase: any) {
        await supabase.from('subscription_logs').insert({
            subscription_id: subId,
            action,
            details
        });
    }

    private static async calculateQuantity(sub: any, payload: any, adapter: any, credentials: any): Promise<number> {
        const mode = sub.engine_mode || 'MULTIPLIER';
        const val = sub.engine_value || 1.0;
        const masterQty = payload.quantity || 0.01;

        switch (mode) {
            case 'FIXED_QTY':
                return val;
            
            case 'PCT_BALANCE':
                const balance = await adapter.getAccountBalance(credentials);
                const price = payload.price || 1.0; 
                // Formula: (Budget / Price) -> e.g. (10% of 1000) / 50000 price = 0.002 BTC
                const qty = ( (val / 100) * balance ) / price;
                return Number(qty.toFixed(4));

            case 'MULTIPLIER':
            default:
                let resultQty = val * masterQty;
                // BINANCE PRECISION GUARD (Min step size 0.001 typically for BTC)
                if (sub.broker_accounts?.broker_type === 'BINANCE_FUTURES') {
                    resultQty = Number(resultQty.toFixed(3)); 
                }
                return resultQty;
        }
    }
}
