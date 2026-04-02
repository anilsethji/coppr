import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * COPPR MASTER LICENSE GATEKEEPER
 * Handles 'Phone-Home' validation for MT5 EAs and Indicators.
 * Supports FREE (Demo-only) and PAID (Sub-verified) Tiers.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { account, strategyId, token, productType } = payload;

    // 1. Internal Security Handshake
    if (token !== process.env.COPPR_INTERNAL_SECRET) {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    if (!account || !strategyId) {
        return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
    }

    const supabase = createClient();

    // 2. Lookup Strategy Properties
    const { data: strategy, error: sError } = await supabase
        .from('strategies')
        .select('id, tier, status')
        .eq('id', strategyId)
        .single();

    if (sError || !strategy || strategy.status !== 'ACTIVE') {
        return NextResponse.json({ status: 'EXPIRED', reason: 'STRATEGY_INACTIVE' }, { status: 403 });
    }

    // 3. Logic Branch: FREE TIER
    if (strategy.tier === 'FREE') {
        // Free products are authorized immediately. 
        // (Note: The MQL5 client handles the Demo Account check via ACCOUNT_TRADE_MODE)
        return NextResponse.json({ status: 'AUTHORIZED', tier: 'FREE' });
    }

    // 4. Logic Branch: PAID TIER
    // Verify active subscription tied to this MT5 Account Number
    const { data: sub, error: subError } = await supabase
        .from('user_strategies')
        .select('id, status, expires_at')
        .eq('strategy_id', strategyId)
        .eq('mt5_account_number', account)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .single();

    if (subError || !sub) {
        return NextResponse.json({ status: 'EXPIRED', reason: 'PAYMENT_REQUIRED' }, { status: 403 });
    }

    // 5. Access Granted
    return NextResponse.json({ 
        status: 'AUTHORIZED', 
        tier: 'PAID',
        expires_at: sub.expires_at 
    });

  } catch (err: any) {
    console.error('License Check Failure:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
