const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContentTable() {
  console.log("Checking 'content' table for strategy references...");
  const { data, error } = await supabaseAdmin.from('content').select('*').limit(1);
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Columns in 'content':", Object.keys(data?.[0] || {}));
  }
}

checkContentTable();
