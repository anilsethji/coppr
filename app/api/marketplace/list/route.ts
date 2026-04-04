import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // MT5_EA, PINE_SCRIPT_WEBHOOK, INDICATOR
  const sort = searchParams.get('sort') || 'winRate';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9');

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('strategies')
      .select(`
        id, 
        name, 
        type, 
        pair, 
        timeframe, 
        min_lot_size, 
        max_lot_size, 
        monthly_price_inr, 
        is_active,
        theme_color,
        thumbnail_url,
        win_rate,
        total_trades,
        avg_gain_pct,
        created_at,
        creator_id,
        creator_profiles (
          id,
          display_name,
          handle,
          avatar_type,
          avatar_data,
          is_verified
        )
      `)
      .eq('is_active', true)
      .eq('is_public', true);

    if (type && type !== 'All') {
      if (type === 'MT5 EA') query = query.eq('type', 'MT5_EA');
      else if (type === 'Pine Script') query = query.eq('type', 'PINE_SCRIPT_WEBHOOK');
      else if (type === 'Indicators') query = query.eq('type', 'INDICATOR');
      else if (type === 'Coppr Official') query = query.eq('is_official', true);
    }

    if (sort === 'newest') query = query.order('created_at', { ascending: false });
    // Fallback for missing performance columns in sort
    else query = query.order('created_at', { ascending: false });

    const { data: strategies, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      strategies: strategies || [],
      total: count || 0,
      hasMore: (strategies?.length || 0) === limit
    }, { status: 200 });

  } catch (error: any) {
    console.error('Marketplace List Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 });
  }
}
