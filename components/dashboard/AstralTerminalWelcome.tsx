'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, Activity, Zap, Check } from 'lucide-react';

interface TerminalLine {
    text: string;
    type: 'system' | 'success' | 'warning' | 'info';
    delay: number;
}

const LINES: TerminalLine[] = [
    { text: ">> INITIALIZING COPPR FIBER NODE...", type: 'system', delay: 0 },
    { text: ">> CONNECTING TO GLOBAL MIRROR NETWORK...", type: 'info', delay: 800 },
    { text: ">> HANDSHAKE PROTOCOL: ASTRAL_V2 STARTED", type: 'system', delay: 1500 },
    { text: ">> AUTHENTICATING SECURE TUNNEL...", type: 'info', delay: 2200 },
    { text: ">> TUNNEL SECURED: AES-256 PARITY ENFORCED", type: 'success', delay: 3000 },
    { text: ">> ANALYZING STRATEGY META-DATA...", type: 'info', delay: 3500 },
    { text: ">> NODE_IDS: SYNCED", type: 'success', delay: 4000 },
    { text: ">> EXECUTION_BRIDGE: OPERATIONAL", type: 'success', delay: 4500 },
    { text: ">> WELCOME TO THE ELITE HUB.", type: 'system', delay: 5200 },
];

export const AstralTerminalWelcome = ({ isOpen, onClose, strategyName }: { isOpen: boolean, onClose: () => void, strategyName: string }) => {
    const [visibleLines, setVisibleLines] = useState<number>(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setVisibleLines(0);
            setIsComplete(false);
            return;
        }

        const timers = LINES.map((line, index) => {
            return setTimeout(() => {
                setVisibleLines(prev => prev + 1);
                if (index === LINES.length - 1) {
                    setTimeout(() => setIsComplete(true), 1000);
                }
            }, line.delay);
        });

        return () => timers.forEach(clearTimeout);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-2xl bg-[#0D121F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative"
                    >
                        {/* Terminal Header */}
                        <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-[#FFD700]" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">Terminal_Session_v2.1</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-white/5" />
                                <div className="w-2 h-2 rounded-full bg-white/5" />
                                <div className="w-2 h-2 rounded-full bg-[#FFD700]/20 animate-pulse" />
                            </div>
                        </div>

                        {/* Terminal Content */}
                        <div className="p-8 md:p-10 min-h-[400px] font-mono space-y-4">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight italic">
                                    Handshaking <span className="text-[#FFD700]">{strategyName}</span>
                                </h2>
                                <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                    <Activity className="w-3 h-3 animate-pulse text-[#00E676]" />
                                    Establishing Fiber Linkage...
                                </div>
                            </div>

                            <div className="space-y-2">
                                {LINES.slice(0, visibleLines).map((line, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-4"
                                    >
                                        <span className="text-white/10 shrink-0 select-none">[{index.toString().padStart(2, '0')}]</span>
                                        <span className={`text-[11px] md:text-[12px] font-bold tracking-wider leading-relaxed ${
                                            line.type === 'success' ? 'text-[#00E676]' : 
                                            line.type === 'warning' ? 'text-[#FF5252]' : 
                                            line.type === 'info' ? 'text-[#00B0FF]' : 
                                            'text-white/60'
                                        }`}>
                                            {line.text}
                                        </span>
                                    </motion.div>
                                ))}
                                {visibleLines < LINES.length && (
                                    <div className="w-2 h-4 bg-[#FFD700] animate-pulse ml-12" />
                                )}
                            </div>
                        </div>

                        {/* Quick Metrics Footer */}
                        <div className="px-8 py-6 bg-black/40 border-t border-white/5 grid grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-[#00E676]/40" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 uppercase">Security</span>
                                    <span className="text-[10px] font-bold text-white uppercase italic tracking-tighter">AES_256</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-x border-white/5 px-6">
                                <Cpu className="w-4 h-4 text-[#FFD700]/40" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 uppercase">Core</span>
                                    <span className="text-[10px] font-bold text-white uppercase italic tracking-tighter">FIBER_V1</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-[#00B0FF]/40" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 uppercase">Parity</span>
                                    <span className="text-[10px] font-bold text-white uppercase italic tracking-tighter">0.02ms</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="p-8 bg-[#FFD700]/5 border-t border-[#FFD700]/10 flex items-center justify-center">
                            <button 
                                onClick={onClose}
                                disabled={!isComplete}
                                className={`px-10 py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] italic transition-all duration-500 flex items-center gap-4 ${
                                    isComplete 
                                    ? 'bg-[#FFD700] text-black shadow-2xl shadow-[#FFD700]/20 hover:scale-[1.05]' 
                                    : 'bg-white/5 text-white/10 cursor-not-allowed scale-[0.98]'
                                }`}
                            >
                                {isComplete ? (
                                    <><Check className="w-5 h-5" /> Enter Command Hub</>
                                ) : (
                                    <div className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce delay-100" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce delay-200" />
                                    </div>
                                )}
                            </button>
                        </div>

                        <div className="absolute top-20 right-20 w-64 h-64 bg-[#FFD700]/5 blur-[120px] pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
