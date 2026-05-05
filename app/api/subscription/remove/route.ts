import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * SUBSCRIPTION REMOVAL API
 * Deletes a user strategy (subscription) from the vault.
 */
export async function DELETE(request: Request) {
    const supabase = createClient();
    const adminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
        return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    // 1. Handle Proprietary Virtual Nodes (Deleting the actual strategy)
    if (subscriptionId.startsWith('own-')) {
        const strategyId = subscriptionId.replace('own-', '');
        try {
            const { data: strategy, error: fetchError } = await supabase
                .from('strategies')
                .select('creator_id')
                .eq('id', strategyId)
                .single();

            if (fetchError || !strategy) {
                return NextResponse.json({ error: 'Proprietary node not found.' }, { status: 404 });
            }

            if (strategy.creator_id !== user.id) {
                return NextResponse.json({ error: 'Unauthorized: You do not own this node.' }, { status: 403 });
            }

            const { error: deleteError } = await adminSupabase
                .from('strategies')
                .delete()
                .eq('id', strategyId);

            if (deleteError) throw deleteError;

            return NextResponse.json({ 
                status: 'DELETED', 
                message: 'Proprietary strategy permanently removed from system.' 
            });
        } catch (err: any) {
            return NextResponse.json({ error: `Deletion Failed: ${err.message}` }, { status: 500 });
        }
    }

    try {
        // 2. Resolve Strategy Metadata for Ownership Check
        const { data: sub, error: subError } = await supabase
            .from('user_strategies')
            .select('strategy_id, strategies(creator_id, origin)')
            .eq('id', subscriptionId)
            .single();

        // 3. Clean up child logs FIRST (to avoid foreign key violation)
        await adminSupabase
            .from('subscription_logs')
            .delete()
            .eq('subscription_id', subscriptionId);

        // 4. Verify Ownership & Delete Parent Link
        const { error: deleteError } = await adminSupabase
            .from('user_strategies')
            .delete()
            .eq('id', subscriptionId)
            .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // 5. RECURSIVE PURGE: If this was a personal bot owned by the user, purge the source as well
        if (sub && (sub as any).strategies) {
            const strat = (sub as any).strategies;
            if (strat.creator_id === user.id && strat.origin === 'PERSONAL') {
                console.log(`[RECURSIVE_PURGE] Removing source strategy: ${sub.strategy_id}`);
                await adminSupabase.from('strategies').delete().eq('id', sub.strategy_id);
            }
        }

        return NextResponse.json({ 
            status: 'REMOVED', 
            message: 'Strategy deployment successfully removed from vault.' 
        });

    } catch (err: any) {
        console.error('Subscription Removal Error:', err.message);
        return NextResponse.json({ error: `Node removal failed: ${err.message}` }, { status: 500 });
    }
}
