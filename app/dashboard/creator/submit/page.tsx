'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Upload, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Image as LucideImage
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import CreatorStats from '@/components/dashboard/CreatorStats';

const steps = ['Creator Profile', 'Strategy Details', 'Security Scan', 'Pricing'];

export default function CreatorSubmitPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <CreatorStats />
      <React.Suspense fallback={
        <div className="p-20 flex flex-col items-center justify-center gap-4">
           <div className="w-10 h-10 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Initializing Secure Terminal...</p>
        </div>
      }>
        <SubmitFormContent />
      </React.Suspense>
    </div>
  );
}

function SubmitFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'CLEAN' | 'FAIL'>('IDLE');
  
  // ... rest of the existing page logic ...

  // Form State
  const [profile, setProfile] = useState({
    id: '',
    handle: '',
    displayName: '',
    bio: '',
    avatarType: 'EMOJI',
    avatarData: '🤖'
  });

  const [hasProfile, setHasProfile] = useState(false);

  // Fetch existing profile and handle URL params
  React.useEffect(() => {
    async function loadProfile() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (data) {
            setProfile({
                id: data.id,
                handle: data.handle,
                displayName: data.display_name,
                bio: data.bio || '',
                avatarType: data.avatar_type || 'EMOJI',
                avatarData: data.avatar_data || '🤖'
            });
            setHasProfile(true);
            setCurrentStep(1); // Jump to Strategy Details for returning creators
        }
    }
    loadProfile();

    // Handle Search Params for Origin restoration
    const originParam = searchParams.get('origin');
    if (originParam === 'OFFICIAL') {
        setStrategy(prev => ({ 
            ...prev, 
            origin: 'OFFICIAL', 
            mode: 'VPS_MANAGED', 
            is_managed: true 
        }));
    } else if (originParam === 'MARKETPLACE') {
        setStrategy(prev => ({ 
            ...prev, 
            origin: 'MARKETPLACE', 
            mode: 'CLIENT_SIDE' 
        }));
    }
  }, [searchParams]);

  const [strategy, setStrategy] = useState({
    name: '',
    type: 'MT5_EA',
    symbol: 'XAUUSD',
    timeframe: 'M5',
    description: '',
    price: 1999,
    video_url: '',
    setup_guide: '',
    origin: 'MARKETPLACE',
    tier: 'PAID',
    mode: 'CLIENT_SIDE',
    theme_color: '#FFD700',
    thumbnail_url: '',
    is_managed: true
  });

  const [file, setFile] = useState<File | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      // Trigger Mock Viral Scan
      setScanStatus('SCANNING');
      setTimeout(() => setScanStatus('CLEAN'), 3000);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Please login to submit.");
        return;
    }

    try {
        let creatorId = profile.id;
        let eaFileUrl = '';
        const mKey = self.crypto.randomUUID();
        setGeneratedKey(mKey);

        // 1. Upload EA File to Storage if Managed
        if (strategy.is_managed && file) {
            const fileName = `${user.id}/${Date.now()}-${file.name}`;
            const { data: uploadData, error: uError } = await supabase.storage
                .from('strategy-files')
                .upload(fileName, file);
            
            if (uError) throw new Error("File Vault Upload Failed: " + uError.message);
            eaFileUrl = uploadData.path;
        }

        // 2. Create or Update Profile
        const { data: prof, error: pError } = await supabase
            .from('creator_profiles')
            .upsert({
                ...(creatorId ? { id: creatorId } : {}),
                user_id: user.id,
                handle: profile.handle,
                display_name: profile.displayName,
                bio: profile.bio,
                avatar_type: profile.avatarType,
                avatar_data: profile.avatarData
            })
            .select()
            .single();

        if (pError) throw pError;
        creatorId = prof.id;

        // 3. Create Strategy with Managed Metadata
        const { error: sError } = await supabase
            .from('strategies')
            .insert({
                creator_id: creatorId,
                name: strategy.name,
                type: strategy.type,
                symbol: strategy.symbol,
                timeframe: strategy.timeframe,
                description: strategy.description,
                monthly_price_inr: strategy.tier === 'FREE' ? 0 : strategy.price,
                video_url: strategy.video_url,
                setup_guide: strategy.setup_guide,
                origin: strategy.origin,
                tier: strategy.tier,
                mode: strategy.mode,
                theme_color: strategy.theme_color,
                thumbnail_url: strategy.thumbnail_url,
                is_managed: strategy.is_managed,
                ea_file_url: eaFileUrl,
                execution_mode: strategy.is_managed ? 'COPPR_MANAGED' : 'SELF_HOSTED',
                master_webhook_key: mKey,
                status: 'PENDING'
            });

        if (sError) throw sError;

        setCurrentStep(4); // Success state
        setTimeout(() => router.push('/dashboard/marketplace'), 3000);

    } catch (err: any) {
        console.error(err);
        alert(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <CreatorStats />
      {/* Dynamic Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-3xl font-black text-white mb-2 leading-none">Creator Terminal</h1>
            <p className="text-[12px] text-white/30 font-bold uppercase tracking-widest">PUBLISH YOUR ALGORITHMS TO THE GLOBAL COPP NETWORK</p>
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center gap-3">
             {steps.map((s, i) => (
                 <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`w-2.5 h-1 rounded-full transition-all ${i <= currentStep ? 'bg-[#FFD700] w-6' : 'bg-white/10'}`} />
                 </div>
             ))}
        </div>
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
            {currentStep === 0 && (
                <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <section className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[40px]">
                        <h3 className="text-sm font-black text-[#FFD700] uppercase tracking-widest">Personal Branding</h3>
                        
                        <div className="flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center text-4xl bg-white/5 shadow-xl">
                                    {profile.avatarData}
                                </div>
                                <select 
                                    className="bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] font-black uppercase text-white/40 focus:text-white"
                                    onChange={(e) => setProfile({...profile, avatarData: e.target.value})}
                                >
                                    <option value="🤖">Droid</option>
                                    <option value="🦾">Cyborg</option>
                                    <option value="📈">Gains</option>
                                    <option value="👤">Human</option>
                                </select>
                            </div>

                            <div className="flex-1 space-y-6 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Public Handle</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">@</span>
                                        <input type="text" placeholder="unique_trader_id" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-sm text-white focus:border-[#FFD700]/30 outline-none" value={profile.handle} onChange={e => setProfile({...profile, handle: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Display Name</label>
                                    <input type="text" placeholder="Arun Trades" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-[#FFD700]/30 outline-none" value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </section>
                    <button onClick={() => setCurrentStep(1)} className="w-full md:w-auto px-10 py-4 rounded-2xl bg-[#FFD700] text-black font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#FFD700]/10 hover:scale-[1.02] transition-all">Continue to Strategy</button>
                </motion.div>
            )}

            {currentStep === 1 && (
                <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                        {/* 1. Origin & Tier Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-[#FFD700] tracking-widest">Product Origin</label>
                                <div className="flex gap-2">
                                    {(['OFFICIAL', 'MARKETPLACE'] as const).map(o => (
                                        <button 
                                            key={o} 
                                            onClick={() => setStrategy({...strategy, origin: o, mode: o === 'OFFICIAL' ? 'VPS_MANAGED' : 'CLIENT_SIDE'})}
                                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${strategy.origin === o ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-white/5 text-white/20 border-white/5'}`}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-[#00E676] tracking-widest">Access Tier</label>
                                <div className="flex gap-2">
                                    {(['FREE', 'PAID'] as const).map(t => (
                                        <button 
                                            key={t} 
                                            onClick={() => setStrategy({...strategy, tier: t})}
                                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${strategy.tier === t ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-white/5 text-white/20 border-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-[#FFD700] uppercase tracking-widest">Strategy DNA</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Strategy Name</label>
                                    <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" placeholder="Coppr Gold Reaper" value={strategy.name} onChange={e => setStrategy({...strategy, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Asset Class / Symbol</label>
                                    <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" placeholder="XAUUSD" value={strategy.symbol} onChange={e => setStrategy({...strategy, symbol: e.target.value})} />
                                </div>
                            </div>

                            {/* VISUAL BRANDING SECTION */}
                            <div className="pt-6 border-t border-white/5 space-y-6">
                                <h3 className="text-sm font-black text-[#FFD700] uppercase tracking-widest">Visual Branding</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Card Theme Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { name: 'Aero Gold', val: '#FFD700' },
                                                { name: 'Cyber Emerald', val: '#00E676' },
                                                { name: 'Cobalt Blue', val: '#00B0FF' },
                                                { name: 'Neon Purple', val: '#9C6EFA' },
                                                { name: 'Crimson Red', val: '#FF4757' }
                                            ].map(color => (
                                                <button 
                                                    key={color.val}
                                                    onClick={() => setStrategy({...strategy, theme_color: color.val})}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${strategy.theme_color === color.val ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                                                    style={{ backgroundColor: color.val }}
                                                    title={color.name}
                                                >
                                                    {strategy.theme_color === color.val && <CheckCircle2 className="w-4 h-4 text-black" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Screenshot URL</label>
                                        <div className="relative">
                                            <LucideImage className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input 
                                                type="text" 
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none" 
                                                placeholder="https://imgur.com/your-chart.png" 
                                                value={strategy.thumbnail_url} 
                                                onChange={e => setStrategy({...strategy, thumbnail_url: e.target.value})} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h3 className="text-sm font-black text-white/20 uppercase tracking-widest">Logic & Setup</h3>
                                <div className="text-[8px] font-black text-[#FFD700] uppercase tracking-widest bg-[#FFD700]/5 px-2 py-0.5 rounded">Markdown Enabled</div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Onboarding Manual</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none resize-none" 
                                        placeholder="Explain how to set up, recommended balance, and logic..." 
                                        value={strategy.setup_guide} 
                                        onChange={e => setStrategy({...strategy, setup_guide: e.target.value})} 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { id: 'MT5_EA', label: 'MetaTrader 5 EA', d: 'Automated bot. High performance execution.' },
                                        { id: 'PINE_SCRIPT_WEBHOOK', label: 'TradingView Indicator', d: 'Signal bridge via Webhooks. Manual copy.' },
                                    ].map(type => (
                                        <button 
                                            key={type.id}
                                            onClick={() => setStrategy({...strategy, type: type.id as any})}
                                            className={`p-4 rounded-2xl border transition-all text-left ${strategy.type === type.id ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/5 text-white/20'}`}
                                        >
                                            <div className="text-[11px] font-black uppercase mb-1">{type.label}</div>
                                            <div className="text-[9px] font-bold opacity-40 leading-relaxed uppercase tracking-wider">{type.d}</div>
                                        </button>
                                    ))}
                                </div>

                                {strategy.type === 'PINE_SCRIPT_WEBHOOK' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 border-t border-white/5 pt-4">
                                        <label className="text-[10px] font-black uppercase text-[#00B0FF] tracking-wider">Signal Alert Template (JSON)</label>
                                        <pre className="p-3 bg-black/40 rounded-xl text-[9px] font-mono text-white/20 mb-2">
{`{
  "action": "{{strategy.order.action}}",
  "symbol": "{{ticker}}",
  "price": "{{close}}"
}`}
                                        </pre>
                                        <p className="text-[9px] text-white/20 font-bold uppercase leading-relaxed">
                                            The bridge uses this to relay signals. You can customize the body as needed.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    <div className="flex gap-4">
                        <button onClick={() => setCurrentStep(0)} className="px-6 py-4 rounded-2xl border border-white/5 text-white/40 font-black uppercase tracking-widest text-[11px]"><ArrowLeft className="w-4 h-4" /></button>
                        <button onClick={() => setCurrentStep(2)} className="flex-1 py-4 rounded-2xl bg-[#FFD700] text-black font-black uppercase tracking-widest text-[11px]">Security Validation</button>
                    </div>
                </motion.div>
            )}

            {currentStep === 2 && (
                <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <section className="bg-white/[0.02] border border-white/5 p-12 rounded-[48px] text-center space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-[#FFD700]" />
                        </div>
                        
                        <div className="max-w-sm mx-auto p-6 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-3xl mb-8 text-left">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Bot className="w-5 h-5 text-[#FFD700]" />
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Coppr-Managed Execution</h4>
                                </div>
                                <button 
                                    onClick={() => setStrategy({...strategy, is_managed: !strategy.is_managed})}
                                    className={`w-12 h-6 rounded-full transition-all relative ${strategy.is_managed ? 'bg-[#FFD700]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${strategy.is_managed ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                            <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed">
                                Let Coppr host your EA on our proprietary high-speed fiber network. We handle the VPS 24/7. No manual setup required for you or your buyers.
                            </p>
                        </div>
                        {strategy.mode === 'VPS_MANAGED' ? (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-[#FFD700]">VPS-MANAGED PROTOCOL</h3>
                                <p className="text-[11px] text-white/25 uppercase font-bold tracking-widest leading-loose max-w-sm mx-auto">
                                    Official Coppr Managed products are hosted directly on our Hostinger VPS network. No user file upload required.
                                </p>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] text-white/40 font-bold uppercase">Our engineering team will initiate deployment within 24 hours.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white">Upload Executable</h3>
                                <p className="text-[11px] text-white/25 uppercase font-bold tracking-widest leading-loose max-w-sm mx-auto">
                                    All files undergo a deep bytecode virus scan via ClamAV protocol to protect the Coppr Trade Network.
                                </p>
                            </div>

                            <div className="relative group max-w-sm mx-auto">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <div className="py-6 px-10 border-2 border-dashed border-white/10 rounded-3xl group-hover:border-[#FFD700]/30 transition-all flex flex-col items-center gap-3">
                                    <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">{file ? file.name : 'Select .mq5 or .pine'}</span>
                                    <div className="text-[9px] px-3 py-1 bg-white/5 text-white/20 font-black tracking-widest rounded-full uppercase">MAX 50MB</div>
                                </div>
                            </div>
                            </>
                        )}

                        <AnimatePresence>
                            {scanStatus === 'SCANNING' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">De-compiling for heuristics...</span>
                                </motion.div>
                            )}
                            {scanStatus === 'CLEAN' && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-4">
                                     <div className="flex items-center gap-3 px-6 py-3 bg-[#00E676]/10 border border-[#00E676]/30 rounded-2xl">
                                         <ShieldCheck className="w-5 h-5 text-[#00E676]" />
                                         <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#00E676]">VERIFIED NO MALWARE</span>
                                     </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                    <div className="flex gap-4">
                        <button onClick={() => setCurrentStep(1)} className="px-6 py-4 rounded-2xl border border-white/5 text-white/40"><ArrowLeft className="w-4 h-4" /></button>
                        <button disabled={strategy.mode === 'CLIENT_SIDE' && scanStatus !== 'CLEAN'} onClick={() => setCurrentStep(3)} className="flex-1 py-4 rounded-2xl bg-[#FFD700] text-black font-black uppercase tracking-[0.1em] text-[11px] disabled:opacity-20 transition-opacity">Continue to Financials</button>
                    </div>
                </motion.div>
            )}

            {currentStep === 3 && (
                <motion.div key="p3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black text-[#FFD700] uppercase tracking-widest">Revenue Splitting</h3>
                            <div className="text-[10px] px-3 py-1 bg-white/5 text-white/40 font-black tracking-widest rounded-full uppercase italic">70% CREATOR · 30% COPPR</div>
                        </div>

                        <div className="space-y-8">
                             <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-wider">Set Monthly License Fee</label>
                                <span className="text-4xl font-black text-white tracking-tighter">₹{strategy.price}</span>
                             </div>
                             <input 
                                type="range" 
                                min="999" 
                                max="9999" 
                                step="100" 
                                value={strategy.price}
                                onChange={e => setStrategy({...strategy, price: parseInt(e.target.value)})}
                                className="w-full h-2 bg-white/5 rounded-full appearance-none accent-[#FFD700] cursor-pointer" 
                             />
                             <div className="flex justify-between text-[11px] font-bold text-white/10 uppercase">
                                <span>₹999</span>
                                <span>₹9999</span>
                             </div>

                             <div className="p-6 rounded-3xl bg-white/5 space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="text-white/30 lowercase uppercase">Potential Payout per Subscriber</span>
                                    <span className="text-[#00E676]">₹{(strategy.price * 0.7).toFixed(0)}</span>
                                </div>
                             </div>
                        </div>
                    </section>

                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex gap-4 items-center">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-loose">
                            All submissions undergo internal review for logic performance before going PUBLIC. Verification takes ~24 hours.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setCurrentStep(2)} className="px-6 py-4 rounded-2xl border border-white/5 text-white/40"><ArrowLeft className="w-4 h-4" /></button>
                        <button onClick={handleFinalSubmit} disabled={loading} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalize and Submit Strategy'}
                        </button>
                    </div>
                </motion.div>
            )}

            {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-12 h-12 text-[#00E676]" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-white leading-none">SUBMISSION RECEIVED</h2>
                        <p className="text-[13px] text-white/30 uppercase font-bold tracking-widest mb-8">Awaiting protocol clearance for public listing</p>
                        
                        {strategy.type === 'PINE_SCRIPT_WEBHOOK' && generatedKey && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-md mx-auto p-6 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-3xl space-y-4 text-left"
                            >
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">Master Signal Key (Secret)</h4>
                                    <code className="block bg-black/40 p-3 rounded-xl text-[12px] text-white font-mono break-all border border-white/5">{generatedKey}</code>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Webhook Bridge URL</h4>
                                    <code className="block bg-black/40 p-3 rounded-xl text-[10px] text-white/60 break-all border border-white/5">
                                        {`https://coppr.in/api/bridge/${generatedKey}`}
                                    </code>
                                </div>
                                <p className="text-[9px] text-[#FFD700]/40 font-bold uppercase tracking-widest text-center mt-4 italic">Copy these to your TradingView Alert now.</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

    </div>
  );
}
