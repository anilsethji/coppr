
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('🔍 INSPECTING LIVE SCHEMA...');
    
    // We try to query information_schema via RPC or raw query if permissions allow
    // Since Supabase often restricts direct information_schema access via API, 
    // we'll try to insert a test record to see if it fails with type info,
    // or use a clever select.
    
    const { data: columns, error } = await supabase
        .from('strategies')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error fetching strategies:', error);
    } else {
        console.log('✅ Successfully reached strategies table.');
    }

    // Try a direct RPC if the user has a "get_type" function, 
    // otherwise we just tell them what to check.
    console.log('\n⚠️  ADVISORY: Manual verification of column types is required.');
    console.log('Execution Mode: Should be TEXT');
    console.log('Master Signal Key: Should be TEXT');
}

inspect();
