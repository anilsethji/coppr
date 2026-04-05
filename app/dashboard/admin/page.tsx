'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, Zap, Bot, FileCode, ShieldCheck, ArrowRight, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

// NOTE: We use the server actions from the original admin folder
import { addAsset, deleteAsset, updateAsset, addUpdate, deleteUpdate } from '../../admin/actions';

export default function UnifiedAdminConsole() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // INLINE EDIT STATE
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLink, setEditLink] = useState('');
  
  // FORM STATE
  const [title, setTitle] = useState('');
  const [type, setType] = useState('bot');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  
  // BOT SPECIFIC STATS (As requested by user for Official Coppr Bots)
  const [winRate, setWinRate] = useState('73%');
  const [trades, setTrades] = useState('41');
  const [avgGain, setAvgGain] = useState('+2.1%');
  
  const supabase = createClient();
  const router = useRouter();

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from('content').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, [supabase]);

  const fetchPending = useCallback(async () => {
    const { count } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');
    setPendingCount(count || 0);
  }, [supabase]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', authUser.id).single();
      if (!profile?.is_admin) { 
        router.push('/dashboard');
        return;
      }
      setUser(authUser);
      fetchContent();
      fetchPending();
    };
    checkAdmin();
  }, [supabase, router, fetchContent, fetchPending]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payloadDesc = type === 'bot' ? JSON.stringify({ desc, winRate, trades, avgGain }) : desc;
    const res = await addAsset({ title, type, description: payloadDesc, external_link: link, is_premium: true });
    if (res.success) {
       setTitle(''); setDesc(''); setLink(''); setWinRate('73%'); setTrades('41'); setAvgGain('+2.1%');
       fetchContent();
    } else { alert("Error: " + res.error); }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAsset(id);
    if (res.success) fetchContent();
  };

  const handleEditSave = async (id: string) => {
    const res = await updateAsset(id, { title: editTitle, external_link: editLink });
    if (res.success) { setEditId(null); fetchContent(); }
  };

  if (loading) return <div className="p-20 text-center text-white/20 animate-pulse font-black uppercase tracking-widest italic">Authenticating Admin Protocol...</div>;

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. HEADER SECTION (Legacy Style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <ShieldCheck className="w-5 h-5 text-[#00E676]" />
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Administrative Authority Verified</span>
           </div>
           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Coppr Admin Console</h1>
           <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest mt-1 italic">Operator: {user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* 2. LEFT: DEPLOYMENT FORMS (Official Library Management) */}
        <div className="lg:col-span-1 space-y-10">
          
          <div className="p-8 rounded-[40px] bg-[#131929]/80 border border-white/5 backdrop-blur-xl space-y-8">
            <div className="space-y-1">
               <h2 className="text-xl font-black text-[#00E676] uppercase italic tracking-tighter">Deploy New Asset</h2>
               <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Register Official Coppr Labs Assets</p>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase mb-2 tracking-widest">Protocol Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#00E676] outline-none">
                       <option value="bot">Official EA Bot</option>
                       <option value="indicator">Market Indicator</option>
                       <option value="video">Tutorial Module</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase mb-2 tracking-widest">Asset Name</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CopprX v3.1" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#00E676] outline-none placeholder:text-white/10" required />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase mb-2 tracking-widest">Asset URL</label>
                    <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#00E676] outline-none placeholder:text-white/10 font-mono" />
                 </div>

                 {type === 'bot' && (
                   <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                      <div>
                        <label className="block text-[9px] font-black text-[#00E676] uppercase mb-2 tracking-tighter">Win Rate</label>
                        <input type="text" value={winRate} onChange={(e)=>setWinRate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-white/40 uppercase mb-2 tracking-tighter">Trades</label>
                        <input type="text" value={trades} onChange={(e)=>setTrades(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-[#00E676] uppercase mb-2 tracking-tighter">Avg Gain</label>
                        <input type="text" value={avgGain} onChange={(e)=>setAvgGain(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      </div>
                   </div>
                 )}
              </div>

              <button type="submit" className="w-full py-5 bg-[#00E676] text-black font-black uppercase text-xs rounded-3xl tracking-[0.2em] shadow-lg shadow-[#00E676]/20 hover:scale-[1.02] transition-all">Broadcast Node</button>
            </form>
          </div>

          <div className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/10 space-y-6">
             <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-black text-red-500 uppercase italic tracking-tighter">Flash Feed News</h3>
             </div>
             <form onSubmit={async (e) => {
               e.preventDefault();
               const text = (e.currentTarget.elements.namedItem('news') as HTMLTextAreaElement).value;
               const res = await addUpdate(text);
               if (res.success) { e.currentTarget.reset(); window.location.reload(); }
             }} className="space-y-4">
               <textarea name="news" placeholder="Broadcasting network intel..." className="w-full bg-black/40 border border-white/10 rounded-3xl p-5 text-white text-sm h-32 focus:border-red-500 outline-none placeholder:opacity-20 italic" required />
               <button type="submit" className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl tracking-[0.2em] hover:bg-white/10 transition-all italic">Kill Signal Broadcast →</button>
             </form>
          </div>

        </div>

        {/* 3. RIGHT: CLEARANCE & LISTINGS */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* THE TWO REQUESTED CLEARANCE BUTTONS */}
          <div className="p-10 rounded-[48px] bg-gradient-to-br from-[#131929] to-black border border-white/10 shadow-2xl space-y-10">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Community Clearance Hub</h2>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{pendingCount} Strategies Awaiting Approval</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20 animate-pulse">
                   <Zap className="w-6 h-6 text-[#FFD700]" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/admin/clearance/indicators" className="group">
                   <div className="p-8 rounded-[38px] bg-white/5 border border-white/5 hover:border-[#FFD700]/40 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[#FFD700]/10">
                            <FileCode className="w-7 h-7 text-[#FFD700]" />
                         </div>
                         <span className="text-lg font-black text-white italic uppercase tracking-tight group-hover:text-[#FFD700] transition-colors">Indicator Bots</span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                   </div>
                </Link>

                <Link href="/dashboard/admin/clearance/ea" className="group">
                   <div className="p-8 rounded-[38px] bg-white/5 border border-white/5 hover:border-[#00E676]/40 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[#00E676]/10">
                            <Bot className="w-7 h-7 text-[#00E676]" />
                         </div>
                         <span className="text-lg font-black text-white italic uppercase tracking-tight group-hover:text-[#00E676] transition-colors">EA Bots</span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                   </div>
                </Link>
             </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black text-white/40 uppercase italic tracking-widest pl-4 border-l-2 border-[#00B0FF]">Proprietary Terminal Assets</h3>
            <div className="grid grid-cols-1 gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-6 rounded-[34px] bg-[#131929] border border-white/5 flex items-center justify-between group hover:border-[#00B0FF]/25 transition-all">
                  {editId === item.id ? (
                    <div className="flex-1 space-y-4">
                       <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none" />
                       <div className="flex gap-4">
                          <button onClick={() => handleEditSave(item.id)} className="px-6 py-2 bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-[10px] font-black uppercase rounded-xl tracking-widest">Commit Changes</button>
                          <button onClick={() => setEditId(null)} className="px-6 py-2 bg-white/5 text-white/40 text-[10px] font-black uppercase rounded-xl tracking-widest">Abort</button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/5 group-hover:text-white">
                           {item.type === 'bot' ? '🤖' : item.type === 'indicator' ? '📊' : '🎬'}
                        </div>
                        <div>
                          <h4 className="font-black text-white italic text-lg">{item.title}</h4>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">{item.type} | {item.external_link ? 'Synced' : 'No Source'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditId(item.id); setEditTitle(item.title); setEditLink(item.external_link || ''); }} className="text-[10px] font-black text-[#00B0FF] uppercase tracking-widest hover:underline">Revise</button>
                        <button onClick={() => handleDelete(item.id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Purge</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
