import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * DIRECT ACTIVATION HANDSHAKE
 * Provisions a license for a FREE strategy without requiring a payment gateway.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  const { strategyId } = await request.json();

  if (!strategyId) {
    return NextResponse.json({ error: 'Missing strategy ID' }, { status: 400 });
  }

  try {
    // 1. FETCH STRATEGY METADATA & VERIFY TIER
    const { data: strat, error: sError } = await supabase
      .from('strategies')
      .select('id, name, tier, status')
      .eq('id', strategyId)
      .single();

    if (sError || !strat) {
        return NextResponse.json({ error: 'Strategy Protocol Unavailable' }, { status: 404 });
    }

    if (strat.tier !== 'FREE') {
        return NextResponse.json({ error: 'Checkout Required for Premium Assets' }, { status: 403 });
    }

    // 2. CHECK IF ALREADY FULFILLED (Idempotency)
    const { data: existing } = await supabase
      .from('user_strategies')
      .select('id')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .single();

    if (existing) {
        return NextResponse.json({ 
          status: 'ALREADY_ACTIVE',
          subscriptionId: existing.id
        });
    }

    // 3. PROVISION LICENSE
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: sub, error: fulfillmentError } = await supabaseAdmin
      .from('user_strategies')
      .insert({
          user_id: user.id,
          strategy_id: strategyId,
          status: 'ACTIVE',
          signal_key: crypto.randomUUID(),
          mt5_account_number: null, 
      })
      .select()
      .single();

    if (fulfillmentError) throw fulfillmentError;

    return NextResponse.json({ 
      status: 'ACTIVATION_SUCCESSFUL',
      strategy_name: strat.name,
      subscriptionId: sub.id
    });

  } catch (error: any) {
    console.error('Direct Activation Error:', error);
    return NextResponse.json({ error: 'Fulfillment Handshake Failed', details: error }, { status: 500 });
  }
}
