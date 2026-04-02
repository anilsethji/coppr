import { createClient } from '@/lib/supabase/server';
import { cashfree } from '@/lib/payments/cashfree';
import { NextResponse } from 'next/server';

/**
 * STRATEGY CHECKOUT HANDLER
 * Creates a secure Cashfree session for Triple-Tier Strategy access.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Auth Required for License Deployment' }, { status: 401 });
  }

  const { strategyId, customerName, customerEmail, customerPhone } = await request.json();

  try {
    // 1. FETCH STRATEGY METADATA (Server-side price verification)
    const { data: strat, error: sError } = await supabase
      .from('strategies')
      .select('id, name, monthly_price_inr, tier, status')
      .eq('id', strategyId)
      .single();

    if (sError || !strat || strat.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Strategy Protocol Unavailable' }, { status: 404 });
    }

    if (strat.tier === 'FREE') {
        return NextResponse.json({ error: 'Direct Activation Required for Free Access' }, { status: 400 });
    }

    // 2. GENERATE A UNIQUE ORDER ID
    const orderId = `order_${Date.now()}_${user.id.slice(0, 8)}`;

    // 3. CREATE ORDER IN CASHFREE
    const cfResponse = await cashfree.post('/orders', {
      order_id: orderId,
      order_amount: strat.monthly_price_inr,
      order_currency: 'INR',
      customer_details: {
        customer_id: user.id,
        customer_name: customerName || user.user_metadata?.full_name || 'Trader',
        customer_email: customerEmail || user.email,
        customer_phone: customerPhone || '9999999999',
      },
      order_meta: {
        return_url: `${new URL(request.url).origin}/checkout/success?order_id={order_id}&strategy_id=${strat.id}`,
        notify_url: `${new URL(request.url).origin}/api/webhook/cashfree`,
        payment_methods: 'cc,dc,nb,upi',
      },
      order_note: `Subscription: ${strat.name}`,
    });

    const orderData = cfResponse.data;

    // 4. STORE TRANSACTION AS 'PENDING'
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        order_id: orderId,
        strategy_id: strat.id,
        amount: strat.monthly_price_inr,
        status: 'pending',
      });

    return NextResponse.json({ 
      payment_session_id: orderData.payment_session_id,
      order_id: orderId
    }, { status: 200 });

  } catch (error: any) {
    console.error('Cashfree Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
