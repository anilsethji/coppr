const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  console.log("Checking actual data in 'strategies' table...");
  const { data, error } = await supabaseAdmin
    .from('strategies')
    .select('id, name, origin')
    .limit(10);
  
  if (error) {
    console.error("Error fetching strategies:", error.message);
  } else {
    console.log("Samples from strategies:");
    console.table(data);
  }
}

checkData();
