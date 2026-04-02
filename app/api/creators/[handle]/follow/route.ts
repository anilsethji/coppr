import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get Creator ID
    const { data: creator, error: creatorError } = await supabase
      .from('creator_profiles')
      .select('id, follower_count')
      .eq('handle', handle)
      .single();

    if (creatorError || !creator) throw new Error('Creator not found');

    // 2. Check if already following
    const { data: follow, error: followError } = await supabase
      .from('user_creator_follows')
      .select('id')
      .eq('user_id', user.id)
      .eq('creator_id', creator.id)
      .single();

    const isFollowing = !!follow;

    if (isFollowing) {
      // Unfollow
      await supabase
        .from('user_creator_follows')
        .delete()
        .eq('id', follow.id);

      await supabase
        .from('creator_profiles')
        .update({ follower_count: Math.max(0, creator.follower_count - 1) })
        .eq('id', creator.id);

      return NextResponse.json({ following: false });
    } else {
      // Follow
      await supabase
        .from('user_creator_follows')
        .insert({ user_id: user.id, creator_id: creator.id });

      await supabase
        .from('creator_profiles')
        .update({ follower_count: creator.follower_count + 1 })
        .eq('id', creator.id);

      return NextResponse.json({ following: true });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
