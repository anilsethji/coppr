'use client';

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Layers, 
  Target, 
  Compass, 
  Zap, 
  ShieldCheck, 
  ArrowDownToLine,
  Activity,
  ChevronRight,
  Globe,
  Terminal
} from 'lucide-react';
import Link from "next/link";
import VaultView from "@/components/dashboard/VaultView";
import QuickStartJourney from "@/components/dashboard/QuickStartJourney";

export default function IndicatorsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [indicators, setIndicators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, iRes] = await Promise.all([
        supabase.from('profiles').select('subscription_status, is_admin').eq('id', user.id).single(),
        supabase.from('content').select('*').eq('type', 'indicator').order('created_at', { ascending: false })
      ]);

      setProfile(pRes.data);
      setIndicators(iRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#00B0FF]/20 border-t-[#00B0FF] rounded-full animate-spin"></div>
    </div>
  );

  const hasAccess = profile?.subscription_status === 'active' || !!profile?.is_admin;

  return (
    <div className="w-full max-w-[1920px] mx-auto pb-20 px-4 md:px-8 xl:px-12 mt-8">
      
      {/* 1. HERO HEADER (COMPACT) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-4 md:p-6 bg-gradient-to-br from-[#00E676]/[0.02] to-transparent border border-white/5 rounded-[24px] overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00E676]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
               <div className="p-1.5 rounded-lg bg-[#00E676]/10 border border-[#00E676]/20">
                 <Zap className="w-5 h-5 text-[#00E676]" strokeWidth={2.5} />
               </div>
               <h1 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-tight leading-none">
                  TradingView <span className="text-[#00E676]">Auto-Trades</span>
               </h1>
            </div>
            <p className="text-[10px] md:text-xs text-white/40 max-w-[500px] font-sans font-bold italic uppercase leading-normal">
               Link your favorite TradingView indicators directly to your broker. When your indicator fires an alert, we execute the trade for you instantly.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
             <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-sans mb-0.5">Signals Processed</p>
                <div className="flex items-center gap-1.5 justify-end">
                   <Globe className="w-3 h-3 text-[#00E676]" />
                   <p className="text-[12px] font-black text-[#00E676] uppercase italic leading-none">Real-time</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* TIMELINE WIZARD CONTAINER */}
      <div className="relative border-l-[3px] border-dashed border-[#00E676]/20 ml-6 md:ml-4 pl-8 md:pl-10 mt-12 mb-24 min-h-[400px]">
          <VaultView typeFilter="PINE_SCRIPT_WEBHOOK" timelineMode="indicators" />
      </div>

      {/* 4. MT5 LEGACY / UTILITY TOOLS */}
      <div className="pt-20 border-t border-white/5 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-[#00B0FF] uppercase tracking-[0.4em] leading-none">Downloadable Files</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-[#00B0FF] animate-pulse" />
                </div>
                <h3 className="text-2xl font-extrabold text-white uppercase italic tracking-tight leading-none">Bonus: <span className="text-white/20">MT5 Indicators</span></h3>
             </div>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-sans italic max-w-sm text-left md:text-right">
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
                  {/* Glow */}
                  {!isLocked && (
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#00B0FF] blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  )}

                  <div className={`transition-all duration-700 ${isLocked ? 'blur-[8px] select-none pointer-events-none opacity-20' : ''}`}>
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                         <Target className="w-6 h-6 text-[#00B0FF]" />
                       </div>
                       <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={!isLocked ? item.external_link : '#'} 
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic ${!isLocked ? 'bg-[#00B0FF]/10 hover:bg-[#00B0FF]/25 text-[#00B0FF] border border-[#00B0FF]/30' : 'bg-white/5 text-white/20 border border-white/5'}`}
                       >
                         <ArrowDownToLine className="w-3.5 h-3.5 mr-2 inline-block" />
                         Install .ex5
                       </motion.a>
                    </div>

                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-3 group-hover:text-[#00B0FF] transition-colors">{item.title}</h3>
                    <p className="text-[12px] text-white/30 font-bold uppercase italic font-sans leading-relaxed mb-8 line-clamp-2">
                      {item.description || 'Professional indicator for advanced market structure analysis.'}
                    </p>
                    
                    <div className="pt-8 border-t border-white/5 flex justify-between items-center group-hover:border-[#00B0FF]/20 transition-colors">
                       <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] font-sans italic p-2 bg-white/5 rounded-lg">
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
                      <h4 className="text-white font-black uppercase italic text-lg mb-2">Premium Protocol</h4>
                      <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest mb-8 max-w-[200px] leading-relaxed">Upgrade to Pro to unlock institutional visual components.</p>
                      <Link 
                        href="/dashboard/marketplace"
                        className="px-8 py-4 bg-[#00B0FF] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#00B0FF]/20 italic"
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
  );
}
