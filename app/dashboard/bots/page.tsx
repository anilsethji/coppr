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
    <div className="max-w-[1400px] mx-auto pb-20 px-4 md:px-8 mt-8">
      
      {/* 1. HERO HEADER (COMPACT) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-4 md:p-6 bg-gradient-to-br from-[#FFD700]/[0.02] to-transparent border border-white/5 rounded-[24px] overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
               <div className="p-1.5 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
                 <Bot className="w-5 h-5 text-[#FFD700]" strokeWidth={2.5} />
               </div>
               <h1 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight leading-none italic">
                  Automated <span className="text-[#FFD700]">Trading Bots</span>
               </h1>
            </div>
            <p className="text-[10px] md:text-xs text-white/40 max-w-[500px] font-sans font-bold italic uppercase leading-normal">
               Browse top-performing strategies and copy their trades instantly to your own brokerage account.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
             <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-sans mb-0.5">Active Traders</p>
                <div className="flex items-center gap-1.5 justify-end">
                   <Globe className="w-3 h-3 text-[#FFD700]" />
                   <p className="text-[12px] font-black text-[#FFD700] uppercase italic leading-none">Global Access</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* TIMELINE WIZARD CONTAINER */}
      <div className="relative border-l-2 border-dashed border-white/10 ml-6 md:ml-8 pl-6 md:pl-8 mt-12 mb-24 min-h-[400px]">
          <VaultView typeFilter="MT5_EA" timelineMode="bots" />
      </div>

    </div>
  );
}
