import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * CREATOR REVENUE & SUBSCRIBER ANALYTICS
 * Aggregates financial performance for the creator terminal.
 */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  try {
    // 1. FETCH CREATOR PROFILE ID
    const { data: prof, error: pError } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (pError || !prof) {
        return NextResponse.json({ error: 'Creator identity not established' }, { status: 404 });
    }

    // 2. CALC TOTAL EARNINGS (80% NET)
    const { data: revenue, error: rError } = await supabase
      .from('creator_revenue')
      .select('creator_net, gross_amount, status, created_at')
      .eq('creator_id', prof.id);

    if (rError) throw rError;

    const totalEarned = revenue?.reduce((acc, curr) => acc + Number(curr.creator_net), 0) || 0;
    const pendingPayout = revenue?.filter(r => r.status === 'PENDING_PAYOUT')
                            .reduce((acc, curr) => acc + Number(curr.creator_net), 0) || 0;

    // 3. CALC ACTIVE SUBSCRIBERS
    // First fetch all strategy IDs belonging to this creator
    const { data: strategies, error: sFetchError } = await supabase
      .from('strategies')
      .select('id')
      .eq('creator_id', prof.id);

    if (sFetchError) throw sFetchError;
    const strategyIds = (strategies || []).map(s => s.id);

    // Then count active subscriptions for those strategies
    const { count: activeSubs, error: sError } = await supabase
      .from('user_strategies')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'ACTIVE')
      .in('strategy_id', strategyIds);

    if (sError) throw sError;

    return NextResponse.json({
        totalEarned,
        pendingPayout,
        activeSubs: activeSubs || 0,
        recentActivity: revenue?.slice(-5).reverse() || []
    });

  } catch (error: any) {
    console.error('Creator Stats Error:', error.message);
    return NextResponse.json({ error: 'Failed to aggregate financial protocol' }, { status: 500 });
  }
}
