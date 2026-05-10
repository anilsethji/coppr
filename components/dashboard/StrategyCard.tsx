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

// ... (SignalVisualizer dynamic import remains same)

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
    const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
    const [isTerminalWelcomeOpen, setIsTerminalWelcomeOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

    // ... (activeSymbol and copyToClipboard logic remains same)

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
                                        {RETAIL_JARGON[sub.engine_mode || 'MULTIPLIER']?.label}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsRiskModalOpen(true)}
                                className="p-4 rounded-[6px] bg-[#0A0A0A] border border-[#1A1A1A] space-y-2 text-left hover:border-[#FFD700] transition-colors group/risk"
                            >
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] leading-none group-hover/risk:text-[#FFD700]">Risk_Factor</p>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">
                                        ⚡ {sub.engine_value || '1.0'}{sub.engine_mode === 'MULTIPLIER' ? 'X' : ''}_ALPHA
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* ... (ManagedNodeMonitor and Pipeline Status remains same) */}

                        {/* Section 5 - Gateway Controls */}
                        {/* ... (Grid remains same) */}
                    </div>

                    {/* ... (Primary CTA remains same) */}
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
                strategyName={sub.strategy.name}
            />
        </motion.div>
    );
}
