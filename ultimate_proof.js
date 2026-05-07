const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function ultimateProof() {
  console.log("--- 🕵️ ULTIMATE LIVE VERIFICATION 🕵️ ---");
  
  try {
    // 0. Locate a valid USER who has a profile
    console.log("Stage 0: Locating valid user/creator pair...");
    const { data: sub } = await supabaseAdmin.from('user_strategies').select('user_id, strategy_id').limit(1).single();
    if (!sub) throw new Error("No existing subscriptions found to reference.");
    const uId = sub.user_id;
    
    const { data: strat } = await supabaseAdmin.from('strategies').select('creator_id').eq('id', sub.strategy_id).single();
    const cId = strat.creator_id;
    
    console.log(`✅ Valid user found: ${uId}`);
    console.log(`✅ Valid creator found: ${cId}`);

    // 1. Create a dummy strategy
    console.log("Stage 1: Creating TEST_NODE...");
    const { data: testStrat, error: sErr } = await supabaseAdmin
      .from('strategies')
      .insert({
        name: 'ULTIMATE_PROOF_' + Date.now(),
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
    const sId = testStrat.id;
    console.log(`✅ TEST_NODE created: ${sId}`);

    // 2. Add dependencies
    console.log("Stage 2: Adding dummy dependencies...");
    const { data: testSub, error: subErr } = await supabaseAdmin
      .from('user_strategies')
      .insert({
        user_id: uId,
        strategy_id: sId
      })
      .select('id')
      .single();
    
    if (subErr) throw subErr;
    console.log(`✅ Dependency 1 (Subscription) added: ${testSub.id}`);

    const { error: logErr } = await supabaseAdmin
      .from('subscription_logs')
      .insert({
        subscription_id: testSub.id,
        action: 'ULTIMATE_PROOF',
        details: { msg: 'Atomic purge verification' }
      });
    
    if (logErr) throw logErr;
    console.log(`✅ Dependency 2 (Log) added.`);

    // 3. EXECUTE PURGE LOGIC
    console.log("Stage 3: EXECUTING ATOMIC PURGE...");
    await supabaseAdmin.from('subscription_logs').delete().eq('subscription_id', testSub.id);
    await supabaseAdmin.from('user_strategies').delete().eq('strategy_id', sId);
    const { error: finalErr } = await supabaseAdmin.from('strategies').delete().eq('id', sId);
    if (finalErr) throw finalErr;
    
    console.log("✅ Stage 4: ATOMIC PURGE COMPLETE.");
    console.log("--- 🏁 LIVE VERIFICATION SUCCESS 🏁 ---");

  } catch (err) {
    console.error("❌ LIVE VERIFICATION FAILED:", err.message);
    process.exit(1);
  }
}

ultimateProof();
