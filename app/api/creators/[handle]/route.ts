import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;
  const supabase = createClient();

  try {
    // 1. Fetch Creator Profile
    const { data: creator, error: creatorError } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('handle', handle)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // 2. Fetch Active Public Strategies for this creator
    const { data: strategies, error: stratError } = await supabase
      .from('strategies')
      .select('id, name, type, symbol, timeframe, win_rate, total_trades, avg_gain_pct, monthly_price_inr, status, total_subscribers')
      .eq('creator_id', creator.id)
      .eq('status', 'ACTIVE')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      creator,
      strategies: strategies || []
    }, { status: 200 });

  } catch (error: any) {
    console.error('Public Creator API Error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
