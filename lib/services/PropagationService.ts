import { createClient } from '@/lib/supabase/server';
import { ZerodhaAdapter, AngelOneAdapter, MT5Adapter } from '@/lib/brokers/adapters';

export class PropagationService {
    /**
     * FANS OUT A MASTER SIGNAL TO ALL SUBSCRIBERS
     * @param strategyId The strategy broadcasting
     * @param signalPayload Original signal data
     */
    static async fanOut(strategyId: string, signalPayload: any, customClient?: any) {
        const supabase = customClient || createClient();
        console.log(`[PROPAGATION] Starting Fan-out for Strategy ${strategyId}`);

        // 1. Fetch Active Subscribers with their Broker Accounts
        const { data: subscribers, error } = await supabase
            .from('user_strategies')
            .select(`
                id, 
                user_id, 
                risk_multiplier, 
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

        console.log(`[PROPAGATION] Found ${subscribers.length} active nodes.`);

        const propagationPromises = subscribers.map(async (sub: any) => {
            try {
                // Determine Broker Adapter
                const broker = (Array.isArray(sub.broker_accounts) ? sub.broker_accounts[0] : sub.broker_accounts) as any;
                
                if (!broker) {
                    await this.logEvent(sub.id, "EXECUTION_FAIL", { error: "No linked broker account found.", status: 'FAILED' }, supabase);
                    return;
                }

                let adapter;
                switch (broker.broker_type) {
                    case 'ZERODHA': adapter = new ZerodhaAdapter(); break;
                    case 'ANGELONE': adapter = new AngelOneAdapter(); break;
                    case 'MT5': adapter = new MT5Adapter(); break;
                    default: 
                        await this.logEvent(sub.id, "EXECUTION_FAIL", { error: `Unsupported broker type: ${broker.broker_type}`, status: 'FAILED' }, supabase);
                        return;
                }

                // Calculate Order (risk adjustment)
                const order = {
                    symbol: signalPayload.symbol,
                    action: signalPayload.action,
                    quantity: this.calculateQuantity(sub.risk_multiplier, signalPayload),
                    orderType: signalPayload.order_type || 'MARKET',
                    limitPrice: signalPayload.limit_price,
                    price: signalPayload.price,
                    sl: signalPayload.sl,
                    tp: signalPayload.tp
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

    private static calculateQuantity(multiplier: number, payload: any): number {
        return multiplier * (payload.quantity || 0.01);
    }
}
