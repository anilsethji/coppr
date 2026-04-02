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
    // 1. Fetch Subscription
    const { data: sub, error: subError } = await supabase
      .from('user_strategies')
      .select('id, status, type:strategies(type)')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .single();

    if (subError || !sub || sub.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const host = process.env.NEXT_PUBLIC_APP_URL || 'https://coppr.in';
    const webhookUrl = `${host}/api/bridge/${sub.id}`;

    return NextResponse.json({ 
        webhookUrl,
        type: (sub.type as any)?.type || (sub.type as any)[0]?.type 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Bridge Metadata Error' }, { status: 500 });
  }
}
