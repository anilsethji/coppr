'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Trash2, 
  Activity, 
  Target, 
  Globe, 
  CheckCircle2, 
  LineChart 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { AstralTerminalWelcome } from './AstralTerminalWelcome';
import { IntegrationModal } from './IntegrationModal';
import ManagedNodeMonitor from './ManagedNodeMonitor';

const SignalVisualizer = dynamic(() => import('./SignalVisualizer').then(m => m.SignalVisualizer), { 
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center bg-black/20 rounded-3xl border border-white/5 animate-pulse text-white/20">Loading Technical Terminal...</div>
});

const RETAIL_JARGON: Record<string, { label: string; tip: string }> = {
  FIXED_QTY: { label: 'Static Units', tip: 'Trade an exact size every time.' },
  MULTIPLIER: { label: 'Signal Scaler', tip: 'Scale the master signal (e.g. 2x triples the risk).' },
  PCT_BALANCE: { label: 'Capital Allotment', tip: 'Risk a fixed % of your balance per trade.' }
};

export function StrategyCard({ 
  sub, 
  isOfficial, 
  setActivationTarget, 
  toggleSync, 
  removeSubscription, 
  onManageAssets, 
  previewSymbol,
  logs,
  fetchLogs 
}: any) {
    const [isVisualMode, setIsVisualMode] = useState(true);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [isTerminalWelcomeOpen, setIsTerminalWelcomeOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

    const activeSymbol = previewSymbol || selectedSymbol || (sub.active_assets && sub.active_assets.length > 0 ? sub.active_assets[0] : "XAUUSD");

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied to secure buffer.`);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`bg-[#0D121F]/80 border rounded-[48px] overflow-hidden group transition-all duration-700 hover:scale-[1.002] ${isOfficial ? 'border-[#FFD700]/20 shadow-2xl shadow-[#FFD700]/5' : 'border-white/5'}`}
        >
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] min-h-[600px] md:min-h-[800px]">
                {/* 1. CINEMATIC COMMAND FRAME (TECHNICAL TERMINAL) */}
                <div className="p-2 md:p-4 py-8 md:py-12 flex flex-col justify-between bg-black/40 relative min-h-[500px] border-b xl:border-b-0 xl:border-r border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-8 px-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full animate-pulse ${isOfficial ? 'bg-[#FFD700]' : 'bg-[#00E676]'}`}></span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Institutional Technical Terminal</span>
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Mirror Propagation Node // LIVE</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setIsVisualMode(!isVisualMode)} 
                              className={`p-3 rounded-2xl border transition-all ${isVisualMode ? 'bg-[#00E676]/10 border-[#00E676]/20 text-[#00E676]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                            >
                                {isVisualMode ? <CheckCircle2 className="w-5 h-5" /> : <LineChart className="w-5 h-5" />}
                            </button>
                            <div className="hidden md:flex flex-col items-end gap-1">
                                <span className="text-[11px] font-black text-[#00E676] uppercase tracking-widest font-sans animate-pulse">24ms_LATENCY</span>
                                <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">SECURE_TUNNEL_READY</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <SignalVisualizer 
                            symbol={activeSymbol} 
                            activeSymbols={sub.active_assets || []}
                            onSymbolChange={setSelectedSymbol}
                            logs={logs} 
                        />
                    </div>
                </div>

                {/* 2. SIDEBAR CONTROLS */}
                <div className="p-8 md:p-12 space-y-10 bg-white/[0.01] flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-10">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border ${isOfficial ? 'bg-[#FFD700]/10 border-[#FFD700]/20' : 'bg-white/5 border-white/5'}`}>
                                    <Zap className={`w-6 h-6 ${isOfficial ? 'text-[#FFD700]' : 'text-white/20'}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter">{sub.strategy.name}</h3>
                                    <div className="flex gap-2">
                                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] ${isOfficial ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-white/40'}`}>
                                            {isOfficial ? 'Verified Alpha' : 'Community'}
                                        </span>
                                        {sub.sync_active && (
                                            <span className="text-[8px] font-black px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded-full uppercase tracking-[0.2em]">Operational</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!sub.id.startsWith('own-') && (
                                <button onClick={() => removeSubscription(sub.id)} className="p-3 text-white/20 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="p-4 md:p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between group-hover:border-white/10 transition-all">
                                <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Protocol</p>
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Activity className="w-3.5 h-3.5 text-[#00E676] shrink-0" />
                                    <span className="text-[10px] md:text-xs font-black text-white uppercase italic truncate tracking-tight">
                                        {RETAIL_JARGON[sub.engine_mode || 'MULTIPLIER']?.label}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 md:p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between group-hover:border-white/10 transition-all">
                                <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Risk Factor</p>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                                    <span className="text-[10px] md:text-xs font-black text-white uppercase italic tracking-tight">{sub.engine_value || '1.0'}x</span>
                                </div>
                            </div>
                        </div>

                        {sub.strategy.execution_mode === 'COPPR_MANAGED' && (
                            <ManagedNodeMonitor strategyId={sub.strategy_id} isCreator={false} />
                        )}

                        <div className={`p-6 rounded-[32px] border transition-all ${sub.sync_active ? 'bg-[#00E676]/5 border-[#00E676]/20' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${sub.sync_active ? 'bg-[#00E676] shadow-[0_0_12px_#00E676]' : 'bg-white/20'}`}></div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{sub.sync_active ? 'Real-Time Sync Ready' : 'Node Handshake Halted'}</span>
                                </div>
                                <button 
                                    onClick={() => toggleSync(sub.id, sub.sync_active)}
                                    className={`relative w-12 h-6 rounded-full transition-all duration-500 ${sub.sync_active ? 'bg-[#00E676]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${sub.sync_active ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <button 
                            onClick={() => sub.sync_active ? setIsTerminalWelcomeOpen(true) : setActivationTarget(sub)}
                            className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs italic transition-all shadow-xl ${sub.sync_active ? 'bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 shadow-[#FFD700]/5' : 'bg-[#FFD700] text-black hover:scale-[1.02] shadow-[#FFD700]/20'}`}
                        >
                            {sub.sync_active ? 'Launch Digital Terminal' : 'Establish Broker Link'}
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => onManageAssets?.(sub)} 
                                className="p-5 bg-white/5 border border-white/10 rounded-[28px] text-[#00E676] flex items-center justify-center hover:bg-[#00E676]/5 transition-all group"
                                title="Identify and Whitelist Targets"
                            >
                                <Target className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> 
                                <span className="text-[9px] font-black uppercase">Targets</span>
                            </button>
                            <button 
                                onClick={() => setIsIntegrationModalOpen(true)} 
                                className={`p-5 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center hover:bg-white/10 transition-all group ${isIntegrationModalOpen ? 'text-[#00B0FF] border-[#00B0FF]/40' : 'text-white/40'}`}
                                title="Handshake Integration Bridge"
                            >
                                <Globe className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> 
                                <span className="text-[9px] font-black uppercase">Bridge</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <IntegrationModal 
                isOpen={isIntegrationModalOpen} 
                onClose={() => setIsIntegrationModalOpen(false)} 
                sub={sub} 
                copyToClipboard={copyToClipboard} 
                copiedText={null} 
            />
            
            <AstralTerminalWelcome 
                isOpen={isTerminalWelcomeOpen} 
                onClose={() => setIsTerminalWelcomeOpen(false)} 
                strategyName={sub.strategy.name} 
            />
        </motion.div>
    );
}
