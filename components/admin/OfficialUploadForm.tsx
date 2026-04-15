'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Upload, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  Zap,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  TrendingUp,
  Globe,
  Plus,
  Target
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const steps = ['Branding', 'Project Hub', 'Logic Vault', 'Broadcasting Hub'];

export default function OfficialUploadForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'CLEAN' | 'FAIL'>('IDLE');
  const [handshakeSynced, setHandshakeSynced] = useState(false);
  
  // Strategy State (Tailored for Official)
  const [strategy, setStrategy] = useState({
    name: '',
    type: 'MT5_EA', 
    symbol: 'XAUUSD',
    timeframe: 'H1',
    description: '',
    price: 1999,
    video_url: '',
    video_thumbnail_url: '',
    theme_color: '#FFD700',
    screenshot_urls: ['', ''],
    testimonials: [] as any[],
    win_rate: '',
    total_trades: '',
    avg_gain: '',
    max_drawdown: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleHandshake = () => {
    setLoading(true);
    const mKey = 'COPPR-OFF-' + self.crypto.randomUUID().split('-')[0].toUpperCase();
    setTimeout(() => {
        setGeneratedKey(mKey);
        setHandshakeSynced(true);
        setLoading(false);
    }, 1500);
  };

  const generateTestimonials = async () => {
    if (!strategy.description) {
      alert("Please enter a description first to guide the AI.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/generate-testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: strategy.description })
      });
      if (!res.ok) throw new Error("Narrative Engine Failed");
      const data = await res.json();
      setStrategy({ ...strategy, testimonials: data });
    } catch (err: any) {
      alert("AI Generation Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setScanStatus('SCANNING');
      setTimeout(() => setScanStatus('CLEAN'), 2000);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("CRITICAL: Administrative session lost. Please re-login.");
        setLoading(false);
        return;
    }

    try {
        let eaFileUrl = '';
        
        // 1. Vault Binary Upload
        if (strategy.type === 'MT5_EA' && file) {
            const fileName = `official/${Date.now()}-${file.name}`;
            const { data: uploadData, error: uError } = await supabase.storage
                .from('strategy-files')
                .upload(fileName, file);
            
            if (uError) throw new Error("VAULT_FAILURE: " + uError.message);
            eaFileUrl = uploadData.path;
        }

        // 2. Deploy Official Strategy
        const { data: sData, error: sError } = await supabase
            .from('strategies')
            .insert({
                creator_id: '7f45ad71-e9c8-4c01-919f-8337af2d2d07', // Using dedicated Coppr Team ID
                name: strategy.name,
                type: strategy.type,
                symbol: strategy.symbol,
                timeframe: strategy.timeframe,
                description: strategy.description,
                monthly_price_inr: strategy.price,
                video_url: strategy.video_url,
                origin: 'OFFICIAL',
                is_official: true,
                tier: strategy.price > 0 ? 'PAID' : 'FREE',
                mode: 'VPS_MANAGED',
                thumbnail_url: strategy.video_thumbnail_url || strategy.screenshot_urls[0],
                screenshot_urls: strategy.screenshot_urls.filter(u => u),
                testimonials: strategy.testimonials,
                how_it_works: [strategy.description, `High-fidelity mirrored execution via Coppr Node`],
                is_managed: true,
                ea_file_url: eaFileUrl,
                execution_mode: 'COPPR_MANAGED',
                master_signal_key: generatedKey || 'COPPR-OFF-' + self.crypto.randomUUID().split('-')[0].toUpperCase(),
                status: 'ACTIVE', // Official bots bypass pending
                win_rate: parseFloat(strategy.win_rate) || 0,
                total_trades: parseInt(strategy.total_trades) || 0,
                avg_gain: parseFloat(strategy.avg_gain) || 0,
                max_drawdown: parseFloat(strategy.max_drawdown) || 0
            })
            .select('id')
            .single();

        if (sError) throw new Error(`DEPLOYMENT_REJECTION: ${sError.message}`);

        if (sData) {
            setCurrentStep(4);
        }

    } catch (err: any) {
        console.error("ADMIN_DEPLOYMENT_ERROR:", err);
        alert(`BROADCAST FAILED: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  const isStep1Complete = strategy.name.trim() !== '' && strategy.symbol.trim() !== '' && (strategy.type !== 'MT5_EA' || file !== null);
  const isStep2Complete = handshakeSynced && (strategy.type !== 'MT5_EA' || scanStatus === 'CLEAN');
  const isStep3Complete = strategy.screenshot_urls[0].trim() !== '' && strategy.win_rate !== '';

  return (
    <div className="space-y-12 pb-24 font-sans max-w-4xl mx-auto">
      {/* 1. PROGRESS HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Official Command Line</span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
              Deploy <span className="text-[#00E676]">Official Release</span>
            </h1>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
             {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-2">
                    <div className={`w-1 h-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-[#00E676]' : 'bg-white/10'}`} />
                    <span className={`text-[8px] font-black uppercase tracking-widest ${i === currentStep ? 'text-white' : 'text-white/20'}`}>{s}</span>
                  </div>
             ))}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
            {/* STEP 1: PROJECT HUB */}
            {currentStep === 0 && (
                <motion.div key="p1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => setStrategy({...strategy, type: 'MT5_EA'})} className={`p-6 rounded-3xl border transition-all flex items-center gap-4 group ${strategy.type === 'MT5_EA' ? 'bg-[#00E676] text-black border-[#00E676] shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'}`}>
                            <Bot className="w-8 h-8" />
                            <div className="text-left">
                                <h4 className="text-[11px] font-black uppercase tracking-widest leading-none">Algorithmic EA</h4>
                                <p className="text-[8px] font-bold uppercase mt-1 opacity-60">MT5 Managed Node</p>
                            </div>
                        </button>
                        <button onClick={() => setStrategy({...strategy, type: 'PINE_SCRIPT_WEBHOOK'})} className={`p-6 rounded-3xl border transition-all flex items-center gap-4 group ${strategy.type === 'PINE_SCRIPT_WEBHOOK' ? 'bg-[#00E676] text-black border-[#00E676] shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'}`}>
                            <LayoutGrid className="w-8 h-8" />
                            <div className="text-left">
                                <h4 className="text-[11px] font-black uppercase tracking-widest leading-none">Market Indicator</h4>
                                <p className="text-[8px] font-bold uppercase mt-1 opacity-60">Pine Script Bridge</p>
                            </div>
                        </button>
                    </div>

                    <div className="bg-[#131929]/40 border border-white/5 p-8 rounded-[40px] space-y-10 backdrop-blur-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-1">Strategy Name</label>
                                <input type="text" placeholder="e.g. Coppr Gold Alpha" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none font-bold italic" value={strategy.name} onChange={e => setStrategy({...strategy, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-1">Symbol</label>
                                <input type="text" placeholder="XAUUSD" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none font-bold text-center italic" value={strategy.symbol} onChange={e => setStrategy({...strategy, symbol: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-1">Timeframe</label>
                                <input type="text" placeholder="H1" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none font-bold text-center italic" value={strategy.timeframe} onChange={e => setStrategy({...strategy, timeframe: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-1">Official Protocol Description</label>
                            <textarea rows={4} placeholder="Describe the official logic and institutional edge..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs text-white outline-none font-bold italic leading-relaxed" value={strategy.description} onChange={e => setStrategy({...strategy, description: e.target.value})} />
                        </div>

                        {strategy.type === 'MT5_EA' && (
                            <div className="relative group">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <div className={`bg-white/5 border-2 border-dashed rounded-[32px] py-12 flex flex-col items-center gap-3 transition-all ${scanStatus === 'CLEAN' ? 'border-[#00E676]/40 text-[#00E676]' : 'border-white/10 hover:border-[#00E676]/30 text-white/20'}`}>
                                    <Upload className="w-8 h-8" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{file ? file.name : 'Upload Official .ex5 Binary'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setCurrentStep(1)} disabled={!isStep1Complete} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic ${isStep1Complete ? 'bg-[#00E676] text-black shadow-lg' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/10'}`}>
                        Continue to Logic Vault →
                    </button>
                </motion.div>
            )}

            {/* STEP 2: LOGIC VAULT */}
            {currentStep === 1 && (
                <motion.div key="p2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                    <div className="bg-[#131929]/40 border border-white/5 p-12 rounded-[48px] text-center space-y-8">
                        <div className="w-20 h-20 mx-auto rounded-full bg-[#00E676]/10 flex items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-[#00E676]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Secure Synchronization</h3>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Initialize the institutional mirroring handshake.</p>
                        </div>

                        <button onClick={handleHandshake} disabled={handshakeSynced || loading} className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest italic transition-all shadow-xl ${handshakeSynced ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40' : 'bg-[#FFD700] text-black hover:scale-[1.02]'}`}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : handshakeSynced ? 'Handshake established' : 'Initialize Handshake'}
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setCurrentStep(0)} className="px-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all"><ArrowLeft className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentStep(2)} disabled={!isStep2Complete} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic ${isStep2Complete ? 'bg-[#00E676] text-black shadow-lg' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/10'}`}>Finalize Assets & Metrics →</button>
                    </div>
                </motion.div>
            )}

            {/* STEP 3: ASSETS & METRICS */}
            {currentStep === 2 && (
                <motion.div key="p3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-[#131929]/40 border border-white/5 p-10 rounded-[48px] space-y-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Win Rate (%)', key: 'win_rate', placeholder: 'e.g. 78' },
                                { label: 'Total Trades', key: 'total_trades', placeholder: 'e.g. 142' },
                                { label: 'Avg Gain (%)', key: 'avg_gain', placeholder: 'e.g. 2.1' },
                                { label: 'Max Drawdown (%)', key: 'max_drawdown', placeholder: 'e.g. 6.4' }
                            ].map((stat) => (
                                <div key={stat.key} className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">{stat.label}</label>
                                    <input type="text" placeholder={stat.placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none font-bold italic" value={(strategy as any)[stat.key]} onChange={e => setStrategy({...strategy, [stat.key]: e.target.value})} />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-1">Asset Proofs (High-Resolution URLs)</label>
                                <div className="text-[8px] font-black text-[#00E676] uppercase px-2 py-0.5 border border-[#00E676]/20 rounded-full">Institutional Mandatory</div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Screenshot 1 (Performance Proof)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] text-white outline-none italic" value={strategy.screenshot_urls[0]} onChange={e => {
                                    const news = [...strategy.screenshot_urls];
                                    news[0] = e.target.value;
                                    setStrategy({...strategy, screenshot_urls: news});
                                }} />
                                <input type="text" placeholder="Screenshot 2 (Technical Proof)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] text-white outline-none italic" value={strategy.screenshot_urls[1]} onChange={e => {
                                    const news = [...strategy.screenshot_urls];
                                    news[1] = e.target.value;
                                    setStrategy({...strategy, screenshot_urls: news});
                                }} />
                                <input type="text" placeholder="Video Thumbnail URL" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] text-white outline-none italic" value={strategy.video_thumbnail_url} onChange={e => setStrategy({...strategy, video_thumbnail_url: e.target.value})} />
                                <input type="text" placeholder="Tutorial/Promo Video URL" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] text-white outline-none italic" value={strategy.video_url} onChange={e => setStrategy({...strategy, video_url: e.target.value})} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-1">Community Trust Narratives</label>
                                <button 
                                    onClick={generateTestimonials}
                                    disabled={loading}
                                    className="flex items-center gap-2 text-[8px] font-black text-[#FFD700] uppercase hover:text-white transition-colors"
                                >
                                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    Generate 20 narratives (Hinglish)
                                </button>
                            </div>
                            
                            {strategy.testimonials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {strategy.testimonials.map((t, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-black text-white italic">{t.n}</span>
                                                <span className="text-[7px] text-white/20 font-bold">{t.l}</span>
                                            </div>
                                            <p className="text-[9px] text-white/40 italic leading-snug line-clamp-2">"{t.t}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                                    <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest italic">No narratives generated yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setCurrentStep(1)} className="px-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all"><ArrowLeft className="w-5 h-5" /></button>
                        <button onClick={handleFinalSubmit} disabled={!isStep3Complete || loading} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic flex items-center justify-center gap-3 ${isStep3Complete ? 'bg-[#00E676] text-black shadow-lg hover:scale-[1.01]' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/10'}`}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Deploy to Official Command</>}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 gap-8 text-center bg-[#00E676]/5 border border-[#00E676]/20 rounded-[64px] backdrop-blur-3xl">
                    <div className="w-24 h-24 rounded-3xl bg-[#00E676]/20 flex items-center justify-center text-[#00E676] shadow-2xl">
                         <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Broadcast Success</h2>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">The official strategy is now live on the global Dashboard.</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white/10 tracking-widest italic transition-all">Back to Console</button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
