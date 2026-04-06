
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('🧪 RUNNING DEEP DIAGNOSTIC...');

    // We'll try to query the Postgres system catalog via RPC if it exists,
    // or we'll try a specific select on a dummy table if we can.
    // Since we usually don't have an "rpc" for pg_catalog, 
    // we will try to insert a record and catch the error to see the exact constraint name.
    
    console.log('1. Attempting Test Insert with "WEBHOOK_BRIDGE"...');
    const { error: insError } = await supabase
        .from('strategies')
        .insert({
            name: 'DIAGNOSTIC_TEST_' + Date.now(),
            symbol: 'XAUUSD',
            execution_mode: 'WEBHOOK_BRIDGE'
        });

    if (insError) {
        console.log('--- ERROR LOG ---');
        console.log('Code:', insError.code);
        console.log('Message:', insError.message);
        console.log('Hint:', insError.hint);
        console.log('Details:', insError.details);
        console.log('----------------');
    } else {
        console.log('✅ INSERT SUCCESS (No error? This is strange if it fails for you).');
    }
}

diagnose();
