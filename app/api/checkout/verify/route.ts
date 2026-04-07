import { createClient } from '@/lib/supabase/server';
import { cashfree } from '@/lib/payments/cashfree';
import { NextResponse } from 'next/server';

/**
 * CHECKOUT VERIFICATION & FULFILLMENT
 * Confirms payment success and provisions the strategy license.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  const { orderId, strategyId } = await request.json();

  try {
    // 1. VERIFY ORDER WITH CASHFREE
    const cfResponse = await cashfree.get(`/orders/${orderId}`);
    const order = cfResponse.data;

    if (order.order_status !== 'PAID' && order.order_status !== 'SUCCESS') {
        return NextResponse.json({ status: 'PENDING_OR_FAILED', cf_status: order.order_status });
    }

    // 2. CHECK IF ALREADY FULFILLED (Idempotency)
    const { data: existing } = await supabase
      .from('user_strategies')
      .select('id')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .single();

    if (existing) {
        return NextResponse.json({ status: 'ALREADY_FULFILLED' });
    }

    // 3. FETCH STRATEGY METADATA FOR INHERITANCE
    const { data: strat, error: sError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .single();

    if (sError || !strat) throw new Error('Strategy metadata fetch failed');

    // 4. FETCH TRANSACTION ID FOR LEDGER SYNC
    const { data: tx } = await supabase
      .from('transactions')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle();

    // 5. TRANSACTION SUCCESS -> PROVISION LICENSE
    const { data: sub, error: fulfillmentError } = await supabase
      .from('user_strategies')
      .insert({
          user_id: user.id,
          strategy_id: strategyId,
          status: 'ACTIVE',
          signal_key: crypto.randomUUID(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Days
          mt5_account_number: null, // User must link in Vault/Success Page
      })
      .select()
      .single();

    if (fulfillmentError) throw fulfillmentError;

    // 6. ECONOMIC ENGINE: CALCULATE REVENUE SPLIT (90/10 - CONFIRMED)
    const gross = strat.monthly_price_inr;
    const creatorNet = Math.floor(gross * 0.9);
    const copprFee = gross - creatorNet;

    const { error: revenueError } = await supabase
      .from('creator_revenue')
      .insert({
          creator_id: strat.creator_id,
          strategy_id: strategyId,
          transaction_id: tx?.id,
          gross_amount: gross,
          creator_net: creatorNet,
          coppr_fee: copprFee,
          status: 'PENDING_PAYOUT'
      });

    if (revenueError) console.error('Revenue Ledger Sync Failed:', revenueError.message);

    // 7. UPDATE TRANSACTION STATUS
    await supabase
      .from('transactions')
      .update({ 
          status: 'completed',
          cf_payment_id: order.cf_order_id || null, // Best effort capture
          updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    return NextResponse.json({ 
      status: 'SUCCESSFUL_FULFILLMENT',
      strategy_name: strat.name,
      subscriptionId: sub.id
    });

  } catch (error: any) {
    console.error('Verification Error:', error.message);
    return NextResponse.json({ error: 'Fulfillment Logic Failed' }, { status: 500 });
  }
}
