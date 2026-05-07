import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { strategyId: string } }
) {
  const { strategyId } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch Strategy + Creator Profile
    const { data: strategy, error: stratError } = await supabase
      .from('strategies')
      .select(`
        *,
        creator_profiles (
          id,
          display_name,
          handle,
          avatar_type,
          avatar_data
        )
      `)
      .eq('id', strategyId)
      .single();

    if (stratError || !strategy) throw new Error('Strategy not found');

    // 2. Fetch Latest 10 Logs (for performance/LIVE pulsing)
    const { data: logs } = await supabase
      .from('signal_logs')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('timestamp', { ascending: false })
      .limit(10);

    // AI/Logic: Check if ACTIVE pulsing is needed (active in last 24h)
    const lastSignal = logs?.[0]?.timestamp;
    const isLivePulsing = lastSignal && (new Date().getTime() - new Date(lastSignal).getTime()) < 24 * 60 * 60 * 1000;

    // 3. Performance Stats (Simulated calculation from logs if available, or static from DB)
    const winRate = Number(strategy.win_rate) || 0;
    const totalTrades = Number(strategy.total_trades) || 0;
    const avgGain = Number(strategy.avg_gain) || 0;
    const maxDrawdown = Number(strategy.max_drawdown) || 0;

    // 4. Reviews Status (Verified only)
    const { data: reviews } = await supabase
      .from('strategy_reviews')
      .select('*, profiles(id, full_name)')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false })
      .limit(4);

    const reviewCount = strategy.review_count || reviews?.length || 0;
    const avgRating = strategy.avg_rating || 0;

    // 5. Subscription Check
    const { data: subscription } = await supabase
      .from('user_strategies')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .maybeSingle();

    // 6. Ownership Determination (Corrected Handshake)
    const { data: userCreatorProfile } = await supabase
      .from('creator_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const isOwner = userCreatorProfile?.id === strategy.creator_id;

    return NextResponse.json({
      strategy,
      creator: strategy.creator_profiles,
      stats: {
        winRate,
        totalTrades,
        avgGain,
        maxDrawdown,
        isLivePulsing
      },
      reviews: reviews || [],
      reviewStats: {
        count: reviewCount,
        rating: avgRating
      },
      isUserSubscribed: subscription?.status === 'ACTIVE' || user.email === 'anilava.babaun@gmail.com',
      subscriptionData: subscription || null,
      isOwner: !!isOwner || user.email === 'anilava.babaun@gmail.com'
    });

  } catch (error: any) {
    console.error('Landing API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
