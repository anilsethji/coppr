import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BotsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: bots } = await supabase.from('content').select('*').eq('type', 'bot').order('created_at', { ascending: false });

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 pt-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">EA Bot Library</h1>
          <p className="text-gray-500">Professional algorithmic trading terminals for XAU/USD and more.</p>
        </div>
        <div className="text-[10px] font-black text-white px-3 py-1 bg-[#00E676]/10 border border-[#00E676]/20 rounded-full flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-pulse"></span>
           {bots?.length || 0} TERMINALS ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bots?.map((bot, idx) => {
          const isUtility = bot.prot_rate || bot.use_with;
          const tags = bot.description?.split(', ') || [];
          
          return (
            <div key={idx} className={`bot-card group ${bot.win_rate && bot.win_rate >= 65 ? 'card-glow-green' : bot.win_rate ? 'card-glow-amber' : 'card-glow-blue'}`}>
              {/* TOP ROW */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[13px] font-bold text-white">{bot.title}</h3>
                    {bot.status_badge && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter ${bot.status_badge === 'NEW' ? 'bg-red-500/10 text-red-500' : 'bg-[#F5A623]/10 text-[#F5A623]'}`}>
                         {bot.status_badge}
                       </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {tags.map((tag: string, tid: number) => (
                      <span key={tid} className="text-[10px] text-gray-500 font-bold">
                         {tid > 0 && <span className="mr-2 text-gray-800">•</span>}
                         {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a 
                  href={bot.external_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#00E676] text-[#0B0F1A] px-4 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-tight hover:scale-105 transition-transform inline-block"
                >
                  Download .mq5
                </a>
              </div>

              {/* MIDDLE ROW - STAT GRID */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {!isUtility ? (
                  <>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Win Rate</p>
                      <p className={`text-sm font-bold ${bot.win_rate >= 65 ? 'text-[#00E676]' : 'text-[#F5A623]'}`}>{bot.win_rate}%</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Trades Logged</p>
                      <p className="text-sm font-bold text-white">{bot.trades_count}</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Avg Gain</p>
                      <p className="text-sm font-bold text-[#00E676]">{bot.avg_gain}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Protection Rate</p>
                      <p className="text-sm font-bold text-[#00B0FF]">{bot.prot_rate}</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Events Blocked</p>
                      <p className="text-sm font-bold text-white">{bot.blocked_count}</p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-[6px] border border-white/5">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Use With</p>
                      <p className="text-[10px] font-bold text-gray-400">{bot.use_with}</p>
                    </div>
                  </>
                )}
              </div>

              {/* BOTTOM - WIN RATE BAR */}
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <p className="text-[9px] text-gray-500 italic">
                      {!isUtility ? `Live win rate — based on ${bot.trades_count} recorded trades` : 'News events blocked successfully'}
                    </p>
                    {!isUtility && <span className={`text-xs font-black ${bot.win_rate >= 65 ? 'text-[#00E676]' : 'text-[#F5A623]'}`}>{bot.win_rate}%</span>}
                 </div>
                 <div className="h-[5px] w-full bg-white/5 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: !isUtility ? `${bot.win_rate}%` : bot.prot_rate, 
                        backgroundColor: !isUtility ? (bot.win_rate >= 65 ? '#00E676' : '#F5A623') : '#00B0FF' 
                      }}
                    ></div>
                 </div>
                 <Link href={bot.setup_link || "#"} className="text-[10px] text-gray-600 underline hover:text-gray-400 transition-colors">Setup guide →</Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
