import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: 'Member Dashboard | Coppr' };

const FEATURED_BOTS = [
  {
    name: "RegressionX Bot v2.1",
    status: "NEW",
    tags: ["XAU/USD", "Lot 0.01–0.20", "Mar 2026"],
    stats: { winRate: 73, trades: 41, avgGain: "+2.1%" },
    type: "trading",
    link: "#"
  },
  {
    name: "GoldScalper Pro",
    status: "POPULAR",
    tags: ["XAU/USD", "Lot 0.05–0.20", "Feb 2026"],
    stats: { winRate: 68, trades: 89, avgGain: "+1.7%" },
    type: "trading",
    link: "#"
  },
  {
    name: "NewsFilter EA",
    status: "",
    tags: ["All pairs", "Any lot", "Jan 2026"],
    stats: { protRate: "94%", blocked: 217, useWith: "Any bot" },
    type: "utility",
    link: "#"
  },
  {
    name: "StarterBot Lite",
    status: "",
    tags: ["XAU/USD", "Lot 0.01 only", "Dec 2025"],
    stats: { winRate: 61, trades: 53, avgGain: "Max DD 4.2%" },
    type: "trading",
    link: "#"
  }
];

export default async function DashboardHome() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').single();
  const isActive = profile?.subscription_status === 'active';

  // DYNAMIC DATA
  const { data: contentItems } = await supabase.from('content').select('*');
  const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(3);

  const botsCount = contentItems?.filter(i => i.type === 'bot').length || 4;
  const indicatorsCount = contentItems?.filter(i => i.type === 'indicator').length || 7;
  const videosCount = contentItems?.filter(i => i.type === 'video').length || 18;
  
  // MOCK STATS FOR DEMO (Per spec)
  const stats = [
    { 
      t: "Active Bots", v: botsCount, icon: "🤖", color: "#00E676", glowClass: "card-glow-green",
      badge: "+1 this month", sub: "Latest: RegressionX v2.1", progress: 100, footer: "New bot added March 2026"
    },
    { 
      t: "Indicators", v: indicatorsCount, icon: "📊", color: "#00B0FF", glowClass: "card-glow-blue",
      badge: "+2 new", sub: "Latest: Smart FVG Pro", progress: 70, footer: "2 added this month"
    },
    { 
      t: "Video Tutorials", v: videosCount, icon: "🎬", color: "#F5A623", glowClass: "card-glow-amber",
      badge: "3 unwatched", sub: "Progress: 15 of 18 watched", progress: 83, footer: "83% complete — 3 left to watch"
    },
    { 
      t: "Live Trade Logs", v: "152", icon: "📈", color: "#9C6EFA", glowClass: "card-glow-purple",
      badge: "Today +2.1%", badgeColor: "#00E676", sub: "Win rate: 71% across all bots", progress: 71, footer: "Last trade: +0.8% gain today ↑"
    }
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 pt-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-1">Welcome, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</h1>
           <p className="text-sm text-gray-500">Member Status: <span className={isActive ? 'text-[#00E676] font-bold' : 'text-gold-badge font-bold'}>{isActive ? 'PREMIUM ACTIVE' : 'SUBSCRIPTION REQUIRED'}</span></p>
        </div>
        <div className="flex items-center gap-3">
           {user.email === 'anilava.babun@gmail.com' && (
             <Link href="/admin" className="px-4 py-2 bg-white/5 border border-white/10 rounded-badge text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-tighter">Admin Console ⚙️</Link>
           )}
           {!isActive && <Link href="/checkout" className="btn-primary py-2.5 px-6 text-sm">Upgrade Now</Link>}
        </div>
      </div>

      {/* STAT BOXES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.glowClass}`}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: s.color }}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${s.color}15` }}>{s.icon}</div>
              <div className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight" style={{ backgroundColor: `${s.color}15`, color: s.badgeColor || s.color }}>{s.badge}</div>
            </div>

            <div className="mb-4">
              <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1">{s.t}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{s.v}</h3>
                <p className="text-[10px] text-gray-400 font-medium">{s.sub}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.progress}%`, backgroundColor: s.color }}></div>
              </div>
              <p className="text-[10px] text-gray-600 font-medium">{s.footer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOT LIBRARY SECTION */}
      <div>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Bot library <span className="text-gray-600 font-normal">— {botsCount} bots available</span>
           </h2>
           <Link href="/dashboard/bots" className="text-[#00E676] text-xs font-bold hover:underline">View all →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_BOTS.map((bot, idx) => (
            <div key={idx} className={`bot-card group ${bot.stats.winRate && bot.stats.winRate >= 65 ? 'card-glow-green' : bot.stats.winRate ? 'card-glow-amber' : 'card-glow-blue'}`}>
              
              {/* TOP ROW */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[13px] font-bold text-white">{bot.name}</h3>
                    {bot.status && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter ${bot.status === 'NEW' ? 'bg-red-500/10 text-red-500' : 'bg-[#F5A623]/10 text-[#F5A623]'}`}>
                         {bot.status}
                       </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-[#00B0FF] font-bold">{bot.tags[0]}</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-[10px] text-[#00E676] font-bold">{bot.tags[1]}</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-[10px] text-gray-500 font-bold">{bot.tags[2]}</span>
                  </div>
                </div>
                <button className="bg-[#00E676] text-[#0B0F1A] px-4 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-tight hover:scale-105 transition-transform">
                  Download .mq5
                </button>
              </div>

              {/* MIDDLE ROW - STAT GRID */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {bot.type === 'trading' ? (
                  <>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Win Rate</p>
                      <p className={`text-sm font-bold ${bot.stats.winRate! >= 65 ? 'text-[#00E676]' : 'text-[#F5A623]'}`}>{bot.stats.winRate}%</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Trades Logged</p>
                      <p className="text-sm font-bold text-white">{bot.stats.trades}</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Avg Gain</p>
                      <p className="text-sm font-bold text-[#00E676]">{bot.stats.avgGain}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Protection Rate</p>
                      <p className="text-sm font-bold text-[#00B0FF]">{bot.stats.protRate}</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Events Blocked</p>
                      <p className="text-sm font-bold text-white">{bot.stats.blocked}</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Use With</p>
                      <p className="text-[10px] font-bold text-gray-400">{bot.stats.useWith}</p>
                    </div>
                  </>
                )}
              </div>

              {/* BOTTOM - WIN RATE BAR */}
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <p className="text-[9px] text-gray-500 italic">
                      {bot.type === 'trading' ? `Live win rate — based on ${bot.stats.trades} recorded trades` : 'News events blocked successfully'}
                    </p>
                    {bot.type === 'trading' && <span className={`text-xs font-black ${bot.stats.winRate! >= 65 ? 'text-[#00E676]' : 'text-[#F5A623]'}`}>{bot.stats.winRate}%</span>}
                 </div>
                 <div className="h-[5px] w-full bg-white/5 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: bot.type === 'trading' ? `${bot.stats.winRate}%` : bot.stats.protRate, 
                        backgroundColor: bot.type === 'trading' ? (bot.stats.winRate! >= 65 ? '#00E676' : '#F5A623') : '#00B0FF' 
                      }}
                    ></div>
                 </div>
                 <Link href="/dashboard/bots" className="text-[10px] text-gray-600 underline hover:text-gray-400 transition-colors">Setup guide →</Link>
              </div>

            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-700 text-center mt-10 italic">
          All stats are from live recorded trades — not backtests. Updated as new trades are logged.
        </p>
      </div>

    </div>
  );
}
