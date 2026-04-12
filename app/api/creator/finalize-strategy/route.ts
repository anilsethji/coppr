import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = createClient();
        const { strategyId, name, description, code, isPublic, price, metrics } = await req.json();

        if (!strategyId) {
            return NextResponse.json({ error: 'Missing strategy identifier' }, { status: 400 });
        }

        const { data: { user } } = await supabase.auth.getUser();

        // 1. Prepare updates
        const updates: any = {
            name,
            description,
            script_code: code,
            origin: isPublic ? 'MARKETPLACE' : 'PERSONAL',
            status: 'ACTIVE',
            monthly_price_inr: isPublic ? price : 0,
            tier: price > 0 ? 'PAID' : 'FREE',
            // Map simulated metrics to DB columns
            win_rate: metrics?.winRate || 0,
            total_trades: metrics?.totalTrades || 0,
            avg_gain: metrics?.avgGain || 0,
            max_drawdown: metrics?.maxDrawdown || 0,
            // If it's a new AI bot, we can also set the execution_mode
            execution_mode: 'AUTOMATED'
        };

        // 2. Perform secured update
        const { error } = await supabase
            .from('strategies')
            .update(updates)
             .eq('id', strategyId);

        if (error) {
            console.error('Finalize update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error('Finalize Critical Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
