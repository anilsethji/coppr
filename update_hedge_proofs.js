require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateHedgeProofs() {
  try {
    // 1. We get the newest "Coppr Risk Engine" strategy
    const { data: strategies } = await supabase
      .from('strategies')
      .select('id, screenshot_urls, video_url')
      .eq('name', 'Coppr Risk Engine')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!strategies || strategies.length === 0) return;
    const botId = strategies[0].id;
    
    // 2. Upload the new context-aware images to the public bucket
    const proof1Path = 'C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\49cb2ed9-a6b2-4547-b21a-4f98dc9eb787\\coppr_risk_hedge_chart_1778084410645.png';
    const proof2Path = 'C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\49cb2ed9-a6b2-4547-b21a-4f98dc9eb787\\coppr_risk_dashboard_1778084444897.png';

    const proof1Buffer = fs.readFileSync(proof1Path);
    const proof2Buffer = fs.readFileSync(proof2Path);

    console.log('Uploading New Hedge Chart to public bucket...');
    const p1Name = `hedge_proof1_${Date.now()}.png`;
    await supabase.storage.from('public-assets').upload(p1Name, proof1Buffer, { contentType: 'image/png' });
    const { data: p1Url } = supabase.storage.from('public-assets').getPublicUrl(p1Name);

    console.log('Uploading New Hedge Dashboard to public bucket...');
    const p2Name = `hedge_proof2_${Date.now()}.png`;
    await supabase.storage.from('public-assets').upload(p2Name, proof2Buffer, { contentType: 'image/png' });
    const { data: p2Url } = supabase.storage.from('public-assets').getPublicUrl(p2Name);

    console.log('Updating database row with NEW CONTEXTUAL URLs...');
    const { error } = await supabase
      .from('strategies')
      .update({
        screenshot_urls: [p1Url.publicUrl, p2Url.publicUrl]
      })
      .eq('id', botId);

    if (error) throw error;
    console.log('Hedge Proofs updated successfully!');

  } catch (err) {
    console.error('Error:', err);
  }
}

updateHedgeProofs();
