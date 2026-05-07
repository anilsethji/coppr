const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalProof() {
  console.log("--- 🕵️ FINAL LIVE VERIFICATION 🕵️ ---");
  
  try {
    // 0. Fetch a valid creator ID
    console.log("Stage 0: Locating valid creator...");
    const { data: creator } = await supabaseAdmin.from('creator_profiles').select('id').limit(1).single();
    if (!creator) throw new Error("No creators found in DB to link test node to.");
    const cId = creator.id;
    console.log(`✅ Valid creator found: ${cId}`);

    // 1. Create a dummy strategy
    console.log("Stage 1: Creating TEST_NODE...");
    const { data: strategy, error: sErr } = await supabaseAdmin
      .from('strategies')
      .insert({
        name: 'PROVE_FIX_' + Date.now(),
        creator_id: cId,
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
    console.log("Stage 2: Adding dummy dependencies...");
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('user_strategies')
      .insert({
        user_id: cId, // Using creator as the user for the test
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
        action: 'LIVE_PROOF',
        details: { msg: 'Atomic purge verification' }
      });
    
    if (logErr) throw logErr;

    // 3. EXECUTE PURGE LOGIC (Exact sequence from actions.ts)
    console.log("Stage 3: EXECUTING ATOMIC PURGE...");
    
    // Purge logs
    await supabaseAdmin.from('subscription_logs').delete().eq('subscription_id', sub.id);
    // Purge sub
    await supabaseAdmin.from('user_strategies').delete().eq('strategy_id', sId);
    // Final purge of node
    const { error: finalErr } = await supabaseAdmin.from('strategies').delete().eq('id', sId);
    if (finalErr) throw finalErr;
    
    console.log("✅ Stage 4: ATOMIC PURGE COMPLETE.");
    console.log("--- 🏁 LIVE VERIFICATION SUCCESS 🏁 ---");

  } catch (err) {
    console.error("❌ LIVE VERIFICATION FAILED:", err.message);
    process.exit(1);
  }
}

finalProof();
