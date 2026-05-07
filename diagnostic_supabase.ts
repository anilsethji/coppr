import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  console.log("Checking Supabase connection...");
  const { data, error } = await supabaseAdmin.from('strategies').select('id').limit(1);
  if (error) {
    console.error("Connection Failed:", error.message);
  } else {
    console.log("Connection Success! Found strategy IDs:", data);
  }
}

test();
