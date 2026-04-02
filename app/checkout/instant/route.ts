import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * INSTANT ACTIVATION (FREE PRODUCTS)
 * Provision a strategy license for Free-Tier products without checkout.
 */
export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const strategyId = searchParams.get('strategy_id');

  if (!strategyId) {
    return NextResponse.json({ error: 'Strategy identification required' }, { status: 400 });
  }

  try {
    // 1. VERIFY STRATEGY & TIER
    const { data: strat, error: sError } = await supabase
      .from('strategies')
      .select('id, name, tier, status')
      .eq('id', strategyId)
      .single();

    if (sError || !strat) {
        return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    if (strat.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Protocol offline' }, { status: 403 });
    }

    if (strat.tier !== 'FREE') {
        return NextResponse.json({ error: 'Financial handshake required for this product' }, { status: 400 });
    }

    // 2. CHECK IF ALREADY OWNED
    const { data: existing } = await supabase
      .from('user_strategies')
      .select('id')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .single();

    if (existing) {
        return NextResponse.redirect(new URL('/dashboard/bots', request.url));
    }

    // 3. PROVISION LICENSE
    const { error: fulfillmentError } = await supabase
      .from('user_strategies')
      .insert({
        user_id: user.id,
        strategy_id: strategyId,
        status: 'ACTIVE',
        signal_key: crypto.randomUUID(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 365 Days for Free tools
      });

    if (fulfillmentError) throw fulfillmentError;

    // 4. REDIRECT TO VAULT
    return NextResponse.redirect(new URL('/dashboard/bots?new_activation=true', request.url));

  } catch (error: any) {
    console.error('Instant Activation Error:', error.message);
    return NextResponse.json({ error: 'Handshake Failed' }, { status: 500 });
  }
}
