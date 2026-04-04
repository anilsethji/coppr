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
  Users
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

// MINIMALIST MOTION GRAPHICS FOR NAVIGATION GRID
const NavAnimation = ({ type, color }: { type: string, color: string }) => {
  if (type === 'EA Bots') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity">
        <motion.div 
          animate={{ y: [0, 80, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-1" 
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1">
           {[...Array(5)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ height: [8, 20, 8], opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
               className="w-1 rounded-full" 
               style={{ backgroundColor: color }}
             />
           ))}
        </div>
      </div>
    );
  }

  if (type === 'Indicators') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="fill-none stroke-[2]" 
            style={{ stroke: color }} 
            d="M0 80 Q 50 20 100 80 T 200 20" 
          />
        </svg>
      </div>
    );
  }

  if (type === 'Knowledge') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10 group-hover:opacity-30 transition-opacity flex items-center justify-center">
         <motion.div 
            animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
         >
            <BookOpen className="w-24 h-24" style={{ color }} />
         </motion.div>
      </div>
    );
  }

  if (type === 'Creators') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border border-dashed"
            style={{ borderColor: color }}
          />
        ))}
      </div>
    );
  }

  return null;
}

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
      className="space-y-16 pb-20 max-w-[1400px] mx-auto px-4 md:px-8"
    >
      {/* 1. COMPACT HERO: ELEGANT CONTROL CENTER (TOP) */}
      <motion.div variants={item} className="relative p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-3xl overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-sans">System Operational • High Uptime</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              Control Center: {profile?.full_name?.split(' ')[0] || 'Member'}
            </h1>
          </div>

          <div className="flex items-center gap-6 bg-black/60 p-5 rounded-3xl border border-white/5 shadow-2xl">
             <div className="text-right">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest font-sans mb-1">Mirroring Level</p>
                <div className="flex items-center gap-2 justify-end">
                   <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                   <p className="text-[14px] font-black text-[#FFD700] uppercase italic leading-none">Pro Access</p>
                </div>
             </div>
             <div className="w-[1px] h-10 bg-white/10" />
             <div className="text-center min-w-[60px]">
                <p className="text-[20px] font-black text-white leading-none font-sans italic mb-1">27</p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest font-sans">Days Left</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. THE NAVIGATION GRID: FOUR SQUARES (MINIMALIST ANIMATIONS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { icon: Bot, t: 'EA Bots', sub: 'Hub', latest: latestEA, href: '/dashboard/bots', color: '#FFD700' },
          { icon: BarChart3, t: 'Indicators', sub: 'Suite', latest: latestInd, href: '/dashboard/indicators', color: '#00E676' },
          { icon: BookOpen, t: 'Knowledge', sub: 'Hub', href: '/dashboard/guides', color: '#00B0FF' },
          { icon: Users, t: 'Creators', sub: 'Hub', href: '/dashboard/creator', color: '#FF4757' }
        ].map((card, i) => (
          <Link key={i} href={card.href} className="group relative">
            <motion.div 
              variants={item}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative p-8 md:p-10 rounded-[44px] bg-[#131929]/40 border border-white/5 group-hover:border-white/20 transition-all aspect-square flex flex-col justify-between overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 10px 40px -10px ${card.color}08` }}
            >
              {/* MINIMALIST THEME-BASED ANIMATION */}
              <NavAnimation type={card.t} color={card.color} />

              {/* SHINE & GLOW EFFECTS */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-10 -right-10 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-20 transition-all duration-700" style={{ backgroundColor: card.color }} />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="w-16 h-16 rounded-[28px] bg-white/10 flex items-center justify-center border border-white/5 shadow-inner relative z-10 backdrop-blur-md">
                <card.icon 
                  className="w-8 h-8 transition-all duration-500 group-hover:scale-110" 
                  style={{ color: card.color, filter: `drop-shadow(0 0 8px ${card.color}40)` }}
                />
              </div>

              <div className="relative z-10">
                 <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1 group-hover:text-white transition-colors">
                    {card.t === 'Knowledge' ? 'Knowledge' : card.t.split(' ')[0]}
                    {card.t === 'Knowledge' && <br />}
                    <span className="text-white opacity-40 group-hover:opacity-100 transition-opacity">
                       {card.t === 'Knowledge' ? 'Hub' : ` ${card.t.split(' ')[1] || ''}`}
                    </span>
                 </h4>
                 <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-sans group-hover:text-white/40 transition-colors uppercase leading-none">{card.sub}</p>
                    <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 3. COPPR LABS: NEW RELEASE RELEASE (FEATURED MARQUEE) */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] leading-none">Official Direct Alpha</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">New <span className="text-[#00E676] animate-pulse">Coppr Lab</span> Release</h3>
           </div>
           <p className="text-[10px] md:text-[12px] font-black text-white/20 uppercase tracking-[0.2em] font-sans italic max-w-sm text-left md:text-right">
              Proprietary mirroring logic direct from the Coppr Labs propagation terminal.
           </p>
        </div>

        {/* FEATURED HERO (THE MARQUEE) - SHRUNK FOR BETTER BALANCE */}
        {botLibrary.length > 0 && (
          <motion.div 
            variants={item}
            whileHover={{ scale: 1.005, y: -5 }}
            className="relative p-6 md:p-10 bg-gradient-to-br from-[#131929] via-[#0D121F] to-[#080C14] border border-[#FFD700]/20 rounded-[48px] overflow-hidden group shadow-2xl shadow-[#FFD700]/5"
          >
             <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent" />
             <div className="absolute inset-0 bg-[#FFD700]/[0.02] group-hover:bg-[#FFD700]/[0.05] transition-colors duration-1000" />
             <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#FFD700]/10 blur-[130px] rounded-full group-hover:bg-[#FFD700]/20 transition-all duration-1000" />

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <div className="lg:col-span-8 space-y-6">
                   <div className="flex flex-wrap items-center gap-4">
                      <div className="px-4 py-1 bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">Elite Release</div>
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
                         <span className="text-[10px] font-black text-[#00E676] uppercase tracking-widest italic">Coppr Fiber Live</span>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9] group-hover:text-[#FFD700] transition-colors duration-700">
                        {botLibrary[0].title}
                      </h2>
                      <p className="text-[12px] md:text-[14px] text-white/30 font-bold italic font-sans max-w-xl leading-relaxed uppercase tracking-wide">
                        {botLibrary[0].description ? (botLibrary[0].description.startsWith('{') ? JSON.parse(botLibrary[0].description).desc : botLibrary[0].description) : 'Enterprise-grade alpha verified on the mainnet.'}
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
                         Initiate Propagation
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

      {/* 4. THE SMALL-SMALL BOXES: COMMUNITY ALPHAS (ENLARGED FOR BETTER FILL) */}
      <div className="space-y-10">
        <div className="flex justify-between items-end px-2">
           <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Community <span className="text-white/40 italic">Alphas</span></h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest font-sans">Marketplace-wide signal repositories</p>
           </div>
           <Link href="/dashboard/marketplace" className="text-[11px] font-black text-[#FFD700] uppercase hover:underline tracking-widest italic decoration-2 underline-offset-4">Browse Hub →</Link>
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
                 className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:border-[#FFD700]/30 transition-all flex flex-col gap-6 aspect-auto overflow-hidden relative shadow-lg"
               >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all duration-500 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Bot className="w-8 h-8 text-[#FFD700]/60 group-hover:text-[#FFD700]" />
                  </div>
                  <div>
                     <h4 className="text-[14px] md:text-[16px] font-black text-white uppercase italic leading-tight mb-2 group-hover:text-[#FFD700] transition-colors line-clamp-1">{item.title}</h4>
                     <div className="flex items-center gap-2 opacity-40">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white font-sans italic">{item.roi || '99%'} ROI</span>
                        <div className="w-[1px] h-3 bg-white/20" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-[#00E676] font-sans italic">Live Broadcast</span>
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
              <span className="text-[9px] font-black text-[#00E676]/60 uppercase tracking-[0.4em] font-sans mb-2 block">Live Sync Handshake Control</span>
              <h3 className="text-3xl font-black text-white uppercase tracking-widest italic leading-none">Mission <span className="text-[#00E676]">Control</span> Output</h3>
           </div>
           <div className="flex items-center gap-4 bg-[#00E676]/10 px-6 py-3 rounded-2xl border border-[#00E676]/20 backdrop-blur-xl">
              <Activity className="w-5 h-5 text-[#00E676] animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Propagation Protocol Operational</span>
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
      <div className="pt-20">
        <Link href="/dashboard/creator" className="group flex flex-col md:flex-row items-center justify-between p-12 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-[64px] hover:border-[#FFD700]/40 transition-all shadow-2xl relative overflow-hidden">
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none" />
           <div className="flex items-center gap-10 relative z-10">
              <div className="p-8 bg-[#FFD700]/10 rounded-3xl group-hover:scale-110 transition-all duration-700 shadow-2xl">
                 <Plus className="w-10 h-10 text-[#FFD700]" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic leading-none tracking-tighter">Monetize Your Alpha</h4>
                 <p className="text-[12px] md:text-sm font-black text-white/30 uppercase tracking-[0.3em] font-sans italic">Ship proprietary mirroring nodes on the global grid.</p>
              </div>
           </div>
           <div className="mt-8 md:mt-0 p-6 rounded-full border border-white/10 group-hover:text-[#FFD700] group-hover:border-[#FFD700]/40 transition-all relative z-10 backdrop-blur-xl">
              <ChevronRight className="w-10 h-10" />
           </div>
        </Link>
      </div>

    </motion.div>
  );
}
