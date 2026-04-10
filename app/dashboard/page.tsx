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
  Plus,
  BookOpen,
  Users,
  Youtube
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

// NAV GRID REFINEMENT (REFLECTIVE METALLIC SQUARES)
const navCards = [
  { icon: Bot, t: 'EA Bots', sub: 'Hub', href: '/dashboard/bots', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.25)' },
  { icon: BarChart3, t: 'Indicators', sub: 'Suite', href: '/dashboard/indicators', color: '#00E676', glow: 'rgba(0, 230, 118, 0.25)' },
  { icon: Youtube, t: 'AI Video', sub: 'Builder', href: '/dashboard/creator/ai-builder', color: '#FF0000', glow: 'rgba(255, 0, 0, 0.25)' },
  { icon: Users, t: 'Creators', sub: 'Hub', href: '/dashboard/creator', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.35)', isHighlight: true }
];

export default function DashboardHome() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [botLibrary, setBotLibrary] = useState<any[]>([]);
  const [latestEA, setLatestEA] = useState<string | null>(null);
  const [latestInd, setLatestInd] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, uRes, cRes, eaRes, indRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('content').select('*').eq('type', 'bot').order('created_at', { ascending: false }).limit(12),
        supabase.from('strategies').select('name').eq('type', 'MT5_EA').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('strategies').select('name').eq('type', 'PINE_SCRIPT_WEBHOOK').order('created_at', { ascending: false }).limit(1).single()
      ]);

      setProfile(pRes.data);
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
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Initializing Command Hub...</p>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-10 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8"
    >
      {/* 1. COMPACT HERO: ELEGANT CONTROL CENTER (TOP) */}
      <motion.div variants={item} className="relative p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-[32px] md:rounded-[40px] backdrop-blur-3xl overflow-hidden group shadow-2xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] font-sans">All Systems Online</p>
            </div>
               <h1 className="text-lg md:text-3xl font-extrabold text-white tracking-tight uppercase italic leading-none opacity-90">
                Welcome Back, <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">{profile?.full_name?.split(' ')[0] || 'Member'}</span>
              </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6 bg-black/40 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
             <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-sans mb-1">Account Plan</p>
                <div className="flex items-center gap-2 justify-end">
                   <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
                   <p className="text-[12px] md:text-[14px] font-black text-[#FFD700] uppercase italic leading-none">Pro User</p>
                </div>
             </div>
             <div className="w-[1px] h-8 md:h-10 bg-white/10" />
             <div className="text-center min-w-[50px] md:min-w-[60px]">
                <p className="text-[16px] md:text-[20px] font-black text-white leading-none font-sans italic mb-1">27</p>
                <p className="text-[7px] md:text-[8px] font-bold text-white/20 uppercase tracking-widest font-sans">Days Left</p>
             </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {navCards.map((card, i) => (
          <Link key={i} href={card.href} className="group relative">
            <motion.div 
              variants={item}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 md:p-10 rounded-[24px] md:rounded-[44px] transition-all duration-700 aspect-auto md:aspect-square flex flex-col justify-between overflow-hidden border border-white/[0.08] shadow-2xl ${
                card.isHighlight 
                  ? 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]' 
                  : 'bg-gradient-to-b from-[#161C2D] to-[#0A1A3A]'
              }`}
            >
              {/* METALLIC FINISH OVERLAY */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
              
              {/* GLITTERING EDGES (TOP & BOTTOM LIGHT CATCHERS) */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent z-20" />
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent z-20" />

              {/* VIBRANT CONSTANT & EXPANDING BACKGROUND GLOW */}
              <motion.div 
                variants={{
                  hover: { 
                    opacity: 1, 
                    scale: 2.2,
                    background: `radial-gradient(circle at 30% 30%, ${card.color}50 0%, ${card.color}20 40%, transparent 80%)`
                  }
                }}
                initial={{ opacity: 0.8, scale: 1.1 }}
                className="absolute inset-0 z-0 transition-all duration-1000 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${card.color}30 0%, transparent 75%)` }}
              />

              {/* EDGE-LIT GLOW (INSET ON HOVER) */}
              <motion.div
                variants={{
                  hover: { opacity: 1, borderColor: `${card.color}60` }
                }}
                initial={{ opacity: 0, borderColor: `${card.color}10` }}
                className="absolute inset-0 z-10 pointer-events-none rounded-[44px] border-[2px] transition-all duration-500"
                style={{ boxShadow: `inset 0 0 35px ${card.color}25` }}
              />

              {/* DIAGONAL REFLECTIVE SHINE (THE GLIMMER) */}
              <motion.div 
                variants={{
                  hover: { x: ['-130%', '130%'], opacity: [0, 0.8, 0] }
                }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                  transform: 'skewX(-25deg)'
                }}
              />
              
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[28px] ${card.isHighlight ? 'bg-[#FFD700]' : 'bg-white/5'} flex items-center justify-center border border-white/10 shadow-inner relative z-40 backdrop-blur-md transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]`}>
                <card.icon 
                  className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-500 ${card.isHighlight ? 'text-black' : ''}`} 
                  style={{ color: card.isHighlight ? undefined : card.color, filter: card.isHighlight ? undefined : `drop-shadow(0 0 15px ${card.color})` }}
                />
              </div>

              <div className="relative z-40 mt-6 md:mt-0">
                 <h4 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                    {card.t === 'Knowledge' ? 'Knowledge' : card.t.split(' ')[0]}
                    <span className="hidden md:inline">{card.t === 'Knowledge' && <br />}</span>
                    <span className={`text-white transition-opacity ${card.isHighlight ? 'opacity-80' : 'opacity-40 group-hover:opacity-100'}`}>
                       {card.t === 'Knowledge' ? ' Hub' : ` ${card.t.split(' ')[1] || ''}`}
                    </span>
                 </h4>
                 <div className="flex justify-between items-end">
                    <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-sans group-hover:text-white/60 transition-colors leading-none">{card.sub}</p>
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white/22 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 3. COPPR LABS: NEW RELEASE RELEASE (FEATURED MARQUEE) */}
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <span className="text-[8px] md:text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] leading-none px-3 py-1.5 md:p-0 bg-white/5 md:bg-transparent border border-white/10 md:border-none rounded-full">Coppr Official Strategies</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-extrabold text-white uppercase italic tracking-tight leading-none">New <span className="text-[#00E676] animate-pulse">Coppr Official</span> Release</h3>
               </div>
           <p className="text-[9px] md:text-[12px] font-black text-white/20 uppercase tracking-[0.2em] font-sans italic max-w-sm text-left md:text-right leading-relaxed">
              Verified and reliable trading bots built securely by the Coppr Team.
           </p>
        </div>

        {/* FEATURED HERO (THE MARQUEE) */}
        {botLibrary.length > 0 && (
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="relative p-7 md:p-10 bg-gradient-to-br from-[#161C2D] via-[#0A1A3A] to-[#060A12] border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden group shadow-2xl"
          >
             <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
             <div className="absolute inset-0 bg-[#FFD700]/[0.01] group-hover:bg-[#FFD700]/[0.03] transition-colors duration-1000" />
             <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#FFD700]/10 blur-[130px] rounded-full group-hover:bg-[#FFD700]/20 transition-all duration-1000" />

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <div className="lg:col-span-8 space-y-6">
                   <div className="flex flex-wrap items-center gap-4">
                      <div className="px-4 py-1 bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">Featured Bot</div>
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
                         <span className="text-[10px] font-black text-[#00E676] uppercase tracking-widest italic">Fast Execution</span>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9] group-hover:text-[#FFD700] transition-colors duration-700">
                        {botLibrary[0].title}
                      </h2>
                      <p className="text-[11px] md:text-[14px] text-white/30 font-bold italic font-sans max-w-xl leading-relaxed uppercase tracking-wide">
                        {botLibrary[0].description ? (botLibrary[0].description.startsWith('{') ? JSON.parse(botLibrary[0].description).desc : botLibrary[0].description) : 'High-quality trading strategy tested in live markets.'}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Efficiency</p>
                         <p className="text-sm font-black text-white uppercase italic">99.9% Uptime</p>
                      </div>
                      <div className="space-y-1 border-l border-white/5 pl-6">
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Latency</p>
                         <p className="text-sm font-black text-[#00E676] uppercase italic">24ms Node</p>
                      </div>
                   </div>

                   <div className="pt-4">
                      <Link 
                        href={botLibrary[0].external_link || `/dashboard/bots`}
                        className="inline-flex items-center gap-4 px-10 py-4 bg-[#FFD700] text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-[24px] hover:scale-105 hover:bg-white transition-all shadow-2xl shadow-[#FFD700]/30"
                      >
                         View Details
                         <ArrowUpRight className="w-5 h-5" />
                      </Link>
                   </div>
                </div>

                <div className="lg:col-span-4 hidden lg:flex items-center justify-center border-l border-white/5">
                   <div className="relative w-full aspect-square max-w-[200px]">
                      <div className="absolute inset-0 bg-[#FFD700]/10 blur-[80px] rounded-full animate-pulse" />
                      <div className="relative w-full h-full bg-white/[0.03] border border-white/10 rounded-[64px] flex items-center justify-center backdrop-blur-3xl group-hover:border-[#FFD700]/40 transition-all duration-700 shadow-2xl">
                         <Bot className="w-24 h-24 text-[#FFD700]/40 group-hover:scale-110 group-hover:text-[#FFD700] transition-all duration-700" />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* AI STRATEGY BUILDER CTA */}
      <div className="py-4">
        <Link href="/dashboard/creator/ai-builder" className="group block relative w-full rounded-[48px] overflow-hidden border border-white/5 bg-gradient-to-r from-[#00E676]/[0.02] to-transparent hover:border-[#00E676]/30 hover:bg-[#00E676]/[0.05] transition-all duration-700 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E676]/10 to-transparent transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
          
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(0,230,118,0.1)] group-hover:scale-110 group-hover:bg-white/10 group-hover:border-[#00E676]/40 transition-all duration-700 backdrop-blur-md">
               <Youtube className="w-10 h-10 md:w-14 md:h-14 text-white/50 group-hover:text-[#00E676] transition-colors" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
               <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
                  <span className="text-[10px] md:text-xs font-black text-[#00E676] uppercase tracking-[0.3em] font-sans">AI Strategy Builder Active</span>
               </div>
               <h3 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">
                 Turn any <span className="text-white opacity-60">YouTube Video</span><br/>into an Executable Bot
               </h3>
               <p className="text-xs md:text-sm font-bold text-white/30 uppercase tracking-widest max-w-2xl font-sans mt-2">
                 Paste a YouTube trading strategy link, and our AI will instantaneously extract the entry criteria, stop-loss, and take-profit targets to compile it into Pine Script.
               </p>
            </div>
            <div className="shrink-0 flex items-center justify-center min-w-[120px]">
               <div className="px-6 py-4 bg-[#00E676] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl group-hover:scale-105 transition-all shadow-xl shadow-[#00E676]/20 flex items-center gap-3 italic">
                  Generate
                  <ArrowUpRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 4. THE SMALL-SMALL BOXES: COMMUNITY ALPHAS (ENLARGED FOR BETTER FILL) */}
      <div className="space-y-10">
        <div className="flex justify-between items-end px-2">
           <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Community <span className="text-white/40 italic">Strategies</span></h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest font-sans">Browse bots built by verified community creators</p>
           </div>
           <Link href="/dashboard/marketplace?filter=Coppr+Official" className="text-[11px] font-black text-[#FFD700] uppercase hover:underline tracking-widest italic decoration-2 underline-offset-4">Browse Hub →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(botLibrary.length > 1 ? botLibrary.slice(1) : [
            { id: 'm1', title: 'Momentum Algo NSE', roi: '94%' },
            { id: 'm2', title: 'News Filter EA', roi: '82%' },
            { id: 'm3', title: 'Regression Bot', roi: '88%' },
            { id: 'm4', title: 'Coppr Mirror', roi: '91%' },
            { id: 'm5', title: 'Grid Pulse', roi: '85%' },
            { id: 'm6', title: 'Fiber Alpha', roi: '93%' }
          ]).map((item: any) => (
            <Link key={item.id} href={item.external_link || `/dashboard/bots`} className="group relative">
               <motion.div 
                 whileHover={{ y: -5, scale: 1.02 }}
                 className="p-5 md:p-6 bg-[#161C2D] border border-white/5 rounded-[24px] md:rounded-[32px] hover:border-[#FFD700]/30 transition-all flex flex-col gap-4 md:gap-6 aspect-auto overflow-hidden relative shadow-lg"
               >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all duration-500 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Bot className="w-6 h-6 md:w-8 md:h-8 text-[#FFD700]/60 group-hover:text-[#FFD700]" />
                  </div>
                  <div>
                     <h4 className="text-[13px] md:text-[16px] font-black text-white uppercase italic leading-tight mb-2 group-hover:text-[#FFD700] transition-colors line-clamp-1">{item.title}</h4>
                     <div className="flex items-center gap-2 opacity-40">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-white font-sans italic">{item.roi || '99%'} ROI</span>
                        <div className="w-[1px] h-3 bg-white/20" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-[#00E676] font-sans italic">Broadcast</span>
                     </div>
                  </div>
               </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. MISSION CONTROL: LIVE PROPAGATION TERMINAL (BOTTOM) */}
      <div className="space-y-8 pt-8">
        <div className="flex justify-between items-end px-2">
           <div className="space-y-1">
              <span className="text-[9px] font-black text-[#00E676]/60 uppercase tracking-[0.4em] font-sans mb-2 block">Real-time Connection Status</span>
              <h3 className="text-3xl font-black text-white uppercase tracking-widest italic leading-none">Live Trade <span className="text-[#00E676]">History</span></h3>
           </div>
           <div className="flex items-center gap-4 bg-[#00E676]/10 px-6 py-3 rounded-2xl border border-[#00E676]/20 backdrop-blur-xl">
              <Activity className="w-5 h-5 text-[#00E676] animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Connection is Active</span>
           </div>
        </div>

        <motion.div 
          variants={item}
          className="relative rounded-[48px] overflow-hidden border border-white/5 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#00E676]/[0.01] pointer-events-none" />
          <TerminalLog logs={logs} />
        </motion.div>
      </div>

      {/* FOOTER CTA */}
      <div className="pt-12 md:pt-20">
        <Link href="/dashboard/creator" className="group flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-[32px] md:rounded-[64px] hover:border-[#FFD700]/40 transition-all shadow-2xl relative overflow-hidden">
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none" />
           <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10 text-center md:text-left">
              <div className="p-6 md:p-8 bg-[#FFD700]/10 rounded-2xl md:rounded-3xl group-hover:scale-110 transition-all duration-700 shadow-2xl">
                 <Plus className="w-8 h-8 md:w-10 md:h-10 text-[#FFD700]" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-2xl md:text-5xl font-black text-white uppercase italic leading-none tracking-tighter">Share Your Strategy</h4>
                 <p className="text-[10px] md:text-sm font-black text-white/30 uppercase tracking-[0.3em] font-sans italic max-w-xs md:max-w-none">Create and share your own trading bots with the community.</p>
              </div>
           </div>
           <div className="mt-8 md:mt-0 p-4 md:p-6 rounded-full border border-white/10 group-hover:text-[#FFD700] group-hover:border-[#FFD700]/40 transition-all relative z-10 backdrop-blur-xl hidden md:block">
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
           </div>
        </Link>
      </div>

    </motion.div>
  );
}
