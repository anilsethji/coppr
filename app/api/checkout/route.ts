import { createClient } from '@/lib/supabase/server';
import { cashfree } from '@/lib/payments/cashfree';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { planId, amount, customerName, customerEmail, customerPhone } = await request.json();

  // 1. GENERATE A UNIQUE ORDER ID
  const orderId = `order_${Date.now()}_${(user?.id || 'guest').slice(0, 8)}`;

  try {
    // 2. CREATE ORDER IN CASHFREE
    const cfResponse = await cashfree.post('/orders', {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: user?.id || `guest_${customerEmail?.replace(/[@.]/g, '_')}`,
        customer_name: customerName || user?.user_metadata?.full_name || 'Customer',
        customer_email: customerEmail || user?.email,
        customer_phone: customerPhone || '9999999999',
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
        user_id: user?.id || null, // Allow NULL for guests
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
