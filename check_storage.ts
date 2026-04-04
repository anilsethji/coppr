import { createClient } from './lib/supabase/client';

async function checkStorage() {
    const supabase = createClient();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }
    
    const exists = buckets.find(b => b.name === 'strategy-files');
    if (exists) {
        console.log('✅ strategy-files bucket exists.');
        console.log('Bucket settings:', exists);
    } else {
        console.log('❌ strategy-files bucket MISSING.');
        console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    }
}

checkStorage();
