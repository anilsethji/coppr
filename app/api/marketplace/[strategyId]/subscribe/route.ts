import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { strategyId: string } }
) {
  const { strategyId } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  try {
    // 1. Check if strategy exists and is public/active
    const { data: strategy, error: stratError } = await supabase
      .from('strategies')
      .select('id, name, type, creator_id, origin, status')
      .eq('id', strategyId)
      .or(`origin.eq.MARKETPLACE,creator_id.eq.${user.id},origin.eq.OFFICIAL`)
      .single();

    if (stratError || !strategy) {
      return NextResponse.json({ error: 'Alpha Protocol not found or deactivated.' }, { status: 404 });
    }

    if (strategy.status !== 'ACTIVE' && strategy.creator_id !== user.id) {
       return NextResponse.json({ error: 'This strategy is currently in PENDING review or deactivated.' }, { status: 403 });
    }

    // 2. Check for existing subscription
    const { data: existing } = await supabase
      .from('user_strategies')
      .select('id')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Already subscribed to this node alpha' }, { status: 400 });
    }

    // 3. Create Subscription Node
    const { data: subscription, error: subError } = await supabase
      .from('user_strategies')
      .insert({
        user_id: user.id,
        strategy_id: strategyId,
        status: 'ACTIVE',
        sync_active: false // Wait for broker linking
      })
      .select()
      .single();

    if (subError) throw subError;

    // 4. Log Lifecycle Event
    await supabase.from('subscription_logs').insert({
        subscription_id: subscription.id,
        action: 'SIGNAL_INGESTED',
        details: { 
            event: 'INITIAL_SUBSCRIPTION', 
            strategy_name: strategy.name,
            timestamp: new Date().toISOString() 
        }
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Strategy node initialized successfully',
        subscriptionId: subscription.id 
    });

  } catch (error: any) {
    console.error('Subscription API Error:', error.message);
    return NextResponse.json({ error: 'Failed to initialize strategy node' }, { status: 500 });
  }
}
