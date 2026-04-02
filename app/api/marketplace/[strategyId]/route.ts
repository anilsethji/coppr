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
          avatar_data,
          is_verified,
          verified_label,
          total_subscribers,
          follower_count
        )
      `)
      .eq('id', strategyId)
      .single();

    if (stratError || !strategy) throw new Error('Strategy not found');

    // 2. Fetch Last 20 Signal Logs
    const { data: logs, error: logsError } = await supabase
      .from('signal_logs')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('timestamp', { ascending: false })
      .limit(20);

    // 3. Fetch Review Stats
    const { data: reviews, error: revError } = await supabase
      .from('strategy_reviews')
      .select('rating')
      .eq('strategy_id', strategyId);

    const reviewCount = reviews?.length || 0;
    const avgRating = reviewCount > 0 
      ? reviews!.reduce((acc, r) => acc + r.rating, 0) / reviewCount 
      : 0;

    // 4. PERFORMANCE BY WEEK (Mock data or aggregation logic)
    // For now, returning a sample set for the chart
    const performanceByWeek = [
      { week: 'W1', gain: 2.1 },
      { week: 'W2', gain: 3.5 },
      { week: 'W3', gain: -1.2 },
      { week: 'W4', gain: 4.8 },
    ];

    return NextResponse.json({
      strategy,
      logs: logs || [],
      reviewCount,
      avgRating,
      performanceByWeek
    }, { status: 200 });

  } catch (error: any) {
    console.error('Strategy Detail API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
