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
  LineChart,
  Settings
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { AstralTerminalWelcome } from './AstralTerminalWelcome';
import { IntegrationModal } from './IntegrationModal';
import { ParameterConfigModal } from './ParameterConfigModal';
import ManagedNodeMonitor from './ManagedNodeMonitor';

const SignalVisualizer = dynamic(() => import('./SignalVisualizer').then(m => m.SignalVisualizer), {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center bg-black/20 animate-pulse text-white/20">Loading Technical Terminal...</div>
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
  fetchVault,
  isLocked
}: any) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisualMode, setIsVisualMode] = useState(true);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
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
            className="bg-[#0D0D0D] border border-[#1A1A1A] w-full flex flex-col min-h-[900px] lg:h-[800px] lg:min-h-0 font-mono group"
        >
            {/* 1. CINEMA INTERNAL HEADER (HANDSHAKE) */}
            <div className="px-6 py-3 bg-[#050505] border-b border-[#1A1A1A] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#FFD700]" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] leading-none mb-1">Node_Stream // Live</span>
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">RSA_SECURE_TUNNEL_ENCRYPTED</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] animate-pulse">24ms_LATENCY</span>
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">HANDSHAKE_PULSE // OK</span>
                    </div>
                    <div className="h-6 w-px bg-[#1A1A1A] mx-2" />
                    <button
                      onClick={() => setIsVisualMode(!isVisualMode)}
                      className={`p-2 transition-all ${isVisualMode ? 'bg-[#FFD700] text-black' : 'bg-transparent text-white/40 hover:text-white'}`}
                    >
                        {isVisualMode ? <CheckCircle2 className="w-4 h-4" /> : <LineChart className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row w-full min-h-0 overflow-y-auto lg:overflow-visible custom-scrollbar">
                {/* 2. INSTITUTIONAL COMMAND FRAME (CHART) */}
                <div className="flex-1 min-h-[400px] lg:min-h-0 flex flex-col bg-[#000000] relative border-b lg:border-b-0 lg:border-r border-[#1A1A1A]">
                    <div className="relative flex-1 w-full h-full min-h-[400px]">
                        <SignalVisualizer
                            symbol={activeSymbol}
                            activeSymbols={sub.active_assets || []}
                            onSymbolChange={setSelectedSymbol}
                            logs={logs}
                        />
                        {/* TV Watermark */}
                        <div className="absolute bottom-4 left-4 text-[10px] font-black text-white/20 uppercase select-none pointer-events-none">
                            TV
                        </div>
                    </div>
                </div>

                {/* 3. VERTICAL COMMAND DOCK */}
                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-[#0D0D0D] flex flex-col justify-between overflow-y-visible lg:overflow-y-auto custom-scrollbar">
                    
                    {/* Section 1 - Bot Identity */}
                    <div className="p-8 border-b border-[#1A1A1A]">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[#050505] border border-[#1A1A1A] shrink-0">
                                    <Zap className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{sub.strategy.name}</h3>
                                    <span className="text-[8px] font-black text-[#FFD700] uppercase tracking-[0.3em] block">
                                        {isOfficial ? 'INSTITUTIONAL_NODE' : 'COMMUNITY_NODE'}
                                    </span>
                                </div>
                            </div>
                            <button
                                 type="button"
                                 disabled={isDeleting}
                                 onClick={async (e) => {
                                     e.preventDefault();
                                     e.stopPropagation();
                                     if (!window.confirm("Are you sure you want to delete this node?")) {
                                        return;
                                     }
                                     setIsDeleting(true);
                                     try {
                                         await removeSubscription(sub.id);
                                     } catch (err) {
                                         console.error('Handshake error:', err);
                                     } finally {
                                         setIsDeleting(false);
                                     }
                                 }}
                                 className={`p-2 transition-all border ${isDeleting ? 'bg-red-500/20 border-red-500/40 text-red-500 animate-pulse' : showConfirmDelete ? 'bg-red-500 text-black border-red-500' : 'bg-[#050505] text-white/40 border-[#1A1A1A] hover:bg-black hover:text-red-500'}`}
                            >
                                 <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        {/* Section 2 - Config Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-[6px] bg-[#0A0A0A] border border-[#1A1A1A] space-y-2">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] leading-none">Protocol_</p>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                        {RETAIL_JARGON[sub.engine_mode || 'MULTIPLIER']?.label}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 rounded-[6px] bg-[#0A0A0A] border border-[#1A1A1A] space-y-2">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] leading-none">Risk_Factor</p>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">⚡ {sub.engine_value || '1.0'}X_ALPHA</span>
                                </div>
                            </div>
                        </div>

                        {sub.strategy.execution_mode === 'COPPR_MANAGED' && (
                            <ManagedNodeMonitor strategyId={sub.strategy_id} isCreator={false} />
                        )}

                        {/* Section 3 - Pipeline Status */}
                        <div className="p-6 border-y border-[#1A1A1A]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${sub.sync_active ? 'bg-[#FFD700]' : 'bg-white/20'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${sub.sync_active ? 'text-white' : 'text-white/40'}`}>
                                        {sub.sync_active ? 'Online' : 'Standby'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleSync(sub.id, sub.sync_active)}
                                    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${sub.sync_active ? 'bg-[#FFD700]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-black transition-all duration-300 ${sub.sync_active ? 'left-[22px]' : 'left-[2px]'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Section 5 - Gateway Controls */}
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => onManageAssets?.(sub)}
                                className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all font-mono"
                            >
                                <Target className="w-5 h-5 text-[#FFD700]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Targets</span>
                            </button>
                            <button
                                onClick={() => setIsIntegrationModalOpen(true)}
                                className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all font-mono"
                            >
                                <Globe className="w-5 h-5 text-[#FFD700]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Bridge</span>
                            </button>
                            <button
                                onClick={() => setIsConfigModalOpen(true)}
                                className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all font-mono"
                            >
                                <Settings className="w-5 h-5 text-[#FFD700]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Config</span>
                            </button>
                        </div>
                    </div>

                    {/* Section 4 - Primary CTA */}
                    <button
                        disabled={sub.sync_active ? false : isLocked}
                        onClick={() => sub.sync_active ? setIsTerminalWelcomeOpen(true) : setActivationTarget(sub)}
                        className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-none border-t border-[#1A1A1A] ${sub.sync_active ? 'bg-[#1A1A1A] text-white/60 hover:text-white' : isLocked ? 'bg-[#050505] text-white/20 cursor-not-allowed' : 'bg-[#FFD700] text-black hover:bg-[#b0e600]'}`}
                    >
                        {sub.sync_active ? 'LAUNCH COMMAND CONSOLE' : isLocked ? 'MIRROR SESSION LOCKED' : 'ESTABLISH BROKER LINK'}
                    </button>
                </div>
            </div>

            <IntegrationModal
                isOpen={isIntegrationModalOpen}
                onClose={() => setIsIntegrationModalOpen(false)}
                sub={sub}
                copyToClipboard={copyToClipboard}
                copiedText={null}
            />
            
            <ParameterConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                sub={sub}
                onParametersUpdated={() => {
                    if (fetchVault) fetchVault();
                }}
            />

            <AstralTerminalWelcome
                isOpen={isTerminalWelcomeOpen}
                onClose={() => setIsTerminalWelcomeOpen(false)}
                strategyName={sub.strategy.name}
            />
        </motion.div>
    );
}
