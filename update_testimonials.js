require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateTestimonials() {
  try {
    const testimonials = [
      { "n": "Rahul Sharma", "l": "MUMBAI, IN", "t": "Honestly, the best safety net. I was stuck in a bad XAUUSD sell and it hit the $15 drawdown, the bot instantly hedged it. Saved me from a margin call.", "r": 5 },
      { "n": "Amit V.", "l": "DELHI, IN", "t": "Bhai, this engine is magic. Tension hi khatam ho gayi manual trading mein. The moment trade goes wrong, it locks the equity.", "r": 5 },
      { "n": "Karan Desai", "l": "AHMEDABAD, IN", "t": "Been using it for 2 weeks. The profit retracement feature is brilliant. It locked my $12 profit right before the market spiked back down. Total peace of mind.", "r": 5 },
      { "n": "Priya Singh", "l": "BENGALURU, IN", "t": "I used to panic close my trades in a loss. Now I just let the Risk Engine handle the hedge. Very institutional feel.", "r": 4 },
      { "n": "Saurabh M.", "l": "PUNE, IN", "t": "Mera 2 baar account wash hone se bachaya isne. Jab market achanak reverse hota hai, ye auto-hedge open kar deta hai. Perfect for Gold traders.", "r": 5 },
      { "n": "Ankit P.", "l": "HYDERABAD, IN", "t": "The $10 equity drop buffer is exactly what I needed. I don't trade without this active in the background anymore.", "r": 5 },
      { "n": "Ramesh K.", "l": "CHENNAI, IN", "t": "ये बोट सच में कमाल का है। लॉस होने से पहले ही हेज कर देता है।", "r": 5 },
      { "n": "Vivek R.", "l": "KOLKATA, IN", "t": "I highly recommend the Coppr Risk Engine for anyone doing manual execution. The latency is practically zero, the hedge executes instantly.", "r": 5 },
      { "n": "Nishant B.", "l": "SURAT, IN", "t": "No more staring at the screen sweating. Set your manual trade, and if it fails, the bot takes the hit and balances it. Money well spent.", "r": 5 },
      { "n": "Gaurav T.", "l": "JAIPUR, IN", "t": "Paisa vasool feature. Last Friday NFP news spike would have killed my account, but the $15 emergency trigger locked my balance perfectly.", "r": 5 },
      { "n": "Deepak C.", "l": "LUCKNOW, IN", "t": "Very simple to use. Just runs in the background. It locked my profits twice today when Bank Nifty reversed.", "r": 4 },
      { "n": "Manoj S.", "l": "CHANDIGARH, IN", "t": "Bohot sahi setup hai. The moment your equity drops by the limit, it fires a perfectly sized counter order. Absolute lifesaver.", "r": 5 }
    ];

    console.log('Injecting 12 realistic testimonials into Coppr Risk Engine...');
    
    // We already know the ID from previous steps
    const botId = '90d5f6c5-ff7e-4889-9e37-be014bbeb688';

    const { error } = await supabase
      .from('strategies')
      .update({ testimonials: testimonials })
      .eq('id', botId);

    if (error) throw error;
    console.log('Testimonials successfully injected!');

  } catch (err) {
    console.error('Error:', err);
  }
}

updateTestimonials();
