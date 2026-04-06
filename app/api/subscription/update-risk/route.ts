import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  const { subscriptionId, engineMode, engineValue, leverageOverride, baseBalance, drawdownThreshold } = await request.json();

  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing Subscription ID' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('user_strategies')
      .update({ 
        engine_mode: engineMode,
        engine_value: engineValue,
        leverage_override: leverageOverride,
        base_balance: baseBalance,
        drawdown_threshold: drawdownThreshold,
        is_paused: false, // Reset pause on update/resume
        last_kill_reason: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Log the risk update event
    await supabase.from('subscription_logs').insert({
        subscription_id: subscriptionId,
        action: 'SIGNAL_INGESTED',
        details: { 
          status: 'RISK_PROTOCOL_UPDATED', 
          engine_mode: engineMode, 
          engine_value: engineValue, 
          leverage_override: leverageOverride,
          base_balance: baseBalance,
          drawdown_threshold: drawdownThreshold,
          timestamp: new Date().toISOString() 
        }
    });

    return NextResponse.json({ success: true, status: 'RISK_PROTOCOL_UPDATED' });

  } catch (err: any) {
    console.error('Update Risk Error:', err.message);
    return NextResponse.json({ error: 'Failed to update risk protocol' }, { status: 500 });
  }
}
