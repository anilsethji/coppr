import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PremiumLock } from "@/components/ui/PremiumLock";

export default async function IndicatorsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single();
  const isSubscribed = profile?.subscription_status === 'active';

  const { data: indicators } = await supabase.from('content').select('*').eq('type', 'indicator').order('created_at', { ascending: false });

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 pt-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">Market Indicators</h1>
        <p className="text-gray-500">Enhanced visual tools for MT5 to identify high-probability entries.</p>
      </div>

      <PremiumLock isSubscribed={isSubscribed}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators?.map((item, idx) => (
          <div key={idx} className="stat-card card-glow-blue">
            <div className="flex justify-between items-start mb-6">
               <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-xl">📊</div>
               <a 
                href={item.external_link} 
                className="px-4 py-2 bg-[#00B0FF] text-[#0A0F1E] rounded-[6px] text-[10px] font-black uppercase tracking-tight hover:opacity-90 active:scale-95"
               >
                 Install .ex5
               </a>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">{item.description || 'Professional indicator for advanced market structure analysis.'}</p>
            
            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Protocol V1.0</span>
               <span className="text-[10px] font-bold text-[#00B0FF]">LATEST VERSION</span>
            </div>
          </div>
        ))}
        {indicators?.length === 0 && (
           <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[20px] border border-white/5">
              <p className="text-gray-600 italic">No special indicators broadcasted yet. Check back soon!</p>
           </div>
        )}
      </div>
      </PremiumLock>
    </div>
  );
}
