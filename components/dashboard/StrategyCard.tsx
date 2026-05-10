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
import { RiskManagementModal } from './RiskManagementModal';
import ManagedNodeMonitor from './ManagedNodeMonitor';

const SignalVisualizer = dynamic(() => import('./SignalVisualizer').then(m => m.SignalVisualizer), {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center bg-black/20 animate-pulse text-white/20">Loading Technical Terminal...</div>
});

const RETAIL_JARGON: Record<string, { label: string; tip: string }> = {
  FIXED_QTY: { label: 'Trade Size', tip: 'Trade a fixed USD amount every time.' },
  PCT_BALANCE: { label: 'Portfolio Risk', tip: 'Risk a fixed % of your portfolio per trade.' }
};

export function StrategyCard({
// ... (props remain same)
}) {
    // ... (state remains same)

    return (
        <motion.div
            // ... (className remains same)
        >
            {/* ... (Header remains same) */}

            <div className="flex-1 flex flex-col lg:flex-row w-full min-h-0 overflow-y-auto lg:overflow-visible custom-scrollbar">
                {/* ... (Institutional Command Frame remains same) */}

                {/* 3. VERTICAL COMMAND DOCK */}
                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-[#0D0D0D] flex flex-col justify-between overflow-y-visible lg:overflow-y-auto custom-scrollbar">
                    
                    {/* ... (Bot Identity remains same) */}

                    <div className="p-8 space-y-8 flex-1">
                        {/* Section 2 - Config Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-[6px] bg-[#0A0A0A] border border-[#1A1A1A] space-y-2">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] leading-none">Protocol_</p>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                        {RETAIL_JARGON[sub?.engine_mode === 'MULTIPLIER' ? 'FIXED_QTY' : (sub?.engine_mode || 'FIXED_QTY')]?.label}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsRiskModalOpen(true)}
                                className="p-4 rounded-[6px] bg-[#0A0A0A] border border-[#1A1A1A] space-y-2 text-left hover:border-[#FFD700] transition-colors group/risk"
                            >
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] leading-none group-hover/risk:text-[#FFD700]">Set Leverage</p>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">
                                        ⚡ {sub?.leverage_override || '1'}X_POWER
                                    </span>
                                </div>
                            </button>
                        </div>

                        {sub?.strategy?.execution_mode === 'COPPR_MANAGED' && (
                            <ManagedNodeMonitor strategyId={sub.strategy_id} isCreator={false} />
                        )}

                        {/* Section 3 - Pipeline Status */}
                        <div className="p-6 border-y border-[#1A1A1A]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${sub?.sync_active ? 'bg-[#00E676]' : 'bg-white/20'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${sub?.sync_active ? 'text-white' : 'text-white/40'}`}>
                                        {sub?.sync_active ? 'Online' : 'Standby'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleSync(sub.id, sub.sync_active)}
                                    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${sub?.sync_active ? 'bg-[#00E676]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-black transition-all duration-300 ${sub?.sync_active ? 'left-[22px]' : 'left-[2px]'}`} />
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
                        disabled={sub?.sync_active ? false : isLocked}
                        onClick={() => sub?.sync_active ? setIsTerminalWelcomeOpen(true) : setActivationTarget(sub)}
                        className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-none border-t border-[#1A1A1A] ${sub?.sync_active ? 'bg-[#1A1A1A] text-white/60 hover:text-white' : isLocked ? 'bg-[#050505] text-white/20 cursor-not-allowed' : 'bg-[#FFD700] text-black hover:bg-[#b0e600]'}`}
                    >
                        {sub?.sync_active ? 'LAUNCH COMMAND CONSOLE' : isLocked ? 'MIRROR SESSION LOCKED' : 'ESTABLISH BROKER LINK'}
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

            <RiskManagementModal
                isOpen={isRiskModalOpen}
                onClose={() => setIsRiskModalOpen(false)}
                sub={sub}
                onUpdated={() => {
                    if (fetchVault) fetchVault();
                }}
            />

            <AstralTerminalWelcome
                isOpen={isTerminalWelcomeOpen}
                onClose={() => setIsTerminalWelcomeOpen(false)}
                strategyName={sub?.strategy?.name || 'Unknown Node'}
            />
        </motion.div>
    );
}
