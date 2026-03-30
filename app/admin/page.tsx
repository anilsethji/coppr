'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('bot');
  const [link, setLink] = useState('');
  
  // NEW FIELDS
  const [winRate, setWinRate] = useState<string>('');
  const [tradesCount, setTradesCount] = useState<string>('');
  const [avgGain, setAvgGain] = useState('');
  const [setupLink, setSetupLink] = useState('');
  const [statusBadge, setStatusBadge] = useState('');
  const [protRate, setProtRate] = useState('');
  const [blockedCount, setBlockedCount] = useState<string>('');
  const [useWith, setUseWith] = useState('');
  const [tags, setTags] = useState('');

  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email === 'anilava.babun@gmail.com') {
        fetchItems();
      }
    };
    checkAuth();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('content').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('content').insert({
      title,
      type,
      external_link: link,
      is_premium: true,
      win_rate: winRate ? parseInt(winRate) : null,
      trades_count: tradesCount ? parseInt(tradesCount) : null,
      avg_gain: avgGain,
      setup_link: setupLink,
      status_badge: statusBadge,
      prot_rate: protRate,
      blocked_count: blockedCount ? parseInt(blockedCount) : null,
      use_with: useWith,
      description: tags // Using description field for tags for now
    });

    if (!error) {
      setTitle('');
      setLink('');
      setWinRate('');
      setTradesCount('');
      setAvgGain('');
      setSetupLink('');
      setProtRate('');
      setBlockedCount('');
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('content').delete().eq('id', id);
    fetchItems();
  };

  if (user?.email !== 'anilava.babun@gmail.com') {
    return <div className="p-20 text-center text-red-500 font-bold">Unauthorized Access Restricted</div>;
  }

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
              <div className="grid grid-cols-2 gap-3">
                 <div className="col-span-2">
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
                 <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Asset Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-sm" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                 </div>
              </div>

              {/* DYNAMIC FIELDS BASED ON TYPE */}
              {type === 'bot' && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-white/[0.02] rounded-[12px] border border-white/5">
                   <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Win Rate %</label>
                      <input type="number" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white text-xs" value={winRate} onChange={(e) => setWinRate(e.target.value)} />
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Trades Logged</label>
                      <input type="number" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white text-xs" value={tradesCount} onChange={(e) => setTradesCount(e.target.value)} />
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Avg Gain %</label>
                      <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white text-xs" value={avgGain} onChange={(e) => setAvgGain(e.target.value)} />
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Badge</label>
                      <select className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-2 text-white text-xs" value={statusBadge} onChange={(e) => setStatusBadge(e.target.value)}>
                         <option value="">None</option>
                         <option value="NEW">NEW</option>
                         <option value="POPULAR">POPULAR</option>
                      </select>
                   </div>
                </div>
              )}

              {/* LINKS */}
              <div className="space-y-3">
                 <div>
                    <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Download Link (.mq5)</label>
                    <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-xs font-mono" value={link} onChange={(e) => setLink(e.target.value)} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Setup Guide URL</label>
                    <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-[6px] p-3 text-white focus:outline-none text-xs font-mono" value={setupLink} onChange={(e) => setSetupLink(e.target.value)} />
                 </div>
              </div>

              <button type="submit" className="w-full py-3 bg-[#00E676] text-[#0B0F1A] rounded-[6px] text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00E676]/10">Broadcast Asset</button>
            </form>
          </div>

          {/* LIVE UPDATE FORM */}
          <div className="bot-card border-[#F5A623]/10 bg-[#F5A623]/5 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4 text-[#F5A623] font-black tracking-tight underline underline-offset-8 decoration-[#F5A623]/20">Flash News Update</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as HTMLFormElement;
              const text = (target.elements.namedItem('update') as HTMLTextAreaElement).value;
              await supabase.from('updates').insert({ content: text });
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
                <div key={item.id} className="bot-card p-4 border-white/5 flex items-center justify-between group bg-[#131929] hover:border-[#00E676]/30 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-lg">
                        {item.type === 'bot' ? '🤖' : item.type === 'indicator' ? '📊' : '🎬'}
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <div className="flex gap-2 items-center">
                           <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.type}</p>
                           {item.win_rate && <span className="text-[9px] text-[#00E676] font-bold tracking-tighter">WR: {item.win_rate}%</span>}
                        </div>
                     </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500/50 hover:text-red-500 transition-all text-sm font-bold">DELETE</button>
                </div>
              ))}
              {items.length === 0 && <p className="text-sm text-gray-600 italic">No assets broadcasted yet...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
