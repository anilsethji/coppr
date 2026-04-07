import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * SECURE ASSET DOWNLOAD PROTOCOL
 * Serves the watermarked or compiled .ex5/.mq5 files only to verified subscribers.
 */
export async function GET(
  request: Request,
  { params }: { params: { strategyId: string } }
) {
  const supabase = createClient();
  const { strategyId } = params;

  try {
    // 1. AUTHENTICATION CHECK
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
    }

    // 2. SUBSCRIPTION VERIFICATION (RLS will also handle this, but explicit check is safer for file serving)
    const { data: subscription, error: subError } = await supabase
      .from('user_strategies')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .eq('status', 'ACTIVE')
      .maybeSingle();

    if (subError || !subscription) {
        return NextResponse.json({ error: 'ACTIVE_SUBSCRIPTION_REQUIRED' }, { status: 403 });
    }

    // Check expiration
    if (new Date(subscription.current_period_end) < new Date()) {
        return NextResponse.json({ error: 'SUBSCRIPTION_EXPIRED' }, { status: 403 });
    }

    // 3. FETCH STORAGE PATH
    const { data: strategy, error: sError } = await supabase
      .from('strategies')
      .select('ea_file_url, name')
      .eq('id', strategyId)
      .single();

    if (sError || !strategy?.ea_file_url) {
        return NextResponse.json({ error: 'ASSET_NOT_FOUND' }, { status: 404 });
    }

    // 4. GENERATE SIGNED URL FOR SECURE DOWNLOAD
    const { data: signedData, error: signedError } = await supabase.storage
      .from('strategy-files')
      .createSignedUrl(strategy.ea_file_url, 60); // 60 seconds expiry

    if (signedError) throw signedError;

    // 5. REDIRECT TO SECURE STORAGE LINK
    return NextResponse.redirect(signedData.signedUrl);

  } catch (error: any) {
    console.error('Download Protocol Error:', error.message);
    return NextResponse.json({ error: 'PROTOCOL_ERROR' }, { status: 500 });
  }
}
