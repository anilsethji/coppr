// scripts/debug_marketplace.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(s => s.trim()))
);

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function debug() {
    console.log('🔍 COMMENCING MARKETPLACE AUDIT...');

    // 1. Check Strategies
    const { data: strats, error: sErr } = await supabase.from('strategies').select('*');
    console.log(`\n📦 TOTAL STRATEGIES IN DB: ${strats?.length || 0}`);
    if (sErr) console.error('Strategy Error:', sErr);

    strats?.forEach(s => {
        console.log(` - [${s.id}] ${s.name} | Status: ${s.status} | Creator: ${s.creator_id} | Public: ${s.is_public}`);
    });

    // 2. Check Profiles
    const { data: profs, error: pErr } = await supabase.from('creator_profiles').select('*');
    console.log(`\n👤 TOTAL PROFILES IN DB: ${profs?.length || 0}`);
    if (pErr) console.error('Profile Error:', pErr);

    profs?.forEach(p => {
        console.log(` - [${p.id}] @${p.handle} | Owner: ${p.user_id}`);
    });

    // 3. Check Join Integrity
    const { data: joined, error: jErr } = await supabase
        .from('strategies')
        .select('id, name, creator_profiles(id, handle)')
        .eq('status', 'ACTIVE');
    
    console.log(`\n🔗 JOINED ACTIVE STRATEGIES: ${joined?.length || 0}`);
    if (jErr) console.error('Join Error:', jErr);
}

debug();
