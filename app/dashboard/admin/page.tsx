'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle,
  Bot,
  Zap,
  Globe,
  Loader2,
  Trash2,
  FileCode
} from 'lucide-react';

export default function AdminConsole() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [economy, setEconomy] = useState({ 
    gross: 0, 
    fees: 0, 
    payouts: 0,
    activeSubscribers: 0
  });

  useEffect(() => {
    fetchPending();
    fetchEconomy();
  }, []);

  const fetchEconomy = async () => {
    // In a real app, this would be a secure Admin API
    // Mocking the aggregation for this high-fidelity UI demonstration
    setEconomy({
        gross: 48950,
        fees: 9790,
        payouts: 39160,
        activeSubscribers: 124
    });
  };

  const fetchPending = async () => {
    try {
        const res = await fetch('/api/admin/strategies/list');
        const data = await res.json();
        setPending(data.strategies || []);
    } catch (err) {
        console.error('Failed to load pending queue');
    } finally {
        setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(id);
    try {
        const res = await fetch('/api/admin/strategies/list', { // Using same file for simplicity (POST to list)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action })
        });
        if (res.ok) {
            setPending(prev => prev.filter(s => s.id !== id));
        }
    } catch (err) {
        console.error('Action failed');
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest">Initialising Admin Protocol...</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <h2 className="text-3xl font-black text-white mb-2 italic">Strategy Review Console</h2>
            <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-[0.2em]">{pending.length} Submissions Awaiting Clearance</p>
        </div>
        <div className="px-6 py-2 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-full flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
             <span className="text-[10px] font-black text-white/60 uppercase">Administrative Authority Verified</span>
        </div>
      </div>

      {/* Network Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: 'Gross Network Volume', value: `₹${economy.gross.toLocaleString()}`, icon: Zap, color: '#FFD700' },
                { label: 'Accumulated Platform Fees', value: `₹${economy.fees.toLocaleString()}`, icon: ShieldCheck, color: '#00E676' },
                { label: 'Pending Payout Liabilities', value: `₹${economy.payouts.toLocaleString()}`, icon: Clock, color: '#00B0FF' },
                { label: 'Active Strategy Nodes', value: economy.activeSubscribers, icon: Globe, color: '#9C27B0' }
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 mb-4" style={{ color: stat.color }}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</span>
                    <h4 className="text-xl font-black text-white">{stat.value}</h4>
                </div>
            ))}
      </div>

      {pending.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-[#00E676]/5 rounded-full flex items-center justify-center mx-auto border border-[#00E676]/10">
                  <CheckCircle2 className="w-8 h-8 text-[#00E676]" />
            </div>
            <div className="space-y-2">
                <p className="text-sm font-black text-white uppercase italic">Protocol Idle</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No pending strategies in the queue</p>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
             <AnimatePresence>
                {pending.map((strat) => (
                    <motion.div 
                        key={strat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden group hover:border-[#FFD700]/30 transition-all flex flex-col md:flex-row"
                    >
                        <div className="p-8 flex-1 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-white/40">
                                         {strat.type === 'MT5_EA' ? <Bot className="w-8 h-8" /> : <FileCode className="w-8 h-8" />}
                                     </div>
                                     <div>
                                         <h3 className="text-xl font-black text-white">{strat.name}</h3>
                                         <div className="flex items-center gap-3 mt-1">
                                             <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest">@{strat.creator_profiles?.handle}</span>
                                             <span className="w-1 h-1 rounded-full bg-white/10" />
                                             <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{strat.symbol} | {strat.timeframe}</span>
                                         </div>
                                     </div>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                     <Clock className="w-3 h-3 text-[#FFD700]" />
                                     <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Awaiting Verification</span>
                                </div>
                            </div>

                            <p className="text-xs text-white/40 font-bold uppercase tracking-wide leading-relaxed max-w-2xl">
                                {strat.description || 'No strategy description provided by creator.'}
                            </p>

                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                                     <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Type:</span>
                                     <span className="text-[9px] font-black text-white/80 uppercase">{strat.type}</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                                     <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Handshake:</span>
                                     <span className="text-[9px] font-black text-white/80 uppercase">{strat.mode}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.03] border-l border-white/5 p-8 flex flex-col justify-center gap-4 min-w-[240px]">
                            <button 
                                onClick={() => handleAction(strat.id, 'APPROVE')}
                                disabled={!!processingId}
                                className="w-full py-4 rounded-2xl bg-[#00E676] text-black font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#00E676]/10 flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                            >
                                {processingId === strat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve Listing</>}
                            </button>
                            <button 
                                onClick={() => handleAction(strat.id, 'REJECT')}
                                disabled={!!processingId}
                                className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4" /> Reject Submission
                            </button>
                            <button className="w-full py-2 text-[8px] font-black uppercase text-white/20 hover:text-white transition-colors tracking-widest flex items-center justify-center gap-2">
                                <ExternalLink className="w-3 h-3" /> View Setup Docs
                            </button>
                        </div>
                    </motion.div>
                ))}
             </AnimatePresence>
        </div>
      )}

      {/* Admin Disclaimer */}
      <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-8 h-8 text-white/10" />
            </div>
            <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Safety Protocol</h4>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-loose">
                    BY APPROVING A STRATEGY, YOU ARE WHITELISTING IT FOR GLOBAL DISTRIBUTION. 
                    ENSURE THE .EX5 BINARY IS CLEAN AND THE PINE SCRIPT LOGIC IS REASONABLY ACCURATE. 
                    COPPR ACCEPTS NO LIABILITY FOR UNVERIFIED ALGORITHMS.
                </p>
            </div>
      </div>
    </div>
  );
}
