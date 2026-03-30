import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TutorialsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: videos } = await supabase.from('content').select('*').eq('type', 'video').order('created_at', { ascending: false });

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 pt-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">Video Tutorials</h1>
        <p className="text-gray-500">Master the terminal with our step-by-step training modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos?.map((video, idx) => (
          <div key={idx} className="stat-card card-glow-amber overflow-hidden group">
            <div className="aspect-video bg-white/5 mb-6 rounded-[8px] flex items-center justify-center relative border border-white/5">
                <span className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity">🎬</span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <a href={video.external_link} target="_blank" className="bg-[#F5A623] hover:bg-white text-[#0A0F1E] font-black px-6 py-2 rounded-full text-xs uppercase transition-all transform group-hover:scale-105">Play Module</a>
                </div>
            </div>
            <div className="px-1">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-[#F5A623] uppercase tracking-widest">Training V1</span>
                  <span className="text-[10px] text-gray-600 font-bold">12:05 MIN</span>
               </div>
               <h3 className="text-md font-bold text-white mb-2 leading-tight">{video.title}</h3>
               <p className="text-xs text-gray-500 line-clamp-2">{video.description || 'Detailed walk-through of algorithmic setup and market risk management.'}</p>
            </div>
          </div>
        ))}
        {videos?.length === 0 && (
           <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[20px] border border-white/5">
              <p className="text-gray-600 italic">Academy modules are being prepared. Check back shortly!</p>
           </div>
        )}
      </div>
    </div>
  );
}
