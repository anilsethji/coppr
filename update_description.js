require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateDescription() {
  try {
    const newDescription = "Trading can be emotionally exhausting, especially when the market suddenly turns against you. The Coppr Risk Engine is built to give you complete peace of mind and remove the fear of big drawdowns. It acts as your personal safety net while you take manual trades. \n\nHere is how it helps you:\n• Stops Panic Losses: If a trade goes against you and hits your safety limit (e.g., a $15 drop), the engine instantly opens a perfectly balanced counter-trade. This locks your account balance and completely stops any further losses.\n• Protects Your Profits: If your trade is in profit but the market suddenly reverses, the engine automatically steps in to lock your gains before they disappear.\n• Overall Account Safety: It constantly monitors your total account equity and provides an ultimate safety buffer against sudden market crashes.\n\nBy handling the risk automatically, the Coppr Risk Engine takes the emotional stress out of trading. You no longer have to stare at the screen in panic or make fear-based decisions. You can trade with confidence, stay emotionally calm, and focus on finding the best setups.";

    console.log('Updating description for Coppr Risk Engine...');
    
    const botId = '90d5f6c5-ff7e-4889-9e37-be014bbeb688';

    const { error } = await supabase
      .from('strategies')
      .update({ description: newDescription })
      .eq('id', botId);

    if (error) throw error;
    console.log('Description updated successfully!');

  } catch (err) {
    console.error('Error:', err);
  }
}

updateDescription();
