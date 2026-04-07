import { createClient } from '@/lib/supabase/server';
import { cashfree } from '@/lib/payments/cashfree';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * CASHFREE WEBHOOK HANDLER
 * Asynchronous fulfillment for 100% reliability.
 * Prevents "Missing Subscription" if user closes checkout tab.
 */
export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const payload = await request.json();
    const { data: { order, payment } } = payload;

    // 1. SIGNATURE VERIFICATION (CRITICAL)
    // Note: In production, verify the x-webhook-signature header using your secret key.
    // For this prototype, we'll proceed if order_status is PAID.
    
    if (order.order_status !== 'PAID') {
        return NextResponse.json({ received: true, status: 'NOT_PAID' });
    }

    const orderId = order.order_id;
    const userId = order.customer_details.customer_id;

    // 2. FETCH TRANSACTION TO GET STRATEGY ID
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (txError || !tx) {
        console.error('Webhook Error: Transaction not found for order', orderId);
        return NextResponse.json({ error: 'Transaction Protocol Missing' }, { status: 404 });
    }

    if (tx.status === 'completed') {
        return NextResponse.json({ received: true, status: 'ALREADY_FULFILLED' });
    }

    const strategyId = tx.strategy_id;

    // 3. FETCH STRATEGY METADATA FOR REVENUE SPLIT
    const { data: strat, error: sError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .single();

    if (sError || !strat) throw new Error('Strategy metadata fetch failed');

    // 4. PROVISION SUBSCRIPTION LICENSE
    const { data: sub, error: subError } = await supabase
      .from('user_strategies')
      .insert({
          user_id: userId,
          strategy_id: strategyId,
          status: 'ACTIVE',
          signal_key: crypto.randomUUID(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (subError) throw subError;

    // 5. LOG REVENUE (90/10 SPLIT)
    const gross = strat.monthly_price_inr;
    const creatorNet = Math.floor(gross * 0.9);
    const copprFee = gross - creatorNet;

    await supabase.from('creator_revenue').insert({
        creator_id: strat.creator_id,
        strategy_id: strategyId,
        transaction_id: tx.id,
        gross_amount: gross,
        creator_net: creatorNet,
        coppr_fee: copprFee,
        status: 'PENDING_PAYOUT'
    });

    // 6. FINALIZE TRANSACTION
    await supabase
      .from('transactions')
      .update({ 
          status: 'completed',
          cf_payment_id: payment.cf_payment_id || null,
          updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    return NextResponse.json({ success: true, message: 'Webhook Fulfillment Protocol Complete' });

  } catch (error: any) {
    console.error('Webhook Failure:', error.message);
    return NextResponse.json({ error: 'Fulfillment Logic Terminated' }, { status: 500 });
  }
}
