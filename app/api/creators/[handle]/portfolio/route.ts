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
    const { data: creator, error: cError } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('handle', handle)
      .single();

    if (cError || !creator) throw new Error('Creator Protocol Not Found');

    // 2. Fetch all Strategies for this creator
    const { data: strategies, error: sError } = await supabase
      .from('strategies')
      .select('*')
      .eq('creator_id', creator.id)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      creator,
      strategies: strategies || []
    });

  } catch (error: any) {
    console.error('Creator Portfolio API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
