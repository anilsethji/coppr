require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadStrategy() {
  try {
    const filePath = 'c:\\Users\\Anil Seth\\AppData\\Roaming\\MetaQuotes\\Terminal\\D0E8209F77C8CF37AD8BF550E51FF075\\MQL5\\Experts\\CopperStrictEngine_v1.mq5';
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'CopperStrictEngine_v1_' + Date.now() + '.mq5';

    console.log('Uploading file to Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('strategy-files')
      .upload(fileName, fileBuffer, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('strategy-files')
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;
    console.log('File uploaded successfully. URL:', fileUrl);

    console.log('Inserting Strategy into Database...');
    
    const eaConfig = [
      { key: "InpMagicNumber", label: "Magic Number (0 = Manual)", type: "number", default: 0 },
      { key: "InpPoint1_Loss", label: "Emergency Loss Trigger ($)", type: "number", default: 15.0 },
      { key: "InpPoint2_High", label: "Profit High Watermark ($)", type: "number", default: 12.0 },
      { key: "InpPoint2_Drop", label: "Profit Drop Trigger ($)", type: "number", "default": 4.2 },
      { key: "InpPoint3_Drop", label: "Equity Drop Buffer ($)", type: "number", default: 10.0 }
    ];

    const strategyData = {
      name: 'Coppr Risk Engine',
      description: 'An institutional-grade risk management protocol designed to protect manual trades. It automatically deploys perfectly balanced counter-hedges if a trade moves against you or experiences a profit retracement, locking in your equity and preventing catastrophic drawdowns.',
      type: 'MT5_EA',
      creator_id: 'ef204a6f-f673-4ba9-93f4-ebcfb70ae612', // Admin User ID
      status: 'ACTIVE',
      origin: 'OFFICIAL',
      is_official: true,
      is_public: true,
      win_rate: null,
      pair: 'ANY',
      symbol: 'ANY',
      timeframe: 'ANY',
      monthly_price_inr: 0,
      ea_file_url: fileUrl,
      ea_config: eaConfig,
      homepage_section: 'PREMIUM_VAULT' // Make sure it shows up!
    };

    const { data: insertData, error: insertError } = await supabase
      .from('strategies')
      .insert([strategyData])
      .select();

    if (insertError) throw insertError;

    console.log('Strategy inserted successfully:', insertData[0].id);

  } catch (err) {
    console.error('Error:', err);
  }
}

uploadStrategy();
