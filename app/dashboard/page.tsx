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
import HighFidelityHowItWorks from '@/components/ui/HighFidelityHowItWorks';

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
  const [daysLeft, setDaysLeft] = useState<string>('30');
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

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

      if (pRes.data) {
        setProfile(pRes.data);
        setIsPro(pRes.data.is_pro === true || pRes.data.tier === 'PRO' || pRes.data.account_tier === 'PRO');
        
        if (pRes.data.created_at) {
          const createDate = new Date(pRes.data.created_at);
          const now = new Date();
          const diffInTime = now.getTime() - createDate.getTime();
          const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
          const recDaysLeft = 30 - (diffInDays % 30);
          setDaysLeft(recDaysLeft.toString());
        }
      }
      
      setBotLibrary(cRes.data || []);
      setFeatured(featRes.data || []);
      
      if (offRes.data) {
        setOfficial(offRes.data);
      } else if (backupOffRes.data) {
        setOfficial({
          id: backupOffRes.data.id,
          name: backupOffRes.data.title,
          description: backupOffRes.data.description,
          symbol: 'XAUUSD',
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
      className="flex flex-col space-y-16 lg:space-y-8 pb-20 max-w-[1600px] mx-auto px-4 md:px-0"
    >
      {/* 1. TOP OPERATIONAL GRID (MOBILE SEQUENTIAL FLOW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-0 items-start">
        
        {/* MOBILE ORDER 1: ACCOUNT TIER */}
        <div className="px-2 order-1 lg:order-none lg:col-start-3 lg:row-start-1">
          {isPro ? (
            <div className="relative p-5 bg-gradient-to-br from-[#FFD700]/5 to-transparent border border-[#FFD700]/10 rounded-2xl flex flex-col justify-between group overflow-hidden min-h-[140px]">
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                <ShieldCheck className="w-24 h-24 text-[#FFD700]" />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-[#FFD700] uppercase tracking-[0.4em] mb-1">Account Tier</p>
                <h4 className="text-lg font-black text-white uppercase leading-none">Institutional <span className="text-[#FFD700]">Pro</span></h4>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="space-y-0.5">
                  <p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none underline decoration-[#FFD700]/30 underline-offset-4">Expiry</p>
                  <p className="text-sm font-black text-white font-mono leading-none">{daysLeft} DAYS</p>
                </div>
                <Link href="/dashboard/account" className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative p-5 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl flex flex-col justify-between group overflow-hidden min-h-[140px]">
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                <ShieldCheck className="w-24 h-24 text-white/10" />
              </div>
              <div className="space-y-1 z-10">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">Account Tier</p>
                <h4 className="text-md font-black text-white uppercase leading-none text-white/60">Standard <span className="text-white/20">Access</span></h4>
              </div>
              <div className="mt-4 flex items-end justify-between z-10">
                <Link href="/pricing" className="py-2 px-3 bg-[#FFD700] text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  Upgrade <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE ORDER 2: ANIMATION SEQUENCE */}
        <div className="lg:col-span-2 lg:row-span-2 space-y-4 order-2 lg:order-none">
          <div className="px-2">
             <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-3 bg-[#FFD700] rounded-full" />
                <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">Mission Control</span>
             </div>
             <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">Trade With Your <span className="text-[#FFD700]">First Strategy</span></h3>
          </div>
          <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-[#050505] h-[450px] lg:h-[450px] relative">
             <HighFidelityHowItWorks />
          </div>
          <Link href="/dashboard/marketplace" className="block w-full py-4 bg-[#FFD700] text-black text-center text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.01] transition-transform shadow-[0_0_30px_rgba(255,215,0,0.2)]">
             Start Trading
          </Link>
        </div>

        {/* MOBILE ORDER 3: QUICK LAUNCH GRID */}
        <div className="space-y-6 flex flex-col order-3 lg:order-none lg:col-start-3 lg:row-start-2 lg:mt-6">
          <div className="px-2">
             <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">Quick Launch</span>
             <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] leading-none">Operational <span className="text-white/30">Grid</span></h3>
          </div>
          <div className="grid grid-cols-1 gap-2 px-2">
            {navCards.map((card, i) => (
              <Link key={i} href={card.href} className="group">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="p-4 flex items-center justify-between bg-white/[0.01] border border-white/[0.03] rounded-xl hover:bg-white/[0.03] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                       <card.icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div>
                      <h5 className="text-[13px] font-black text-white uppercase tracking-widest">{card.t}</h5>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{card.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE ORDER 4: MARKETPLACE HIGHLIGHTS */}
      <div className="order-4 lg:order-none space-y-6 pt-4 lg:pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">Marketplace Highlights</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight [word-spacing:0.6rem] leading-none">Top <span className="text-[#00E676]">Alpha</span> Strategies</h3>
               </div>
        </div>
        <motion.div variants={item} className="rounded-2xl overflow-hidden border border-white/[0.03]">
            <SpotlightCarousel items={[
                ...(official ? [official] : []),
                ...featured.filter(f => f.id !== official?.id)
            ]} />
        </motion.div>
      </div>

      {/* MOBILE ORDER 5: OFFICIAL NODE (AWAITING DEPLOYMENT) */}
      <div className="order-5 lg:order-none md:col-span-2 pt-2 lg:pt-0">
      {official ? (
        <div className="md:col-span-2 relative p-8 bg-[#050505] border border-[#FFD700]/20 rounded-2xl overflow-hidden group shadow-[0_0_40px_rgba(255,215,0,0.05)] h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-[#FFD700] text-black text-[9px] font-black uppercase tracking-widest rounded-sm border border-[#FFD700]">Coppr Official</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">System Verified</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-none">{official.name}</h1>
                <p className="text-[11px] font-black text-[#888888] uppercase tracking-[0.2em] font-mono mt-2 line-clamp-2 max-w-lg">
                  {official.description?.replace(/<[^>]*>?/gm, '') || 'Institutional Grade Execution Node.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 lg:gap-8 bg-[#111111]/80 p-5 rounded-xl border border-[#FFD700]/20 backdrop-blur-md">
              <div className="space-y-1 text-center">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Win Rate</p>
                <p className="text-xl font-black text-[#FFD700] font-mono leading-none">{official.win_rate || '92'}%</p>
              </div>
              <div className="w-[1px] h-8 bg-[#FFD700]/20" />
              <Link href={`/dashboard/marketplace?id=${official.id}`} className="flex items-center justify-center p-3 bg-[#FFD700] text-black rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                <ChevronRight className="w-5 h-5 font-black" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative p-8 bg-[#050505] border border-[#1A1A1A] rounded-2xl overflow-hidden flex items-center justify-center min-h-[160px] h-full">
           <div className="flex flex-col items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-white/10" />
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">Awaiting Official Deployment...</p>
           </div>
        </div>
      )}
      </div>

      {/* MOBILE ORDER 6: ALPHA DATABASE */}
      <div className="order-6 lg:order-none space-y-6 pt-6 lg:pt-14">
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
               <motion.div className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-xl group-hover:border-[#FFD700]/30 transition-all flex flex-col gap-5">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Bot className="w-5 h-5 text-[#FFD700]/60" />
                  </div>
                  <div>
                     <h4 className="text-[14px] font-black text-white uppercase leading-none mb-3 group-hover:text-[#FFD700] transition-colors">{item.name}</h4>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-[#00E676] font-mono">{item.roi || '99%'} ROI</span>
                     </div>
                  </div>
               </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* MOBILE ORDER 7: INSTITUTIONAL AI SUITE */}
      <div className="pt-4 lg:pt-8 order-7 lg:order-none">
          <div className="p-8 bg-gradient-to-br from-[#00E676]/10 via-transparent to-transparent border border-[#00E676]/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-[0_0_50px_rgba(0,230,118,0.03)]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E676]/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="space-y-4 text-left flex-1 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00E676] animate-pulse" />
                   </div>
                   <div>
                      <span className="text-[11px] font-black text-[#00E676] uppercase tracking-[0.4em] font-mono">Institutional AI Suite</span>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mt-1">Initialize <span className="text-[#00E676]">Alpha</span> Build</h4>
                   </div>
                </div>
                <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed max-w-2xl">
                   Extract institutional-grade Pine Script logic from any YouTube tutorial instantly via our proprietary AI conduit.
                </p>
             </div>
             <Link href="/dashboard/creator/ai-builder" className="shrink-0 px-12 py-5 bg-[#00E676] text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.05] transition-transform shadow-[0_0_35px_rgba(0,230,118,0.3)] relative z-10">
                Access Builder Hub
             </Link>
          </div>
      </div>

      {/* MOBILE ORDER 8: CONTRIBUTOR HUB */}
      <motion.div variants={item} className="pt-16 pb-12 order-8 lg:order-none">
          <div className="relative p-12 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-transparent border border-white/5 rounded-[32px] overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 blur-[80px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-4 text-center md:text-left max-w-2xl">
                   <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                      <Users className="w-6 h-6 text-[#FFD700]" />
                      <span className="text-[11px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-mono">Contributor Hub</span>
                   </div>
                   <h4 className="text-3xl font-black text-white uppercase leading-tight tracking-tight">Become an <span className="text-[#FFD700]">Alpha</span> Architect</h4>
                   <p className="text-sm font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed">Deploy your own strategies to the global Coppr net.</p>
                </div>
                <Link href="/dashboard/creator/submit" className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all group-hover:scale-105">
                   Contribute Alpha
                </Link>
             </div>
          </div>
      </motion.div>
    </motion.div>
  );
}
