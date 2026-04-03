import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { StrategyNodeManager } from '@/lib/services/StrategyNodeManager';

export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Authenticate Creator
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized. Please login to manage nodes.' }, { status: 401 });
  }

  try {
    const { strategyId } = await request.json();

    if (!strategyId) {
      return NextResponse.json({ error: 'Missing strategyId' }, { status: 400 });
    }

    // 2. Authorization: Verify ownership
    const { data: strategy, error: sError } = await supabase
      .from('strategies')
      .select('creator_id, creator_profiles(user_id)')
      .eq('id', strategyId)
      .single();

    if (sError || !strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    // Access strategy.creator_profiles.user_id via type casting as Supabase type generation may vary
    const ownerUserId = (strategy.creator_profiles as any)?.user_id;

    if (ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized. You do not own this strategy.' }, { status: 403 });
    }

    // 3. Trigger Activation Sequence
    const result = await StrategyNodeManager.activateNode(strategyId);

    if (result.success) {
      return NextResponse.json({ 
        message: result.message,
        status: 'STARTING' 
      });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

  } catch (err: any) {
    console.error('[API/ActivateNode] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 });
  }
}
