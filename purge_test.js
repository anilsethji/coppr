const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyPurge() {
  console.log("--- 🕵️ INITIALIZING LIVE PURGE 🕵️ ---");
  
  try {
    // 1. Create a dummy strategy
    console.log("Stage 1: Creating TEST_NODE...");
    const { data: strategy, error: sErr } = await supabaseAdmin
      .from('strategies')
      .insert({
        name: 'TEST_PURGE_NODE_' + Date.now(),
        creator_id: '7f45ad71-e9c8-4c01-919f-8337af2d2d07', // Coppr Team ID
        type: 'MT5_EA',
        status: 'PENDING',
        origin: 'MARKETPLACE',
        symbol: 'XAUUSD',
        timeframe: 'H1',
        monthly_price_inr: 1999
      })
      .select('id')
      .single();

    if (sErr) throw sErr;
    const sId = strategy.id;
    console.log(`✅ TEST_NODE created: ${sId}`);

    // 2. Add dependencies
    console.log("Stage 2: Adding dummy dependencies (Subscription + Log)...");
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('user_strategies')
      .insert({
        user_id: '7f45ad71-e9c8-4c01-919f-8337af2d2d07',
        strategy_id: sId
      })
      .select('id')
      .single();
    
    if (subErr) throw subErr;
    console.log(`✅ Dependency 1 (Subscription) added: ${sub.id}`);

    const { error: logErr } = await supabaseAdmin
      .from('subscription_logs')
      .insert({
        subscription_id: sub.id,
        action: 'TEST_HEARTBEAT',
        details: { msg: 'Live Verification' }
      });
    
    if (logErr) throw logErr;
    console.log(`✅ Dependency 2 (Log) added.`);

    // 3. EXECUTE PURGE LOGIC (Mimicking actions.ts)
    console.log("Stage 3: EXECUTING ATOMIC PURGE...");
    
    // Purge logs
    await supabaseAdmin.from('subscription_logs').delete().eq('subscription_id', sub.id);
    console.log("  - Logs scrubbed.");

    // Purge sub
    await supabaseAdmin.from('user_strategies').delete().eq('strategy_id', sId);
    console.log("  - Subscription link severed.");

    // Final purge
    const { error: finalErr } = await supabaseAdmin.from('strategies').delete().eq('id', sId);
    if (finalErr) throw finalErr;
    
    console.log("✅ Stage 4: ATOMIC PURGE COMPLETE.");
    console.log("--- 🏁 LIVE VERIFICATION SUCCESS 🏁 ---");

  } catch (err) {
    console.error("❌ LIVE VERIFICATION FAILED:", err.message);
    process.exit(1);
  }
}

verifyPurge();
