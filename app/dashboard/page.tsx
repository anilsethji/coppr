'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  BarChart3, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe,
  PlayCircle,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  Cpu,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import TerminalLog from '@/components/dashboard/TerminalLog';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardHome() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [managedBots, setManagedBots] = useState<any[]>([]);
  const [botLibrary, setBotLibrary] = useState<any[]>([]);
  const [latestEA, setLatestEA] = useState<string | null>(null);
  const [latestInd, setLatestInd] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, sRes, oRes, uRes, cRes, eaRes, indRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_strategies').select('*, strategy:strategies(*)').eq('user_id', user.id).limit(10),
        supabase.from('strategies').select('*').eq('creator_id', user.id).limit(10),
        supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('content').select('*').eq('type', 'bot').order('created_at', { ascending: false }).limit(5),
        supabase.from('strategies').select('name').eq('type', 'MT5_EA').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('strategies').select('name').eq('type', 'PINE_SCRIPT_WEBHOOK').order('created_at', { ascending: false }).limit(1).single()
      ]);

      const merged = [...(sRes.data || [])];
      if (oRes.data) {
        oRes.data.forEach(strategy => {
          const exists = merged.find(m => m.strategy_id === strategy.id);
          if (!exists) {
            merged.push({ id: `own-${strategy.id}`, strategy });
          }
        });
      }

      setProfile(pRes.data);
      setManagedBots(merged);
      setBotLibrary(cRes.data || []);
      setLogs(uRes.data || []);
      setLatestEA(eaRes.data?.name || null);
      setLatestInd(indRes.data?.name || null);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-[600px] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Initializing Grid Control...</p>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-16 pb-20 max-w-[1300px] mx-auto px-1"
    >
      {/* 1. COMPACT HERO: ELEGANT & MOBILE FIRST */}
      <motion.div variants={item} className="relative p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-sans">Grid Status: Operational</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
              Control Center: <span className="text-[#FFD700]">{profile?.full_name?.split(' ')[0] || 'Member'}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5">
             <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-sans">Protocol</p>
                <p className="text-[11px] font-black text-[#FFD700] uppercase italic">Pro Access</p>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="text-center min-w-[40px]">
                <p className="text-[14px] font-black text-white leading-none font-sans italic">27</p>
                <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest font-sans">Days Remaining</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. THE SUPERIOR REFLECTIVE GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Bot, t: 'EA Bots', sub: 'Protocol Hub', latest: latestEA, href: '/dashboard/bots', color: '#FFD700', bg: 'rgba(255, 215, 0, 0.05)', glow: 'rgba(255, 215, 0, 0.4)' },
          { icon: BarChart3, t: 'Indicators', sub: 'Technical Suite', latest: latestInd, href: '/dashboard/indicators', color: '#00E676', bg: 'rgba(0, 230, 118, 0.05)', glow: 'rgba(0, 230, 118, 0.4)' },
          { icon: Globe, t: 'Knowledge Hub', sub: 'Setup Manuals', href: '/dashboard/tutorials', color: '#00B0FF', bg: 'rgba(0, 176, 255, 0.05)', glow: 'rgba(0, 176, 255, 0.4)' },
          { icon: Zap, t: 'Creators Hub', sub: 'Monetize Alpha', href: '/dashboard/creator/submit', color: '#FFD700', highlight: true, glow: 'rgba(255, 215, 0, 0.25)' }
        ].map((card, i) => (
          <Link key={i} href={card.href} className="group relative perspective-1000">
            <motion.div 
              variants={item}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 md:p-8 rounded-[36px] border backdrop-blur-[40px] transition-all duration-500 aspect-square flex flex-col justify-between overflow-hidden ${
                card.highlight 
                  ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-[#FFD700]/60' 
                  : 'bg-[#131929]/40 border-white/10 group-hover:border-white/40'
              }`}
              style={{
                boxShadow: card.highlight ? `0 20px 60px ${card.glow}` : 'none'
              }}
            >
              {/* PROPAGATING COLOR RADIAL (On Hover) */}
              {!card.highlight && (
                <div 
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                  style={{
                    background: `radial-gradient(circle at center, ${card.bg} 0%, transparent 100%)`
                  }}
                />
              )}

              {/* DYNAMIC SHINE OVERLAY */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/[0.12] to-transparent rotate-45 transition-transform duration-1000 group-hover:translate-x-[50%] group-hover:translate-y-[50%]" />
              </div>

              {/* BACKGROUND GLOW (Strong Propagation) */}
              {!card.highlight && (
                <div 
                  className="absolute -top-10 -right-10 w-48 h-48 blur-[60px] rounded-full transition-all duration-700 opacity-20 group-hover:opacity-60 group-hover:scale-150" 
                  style={{ backgroundColor: card.color }}
                />
              )}

              {/* REFLECTIVE GLASS EDGES (Permanent Highlight) */}
              {!card.highlight && (
                <>
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 rounded-[36px] shadow-[inset_0px_1px_2px_rgba(255,255,255,0.05)] pointer-events-none" />
                </>
              )}

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-500 ${
                  card.highlight ? 'bg-black/10' : 'bg-white/5 group-hover:bg-white/10 shadow-inner'
                }`}>
                  <card.icon 
                    className={`w-7 h-7 transition-all duration-500 ${
                      card.highlight ? 'text-black' : 'text-white/40 group-hover:text-white'
                    }`} 
                    style={!card.highlight ? { color: card.color, filter: `drop-shadow(0 0 12px ${card.color}40)` } : {}}
                  />
                </div>
              </div>
              
              <div className="relative z-10">
                {card.latest && (
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                    <p className={`text-[9px] font-black uppercase tracking-widest font-sans ${card.highlight ? 'text-black/60' : 'text-[#00E676]'}`}>
                      Recent: {card.latest}
                    </p>
                  </div>
                )}
                <h4 className={`text-2xl font-black tracking-tighter uppercase italic leading-none mb-1.5 ${card.highlight ? 'text-black' : 'text-white'}`}>
                  {card.t}
                </h4>
                <div className="flex justify-between items-end">
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] font-sans ${card.highlight ? 'text-black/50' : 'text-white/30'}`}>
                    {card.sub}
                   </p>
                   <div className={`p-2 rounded-full transition-all duration-500 shadow-xl ${
                     card.highlight ? 'bg-black/10' : 'bg-white/5 group-hover:bg-white/10'
                   }`}>
                    <ArrowUpRight className={`w-4 h-4 ${card.highlight ? 'text-black' : 'text-white/30 group-hover:text-white'}`} />
                   </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 3. DUAL GRID: BOT LIBRARY & MISSION CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* BOT LIBRARY (OFFICIAL RELEASES) */}
        <motion.div variants={item} className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-end px-2">
             <h3 className="text-xs font-black text-[#FFD700] uppercase tracking-widest italic leading-none">Official Bot Library</h3>
             <Link href="/dashboard/marketplace" className="text-[10px] font-black text-[#FFD700]/60 uppercase hover:underline font-sans">Explore Marketplace →</Link>
          </div>

          <div className="space-y-4">
            {botLibrary.length > 0 ? botLibrary.map((item) => (
              <div key={item.id} className="p-5 bg-[#0A0F1A]/60 border border-white/5 rounded-[24px] flex items-center justify-between group hover:border-[#FFD700]/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform overflow-hidden relative">
                      <div className="absolute inset-0 bg-[#FFD700]/5" />
                      <Bot className="w-6 h-6 text-[#FFD700] relative z-10" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-0.5">
                         <h4 className="text-[14px] font-black text-white uppercase italic tracking-tighter leading-none">{item.title}</h4>
                         <span className="px-1.5 py-0.5 rounded bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[7px] font-black uppercase tracking-widest font-sans">Coppr Official</span>
                      </div>
                      <p className="text-[11px] text-white/30 font-bold line-clamp-1 italic pr-4 font-sans uppercase">
                        {item.description ? (item.description.startsWith('{') ? JSON.parse(item.description).desc : item.description) : 'Strategy verified on Coppr grid.'}
                      </p>
                   </div>
                </div>
                <Link 
                  href={item.external_link || `/dashboard/bots`}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest font-sans transition-all"
                >
                  Deploy
                </Link>
              </div>
            )) : (
              <div className="p-20 border border-dashed border-white/5 rounded-[40px] text-center bg-white/[0.01]">
                 <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] font-sans">No official bots broadcasted tonight.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* LOGS PREVIEW (MISSION CONTROL) */}
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end px-2">
             <h3 className="text-xs font-black text-[#00E676] uppercase tracking-widest italic leading-none">Live Strategy Feed</h3>
             <span className="text-[8px] font-black text-[#00E676]/60 animate-pulse uppercase tracking-widest font-sans">Active Feed</span>
          </div>
          <TerminalLog logs={logs} />
        </motion.div>
      </div>

      {/* 4. QUICK ACTIONS GRID (BOTTOM SECTION) */}
      <div className="space-y-10">
        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest italic px-2 leading-none">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: 'EA Bots', h: '/dashboard/bots', i: Bot, c: '#FFD700' },
            { n: 'Indicators', h: '/dashboard/indicators', i: BarChart3, c: '#00E676' },
            { n: 'Tutorials', h: '/dashboard/tutorials', i: Globe, c: '#00B0FF' },
            { n: 'Submit strategy', h: '/dashboard/creator/submit', i: Plus, c: '#FFD700' }
          ].map((act, idx) => (
            <Link key={idx} href={act.h} className="group">
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative p-7 rounded-[28px] bg-[#131929]/40 border border-white/5 group-hover:border-white/20 transition-all flex flex-col items-center justify-center text-center gap-4 overflow-hidden"
              >
                {/* Reflective Edge for Quick Actions */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all" />
                
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-all">
                  <act.i className="w-6 h-6" style={{ color: act.c, filter: `drop-shadow(0 0 8px ${act.c}40)` }} />
                </div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors italic leading-none font-sans">{act.n}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>


      {/* FOOTER CALL TO ACTION */}
      <motion.div variants={item} className="pt-10">
        <Link href="/dashboard/creator/submit" className="group flex items-center justify-between p-8 bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-[32px] hover:border-[#FFD700]/20 transition-all">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-[#FFD700]/10 rounded-2xl group-hover:scale-110 transition-transform">
                 <Plus className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div>
                 <p className="text-xl font-black text-white uppercase italic leading-none">Submit Official Strategy</p>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1.5 font-sans">Monetize your alpha on the Coppr Grid</p>
              </div>
           </div>
           <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-[#FFD700] transition-colors" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
