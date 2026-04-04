import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * SIGNAL HUB HUB (MASTER BROADCAST)
 * Dedicated endpoint for Master EAs to broadcast signals.
 * 
 * REQUEST: POST /api/license/signal?key=MASTER_SIGNAL_KEY
 * BODY: { "action": "BUY", "symbol": "XAUUSD", "price": 1965.2, "sl": 1960, "tp": 1975 }
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({
      status: 'DENIED',
      message: 'No cryptographic key provided in signal header.'
    }, { status: 401 });
  }

  const supabase = createClient();

  try {
    const payload = await request.json();

    // 1. ATTEMPT TO VERIFY AS MASTER SIGNAL KEY (STRATEGY LEVEL)
    const { data: strategy, error: sError } = await supabase
      .from('strategies')
      .select('id, name, is_managed')
      .eq('master_signal_key', key)
      .single();

    if (strategy) {
      // --- MASTER SIGNAL FLOW ---

      // A. Log Master Signal
      const { data: signalLog, error: logError } = await supabase
        .from('signal_logs')
        .insert({
          strategy_id: strategy.id,
          action: payload.action,
          symbol: payload.symbol,
          price: payload.price,
          sl: payload.sl,
          tp: payload.tp,
          order_type: payload.order_type || 'MARKET',
          limit_price: payload.limit_price
        })
        .select()
        .single();

      if (logError) throw logError;

      // B. Fan-out to Active Subscribers
      // Fetch all active subscriptions for this strategy
      const { data: subscribers, error: subError } = await supabase
        .from('user_strategies')
        .select('id, user_id, risk_multiplier, broker_account_id')
        .eq('strategy_id', strategy.id)
        .eq('status', 'ACTIVE')
        .eq('sync_active', true);

      if (subError) throw subError;

      if (subscribers && subscribers.length > 0) {
        // C. Log Propagation Events for UI (TerminalLog)
        const propagationEntries = subscribers.map(sub => ({
          subscription_id: sub.id,
          action: 'SIGNAL_PROPAGATED',
          details: {
            master_signal_id: signalLog.id,
            payload: {
              ...payload,
              order_type: payload.order_type || 'MARKET'
            },
            status: 'PENDING_EXECUTION'
          }
        }));

        await supabase.from('subscription_logs').insert(propagationEntries);

        // D. Trigger actual execution worker (Asynchronous Fan-out)
        import('@/lib/services/PropagationService').then(({ PropagationService }) => {
          PropagationService.fanOut(strategy.id, payload);
        });
      }

      return NextResponse.json({
        status: 'INGESTED',
        message: `Broadcasting ${payload.action} for ${strategy.name} to ${subscribers?.length || 0} nodes.`,
        strategy_id: strategy.id,
        timestamp: new Date().toISOString()
      });
    }

    // 2. FALLBACK: VERIFY AS INDIVIDUAL LICENSE KEY (LEGACY CLIENT-SIDE)
    const { data: license, error } = await supabase
      .from('user_strategies')
      .select('id, status, current_period_end')
      .eq('signal_key', key)
      .single();

    if (error || !license || license.status !== 'ACTIVE') {
      return NextResponse.json({
        status: 'REVOKED',
        message: 'Cryptographic handshake failed or subscription expired.'
      });
    }

    // Log individual license event
    await supabase.from('subscription_logs').insert({
      subscription_id: license.id,
      action: 'SIGNAL_INGESTED',
      details: { payload, source: 'LegacyEA' }
    });

    return NextResponse.json({
      status: 'INGESTED',
      message: 'Signal authenticated for individual license.',
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Signal Hub Logic Failure:', err.message);
    return NextResponse.json({
      status: 'INTERNAL_FAULT',
      error: err.message
    }, { status: 500 });
  }
}

/**
 * SIGNAL POLLING HUB (SUBSCRIBER FETCH)
 * Endpoint for Subscriber EAs to poll for latest signals.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key'); // subscriber strategy key

  if (!key) {
    return NextResponse.json({ status: 'DENIED' }, { status: 401 });
  }

  const supabase = createClient();

  try {
    // Verify subscriber license
    const { data: license, error: lError } = await supabase
      .from('user_strategies')
      .select('id, strategy_id, status')
      .eq('signal_key', key)
      .single();

    if (lError || !license || license.status !== 'ACTIVE') {
      return NextResponse.json({ status: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Fetch latest signal for this strategy
    const { data: signal, error: sError } = await supabase
      .from('signal_logs')
      .select('*')
      .eq('strategy_id', license.strategy_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sError) throw sError;

    return NextResponse.json({
      status: 'OK',
      signal: signal || null,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    return NextResponse.json({ status: 'ERROR', message: err.message }, { status: 500 });
  }
}
