import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: 'Member Dashboard | Coppr' };

export default async function DashboardHome() {
  const supabase = createClient();
  
  // 1. GET AUTH USER
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. GET USER PROFILE & SUBSCRIPTION STATUS
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single();

  const isActive = profile?.subscription_status === 'active';

  // 3. FETCH DYNAMIC CONTENT
  const { data: contentItems } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: updates } = await supabase
    .from('updates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const bots = contentItems?.filter(i => i.type === 'bot') || [];
  const indicators = contentItems?.filter(i => i.type === 'indicator') || [];
  const videos = contentItems?.filter(i => i.type === 'video') || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      
      {/* WELCOME CARD */}
      <div className="card p-8 border-l-4 border-l-green-electric relative overflow-hidden">
        {!isActive && (
          <div className="absolute inset-0 bg-[#0A0F1E]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 border border-white/5">
             <div className="w-16 h-16 bg-gold-badge/10 rounded-full flex items-center justify-center mb-4 text-2xl">🔒</div>
             <h3 className="text-xl font-bold text-white mb-2">Subscription Required</h3>
             <p className="text-sm text-gray-400 max-w-md mb-6">You need an active subscription to access the EA Bot library and indicators.</p>
             <Link href="/checkout" className="btn-primary py-3 px-8 shadow-[0_0_20px_rgba(0,230,118,0.3)]">Activate Now — Rs.1999</Link>
          </div>
        )}

        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</h1>
        <p className="text-sm text-gray-400 mb-4">
          Status: <strong className={isActive ? 'text-green-electric' : 'text-gold-badge'}>{isActive ? 'ACTIVE MEMBER' : 'INACTIVE'}</strong>
          {isActive && profile?.subscription_expiry && (
            <span className="ml-2">until <strong className="text-white">{new Date(profile.subscription_expiry).toLocaleDateString()}</strong></span>
          )}
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/bots" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-badge text-sm font-bold transition-colors">Download MT5 Bots</Link>
          <Link href="/dashboard/videos" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-badge text-sm font-bold transition-colors">Watch Setup Guides</Link>
          {user.email === 'anilava.babun@gmail.com' && (
            <Link href="/admin" className="px-5 py-2.5 bg-green-electric/20 text-green-electric hover:bg-green-electric/30 rounded-badge text-sm font-bold transition-all border border-green-electric/30">
              Admin Console ⚙️
            </Link>
          )}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: "Active Bots", v: bots.length.toString(), badge: "+1 this month", icon: "🤖", color: "#00E676", sub: bots[0]?.title || "Latest Bot", progress: 100 },
          { t: "Indicators", v: indicators.length.toString(), badge: "New updates", icon: "📊", color: "#00B0FF", sub: indicators[0]?.title || "Latest Set", progress: 70 },
          { t: "Video Tutorials", v: videos.length.toString(), badge: "All Lessons", icon: "🎬", color: "#F5A623", sub: "Step-by-step masterclass", progress: 85 },
          { t: "Community Logs", v: "152", badge: "Live Signals", icon: "📈", color: "#9C6EFA", sub: "Daily Win Rate: 71%", progress: 71 }
        ].map((stat, i) => (
          <div key={i} className="card p-4 relative overflow-hidden group cursor-pointer hover:bg-white/[0.03] transition-all">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: stat.color }}></div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${stat.color}15` }}>{stat.icon}</div>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.badge}</div>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{stat.t}</p>
            <p className="text-2xl font-bold text-white mb-1">{stat.v}</p>
            <p className="text-[10px] text-gray-400 truncate tracking-tight">{stat.sub}</p>
            <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stat.progress}%`, backgroundColor: stat.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* DYNAMIC CONTENT GRID */}
      <h2 className="text-xl font-bold mt-8 mb-4">Latest Assets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {!isActive && <div className="absolute inset-0 bg-transparent backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none"></div>}
        
        {contentItems?.slice(0, 4).map((item, idx) => (
          <div key={item.id} className={`card p-6 border-white/5 hover:border-gold-badge/50 transition-colors group cursor-pointer ${idx === 0 ? 'bg-[#F5A623]/5' : ''}`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${idx === 0 ? 'text-gold-badge' : 'text-white'}`}>
              <span>{item.title}</span>
              {idx === 0 && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] uppercase font-black rounded-badge">LATEST</span>}
            </h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description || 'Access terminal files and setup documentation.'}</p>
            <a 
              href={item.external_link || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white group-hover:text-gold-badge transition-colors inline-block"
            >
              {item.type === 'video' ? 'Watch Tutorial →' : 'Download File →'}
            </a>
          </div>
        ))}
        {(!contentItems || contentItems.length === 0) && (
          <div className="col-span-2 py-20 text-center text-gray-600 italic">No assets available yet. Accessing from Admin Panel...</div>
        )}
      </div>

      {/* LIVE UPDATES FEED */}
      <h2 className="text-xl font-bold mt-8 mb-4">Live Updates Feed</h2>
      <div className="card divide-y divide-white/5">
        {updates?.map((up, i) => (
          <div key={up.id} className="p-6 hover:bg-white/[0.01] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-electric"></span>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Broadcast • {new Date(up.created_at).toLocaleTimeString()}</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed italic">"{up.content}"</p>
          </div>
        ))}
        {(!updates || updates.length === 0) && (
          <div className="p-10 text-center text-gray-600 italic">No live updates posted today.</div>
        )}
      </div>

    </div>
  );
}
