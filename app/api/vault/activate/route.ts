import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * MT5 ACCOUNT ACTIVATION
 * Links a MetaTrader 5 account ID to a subscription.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  const { subscriptionId, mt5Account } = await request.json();

  if (!subscriptionId || !mt5Account) {
    return NextResponse.json({ error: 'Missing activation parameters' }, { status: 400 });
  }

  try {
    // 1. VERIFY OWNERSHIP OF SUBSCRIPTION
    const { data: sub, error: subError } = await supabase
      .from('user_strategies')
      .select('id, user_id')
      .eq('id', subscriptionId)
      .single();

    if (subError || !sub || sub.user_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized or invalid subscription' }, { status: 403 });
    }

    // 2. ACTIVATE ACCOUNT
    const { error: updateError } = await supabase
      .from('user_strategies')
      .update({ mt5_account_number: mt5Account })
      .eq('id', subscriptionId);

    if (updateError) throw updateError;

    return NextResponse.json({ status: 'ACTIVATION_SUCCESSFUL' });

  } catch (err: any) {
    console.error('Activation Logic Error:', err.message);
    return NextResponse.json({ error: 'Activation handshake failed' }, { status: 500 });
  }
}
