const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Testing insert...");
    const payload = {
        name: "Test AI Bot",
        description: JSON.stringify({ desc: "Testing", stopLoss: "1%", takeProfit: "2%" }),
        type: 'PINE_SCRIPT_WEBHOOK',
        origin: 'AI_EXTRACTED',
        status: 'ACTIVE',
        tradingview_code: "strategy('test')"
    };

    const { data, error } = await supabase.from('strategies').insert(payload).select('id').single();
    
    if (error) {
        console.error("Insert Error:", error);
    } else {
        console.log("Insert Success:", data);
    }
}
testInsert();
