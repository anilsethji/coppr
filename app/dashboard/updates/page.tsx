import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UpdatesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20 px-4 pt-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">Live Mission Logs</h1>
        <p className="text-gray-500">Real-time signals and platform broadcast updates.</p>
      </div>

      <div className="space-y-6">
        {updates?.map((update, idx) => (
          <div key={idx} className="stat-card border-white/5 bg-[#131929]/50 card-glow-purple">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-lg">📡</div>
                  <div>
                     <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Broadcast Channel-01</p>
                     <p className="text-[10px] font-bold text-gray-600">{new Date(update.created_at).toLocaleString()}</p>
                  </div>
               </div>
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-gray-500">Official Signal</span>
            </div>
            <div className="p-4 bg-[#0A0F1E]/50 rounded-[8px] border border-white/5">
               <p className="text-sm text-gray-200 leading-relaxed font-mono">
                 <span className="text-gray-600 mr-2">{'>'}</span>{update.content}
               </p>
            </div>
          </div>
        ))}
        {updates?.length === 0 && (
           <div className="py-20 text-center bg-white/[0.02] rounded-[20px] border border-white/5">
              <p className="text-gray-600 italic">No broadcast signals recorded in the last 24h.</p>
           </div>
        )}
      </div>
    </div>
  );
}
