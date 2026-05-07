const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
  console.log("--- 🔍 DATABASE SCHEMATIC AUDIT 🔍 ---");
  
  try {
    // 1. Check for the enum that caused the crash
    console.log("Checking for 'product_origin' type...");
    const { data: enumData, error: enumErr } = await supabaseAdmin.rpc('get_enum_values', { enum_name: 'product_origin' });
    if (enumErr) {
      console.log("⚠️ RPC 'get_enum_values' failed (likely doesn't exist). Attempting raw query...");
      const { data: rawEnum } = await supabaseAdmin.from('pg_type').select('typname').eq('typname', 'product_origin');
      console.log("PG_TYPE matches for 'product_origin':", rawEnum);
    } else {
      console.log("✅ 'product_origin' VALUES:", enumData);
    }

    // 2. Check Table Columns for 'strategies'
    console.log("\nChecking 'strategies' schema...");
    const { data: cols, error: colErr } = await supabaseAdmin.rpc('get_table_columns', { table_name: 'strategies' });
    if (colErr) {
       console.log("⚠️ RPC 'get_table_columns' failed. Trying limit 0 select...");
       const { data: test, error: testErr } = await supabaseAdmin.from('strategies').select('*').limit(0);
       if (testErr) console.error("FATAL: Cannot even select from strategies:", testErr.message);
       else console.log("✅ 'strategies' is accessible. Keys:", Object.keys(test?.[0] || {}));
    } else {
       console.log("✅ 'strategies' COLUMNS:", cols);
    }

    // 3. List ALL active tables
    console.log("\nDetecting all accessible tables...");
    const tables = ['strategies', 'user_strategies', 'subscription_logs', 'signal_logs', 'strategy_reviews', 'creator_revenue', 'transactions', 'content'];
    for (const t of tables) {
       const { error } = await supabaseAdmin.from(t).select('id').limit(0);
       console.log(`- Table [${t}]: ${error ? '❌ MISSING (' + error.message + ')' : '✅ ACTIVE'}`);
    }

  } catch (err) {
    console.error("❌ INSPECTION FAILED:", err.message);
  }
}

inspectSchema();
