'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, Search, ArrowRight, Bot, Target, Cpu, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AIBuilderPage() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'SUCCESS'>('IDLE');
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const router = useRouter();

    const processingSteps = [
        { label: 'Extracting Video & Audio Context...', icon: Youtube },
        { label: 'Identifying Entry & Exit Triggers...', icon: Search },
        { label: 'Calculating Optimal Stop-Loss & Take-Profit...', icon: Target },
        { label: 'Compiling Pine Script Code...', icon: Cpu }
    ];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || (!url.includes('youtu') && !url.includes('instagram'))) return;
        
        setStatus('ANALYZING');
        
        // Artificial delay simulation
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;
                if (next === 25) setStep(1);
                if (next === 50) setStep(2);
                if (next === 75) setStep(3);
                if (next >= 100) {
                    clearInterval(interval);
                    completeGeneration();
                    return 100;
                }
                return next;
            });
        }, 100);
    };

    const completeGeneration = async () => {
        try {
            // Mock API call
            const res = await fetch('/api/creator/generate-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            
            if (data.strategyId) {
                setStatus('SUCCESS');
                setTimeout(() => {
                    router.push(`/dashboard/marketplace/${data.strategyId}`);
                }, 2000);
            }
        } catch (error) {
            console.error('Generation failed', error);
            setStatus('IDLE');
            setProgress(0);
        }
    };

    return (
        <div className="min-h-[800px] flex flex-col items-center justify-center p-6 relative">
            <Link href="/dashboard/creator" className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Back</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl space-y-16"
            >
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 mx-auto backdrop-blur-md">
                        <Cpu className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em]">Coppr AI Engine</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                        Paste a Video.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF8C00]">Get a Trading Bot.</span>
                    </h1>
                    <p className="text-sm md:text-base font-bold text-white/40 uppercase tracking-widest max-w-3xl mx-auto leading-relaxed font-sans">
                        Our engine will analyze the YouTuber's strategy, extract their exact rules and stop-loss targets, and build a live bot for you in 10 seconds.
                    </p>
                </div>

                <div className="relative max-w-3xl mx-auto">
                    <div className="absolute inset-0 bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <form onSubmit={handleGenerate} className="relative z-10">
                        <div className={`p-3 md:p-4 bg-white/[0.03] border border-white/10 rounded-[32px] md:rounded-[40px] flex flex-col md:flex-row items-center gap-4 transition-all duration-700 backdrop-blur-3xl shadow-2xl ${status !== 'IDLE' ? 'opacity-50 pointer-events-none' : 'hover:bg-white/[0.05] hover:border-white/20'}`}>
                            <div className="pl-6 shrink-0 hidden md:flex items-center gap-2">
                                <Youtube className="w-6 h-6 text-white/30" />
                                <span className="text-white/20">/</span>
                                <Instagram className="w-5 h-5 text-white/30" />
                            </div>
                            <input 
                                type="url" 
                                required
                                placeholder="Paste YouTube or Instagram Link Here..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-white font-medium text-center md:text-left px-4 py-4 md:py-0 w-full"
                            />
                                <button 
                                type="submit" 
                                disabled={status !== 'IDLE' || !url}
                                className="w-full md:w-auto px-10 py-5 md:py-6 bg-[#FFD700] text-black rounded-[24px] md:rounded-[32px] font-black uppercase text-xs tracking-widest hover:bg-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shrink-0 shadow-xl shadow-[#FFD700]/20 hover:shadow-white/20"
                            >
                                {status === 'IDLE' ? (
                                    <>Generate <Bot className="w-4 h-4" /></>
                                ) : (
                                    <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
                                )}
                            </button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {status !== 'IDLE' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-8 overflow-hidden"
                            >
                                <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 space-y-6 relative overflow-hidden backdrop-blur-xl">
                                    <div className="absolute top-0 left-0 h-1 bg-[#00E676] transition-all duration-300" style={{ width: `${progress}%` }} />
                                    
                                    {status === 'SUCCESS' ? (
                                        <div className="flex flex-col items-center text-center space-y-4 py-8">
                                            <div className="w-20 h-20 rounded-[28px] bg-[#00E676]/20 flex items-center justify-center border border-[#00E676]/50 shadow-[0_0_40px_rgba(0,230,118,0.3)]">
                                                <CheckCircle2 className="w-10 h-10 text-[#00E676]" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white uppercase italic">Strategy Compiled Successfully</h3>
                                                <p className="text-sm font-bold text-white/50 uppercase tracking-widest mt-2 font-sans">Redirecting to Marketplace...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 py-4">
                                            {processingSteps.map((s, idx) => (
                                                <div key={idx} className={`flex items-center gap-6 transition-all duration-700 ${idx === step ? 'opacity-100 scale-100 translate-x-4' : idx < step ? 'opacity-30 scale-95' : 'opacity-10 scale-90 -translate-x-4'}`}>
                                                    <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 ${idx < step ? 'bg-[#00E676]/20 border border-[#00E676]/40 shadow-[0_0_20px_rgba(0,230,118,0.2)]' : idx === step ? 'bg-[#FFD700]/20 border border-[#FFD700]/40 shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'bg-white/[0.02] border border-white/5'}`}>
                                                        {idx < step ? (
                                                            <CheckCircle2 className="w-6 h-6 text-[#00E676]" />
                                                        ) : idx === step ? (
                                                            <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
                                                        ) : (
                                                            <s.icon className="w-6 h-6 text-white/40" />
                                                        )}
                                                    </div>
                                                    <span className={`text-base md:text-lg font-black uppercase tracking-widest italic ${idx === step ? 'text-[#FFD700]' : 'text-white/40'}`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
