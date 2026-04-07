'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Zap, Lock, Info, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    brokerType: string;
    accountId: string;
}

export default function BrokerGuardian({ brokerType, accountId }: Props) {
    const [status, setStatus] = useState<'IDLE' | 'CHECKING' | 'PASS' | 'FAIL'>('IDLE');
    const [reports, setReports] = useState<any[]>([]);

    const runDiagnostic = async () => {
        setStatus('CHECKING');
        try {
            const response = await fetch('/api/broker/diagnostics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brokerType, accountId })
            });

            const data = await response.json();
            setReports(data.reports || []);
            setStatus(data.success ? 'PASS' : 'FAIL');
        } catch (err) {
            setStatus('FAIL');
            setReports([{ label: 'Connection Error', status: 'ERROR', message: 'Failed to reach diagnostic terminal.' }]);
        }
    };

    if (!['BINANCE_FUTURES', 'BYBIT', 'DHAN', 'MEXC', 'BINGX', 'GROWW'].includes(brokerType)) return null;

    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
                        <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Broker Guardian™</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none mt-1">Real-time Execution Diagnostic</p>
                    </div>
                </div>
                <button 
                    onClick={runDiagnostic}
                    disabled={status === 'CHECKING'}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all flex items-center gap-2"
                >
                    {status === 'CHECKING' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    Initialize Scan
                </button>
            </div>

            <AnimatePresence mode="wait">
                {status === 'IDLE' && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="p-4 rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-center"
                    >
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-relaxed">
                            Initialize scan to verify connectivity, permissions & account settings.
                        </p>
                    </motion.div>
                )}

                {(status === 'PASS' || status === 'FAIL' || status === 'CHECKING') && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        {reports.map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    {report.status === 'SUCCESS' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                    <span className="text-[11px] font-bold text-white/60 uppercase racking-wide">{report.label}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase ${report.status === 'SUCCESS' ? 'text-[#00E676]' : 'text-red-500'}`}>
                                    {report.status}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-start gap-3 p-4 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-2xl">
                <Info className="w-4 h-4 text-[#FFD700] mt-0.5" />
                <div className="space-y-1">
                    <p className="text-[10px] text-[#FFD700]/60 font-medium leading-relaxed italic">
                        {brokerType === 'BINANCE_FUTURES' && "**Binance Futures** requires **Hedge Mode** enabled and **Enable Futures** permissions checked."}
                        {brokerType === 'BYBIT' && "**Bybit V5** requires **Hedge Mode** enabled and **Unified Trading Account** verification."}
                        {brokerType === 'DHAN' && "**DhanHQ** requires a daily **Access Token** refresh for retail automated trading."}
                        {brokerType === 'MEXC' && "**MEXC Futures** requires **Hedge Mode** and a valid API Key with IP whitelisting."}
                        {brokerType === 'BINGX' && "**BingX** requires **Hedge Mode** and Perpetual Futures API permissions."}
                        {brokerType === 'GROWW' && "**Groww** requires a daily **Access Token** and a paid API subscription."}
                    </p>
                </div>
            </div>
        </div>
    );
}
