import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  const { subscriptionId, active } = await request.json();

  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing Subscription ID' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('user_strategies')
      .update({ sync_active: active })
      .eq('id', subscriptionId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Log the toggle event
    await supabase.from('subscription_logs').insert({
        subscription_id: subscriptionId,
        action: active ? 'SIGNAL_PROPAGATED' : 'SIGNAL_INGESTED', // Placeholder actions for tracking toggle
        details: { status: active ? 'SYNC_ENABLED' : 'SYNC_DISABLED', timestamp: new Date().toISOString() }
    });

    return NextResponse.json({ success: true, status: active ? 'ENABLED' : 'DISABLED' });

  } catch (err: any) {
    console.error('Toggle Sync Error:', err.message);
    return NextResponse.json({ error: 'Failed to toggle sync' }, { status: 500 });
  }
}
