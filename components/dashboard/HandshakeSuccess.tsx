'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Copy, Sparkles } from 'lucide-react';

interface HandshakeSuccessProps {
  strategyName: string;
  signalKey: string;
  onClose: () => void;
}

export function HandshakeSuccess({ strategyName, signalKey, onClose }: HandshakeSuccessProps) {
  const copyKey = () => {
    navigator.clipboard.writeText(signalKey);
    alert("SIGNAL KEY COPIED: Synchronized for node activation.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-[#06080E]/90 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00E676]/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-full max-w-2xl p-8 md:p-16 rounded-[48px] md:rounded-[64px] bg-[#111624] border border-[#00E676]/30 shadow-[0_0_100px_rgba(0,230,118,0.2)] text-center space-y-10"
      >
        <div className="flex flex-col items-center space-y-6">
           <div className="relative">
              <div className="absolute inset-0 bg-[#00E676] blur-[40px] opacity-20 animate-pulse" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#00E676]/10 border-2 border-[#00E676] flex items-center justify-center text-[#00E676] shadow-2xl">
                 <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 border border-dashed border-[#00E676]/20 rounded-full"
              />
           </div>
           
           <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                 <span className="text-[10px] md:text-[12px] font-black text-[#00E676] uppercase tracking-[0.4em] italic">Mirroring Synchronized</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                Deployment <br /> <span className="text-[#00E676]">Successful</span>
              </h2>
           </div>
        </div>

        <div className="p-8 md:p-10 rounded-[32px] bg-white/[0.03] border border-white/10 space-y-6 text-left">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Strategy Node</p>
              <p className="text-xl font-black text-white uppercase italic">{strategyName}</p>
           </div>
           
           <div className="space-y-3">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Master Signal Key (Encrypted)</p>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-black/40 border border-white/10 group">
                 <code className="flex-1 font-mono text-sm md:text-base text-[#00E676] tracking-widest truncate">{signalKey}</code>
                 <button 
                   onClick={copyKey}
                   className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                 >
                    <Copy className="w-4 h-4" />
                    <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Copy</span>
                 </button>
              </div>
              <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest leading-relaxed">
                Connect this key to your MT5/TradingView bridge to start receiving institutional signals instantly.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           <button 
             onClick={onClose}
             className="py-6 rounded-[24px] bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/10 transition-all italic flex items-center justify-center gap-3"
           >
              Back to Marketplace
           </button>
           <button 
             onClick={() => window.location.href = '/dashboard/vault'}
             className="py-6 rounded-[24px] bg-[#00E676] text-black font-black uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-[#00E676]/20 transition-all hover:scale-[1.02] italic flex items-center justify-center gap-3"
           >
              Launch Vault Terminal <ArrowRight className="w-4 h-4" />
           </button>
        </div>

        <div className="flex items-center justify-center gap-3 opacity-20 group hover:opacity-100 transition-opacity">
           <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
           <p className="text-[9px] font-black text-white uppercase tracking-[0.4em] italic">Coppr Trade Network • Secure Handshake v2.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
