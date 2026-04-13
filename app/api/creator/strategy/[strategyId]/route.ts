import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { strategyId: string } }
) {
  try {
    const supabase = createClient();
    const strategyId = params.strategyId;
    const body = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify ownership/permissions
    const { data: strategy, error: fetchError } = await supabase
      .from('strategies')
      .select('creator_id')
      .eq('id', strategyId)
      .single();

    if (fetchError || !strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    // Check if the user is the creator (need to map creator_id to profile.id first)
    const { data: profile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!profile || strategy.creator_id !== profile.id) {
        // Allow admin if needed, but for now strict owner
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Prepare Updates
    const updates: any = {};
    if (body.name) updates.name = body.name;
    if (body.description) updates.description = body.description;
    if (body.monthly_price_inr !== undefined) {
        updates.monthly_price_inr = body.monthly_price_inr;
        updates.tier = body.monthly_price_inr > 0 ? 'PAID' : 'FREE';
    }
    if (body.script_code) updates.script_code = body.script_code;
    if (body.video_url) updates.video_url = body.video_url;
    if (body.screenshot_urls && Array.isArray(body.screenshot_urls)) {
        updates.screenshot_urls = body.screenshot_urls.filter((u: string) => u);
        if (updates.screenshot_urls.length > 0) {
            updates.thumbnail_url = updates.screenshot_urls[0];
        }
    }

    // 3. Update
    const { error: updateError } = await supabase
      .from('strategies')
      .update(updates)
      .eq('id', strategyId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e: any) {
    console.error('Update Critical Error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { strategyId: string } }
) {
  try {
    const supabase = createClient();
    const strategyId = params.strategyId;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify ownership
    const { data: strategy, error: fetchError } = await supabase
      .from('strategies')
      .select('creator_id')
      .eq('id', strategyId)
      .single();

    if (fetchError || !strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!profile || strategy.creator_id !== profile.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Permanent Deletion Cleanup
    // Deleting the strategy should trigger cascades if configured, 
    // but we'll manually ensure user_strategies are cleared to be safe
    const { error: subDeleteError } = await supabase
        .from('user_strategies')
        .delete()
        .eq('strategy_id', strategyId);

    if (subDeleteError) {
        console.error('Subscription Cleanup Error:', subDeleteError);
        // We continue anyway as we want to purge the strategy if possible
    }

    const { error: deleteError } = await supabase
      .from('strategies')
      .delete()
      .eq('id', strategyId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e: any) {
    console.error('Delete Critical Error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
