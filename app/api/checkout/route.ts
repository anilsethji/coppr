import { createClient } from '@/lib/supabase/server';
import { cashfree } from '@/lib/payments/cashfree';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId, amount, customerName, customerPhone } = await request.json();

  // 1. GENERATE A UNIQUE ORDER ID
  const orderId = `order_${Date.now()}_${user.id.slice(0, 8)}`;

  try {
    // 2. CREATE ORDER IN CASHFREE
    const cfResponse = await cashfree.post('/orders', {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: user.id,
        customer_name: customerName || user.user_metadata.full_name || 'Customer',
        customer_email: user.email,
        customer_phone: customerPhone || '9999999999', // Default if missing
      },
      order_meta: {
        return_url: `${new URL(request.url).origin}/dashboard?order_id={order_id}`,
        notify_url: `${new URL(request.url).origin}/api/webhook/cashfree`,
        payment_methods: 'cc,dc,nb,upi',
      },
      order_note: `Subscription for ${planId}`,
    });

    const orderData = cfResponse.data;

    // 3. STORE TRANSACTION AS 'PENDING' IN SUPABASE
    const { error: dbError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        order_id: orderId,
        amount: amount,
        status: 'pending',
      });

    if (dbError) {
      console.error('Database Error:', dbError);
    }

    return NextResponse.json({ 
      payment_session_id: orderData.payment_session_id,
      order_id: orderId
    }, { status: 200 });

  } catch (error: any) {
    console.error('Cashfree Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
