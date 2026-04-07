import { createClient } from '@/lib/supabase/server';
import { BinanceFuturesAdapter } from '@/lib/brokers/BinanceFuturesAdapter';
import { BybitAdapter } from '@/lib/brokers/BybitAdapter';
import { DhanAdapter } from '@/lib/brokers/DhanAdapter';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
    }

    const { brokerType, accountId } = await request.json();

    try {
        // 1. FETCH CREDENTIALS
        const { data: broker, error: bError } = await supabase
            .from('broker_accounts')
            .select('*')
            .eq('id', accountId)
            .eq('user_id', user.id)
            .single();

        if (bError || !broker) throw new Error('Broker account not found');

        const reports: any[] = [];
        let success = true;

        if (brokerType === 'BINANCE_FUTURES') {
            const adapter = new BinanceFuturesAdapter();
            const credentials = { 
                api_key: broker.api_key, 
                api_secret: broker.api_secret 
            };

            // TEST 1: BALANCE ACCESS (Permissions Check)
            try {
                await adapter.getAccountBalance(credentials);
                reports.push({ label: 'API Permissions (Balance)', status: 'SUCCESS', message: 'Verified' });
            } catch (err) {
                reports.push({ label: 'API Permissions (Balance)', status: 'FAILED', message: 'Enable Futures access in API settings' });
                success = false;
            }

            // TEST 2: HEDGE MODE
            try {
                const isHedge = await adapter.getPositionMode(credentials);
                if (isHedge) {
                    reports.push({ label: 'Account Mode (Hedge)', status: 'SUCCESS', message: 'Hedge Mode Active' });
                } else {
                    reports.push({ label: 'Account Mode (Hedge)', status: 'FAILED', message: 'One-Way Mode detected. Required: Dual-Side.' });
                    success = false;
                }
            } catch (err) {
                reports.push({ label: 'Account Mode (Hedge)', status: 'FAILED', message: 'Failed to verify position mode.' });
                success = false;
            }
        } else if (brokerType === 'BYBIT') {
            const adapter = new BybitAdapter();
            const credentials = { api_key: broker.api_key, api_secret: broker.api_secret };

            try {
                await adapter.getAccountBalance(credentials);
                reports.push({ label: 'API Permissions', status: 'SUCCESS', message: 'Verified' });
                
                const isHedge = await adapter.getPositionMode(credentials);
                if (isHedge) {
                    reports.push({ label: 'Position Mode (Hedge)', status: 'SUCCESS', message: 'Active' });
                } else {
                    reports.push({ label: 'Position Mode (Hedge)', status: 'FAILED', message: 'One-Way Mode detected.' });
                    success = false;
                }
            } catch (err) {
                reports.push({ label: 'Bybit Connectivity', status: 'FAILED', message: 'API check failed.' });
                success = false;
            }
        } else if (brokerType === 'DHAN') {
            const adapter = new DhanAdapter();
            const credentials = { api_key: broker.api_key };

            try {
                await adapter.getAccountBalance(credentials);
                reports.push({ label: 'Session Status', status: 'SUCCESS', message: 'Active Handshake' });
            } catch (err) {
                reports.push({ label: 'Session Status', status: 'FAILED', message: 'Token Expired (Daily Refresh Required)' });
                success = false;
            }
        }

        return NextResponse.json({ success, reports });

    } catch (error: any) {
        console.error('Diagnostic error:', error.message);
        return NextResponse.json({ error: 'Diagnostic Logic Failure' }, { status: 500 });
    }
}
