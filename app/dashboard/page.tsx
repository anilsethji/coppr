"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { 
  Bot, 
  BarChart3, 
  PlayCircle, 
  Activity, 
  Zap, 
  ArrowUpRight,
  Shield,
  BookOpen
} from "lucide-react";

import TerminalLog from "@/components/dashboard/TerminalLog";

export default function DashboardHome() {
  const [profile, setProfile] = useState<any>(null);
  const [contentData, setContentData] = useState<any[]>([]);
  const [updatesData, setUpdatesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, cRes, lRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('content').select('*').order('created_at', { ascending: false }),
        supabase.from('subscription_logs').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      setProfile(pRes.data);
      setContentData(cRes.data || []);
      setUpdatesData(lRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin"></div>
    </div>
  );

  const bots = contentData?.filter(c => c.type === 'bot') || [];
  const expiryDate = new Date(profile?.subscription_expiry || Date.now());
  const now = new Date();
  const daysDiff = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="space-y-8 pb-10 max-w-[1200px] mx-auto text-white font-sans">
      
      {/* WELCOME SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 rounded-[14px] relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full filter blur-[100px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>

        <div className="flex-1 z-10 relative">
          <h1 className="text-[20px] font-bold tracking-tight mb-1">Welcome back, {profile?.full_name?.split(' ')[0] || 'Member'} 👋</h1>
          <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Pro Kit — active until <span className="font-bold text-[#FFD700]">{expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/bots" className="px-5 py-2.5 rounded-[8px] text-[12px] font-bold text-[#080C14] text-center transition-transform hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(255,215,0,0.15)]" style={{ background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)' }}>
              Download Latest Bot
            </Link>
            <Link href="/dashboard/tutorials" className="px-5 py-2.5 rounded-[8px] text-[12px] font-medium text-center transition-transform hover:-translate-y-[2px]" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
              Watch Setup Guide
            </Link>
            </div>
        </div>

        <div className="shrink-0 z-10 relative rounded-[14px] px-[20px] py-[14px] flex flex-col items-center justify-center min-w-[140px] shadow-[0_10px_30px_rgba(255,215,0,0.05)] border" style={{ background: 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.01) 100%)', borderColor: 'rgba(255,215,0,0.3)' }}>
           <span className="text-[34px] font-bold leading-none text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">{daysDiff}</span>
           <span className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>days remaining</span>
        </div>
      </div>

      {/* STAT BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            t: "Active Bots", v: bots.length.toString(), badge: "+1 this month", icon: Bot, color: "#00E676", 
            subLeft: "Latest: ", subRight: bots[0]?.title || "RegressionX v2.1", progress: 100, footerLeft: "↑", footerRight: "New bot added Mar 2026",
            href: "/dashboard/bots"
          },
          { 
            t: "Indicators", v: "7", badge: "+2 new", icon: BarChart3, color: "#00B0FF", 
            subLeft: "Latest: ", subRight: "Gold Trend Filter", progress: 70, footerLeft: "↑", footerRight: "2 added this month",
            href: "/dashboard/indicators"
          },
          { 
            t: "Video Tutorials", v: "18", badge: "3 unwatched", icon: PlayCircle, color: "#F5A623", 
            subLeft: "Progress: ", subRight: "15 of 18 watched", progress: 83, footerLeft: "🎬", footerRight: "83% complete — 3 left",
            href: "/dashboard/tutorials"
          },
          { 
            t: "Live Trade Logs", v: "152", badge: "Today +3.2%", icon: Activity, color: "#9C6EFA", 
            subLeft: "Win rate: ", subRight: "71% across all bots", progress: 71, footerLeft: "↑", footerRight: "Last trade: +3.2% gain today",
            href: "/dashboard/updates"
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              whileHover={{ y: -4, borderColor: `${stat.color}4D` }}
              className="group relative bg-[#131929] border border-white/[0.08] rounded-[12px] p-[14px_16px] cursor-pointer transition-all duration-200 overflow-hidden"
            >
              <Link href={stat.href}>
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-[12px_12px_0_0]" style={{ backgroundColor: stat.color }}></div>
                
                <div className="flex items-center justify-between mb-[10px]">
                  <div className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[13px]" style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}>
                    <Icon className="w-[14px] h-[14px]" />
                  </div>
                  <div className="text-[9px] font-bold px-[7px] py-[2px] rounded-[10px]" style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}>
                    {stat.badge}
                  </div>
                </div>

                <div className="text-[10px] uppercase tracking-[0.06em] mb-[4px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.t}</div>
                <div className="text-[26px] font-bold leading-none mb-[6px]" style={{ color: stat.color }}>{stat.v}</div>
                
                <div className="text-[10px] leading-[1.4]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {stat.subLeft}<span className="font-semibold text-white">{stat.subRight}</span>
                </div>

                {/* Mini Bar */}
                <div className="h-[3px] bg-white/[0.07] rounded-[2px] mt-[10px] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    className="h-full rounded-[2px]" 
                    style={{ backgroundColor: stat.color }}
                  />
                </div>

                <div className="text-[10px] mt-[8px] flex items-center gap-[4px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <span className="font-bold" style={{ color: stat.color }}>{stat.footerLeft}</span>
                  {stat.footerRight}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* TWO COLUMN ROW */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-[60%] space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[12px] font-semibold text-white/60 flex items-center gap-2">
              Bot library — {bots.length} bots available
            </h3>
            <Link href="/dashboard/bots" className="text-[10px] text-[#00E676] hover:underline">View all →</Link>
          </div>
          
          <div className="space-y-3">
            {bots.length > 0 ? bots.map((bot, i) => {
              let meta = { winRate: '60%', lot: '0.01-0.20', pair: 'XAU/USD', trades: '41', gain: '+2.1%' };
              try { 
                const parsed = JSON.parse(bot.description); 
                if (parsed.winRate) meta = { ...meta, ...parsed }; 
              } catch (e) {}
              
              const wrClean = parseInt(meta.winRate.replace('%','')) || 0;
              const hasAccess = profile?.subscription_status === 'active' || !!profile?.is_admin;
              const isLocked = bot.is_premium && !hasAccess;

              return (
                <div key={bot.id} className="group bg-[#131929]/40 border border-white/[0.07] rounded-[10px] p-[12px_14px] hover:border-[#00E6764D] transition-all duration-200">
                  <div className="flex items-start justify-between gap-[10px] mb-[10px]">
                    <div className={isLocked ? 'blur-[4px] opacity-40' : ''}>
                      <div className="text-[13px] font-semibold text-white mb-[4px] flex items-center gap-[6px]">
                        {bot.title}
                        {bot.is_premium && <span className="bg-[#FF525226] text-[#FF5252] text-[9px] px-[6px] py-[2px] rounded-[4px] font-bold border border-[#FF52524D]">PRO</span>}
                        {i === 0 && <span className="bg-[#F5A63526] text-[#F5A623] text-[9px] px-[6px] py-[2px] rounded-[4px] font-bold border border-[#F5A6234D]">HOT</span>}
                      </div>
                      <div className="flex gap-[5px]">
                        <span className="text-[10px] px-[7px] py-[2px] rounded-[4px] bg-[#00B0FF1A] text-[#00B0FF] border border-[#00B0FF33]">{meta.pair}</span>
                        <span className="text-[10px] px-[7px] py-[2px] rounded-[4px] bg-[#00E67614] text-[#00E676] border border-[#00E67626]">Lot {meta.lot}</span>
                      </div>
                    </div>
                    {isLocked ? (
                       <Link href="/dashboard/marketplace" className="bg-[#FFD700] text-black text-[10px] font-bold px-[12px] py-[6px] rounded-[6px] whitespace-nowrap">Unlock Pro</Link>
                    ) : (
                       <Link href={bot.external_link || '#'} className="bg-[#00E676] text-black text-[10px] font-bold px-[12px] py-[6px] rounded-[6px] whitespace-nowrap">Download .ex5</Link>
                    )}
                  </div>

                  <div className={`grid grid-cols-3 gap-[8px] mb-[8px] ${isLocked ? 'blur-[4px] opacity-40' : ''}`}>
                    <div className="bg-white/[0.03] rounded-[6px] p-[7px_10px] border border-white/[0.05]">
                      <div className="text-[9px] text-white/35 uppercase tracking-[0.05em] mb-[3px]">Win rate</div>
                      <div className="text-[13px] font-bold text-[#00E676]">{meta.winRate}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-[6px] p-[7px_10px] border border-white/[0.05]">
                      <div className="text-[9px] text-white/35 uppercase tracking-[0.05em] mb-[3px]">Trades logged</div>
                      <div className="text-[13px] font-bold text-white">{meta.trades}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-[6px] p-[7px_10px] border border-white/[0.05]">
                      <div className="text-[9px] text-white/35 uppercase tracking-[0.05em] mb-[3px]">Avg gain</div>
                      <div className="text-[13px] font-bold text-[#00E676]">{meta.gain}</div>
                    </div>
                  </div>

                  <div className={`mt-[2px] ${isLocked ? 'blur-[4px] opacity-40' : ''}`}>
                    <div className="flex justify-between mb-[4px]">
                      <span className="text-[10px] text-white/35">Live win rate — {meta.trades} recorded trades</span>
                      <span className="text-[10px] font-semibold text-[#00E676]">{meta.winRate}</span>
                    </div>
                    <div className="h-[5px] bg-white/[0.08] rounded-[3px] overflow-hidden">
                      <div className="h-full bg-[#00E676] rounded-[3px]" style={{ width: `${wrClean}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            }) : <div className="p-8 text-center text-white/20 italic border border-dashed border-white/10 rounded-xl">No active bot protocols detected in your vault.</div>}
          </div>
        </div>

        <div className="w-full lg:w-[40%] space-y-4">
           <div className="flex justify-between items-center px-1">
            <h3 className="text-[12px] font-semibold text-white/60">Live Updates</h3>
            <span className="bg-[#FF525226] text-[#FF5252] text-[9px] px-[6px] py-[1px] rounded-[4px] font-bold">LIVE</span>
          </div>
          <TerminalLog logs={updatesData} />
        </div>
      </div>

      {/* QUICK ACCESS GRID */}
      <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase px-1 mt-6 text-white/25">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {[
          { icon: Bot, title: "EA Bots", sub: "Bots & Algos", href: "/dashboard/bots" },
          { icon: BarChart3, title: "Indicators", sub: "Premium Tools", href: "/dashboard/indicators" },
          { icon: PlayCircle, title: "Tutorials", sub: "Video Guides", href: "/dashboard/tutorials" },
          { icon: Zap, title: "Share My Strategy", sub: "Submit & Earn", href: "/dashboard/creator/submit", highlight: true }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href} className={`flex flex-col p-4 rounded-[14px] transition-all duration-200 group hover:-translate-y-[2px] border ${card.highlight ? 'bg-[#FFD700]/5 border-[#FFD700]/20 hover:border-[#FFD700]/40' : 'bg-white/5 border-white/10 hover:border-white/15 hover:bg-white/10'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all ${card.highlight ? 'bg-[#FFD700]/10' : 'bg-white/5 group-hover:bg-[#FFD700]/5'}`}>
                <Icon className={`w-5 h-5 transition-colors ${card.highlight ? 'text-[#FFD700]' : 'text-white/50 group-hover:text-[#FFD700]'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] font-bold tracking-wide ${card.highlight ? 'text-[#FFD700]' : 'text-white'}`}>{card.title}</span>
                <ArrowUpRight className={`w-3.5 h-3.5 transition-opacity ${card.highlight ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'} text-[#FFD700]`} />
              </div>
              <span className={`text-[10px] mt-1 ${card.highlight ? 'text-[#FFD700]/60' : 'text-white/40'}`}>{card.sub}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
