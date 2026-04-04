import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { StrategyNodeManager } from '@/lib/services/StrategyNodeManager';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { strategyId, action } = await req.json();

    if (!strategyId || !action) {
      return NextResponse.json({ error: 'Missing strategyId or action' }, { status: 400 });
    }

    // Security Check: Ensure the user owns the strategy (creator_id -> profiles -> user_id)
    const { data: strategy, error: sError } = await supabase
      .from('strategies')
      .select('*, profiles:creator_id(user_id)')
      .eq('id', strategyId)
      .single();

    if (sError || !strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    // Handle nested relationship check
    const creatorUserId = (strategy.profiles as any)?.user_id;
    if (creatorUserId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this strategy' }, { status: 403 });
    }

    if (action === 'START') {
      const result = await StrategyNodeManager.activateNode(strategyId);
      return NextResponse.json(result);
    } else if (action === 'STOP') {
      await StrategyNodeManager.stopNode(strategyId);
      return NextResponse.json({ success: true, message: 'Node termination sequence initiated.' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (err: any) {
    console.error('[NodeAPI] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
