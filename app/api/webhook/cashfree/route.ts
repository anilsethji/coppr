import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-webhook-signature');
  const timestamp = request.headers.get('x-webhook-timestamp');

  // 1. VERIFY SIGNATURE (Security)
  const secretKey = process.env.CASHFREE_SECRET_KEY!;
  const rawSignature = timestamp + body;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('base64');

  if (signature !== expectedSignature) {
    console.error('Invalid Webhook Signature');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = JSON.parse(body);
  const { data: { order, payment } } = payload;
  const supabase = createClient();

  // 2. CHECK PAYMENT STATUS
  if (payment.payment_status === 'SUCCESS') {
    const orderId = order.order_id;
    const amount = order.order_amount;
    const customerEmail = payload.customer_details?.customer_email || payload.data?.customer_details?.customer_email;

    // 3. UPDATE TRANSACTIONS TABLE
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .update({ 
        status: 'paid', 
        payment_method: payment.payment_group 
      })
      .eq('order_id', orderId)
      .select('user_id, amount')
      .single();

    // 4. STRATEGY MODE (order_id starts with strategy_)
    if (orderId.startsWith('strategy_')) {
      const parts = orderId.split('_');
      const strategyId = parts[1]; // order_strategyId_timestamp
      
      const userId = transaction?.user_id;
      if (userId) {
        // A. Activate Strategy Subscription
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        await supabase.from('user_strategies').upsert({
          user_id: userId,
          strategy_id: strategyId,
          status: 'ACTIVE',
          current_period_end: expiryDate.toISOString()
        });

        // B. Record Creator Earnings (70/30 Split)
        const { data: strat } = await supabase
          .from('strategies')
          .select('creator_id')
          .eq('id', strategyId)
          .single();

        if (strat?.creator_id) {
          await supabase.from('creator_earnings').insert({
            creator_id: strat.creator_id,
            strategy_id: strategyId,
            amount: amount * 0.7, // 70% to creator
            status: 'PENDING_PAYOUT',
            payment_order_id: orderId
          });
        }

        // C. Trigger VPS Auto-Follow (MT5 Terminal)
        // Note: Replace with your actual VPS URL
        try {
            await fetch('https://vps-bridge.coppr.in/mt5-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.VPS_INTERNAL_KEY}` },
                body: JSON.stringify({
                    action: 'START_FOLLOW',
                    userId: userId,
                    strategyId: strategyId,
                    orderId: orderId,
                    broker: 'MT5' // Simplified
                })
            });
        } catch (vpsError) {
            console.error('VPS Trigger Failed:', vpsError);
        }
      }
    } else {
      // 5. BASE SUBSCRIPTION MODE (Original Logic)
      if (customerEmail) {
        await supabase.from('pre_paid_customers').upsert({
          email: customerEmail,
          order_id: orderId,
          amount: amount,
          status: 'paid'
        });
      }

      if (transaction?.user_id) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_expiry: expiryDate.toISOString(),
          })
          .eq('id', transaction.user_id);
      }
    }
  }

  return NextResponse.json({ status: 'OK' }, { status: 200 });
}
