import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').single();
  const isActive = profile?.subscription_status === 'active';

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">My Account</h1>
        <p className="text-gray-500">Manage your subscription and terminal settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* PROFILE CARD */}
        <div className="md:col-span-2 space-y-8">
           <div className="stat-card border-white/5">
              <h2 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-6">Profile Identity</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Full Name</label>
                    <p className="text-white font-bold">{profile?.full_name || 'Guest Member'}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Email Terminal</label>
                    <p className="text-white font-bold">{user.email}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Member UID</label>
                    <p className="text-xs font-mono text-gray-600">{user.id}</p>
                 </div>
              </div>
           </div>

           <div className="stat-card border-white/5">
              <h2 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-6">Connected Protocols</h2>
              <div className="flex gap-4">
                 <div className="p-4 bg-white/5 rounded-[10px] border border-white/5 text-center flex-1">
                    <p className="text-[10px] font-bold text-gray-500 mb-1">MetaTrader 5</p>
                    <p className="text-sm font-bold text-[#00B0FF]">READY</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-[10px] border border-white/5 text-center flex-1">
                    <p className="text-[10px] font-bold text-gray-500 mb-1">Signal Mirror</p>
                    <p className="text-sm font-bold text-gray-600 italic">INACTIVE</p>
                 </div>
              </div>
           </div>
        </div>

        {/* SUBSCRIPTION STATUS */}
        <div className="md:col-span-1">
           <div className={`stat-card border-white/5 h-full flex flex-col justify-between ${isActive ? 'card-glow-green' : 'card-glow-amber'}`}>
              <div>
                 <h2 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-6">Subscription</h2>
                 <div className="mb-8">
                    <p className={`text-2xl font-black ${isActive ? 'text-[#00E676]' : 'text-[#F5A623]'}`}>
                       {isActive ? 'PREMIUM ACTIVE' : 'FREE MODE'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Active since: {new Date(profile?.subscription_end || Date.now()).toLocaleDateString()}</p>
                 </div>
              </div>
              
              {!isActive && (
                <Link href="/checkout" className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">
                  Upgrade Now
                </Link>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
