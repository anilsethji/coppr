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

  const { subscriptionId, brokerType, accountId, apiKey, apiSecret, meta, activeAssets } = await request.json();

  if (!brokerType || !accountId) {
    return NextResponse.json({ error: 'Missing connection parameters' }, { status: 400 });
  }

  try {
    // 1. MANUAL UPSERT: Check if account already exists
    const { data: existingAccount } = await supabase
      .from('broker_accounts')
      .select('id')
      .eq('account_id', accountId)
      .single();

    let brokerId;
    if (existingAccount) {
        // Update existing
        const { data: updated, error: updateError } = await supabase
            .from('broker_accounts')
            .update({
                api_key: apiKey,
                api_secret: apiSecret,
                meta: meta || {}
            })
            .eq('id', existingAccount.id)
            .select()
            .single();
        
        if (updateError) throw updateError;
        brokerId = updated.id;
    } else {
        // Insert new
        const { data: inserted, error: insertError } = await supabase
            .from('broker_accounts')
            .insert({
                user_id: user.id,
                broker_type: brokerType,
                account_id: accountId,
                api_key: apiKey,
                api_secret: apiSecret,
                meta: meta || {}
            })
            .select()
            .single();
        
        if (insertError) throw insertError;
        brokerId = inserted.id;
    }

    const broker = { id: brokerId }; // Mock for subsequent logic

    // 2. Link Broker Account to Subscription if provided
    if (subscriptionId) {
      const { error: linkError } = await supabase
        .from('user_strategies')
        .update({ 
            broker_account_id: broker.id,
            sync_active: true,
            active_assets: activeAssets || [],
            mt5_account_number: brokerType === 'MT5' ? accountId : null
        })
        .eq('id', subscriptionId)
        .eq('user_id', user.id);

      if (linkError) {
          console.error('Handshake Link Error:', linkError.message);
          return NextResponse.json({ 
              error: `Handshake Failed: ${linkError.message}`,
              details: linkError
          }, { status: 400 });
      }
    }

    return NextResponse.json({ 
        status: 'CONNECTION_SUCCESSFUL',
        broker_id: broker.id,
        linked: !!subscriptionId
    });

  } catch (err: any) {
    console.error('Broker Connection Exception:', err.message);
    return NextResponse.json({ error: `System Exception: ${err.message}` }, { status: 500 });
  }
}
