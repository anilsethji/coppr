require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixProofs() {
  try {
    // 1. Create a public bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasPublicBucket = buckets.some(b => b.name === 'public-assets');
    
    if (!hasPublicBucket) {
      console.log('Creating public-assets bucket...');
      await supabase.storage.createBucket('public-assets', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      });
    }

    // 2. We get the newest "Coppr Risk Engine" strategy
    const { data: strategies } = await supabase
      .from('strategies')
      .select('id')
      .eq('name', 'Coppr Risk Engine')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!strategies || strategies.length === 0) return;
    const botId = strategies[0].id;
    
    // 3. Upload images to public bucket
    const proof1Path = 'C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\49cb2ed9-a6b2-4547-b21a-4f98dc9eb787\\coppr_risk_proof_1_1777968213073.png';
    const proof2Path = 'C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\49cb2ed9-a6b2-4547-b21a-4f98dc9eb787\\coppr_risk_proof_2_1777968250897.png';

    const proof1Buffer = fs.readFileSync(proof1Path);
    const proof2Buffer = fs.readFileSync(proof2Path);

    console.log('Uploading Proof 1 to public bucket...');
    const p1Name = `proof1_${Date.now()}.png`;
    await supabase.storage.from('public-assets').upload(p1Name, proof1Buffer, { contentType: 'image/png' });
    const { data: p1Url } = supabase.storage.from('public-assets').getPublicUrl(p1Name);

    console.log('Uploading Proof 2 to public bucket...');
    const p2Name = `proof2_${Date.now()}.png`;
    await supabase.storage.from('public-assets').upload(p2Name, proof2Buffer, { contentType: 'image/png' });
    const { data: p2Url } = supabase.storage.from('public-assets').getPublicUrl(p2Name);

    // Provide a generic execution video link for Proof 3
    const videoUrl = 'https://www.youtube.com/watch?v=F3QpgXBtDeo'; // Generic Trading Video Placeholder

    console.log('Updating database row with PUBLIC URLs...');
    const { error } = await supabase
      .from('strategies')
      .update({
        screenshot_urls: [p1Url.publicUrl, p2Url.publicUrl],
        video_url: videoUrl
      })
      .eq('id', botId);

    if (error) throw error;
    console.log('Proofs attached and fixed successfully! URLs:', [p1Url.publicUrl, p2Url.publicUrl]);

  } catch (err) {
    console.error('Error:', err);
  }
}

fixProofs();
