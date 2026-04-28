'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Bot, 
  MousePointer2, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Smartphone, 
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Bitcoin
} from 'lucide-react';

export default function HighFidelityHowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sequence Timing Logic (4 Steps)
  useEffect(() => {
    if (isLoading) return;
    
    let timer: NodeJS.Timeout;
    if (step === 1) timer = setTimeout(() => setStep(2), 2200); // 1: Choose Bot
    else if (step === 2) timer = setTimeout(() => setStep(3), 2200); // 2: Link Broker
    else if (step === 3) timer = setTimeout(() => setStep(4), 2500); // 3: Choose Asset
    else if (step === 4) timer = setTimeout(() => setStep(1), 4500); // 4: Profit Loop
    
    return () => clearTimeout(timer);
  }, [step, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] gap-4 min-h-[400px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-[#FFD700]/20 rounded-full" />
          <motion.div 
            className="absolute inset-0 border-2 border-t-[#FFD700] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] animate-pulse">Opening Data Conduits...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#050505] font-sans overflow-hidden p-0">
      
      {/* MAIN MOCKUP CONTAINER */}
      <div className="relative w-full h-full flex flex-col bg-[#0A0C10]">
          
          {/* Header Bar */}
          <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-6 gap-4 z-20">
              <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF4B4B]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00E676]/40" />
              </div>
              <div className="flex-1" />
          </div>

          {/* ANIMATION STAGE */}
          <div className="relative flex-1 flex items-center justify-center p-6">
              
              <AnimatePresence mode="wait">
                  
                  {/* STEP 1: CHOOSE BOT */}
                  {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                      >
                         <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Choose Your <span className="text-[#FFD700]">Bot</span></h3>
                         
                         <div className="w-full max-w-[280px] relative group scale-90 md:scale-100">
                             <div className="p-6 rounded-[32px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
                                 <div className="flex items-center justify-between mb-6">
                                     <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
                                         <Bot className="w-6 h-6 text-[#FFD700]" />
                                     </div>
                                     <div className="px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20">
                                         <span className="text-[8px] font-black text-[#FFD700] uppercase">Official</span>
                                     </div>
                                 </div>
                                 <div className="text-left space-y-1 mb-8">
                                     <h4 className="text-xl font-black text-white uppercase">Coppr Alpha</h4>
                                     <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Global Momentum • Live</p>
                                 </div>
                                 <div className="w-full h-12 rounded-xl bg-[#FFD700] flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                                     <span className="text-black font-black uppercase tracking-widest text-[10px]">Select Bot</span>
                                 </div>
                             </div>

                             {/* Calibrated Cursor for Step 1 */}
                             <motion.div 
                                className="absolute -bottom-4 -right-4 z-50 pointer-events-none"
                                initial={{ x: 150, y: 150, opacity: 0 }}
                                animate={{ x: -20, y: -45, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                             >
                                <MousePointer2 className="w-10 h-10 text-white fill-black rotate-[-15deg] drop-shadow-lg" />
                                <motion.div 
                                   className="absolute top-0 left-0 w-6 h-6 rounded-full bg-white/40 blur-md -z-10"
                                   initial={{ scale: 0, opacity: 0 }}
                                   animate={{ scale: [0, 3, 0], opacity: [0, 1, 0] }}
                                   transition={{ duration: 0.3, delay: 0.8 }} 
                                />
                             </motion.div>
                         </div>
                      </motion.div>
                  )}

                  {/* STEP 2: LINK BROKER (Cursor Removed per Feedback) */}
                  {step === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
                      >
                         <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Link <span className="text-[#FFD700]">Broker</span></h3>
                         
                         <div className="w-full max-w-[320px] p-8 rounded-[40px] bg-black/60 border border-white/10 shadow-2xl relative overflow-hidden">
                             <div className="grid grid-cols-1 gap-3 w-full">
                                 {[
                                   { name: 'MetaTrader (MT5)', icon: Smartphone },
                                   { name: 'Zerodha (Kite)', icon: ShieldCheck },
                                   { name: 'Binance', icon: Globe }
                                 ].map((b, i) => (
                                   <motion.div 
                                      key={i}
                                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${i === 0 ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/5 bg-white/[0.02]'}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                   >
                                      <div className="flex items-center gap-3">
                                         <b.icon className={`w-4 h-4 ${i === 0 ? 'text-[#FFD700]' : 'text-white/20'}`} />
                                         <span className={`text-[10px] font-black uppercase ${i === 0 ? 'text-white' : 'text-white/40'}`}>{b.name}</span>
                                      </div>
                                      {i === 0 && (
                                         <motion.div 
                                           initial={{ scale: 0 }}
                                           animate={{ scale: 1 }}
                                           transition={{ delay: 1.2 }}
                                         >
                                            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                                         </motion.div>
                                      )}
                                   </motion.div>
                                 ))}
                             </div>
                         </div>
                      </motion.div>
                  )}

                  {/* STEP 3: CHOOSE ASSET (Calibrated Cursor) */}
                  {step === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
                      >
                         <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Choose Your <span className="text-[#FFD700]">Asset</span></h3>
                         
                         <div className="w-full max-w-[320px] p-8 rounded-[40px] bg-black/60 border border-white/10 shadow-2xl relative overflow-hidden">
                             <div className="grid grid-cols-1 gap-3 w-full">
                                 {[
                                   { name: 'BTCUSDT', icon: Bitcoin },
                                   { name: 'ETHUSDT', icon: Activity },
                                   { name: 'XAUUSD', icon: DollarSign }
                                 ].map((a, i) => (
                                   <motion.div 
                                      key={i}
                                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${i === 2 ? 'border-[#00E676] bg-[#00E676]/10' : 'border-white/5 bg-white/[0.02]'}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                   >
                                      <div className="flex items-center gap-3">
                                         <a.icon className={`w-4 h-4 ${i === 2 ? 'text-[#00E676]' : 'text-white/20'}`} />
                                         <span className={`text-[10px] font-black uppercase ${i === 2 ? 'text-white' : 'text-white/40'}`}>{a.name}</span>
                                      </div>
                                      {i === 2 && (
                                         <motion.div 
                                           initial={{ scale: 0 }}
                                           animate={{ scale: 1 }}
                                           transition={{ delay: 1.2 }}
                                         >
                                            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                                         </motion.div>
                                      )}
                                   </motion.div>
                                 ))}
                             </div>

                             {/* Calibrated Cursor for Step 3 - Precision Click on XAUUSD (Deep Hit) */}
                             <motion.div 
                                className="absolute bottom-10 right-10 z-50 pointer-events-none"
                                initial={{ x: 150, y: 150, opacity: 0 }}
                                animate={{ x: -100, y: -5, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                             >
                                <MousePointer2 className="w-10 h-10 text-white fill-black rotate-[-15deg] drop-shadow-lg" />
                                <motion.div 
                                   className="absolute top-0 left-0 w-6 h-6 rounded-full bg-white/40 blur-md -z-10"
                                   initial={{ scale: 0, opacity: 0 }}
                                   animate={{ scale: [0, 4, 0], opacity: [0, 1, 0] }}
                                   transition={{ duration: 0.3, delay: 0.8 }} 
                                />
                             </motion.div>
                         </div>
                      </motion.div>
                  )}

                  {/* STEP 4: PROFIT CYCLE */}
                  {step === 4 && (
                      <motion.div 
                        key="step4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4"
                      >
                         <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Live <span className="text-[#00E676]">Execution</span></h3>
                         
                         <div className="w-full max-w-[320px] h-[260px] bg-black/40 border border-white/10 rounded-[32px] overflow-hidden relative flex flex-col p-6 shadow-2xl">
                             <div className="flex justify-between items-start mb-6">
                                 <div className="space-y-1">
                                    <p className="text-[7px] font-black text-white/20 uppercase">PNL UNREALIZED</p>
                                    <h5 className="text-2xl font-black text-white tracking-widest">+$125.00</h5>
                                 </div>
                                 <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-pulse shadow-[0_0_10px_#00E676]" />
                             </div>

                             <div className="flex-1 relative">
                                 <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                                    <defs>
                                       <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="#00E676" stopOpacity="0.4" />
                                          <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
                                       </linearGradient>
                                    </defs>
                                    <motion.path 
                                      d="M0,45 Q20,35 40,42 T70,20 T100,5"
                                      fill="none" stroke="#00E676" strokeWidth="3" strokeLinecap="round"
                                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                                    />
                                    <motion.path 
                                      d="M0,45 Q20,35 40,42 T70,20 T100,5 L100,50 L0,50 Z"
                                      fill="url(#pGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
                                    />
                                 </svg>
                             </div>

                             {/* Notification Bubbles */}
                             <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                                className="absolute bottom-12 left-6 right-6 p-3 bg-[#111] border border-[#00E676]/30 rounded-xl flex items-center gap-3 shadow-xl"
                             >
                                <Zap className="w-4 h-4 text-[#00E676]" />
                                <span className="text-[9px] font-black text-[#00E676] uppercase tracking-tighter">Profit Booked: $125.00</span>
                             </motion.div>
                         </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>

          {/* DOCK FOOTER */}
          <div className="h-16 bg-black/40 border-t border-white/5 flex items-center justify-center z-20">
              <div className="flex items-center gap-6 px-6 py-2 bg-white/[0.02] border border-white/10 rounded-full scale-90">
                  {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${step >= s ? 'bg-[#FFD700] border-[#FFD700] text-black' : 'border-white/10 text-white/20'}`}>
                            {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                         </div>
                         {s < 4 && <div className="w-6 h-[1px] bg-white/10" />}
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
