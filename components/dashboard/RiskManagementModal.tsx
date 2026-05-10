'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Save, Loader2, Info, Percent, Layers, Gauge } from 'lucide-react';

const MODES = [
    { id: 'MULTIPLIER', label: 'Signal Scaler', icon: Gauge, tip: 'Multiplies the master lot size (e.g., 2.0 = double risk).' },
    { id: 'FIXED_QTY', label: 'Static Units', icon: Layers, tip: 'Ignores master size and always trades this exact quantity.' },
    { id: 'PCT_BALANCE', label: 'Capital %', icon: Percent, tip: 'Risks a fixed % of your current balance per trade.' }
];

export function RiskManagementModal({ isOpen, onClose, sub, onUpdated }: any) {
    const [engineMode, setEngineMode] = useState(sub?.engine_mode || 'MULTIPLIER');
    const [engineValue, setEngineValue] = useState(sub?.engine_value || 1.0);
    const [leverage, setLeverage] = useState(sub?.leverage_override || 1);
    const [drawdown, setDrawdown] = useState(sub?.drawdown_threshold || 50.0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (sub) {
            setEngineMode(sub.engine_mode || 'MULTIPLIER');
            setEngineValue(sub.engine_value || 1.0);
            setLeverage(sub.leverage_override || 1);
            setDrawdown(sub.drawdown_threshold || 50.0);
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
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Institutional Risk Protocol</h3>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Sub_ID: {sub?.id?.slice(0, 8)}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                        {/* Mode Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">Execution Mode</label>
                            <div className="grid grid-cols-1 gap-2">
                                {MODES.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setEngineMode(m.id)}
                                        className={`flex items-center justify-between p-4 border transition-all ${engineMode === m.id ? 'bg-[#FFD700] border-[#FFD700] text-black' : 'bg-black border-[#1A1A1A] text-white/40 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center gap-3 text-left">
                                            <m.icon className="w-4 h-4" />
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-widest leading-none">{m.label}</p>
                                                <p className={`text-[9px] mt-1 ${engineMode === m.id ? 'text-black/60' : 'text-white/20'}`}>{m.tip}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Engine Value */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">Execution Value</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={engineValue}
                                    onChange={(e) => setEngineValue(parseFloat(e.target.value))}
                                    className="w-full bg-black border border-[#1A1A1A] p-4 text-white font-mono focus:border-[#FFD700] outline-none transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 uppercase">Units_Scale</span>
                            </div>
                        </div>

                        {/* Leverage & Drawdown */}
                        <div className="grid grid-cols-2 gap-6">
                            {isFutures && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">Leverage_Multiplier</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={leverage}
                                            min="1"
                                            max="125"
                                            onChange={(e) => setLeverage(parseInt(e.target.value))}
                                            className="w-full bg-black border border-[#1A1A1A] p-4 text-[#FFD700] font-mono focus:border-[#FFD700] outline-none transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-black">X</span>
                                    </div>
                                </div>
                            )}
                            <div className={isFutures ? 'space-y-2' : 'col-span-2 space-y-2'}>
                                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">Kill_Switch (Max DD %)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={drawdown}
                                        min="1"
                                        max="100"
                                        onChange={(e) => setDrawdown(parseFloat(e.target.value))}
                                        className="w-full bg-black border border-[#1A1A1A] p-4 text-red-500 font-mono focus:border-red-500 outline-none transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-black">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-black border border-[#1A1A1A] flex gap-3">
                            <Info className="w-4 h-4 text-[#FFD700] shrink-0" />
                            <p className="text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
                                <span className="text-white font-black">REGULATORY_NOTICE:</span> High leverage increases liquidaton risk. The Kill-Switch will automatically pause your strategy if account drawdown exceeds the threshold.
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
                            Sync_Protocol
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
