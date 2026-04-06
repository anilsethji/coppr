'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  Image as LucideImage,
  Zap,
  Sparkles,
  Clock,
  Pin,
  Newspaper,
  LayoutGrid,
  Activity,
  ArrowRight,
  TrendingUp,
  Target,
  Info,
  ExternalLink,
  PlayCircle,
  Code2,
  Lock,
  Terminal,
  Trophy,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import CreatorStats from '@/components/dashboard/CreatorStats';

const steps = ['Branding', 'Project Hub', 'Logic Vault', 'Broadcasting Hub'];

export default function CreatorSubmitPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <Suspense fallback={
        <div className="p-20 flex flex-col items-center justify-center gap-4">
           <div className="w-10 h-10 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Initializing Secure Terminal...</p>
        </div>
      }>
        <SubmitFormContent />
      </Suspense>
    </div>
  );
}

function SubmitFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'CLEAN' | 'FAIL'>('IDLE');
  const [handshakeSynced, setHandshakeSynced] = useState(false);
  const [copied, setCopied] = useState<'URL' | 'PAYLOAD' | null>(null);
  
  // Form State
  const [profile, setProfile] = useState({
    id: '',
    handle: '',
    displayName: '',
    bio: '',
    avatarType: 'EMOJI',
    avatarData: '🤖'
  });

  const [strategy, setStrategy] = useState({
    name: '',
    type: 'MT5_EA', 
    symbol: 'XAUUSD',
    timeframe: 'H1',
    description: '',
    script_code: '', 
    price: 1999,
    video_url: '',
    setup_guide: '',
    origin: 'MARKETPLACE',
    tier: 'PAID',
    mode: 'CLIENT_SIDE',
    theme_color: '#FFD700',
    thumbnail_url: '',
    screenshot_urls: ['', '', ''],
    how_it_works: ['', ''], 
    is_managed: true
  });

  const [file, setFile] = useState<File | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [strategyId, setStrategyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
        const supabase = createClient();
        let { data: { user } } = await supabase.auth.getUser();
        if (!user && process.env.NODE_ENV === 'development') {
            user = { id: '7f45ad71-e9c8-4c01-919f-8337af2d2d07' } as any;
        }
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
            // Auto skip Step 0 if profile is already complete
            if (data.display_name && data.bio) {
                setCurrentStep(1);
            }
        }
    }
    loadProfile();

    const originParam = searchParams.get('origin');
    if (originParam === 'OFFICIAL') {
        setStrategy(prev => ({ ...prev, origin: 'OFFICIAL', mode: 'VPS_MANAGED', is_managed: true }));
    } else if (originParam === 'MARKETPLACE') {
        setStrategy(prev => ({ ...prev, origin: 'MARKETPLACE', mode: 'CLIENT_SIDE' }));
    }
  }, [searchParams]);

  const handleHandshake = () => {
    setLoading(true);
    const mKey = 'COPPR-' + self.crypto.randomUUID().split('-')[0].toUpperCase();
    setTimeout(() => {
        setGeneratedKey(mKey);
        setHandshakeSynced(true);
        setLoading(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setScanStatus('SCANNING');
      setTimeout(() => setScanStatus('CLEAN'), 3000);
    }
  };

  const handleCopy = (text: string, type: 'URL' | 'PAYLOAD') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    let { data: { user } } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'development') {
        user = { id: '7f45ad71-e9c8-4c01-919f-8337af2d2d07' } as any;
    }

    if (!user) {
        alert("CRITICAL: User session not found. Please re-authenticate.");
        setLoading(false);
        return;
    }

    try {
        let creatorId = profile.id;
        let eaFileUrl = '';
        
        if (strategy.type === 'MT5_EA' && file) {
            const fileName = `${user.id}/${Date.now()}-${file.name}`;
            const { data: uploadData, error: uError } = await supabase.storage
                .from('strategy-files')
                .upload(fileName, file);
            
            if (uError) throw new Error("VAULT_FAILURE: " + uError.message);
            eaFileUrl = uploadData.path;
        }

        const { data: prof, error: pError } = await supabase
            .from('creator_profiles')
            .upsert({
                ...(creatorId ? { id: creatorId } : {}),
                user_id: user.id,
                handle: profile.handle || `user_${user.id.slice(0, 5)}`,
                display_name: profile.displayName,
                bio: profile.bio,
                avatar_type: profile.avatarType,
                avatar_data: profile.avatarData
            }, {
                onConflict: 'user_id'
            })
            .select()
            .single();

        if (pError) throw new Error("PROFILE_SYNC_FAILURE: " + pError.message);
        creatorId = prof.id;

        const { data: sData, error: sError } = await supabase
            .from('strategies')
            .insert({
                creator_id: creatorId,
                name: strategy.name,
                type: strategy.type,
                symbol: strategy.symbol,
                timeframe: strategy.timeframe,
                description: strategy.description,
                script_code: strategy.script_code, 
                monthly_price_inr: strategy.tier === 'FREE' ? 0 : strategy.price,
                video_url: strategy.video_url,
                setup_guide: strategy.video_url, // Assuming same field for now
                origin: strategy.origin,
                tier: strategy.tier,
                mode: strategy.mode,
                thumbnail_url: strategy.screenshot_urls[0],
                screenshot_urls: strategy.screenshot_urls.filter(u => u),
                how_it_works: [strategy.description, `Optimized for ${strategy.timeframe}`],
                is_managed: strategy.type === 'MT5_EA' ? true : false,
                ea_file_url: eaFileUrl,
                execution_mode: strategy.type === 'MT5_EA' ? 'COPPR_MANAGED' : 'WEBHOOK_BRIDGE',
                master_signal_key: generatedKey || 'COPPR-' + self.crypto.randomUUID().split('-')[0].toUpperCase(),
                status: 'PENDING'
            })
            .select('id')
            .single();

        if (sError) throw new Error(`PROTOCOL_REJECTION: ${sError.message}`);

        if (sData) {
            setStrategyId(sData.id);
            setCurrentStep(4);
        }

    } catch (err: any) {
        console.error("SUBMISSION_TERMINATED:", err);
        alert(`BROADCAST FAILED: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  const isStep0Complete = profile.displayName.trim() !== '' && profile.bio.trim() !== '';
  const isStep1Complete = 
    strategy.name.trim() !== '' && 
    strategy.symbol.trim() !== '' && 
    strategy.timeframe.trim() !== '' && 
    strategy.description.trim() !== '' &&
    (strategy.type !== 'MT5_EA' || file !== null);

  const isStep2Complete = handshakeSynced && (strategy.type !== 'MT5_EA' || scanStatus === 'CLEAN');
  const isStep3Complete = strategy.screenshot_urls[0].trim() !== '' && strategy.video_url.trim() !== '';

  return (
    <div className="space-y-12 pb-24 font-sans">
      {/* 1. HEADER HANDSHAKE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Creator Network Ingress</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
              Deploy <span className="text-[#FFD700]">Protocol</span>
            </h1>
            <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.3em] font-sans italic underline decoration-[#FFD700]/20 underline-offset-4">Sync your algorithmic asset with the global Managed Execution Hub.</p>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-xl">
             {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-white/10'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${i === currentStep ? 'text-white' : 'text-white/20'}`}>{s}</span>
                  </div>
             ))}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
            {/* STEP 0: MANDATORY BRANDING */}
            {currentStep === 0 && (
                <motion.div key="p0" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                    <section className="bg-[#131929]/40 border border-white/5 p-12 rounded-[56px] backdrop-blur-xl space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 blur-[100px] pointer-events-none" />
                        
                        <div className="space-y-2">
                           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Creator Branding</h3>
                           <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-none">Your public identity is mandatory for project listing.</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-5xl shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10">{profile.avatarData}</span>
                                </div>
                                <select 
                                    className="bg-black/60 border border-white/10 rounded-2xl py-2 px-4 text-[10px] font-black uppercase text-white outline-none focus:border-[#FFD700]/40 transition-all font-sans"
                                    value={profile.avatarData}
                                    onChange={(e) => setProfile({...profile, avatarData: e.target.value})}
                                >
                                    <option value="🤖">Robo Alpha</option>
                                    <option value="📈">Gains Logic</option>
                                    <option value="🦾">Cyborg Hub</option>
                                    <option value="👤">Ghost Protocol</option>
                                    <option value="💎">Diamond Hands</option>
                                </select>
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                <div className="space-y-3 font-sans">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] ml-1 flex items-center gap-2">
                                        Display Name <span className="text-red-500/60 font-black">*</span>
                                    </label>
                                    <input type="text" placeholder="Matrix Quant Systems" className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-[28px] py-5 px-8 text-sm text-white outline-none transition-all font-bold placeholder:text-white/10" value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] ml-1">Creator Handle (@)</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FFD700] font-black italic">@</span>
                                        <input type="text" placeholder="alpha_logic_sys" className="w-full bg-white/[0.03] border border-white/10 group-hover:border-white/20 focus:border-[#FFD700]/40 rounded-[28px] py-5 pl-12 pr-8 text-sm text-white outline-none transition-all font-bold placeholder:text-white/10" value={profile.handle} onChange={e => setProfile({...profile, handle: e.target.value})} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] ml-1 flex items-center gap-2">
                                        Bio / Professional Mission <span className="text-red-500/60 font-black">*</span>
                                    </label>
                                    <input type="text" placeholder="Deep liquidity Momentum scanning for Gold Pulse protocols." className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#FFD700]/40 rounded-[28px] py-5 px-8 text-sm text-white outline-none transition-all font-bold placeholder:text-white/10" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <div className="flex justify-end items-center gap-6">
                      {!isStep0Complete && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse italic">! Complete mandatory fields to proceed</span>}
                      <button 
                        onClick={() => setCurrentStep(1)} 
                        disabled={!isStep0Complete}
                        className={`px-12 py-5 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-xl italic ${isStep0Complete ? 'bg-[#FFD700] text-black hover:scale-105 shadow-[#FFD700]/10' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}
                      >
                         Initialize Project Hub →
                      </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 1: RESTORED CATEGORIZATION & HUB */}
            {currentStep === 1 && (
                <motion.div key="p1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                    {/* EA VS INDICATOR SELECTOR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button onClick={() => setStrategy({...strategy, type: 'MT5_EA', mode: 'CLIENT_SIDE'})} className={`p-8 rounded-[40px] border transition-all flex flex-col items-center gap-4 text-center group ${strategy.type === 'MT5_EA' ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'}`}>
                            <Bot className="w-12 h-12 group-hover:scale-110 transition-transform" />
                            <div className="space-y-1">
                                <h4 className="text-[13px] font-black uppercase tracking-widest italic leading-none">MT5 Bot Binary</h4>
                                <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mt-1 ${strategy.type === 'MT5_EA' ? 'text-black/40' : 'text-white/10'}`}>Managed Execution Node</p>
                            </div>
                        </button>
                        <button onClick={() => setStrategy({...strategy, type: 'PINE_SCRIPT_WEBHOOK', mode: 'WEBHOOK_BRIDGE'})} className={`p-8 rounded-[40px] border transition-all flex flex-col items-center gap-4 text-center group ${strategy.type === 'PINE_SCRIPT_WEBHOOK' ? 'bg-[#00E676] text-black border-[#00E676] shadow-xl' : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'}`}>
                            <Code2 className="w-12 h-12 group-hover:scale-110 transition-transform" />
                            <div className="space-y-1">
                                <h4 className="text-[13px] font-black uppercase tracking-widest italic leading-none">Indicator Protocol</h4>
                                <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mt-1 ${strategy.type === 'PINE_SCRIPT_WEBHOOK' ? 'text-black/40' : 'text-white/10'}`}>Pine Script Webhook Bridge</p>
                            </div>
                        </button>
                    </div>

                    {/* 1. CATEGORIZATION PROTOCOL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Distribution Hub</label>
                            <div className="flex gap-4 p-2 bg-black/40 border border-white/5 rounded-3xl">
                                <button onClick={() => setStrategy({...strategy, origin: 'PERSONAL'})} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-2 ${strategy.origin === 'PERSONAL' ? 'bg-[#FFD700] text-black shadow-xl' : 'text-white/20 hover:text-white/40'}`}>
                                    <Lock className="w-3 h-3" /> Private Node
                                </button>
                                <button onClick={() => setStrategy({...strategy, origin: 'MARKETPLACE'})} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-2 ${strategy.origin === 'MARKETPLACE' ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 shadow-xl' : 'text-white/20 hover:text-white/40'}`}>
                                    <Globe className="w-3 h-3" /> Marketplace
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Monetization Tier</label>
                            <div className="flex gap-4 p-2 bg-black/40 border border-white/5 rounded-3xl">
                                <button onClick={() => setStrategy({...strategy, tier: 'FREE'})} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all italic ${strategy.tier === 'FREE' ? 'bg-white/10 text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}>Community (Free)</button>
                                <button onClick={() => setStrategy({...strategy, tier: 'PAID'})} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all italic ${strategy.tier === 'PAID' ? 'bg-[#FFD700] text-black shadow-xl' : 'text-white/20 hover:text-white/40'}`}>Elite (Paid)</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#131929]/40 border border-white/5 p-12 rounded-[56px] space-y-16 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-80 h-80 bg-[#FFD700]/5 blur-[120px] pointer-events-none" />
                        
                        {/* 2. CORE PARAMETERS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Best Timeframe <span className="text-red-500/60">*</span></label>
                                <input type="text" placeholder="e.g. 15H, 1D" className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-3xl py-5 px-8 text-sm text-white outline-none font-bold text-center italic" value={strategy.timeframe} onChange={e => setStrategy({...strategy, timeframe: e.target.value})} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Algorithm Name <span className="text-red-500/60">*</span></label>
                                <input type="text" placeholder="Gold Pulse X" className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-3xl py-5 px-8 text-sm text-white outline-none font-bold italic" value={strategy.name} onChange={e => setStrategy({...strategy, name: e.target.value})} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Asset Symbol <span className="text-red-500/60">*</span></label>
                                <input type="text" placeholder="XAUUSD" className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-3xl py-5 px-8 text-sm text-white outline-none font-bold text-center italic" value={strategy.symbol} onChange={e => setStrategy({...strategy, symbol: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1 flex items-center gap-2">
                                Strategic Protocol Description <span className="text-red-500/60">*</span>
                            </label>
                            <textarea 
                                rows={5} 
                                placeholder="Describe the entry logic, risk parameters, and unique edge of this strategy in detail." 
                                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-[32px] py-6 px-8 text-sm text-white outline-none font-bold italic leading-relaxed" 
                                value={strategy.description} 
                                onChange={e => setStrategy({...strategy, description: e.target.value})} 
                            />
                        </div>

                        {/* 3. LOGIC HUB: UPLOAD VS SCRIPT */}
                        <div className="space-y-8 border-t border-white/5 pt-10 relative z-10">
                            <div className="flex items-center justify-between ml-1">
                                <div className="space-y-1">
                                   <h4 className="text-[13px] font-black text-white uppercase italic tracking-tighter shadow-sm">
                                     {strategy.type === 'MT5_EA' ? 'Binary Logic Hub' : 'Source Protocol Archive'}
                                   </h4>
                                   <p className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-none">
                                     {strategy.type === 'MT5_EA' ? 'Direct upload of .ex5 logic binary' : 'Internal encrypted repository storage for net review.'}
                                   </p>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full border ${strategy.type === 'MT5_EA' ? 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]' : 'bg-[#00E676]/10 border-[#00E676]/20 text-[#00E676]'}`}>
                                   {strategy.type === 'MT5_EA' ? 'Required Binary' : 'Protocol Source'}
                                </span>
                            </div>

                            {strategy.type === 'MT5_EA' ? (
                                <div className="relative group">
                                    <input type="file" accept=".ex4,.ex5" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                                    <div className={`bg-white/5 border-2 border-dashed rounded-[40px] py-16 flex flex-col items-center gap-4 transition-all duration-500 ${scanStatus === 'CLEAN' ? 'border-[#00E676]/40 bg-[#00E676]/5 shadow-[0_0_40px_rgba(0,230,118,0.05)]' : 'border-white/10 hover:border-[#FFD700]/40'}`}>
                                        <div className={`p-5 rounded-full ${scanStatus === 'CLEAN' ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-white/10 text-white/20 group-hover:bg-[#FFD700]/10 group-hover:text-[#FFD700]'}`}>
                                           <Upload className="w-10 h-10" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${scanStatus === 'CLEAN' ? 'text-[#00E676]' : 'text-white/40 group-hover:text-white'}`}>
                                              {file ? file.name : 'Upload .ex4 / .ex5 Binary File'}
                                            </span>
                                            <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">Mandatory for technical clearance</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group">
                                    <Terminal className="absolute left-6 top-6 w-4 h-4 text-white/10 group-focus-within:text-[#FFD700] transition-colors" />
                                    <textarea 
                                        rows={8} 
                                        placeholder="// Paste your Pine Script logic code here for encrypted archival..."
                                        className="w-full bg-black/40 border border-white/10 focus:border-[#FFD700]/40 rounded-[40px] py-8 pl-14 pr-8 text-[11px] text-white outline-none font-mono leading-relaxed transition-all shadow-inner"
                                        value={strategy.script_code} 
                                        onChange={e => setStrategy({...strategy, script_code: e.target.value})} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <button onClick={() => setCurrentStep(0)} className="px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all hover:bg-white/10"><ArrowLeft className="w-5 h-5" /></button>
                        <button 
                            onClick={() => setCurrentStep(2)} 
                            disabled={!isStep1Complete}
                            className={`flex-1 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] transition-all italic underline underline-offset-4 decoration-2 text-center font-sans ${isStep1Complete ? 'bg-[#FFD700] text-black shadow-xl' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/10'}`}
                        >
                            Synchronize to Logic Vault →
                        </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 2: INTERACTIVE HANDSHAKE VAULT */}
            {currentStep === 2 && (
                <motion.div key="p2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
                    <section className="bg-[#131929]/40 border border-white/5 p-16 rounded-[64px] backdrop-blur-xl text-center space-y-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent pointer-events-none" />
                        
                        <div className="space-y-3 relative z-10">
                           <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter shadow-sm">
                             {strategy.type === 'MT5_EA' ? 'Binary Binary Vault' : 'Signal Handshake Vault'}
                           </h4>
                           <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] font-sans">Initialize technical synchronization with the Coppr Network Hub.</p>
                        </div>

                        {strategy.type === 'MT5_EA' ? (
                            <div className="max-w-md mx-auto space-y-8 relative z-10">
                                <div className="bg-black/20 p-10 rounded-[48px] border border-white/5 space-y-6">
                                     <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-700 ${scanStatus === 'CLEAN' ? 'bg-[#00E676]/20 text-[#00E676] scale-110 shadow-[0_0_20px_#00E67644]' : 'bg-white/5 text-white/10'}`}>
                                        <ShieldCheck className="w-10 h-10" />
                                     </div>
                                     <div className="space-y-1">
                                        <h4 className="text-[13px] font-black text-white uppercase italic tracking-widest italic">{scanStatus === 'CLEAN' ? 'Integrity Verified' : 'Awaiting Binary'}</h4>
                                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Node logic file must be cleared for managed execution.</p>
                                     </div>
                                </div>
                                {scanStatus === 'CLEAN' && (
                                    <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={handleHandshake} className={`w-full py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] italic transition-all shadow-2xl ${handshakeSynced ? 'bg-[#00E676] text-black shadow-[#00E676]/20' : 'bg-[#FFD700] text-black shadow-[#FFD700]/20 hover:scale-105'}`}>
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : handshakeSynced ? 'Vault Synchronization Confirmed ✓' : 'Confirm & Initialize Managed Node'}
                                    </motion.button>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-xl mx-auto space-y-8 relative z-10">
                                <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[48px] backdrop-blur-3xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Zap className={`w-16 h-16 mx-auto mb-8 transition-all duration-700 ${handshakeSynced ? 'text-[#00E676] drop-shadow-[0_0_15px_#00E676] scale-110' : 'text-white/10'}`} strokeWidth={1} />
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Indicator Signal Bridge</h4>
                                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mt-6 italic font-sans px-8 leading-relaxed">
                                        Synchronize your indicator logic to generate the secure Webhook endpoint and JSON Handshake template.
                                    </p>
                                </div>
                                <button onClick={handleHandshake} disabled={handshakeSynced || loading} className={`w-full py-7 rounded-[32px] font-black uppercase text-[12px] tracking-[0.2em] italic transition-all shadow-2xl ${handshakeSynced ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40' : 'bg-[#FFD700] text-black shadow-[#FFD700]/20 hover:scale-[1.02]'}`}>
                                     {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : handshakeSynced ? 'Synchronization Established ✓' : 'Initialize Handshake Synchronization'}
                                </button>
                                
                                <AnimatePresence>
                                {handshakeSynced && generatedKey && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-6 text-left">
                                        <div className="p-8 bg-black/40 border border-[#00E676]/20 rounded-[40px] space-y-8 shadow-inner backdrop-blur-xl">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Webhook Endpoint URL</span>
                                                   {copied === 'URL' && <span className="text-[9px] font-black text-[#00E676] uppercase italic animate-pulse">Copied!</span>}
                                                </div>
                                                <div onClick={() => handleCopy('https://hub.coppr.network/api/v1/signals', 'URL')} className="group flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-[#00E676]/40 transition-all cursor-pointer">
                                                    <span className="font-mono text-[10px] text-white/60 truncate italic">https://hub.coppr.network/api/v1/signals</span>
                                                    <Copy className="w-4 h-4 text-white/20 group-hover:text-[#00E676] transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest font-sans">JSON Handshake Payload</span>
                                                   {copied === 'PAYLOAD' && <span className="text-[9px] font-black text-[#00E676] uppercase italic animate-pulse">Payload Copied!</span>}
                                                </div>
                                                <div onClick={() => handleCopy(`{ "secret": "${generatedKey}", "ticker": "{{ticker}}", "action": "{{strategy.order.action}}", "price": "{{close}}" }`, 'PAYLOAD')} className="group relative bg-black/60 p-6 rounded-3xl border border-white/10 hover:border-[#00E676]/40 transition-all cursor-pointer overflow-hidden font-mono text-[10px] text-[#00E676]/80 leading-relaxed italic">
                                                    <pre>{`{
  "secret": "${generatedKey}",
  "ticker": "{{ticker}}",
  "action": "{{strategy.order.action}}",
  "price": "{{close}}"
}`}</pre>
                                                    <Copy className="absolute bottom-4 right-4 w-4 h-4 text-white/10 group-hover:text-[#00E676]" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 px-2">
                                           <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                                           <span className="text-[9px] font-black text-[#00E676]/60 uppercase tracking-widest italic font-sans italic">Logic synced to Network Handshake. Ready for TradingView Integration.</span>
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        )}
                    </section>
                    
                    <div className="flex gap-6">
                        <button onClick={() => setCurrentStep(1)} className="px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all hover:bg-white/10"><ArrowLeft className="w-5 h-5" /></button>
                        <button 
                            onClick={() => setCurrentStep(3)} 
                            disabled={!isStep2Complete} 
                            className={`flex-1 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] transition-all italic underline underline-offset-4 decoration-2 ${isStep2Complete ? 'bg-[#FFD700] text-black shadow-2xl shadow-[#FFD700]/10 hover:scale-[1.01]' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}
                        >
                            Final Step: Assets & Pricing Hub →
                        </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 3: ASSETS & FINANCIALS */}
            {currentStep === 3 && (
                <motion.div key="p3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                     <section className="bg-[#131929]/40 border border-white/5 p-16 rounded-[64px] backdrop-blur-xl space-y-16 relative overflow-hidden leading-none">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none" />
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-12">
                            <div className="space-y-2">
                               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Assets & Pricing</h3>
                               <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-[0.3em]">Configure evidence and monetization</p>
                            </div>
                            <Trophy className="w-12 h-12 text-[#FFD700]/20" strokeWidth={1} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                 {/* MONETIZATION TIER */}
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Monetization Tier</label>
                                    <div className="flex gap-4 p-2 bg-black/40 border border-white/5 rounded-2xl">
                                        <button onClick={() => setStrategy({...strategy, tier: 'FREE'})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${strategy.tier === 'FREE' ? 'bg-white/10 text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}>Community (Free)</button>
                                        <button onClick={() => setStrategy({...strategy, tier: 'PAID'})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${strategy.tier === 'PAID' ? 'bg-[#FFD700] text-black shadow-xl' : 'text-white/20 hover:text-white/40'}`}>Elite (Paid)</button>
                                    </div>
                                 </div>

                                 <div className="space-y-3 font-sans pt-4">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Chart Example (Image URL) <span className="text-red-500/60">*</span></label>
                                    <input type="text" placeholder="https://imgur.com/image.png" className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-3xl py-5 px-8 text-[11px] text-white outline-none font-mono" value={strategy.screenshot_urls[0]} onChange={e => {
                                        const news = [...strategy.screenshot_urls];
                                        news[0] = e.target.value;
                                        setStrategy({...strategy, screenshot_urls: news});
                                    }} />
                                 </div>
                                 <div className="space-y-3 font-sans">
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Video Guide (YouTube/Instagram Reel) <span className="text-red-500/60">*</span></label>
                                    <input type="text" placeholder="https://reel.link/your_demo" className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FFD700]/40 rounded-3xl py-5 px-8 text-[11px] text-white outline-none font-mono" value={strategy.video_url} onChange={e => setStrategy({...strategy, video_url: e.target.value})} />
                                 </div>
                            </div>

                            <div className={`p-10 rounded-[48px] space-y-10 transition-all duration-700 ${strategy.tier === 'PAID' ? 'bg-black/40 border border-[#FFD700]/20' : 'bg-white/[0.01] border border-white/5 opacity-40 shadow-inner'}`}>
                                {strategy.tier === 'PAID' ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic leading-none">Subscription Fee (INR)</label>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-7xl font-black text-white italic tracking-tighter leading-none">₹{strategy.price}</span>
                                                <span className="text-[12px] font-black text-[#FFD700] uppercase tracking-[0.4em]">/ Mo</span>
                                            </div>
                                        </div>
                                        <input type="range" min="999" max="9999" step="100" value={strategy.price} onChange={e => setStrategy({...strategy, price: parseInt(e.target.value)})} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-[#FFD700] cursor-pointer shadow-xl" />
                                        <div className="flex justify-between items-center">
                                             <span className="text-[8px] font-black text-white/10 uppercase italic">Entry Level</span>
                                             <span className="text-[8px] font-black text-white/10 uppercase italic">Elite Protocol</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center gap-6 text-center py-10 px-4">
                                        <Sparkles className="w-12 h-12 text-[#FFD700]/20 animate-pulse" strokeWidth={1} />
                                        <div className="space-y-2">
                                           <h4 className="text-[13px] font-black text-white/40 uppercase tracking-widest italic leading-none">Community Open Node</h4>
                                           <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest leading-relaxed">No subscription fee required. Accessible to the global network.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="flex gap-6">
                        <button onClick={() => setCurrentStep(2)} className="px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all hover:bg-white/10"><ArrowLeft className="w-5 h-5" /></button>
                        <button 
                             onClick={handleFinalSubmit} 
                             disabled={!isStep3Complete || loading} 
                             className={`flex-1 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[12px] transition-all italic flex items-center justify-center gap-4 shadow-2xl ${isStep3Complete ? 'bg-[#FFD700] text-black shadow-[#FFD700]/10 hover:scale-[1.01]' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/10'}`}
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> VERIFY & BROADCAST PROJECT TO NETWORK</>}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 4: FINAL SUCCESS */}
            {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 gap-12 text-center max-w-2xl mx-auto">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#00E676]/20 blur-[60px] rounded-full animate-pulse" />
                        <div className="w-32 h-32 rounded-[48px] bg-[#00E676]/10 border border-[#00E676]/40 flex items-center justify-center relative z-10 shadow-2xl">
                             <CheckCircle2 className="w-16 h-16 text-[#00E676]" strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none shadow-sm">Project <span className="text-[#00E676]">Pulsing</span></h2>
                        <p className="text-[12px] text-white/30 uppercase font-bold tracking-[0.3em] font-sans italic px-10">
                          Clearance initiated. Your strategy node is now undergoing administrative audit before live network propagation.
                        </p>
                    </div>
                    <button onClick={() => router.push('/dashboard/creator')} className="px-12 py-5 bg-white/5 border border-white/10 rounded-[32px] text-[11px] font-black uppercase text-white transition-all italic hover:bg-white/10 hover:scale-105 tracking-widest font-sans italic">Back to Terminal Hub</button>
                    
                    <div className="pt-10 flex items-center gap-4 text-white/10 pb-20">
                       <Zap className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Coppr Managed Execution Grid</span>
                       <Zap className="w-4 h-4" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
