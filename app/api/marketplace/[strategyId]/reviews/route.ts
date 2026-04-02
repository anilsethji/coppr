import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { strategyId: string } }
) {
  const { strategyId } = params;
  const supabase = createClient();

  try {
    const { data: reviews, error } = await supabase
      .from('strategy_reviews')
      .select(`
        id,
        rating,
        review_text,
        created_at,
        user_id
        -- We'd join profiles here to get first names
      `)
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Anonymize user_id to "First Name + Initial" for the UI (Mocking logic here)
    const formattedReviews = (reviews || []).map((r: any) => ({
      ...r,
      userName: "Trader " + (r.user_id ? r.user_id.slice(0, 4) : "Anon")
    }));

    return NextResponse.json(formattedReviews, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { strategyId: string } }
) {
  const { strategyId } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rating, reviewText } = await request.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Valid rating (1-5) required' }, { status: 400 });
  }

  try {
    // 1. Verify Active Subscription
    const { data: sub, error: subError } = await supabase
      .from('user_strategies')
      .select('status')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .eq('status', 'ACTIVE')
      .single();

    if (subError || !sub) {
        return NextResponse.json({ error: 'Only active subscribers can leave reviews' }, { status: 403 });
    }

    // 2. Upsert Review
    const { error: revError } = await supabase
      .from('strategy_reviews')
      .upsert({
        user_id: user.id,
        strategy_id: strategyId,
        rating,
        review_text: reviewText
      }, { onConflict: 'user_id,strategy_id' });

    if (revError) throw revError;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
