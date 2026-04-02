import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * SIGNAL HUB PROTOCOL (WEBHOOK HANDSHAKE)
 * Dedicated endpoint for TradingView / Pine Script webhooks.
 * 
 * REQUEST: POST /api/license/signal?key=SIGNAL_KEY_UUID
 * BODY: { "action": "BUY", "ticker": "XAUUSD", "price": 1965.2 }
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

    // 1. VERIFY LIVE LICENSE (No account check required for webhooks usually)
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

    const expiry = new Date(license.current_period_end);
    if (expiry < new Date()) {
        return NextResponse.json({ 
            status: 'EXPIRED',
            message: 'Renewal required for signal ingestion.'
        });
    }

    // 2. LOG SIGNAL EVENT
    await supabase.from('subscription_logs').insert({
        subscription_id: license.id,
        action: 'SIGNAL_INGESTED',
        details: { payload, source: 'TradingView' }
    });

    // 3. SUCCESS: PROCEED TO EXECUTION
    return NextResponse.json({ 
        status: 'INGESTED',
        message: 'Signal authenticated. Handing off to execution terminal.',
        timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Signal Hub Logic Failure:', err.message);
    return NextResponse.json({ status: 'INTERNAL_FAULT' }, { status: 500 });
  }
}
