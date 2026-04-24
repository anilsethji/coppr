'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import VaultView from '@/components/dashboard/VaultView';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, 
  Globe, 
  Target, 
  ArrowDownToLine, 
  Compass, 
  Activity, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true); // Default to true for official build
  const [activeIndId, setActiveIndId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndicators = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('strategies')
        .select('*')
        .eq('type', 'PINE_SCRIPT_WEBHOOK')
        .order('created_at', { ascending: false });
      
      setIndicators(data || []);
      if (data && data.length > 0) setActiveIndId(data[0].id);
      setLoading(false);
    };
    fetchIndicators();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#000000]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#00E676]/20 border-t-[#00E676] rounded-none animate-spin" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono">ACCESSING SIGNAL STREAM //</span>
      </div>
    </div>
  );

  return (
    <div className="w-full h-[calc(100vh-72px)] md:h-screen flex flex-col bg-[#000000] overflow-hidden">
      
      {/* 1. COMPRESSED TOP HERO NAV */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative px-6 py-3 w-full bg-[#000000] border-b border-[#1A1A1A] rounded-none z-10 shrink-0"
      >
        <div className="flex flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
               <Zap className="w-4 h-4 text-[#FFD700]" strokeWidth={2.5} />
               <h1 className="text-[12px] font-black text-white uppercase tracking-wider [word-spacing:0.2em] leading-none mt-0.5">
                  TRADINGVIEW <span className="text-[#FFD700]">AUTO-TRADES</span>
               </h1>
            </div>
            <div className="hidden md:block w-px h-4 bg-[#1A1A1A]" />
            <p className="hidden md:block text-[8px] text-white/30 font-mono uppercase tracking-[0.2em] mt-1">
               LINK STRATEGIES DIRECTLY TO BROKERS FOR INSTANT EXECUTION.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <Globe className="w-3 h-3 text-[#FFD700]" />
             <p className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest leading-none font-mono mt-0.5">Real-time_Sync_Active</p>
          </div>
        </div>
      </motion.div>

      {/* 2. FULL-BLEED INDICATOR VAULT */}
      <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar">
         <div className="max-w-[1920px] mx-auto w-full">
            <VaultView typeFilter="PINE_SCRIPT_WEBHOOK" timelineMode="indicators" />
         </div>

      {/* 4. MT5 LEGACY / UTILITY TOOLS (RESTORED) */}
      <div className="pt-20 border-t border-white/5 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-[#00B0FF] uppercase [word-spacing:0.4em] leading-none">Downloadable Files</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-[#00B0FF] animate-pulse" />
                </div>
                <h3 className="text-2xl font-extrabold text-white uppercase [word-spacing:0.6rem] leading-none">Bonus: <span className="text-white/20">MT5 Indicators</span></h3>
             </div>
             <p className="text-[10px] font-black text-white/20 uppercase [word-spacing:0.2em] font-sans max-w-sm text-left md:text-right">
                Manual indicators you can download and install on your own MT5 terminal.
             </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {indicators.map((item, idx) => {
              const isLocked = item.is_premium && !hasAccess;
              
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
                  className={`group relative overflow-hidden rounded-[32px] border transition-all duration-700 bg-white/[0.02] p-8 ${!isLocked ? 'hover:bg-white/[0.04] hover:border-[#00B0FF]/40 border-white/5 shadow-2xl' : 'border-white/5'}`}
                >
                  {!isLocked && (
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#00B0FF] blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  )}

                  <div className={`transition-all duration-700 ${isLocked ? 'blur-[8px] select-none pointer-events-none opacity-20' : ''}`}>
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-12 h-12 bg-[#050505] border border-[#1A1A1A] flex items-center justify-center transition-transform duration-700 group-hover:bg-[#0A0A0A]">
                         <Target className="w-5 h-5 text-[#00B0FF]" />
                       </div>
                       <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={!isLocked ? item.external_link : '#'} 
                        className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${!isLocked ? 'bg-[#00B0FF] text-black hover:bg-white' : 'bg-[#050505] text-white/20 border border-[#1A1A1A]'}`}
                       >
                         <ArrowDownToLine className="w-3.5 h-3.5 mr-2 inline-block" />
                         INSTALL .EX5
                       </motion.a>
                    </div>

                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#00B0FF] transition-colors">{item.name || item.title}</h3>
                    <p className="text-[12px] text-white/30 font-bold uppercase font-sans leading-relaxed mb-8 line-clamp-2">
                      {item.description || 'Professional indicator for advanced market structure analysis.'}
                    </p>
                    
                    <div className="pt-8 border-t border-white/5 flex justify-between items-center group-hover:border-[#00B0FF]/20 transition-colors">
                       <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase [word-spacing:0.2em] font-sans p-2 bg-white/5 rounded-lg">
                         <Compass className="w-3.5 h-3.5" />
                         Protocol 2.1
                       </div>
                       <div className="flex items-center gap-2">
                         <Activity className="w-3.5 h-3.5 text-[#00B0FF] animate-pulse" />
                         <span className="text-[9px] font-black text-[#00B0FF] uppercase tracking-widest">Live Alpha</span>
                       </div>
                    </div>
                  </div>

                  {/* LOCKED OVERLAY */}
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-black/60 backdrop-blur-md">
                      <div className="w-16 h-16 rounded-[24px] bg-[#00B0FF]/10 border border-[#00B0FF]/30 flex items-center justify-center mb-6 shadow-2xl">
                        <ShieldCheck className="w-8 h-8 text-[#00B0FF]" />
                      </div>
                      <h4 className="text-white font-black uppercase text-lg mb-2">Premium Protocol</h4>
                      <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest mb-8 max-w-[200px] leading-relaxed">Upgrade to Pro to unlock institutional visual components.</p>
                      <Link 
                        href="/dashboard/marketplace"
                        className="px-8 py-4 bg-[#00B0FF] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#00B0FF]/20"
                      >
                        GET PRO ACCESS
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

     </div>
    </div>
  );
}
