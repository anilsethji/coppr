'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Save, Loader2, Info, Percent, Layers, Gauge } from 'lucide-react';

const MODES = [
    { id: 'FIXED_QTY', label: 'Trade Value (USD)', icon: Layers, tip: 'Specify the USD amount to trade (before leverage).' },
    { id: 'PCT_BALANCE', label: '% of Portfolio', icon: Percent, tip: 'Risk a fixed percentage of your total balance.' }
];

export function RiskManagementModal({ isOpen, onClose, sub, onUpdated }: any) {
    const [engineMode, setEngineMode] = useState(sub?.engine_mode === 'MULTIPLIER' ? 'FIXED_QTY' : (sub?.engine_mode || 'FIXED_QTY'));
    const [engineValue, setEngineValue] = useState(sub?.engine_value || 100);
    const [leverage, setLeverage] = useState(sub?.leverage_override || 1);
    const [drawdown, setDrawdown] = useState(sub?.drawdown_threshold || 15);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (sub) {
            setEngineMode(sub.engine_mode === 'MULTIPLIER' ? 'FIXED_QTY' : (sub.engine_mode || 'FIXED_QTY'));
            setEngineValue(sub.engine_value || 100);
            setLeverage(sub.leverage_override || 1);
            setDrawdown(sub.drawdown_threshold || 15);
        }
    }, [sub, isOpen]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/subscription/update-risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId: sub.id,
                    engineMode,
                    engineValue,
                    leverageOverride: leverage,
                    drawdownThreshold: drawdown
                })
            });

            if (!res.ok) throw new Error('Failed to synchronize risk protocol.');
            
            alert('Risk Protocol Synchronized with Institutional Cloud.');
            if (onUpdated) onUpdated();
            onClose();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const brokerType = sub?.broker_accounts?.broker_type || 'NONE';
    const isFutures = ['MT5', 'BINANCE_FUTURES', 'BYBIT', 'MEXC', 'BINGX'].includes(brokerType);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-mono"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#050505] border border-[#1A1A1A] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl rounded-lg"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black border border-[#1A1A1A] flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-[#FFD700]" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Investment Power Control</h3>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Configuring Secure Execution Link</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
                        {/* Mode Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">How much to trade?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {MODES.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setEngineMode(m.id)}
                                        className={`flex flex-col items-center justify-center p-6 border transition-all gap-3 ${engineMode === m.id ? 'bg-[#FFD700] border-[#FFD700] text-black' : 'bg-black border-[#1A1A1A] text-white/40 hover:border-white/20'}`}
                                    >
                                        <m.icon className="w-5 h-5" />
                                        <div className="text-center">
                                            <p className="text-[11px] font-black uppercase tracking-widest leading-none">{m.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Engine Value */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">{engineMode === 'FIXED_QTY' ? 'Trade Amount (USD)' : 'Portfolio Risk %'}</label>
                                <span className="text-xl font-black text-[#FFD700]">{engineValue}{engineMode === 'PCT_BALANCE' ? '%' : '$'}</span>
                            </div>
                            <input
                                type="range"
                                min={engineMode === 'FIXED_QTY' ? "10" : "0.5"}
                                max={engineMode === 'FIXED_QTY' ? "10000" : "100"}
                                step={engineMode === 'FIXED_QTY' ? "10" : "0.5"}
                                value={engineValue}
                                onChange={(e) => setEngineValue(parseFloat(e.target.value))}
                                className="w-full h-1 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                            />
                        </div>

                        {/* Leverage */}
                        {isFutures && (
                            <div className="space-y-4 pt-4 border-t border-[#1A1A1A]">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">Leverage Power (Multiplier)</label>
                                    <span className="text-xl font-black text-[#FFD700]">{leverage}X</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="125"
                                    step="1"
                                    value={leverage}
                                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                                    className="w-full h-1 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                />
                                <div className="flex justify-between text-[8px] text-white/20 font-black uppercase">
                                    <span>1x (Safe)</span>
                                    <span>50x (Medium)</span>
                                    <span>125x (Extreme)</span>
                                </div>
                            </div>
                        )}

                        {/* Auto Safety Stop */}
                        <div className="space-y-4 pt-4 border-t border-[#1A1A1A]">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">Auto-Safety Stop (Max Loss %)</label>
                                <span className="text-xl font-black text-red-500">{drawdown}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                step="1"
                                value={drawdown}
                                onChange={(e) => setDrawdown(parseFloat(e.target.value))}
                                className="w-full h-1 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            <p className="text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">
                                Strategy will auto-pause if account loss exceeds this threshold.
                            </p>
                        </div>

                        <div className="p-4 bg-black border border-[#1A1A1A] flex gap-3">
                            <Info className="w-4 h-4 text-[#FFD700] shrink-0" />
                            <p className="text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
                                <span className="text-white font-black">PRO TIP:</span> Higher leverage requires lower "Trade Amounts" to maintain institutional safety. Always synchronize before active trading.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-[#1A1A1A] bg-[#0D0D0D] flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-2 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black bg-[#FFD700] hover:bg-[#b0e600] transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Apply_Changes
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
