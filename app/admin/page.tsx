'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { addAsset, deleteAsset, updateAsset, addUpdate, deleteUpdate } from './actions';

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // INLINE EDIT STATE
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLink, setEditLink] = useState('');
  
  // FORM STATE
  const [title, setTitle] = useState('');
  const [type, setType] = useState('bot');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  
  // BOT SPECIFIC STATS
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

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || authUser.email !== 'anilava.babun@gmail.com') { 
        router.push('/dashboard');
        return;
      }
      setUser(authUser);
      fetchContent();
    };
    checkAdmin();
  }, [supabase, router, fetchContent]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pack bot stats directly into description JSON string to avoid schema migrations
    const payloadDesc = type === 'bot' 
      ? JSON.stringify({ desc, winRate, trades, avgGain }) 
      : desc;

    const res = await addAsset({
      title,
      type,
      description: payloadDesc,
      external_link: link,
      is_premium: true
    });

    if (res.success) {
       setTitle('');
       setDesc('');
       setLink('');
       setWinRate('73%');
       setTrades('41');
       setAvgGain('+2.1%');
       fetchContent();
    } else {
       alert("Failed to deploy asset: " + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAsset(id);
    if (!res.success) alert("Failed to delete: " + res.error);
    fetchContent();
  };

  const handleEditSave = async (id: string) => {
    const res = await updateAsset(id, { title: editTitle, external_link: editLink });
    if (!res.success) alert("Failed to update: " + res.error);
    else {
      setEditId(null);
      fetchContent();
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 italic">Authenticating Admin...</div>;

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tighter">Coppr Admin Console</h1>
        <div className="text-sm text-gray-400 font-medium">System Operator: <span className="text-[#00E676] font-black underline underline-offset-4 decoration-[#00E676]/30">{user?.email}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: FORMS */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* ASSET FORM */}
          <div className="bot-card border-white/5 bg-[#131929]/80 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 text-[#00E676] font-black tracking-tight underline underline-offset-8 decoration-[#00E676]/20">Deploy New Asset</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Protocol Type</label>
                <select 
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-sm font-medium"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="bot">Algorithmic Bot</option>
                  <option value="indicator">Market Indicator</option>
                  <option value="video">Tutorial Module</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Asset Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-sm placeholder-gray-700" 
                  placeholder="e.g., RegressionX v2.2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Global Link (MT5/Storage)</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-sm placeholder-gray-700 font-mono" 
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {type === 'bot' && (
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mt-4">
                   <div>
                     <label className="block text-[10px] font-black text-[#00E676] uppercase mb-1">Win Rate</label>
                     <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white focus:outline-none text-xs" placeholder="e.g. 73%" value={winRate} onChange={(e)=>setWinRate(e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-white uppercase mb-1">Trades Logged</label>
                     <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white focus:outline-none text-xs" placeholder="e.g. 41" value={trades} onChange={(e)=>setTrades(e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-[#00E676] uppercase mb-1">Avg Gain</label>
                     <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white focus:outline-none text-xs" placeholder="e.g. +2.1%" value={avgGain} onChange={(e)=>setAvgGain(e.target.value)} />
                   </div>
                </div>
              )}

              <button type="submit" className="w-full py-3 bg-[#00E676] text-[#0B0F1A] rounded-[6px] text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00E676]/10 mt-2">Broadcast Asset</button>
            </form>
          </div>

          {/* LIVE UPDATE FORM */}
          <div className="bot-card border-[#F5A623]/10 bg-[#F5A623]/5 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4 text-[#F5A623] font-black tracking-tight underline underline-offset-8 decoration-[#F5A623]/20">Flash News Update</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as HTMLFormElement;
              const text = (target.elements.namedItem('update') as HTMLTextAreaElement).value;
              const res = await addUpdate(text);
              if (!res.success) {
                 alert("Failed to broadcast news: " + res.error);
                 return;
              }
              target.reset();
              window.location.reload(); 
            }} className="space-y-4">
              <textarea 
                name="update"
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-sm h-24 placeholder-gray-700 italic" 
                placeholder="What's the signal today?"
                required
              />
              <button type="submit" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-[6px] text-xs font-black uppercase tracking-widest transition-all border border-white/10">Broadcast Signal →</button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: LISTINGS */}
        <div className="lg:col-span-2 space-y-12">
          
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white font-black tracking-tight underline underline-offset-8 decoration-white/10">
              Active Terminal Assets
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {items.map((item) => (
                <div key={item.id} className="bot-card p-4 border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between group bg-[#131929] hover:border-[#00E676]/30 transition-all gap-4">
                  
                  {editId === item.id ? (
                    <div className="flex-1 w-full space-y-2">
                       <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-[#0A0F1E] border border-white/10 p-2 text-sm text-white rounded focus:outline-none" placeholder="Title" />
                       <input type="text" value={editLink} onChange={e => setEditLink(e.target.value)} className="w-full bg-[#0A0F1E] border border-white/10 p-2 text-xs text-gray-400 font-mono rounded focus:outline-none" placeholder="External Link" />
                       <div className="flex gap-2 mt-2">
                         <button onClick={() => handleEditSave(item.id)} className="text-[10px] font-black text-[#00E676] px-3 py-1 border border-[#00E676]/20 rounded transition-all hover:bg-[#00E676]/10 uppercase tracking-widest">Save</button>
                         <button onClick={() => setEditId(null)} className="text-[10px] font-black text-gray-500 px-3 py-1 border border-white/10 rounded transition-all hover:bg-white/5 uppercase tracking-widest">Cancel</button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 flex-1 overflow-hidden">
                         <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-lg shrink-0">
                            {item.type === 'bot' ? '🤖' : item.type === 'indicator' ? '📊' : '🎬'}
                         </div>
                         <div className="min-w-0">
                            <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
                            <p className="text-[10px] text-gray-500 truncate">{item.external_link || 'No link added'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => { setEditId(item.id); setEditTitle(item.title); setEditLink(item.external_link || ''); }}
                          className="text-[10px] font-black text-[#00B0FF]/70 hover:text-[#00B0FF] uppercase tracking-widest px-3 py-1 border border-[#00B0FF]/10 rounded-badge hover:bg-[#00B0FF]/5 transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest px-3 py-1 border border-red-500/10 rounded-badge hover:bg-red-500/5 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {items.length === 0 && <div className="py-10 text-center text-gray-700 italic border border-dashed border-white/5 rounded-card">No assets published yet.</div>}
            </div>
          </div>

          <LiveUpdatesManager supabase={supabase} />
        </div>

      </div>
    </div>
  );
}

function LiveUpdatesManager({ supabase }: { supabase: any }) {
  const [updates, setUpdates] = useState<any[]>([]);

  const fetchUpdates = useCallback(async () => {
    const { data } = await supabase.from('updates').select('*').order('created_at', { ascending: false });
    setUpdates(data || []);
  }, [supabase]);

  useEffect(() => { fetchUpdates(); }, [fetchUpdates]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold-badge">
        <span className="w-2 h-2 bg-gold-badge rounded-full animate-ping"></span>
        Broadcast Mission Logs
      </h2>
      <div className="space-y-3">
        {updates.map((up: any) => (
          <div key={up.id} className="card p-4 border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
            <div className="flex-1 pr-6">
              <p className="text-xs text-gray-400 line-clamp-2 italic leading-relaxed">"{up.content}"</p>
              <p className="text-[9px] text-gray-600 mt-1 font-bold">{new Date(up.created_at).toLocaleString()}</p>
            </div>
            <button 
              onClick={async () => {
                const res = await deleteUpdate(up.id);
                if (res.success) fetchUpdates();
                else alert("Failed to kill feed: " + res.error);
              }}
              className="text-[10px] font-black text-red-500/30 hover:text-red-500 uppercase tracking-widest px-3 py-1 border border-red-500/5 hover:border-red-500/20 rounded-badge transition-all"
            >
              Kill Feed
            </button>
          </div>
        ))}
        {updates.length === 0 && <p className="text-xs text-gray-700 italic px-4 py-8 border border-dashed border-white/5 rounded-card text-center">No broadcast history found.</p>}
      </div>
    </div>
  );
}
