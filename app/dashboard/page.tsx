import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: 'Member Dashboard | Coppr' };

export default async function DashboardHome() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').single();
  const isActive = profile?.subscription_status === 'active';

  // DYNAMIC DATA FROM DATABASE
  const { data: contentItems } = await supabase.from('content').select('*').order('created_at', { ascending: false });
  const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(4);

  const botsCount = contentItems?.filter(i => i.type === 'bot').length || 0;
  const indicatorsCount = contentItems?.filter(i => i.type === 'indicator').length || 0;
  const videosCount = contentItems?.filter(i => i.type === 'video').length || 0;
  
  const stats = [
    { 
      t: "Active Bots", v: botsCount, icon: "🤖", color: "#00E676", glowClass: "card-glow-green",
      sub: "Terminals Ready", progress: 100
    },
    { 
      t: "Indicators", v: indicatorsCount, icon: "📊", color: "#00B0FF", glowClass: "card-glow-blue",
      sub: "Signal Ready", progress: 65
    },
    { 
      t: "Academy", v: videosCount, icon: "🎬", color: "#F5A623", glowClass: "card-glow-amber",
      sub: "Training Ready", progress: 40
    },
    { 
      t: "Win Rate", v: "71%", icon: "📈", color: "#9C6EFA", glowClass: "card-glow-purple",
      sub: "Avg Monthly", progress: 71
    }
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 pt-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-1 tracking-tighter">System Overview</h1>
           <p className="text-sm text-gray-500 font-medium">Identity: <span className="text-[#00E676] font-black">{profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span> • Status: <span className={isActive ? 'text-[#00E676] font-bold' : 'text-gold-badge font-bold'}>{isActive ? 'PREMIUM ACTIVE' : 'SUBSCRIPTION REQUIRED'}</span></p>
        </div>
        <div className="flex items-center gap-3">
           {user.email === 'anilava.babun@gmail.com' && (
             <Link href="/admin" className="px-4 py-2 bg-white/5 border border-white/10 rounded-badge text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-tighter">Admin Console ⚙️</Link>
           )}
           {!isActive && <Link href="/checkout" className="btn-primary py-2.5 px-6 text-sm">Upgrade Now</Link>}
        </div>
      </div>

      {/* TOP SUMMARY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card p-4 md:p-5 ${s.glowClass}`}>
            <div className="flex justify-between items-center mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <span className="text-[10px] font-black text-white px-2 py-0.5 bg-white/5 rounded-full">{s.v}</span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">{s.t}</p>
            <p className="text-[11px] text-white font-bold">{s.sub}</p>
            <div className="h-[2px] w-full bg-white/5 mt-3 rounded-full overflow-hidden">
               <div className="h-full rounded-full" style={{ width: `${s.progress}%`, backgroundColor: s.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: QUICK NAV CARDS */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-sm font-black text-gray-600 uppercase tracking-widest">Command Launchpad</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link href="/dashboard/bots" className="stat-card border-white/5 hover:bg-white/[0.03] transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00E676]/10 rounded-[10px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🤖</div>
                    <div>
                       <h3 className="text-sm font-bold text-white">Bot Library</h3>
                       <p className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">{botsCount} Terminals Available</p>
                    </div>
                 </div>
              </Link>

              <Link href="/dashboard/indicators" className="stat-card border-white/5 hover:bg-white/[0.03] transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00B0FF]/10 rounded-[10px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📊</div>
                    <div>
                       <h3 className="text-sm font-bold text-white">Market Indicators</h3>
                       <p className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">{indicatorsCount} Indicators Ready</p>
                    </div>
                 </div>
              </Link>

              <Link href="/dashboard/tutorials" className="stat-card border-white/5 hover:bg-white/[0.03] transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5A623]/10 rounded-[10px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎬</div>
                    <div>
                       <h3 className="text-sm font-bold text-white">Video Academy</h3>
                       <p className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">{videosCount} Modules Online</p>
                    </div>
                 </div>
              </Link>

              <Link href="/dashboard/account" className="stat-card border-white/5 hover:bg-white/[0.03] transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#9C6EFA]/10 rounded-[10px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
                    <div>
                       <h3 className="text-sm font-bold text-white">My Profile</h3>
                       <p className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">Manage Subscription</p>
                    </div>
                 </div>
              </Link>

           </div>
        </div>

        {/* RIGHT: MINI UPDATES FEED */}
        <div className="lg:col-span-1 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-600 uppercase tracking-widest">Mission Logs</h2>
              <Link href="/dashboard/updates" className="text-[10px] font-bold text-[#00E676] hover:underline">Full Feed →</Link>
           </div>
           <div className="space-y-4">
              {updates?.map((item, id) => (
                <div key={id} className="p-4 bg-white/[0.02] border border-white/5 rounded-[12px] relative overflow-hidden group">
                   <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-purple-500/20 group-hover:bg-purple-500/60 transition-colors"></div>
                   <p className="text-[11px] text-gray-300 font-medium mb-1 line-clamp-2">{item.content}</p>
                   <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              ))}
              {(!updates || updates.length === 0) && <p className="text-xs text-gray-600 italic px-4">No recent signals recorded...</p>}
           </div>
        </div>

      </div>

    </div>
  );
}
