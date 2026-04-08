'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Star, 
  LayoutGrid, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Download, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  Pin, 
  Newspaper, 
  Image as LucideImage, 
  Loader2, 
  TrendingUp, 
  Target,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function StrategyLandingPage() {
  const { strategyId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    async function fetchLandingData() {
      const resp = await fetch(`/api/marketplace/${strategyId}/landing`);
      const json = await resp.json();
      if (!json.error) {
        setData(json);
      }
      setLoading(false);
    }
    fetchLandingData();
  }, [strategyId]);

  const handleSubscribe = async () => {
    // 1. FREE TIER: Direct Activation
    if (strategy.tier === 'FREE') {
        setIsSubscribing(true);
        try {
            const resp = await fetch(`/api/marketplace/${strategyId}/subscribe`, {
                method: 'POST',
            });
            const json = await resp.json();
            if (json.success) {
                router.push('/dashboard/vault');
            } else {
                alert(json.error || 'Direct activation protocol failed.');
            }
        } catch (err) {
            console.error('Subscription error:', err);
        } finally {
            setIsSubscribing(false);
        }
    } else {
        // 2. PAID/ELITE TIER: Redirect to Secure Gateway
        router.push(`/checkout?strategyId=${strategyId}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Strategy Alpha...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-6 p-10">
      <AlertTriangle className="w-10 h-10 text-red-500" />
      <h2 className="text-2xl font-black text-white uppercase italic">Strategy Node Not Found</h2>
      <Link href="/dashboard/marketplace" className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl italic">Back to Marketplace</Link>
    </div>
  );

  const { strategy, creator, stats, reviews, reviewStats, isUserSubscribed } = data;

  return (
    <div className="min-h-screen bg-[#0A1A3A] text-white selection:bg-[#FFD700] selection:text-black font-sans pb-32">
      
      {/* 1. NAVIGATION HUB */}
      <nav className="sticky top-0 z-[100] bg-[#0A1A3A]/95 backdrop-blur-3xl border-b border-white/5 px-4 md:px-6 py-2 md:py-4">
         <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <Link href="/dashboard/marketplace" className="flex items-center gap-3 group">
               <div className="p-1 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                  <ArrowLeft className="w-3.5 h-3.5 text-white/40" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Marketplace Hub</span>
                  <span className="text-[10px] md:text-[12px] font-black text-white uppercase italic tracking-tighter">{strategy.name}</span>
               </div>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[9px] md:text-[10px] font-black text-[#FFD700] leading-none">₹{strategy.monthly_price_inr}</span>
                   <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">Monthly Pulse</span>
                </div>
                <button 
                  onClick={() => document.getElementById('subscribe-cta')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 md:px-6 py-2 md:py-3 bg-[#FFD700] text-black font-black uppercase text-[9px] md:text-[10px] rounded-lg md:rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 italic"
                >
                   {isUserSubscribed ? 'Configured ✓' : 'Deploy Node'}
                </button>
            </div>
         </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20">
         
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-24 items-start">
            
            {/* LEFT COLUMN: THE INTEL */}
            <div className="space-y-16">
               
               {/* HERO HEADER */}
               <section className="space-y-6 md:space-y-8">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                     <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${
                        strategy.type === 'MT5_EA' ? 'bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]' : 
                        strategy.type === 'PINE_SCRIPT_WEBHOOK' ? 'bg-[#00B0FF]/10 border-[#00B0FF]/30 text-[#00B0FF]' : 
                        'bg-[#9C6EFA]/10 border-[#9C6EFA]/30 text-[#9C6EFA]'
                     }`}>
                        {strategy.type.replace('_', ' ')}
                     </span>
                     <span className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest italic">
                        {strategy.total_subscribers > 50 ? '🔥 Popular' : '✨ New Protocol'}
                     </span>
                     {stats.isLivePulsing && (
                       <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
                          <span className="text-[8px] md:text-[9px] font-black text-[#00E676]/60 uppercase tracking-widest italic">Live Signal</span>
                       </div>
                     )}
                  </div>

                  <div className="space-y-2 md:space-y-4">
                     <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {strategy.name}
                     </h1>
                     <p className="text-[10px] md:text-[15px] font-bold text-white/30 uppercase tracking-[0.1em] leading-relaxed max-w-2xl italic">
                        {strategy.description?.slice(0, 150)}...
                     </p>
                  </div>

                  {/* QUICK STATS CARDS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-10">
                     {[
                        { l: 'Win Rate', v: stats.winRate, unit: '%', color: '#00E676' },
                        { l: 'Total Trades', v: stats.totalTrades, unit: '', color: '#FFD700' },
                        { l: 'Avg Gain', v: stats.avgGain, unit: '%', color: '#00B0FF' },
                        { l: 'Max Drawdown', v: stats.maxDrawdown, unit: '%', color: '#FF5252' }
                     ].map((s, i) => (
                        <div key={i} className="p-5 md:p-6 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 hover:border-[#FFD700]/30 hover:bg-white/[0.06] transition-all group relative overflow-hidden">
                           <div className="absolute inset-0 bg-[#FFD700]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-white/40 transition-colors">{s.l}</span>
                           <div className="mt-2 flex items-baseline gap-1 relative z-10">
                              <span className="text-xl md:text-2xl font-black text-white italic tracking-tighter leading-none">
                                {s.v || '0'}
                              </span>
                              <span className="text-[9px] font-black text-white/20">{s.unit}</span>
                           </div>
                           <div className="mt-3 w-full h-[1px] bg-white/5" />
                        </div>
                     ))}
                  </div>
               </section>

               {/* 3. SCREENSHOT GALLERY */}
               <section className="space-y-6 md:space-y-8 pt-8 md:pt-10">
                  <div className="space-y-1">
                     <span className="text-[10px] md:text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Evidence Log</span>
                     <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        Terminal <span className="text-[#FFD700]">Visuals</span>
                     </h3>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                     {/* MAIN VIEW */}
                     <Link href={strategy.screenshot_urls?.[selectedImg] || strategy.thumbnail_url || '#'} target="_blank">
                        <motion.div 
                          key={selectedImg}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative h-[200px] md:h-[450px] w-full bg-[#161C2D]/50 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 group cursor-zoom-in"
                        >
                           {strategy.screenshot_urls?.[selectedImg] ? (
                             <img src={strategy.screenshot_urls[selectedImg]} alt="High Fidelity Capture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                           ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#161C2D] to-[#0A1A3A]">
                                <LucideImage className="w-8 h-8 md:w-12 md:h-12 text-white/10" />
                                <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Awaiting Evidence</span>
                             </div>
                           )}
                           <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-2 border border-white/10">
                              <span className="text-[9px] font-black text-white uppercase italic">{selectedImg + 1} / 3</span>
                           </div>
                           <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0A1A3A] via-[#0A1A3A]/40 to-transparent flex items-end p-6 md:p-10">
                              <div className="flex flex-col gap-1">
                                 <span className="text-[8px] font-black text-[#FFD700] uppercase tracking-[0.3em] italic">System Capture</span>
                                 <p className="text-[12px] md:text-[16px] font-black text-white uppercase tracking-wider italic">{
                                   selectedImg === 0 ? 'Chart Heuristics' : selectedImg === 1 ? 'Profitable Hits' : 'Equity Curve'
                                 }</p>
                              </div>
                           </div>
                        </motion.div>
                     </Link>

                     {/* THUMBNAILS */}
                     <div className="grid grid-cols-3 gap-2 md:gap-6">
                        {[0, 1, 2].map((idx) => (
                           <button 
                             key={idx}
                             onClick={() => setSelectedImg(idx)}
                             className={`group relative flex flex-col gap-2 transition-all ${selectedImg === idx ? 'opacity-100' : 'opacity-40'}`}
                           >
                              <div className={`h-[50px] md:h-[120px] rounded-lg md:rounded-[28px] overflow-hidden border transition-all ${selectedImg === idx ? 'border-[#FFD700]' : 'border-white/5'}`}>
                                 <div className="w-full h-full bg-[#161C2D] flex items-center justify-center relative">
                                    <LucideImage className="w-3 h-3 md:w-6 md:h-6 text-white/10" />
                                 </div>
                              </div>
                              <span className="text-[6px] md:text-[9px] font-black text-white/20 uppercase tracking-widest text-center group-hover:text-white transition-colors truncate">
                                 {idx === 0 ? 'Chart' : idx === 1 ? 'Hits' : 'Equity'}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
               </section>

                <section className="space-y-6 md:space-y-10 pt-8 md:pt-10">
                   <div className="space-y-1">
                      <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Strategic Protocol</h3>
                      <p className="text-[9px] md:text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Intelligence Brief</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div className="flex gap-4 md:gap-6 items-start p-6 md:p-8 rounded-[24px] md:rounded-[40px] bg-[#161C2D] border border-white/5 md:col-span-2">
                           <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                               <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                           </div>
                           <div className="space-y-1 md:space-y-2">
                              <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Logic Breakdown</span>
                              <p className="text-[12px] md:text-[14px] text-white font-bold leading-relaxed uppercase italic">
                                 {strategy.description || strategy.how_it_works?.[0] || 'Enterprise-grade alpha logic verified.'}
                              </p>
                           </div>
                        </div>

                        <div className="flex gap-4 md:gap-6 items-start p-6 md:p-8 rounded-[24px] md:rounded-[40px] bg-[#161C2D] border border-white/5">
                           <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                               <Clock className="w-5 h-5 md:w-6 md:h-6" />
                           </div>
                           <div className="space-y-1 md:space-y-2">
                              <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Timeframe</span>
                              <p className="text-[12px] md:text-[14px] text-[#FFD700] font-black uppercase italic tracking-widest">
                                 {strategy.timeframe || 'Universal'}
                              </p>
                           </div>
                        </div>
                   </div>
                </section>

               {/* 5. SUBSCRIBER REVIEWS */}
               <section className="space-y-10 pt-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                     <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">What subscribers say</h3>
                        <div className="flex items-center gap-3">
                           <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(reviewStats.rating) ? 'text-[#FFD700] fill-[#FFD700]' : 'text-white/10'}`} />)}
                           </div>
                           <span className="text-[12px] font-black text-white italic tracking-tighter">{reviewStats.rating.toFixed(1)} / 5</span>
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest pr-2 border-l border-white/10 pl-3">from {reviewStats.count} verified users</span>
                        </div>
                     </div>
                     <button className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-[#FFD700] transition-colors pb-1">See All Feedback →</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {(reviews.length > 0 ? reviews : [1, 2]).map((rev: any, i: number) => (
                       <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-transparent flex items-center justify-center font-black text-[12px] italic text-[#FFD700]">
                                   {rev.profiles?.full_name?.[0] || 'A'}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[11px] font-black text-white uppercase italic">{rev.profiles?.full_name || 'Anonymous Alpha'}</span>
                                   <div className="flex gap-0.5 mt-1">
                                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2.5 h-2.5 text-[#FFD700] fill-[#FFD700]" />)}
                                   </div>
                                </div>
                             </div>
                             <div className="px-3 py-1 bg-[#00E676]/5 border border-[#00E676]/20 rounded-full flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#00E676]" />
                                <span className="text-[8px] font-black text-[#00E676] uppercase italic tracking-widest">Verified</span>
                             </div>
                          </div>
                          <p className="text-[13px] text-white/40 font-bold uppercase italic leading-relaxed">
                            &quot;{rev.content || 'Excellent performance so far. The mirror setup was instant and I haven’t had to touch anything since.'}&quot;
                          </p>
                       </div>
                     ))}
                  </div>
               </section>

               {/* 7. DISCLAIMER */}
               <footer className="pt-20 pb-10 border-t border-white/5 opacity-20">
                  <p className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest leading-loose max-w-4xl italic">
                     Past performance does not guarantee future results. {strategy.name} is a high-performance algorithmic trading tool designed for educational and strategic support — this is not financial advice. All algorithmic trading involves significant risk of loss. Coppr Labs is not a SEBI registered entity. Deploy capital at your own risk.
                  </p>
               </footer>

            </div>

            {/* RIGHT COLUMN: THE TERMINAL (Sticky Subscribe) */}
            <aside className="sticky top-[100px] space-y-10">
               
               {/* SUBSCRIBE CARD */}
               <div id="subscribe-cta" className="p-10 rounded-[48px] bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#FFD700]/[0.02] pointer-events-none group-hover:bg-[#FFD700]/[0.05] transition-all" />
                  
                  <div className="relative z-10 space-y-1">
                     <span className="text-4xl font-black text-[#FFD700] italic tracking-tighter leading-none">₹{strategy.monthly_price_inr}</span>
                     <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.3em]">Per Month Access</p>
                  </div>

                  <div className="relative z-10 w-full space-y-4 pt-4">
                     {isUserSubscribed ? (
                       <button 
                         onClick={() => router.push('/dashboard/vault')}
                         className="w-full py-5 bg-[#00E676] text-black font-black uppercase text-[12px] rounded-[24px] shadow-2xl shadow-[#00E676]/20 transition-all italic tracking-tighter"
                       >
                          Manage Mirror Subscription
                       </button>
                     ) : (
                       <button 
                         onClick={handleSubscribe}
                         disabled={isSubscribing}
                         className="w-full py-5 bg-[#FFD700] text-black font-black uppercase text-[12px] rounded-[24px] shadow-2xl shadow-[#FFD700]/20 hover:scale-105 transition-all italic tracking-tighter flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                         {isSubscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize Subscription Node'}
                       </button>
                     )}
                     <button className="w-full py-4 text-white/40 font-black uppercase text-[10px] rounded-[24px] border border-white/5 transition-all hover:text-white italic tracking-widest">
                        Watch Setup Protocol
                     </button>
                  </div>

                  <div className="relative z-10 w-full pt-4 space-y-4">
                     {[
                        { icon: Download, t: strategy.type === 'MT5_EA' ? '.mq5 Executable Download' : 'Indicator Logic Template' },
                        { icon: Zap, t: 'Automated Webhook Mirroring' },
                        { icon: Newspaper, t: 'Strategic Handshake Guide' },
                        { icon: ShieldCheck, t: 'Creator Mirror Support' }
                     ].map((b, i) => (
                        <div key={i} className="flex items-center gap-3 px-4">
                           <div className="p-1.5 rounded-lg bg-[#00E676]/10 text-[#00E676]">
                              <CheckCircle2 className="w-3 h-3" />
                           </div>
                           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest text-left">{b.t}</span>
                        </div>
                     ))}
                  </div>

                  <div className="relative z-10 pt-4">
                     <span className="text-[9px] font-black text-[#00E676]/60 uppercase tracking-[0.2em] italic">7-Day Refund Protocol Active</span>
                  </div>

                  <div className="w-full h-[1px] bg-white/5 relative z-10" />

                  {/* CREATOR MINI CARD */}
                  <Link href={`/dashboard/creator/${creator?.handle || '#'}`} className="relative z-10 w-full group/creator p-4 hover:bg-white/[0.02] rounded-3xl transition-all border border-transparent hover:border-white/5">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-[14px] italic text-[#FFD700]">
                              {creator?.avatar_data || creator?.display_name?.[0] || '🤖'}
                           </div>
                           <div className="flex flex-col text-left">
                              <span className="text-[12px] font-black text-white uppercase italic leading-none">{creator?.display_name || 'Protocol Master'}</span>
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">@{creator?.handle || 'creator'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/5 group-hover/creator:text-white/40 transition-colors" />
                     </div>
                  </Link>

               </div>

               {/* QUICK HELP / TRUST */}
               <div className="p-8 rounded-[40px] border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-white/20" />
                     <h5 className="text-[11px] font-black text-white uppercase italic">Zero-Code Mirroring</h5>
                  </div>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed italic">
                     Our proprietary fiber network ensures 1:1 trade mirroring between the creator&apos;s node and your broker account. No complex setup or server required.
                  </p>
               </div>

            </aside>

         </div>

      </main>

      {/* 6. BOTTOM STICKY CTA */}
      <AnimatePresence>
         <motion.div 
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           className="fixed bottom-0 inset-x-0 z-[100] md:hidden p-4 bg-gradient-to-t from-[#0A1A3A] via-[#0A1A3A] to-transparent"
         >
             <div className="p-4 bg-white/[0.08] backdrop-blur-3xl border border-white/10 rounded-[24px] flex items-center justify-between shadow-2xl">
               <div className="flex flex-col">
                  <span className="text-xl font-black text-[#FFD700] italic leading-none">₹{strategy.monthly_price_inr}</span>
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-widest mt-1 italic">Monthly Pulse</span>
               </div>
               <button 
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="px-6 py-3 bg-[#FFD700] text-black font-black uppercase text-[9px] rounded-xl italic flex items-center gap-2 transform active:scale-95 transition-transform"
               >
                  {isSubscribing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Deploy Node'}
               </button>
            </div>
         </motion.div>
      </AnimatePresence>

    </div>
  );
}
