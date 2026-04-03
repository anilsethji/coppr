import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * BROKER ACCOUNT LINKING
 * Securely stores broker credentials and links them to user profile.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  const { subscriptionId, brokerType, accountId, apiKey, apiSecret } = await request.json();

  if (!subscriptionId || !brokerType || !accountId) {
    return NextResponse.json({ error: 'Missing connection parameters' }, { status: 400 });
  }

  try {
    // 1. Create or Update Broker Account
    const { data: broker, error: brokerError } = await supabase
      .from('broker_accounts')
      .upsert({
          user_id: user.id,
          broker_type: brokerType,
          account_id: accountId,
          api_key: apiKey,
          api_secret: apiSecret
      }, { onConflict: 'user_id, broker_type, account_id' })
      .select()
      .single();

    if (brokerError) throw brokerError;

    // 2. Link Broker Account to Subscription
    const { error: linkError } = await supabase
      .from('user_strategies')
      .update({ 
          broker_account_id: broker.id,
          sync_active: true,
          mt5_account_number: brokerType === 'MT5' ? accountId : null
      })
      .eq('id', subscriptionId)
      .eq('user_id', user.id);

    if (linkError) throw linkError;

    return NextResponse.json({ 
        status: 'CONNECTION_SUCCESSFUL',
        broker_id: broker.id
    });

  } catch (err: any) {
    console.error('Broker Connection Error:', err.message);
    return NextResponse.json({ error: 'Broker handshake failed' }, { status: 500 });
  }
}
