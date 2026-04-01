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

      const [pRes, cRes, uRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('content').select('*').order('created_at', { ascending: false }),
        supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setProfile(pRes.data);
      setContentData(cRes.data || []);
      setUpdatesData(uRes.data || []);
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            t: "Active Bots", v: bots.length.toString(), badge: "+1 this month", icon: Bot, color: "#00E676", 
            subLeft: "Latest: ", subRight: bots[0]?.title || "RegressionX v2.1", type: 'sparkline', footerLeft: "↑", footerRight: "New bot added this month",
            href: "/dashboard/bots"
          },
          { 
            t: "Indicators", v: "7", badge: "+2 new", icon: BarChart3, color: "#00B0FF", 
            subLeft: "Latest: ", subRight: "Gold Trend Filter", type: 'heatmap', footerLeft: "↑", footerRight: "2 added this month",
            href: "/dashboard/indicators"
          },
          { 
            t: "Video Tutorials", v: "18", badge: "3 unwatched", icon: PlayCircle, color: "#F5A623", 
            subLeft: "Progress: ", subRight: "15 of 18 watched", type: 'gauge', progress: 83, footerLeft: "📋", footerRight: "83% complete — 3 left",
            href: "/dashboard/tutorials"
          },
          { 
            t: "Live Trade Logs", v: "152", badge: "Today +3.2%", badgeColor: "#00E676", icon: Activity, color: "#9C6EFA", 
            subLeft: "Win rate: ", subRight: "71% across all bots", type: 'scatter', footerLeft: "↑", footerRight: "Last trade: +3.2% gain today",
            href: "/dashboard/updates"
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} whileTap={{ scale: 0.97 }} className="h-full">
              <Link href={stat.href} className="flex flex-col h-full rounded-[14px] p-[16px] relative overflow-hidden transition-all duration-300 group border border-transparent hover:border-white/10" style={{ background: `linear-gradient(135deg, ${stat.color}14 0%, ${stat.color}05 100%)` }}>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300" />
                <div className="absolute -top-4 -right-4 w-[80px] h-[80px] rounded-full blur-[30px] pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-40" style={{ backgroundColor: stat.color }}></div>

                <div className="flex items-center justify-between mb-4 z-10 relative">
                  <div className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center border border-white/5" style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="px-2 py-0.5 rounded-[20px] text-[9px] font-bold uppercase tracking-wide border transition-colors duration-300" style={{ backgroundColor: `${stat.badgeColor || stat.color}1A`, color: stat.badgeColor || stat.color, borderColor: `${stat.badgeColor || stat.color}33` }}>
                    {stat.badge}
                  </div>
                </div>

                <div className="z-10 relative">
                  <div className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{stat.t}</div>
                  <div className="text-[26px] font-extrabold leading-none mb-1.5" style={{ color: stat.color }}>{stat.v}</div>
                  <div className="text-[10px] leading-tight truncate w-full" style={{ color: 'rgba(255,255,255,0.25)' }}>{stat.subLeft}<span className="text-white opacity-80">{stat.subRight}</span></div>
                </div>

                <div className="mt-4 mb-2 h-[45px] relative z-10">
                  {stat.type === 'sparkline' && (
                    <svg className="w-full h-full opacity-80" viewBox="0 0 200 45" preserveAspectRatio="none">
                      <path className="fill-none stroke-[1.5] animate-draw" style={{ stroke: stat.color, strokeDasharray: 200, strokeDashoffset: 200 }} d="M0 40 L20 35 L40 38 L60 25 L80 28 L100 15 L120 18 L140 8 L160 12 L180 3 L200 5" />
                    </svg>
                  )}
                  {stat.type === 'heatmap' && (
                    <div className="grid grid-cols-7 gap-1 h-full w-full opacity-60">
                      {Array.from({ length: 14 }).map((_, idx) => (
                        <div key={idx} className="h-2.5 rounded-sm" style={{ backgroundColor: [1, 4, 8, 11].includes(idx) ? 'rgba(255,71,87,0.4)' : stat.color }} />
                      ))}
                    </div>
                  )}
                  {stat.type === 'gauge' && (
                    <div className="flex flex-col items-center justify-center h-full -mt-2">
                      <svg width="80" height="40" viewBox="0 0 80 40">
                        <path d="M10 35 A30 30 0 0 1 70 35" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" strokeLinecap="round" />
                        <path d="M10 35 A30 30 0 0 1 70 35" fill="none" className="animate-draw" style={{ stroke: stat.color, strokeDasharray: 95, strokeDashoffset: 95 * (1 - (stat.progress || 0) / 100) }} strokeWidth="5" strokeLinecap="round" />
                      </svg>
                      <div className="text-[10px] font-bold" style={{ color: stat.color }}>{stat.progress}%</div>
                    </div>
                  )}
                  {stat.type === 'scatter' && (
                    <svg className="w-full h-full opacity-70" viewBox="0 0 200 45">
                      {[
                        { x: 20, y: 15, r: 3, c: '#00E676' },
                        { x: 50, y: 35, r: 2, c: '#FF4757' },
                        { x: 80, y: 10, r: 4, c: '#00E676' },
                        { x: 110, y: 25, r: 3, c: '#00E676' },
                        { x: 140, y: 5, r: 2, c: '#00E676' },
                        { x: 170, y: 30, r: 3, c: '#FF4757' },
                        { x: 190, y: 12, r: 4, c: '#00E676' }
                      ].map((d, idx) => (
                        <circle key={idx} cx={d.x} cy={d.y} r={d.r} fill={d.c} />
                      ))}
                    </svg>
                  )}
                </div>

                <div className="text-[10px] flex gap-1 z-10 relative mt-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <span className="font-black" style={{ color: stat.badgeColor || stat.color }}>{stat.footerLeft}</span> 
                  {stat.footerRight}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* TWO COLUMN ROW */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-[55%] rounded-[14px] p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/25">Bot Library</h3>
            <Link href="/dashboard/bots" className="text-[11px] font-bold transition-opacity hover:opacity-70 text-[#FFD700]">View all →</Link>
          </div>
          <div className="space-y-0">
            {bots.length > 0 ? bots.map((bot, i) => {
              let meta = { winRate: '60%', lot: 'Any lot', pair: 'XAU/USD' };
              try { const parsed = JSON.parse(bot.description); if (parsed.winRate) meta = { ...meta, ...parsed }; } catch (e) {}
              const wrClean = parseInt(meta.winRate.replace('%','')) || 0;
              let wrColor = wrClean < 65 ? "#F5A623" : "#00E676";
              if (meta.winRate.includes('safe') || meta.winRate.includes('protect')) wrColor = "#00B0FF";
              
              const hasAccess = profile?.subscription_status === 'active' || !!profile?.is_admin;
              const isLocked = bot.is_premium && !hasAccess;

              return (
                <div key={bot.id} className={`flex items-start justify-between py-3 ${i !== bots.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div className={`flex-1 pr-2 transition-all ${isLocked ? 'blur-[4px] opacity-40 select-none pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-bold truncate max-w-[150px] sm:max-w-none">{bot.title}</span>
                      {bot.is_premium && <span className="text-[8px] font-bold px-1.5 py-[1px] rounded-[20px] text-black tracking-widest bg-[#FFD700]">PRO</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] px-1.5 py-[1px] rounded-[4px] border" style={{ color: '#00B0FF', backgroundColor: 'rgba(0,176,255,0.1)', borderColor: 'rgba(0,176,255,0.2)' }}>{meta.pair}</span>
                      <span className="text-[9px] px-1.5 py-[1px] rounded-[4px] border" style={{ color: '#00E676', backgroundColor: 'rgba(0,230,118,0.1)', borderColor: 'rgba(0,230,118,0.2)' }}>{meta.lot}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 w-[100px] justify-between h-full gap-2 mt-0.5">
                    <div className={`flex items-center gap-2 w-full justify-end ${isLocked ? 'blur-[4px] opacity-40' : ''}`}>
                      <span className="text-[12px] font-bold leading-none" style={{ color: wrColor }}>{meta.winRate}</span>
                      <div className="w-[40px] h-[4px] rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(wrClean, 100)}%`, backgroundColor: wrColor }}></div>
                      </div>
                    </div>
                    {isLocked ? (
                      <Link href="/dashboard/marketplace" className="text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-[5px] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-all w-full text-center block">Unlock Pro</Link>
                    ) : (
                      <Link href={bot.external_link || '#'} className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-[5px] border hover:opacity-80 transition-opacity w-full text-center block" style={{ backgroundColor: 'rgba(255,215,0,0.12)', color: '#FFD700', borderColor: 'rgba(255,215,0,0.3)' }}>Download</Link>
                    )}
                  </div>
                </div>
              );
            }) : <div className="p-4 text-[11px] text-center italic text-white/30">No bots found.</div>}
          </div>
        </div>

        <div className="w-full lg:w-[45%] rounded-[14px] p-4 flex flex-col relative h-full" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/25">Live Updates</h3>
            <span className="text-[10px] font-bold text-red-500">New</span>
          </div>
          <div className="space-y-0 flex-1">
            {updatesData.map((feed, i) => (
              <div key={feed.id} className={`py-3 ${i !== (updatesData.length - 1) ? 'border-b' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-2 mb-1.5 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: '#FFD700' }}></span>
                  <span className="text-white/40">Admin · Update</span>
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-2 text-white/60">{feed.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACCESS GRID */}
      <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase px-1 mt-6 text-white/25">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {[
          { icon: Bot, title: "EA Bots", sub: "Bots & Algos", href: "/dashboard/bots" },
          { icon: BarChart3, title: "Indicators", sub: "Premium Tools", href: "/dashboard/indicators" },
          { icon: PlayCircle, title: "Tutorials", sub: "Video Guides", href: "/dashboard/tutorials" },
          { icon: BookOpen, title: "Setup", sub: "Guides", href: "/dashboard/guides" }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href} className="flex flex-col p-4 rounded-[14px] transition-all duration-200 group hover:-translate-y-[2px] hover:border-white/15 hover:bg-white/5 bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#FFD700]/10 transition-all">
                <Icon className="w-5 h-5 text-white/50 group-hover:text-[#FFD700]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold tracking-wide text-white">{card.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity text-[#FFD700]" />
              </div>
              <span className="text-[10px] mt-1 text-white/40">{card.sub}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
