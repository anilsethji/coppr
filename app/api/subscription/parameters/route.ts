import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    try {
        const { subscriptionId, parameters } = await request.json();

        if (!subscriptionId || !parameters) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate ownership before updating
        const { data: sub, error: fetchError } = await supabase
            .from('user_strategies')
            .select('id')
            .eq('id', subscriptionId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !sub) {
            return NextResponse.json({ error: 'Subscription not found or unauthorized' }, { status: 404 });
        }

        const { error: updateError } = await supabase
            .from('user_strategies')
            .update({ user_parameters: parameters })
            .eq('id', subscriptionId);

        if (updateError) {
            throw updateError;
        }

        // Log the parameter change
        await supabase.from('subscription_logs').insert({
            subscription_id: subscriptionId,
            action: 'PARAMETERS_UPDATED',
            details: {
                event: 'USER_CONFIGURATION_CHANGED',
                parameters: parameters,
                timestamp: new Date().toISOString()
            }
        });

        return NextResponse.json({ success: true, message: 'Parameters securely synchronized' });

    } catch (err: any) {
        console.error('Parameter Update API Error:', err.message);
        return NextResponse.json({ error: `Update Failed: ${err.message}` }, { status: 500 });
    }
}
