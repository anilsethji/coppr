'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import JourneyBar from '@/components/marketplace/JourneyBar';
import { ShieldCheck, Info, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

const brokers = [
    { id: 'zerodha', name: 'Zerodha (Kite)', icon: '⚡' },
    { id: 'dhan', name: 'Dhan', icon: '💰' },
    { id: 'binance', name: 'Binance (Futures)', icon: '🔸' },
    { id: 'interactive', name: 'Interactive Brokers', icon: '🌍' },
    { id: 'other', name: 'Other (MetaTrader 5)', icon: '🤖' }
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const strategyId = searchParams.get('strategyId');
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState(brokers[0].id);

  useEffect(() => {
    async function checkAdmin() {
      const { createClient } = await import('@/lib/supabase/client');
      const { isAdmin } = await import('@/lib/admin');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isAdmin(user.email)) {
        router.push('/dashboard/bots');
      }
    }
    checkAdmin();

    if (strategyId) {
      setFetching(true);
      fetch(`/api/marketplace/${strategyId}`)
        .then(res => res.json())
        .then(data => {
            setStrategy(data.strategy);
            setFetching(false);
        })
        .catch(err => {
            console.error(err);
            setFetching(false);
        });
    }
  }, [strategyId, router]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Initialize Cashfree SDK
      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox',
      });

      // 2. Request a payment session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: strategyId ? `strategy_${strategyId}` : 'monthly_access',
          amount: strategy ? strategy.monthly_price_inr : 1999,
          strategyId: strategyId || null,
          broker: selectedBroker,
          // Placeholder for metadata
          customerName: 'Guest User',
          customerEmail: 'guest_' + Date.now() + '@coppr.com',
          customerPhone: '9999999999'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // 3. Open Cashfree UI Modal
      let checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self"
      };

      await cashfree.checkout(checkoutOptions);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  if (fetching) return (
     <div className="min-h-screen flex items-center justify-center bg-[#080C14]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
     </div>
  );

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 bg-[#080C14]">
      {strategyId && <JourneyBar currentStep={3} />}

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 mt-10">
        
        {/* Left Column: Selection & Config */}
        <div className="space-y-10">
          <section className="space-y-4">
             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">Finalize your connection</h1>
             <p className="text-[13px] text-white/40 leading-relaxed font-medium">Connect your favorite broker to enable 1-click trade mirroring for this strategy.</p>
          </section>

          {/* Broker Selection */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5" />
                Select Trading Execution Terminal
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brokers.map(b => (
                    <button 
                      key={b.id}
                      onClick={() => setSelectedBroker(b.id)}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${selectedBroker === b.id ? 'bg-[#FFD700]/10 border-[#FFD700]/30 ring-1 ring-[#FFD700]/20' : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/40'}`}
                    >
                        <span className="text-2xl">{b.icon}</span>
                        <div className="flex flex-col">
                            <span className={`text-[12px] font-black ${selectedBroker === b.id ? 'text-white' : ''}`}>{b.name}</span>
                            <span className="text-[10px] font-bold opacity-30">AUTO-SYNC ACTIVE</span>
                        </div>
                    </button>
                ))}
             </div>
             <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2 mt-2">
                <ShieldCheck className="w-3 h-3 text-[#00E676]" />
                Encrypted Connection via OAuth 2.0
             </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
             <h4 className="text-[11px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Subscription Policy
             </h4>
             <ul className="space-y-3">
                {[
                    "Instant access to strategy file download",
                    "Real-time signal notifications via WhatsApp",
                    "Detailed trade execution logs in dashboard",
                    "7-Day 'No Questions Asked' Full Refund"
                ].map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-white/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                        {p}
                    </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Right Column: Summarization & Pay */}
        <div className="relative">
            <div className="sticky top-[100px] space-y-6">
                <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 blur-3xl opacity-50" />
                    
                    <h2 className="text-xl font-bold text-white mb-6">Payment Summary</h2>

                    {error && (
                        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl uppercase tracking-widest">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-6 mb-8">
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <div>
                                <h4 className="text-[13px] font-black text-white">{strategy ? strategy.name : 'Monthly Platform Access'}</h4>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{strategyId ? 'STRATEGY LICENSE' : 'ALL-ACCESS PASS'}</span>
                            </div>
                            <span className="text-lg font-black text-[#FFD700]">₹{strategy ? strategy.monthly_price_inr : 1999}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px] font-bold text-white/30">
                            <span>PLATFORM FEES</span>
                            <span>₹0.00</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xl font-black text-white pt-2">
                            <span>TOTAL DUE</span>
                            <span>₹{strategy ? strategy.monthly_price_inr : 1999}</span>
                        </div>
                    </div>

                    <div className="flex items-start mb-8 gap-3">
                        <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-white/10 bg-white/5 accent-[#FFD700]" id="terms" defaultChecked readOnly />
                        <label htmlFor="terms" className="text-[9px] font-bold text-white/20 leading-relaxed uppercase tracking-widest">
                            By paying, you agree to the <Link href="/terms" className="underline hover:text-[#FFD700]">Terms</Link> and <Link href="/refund" className="underline hover:text-[#FFD700]">Refund Policy</Link>.
                        </label>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-black font-black uppercase tracking-[0.1em] text-[13px] shadow-[0_15px_40px_rgba(255,165,0,0.2)] disabled:opacity-50"
                    >
                        {loading ? 'INITIALIZING TERMINAL...' : `Pay ₹${strategy ? strategy.monthly_price_inr : 1999} Securely`}
                    </motion.button>
                    
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.2em] mb-2">Supported Channels</span>
                        <div className="flex justify-center flex-wrap gap-4 text-white/40 font-bold text-xs uppercase tracking-widest">
                            <span>UPI</span> <span>•</span> <span>Cards</span> <span>•</span> <span>Net Banking</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 text-center">
                    <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest leading-relaxed">
                        SECURED BY TRUSTED GATEWAYS · NO CARD DATA IS STORED ON OUR SERVERS · ISO 27001 COMPLIANT
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#080C14]">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
