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
  fetchLogs,
  isLocked
}: any) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`bg-[#050810] border rounded-2xl overflow-hidden group transition-all duration-500 ${isOfficial ? 'border-[#FFD700]/10' : 'border-white/[0.03]'}`}
        >
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] min-h-[500px] md:min-h-[700px]">
                {/* 1. INSTITUTIONAL COMMAND FRAME */}
                <div className="p-4 md:p-6 flex flex-col justify-between bg-black/20 relative min-h-[400px] border-b xl:border-b-0 xl:border-r border-white-[0.03]">
                    <div className="flex justify-between items-center mb-6 px-2 relative z-10">
                        <div className="flex items-center gap-4">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isOfficial ? 'bg-[#FFD700]' : 'bg-[#00E676]'}`}></span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none mb-1 font-mono">Node_Stream // Live</span>
                                <span className="text-[8px] font-black text-white/10 uppercase tracking-widest font-mono">RSA_SECURE_TUNNEL</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setIsVisualMode(!isVisualMode)} 
                              className={`p-2.5 rounded-xl border transition-all ${isVisualMode ? 'bg-[#00E676]/5 border-[#00E676]/20 text-[#00E676]' : 'bg-white/5 border-white/10 text-white/20 hover:bg-white/10'}`}
                            >
                                {isVisualMode ? <CheckCircle2 className="w-5 h-5" /> : <LineChart className="w-5 h-5" />}
                            </button>
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.2em] font-mono">24ms_LATENCY</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center py-4 bg-[#020617]/40 rounded-xl border border-white-[0.02]">
                        <SignalVisualizer 
                            symbol={activeSymbol} 
                            activeSymbols={sub.active_assets || []}
                            onSymbolChange={setSelectedSymbol}
                            logs={logs} 
                        />
                    </div>
                </div>

                {/* 2. OPERATIONAL CONTROLS */}
                <div className="p-8 md:p-10 space-y-8 flex flex-col justify-between relative bg-white/[0.01]">
                    <div className="space-y-10">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${isOfficial ? 'bg-[#FFD700]/5 border-[#FFD700]/10' : 'bg-white/5 border-white/5'}`}>
                                    <Zap className={`w-6 h-6 ${isOfficial ? 'text-[#FFD700]' : 'text-white/20'}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight [word-spacing:0.4rem] leading-none">{sub.strategy.name}</h3>
                                    <div className="flex gap-2">
                                        <span className={`text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-[0.3em] font-mono ${isOfficial ? 'bg-[#FFD700] text-black' : 'bg-white/5 text-white/20'}`}>
                                            {isOfficial ? 'Institutional_Alpha' : 'Community_Node'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                                 <button 
                                     type="button"
                                     disabled={isDeleting}
                                     onClick={async (e) => { 
                                         e.preventDefault();
                                         e.stopPropagation(); 
                                         if (!showConfirmDelete) {
                                            setShowConfirmDelete(true);
                                            setTimeout(() => setShowConfirmDelete(false), 3000);
                                            return;
                                         }
                                         setIsDeleting(true);
                                         try {
                                             await removeSubscription(sub.id); 
                                         } catch (err) {
                                             console.error('Handshake error:', err);
                                         } finally {
                                             setIsDeleting(false);
                                             setShowConfirmDelete(false);
                                         }
                                     }} 
                                     className={`px-4 py-2 flex items-center gap-2 transition-all rounded-xl border relative z-50 cursor-pointer ${isDeleting ? 'bg-red-500/20 border-red-500/40 text-red-500 animate-pulse' : showConfirmDelete ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'text-white/20 hover:text-red-500 hover:bg-red-500/10 border-transparent hover:border-red-500/20'}`}
                                     title={showConfirmDelete ? "Click again to confirm" : "Decommission Node"}
                                 >
                                     <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-bounce' : ''}`} />
                                     {showConfirmDelete && <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Confirm Purge?</span>}
                                 </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-3">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] leading-none">Protocol</p>
                                <div className="flex items-center gap-3">
                                    <Activity className="w-3.5 h-3.5 text-[#00E676] opacity-60" />
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest font-mono">
                                        {RETAIL_JARGON[sub.engine_mode || 'MULTIPLIER']?.label}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-3">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] leading-none">Risk_Factor</p>
                                <div className="flex items-center gap-3">
                                    <Zap className="w-3.5 h-3.5 text-[#FFD700] opacity-60" />
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest font-mono">{sub.engine_value || '1.0'}X_ALPHA</span>
                                </div>
                            </div>
                        </div>

                        {sub.strategy.execution_mode === 'COPPR_MANAGED' && (
                            <ManagedNodeMonitor strategyId={sub.strategy_id} isCreator={false} />
                        )}

                        <div className={`p-6 rounded-xl border transition-all ${sub.sync_active ? 'bg-[#00E676]/5 border-[#00E676]/10' : 'bg-white/5 border-white/[0.03]'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs font-mono font-black uppercase">
                                    <div className={`w-1.5 h-1.5 rounded-full ${sub.sync_active ? 'bg-[#00E676] shadow-[0_0_8px_#00E676]' : 'bg-white/10'}`}></div>
                                    <span className={sub.sync_active ? 'text-white/80' : 'text-white/20'}>{sub.sync_active ? 'Session_Online' : 'Session_Terminated'}</span>
                                </div>
                                <button 
                                    onClick={() => toggleSync(sub.id, sub.sync_active)}
                                    className={`relative w-10 h-5 rounded-full transition-all duration-500 ${sub.sync_active ? 'bg-[#00E676]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-500 ${sub.sync_active ? 'left-5.5' : 'left-0.5'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            disabled={sub.sync_active ? false : isLocked}
                            onClick={() => sub.sync_active ? setIsTerminalWelcomeOpen(true) : setActivationTarget(sub)}
                            className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] transition-all ${sub.sync_active ? 'bg-white/[0.03] border border-white/10 text-white hover:bg-white/5' : isLocked ? 'bg-white/[0.02] border border-white/5 text-white/10 cursor-not-allowed grayscale' : 'bg-[#FFD700] text-black hover:scale-[1.02]'}`}
                        >
                            {sub.sync_active ? 'Launch Command Terminal' : isLocked ? 'Mirror Session Locked' : 'Establish Broker Link'}
                        </button>
                        {isLocked && !sub.sync_active && (
                            <p className="text-[8px] font-black text-[#FF5252] uppercase tracking-[0.2em] text-center font-mono opacity-60">Existing Mirror Session Active elsewhere</p>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => onManageAssets?.(sub)} 
                                className="p-5 bg-white/[0.01] border border-white/5 rounded-xl text-[#00E676]/60 flex items-center justify-center hover:bg-[#00E676]/5 transition-all group"
                            >
                                <Target className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" /> 
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono">Targets</span>
                            </button>
                            <button 
                                onClick={() => setIsIntegrationModalOpen(true)} 
                                className={`p-5 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all group ${isIntegrationModalOpen ? 'text-[#00B0FF] border-[#00B0FF]/40' : 'text-white/20'}`}
                            >
                                <Globe className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" /> 
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono">Bridge</span>
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
