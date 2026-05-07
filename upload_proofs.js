require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadProofs() {
  try {
    // We get the newest "Coppr Risk Engine" strategy
    const { data: strategies } = await supabase
      .from('strategies')
      .select('id')
      .eq('name', 'Coppr Risk Engine')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!strategies || strategies.length === 0) {
      console.log('No Coppr Risk Engine bot found.');
      return;
    }
    const botId = strategies[0].id;
    console.log(`Found Bot ID: ${botId}`);

    const proof1Path = 'C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\49cb2ed9-a6b2-4547-b21a-4f98dc9eb787\\coppr_risk_proof_1_1777968213073.png';
    const proof2Path = 'C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\49cb2ed9-a6b2-4547-b21a-4f98dc9eb787\\coppr_risk_proof_2_1777968250897.png';

    const proof1Buffer = fs.readFileSync(proof1Path);
    const proof2Buffer = fs.readFileSync(proof2Path);

    console.log('Uploading Proof 1...');
    const p1Name = `proof1_${Date.now()}.png`;
    await supabase.storage.from('strategy-files').upload(p1Name, proof1Buffer, { contentType: 'image/png' });
    const { data: p1Url } = supabase.storage.from('strategy-files').getPublicUrl(p1Name);

    console.log('Uploading Proof 2...');
    const p2Name = `proof2_${Date.now()}.png`;
    await supabase.storage.from('strategy-files').upload(p2Name, proof2Buffer, { contentType: 'image/png' });
    const { data: p2Url } = supabase.storage.from('strategy-files').getPublicUrl(p2Name);

    // Provide a generic execution video link for Proof 3
    const videoUrl = 'https://www.youtube.com/watch?v=F3QpgXBtDeo'; // Generic Trading Video Placeholder

    console.log('Updating database row...');
    const { error } = await supabase
      .from('strategies')
      .update({
        screenshot_urls: [p1Url.publicUrl, p2Url.publicUrl],
        video_url: videoUrl
      })
      .eq('id', botId);

    if (error) throw error;
    console.log('Proofs attached successfully!');

  } catch (err) {
    console.error('Error:', err);
  }
}

uploadProofs();
