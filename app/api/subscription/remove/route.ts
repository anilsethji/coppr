import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * SUBSCRIPTION REMOVAL API
 * Deletes a user strategy (subscription) from the vault.
 */
export async function DELETE(request: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
        return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    // 1. Check for virtual 'own-' IDs (cannot be deleted from user_strategies)
    if (subscriptionId.startsWith('own-')) {
        return NextResponse.json({ 
            error: 'This is a Proprietary Virtual Node. It cannot be individually deleted. Use the Creator Hub to manage your strategies.' 
        }, { status: 400 });
    }

    try {
        // 2. Clean up child logs FIRST (to avoid foreign key violation)
        const { error: logError } = await supabase
            .from('subscription_logs')
            .delete()
            .eq('subscription_id', subscriptionId);

        if (logError) {
            console.error('Log Cleanup Alert:', logError.message);
            // We continue even if logs fail, as they might have been cleaned already
        }

        // 3. Verify Ownership & Delete Parent
        const { data: deleted, error: deleteError } = await supabase
            .from('user_strategies')
            .delete()
            .eq('id', subscriptionId)
            .eq('user_id', user.id)
            .select();

        if (deleteError) {
            console.error('Core Deletion Error:', deleteError.message);
            return NextResponse.json({ 
                error: `Database Rejection: ${deleteError.message}`,
                details: deleteError 
            }, { status: 500 });
        }
        
        if (!deleted || deleted.length === 0) {
            return NextResponse.json({ error: 'Node already removed or unauthorized.' }, { status: 404 });
        }

        return NextResponse.json({ 
            status: 'REMOVED', 
            message: 'Strategy deployment successfully removed from vault.' 
        });

    } catch (err: any) {
        console.error('Subscription Removal Error:', err.message);
        return NextResponse.json({ error: 'Node removal failed' }, { status: 500 });
    }
}
