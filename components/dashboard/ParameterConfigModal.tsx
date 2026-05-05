'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_SCHEMA = [
  { key: 'takeProfit', label: 'Take Profit (Pts)', type: 'number', default: 15 },
  { key: 'stopLoss', label: 'Stop Loss (Pts)', type: 'number', default: 5 },
  { key: 'lotSize', label: 'Lot Size', type: 'number', default: 0.1 }
];

export function ParameterConfigModal({ isOpen, onClose, sub, onParametersUpdated }: any) {
    const [params, setParams] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [schema, setSchema] = useState<any[]>(DEFAULT_SCHEMA);

    useEffect(() => {
        if (isOpen && sub) {
            // Use the strategy's defined schema if available, otherwise fallback
            const botSchema = Array.isArray(sub.strategy?.ea_config) && sub.strategy.ea_config.length > 0
                ? sub.strategy.ea_config 
                : DEFAULT_SCHEMA;
            
            setSchema(botSchema);

            // Merge default values with user's customized parameters
            const initialParams: Record<string, any> = {};
            botSchema.forEach((field: any) => {
                initialParams[field.key] = field.default;
            });

            if (sub.user_parameters) {
                Object.keys(sub.user_parameters).forEach(key => {
                    initialParams[key] = sub.user_parameters[key];
                });
            }
            
            setParams(initialParams);
        }
    }, [isOpen, sub]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/subscription/parameters', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId: sub.id,
                    parameters: params
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert('Node configurations securely synchronized.');
            if (onParametersUpdated) onParametersUpdated();
            onClose();
        } catch (err: any) {
            console.error('Save error:', err);
            alert(`Synchronization failed: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#050505] border border-[#1A1A1A] w-full max-w-md overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black border border-[#1A1A1A] flex items-center justify-center">
                                <Settings2 className="w-5 h-5 text-[#FFD700]" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Node Settings</h3>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{sub?.strategy?.name || 'Unknown Node'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            {schema.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest block">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        value={params[field.key] || ''}
                                        onChange={(e) => setParams({
                                            ...params,
                                            [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                                        })}
                                        className="w-full bg-[#0A0A0A] border border-[#1A1A1A] p-3 text-white text-sm focus:border-[#FFD700] focus:outline-none transition-colors"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-black border border-[#1A1A1A] text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
                            <span className="text-[#FFD700] font-black mr-2">NOTICE:</span>
                            Applying custom parameters will override the master node's default risk configurations.
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-[#1A1A1A] bg-[#0D0D0D] flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 bg-transparent border border-[#1A1A1A] hover:bg-white/5 transition-colors"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black bg-[#FFD700] hover:bg-[#b0e600] transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Synchronize
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
