import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * SECURE STRATEGY DOWNLOADER
 * Generates a 60-second Signed URL for authorized subscribers.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const strategyId = params.id;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  try {
    // 1. VERIFY OWNERSHIP/SUBSCRIPTION
    const { data: sub, error: subError } = await supabase
      .from('user_strategies')
      .select('status, strategy:strategies (id, name, file_path)')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .single();

    if (subError || !sub || sub.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Active subscription not found for this protocol' }, { status: 403 });
    }

    const strategy = sub.strategy as any;
    const filePath = Array.isArray(strategy) ? strategy[0]?.file_path : strategy?.file_path;
    
    if (!filePath) {
        return NextResponse.json({ error: 'Strategic asset file offline or missing' }, { status: 404 });
    }

    // 2. GENERATE SIGNED URL (60-second TTL)
    const { data, error: sErr } = await supabase.storage
        .from('strategy-files')
        .createSignedUrl(filePath, 60, {
            download: true // Forces file download behavior
        });

    if (sErr || !data?.signedUrl) throw sErr || new Error('URL Generation Fault');

    // 3. REDIRECT TO SECURE DOWNLOAD
    return NextResponse.redirect(data.signedUrl);

  } catch (err: any) {
    console.error('Download Logic Error:', err.message);
    return NextResponse.json({ error: 'Secure handoff failed' }, { status: 500 });
  }
}
