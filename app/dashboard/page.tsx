import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: 'Member Dashboard | Coppr' };

export default async function DashboardHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* WELCOME CARD */}
      <div className="card p-8 border-l-4 border-l-green-electric">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {profile?.full_name || 'Member'}</h1>
        <p className="text-sm text-gray-400 mb-4">Your subscription is active until <strong className="text-white">{new Date(profile?.subscription_expiry || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</strong>.</p>
        <div className="flex gap-4">
          <Link href="/dashboard/bots" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-badge text-sm font-bold transition-colors">Download MT5 Bot</Link>
          <Link href="/dashboard/tutorials" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-badge text-sm font-bold transition-colors">Watch Setup Guide</Link>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            t: "Active Bots", v: "4", badge: "+1 this month", icon: "🤖", color: "#00E676", 
            sub: "Latest: RegressionX v2.1", footer: "New bot added Mar 2026", progress: 100, link: "/dashboard/bots"
          },
          { 
            t: "Indicators", v: "8", badge: "+2 new", icon: "📊", color: "#00B0FF", 
            sub: "Latest: Gold Trend Filter", footer: "2 added this month", progress: 70, link: "/dashboard/indicators" 
          },
          { 
            t: "Video Tutorials", v: "15 / 18", badge: "3 unwatched", icon: "🎬", color: "#F5A623", 
            sub: "15 of 18 watched", footer: "83% complete — 3 left", progress: 83, link: "/dashboard/tutorials" 
          },
          { 
            t: "Live Trade Logs", v: "152", badge: "Today +3.2%", icon: "📈", color: "#9C6EFA", 
            sub: "Win rate: 71% overall", footer: "Last trade: +3.2% gain", progress: 71, link: "/dashboard/updates" 
          }
        ].map((stat, i) => (
          <Link href={stat.link} key={i} className={`card p-4 relative overflow-hidden group cursor-pointer hover:bg-white/[0.04] transition-all hover:shadow-[0_0_20px_${stat.color}40]`}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: stat.color }}></div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-inner" style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                {stat.icon}
              </div>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: i === 3 ? 'rgba(0,230,118,0.1)' : `${stat.color}15`, color: i === 3 ? '#00E676' : stat.color }}>
                {stat.badge}
              </div>
            </div>

            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{stat.t}</p>
            <p className="text-2xl font-bold text-white mb-1" style={{ color: i === 3 ? '#fff' : stat.color }}>{stat.v}</p>
            <p className="text-[10px] text-gray-400">
              {stat.sub.split(':')[0]}: <span className="text-white font-medium">{stat.sub.split(':')[1] || stat.sub}</span>
            </p>

            <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stat.progress}%`, backgroundColor: stat.color }}></div>
            </div>

            <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1 group-hover:text-white transition-colors">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: stat.color }}>→</span>
              {stat.footer}
            </p>
          </Link>
        ))}
      </div>

      {/* QUICK ACCESS CARDS */}
      <h2 className="text-xl font-bold mt-8 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/bots" className="card p-6 border border-white/5 hover:border-[#F5A623]/50 transition-all group cursor-pointer bg-[#F5A623]/5 hover:bg-[#F5A623]/10 hover:shadow-[0_0_30px_rgba(245,166,35,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5A623]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-lg font-bold text-gold-badge mb-2 flex items-center gap-2 relative z-10">
            <span>RegressionX Bot v2.1</span>
            <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] uppercase font-black rounded-badge">NEW</span>
          </h3>
          <p className="text-sm text-gray-400 mb-4 relative z-10">Optimized for XAU/USD. Updated lot sizing logic for high volatility news events.</p>
          <span className="text-sm font-black text-white group-hover:text-gold-badge transition-colors relative z-10 flex items-center gap-1">Download .mq5 <span className="group-hover:translate-x-1 transition-transform">→</span></span>
        </Link>
        
        <Link href="/dashboard/tutorials" className="card p-6 border border-white/5 hover:border-[#00B0FF]/50 transition-all group cursor-pointer bg-[#00B0FF]/5 hover:bg-[#00B0FF]/10 hover:shadow-[0_0_30px_rgba(0,176,255,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B0FF]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-lg font-bold text-white mb-2 relative z-10">Setup Guide: $250 Account</h3>
          <p className="text-sm text-gray-400 mb-4 relative z-10">Step-by-step video on configuring your lots and risk management for a RM/Reward mid-tier account.</p>
          <span className="text-sm font-black text-white group-hover:text-[#00B0FF] transition-colors relative z-10 flex items-center gap-1">Watch Now <span className="group-hover:translate-x-1 transition-transform">→</span></span>
        </Link>
      </div>

      {/* WHAT'S NEW FEED */}
      <h2 className="text-xl font-bold mt-8 mb-4">Live Updates Feed</h2>
      <div className="card divide-y divide-white/5">
        {[1,2,3].map(i => (
          <div key={i} className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-electric"></span>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Admin • {i} hours ago</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">Just closed a +3.2% gain on XAU/USD using the Pro bot (Lot 0.20) during the London open. Screen recording has been uploaded to the Live Trade Logs section. Please ensure terminal running smoothly.</p>
          </div>
        ))}
        <div className="p-4 text-center">
            <Link href="/dashboard" className="text-xs text-green-electric font-semibold hover:underline">View all updates</Link>
        </div>
      </div>

    </div>
  );
}
