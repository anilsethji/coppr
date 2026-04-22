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
  Youtube,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { SpotlightCarousel } from '@/components/dashboard/SpotlightCarousel';

const SignalVisualizer = dynamic(() => import('@/components/dashboard/SignalVisualizer').then(m => m.SignalVisualizer), { 
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center bg-black/20 rounded-2xl border border-white/5 animate-pulse text-white/20 font-mono text-[10px] uppercase tracking-widest">Initializing Rendering Engine...</div>
});

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
  const [featured, setFeatured] = useState<any[]>([]);
  const [official, setOfficial] = useState<any | null>(null);
  const [latestEA, setLatestEA] = useState<string | null>(null);
  const [latestInd, setLatestInd] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, uRes, cRes, featRes, offRes, eaRes, indRes, backupOffRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('strategies').select('*').eq('status', 'ACTIVE').eq('is_official', false).order('created_at', { ascending: false }).limit(12),
        supabase.from('strategies').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(4),
        supabase.from('strategies').select('*').eq('is_official', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('strategies').select('name').eq('type', 'MT5_EA').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('strategies').select('name').eq('type', 'PINE_SCRIPT_WEBHOOK').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('content').select('*').eq('type', 'bot').order('created_at', {ascending: false }).limit(1).maybeSingle()
      ]);

      setProfile(pRes.data);
      setBotLibrary(cRes.data || []);
      setFeatured(featRes.data || []);
      
      // FALLBACK LOGIC: If no official strategy exists, use the latest bot from content table
      if (offRes.data) {
        setOfficial(offRes.data);
      } else if (backupOffRes.data) {
        setOfficial({
          id: backupOffRes.data.id,
          name: backupOffRes.data.title,
          description: backupOffRes.data.description,
          symbol: 'XAUUSD', // Fallback defaults
          win_rate: 73,
          is_legacy: true
        });
      }

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
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-mono">Opening Data Conduits...</p>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20 max-w-[1600px] mx-auto"
    >
      {/* 1. INSTITUTIONAL STATUS RIBBON (TOP) */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative p-8 bg-[#050810] border border-white/[0.03] rounded-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-24 h-24 text-[#00E676]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
                <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.4em] font-mono">System Operational</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight [word-spacing:0.8rem] uppercase leading-none">
                Command <span className="text-[#FFD700]">Terminal</span>
              </h1>
              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">Current Session Node: SYNC_2026_PRIMARY</p>
            </div>
            
            <div className="flex items-center gap-8 bg-white/[0.02] p-5 rounded-xl border border-white/[0.03] backdrop-blur-md">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">Total Mirroring</p>
                <p className="text-xl font-black text-white font-mono leading-none">$1,242.00</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="space-y-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">Signal Health</p>
                <p className="text-xl font-black text-[#00E676] font-mono leading-none">99.8%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-8 bg-gradient-to-br from-[#FFD700]/5 to-transparent border border-[#FFD700]/10 rounded-2xl flex flex-col justify-between group overflow-hidden">
          <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
            <ShieldCheck className="w-32 h-32 text-[#FFD700]" />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.4em] mb-2">Account Tier</p>
            <h4 className="text-2xl font-black text-white uppercase leading-none">Institutional <span className="text-[#FFD700]">Pro</span></h4>
          </div>
          <div className="mt-8 flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none underline decoration-[#FFD700]/30 underline-offset-4">Handshake Expiry</p>
              <p className="text-lg font-black text-white font-mono leading-none">27 DAYS</p>
            </div>
            <Link href="/dashboard/account" className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-white/40" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. COMMAND FEED & LIVE PROPAGATION (CENTRAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div className="space-y-1">
               <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.4em] font-mono">Live Data Matrix</span>
               <h3 className="text-2xl font-black text-white uppercase tracking-tight [word-spacing:0.8rem] leading-none">Market <span className="text-white/30">Propagations</span></h3>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
               <Activity className="w-3.5 h-3.5 text-[#00E676] animate-pulse" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Heartbeat Sync // OK</span>
            </div>
          </div>
          <motion.div variants={item} className="relative rounded-2xl overflow-hidden border border-white/[0.03] shadow-2xl bg-[#050810]/50 aspect-video lg:aspect-auto lg:h-[400px]">
             <Link href="/dashboard/bots" className="block w-full h-full relative group/chart">
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black/80 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">Active Signal Hub</p>
                         <p className="text-xs text-white/60 font-medium">Click to access the EA Bots terminal for full diagnostic data.</p>
                      </div>
                      <div className="p-3 bg-[#FFD700] text-black rounded-lg">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                   </div>
                </div>
                <SignalVisualizer symbol={official?.symbol || 'XAUUSD'} activeSymbols={[official?.symbol || 'XAUUSD']} logs={[]} />
             </Link>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="px-2">
             <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">Quick Launch</span>
             <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Operational <span className="text-white/30">Grid</span></h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {navCards.map((card, i) => (
              <Link key={i} href={card.href} className="group">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="p-5 flex items-center justify-between bg-white/[0.01] border border-white/[0.03] rounded-xl hover:bg-white/[0.03] transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                       <card.icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>
                    <div>
                      <h5 className="text-[14px] font-black text-white uppercase text-sm">{card.t}</h5>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{card.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-br from-[#00E676]/5 to-transparent border border-[#00E676]/10 rounded-2xl space-y-4">
             <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00E676]" />
                <span className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.3em] font-mono">AI Builder</span>
             </div>
             <p className="text-xs text-white/40 font-medium uppercase leading-relaxed">
                Instantly extract Pine Script logic from any YouTube URL.
             </p>
             <Link href="/dashboard/creator/ai-builder" className="block w-full py-3 bg-[#00E676] text-black text-center text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:scale-[1.02] transition-transform">
                Initialize Build
             </Link>
          </div>
        </div>
      </div>

      {/* 3. ALPHA SPOTLIGHTS (CINEMATIC FOCUS) */}
      <div className="space-y-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">Marketplace Highlights</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight [word-spacing:0.6rem] leading-none">Top <span className="text-[#00E676]">Alpha</span> Spotlights</h3>
               </div>
           <p className="text-[11px] font-black text-white/10 uppercase tracking-[0.2em] max-w-sm text-left md:text-right leading-relaxed">
              Nodes with the highest stability and profitability indices across the global Coppr net.
           </p>
        </div>

        <motion.div variants={item} className="rounded-2xl overflow-hidden border border-white/[0.03]">
            <SpotlightCarousel items={[
                ...(official ? [official] : []),
                ...featured.filter(f => f.id !== official?.id)
            ]} />
        </motion.div>
      </div>

      {/* 4. ACTIVE LIBRARY SCAN (COMPACT) */}
      <div className="space-y-8 pt-6">
        <div className="flex justify-between items-end px-2">
           <div className="space-y-1">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] font-mono">Alpha Database</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Active <span className="text-white/30">Strategies</span></h3>
           </div>
           <Link href="/dashboard/marketplace" className="text-[11px] font-black text-[#FFD700] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
              Access Full Hub <ChevronRight className="w-4 h-4" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(botLibrary.length > 0 ? botLibrary : [
            { id: 'm1', name: 'Momentum Algo NSE', roi: '94%', symbol: 'NIFTY' },
            { id: 'm2', name: 'News Filter EA', roi: '82%', symbol: 'XAUUSD' },
            { id: 'm3', name: 'Regression Bot', roi: '88%', symbol: 'BTC' },
            { id: 'm4', name: 'Coppr Mirror', roi: '91%', symbol: 'ETH' }
          ]).slice(0, 4).map((item: any) => (
            <Link key={item.id} href={`/dashboard/marketplace?id=${item.id}`} className="group">
               <motion.div 
                 className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-xl group-hover:border-[#FFD700]/30 transition-all flex flex-col gap-5"
               >
                  <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Bot className="w-5 h-5 text-[#FFD700]/60" />
                  </div>
                  <div>
                     <h4 className="text-[14px] font-black text-white uppercase leading-none mb-3 group-hover:text-[#FFD700] transition-colors">{item.name}</h4>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-[#00E676] font-mono">{item.roi || '99%'} ROI</span>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <span className="text-[10px] font-black text-white/20 font-mono tracking-tight">{item.symbol || 'SYNC'}</span>
                     </div>
                  </div>
               </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="pt-10">
        <Link href="/dashboard/creator" className="group block relative p-10 bg-gradient-to-r from-white/[0.01] to-transparent border border-white/[0.03] rounded-2xl hover:border-[#FFD700]/20 transition-all overflow-hidden text-center md:text-left">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3">
                 <h4 className="text-3xl md:text-5xl font-black text-white uppercase leading-none tracking-tight [word-spacing:0.6rem] opacity-80 group-hover:opacity-100 transition-opacity">Contribute <span className="text-[#FFD700]">Alpha</span></h4>
                 <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed">Share your quantitative strategies with the global network.</p>
              </div>
              <div className="px-10 py-4 bg-white/[0.03] border border-white/10 rounded-xl group-hover:bg-[#FFD700] group-hover:text-black transition-all font-black uppercase text-xs tracking-widest flex items-center gap-4">
                 Join Creator Hub
                 <ChevronRight className="w-4 h-4" />
              </div>
           </div>
        </Link>
      </div>
    </motion.div>
  );
}
