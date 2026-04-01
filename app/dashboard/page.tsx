import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: 'Member Dashboard | Coppr' };

export default async function DashboardHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: contentData } = await supabase.from('content').select('*').order('created_at', { ascending: false });
  const { data: updatesData } = await supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5);

  const bots = contentData?.filter(c => c.type === 'bot') || [];

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

      {/* STATS ROW (HIGH FIDELITY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            t: "Active Bots", v: "4", badge: "+1 this month", icon: "🤖", color: "#00E676", 
            sub: "Latest", subWhite: "RegressionX v2.1", progress: 100,
            footerArrow: "↑", footerText: "New bot added Mar 2026", link: "/dashboard/bots"
          },
          { 
            t: "Indicators", v: "7", badge: "+2 new", icon: "📊", color: "#00B0FF", 
            sub: "Latest", subWhite: "Gold Trend Filter", progress: 70,
            footerArrow: "↑", footerText: "2 added this month", link: "/dashboard/indicators" 
          },
          { 
            t: "Video Tutorials", v: "18", badge: "3 unwatched", icon: "🎬", color: "#F5A623", 
            sub: "Progress", subWhite: "15 of 18 watched", progress: 83,
            footerArrow: "", footerText: "83% complete — 3 left to watch", link: "/dashboard/tutorials" 
          },
          { 
            t: "Live Trade Logs", v: "152", badge: "Today +3.2%", icon: "📈", color: "#9C6EFA", 
            sub: "Win rate", subWhite: "71% across all bots", progress: 71, colorOverrideV: "#fff",
            badgeColor: "#00E676", footerArrow: "↑", footerText: "Last trade: +3.2% gain today", link: "/dashboard/updates" 
          }
        ].map((stat, i) => {
          const mainColor = stat.colorOverrideV || stat.color;
          const bgRgbaIcon = `${stat.color}1A`;
          const bgRgbaBadge = stat.badgeColor ? `${stat.badgeColor}1A` : bgRgbaIcon;
          const textBadge = stat.badgeColor || stat.color;

          return (
            <Link href={stat.link} key={i} className="bg-[#131929] border-[0.5px] border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:border-white/20 hover:bg-[#161E30] relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: stat.color }}></div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px]" style={{ backgroundColor: bgRgbaIcon }}>{stat.icon}</div>
                <div className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: bgRgbaBadge, color: textBadge }}>{stat.badge}</div>
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.06em] mb-1">{stat.t}</div>
              <div className="text-[26px] font-bold leading-none mb-1.5" style={{ color: mainColor }}>{stat.v}</div>
              <div className="text-[10px] text-white/30 leading-snug">{stat.sub}: <span className="font-semibold text-white">{stat.subWhite}</span></div>
              <div className="h-[3px] bg-white/10 rounded-sm mt-3 overflow-hidden">
                <div className="h-full rounded-sm transition-all duration-1000" style={{ width: `${stat.progress}%`, backgroundColor: stat.color }}></div>
              </div>
              <div className="text-[10px] mt-2 flex items-center gap-1">
                {stat.footerArrow && <span style={{ color: textBadge }}>{stat.footerArrow}</span>}
                <span className="text-white/40">{stat.footerText}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* COMPREHENSIVE BOT LIBRARY SECTION */}
      <div className="mt-2">
        <h2 className="text-xs font-semibold text-white/60 mb-3 flex items-center justify-between">
          Bot library — {bots.length} bots available <Link href="/dashboard/bots" className="text-[10px] text-[#00E676] cursor-pointer hover:underline">View all →</Link>
        </h2>

        {bots.map((bot) => {
          let meta = { desc: bot.description, winRate: 'N/A', trades: '0', avgGain: 'N/A' };
          try {
             const parsed = JSON.parse(bot.description);
             if (parsed.winRate) meta = { ...meta, ...parsed };
          } catch (e) {}
          
          const numericWinRate = parseInt(meta.winRate.replace('%','')) || 0;

          return (
            <Link href={bot.external_link || "/dashboard/bots"} key={bot.id} className="block p-3.5 rounded-[10px] bg-white/[0.04] border-[0.5px] border-white/5 mb-2 cursor-pointer transition-colors hover:border-[#00E676]/30 group">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div>
                  <div className="text-[13px] font-semibold text-white mb-1.5 flex items-center gap-1.5 flex-wrap">
                    {bot.title}
                    {bot.is_premium && <span className="bg-[#F5A623]/15 text-[#F5A623] border-[0.5px] border-[#F5A623]/30 text-[9px] px-1.5 py-0.5 rounded font-bold">PREMIUM</span>}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#00B0FF]/10 text-[#00B0FF] border-[0.5px] border-[#00B0FF]/20">Auto AI</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#00E676]/10 text-[#00E676] border-[0.5px] border-[#00E676]/15">Optimized</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-white/5 text-white/40 border-[0.5px] border-white/10">{new Date(bot.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}</span>
                  </div>
                </div>
                <button className="bg-[#00E676] text-black text-[10px] font-bold px-3 py-1.5 rounded-md shrink-0 transition-opacity hover:opacity-90">Download .mq5</button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-white/[0.03] rounded-md px-2.5 py-1.5 border-[0.5px] border-white/5">
                  <div className="text-[9px] text-white/40 uppercase tracking-[0.05em] mb-0.5">Win rate</div>
                  <div className="text-[13px] font-bold text-[#00E676]">{meta.winRate}</div>
                </div>
                <div className="bg-white/[0.03] rounded-md px-2.5 py-1.5 border-[0.5px] border-white/5">
                  <div className="text-[9px] text-white/40 uppercase tracking-[0.05em] mb-0.5">Trades logged</div>
                  <div className="text-[13px] font-bold text-white">{meta.trades}</div>
                </div>
                <div className="bg-white/[0.03] rounded-md px-2.5 py-1.5 border-[0.5px] border-white/5">
                  <div className="text-[9px] text-white/40 uppercase tracking-[0.05em] mb-0.5">Avg gain</div>
                  <div className="text-[13px] font-bold text-[#00E676]">{meta.avgGain}</div>
                </div>
              </div>

              <div className="mt-1">
                <div className="flex justify-between mb-1 text-[10px]">
                  <span className="text-white/40">Live win rate — {meta.trades} recorded trades</span>
                  <span className="font-semibold text-[#00E676]">{meta.winRate}</span>
                </div>
                <div className="h-[5px] bg-white/10 rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm bg-[#00E676] transition-all duration-1000" style={{ width: `${numericWinRate}%` }}></div>
                </div>
              </div>
              <div className="text-[10px] text-white/30 group-hover:text-[#00E676] transition-colors mt-2.5 inline-block">Setup guide →</div>
            </Link>
          );
        })}

        {bots.length === 0 && (
           <div className="py-8 text-center text-white/30 text-xs italic border border-dashed border-white/10 rounded-xl">No bots have been deployed yet.</div>
        )}

        <div className="text-[10px] text-white/30 mt-3 text-center">
          All stats from live recorded trades — not backtests. Updated as new trades are logged.
        </div>
      </div>

      {/* WHAT'S NEW FEED */}
      <h2 className="text-xl font-bold mt-8 mb-4">Live Updates Feed</h2>
      <div className="card divide-y divide-white/5">
        {updatesData?.map((up: any) => {
          const hoursAgo = Math.max(1, Math.floor((Date.now() - new Date(up.created_at).getTime()) / 3600000));
          return (
            <div key={up.id} className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-electric animate-pulse"></span>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">System Log • {hoursAgo} hr ago</p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{up.content}</p>
            </div>
          );
        })}
        {(!updatesData || updatesData.length === 0) && (
           <div className="p-8 text-center text-gray-600 italic border-t border-white/5">No updates broadcasted recently.</div>
        )}
        <div className="p-4 text-center border-t border-white/5">
            <Link href="/dashboard" className="text-[10px] text-green-electric font-black uppercase tracking-widest hover:underline">View all secure logs</Link>
        </div>
      </div>

    </div>
  );
}
