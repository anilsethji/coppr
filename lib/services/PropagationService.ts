import { createClient } from '@/lib/supabase/server';
import { ZerodhaAdapter, AngelOneAdapter, MT5Adapter, TradingViewDemoAdapter } from '@/lib/brokers/adapters';
import { BinanceFuturesAdapter } from '@/lib/brokers/BinanceFuturesAdapter';
import { BybitAdapter } from '@/lib/brokers/BybitAdapter';
import { DhanAdapter } from '@/lib/brokers/DhanAdapter';
import { MexcAdapter } from '@/lib/brokers/MexcAdapter';
import { BingXAdapter } from '@/lib/brokers/BingXAdapter';
import { GrowwAdapter } from '@/lib/brokers/GrowwAdapter';

export class PropagationService {
    /**
     * FANS OUT A MASTER SIGNAL TO ALL SUBSCRIBERS
     * @param strategyId The strategy broadcasting
     * @param signalPayload Original signal data
     * @param providedKey Security key from the Master Bot
     */
    static async fanOut(strategyId: string, signalPayload: any, providedKey?: string, customClient?: any, ingestedAt?: number) {
        const supabase = customClient || createClient();
        const startExecution = new Date().getTime();
        const ingestedAtNormalized = ingestedAt || startExecution;
        
        console.log(`[PROPAGATION] Institutional Fan-out Initiated | Strategy: ${strategyId} | Protocol: SEBI_2026_Ingress`);

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
                active_assets,
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

        const CHUNK_SIZE = 10;
        const DELAY_MS = 1000; // SEBI mandated 1.0s Pulse for Multi-Node Ingress

        for (let i = 0; i < subscribers.length; i += CHUNK_SIZE) {
            const chunk = subscribers.slice(i, i + CHUNK_SIZE);
            
            const chunkPromises = chunk.map(async (sub: any) => {
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

                // ASSET WHITELIST FIREWALL
                const activeAssets = sub.active_assets || [];
                const signalSymbol = signalPayload.symbol;
                
                // If whitelist exists, enforce it
                if (activeAssets.length > 0 && !activeAssets.includes(signalSymbol)) {
                    console.warn(`[FIREWALL] Signal ${signalSymbol} rejected for Node ${sub.id} (Unauthorized Asset).`);
                    await this.logEvent(sub.id, "SYMBOL_REJECTED", { 
                       symbol: signalSymbol, 
                       message: "This asset is not whitelisted in your risk protocol.",
                       status: 'REJECTED' 
                    }, supabase);
                    return;
                }

                let adapter;
                switch (broker.broker_type) {
                    case 'ZERODHA': adapter = new ZerodhaAdapter(); break;
                    case 'ANGELONE': adapter = new AngelOneAdapter(); break;
                    case 'MT5': adapter = new MT5Adapter(); break;
                    case 'BINANCE_FUTURES': adapter = new BinanceFuturesAdapter(); break;
                    case 'BYBIT': adapter = new BybitAdapter(); break;
                    case 'DHAN': adapter = new DhanAdapter(); break;
                    case 'MEXC': adapter = new MexcAdapter(); break;
                    case 'BINGX': adapter = new BingXAdapter(); break;
                    case 'GROWW': adapter = new GrowwAdapter(); break;
                    case 'TRADINGVIEW_DEMO': adapter = new TradingViewDemoAdapter(); break;
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

                const order: any = {
                    symbol: signalPayload.symbol,
                    action: signalPayload.action,
                    quantity: calculatedQty,
                    orderType: signalPayload.order_type || 'MARKET',
                    limitPrice: signalPayload.limit_price,
                    price: signalPayload.price,
                    sl: signalPayload.sl,
                    tp: signalPayload.tp,
                    leverage: sub.leverage_override || 1,
                    algoId: strategyId
                };

                // Place Order with full credential meta (Password, Server, etc.)
                const result = await adapter.placeOrder(order, {
                    account_id: broker.account_id,
                    api_key: broker.api_key,
                    api_secret: broker.api_secret,
                    meta: broker.meta || {}
                });

                if (result.success) {
                    const executionLatency = new Date().getTime() - (ingestedAt || startExecution);
                    await this.logEvent(sub.id, "EXECUTED", { 
                        orderId: result.orderId || 'N/A', 
                        order, 
                        status: 'SUCCESS',
                        latency_ms: executionLatency,
                        protocol: 'SEBI_2026_COMPLIANT'
                    }, supabase);
                } else {
                    const isAuthError = result.error?.toLowerCase().includes('auth') || result.error?.toLowerCase().includes('api key');
                    
                    if (isAuthError) {
                        await supabase.from('user_strategies')
                            .update({ is_paused: true, last_kill_reason: 'REGULATORY_AUTH_FAILURE' })
                            .eq('id', sub.id);
                        
                        await this.logEvent(sub.id, "AUTO_KILL", { 
                            reason: 'REGULATORY_AUTH_FAILURE', 
                            error: result.error,
                            status: 'KILLED' 
                        }, supabase);
                    } else {
                        await this.logEvent(sub.id, "EXECUTION_FAIL", { error: result.error || "Order execution failed.", status: 'FAILED' }, supabase);
                    }
                }

            } catch (err: any) {
                console.error(`[PROPAGATION] Critical Fault for sub ${sub.id}:`, err.message);
                await this.logEvent(sub.id, "EXECUTION_FAIL", { error: err.message, status: 'FAILED' }, supabase);
            }
        });

            await Promise.allSettled(chunkPromises);

            if (i + CHUNK_SIZE < subscribers.length) {
                console.log(`[PROPAGATION] 2026.04.01 Protocol Enforcement: Pausing ${DELAY_MS}ms for High-Speed Guard...`);
                await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
            }
        }

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
        const mode = sub.engine_mode || 'FIXED_QTY';
        const val = sub.engine_value || 100; // Default $100 if missing
        const leverage = sub.leverage_override || 1;
        
        // Price detection: TradingView signals usually include 'price'. 
        // If missing, we fallback to 1.0 (which essentially treats value as units) or fetch from adapter if available.
        let price = parseFloat(payload.price || payload.close || 0);
        
        // Fallback for price-agnostic brokers (like Zerodha for some instruments) 
        // or if TV signal doesn't provide price.
        if (!price || price <= 0) {
            console.warn(`[QUANT] Missing price in signal. Defaulting to 1.0 (Unit-based logic).`);
            price = 1.0;
        }

        switch (mode) {
            case 'PCT_BALANCE':
                const balance = await adapter.getAccountBalance(credentials);
                // Formula: ((% of Balance) * Leverage) / Price
                // e.g. ((2% of 1000) * 10x) / 50000 price = $200 power / 50000 = 0.004 BTC
                const portfolioQty = ( (val / 100) * balance * leverage ) / price;
                return Number(portfolioQty.toFixed(4));

            case 'FIXED_QTY':
            default:
                // Formula: (USD Base Value * Leverage) / Price
                // e.g. ($100 * 10x) / 50000 price = $1000 power / 50000 = 0.02 BTC
                const usdQty = ( val * leverage ) / price;
                
                // PRECISION GUARD (e.g. 0.01 step for Gold, 0.001 for BTC)
                return Number(usdQty.toFixed(4));
        }
    }
}
