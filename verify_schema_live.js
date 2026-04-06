
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('🧪 RUNNING LIVE BRIDGE TEST...');
    
    // We try to insert a TEMPORARY test strategy with WEBHOOK_BRIDGE
    // If it succeeds, the schema is TEXT or a FIXED ENUM.
    const testId = '00000000-0000-0000-0000-' + Date.now().toString().slice(-12);
    
    const { error } = await supabase
        .from('strategies')
        .insert({
            name: 'SCHEMATIC_VERIFICATION_TEST',
            type: 'PINE_SCRIPT_WEBHOOK',
            execution_mode: 'WEBHOOK_BRIDGE',
            master_signal_key: 'COPPR-TEST-SYNC',
            status: 'PENDING'
        });

    if (error) {
        if (error.message.includes('invalid input value for enum')) {
            console.error('❌ VERIFICATION FAILED: execution_mode is still a restricted ENUM!');
        } else if (error.message.includes('invalid input syntax for type uuid')) {
             console.error('❌ VERIFICATION FAILED: master_signal_key is still a UUID!');
        } else {
            console.error('❌ OTHER ERROR:', error.message);
        }
    } else {
        console.log('✅ VERIFICATION SUCCESS: The database is now "Ironclad" compliant!');
        
        // Cleanup
        await supabase.from('strategies').delete().eq('name', 'SCHEMATIC_VERIFICATION_TEST');
    }
}

verify();
