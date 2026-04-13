'use client';
// Refine Sync: Forced re-compilation to resolve stale module resolution after route rename.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Bot, 
  Zap, 
  ShieldCheck, 
  MessageSquare,
  Globe,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EditStrategyPage() {
  const { strategyId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthly_price_inr: 0,
    video_url: '',
    screenshot_urls: ['', '', ''],
    origin: 'MARKETPLACE',
    type: 'MT5_EA'
  });

  useEffect(() => {
    async function fetchStrategy() {
      try {
        const resp = await fetch(`/api/marketplace/${strategyId}/landing`);
        const json = await resp.json();
        if (json.strategy) {
          setFormData({
            name: json.strategy.name || '',
            description: json.strategy.description || '',
            monthly_price_inr: json.strategy.monthly_price_inr || 0,
            video_url: json.strategy.video_url || '',
            screenshot_urls: json.strategy.screenshot_urls || ['', '', ''],
            origin: json.strategy.origin || 'MARKETPLACE',
            type: json.strategy.type || 'MT5_EA'
          });
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStrategy();
  }, [strategyId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const resp = await fetch(`/api/creator/strategy/${strategyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await resp.json();
      if (json.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(json.error || 'Update failed');
      }
    } catch (err) {
      alert('Network error during update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Asset Metadata...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A1A3A] text-white selection:bg-[#FFD700] selection:text-black font-sans pb-32">
      {/* 1. HEADER */}
      <nav className="sticky top-0 z-[100] bg-[#0A1A3A]/95 backdrop-blur-3xl border-b border-white/5 px-6 py-4">
         <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Link href="/dashboard/creator" className="flex items-center gap-3 group">
               <div className="p-1 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                  <ArrowLeft className="w-4 h-4 text-white/40" />
               </div>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Creator Terminal</span>
            </Link>

            <div className="flex items-center gap-4">
                {success && (
                    <motion.span 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-black text-[#00E676] uppercase tracking-widest italic"
                    >
                        Protocol Updated ✓
                    </motion.span>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 italic flex items-center gap-2"
                >
                   {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                   Update Deployment
                </button>
            </div>
         </div>
      </nav>

      <main className="max-w-[800px] mx-auto px-6 py-12 space-y-12">
         
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Edit Mode Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
               Refine <span className="text-[#FFD700]">Strategy</span>
            </h1>
            <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.3em]">Updating logic node for {formData.name}</p>
         </div>

         <form onSubmit={handleSave} className="space-y-10">
            {/* SECTION 1: CORE IDENTITY */}
            <div className="p-8 md:p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <Bot className="w-5 h-5 text-[#FFD700]" />
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Core Identity</h2>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Strategy Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#FFD700]/50 transition-all uppercase italic"
                            placeholder="e.g. GOLD CRUSHER V5"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Public Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#FFD700]/50 transition-all uppercase italic text-[12px] leading-relaxed"
                            placeholder="Explain the strategy logic and performance targets..."
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: MONETIZATION & MEDIA */}
            <div className="p-8 md:p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <Globe className="w-5 h-5 text-[#00E676]" />
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Marketplace Intel</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Monthly Price (INR)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black">₹</span>
                            <input 
                                type="number" 
                                value={formData.monthly_price_inr}
                                onChange={e => setFormData({...formData, monthly_price_inr: parseInt(e.target.value) || 0})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white font-black outline-none focus:border-[#00E676]/50 transition-all italic text-xl"
                            />
                        </div>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Set to 0 for FREE/OPEN nodes</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Guide Video (YouTube URL)</label>
                        <input 
                            type="text" 
                            value={formData.video_url}
                            onChange={e => setFormData({...formData, video_url: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#FFD700]/50 transition-all font-mono text-[11px]"
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Strategy Screenshots (URLs)</label>
                        <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">Update visual evidence in the gallery</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {['Chart Heuristics', 'Profitable Hits', 'Equity Curve'].map((label, idx) => (
                            <div key={idx} className="relative group/field font-sans">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/10 uppercase group-focus-within/field:text-[#FFD700] transition-colors">{label}</span>
                                <input 
                                    type="text" 
                                    placeholder="https://image-host.com/..." 
                                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-2xl py-4 pl-36 pr-6 text-[10px] text-white outline-none font-mono italic" 
                                    value={formData.screenshot_urls[idx] || ''} 
                                    onChange={e => {
                                        const news = [...formData.screenshot_urls];
                                        news[idx] = e.target.value;
                                        setFormData({...formData, screenshot_urls: news});
                                    }} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center gap-6">
                 <button 
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-12 py-5 bg-[#FFD700] text-black font-black uppercase text-[12px] rounded-[24px] shadow-2xl shadow-[#FFD700]/10 hover:scale-[1.02] transition-all italic tracking-tighter flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   Save Changes
                </button>
                <Link href="/dashboard/creator" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">
                    Discard Transitions
                </Link>
            </div>
         </form>

         {/* COMPLIANCE ALERT */}
         <div className="p-8 rounded-[32px] border border-red-500/10 bg-red-500/[0.02] flex gap-6 items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div className="space-y-2">
                <h4 className="text-[12px] font-black text-red-500 uppercase italic">Immutable Logic Nodes</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed italic">
                   Note: Updating basic metadata won't affect active signal keys. To change core entry/exit logic, you must deploy a new protocol node to maintain integrity for existing subscribers.
                </p>
            </div>
         </div>

      </main>
    </div>
  );
}
