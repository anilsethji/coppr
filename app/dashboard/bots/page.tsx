'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Cpu, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity,
  ChevronRight,
  Download
} from 'lucide-react';

export default function BotsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [bots, setBots] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, bRes] = await Promise.all([
        supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
        supabase.from('content').select('*').eq('type', 'bot').order('created_at', { ascending: false })
      ]);

      setProfile(pRes.data);
      setBots(bRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin"></div>
    </div>
  );

  const isSubscribed = profile?.subscription_status === 'active';

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto pb-20">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
              <Bot className="w-5 h-5 text-[#FFD700]" />
            </div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-white">EA Bot Library</h1>
          </div>
          <p className="text-[14px] text-white/40 max-w-[500px]">
            Professional algorithmic trading terminals for XAU/USD and more. 
            Deployed on high-frequency specialized nodes.
          </p>
        </div>
        
        <div className="px-4 py-2 rounded-full border border-[#00E676]/20 bg-[#00E676]/5 flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,230,118,0.05)]">
           <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.8)]"></div>
           <span className="text-[11px] font-black tracking-widest text-[#00E676] uppercase">
             {bots.length} TERMINALS ONLINE
           </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {bots.map((bot, idx) => {
            const isUtility = bot.prot_rate || bot.use_with;
            const tags = bot.description?.split(', ') || [];
            const winRate = bot.win_rate || 65;
            const accentColor = winRate >= 70 ? '#00E676' : winRate >= 60 ? '#F5A623' : '#00B0FF';
            
            return (
              <motion.div 
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[20px] border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-white/10"
              >
                {/* Background Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: accentColor }}></div>

                {/* Top Row: Meta Information */}
                <div className="flex justify-between items-start mb-6 z-10 relative">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">{bot.title}</h3>
                      {bot.status_badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter ${bot.status_badge === 'NEW' ? 'bg-red-500/20 text-red-500' : 'bg-[#F5A623]/20 text-[#F5A623]'}`}>
                          {bot.status_badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag: string, tid: number) => (
                        <span key={tid} className="text-[10px] text-white/30 font-bold flex items-center">
                          {tid > 0 && <span className="mr-2 text-white/10 text-[6px]">●</span>}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={bot.external_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-bold text-white transition-all shadow-sm"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </motion.a>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 z-10 relative">
                  {!isUtility ? (
                    <>
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors text-center">
                        <Activity className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/20" />
                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Win Rate</p>
                        <p className="text-sm font-bold" style={{ color: accentColor }}>{bot.win_rate}%</p>
                      </div>
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors text-center">
                        <TrendingUp className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/20" />
                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Trades</p>
                        <p className="text-sm font-bold text-white">{bot.trades_count}</p>
                      </div>
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors text-center">
                        <Zap className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/20" />
                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Avg Gain</p>
                        <p className="text-sm font-bold text-[#00E676]">{bot.avg_gain}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors text-center">
                        <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/20" />
                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Protection</p>
                        <p className="text-sm font-bold text-[#00B0FF]">{bot.prot_rate}</p>
                      </div>
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors text-center">
                        <Activity className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/20" />
                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Blocked</p>
                        <p className="text-sm font-bold text-white">{bot.blocked_count}</p>
                      </div>
                      <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors text-center">
                        <Cpu className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/20" />
                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Compatibility</p>
                        <p className="text-[10px] font-bold text-white/60 truncate">{bot.use_with}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress Bar Area */}
                <div className="z-10 relative">
                   <div className="flex justify-between items-center mb-2.5">
                      <p className="text-[10px] text-white/20 italic">
                        {!isUtility ? `Live win rate based on history` : 'Security protocol optimized'}
                      </p>
                      {!isUtility && <span className="text-[11px] font-black" style={{ color: accentColor }}>{bot.win_rate}%</span>}
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: !isUtility ? `${bot.win_rate}%` : bot.prot_rate }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full" 
                        style={{ backgroundColor: accentColor }}
                      />
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <Link 
                        href={bot.setup_link || "#"} 
                        className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 hover:text-[#FFD700] transition-colors group/link"
                      >
                        <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                        Setup Guide
                      </Link>
                      
                      {!isSubscribed && (
                        <div className="flex items-center gap-1 text-[9px] font-black text-red-500/50 uppercase tracking-widest">
                          <ShieldCheck className="w-3 h-3" />
                          Requires Pro
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

