'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Bot, 
  Zap, 
  TrendingUp, 
  Target, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  PlayCircle,
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
  Lock,
  Globe,
  Cpu,
  Layers,
  Star,
  BadgeCheck,
  Quote,
  CreditCard,
  Image as LucideImage
} from 'lucide-react';
import Link from 'next/link';

interface PremiumViewProps {
  strategy: any;
  creator: any;
  stats: any;
  handleSubscribe: () => void;
  isSubscribing: boolean;
  legalAccepted: boolean;
  setLegalAccepted: (val: boolean) => void;
  isUserSubscribed: boolean;
}

export default function PremiumStrategyView({ 
  strategy, 
  creator, 
  stats, 
  handleSubscribe, 
  isSubscribing, 
  legalAccepted, 
  setLegalAccepted,
  isUserSubscribed 
}: PremiumViewProps) {
  const [selectedImg, setSelectedImg] = useState(0);
  const activeTestimonials = strategy.testimonials?.length > 0 ? strategy.testimonials : [];

  return (
    <div className="min-h-screen bg-[#06080E] text-white font-sans selection:bg-[#FFD700] selection:text-black pb-40">
      
      {/* 1. INSTITUTIONAL HERO HEADER */}
      <section className="relative pt-24 pb-32 md:pb-48 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFD700]/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="w-full px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 items-center">
            
            <div className="lg:col-span-9 space-y-10">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-wrap items-center gap-4"
               >
                  <div className="px-6 py-2 bg-[#FFD700] text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl skew-x-[-12deg] flex items-center gap-2">
                     <Lock className="w-3.5 h-3.5" /> OFFICIAL RELEASE
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
                     <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_12px_#00E676]" />
                     <span className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.2em] italic">NODE VERIFIED</span>
                  </div>
               </motion.div>

                <div className="space-y-4">
                   <motion.h1 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1 }}
                     className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tight leading-tight"
                   >
                      {strategy.name}
                   </motion.h1>
                   <motion.p 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="text-[12px] md:text-[16px] text-[#FFD700] font-black italic uppercase tracking-[0.2em] font-sans"
                   >
                      {strategy.symbol || 'UNIVERSAL'} // {strategy.timeframe || 'H1'} // INSTITUTIONAL GRADE
                   </motion.p>
                </div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl"
               >
                   {[
                      { l: 'WIN RATE', v: stats.winRate, u: '%', c: '#00E676' },
                      { l: 'MAX DD', v: stats.maxDrawdown, u: '%', c: '#FF5252' },
                      { l: 'AVG GAIN', v: stats.avgGain, u: '%', c: '#00B0FF' },
                      { l: 'HEARTBEAT', v: '99.9', u: '%', c: '#FFD700' }
                   ].map((s, i) => (
                      <div key={i} className="space-y-2 group">
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] group-hover:text-white/40 transition-colors">{s.l}</p>
                         <p className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter" style={{ color: s.c }}>{s.v}{s.u}</p>
                      </div>
                   ))}
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="flex flex-col sm:flex-row items-center gap-8 pt-6"
               >
                  <button 
                    onClick={handleSubscribe}
                    disabled={isSubscribing || !legalAccepted}
                    className="w-full sm:w-auto px-12 py-5 bg-[#FFD700] text-black font-black uppercase text-[12px] tracking-[0.4em] rounded-[24px] shadow-2xl shadow-[#FFD700]/30 hover:scale-[1.05] transition-all italic flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
                  >
                     {isSubscribing ? 'PROCESSING...' : 'ACCESS THIS STRATEGY'} <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-6">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Secure Payment Handshake</p>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                              <span className="text-[9px] font-black text-white/40 italic uppercase">UPI</span>
                           </div>
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                              <CreditCard className="w-3 h-3 text-white/40" />
                              <span className="text-[9px] font-black text-white/40 italic uppercase">CARDS</span>
                           </div>
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00E676]/5 border border-[#00E676]/20 rounded-lg">
                              <ShieldCheck className="w-3 h-3 text-[#00E676]" />
                              <span className="text-[9px] font-black text-[#00E676] italic uppercase">Cashfree</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-3 hidden lg:flex justify-center"
            >
                <div className="relative w-full aspect-square max-w-[400px]">
                   <div className="absolute inset-0 bg-[#FFD700]/10 blur-[150px] rounded-full animate-pulse" />
                   <div className="relative w-full h-full bg-[#131929]/80 border border-white/10 rounded-[100px] flex items-center justify-center backdrop-blur-3xl shadow-2xl relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      <Bot className="w-52 h-52 text-[#FFD700] drop-shadow-[0_0_50px_rgba(255,215,0,0.4)] group-hover:scale-105 transition-transform duration-1000" />
                   </div>
                </div>
            </motion.div>
        </div>
      </section>

      <main className="w-full px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
         
         {/* LEFT CONTENT */}
          <div className="lg:col-span-9 space-y-24">
            
             {/* 1.5 OPERATIONAL BRIEFING */}
             <section className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFD700]/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                   <div className="space-y-4 max-w-3xl">
                      <div className="flex items-center gap-3">
                         <FileText className="w-4 h-4 text-[#FFD700]" />
                         <span className="text-[11px] font-black text-[#FFD700] uppercase tracking-[0.4em]">About this Bot</span>
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">How <span className="text-white/40">it Works</span></h2>
                      <p className="text-[14px] leading-relaxed text-white/50 font-medium italic">
                         {strategy.description || 'This institutional-grade node is configured for high-precision execution across volatile sessions. It utilizes a proprietary logic chain to ensure minimal slippage and maximum operational uptime.'}
                      </p>
                   </div>
                   
                   <button className="shrink-0 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all group/btn">
                      <PlayCircle className="w-5 h-5 text-[#FFD700] group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Watch Video Tutorial</span>
                   </button>
                </div>
             </section>

             {/* 2. PERFORMANCE GALLERY (PRIMARY DECISION POINT) */}
             <section className="space-y-10">
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-[#FFD700]" />
                      <span className="text-[11px] font-black text-[#FFD700] uppercase tracking-[0.4em]">Trading Proof</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Screenshots <span className="text-white/40">& Results</span></h2>
                </div>

                <div className="space-y-8">
                   <div className="relative aspect-[16/10] w-full bg-[#131929] rounded-[48px] overflow-hidden border border-white/10 group shadow-2xl shadow-black/50">
                      {selectedImg === 2 && strategy.video_url ? (
                         <div className="w-full h-full relative cursor-pointer group/video" onClick={() => window.open(strategy.video_url, '_blank')}>
                            <img 
                               src={strategy.thumbnail_url || strategy.screenshot_urls?.[0] || '/video-placeholder.png'} 
                               className="w-full h-full object-cover group-hover/video:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                               <div className="w-24 h-24 rounded-full bg-[#FFD700] flex items-center justify-center shadow-2xl scale-100 group-hover/video:scale-110 transition-transform">
                                  <PlayCircle className="w-10 h-10 text-black ml-1" />
                               </div>
                            </div>
                            <div className="absolute top-8 left-8 bg-[#FFD700] text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest">
                               Tutorial Promo
                            </div>
                         </div>
                      ) : strategy.screenshot_urls?.[selectedImg] ? (
                         <img src={strategy.screenshot_urls[selectedImg]} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#131929] to-[#0A1A3A]"><Sparkles className="w-12 h-12 text-white/5" /></div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-transparent to-transparent flex items-end p-10 md:p-16">
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] italic">
                               {selectedImg === 2 ? 'Live System Feed' : `System Capture 0${selectedImg + 1}`}
                            </span>
                            <h4 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                               {selectedImg === 0 ? 'Live Execution Hub' : selectedImg === 1 ? 'Alpha Precision Metric' : 'Real-Time Trade Stream'}
                            </h4>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 md:gap-8">
                      {[0, 1, 2].map((i) => (
                         <button 
                            key={i} 
                            onClick={() => setSelectedImg(i)}
                            className={`h-24 md:h-40 rounded-[24px] md:rounded-[32px] overflow-hidden border-2 transition-all flex flex-col items-center justify-center gap-2 ${selectedImg === i ? 'border-[#FFD700] scale-105 shadow-2xl shadow-[#FFD700]/10 bg-white/5' : 'border-white/5 opacity-40 hover:opacity-100 bg-black/20'}`}
                         >
                            {i === 2 ? (
                               <PlayCircle className={`w-8 h-8 md:w-10 md:h-10 ${selectedImg === i ? 'text-[#FFD700]' : 'text-white/20'}`} />
                            ) : (
                               <LucideImage className={`w-8 h-8 md:w-10 md:h-10 ${selectedImg === i ? 'text-[#FFD700]' : 'text-white/20'}`} />
                            )}
                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedImg === i ? 'text-[#FFD700]' : 'text-white/20'}`}>
                               {i === 2 ? 'Video' : `Proof ${i + 1}`}
                            </span>
                         </button>
                      ))}
                   </div>
                </div>
             </section>

             {/* 3. LOGIC DEEP DIVE (COMPACT ACCESSORIES) */}
             <section className="space-y-10 pt-10 border-t border-white/5">
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-[#FFD700]" />
                      <span className="text-[11px] font-black text-[#FFD700] uppercase tracking-[0.4em]">Key Features</span>
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Why Choose <span className="text-white/40">This Bot?</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 group hover:border-[#FFD700]/20 transition-all flex items-start gap-6">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-[#FFD700] border border-white/5">
                         <Cpu className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-[14px] font-black text-white uppercase italic tracking-tight">Advanced Algorithm</h4>
                         <p className="text-[11px] text-white/30 font-bold leading-relaxed italic uppercase tracking-wider">
                            Proprietary execution logic built to handle high-volatility sessions with minimal slippage.
                         </p>
                      </div>
                   </div>
                   <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 group hover:border-[#00E676]/20 transition-all flex items-start gap-6">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-[#00E676] border border-white/5">
                         <Layers className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-[14px] font-black text-white uppercase italic tracking-tight">Managed Execution</h4>
                         <p className="text-[11px] text-white/30 font-bold leading-relaxed italic uppercase tracking-wider">
                            Direct broadcast to your brokerage terminal via our dedicated server infrastructure.
                         </p>
                      </div>
                   </div>
                </div>
             </section>


             {/* 3.5 COMMUNITY TRUST WALL (REVIEWS) */}
             <section className="space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <span className="w-8 h-[1px] bg-[#FFD700]" />
                         <span className="text-[11px] font-black text-[#FFD700] uppercase tracking-[0.4em]">Proof of Excellence</span>
                      </div>
                      <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Community <span className="text-white/40">Trust Wall</span></h2>
                   </div>
                   <div className="hidden md:block pb-2">
                      <p className="text-[12px] font-bold text-white/20 uppercase tracking-[0.2em] italic text-right">
                         {activeTestimonials.length} Verified Narratives <br />
                         <span className="text-[#00E676]">99.9% Uptime Verified</span>
                      </p>
                   </div>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                   {activeTestimonials.map((rev: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="break-inside-avoid mb-6 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6 hover:bg-white/[0.04] hover:border-[#FFD700]/20 transition-all group relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Quote className="w-12 h-12 text-[#FFD700]" />
                         </div>

                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex gap-0.5">
                               {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={`w-3 h-3 ${j < rev.r ? 'text-[#FFD700] fill-[#FFD700]' : 'text-white/10'}`} />
                               ))}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00E676]/5 border border-[#00E676]/10 rounded-full">
                               <BadgeCheck className="w-3 h-3 text-[#00E676]" />
                               <span className="text-[9px] font-black text-[#00E676] uppercase tracking-widest">VERIFIED</span>
                            </div>
                         </div>

                         <p className="text-[13px] text-white/50 font-medium italic leading-relaxed relative z-10">"{rev.t}"</p>

                         <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="space-y-0.5">
                               <p className="text-[12px] font-black text-white italic group-hover:text-[#FFD700] transition-colors">{rev.n}</p>
                               <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{rev.l}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-white/10 flex items-center justify-center group-hover:border-[#FFD700]/30 transition-all">
                               <span className="text-[11px] font-black text-[#FFD700]">{rev.n[0]}</span>
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>
             </section>

             {/* 4. FINAL CALL TO ACTION (FOR CONVERSION) */}
             <section className="mt-20 p-12 rounded-[48px] bg-gradient-to-br from-[#111624] to-[#06080E] border border-[#FFD700]/20 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                   <div className="space-y-6 text-center lg:text-left">
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                         <Zap className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                         <span className="text-[12px] font-black text-[#FFD700] uppercase tracking-[0.4em]">Ready to Deploy?</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                         Activate Your <br className="hidden md:block" /> <span className="text-[#FFD700]">Profit Node</span> Today
                      </h2>
                      <p className="text-[16px] text-white/40 font-bold italic uppercase tracking-wider">
                         Joined by 1,400+ active retailers on the Coppr network.
                      </p>
                   </div>
                   
                   <div className="flex flex-col items-center lg:items-end gap-8 bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl">
                      <div className="text-center lg:text-right space-y-1">
                         <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em]">Subscription Fee</p>
                         <p className="text-5xl font-black text-white italic tracking-tighter">₹{strategy.monthly_price_inr}<span className="text-xl text-white/20 uppercase">/mo</span></p>
                      </div>
                      <button 
                         onClick={handleSubscribe}
                         disabled={isSubscribing || !legalAccepted}
                         className="px-16 py-6 bg-[#FFD700] text-black font-black uppercase text-[12px] tracking-[0.4em] rounded-[24px] shadow-2xl shadow-[#FFD700]/30 hover:scale-[1.05] transition-all italic flex items-center gap-4 disabled:opacity-20"
                      >
                         {isSubscribing ? 'PROCESSING...' : 'ACCESS THIS STRATEGY'} <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             </section>

          </div>

          {/* RIGHT SIDEBAR: ACTION CENTER */}
          <aside className="lg:col-span-3 space-y-10">
             
             <div className="sticky top-12 p-10 rounded-[40px] bg-[#111624] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] space-y-10 relative overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" />
                
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Subscription Fee</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#00E676]/5 border border-[#00E676]/10 rounded-full">
                         <div className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
                         <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.1em]">SECURE</span>
                      </div>
                   </div>
                   <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none">₹{strategy.monthly_price_inr}</span>
                      <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic">/ Billing Cycle</span>
                   </div>
                </div>

                <div className="relative z-10 space-y-8">
                   <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.03] space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="mt-1 relative flex items-center justify-center shrink-0">
                            <input 
                               type="checkbox" 
                               id="legal"
                               checked={legalAccepted}
                               onChange={(e) => setLegalAccepted(e.target.checked)}
                               className="peer appearance-none w-5 h-5 border-2 border-white/10 rounded-md checked:bg-[#FFD700] checked:border-[#FFD700] transition-all cursor-pointer" 
                            />
                            <CheckCircle2 className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                         </div>
                         <label htmlFor="legal" className="text-[10px] font-bold text-white/30 uppercase leading-relaxed italic cursor-pointer hover:text-white/50 transition-colors">
                            I accept the high-volatility activation protocol. Past performance is not indicative of future node results.
                         </label>
                      </div>
                   </div>

                   <button 
                     onClick={handleSubscribe}
                     disabled={isSubscribing || !legalAccepted}
                     className="w-full py-5 bg-[#FFD700] text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[20px] shadow-2xl shadow-[#FFD700]/10 hover:shadow-[#FFD700]/20 hover:scale-[1.01] active:scale-[0.98] transition-all italic flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                   >
                      {isSubscribing ? 'PROCESSING...' : isUserSubscribed ? 'ACTIVE ✓' : 'ACCESS THIS STRATEGY'}
                   </button>

                   <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-3">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] text-center italic">Verified Transaction Handshake</p>
                      <div className="flex items-center justify-center gap-4">
                         <span className="text-[10px] font-black text-white/40 uppercase italic px-2 py-1 bg-black/20 rounded">UPI</span>
                         <CreditCard className="w-3.5 h-3.5 text-white/20" />
                         <div className="h-3 w-[1px] bg-white/10" />
                         <span className="text-[9px] font-black text-[#00E676] uppercase italic tracking-widest border border-[#00E676]/20 px-2 py-1 rounded">CASHFREE</span>
                      </div>
                   </div>

                   <div className="space-y-4 pt-2">
                      {[
                         { icon: ShieldCheck, t: 'Verified Mirroring SLA' },
                         { icon: Activity, t: 'Live Heartbeat Pulse' },
                         { icon: Lock, t: 'Encrypted Credential Sync' },
                         { icon: Sparkles, t: 'Official Discord' }
                      ].map((item, i) => (
                         <div key={i} className="flex items-center gap-3.5 px-1 border-b border-white/[0.02] pb-3 last:border-0">
                            <item.icon className="w-3.5 h-3.5 text-[#FFD700]/50" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">{item.t}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="relative z-10 pt-4 text-center">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-relaxed">
                       Verified by <span className="text-white/40">Coppr Institutional</span>
                    </p>
                </div>
             </div>
          </aside>

      </main>

    </div>
  );
}
