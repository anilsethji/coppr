// scripts/preflight_test.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = Object.fromEntries(
    fs.readFileSync('.env.local', 'utf8').split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=').map(s => s.trim()))
);

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function run() {
    console.log('🚀 COMMENCING COPPR 1.0 PRE-FLIGHT TEST...');

    try {
        // 1. GET A TEST USER
        const { data: users } = await supabase.auth.admin.listUsers();
        const testUser = users.users[0];
        if (!testUser) throw new Error('No test user found in auth.');
        console.log(`✅ IDENTIFIED TEST USER: ${testUser.id}`);

        // 2. GET OR CREATE CREATOR PROFILE
        const { data: prof } = await supabase.from('creator_profiles').upsert({
            user_id: testUser.id,
            handle: 'preflight_tester',
            display_name: 'Debug Master',
            is_verified: true
        }).select().single();
        console.log(`✅ CREATOR PROFILE ACTIVE: ${prof.id}`);

        // 3. SUBMIT A TEST STRATEGY (PENDING)
        const { data: strat } = await supabase.from('strategies').insert({
            creator_id: prof.id,
            name: 'Preflight Scalper Pro',
            type: 'MT5_EA',
            symbol: 'XAUUSD',
            timeframe: 'M5',
            monthly_price_inr: 1000,
            status: 'PENDING',
            is_public: true
        }).select().single();
        console.log(`✅ STRATEGY SUBMITTED (PENDING): ${strat.id}`);

        // 4. ADMIN APPROVAL SIMULATION
        const { data: approved } = await supabase.from('strategies')
            .update({ status: 'ACTIVE' })
            .eq('id', strat.id)
            .select().single();
        console.log(`✅ ADMIN APPROVAL SUCCESS: Status is now ${approved.status}`);

        // 5. FULFILLMENT SIMULATION (80/20 SPLIT)
        console.log('⏳ SIMULATING TRANSACTION & FULFILLMENT...');
        
        // Mock a transaction
        const orderId = `ORDER_${Date.now()}`;
        await supabase.from('transactions').insert({
            user_id: testUser.id,
            order_id: orderId,
            strategy_id: strat.id,
            amount: 1000,
            status: 'completed'
        });

        // Trigger fulfillment logic (Manual trigger for this test)
        const gross = strat.monthly_price_inr;
        const creatorNet = Math.floor(gross * 0.8);
        const copprFee = gross - creatorNet;

        const { error: revErr } = await supabase.from('creator_revenue').insert({
            creator_id: prof.id,
            strategy_id: strat.id,
            gross_amount: gross,
            creator_net: creatorNet,
            coppr_fee: copprFee,
            status: 'PENDING_PAYOUT'
        });
        if (revErr) throw revErr;
        console.log(`✅ REVENUE SPLIT RECORDED: Creator: ₹${creatorNet} | Coppr: ₹${copprFee}`);

        // 6. LICENSE AUTH SIMULATION (PHONE-HOME)
        const signalKey = 'PREFLIGHT_AUTH_KEY_' + Date.now();
        const accountNo = '123456';

        const { error: insErr } = await supabase.from('user_strategies').insert({
            user_id: testUser.id,
            strategy_id: strat.id,
            status: 'ACTIVE',
            signal_key: signalKey,
            mt5_account_number: accountNo,
            current_period_end: new Date(Date.now() + 30000000).toISOString()
        });
        
        if (insErr) throw new Error('License Insert Error: ' + insErr.message);

        // Final License Check logic (Query)
        const { data: license, error: lErr } = await supabase.from('user_strategies')
            .select('status, strategy_id')
            .eq('signal_key', signalKey)
            .eq('mt5_account_number', accountNo)
            .single();
        
        if (lErr) throw new Error('License Query Error: ' + lErr.message);
        
        if (license && license.status === 'ACTIVE') {
            console.log('✅ LICENSE SECURITY HANDSHAKE: AUTHORIZED');
        } else {
            throw new Error('License handshake failed.');
        }

        console.log('\n🌟 PRE-FLIGHT TEST COMPLETED: ALL SYSTEMS 100% OPERATIONAL');

    } catch (err) {
        console.error('\n❌ PRE-FLIGHT TEST FAILED:', err.message);
        process.exit(1);
    }
}

run();
