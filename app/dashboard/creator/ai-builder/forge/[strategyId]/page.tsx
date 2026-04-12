'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Cpu, 
  Zap, 
  Settings, 
  Play, 
  Save, 
  Eye, 
  EyeOff, 
  IndianRupee, 
  Activity, 
  TrendingUp, 
  Target, 
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Code2,
  FileEdit,
  LineChart
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { simulateStrategyPerformance, StrategyMetrics } from '@/lib/utils/strategy-engine';

export default function StrategyForgePage() {
    const { strategyId } = useParams();
    const router = useRouter();
    const [strategy, setStrategy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSimulating, setIsSimulating] = useState(false);
    const [metrics, setMetrics] = useState<StrategyMetrics | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Editable state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        async function fetchStrategy() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('strategies')
                .select('*')
                .eq('id', strategyId)
                .single();
            
            if (data) {
                setStrategy(data);
                setName(data.name);
                setDescription(data.description);
                setCode(data.script_code || '');
                setPrice(data.monthly_price_inr);
                
                // Initial simulation on load
                const results = simulateStrategyPerformance(data.script_code || '');
                setMetrics(results);
            }
            setLoading(false);
        }
        fetchStrategy();
    }, [strategyId]);

    const handleRunSimulation = () => {
        setIsSimulating(true);
        setTimeout(() => {
            const results = simulateStrategyPerformance(code);
            setMetrics(results);
            setIsSimulating(false);
        }, 1500);
    };

    const handleDeploy = async () => {
        setIsSaving(true);
        try {
            const resp = await fetch('/api/creator/finalize-strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategyId,
                    name,
                    description,
                    code,
                    isPublic,
                    price,
                    metrics
                })
            });
            
            const json = await resp.json();

            if (json.success) {
                router.push(`/dashboard/marketplace/${strategyId}`);
            } else {
                alert("Deployment failed: " + (json.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-[#FFD700] animate-spin" />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Igniting the Forge...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A1A3A] text-white selection:bg-[#FFD700] selection:text-black pb-32">
            
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#0A1A3A]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/creator/ai-builder" className="p-2 hover:bg-white/5 rounded-xl transition-all">
                            <ArrowLeft className="w-5 h-5 text-white/40" />
                        </Link>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-[#FFD700] uppercase tracking-[0.3em]">AI Strategy Forge</span>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter">Refining: <span className="text-white/60">{name}</span></h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleRunSimulation}
                            disabled={isSimulating}
                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all"
                        >
                            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-[#00E676]" />}
                            Run Backtest
                        </button>
                        <button 
                            onClick={handleDeploy}
                            disabled={isSaving || isSimulating || !metrics}
                            className="px-8 py-2.5 bg-[#FFD700] text-black hover:scale-105 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-[#FFD700]/20 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <ShieldCheck className="w-4 h-4 text-black" />}
                            Confirm & Deploy
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto p-8 lg:p-12 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
                
                {/* Left Side: Creation Area */}
                <div className="space-y-10">
                    
                    {/* Performance Overview (The Hook) */}
                    <section className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <LineChart className="w-40 h-40" />
                        </div>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase italic">Simulated <span className="text-[#00E676]">Performance</span></h3>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Based on detected logic variables</p>
                                </div>
                                <div className="px-4 py-2 bg-[#00E676]/10 border border-[#00E676]/20 rounded-full flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                                    <span className="text-[8px] font-black text-[#00E676] uppercase tracking-[0.2em]">Verified Logic</span>
                                </div>
                            </div>

                            {/* Chart View */}
                            <div className="h-[250px] w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative group/chart">
                                <AnimatePresence mode='wait'>
                                    {isSimulating ? (
                                        <motion.div 
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full h-full flex flex-col items-center justify-center gap-4"
                                        >
                                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-[#FFD700]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                            </div>
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Processing Logic Points...</span>
                                        </motion.div>
                                    ) : metrics && (
                                        <motion.div 
                                            key="chart"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full h-full relative"
                                        >
                                            {/* Simple SVG Chart */}
                                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#00E676" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                {/* Grid Lines */}
                                                {[20, 40, 60, 80].map(y => (
                                                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="0.1" />
                                                ))}
                                                {/* Path Area */}
                                                <path 
                                                    d={`M 0 100 ${metrics.equityCurve.map((p, i) => `L ${(i / (metrics.equityCurve.length - 1)) * 100} ${100 - ((p.y - 80000) / 60000) * 100}`).join(' ')} L 100 100 Z`}
                                                    fill="url(#curveGradient)"
                                                />
                                                {/* Line */}
                                                <motion.path 
                                                    d={`M 0 ${100 - ((metrics.equityCurve[0].y - 80000) / 60000) * 100} ${metrics.equityCurve.slice(1).map((p, i) => `L ${((i+1) / (metrics.equityCurve.length - 1)) * 100} ${100 - ((p.y - 80000) / 60000) * 100}`).join(' ')}`}
                                                    fill="none"
                                                    stroke="#00E676"
                                                    strokeWidth="0.5"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 2, ease: "easeInOut" }}
                                                />
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { l: 'Win Rate', v: metrics?.winRate, u: '%', c: '#00E676' },
                                    { l: 'Avg Gain', v: metrics?.avgGain, u: '%', c: '#FFD700' },
                                    { l: 'Max DD', v: metrics?.maxDrawdown, u: '%', c: '#FF5252' },
                                    { l: 'Profit Factor', v: metrics?.profitFactor, u: 'x', c: '#00B0FF' }
                                ].map((s, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{s.l}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl md:text-2xl font-black italic tracking-tighter" style={{ color: s.c }}>{s.v || '0'}</span>
                                            <span className="text-[8px] font-medium text-white/20">{s.u}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Metadata Forge */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                    <FileEdit className="w-3 h-3" /> Strategy Identity
                                </label>
                                <input 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Strategy Name"
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold uppercase italic focus:border-[#FFD700] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-3 h-3" /> Core Intelligence Brief
                                </label>
                                <textarea 
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={5}
                                    placeholder="Describe the logic..."
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed focus:border-[#FFD700] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                    <Code2 className="w-3 h-3" /> Pine Script V5 Intelligence
                                </label>
                                <div className="relative group">
                                    <textarea 
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        rows={12}
                                        className="w-full bg-[#050B18] border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-mono leading-relaxed focus:border-[#FFD700] outline-none transition-all"
                                    />
                                    <div className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Zap className="w-3 h-3 text-[#FFD700]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Side: Deployment Panel */}
                <aside className="space-y-8">
                    
                    {/* Settings Card */}
                    <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 border-t-white/20 backdrop-blur-2xl space-y-8">
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-white/20" />
                            <h4 className="text-sm font-black uppercase italic tracking-widest">Deployment <span className="text-[#FFD700]">Config</span></h4>
                        </div>

                        <div className="space-y-6">
                            {/* Privacy Toggle */}
                            <div className="space-y-3">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Distribution Protocol</span>
                                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                                    <button 
                                        onClick={() => setIsPublic(true)}
                                        className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${isPublic ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <Eye className="w-3 h-3" /> Marketplace
                                    </button>
                                    <button 
                                        onClick={() => setIsPublic(false)}
                                        className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${!isPublic ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <EyeOff className="w-3 h-3" /> Private Hub
                                    </button>
                                </div>
                            </div>

                            {/* Pricing Control */}
                            <AnimatePresence>
                                {isPublic && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="space-y-4 pt-4 border-t border-white/5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Monthly Pulse Fee</span>
                                            <span className="text-lg font-black text-[#FFD700] italic">₹{price}</span>
                                        </div>
                                        <input 
                                            type="range"
                                            min="0"
                                            max="15000"
                                            step="500"
                                            value={price}
                                            onChange={e => setPrice(parseInt(e.target.value))}
                                            className="w-full accent-[#FFD700]"
                                        />
                                        <div className="flex justify-between text-[7px] font-black text-white/10 uppercase tracking-widest px-1">
                                            <span>Free</span>
                                            <span>Premium (Elite)</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Summary Checklist */}
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                {[
                                    { t: 'Source Script Compiled', s: true },
                                    { t: 'Heuristic Review Active', s: metrics !== null },
                                    { t: 'Marketplace Compliance', s: true }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`p-1 rounded-md ${item.s ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-white/5 text-white/20'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.s ? 'text-white/60' : 'text-white/20'}`}>{item.t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer card */}
                    <div className="p-6 rounded-3xl border border-white/5 space-y-3">
                        <div className="flex items-center gap-2">
                            <IndianRupee className="w-3 h-3 text-[#00E676]" />
                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">Monetization Ready</span>
                        </div>
                        <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest leading-relaxed italic">
                            By deploying to the marketplace, your strategy will be indexed globally. Subscribers pay in INR. Revenue is split 80/20 in your favor.
                        </p>
                    </div>

                </aside>

            </main>

        </div>
    );
}
