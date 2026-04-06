'use client';

import React from 'react';
import VaultView from '@/components/dashboard/VaultView';
import QuickStartJourney from '@/components/dashboard/QuickStartJourney';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Globe, 
  Activity, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function BotsPage() {
  return (
    <div className="space-y-16 max-w-[1400px] mx-auto pb-20 px-4 md:px-8">
      
      {/* 1. HERO HEADER (MT5 THEMED) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-10 bg-gradient-to-br from-[#FFD700]/[0.02] to-transparent border border-white/5 rounded-[48px] overflow-hidden group"
      >
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                 <Bot className="w-8 h-8 text-[#FFD700]" strokeWidth={2.5} />
               </div>
               <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none italic">
                     Managed <span className="text-[#FFD700]">MT5</span> Hub
                  </h1>
                  <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.3em] font-sans mt-1">Institutional EA Mirroring Network</p>
               </div>
            </div>
            <p className="text-sm md:text-base text-white/40 max-w-[600px] font-sans font-bold leading-relaxed italic uppercase">
               Synchronize institutional-grade Expert Advisors directly to your trading terminal via the secure Coppr cloud.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-black/60 p-6 rounded-[32px] border border-white/5 shadow-2xl">
             <div className="text-right">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest font-sans mb-1">Global Fiber Nodes</p>
                <div className="flex items-center gap-2 justify-end">
                   <Globe className="w-4 h-4 text-[#FFD700]" />
                   <p className="text-[14px] font-black text-[#FFD700] uppercase italic leading-none">42 Active</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. VAULT MIRROR */}
      <div className="space-y-10">
        <VaultView typeFilter="MT5_EA" />
      </div>

    </div>
  );
}
