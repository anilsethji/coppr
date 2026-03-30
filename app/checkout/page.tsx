'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// CASHFREE SDK TYPE
declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  
  // GUEST INFO
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  // Load Cashfree SDK & Check Auth
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    document.body.appendChild(script);

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!agreed) {
      setError("Please agree to the terms and privacy policy.");
      return;
    }

    if (!user && (!email || !name)) {
      setError("Please enter your name and email to proceed as a guest.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'monthly_access',
          amount: 1999,
          customerName: name || user?.user_metadata?.full_name,
          customerEmail: email || user?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      // INITIATE CASHFREE CHECKOUT
      const cashfree = window.Cashfree({
        mode: "sandbox", 
      });

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/dashboard?order_id=${data.order_id}`,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-20 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Order Summary */}
        <div className="space-y-8">
          <div>
             <h1 className="text-3xl font-bold mb-4 tracking-tighter">Complete your subscription</h1>
             <p className="text-gray-400 text-sm">Join the Elite algorithmic trading community today.</p>
          </div>
          
          <div className="stat-card p-6 border-gold-badge/30 bg-[#F5A623]/5">
             <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
               <div>
                 <h3 className="font-bold text-white text-lg">Coppr Monthly Access</h3>
                 <p className="text-sm text-gray-400 mt-1">Renewal: Every 30 Days</p>
               </div>
               <div className="text-2xl font-black text-white">Rs.1999<span className="text-sm text-gray-500 font-normal">/mo</span></div>
             </div>
             <ul className="space-y-3 text-sm text-gray-300 mb-6">
               <li className="flex items-center gap-3"><span className="text-[#00E676] font-bold">✓</span> All EA bots, indicators & updates</li>
               <li className="flex items-center gap-3"><span className="text-[#00E676] font-bold">✓</span> Step-by-step video tutorials</li>
               <li className="flex items-center gap-3"><span className="text-[#00E676] font-bold">✓</span> Live trade recordings & logs</li>
               <li className="flex items-center gap-3"><span className="text-[#00E676] font-bold">✓</span> Direct WhatsApp support</li>
             </ul>
             <p className="text-[10px] text-[#00E676] font-black bg-[#00E676]/10 border border-[#00E676]/20 inline-block px-3 py-1.5 rounded-full uppercase tracking-widest">No setup fee. No hidden charges.</p>
          </div>
          
          <div className="text-sm text-gray-400 flex items-start gap-3 bg-white/[0.02] p-4 rounded-[12px] border border-white/5">
             <span className="text-xl block">🛡️</span>
             <p className="text-xs"><strong>7-day refund on first payment. Cancel anytime.</strong><br/>If you decide the tools aren't for you within 7 days, just email us for a full refund.</p>
          </div>
        </div>

        {/* Payment Box */}
        <div className="stat-card p-8 shadow-2xl bg-[#0A0F1E] border-white/10 h-fit">
           <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Payment Details</h2>
           
           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] p-3 rounded-[8px] mb-6 text-center font-bold italic">
               {error}
             </div>
           )}

           {/* GUEST INFO FIELDS */}
           {!user && (
             <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-[10px] border border-white/5">
                   <p className="text-[10px] font-black text-[#00E676] uppercase tracking-widest mb-3 italic">Checkout as Guest</p>
                   <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2.5 text-white text-xs focus:outline-none focus:border-[#00E676]/50"
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2.5 text-white text-xs focus:outline-none focus:border-[#00E676]/50"
                      />
                   </div>
                </div>
             </div>
           )}

           {user && (
             <div className="p-4 bg-[#00E676]/5 rounded-[10px] border border-[#00E676]/10 mb-8">
                <p className="text-[10px] font-black text-[#00E676] uppercase tracking-widest mb-1 italic">Logged in as</p>
                <p className="text-xs text-white font-bold">{user.email}</p>
             </div>
           )}

           <div className="flex items-start mb-8">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 min-w-[20px] rounded border-gray-600 outline-none accent-[#00E676]" 
              id="compliance_checkout" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="compliance_checkout" className="ml-3 text-[10px] text-gray-500 leading-tight">
              I have read and agree to the <Link href="/terms" className="text-white hover:underline transition-colors">Terms</Link>, <Link href="/privacy" className="text-white hover:underline transition-colors">Privacy Policy</Link>, and <Link href="/refund" className="text-white hover:underline transition-colors">Refund Policy</Link>.
            </label>
          </div>

          <button 
            onClick={handlePayment}
            disabled={loading}
            className={`btn-primary w-full py-4 text-sm shadow-[0_4px_20px_0_rgba(0,230,118,0.2)] mb-6 flex flex-col items-center justify-center ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Initiating Secure Gateway...' : `Pay Rs.1999 via UPI / Card`}
          </button>
          
          <div className="flex justify-center flex-wrap gap-4 text-gray-700 font-bold text-[10px] mb-6 pb-6 border-b border-white/5 uppercase tracking-widest">
            <span>UPI</span> • <span>PhonePe</span> • <span>GPay</span> • <span>Cards</span>
          </div>
          
          <div className="text-center text-[10px] text-gray-600 flex flex-col items-center gap-1.5 font-medium">
            <span className="flex items-center gap-1">🔒 Secured by Cashfree Payments</span>
            <span>Your dashboard access will be activated upon success.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
