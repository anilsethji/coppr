'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Rocket, 
  Star, 
  Clock, 
  LayoutGrid, 
  Zap, 
  FileCode, 
  Bot, 
  ArrowRight,
  MessageSquare,
  Activity,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { addAsset, deleteAsset, updateAsset, addUpdate, deleteUpdate, updateStrategy, deleteStrategy } from './actions';
import OfficialUploadForm from '@/components/admin/OfficialUploadForm';
import SpotlightManager from '@/components/admin/SpotlightManager';

export default function UnifiedAdminConsole() {
  const [activeTab, setActiveTab] = useState<'official' | 'spotlight' | 'clearance' | 'legacy'>('official');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // LEGACY/INLINE EDIT STATE
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLink, setEditLink] = useState('');
  
  // LEGACY FORM STATE
  const [title, setTitle] = useState('');
  const [type, setType] = useState('bot');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
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

  if (loading) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-[#00E676]/20 border-t-[#00E676] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Authorizing Admin Node...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      
      {/* 1. INSTITUTIONAL HEADER */}
      <div className="flex flex-col items-center text-center gap-4 mb-4">
        <div className="space-y-3">
           <div className="flex items-center justify-center gap-3">
             <ShieldCheck className="w-5 h-5 text-[#00E676]" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Consolidated Command Console</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Unified <span className="text-[#00E676]">Terminal</span></h1>
           <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest mt-1 italic">Administrative Authority Verified • Operator: {user?.email}</p>
        </div>
      </div>

      {/* 2. COMMAND HUB TABS */}
      <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 w-fit mx-auto shadow-2xl backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('official')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'official' ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <Rocket className="w-4 h-4" /> Official Deployment
        </button>
        <button 
          onClick={() => setActiveTab('spotlight')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'spotlight' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <Star className="w-4 h-4" /> Spotlight Manager
        </button>
        <button 
          onClick={() => setActiveTab('clearance')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'clearance' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <Zap className="w-4 h-4" /> Clearance Hub
          {pendingCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-black px-1.5 rounded-full">{pendingCount}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('legacy')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'legacy' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
        >
          <LayoutGrid className="w-4 h-4" /> Legacy Assets
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT SWITCHER */}
      <AnimatePresence mode="wait">
        {activeTab === 'official' && (
          <motion.div key="official" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <OfficialUploadForm />
          </motion.div>
        )}

        {activeTab === 'spotlight' && (
          <motion.div key="spotlight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SpotlightManager />
          </motion.div>
        )}

        {activeTab === 'clearance' && (
          <motion.div key="clearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div className="p-12 rounded-[64px] bg-gradient-to-br from-[#131929] to-black border border-white/10 shadow-2xl space-y-12 max-w-5xl mx-auto text-center">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Community Clearance Hub</h2>
                   <p className="text-[11px] font-black text-white/20 uppercase tracking-widest">Verify and deploy third-party alpha to the network.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/dashboard/admin/clearance/indicators" className="group p-10 rounded-[48px] bg-white/5 border border-white/5 hover:border-orange-500/40 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10">
                             <FileCode className="w-8 h-8 text-orange-500" />
                          </div>
                          <span className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-orange-500 transition-colors">Indicator Bots</span>
                       </div>
                       <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                    </Link>
                    <Link href="/dashboard/admin/clearance/ea" className="group p-10 rounded-[48px] bg-white/5 border border-white/5 hover:border-[#00E676]/40 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#00E676]/10">
                             <Bot className="w-8 h-8 text-[#00E676]" />
                          </div>
                          <span className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-[#00E676] transition-colors">EA Bots</span>
                       </div>
                       <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                    </Link>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'legacy' && (
          <motion.div key="legacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
               {/* Forms */}
               <div className="lg:col-span-1 space-y-10">
                  <div className="p-8 rounded-[40px] bg-[#131929] border border-white/10 space-y-8">
                     <h2 className="text-xl font-black text-[#00E676] uppercase italic tracking-tighter">Deploy New Asset</h2>
                     <form onSubmit={handleAdd} className="space-y-6">
                        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none">
                           <option value="bot">Official EA Bot</option>
                           <option value="indicator">Market Indicator</option>
                           <option value="video">Tutorial Module</option>
                        </select>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Asset Name" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none" required />
                        <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Asset URL" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none font-mono" />
                        <button type="submit" className="w-full py-5 bg-[#00E676] text-black font-black uppercase text-xs rounded-3xl tracking-[0.2em] shadow-lg shadow-[#00E676]/20">Broadcast Node</button>
                     </form>
                  </div>
                  <div className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/10 space-y-6">
                     <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-red-500" /><h3 className="text-xl font-black text-red-500 uppercase italic tracking-tighter">Flash Feed</h3></div>
                     <form onSubmit={async (e) => {
                        e.preventDefault();
                        const text = (e.currentTarget.elements.namedItem('news') as HTMLTextAreaElement).value;
                        const res = await addUpdate(text);
                        if (res.success) { e.currentTarget.reset(); window.location.reload(); }
                     }} className="space-y-4">
                        <textarea name="news" placeholder="Broadcasting network intel..." className="w-full bg-black/40 border border-white/10 rounded-3xl p-5 text-white text-sm h-32 outline-none italic" required />
                        <button type="submit" className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl tracking-[0.2em] hover:bg-white/10 transition-all italic">Kill Signal →</button>
                     </form>
                  </div>
               </div>
               {/* Listings */}
               <div className="lg:col-span-2 space-y-12">
                  <h3 className="text-xl font-black text-white/40 uppercase italic tracking-widest pl-4 border-l-2 border-[#00B0FF]">Proprietary Terminal Assets</h3>
                  <div className="grid grid-cols-1 gap-4">
                     {items.map((item) => (
                        <div key={item.id} className="p-6 rounded-[34px] bg-[#131929] border border-white/5 flex items-center justify-between group hover:border-[#00B0FF]/25 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/5 truncate">{item.type[0].toUpperCase()}</div>
                              <div><h4 className="font-black text-white italic text-lg">{item.title}</h4><p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">{item.type}</p></div>
                           </div>
                           <button onClick={() => handleDelete(item.id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Purge</button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
