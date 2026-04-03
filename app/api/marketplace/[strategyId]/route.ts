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

    // 2. Fetch Last 20 Signal Logs (RESILLIENT)
    let logs = [];
    try {
      const { data: logData, error: logsError } = await supabase
        .from('signal_logs')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('timestamp', { ascending: false })
        .limit(20);
      if (!logsError) logs = logData || [];
    } catch (e) {
      console.warn('Signal logs fetch failed (likely table missing):', e);
    }

    // 3. FETCH REVIEW STATS (RESILLIENT)
    let reviewCount = 0;
    let avgRating = 0;
    try {
      const { data: reviews, error: revError } = await supabase
        .from('strategy_reviews')
        .select('rating')
        .eq('strategy_id', strategyId);

      if (!revError && reviews) {
        reviewCount = reviews.length;
        avgRating = reviewCount > 0 
          ? reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / reviewCount 
          : 0;
      }
    } catch (e) {
      console.warn('Reviews fetch failed (likely table missing):', e);
    }

    // 4. CHECK USER SUBSCRIPTION STATUS
    const { data: subscription, error: subError } = await supabase
      .from('user_strategies')
      .select('id, status, signal_key, mt5_account_number')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .eq('status', 'ACTIVE')
      .maybeSingle();

    // 5. PERFORMANCE BY WEEK (Mock data or aggregation logic)
    const performanceByWeek = [
      { week: 'W1', gain: 2.1 },
      { week: 'W2', gain: 3.5 },
      { week: 'W3', gain: -1.2 },
      { week: 'W4', gain: 4.8 },
    ];

    return NextResponse.json({
      strategy,
      logs: logs,
      reviewCount,
      avgRating,
      performanceByWeek,
      isSubscribed: !!subscription,
      subscriptionData: subscription || null
    }, { status: 200 });

  } catch (error: any) {
    console.error('Strategy Detail API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
