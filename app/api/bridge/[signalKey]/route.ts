import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PropagationService } from '@/lib/services/PropagationService';

/**
 * COPPR UNIVERSAL SIGNAL BRIDGE
 * Handles 'Master-Slave' (Official) and 'Direct' (Marketplace) signal distribution.
 * Distributes alerts to VPS-Managed accounts or Client-Side terminals.
 */
export async function POST(
  request: Request,
  { params }: { params: { signalKey: string } }
) {
  const { signalKey } = params;
  const supabase = createClient();

  try {
    // 1. Identify the Strategy tied to this Signal Key
    const { data: strategy, error: sError } = await supabase
      .from('strategies')
      .select('id, origin, status')
      .eq('master_webhook_key', signalKey)
      .eq('status', 'ACTIVE')
      .single();

    // 2. Fetch Payload & Intelligently Map TradingView Keys
    const rawPayload = await request.json();
    
    // Normalization Mapping (TradingView -> Internal)
    const action = rawPayload.action || rawPayload.side || rawPayload.order_action || rawPayload.direction;
    const symbol = rawPayload.symbol || rawPayload.ticker || rawPayload.ticker_id;
    const price = rawPayload.price || rawPayload.close || rawPayload.entry_price || 0;

    if (!action || !symbol) {
        console.error('[Bridge] Malformed Signal:', rawPayload);
        return NextResponse.json({ 
            error: 'Malformed Signal Data', 
            details: 'Required: action/side and symbol/ticker',
            received: rawPayload 
        }, { status: 400 });
    }

    console.log(`[Bridge] Signal Received: ${action} ${symbol} @ ${price}`);

    // 🚩 STRATEGY NOT FOUND: Fallback to existing Direct Subscriber Bridge
    if (sError || !strategy) {
        // Old logic for backward compatibility with per-user unique keys
        const { data: sub, error: subError } = await supabase
            .from('user_strategies')
            .select('id, user_id, strategy_id, status, current_period_end')
            .eq('signal_key', signalKey)
            .eq('status', 'ACTIVE')
            .single();

        if (subError || !sub) {
            return NextResponse.json({ error: 'Invalid Topology Key' }, { status: 403 });
        }

        // Handle Direct Relay (Single User)
        return await relaySignal(sub.user_id, sub.strategy_id, action, price, symbol, supabase);
    }

    // 🚩 MASTER FAN-OUT: Distribute to ALL active subscribers
    if (strategy) {
        // Log Master Signal once
        await supabase.from('signal_logs').insert({
            strategy_id: strategy.id,
            action,
            symbol,
            entry_price: price,
            timestamp: new Date().toISOString()
        });

        // Trigger Async SEBI Throttled Fan-Out
        PropagationService.fanOut(strategy.id, rawPayload, signalKey, supabase).catch(console.error);

        return NextResponse.json({ 
            status: 'MASTER_FAN_OUT_INITIATED',
            strategy_origin: strategy.origin 
        });
    }

    return NextResponse.json({ status: 'NO_ACTION_REQUIRED' });

  } catch (error: any) {
    console.error('Bridge Error:', error.message);
    return NextResponse.json({ error: 'Internal Bridge Failure' }, { status: 500 });
  }
}

/**
 * HELPER: Relay signal to the VPS Internal Execution Bridge
 */
async function relaySignal(userId: string, strategyId: string, action: string, price: number, symbol: string, supabase: any) {
    try {
        await fetch(`${process.env.VPS_URL}/mt5-action`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.VPS_INTERNAL_KEY}` 
            },
            body: JSON.stringify({
                action: 'EXECUTE_TRADE',
                userId,
                strategyId,
                tradeParams: { side: action, symbol, price }
            })
        });
    } catch (e) {
        console.error('Relay Error for user:', userId, e);
    }
    return NextResponse.json({ status: 'DIRECT_RELAY_INITIATED' });
}
