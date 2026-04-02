import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * LICENSE AUTHENTICATION PROTOCOL (PHONE-HOME)
 * Public endpoint for External Terminals (MT5/cTrader) to verify execution rights.
 * 
 * REQUEST: GET /api/license/auth?account=12345&key=SIGNAL_KEY_UUID&strategy=XAU_REAPER
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get('account');
  const key = searchParams.get('key');
  const strategyName = searchParams.get('strategy');

  if (!account || !key || !strategyName) {
    return NextResponse.json({ 
        status: 'INVALID_PROTOCOL',
        message: 'Insufficient handshake parameters (Account, Key, Strategy)'
    }, { status: 400 });
  }

  const supabase = createClient();

  try {
    // 1. VERIFY LIVE SUBSCRIPTION
    // We check if the signal_key matches an ACTIVE user_strategy linked to this account_number
    const { data: license, error } = await supabase
      .from('user_strategies')
      .select(`
        id,
        status,
        expires_at:current_period_end,
        strategy:strategies (
          id,
          name
        )
      `)
      .eq('signal_key', key)
      .eq('mt5_account_number', account)
      .single();

    if (error || !license) {
        return NextResponse.json({ 
            status: 'REVOKED',
            message: 'No authorized license found for this terminal handshake.'
        });
    }

    // 2. CHECK STATUS & EXPIRY
    if (license.status !== 'ACTIVE') {
        return NextResponse.json({ 
            status: 'REVOKED',
            message: `License status: ${license.status}`
        });
    }

    const expiry = new Date(license.expires_at);
    if (expiry < new Date()) {
        return NextResponse.json({ 
            status: 'EXPIRED',
            message: 'Protocol lease has expired. Renewal required.'
        });
    }

    // 3. MATCH STRATEGY NAME (Security check for signal leachers)
    const strategy = license.strategy as any;
    if (strategy?.name !== strategyName) {
        return NextResponse.json({ 
            status: 'REVOKED',
            message: 'Asset mismatch. License issued for a different protocol.'
        });
    }

    // 4. LOG ACCESS (Optional but recommended)
    await supabase.from('subscription_logs').insert({
        subscription_id: license.id,
        action: 'LICENSED_AUTH',
        details: { ip: request.headers.get('x-forwarded-for'), terminal: 'MT5' }
    });

    // 5. SUCCESS: AUTHORIZE EXECUTION
    return NextResponse.json({ 
        status: 'AUTHORIZED',
        expires_at: license.expires_at,
        server_time: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Handshake Logic Failure:', err.message);
    return NextResponse.json({ status: 'INTERNAL_FAULT' }, { status: 500 });
  }
}
