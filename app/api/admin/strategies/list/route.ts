import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * ADMIN: LIST PENDING STRATEGIES
 * Retrieves all submited strategies awaiting protocol clearance.
 */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
  }

  // TODO: Add formal Admin Role check in database
  // For now: Restrict to site owner via email or specific ID if known

  try {
    const { data: strategies, error } = await supabase
      .from('strategies')
      .select(`
        *,
        creator_profiles (
          id,
          display_name,
          handle,
          is_verified
        )
      `)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ strategies: strategies || [] });

  } catch (error: any) {
    console.error('Admin Fetch Error:', error.message);
    return NextResponse.json({ error: 'Failed to retrieve pending roster' }, { status: 500 });
  }
}

/**
 * ADMIN: APPROVE STRATEGY
 * Activates a strategy for the global marketplace.
 */
export async function POST(request: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }
  
    const { id, action } = await request.json(); // action = 'APPROVE' | 'REJECT'
  
    try {
      const status = action === 'APPROVE' ? 'ACTIVE' : 'REJECTED';
  
      const { error } = await supabase
        .from('strategies')
        .update({ 
            status,
            is_public: action === 'APPROVE' ? true : false 
        })
        .eq('id', id);
  
      if (error) throw error;
  
      // Mock Notification logic would go here
      console.log(`[ADMIN] Strategy ${id} transition to ${status} completed.`);
  
      return NextResponse.json({ success: true, status });
  
    } catch (error: any) {
      console.error('Admin Action Error:', error.message);
      return NextResponse.json({ error: 'Fulfillment handshake failed' }, { status: 500 });
    }
}
