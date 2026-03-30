import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-webhook-signature');
  const timestamp = request.headers.get('x-webhook-timestamp');

  // 1. VERIFY SIGNATURE (Security)
  // Cashfree uses a specific signature for webhooks: HMAC-SHA256
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

    // 3. GET CUSTOMER EMAIL (For Guest Payments)
    const customerEmail = payload.customer_details?.customer_email || payload.data?.customer_details?.customer_email;

    // 4. UPDATE TRANSACTIONS TABLE
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .update({ 
        status: 'paid', 
        payment_method: payment.payment_group 
      })
      .eq('order_id', orderId)
      .select('user_id')
      .single();

    // 5. RECORD GUEST PAYMENT (For Frictionless Activation)
    if (customerEmail) {
      console.log('📝 Recording guest payment for:', customerEmail);
      await supabase.from('pre_paid_customers').upsert({
        email: customerEmail,
        order_id: orderId,
        amount: amount,
        status: 'paid'
      });
    }

    // 6. ACTIVATE USER PROFILE (If already registered)
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

  return NextResponse.json({ status: 'OK' }, { status: 200 });
}
