'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Wallet, ArrowUpRight, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function CreatorStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
        const res = await fetch('/api/creator/stats');
        const data = await res.json();
        setStats(data);
    } catch (err) {
        console.error('Failed to load creator stats');
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-white/5 text-[10px] font-black uppercase tracking-[0.2em]">Syncing Revenue Protocol...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group hover:border-[#FFD700]/30 transition-all"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-[#FFD700]/10 text-[#FFD700]">
                    <Wallet className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-black">20% Fee Applied</span>
                </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Total Net Earnings</span>
            <h4 className="text-3xl font-black text-white mt-1 italic">₹{stats?.totalEarned?.toLocaleString() || 0}</h4>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-white/30 uppercase italic">Pending Payout</span>
                 <span className="text-[11px] font-black text-[#FFD700]">₹{stats?.pendingPayout?.toLocaleString() || 0}</span>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group hover:border-[#00B0FF]/30 transition-all"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-[#00B0FF]/10 text-[#00B0FF]">
                    <Users className="w-6 h-6" />
                </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Active Strategy Nodes</span>
            <h4 className="text-3xl font-black text-white mt-1 italic">{stats?.activeSubs || 0}</h4>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-white/30 uppercase italic">Signal Uptime</span>
                 <span className="text-[11px] font-black text-[#00E676]">99.9%</span>
            </div>
        </motion.div>

        <div className="p-8 rounded-[40px] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <Zap className={`w-6 h-6 ${stats?.executionMode === 'COPPR_MANAGED' ? 'text-[#00E676]' : 'text-white/20'}`} />
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">
                    {stats?.executionMode === 'COPPR_MANAGED' ? 'Managed Node Active' : 'Self-Hosted Bridge'}
                </p>
                <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest leading-loose">
                    {stats?.executionMode === 'COPPR_MANAGED' 
                        ? 'Your EA is running on our high-performance VPS.' 
                        : 'Using default REST-bridge via your local terminal.'}
                </p>
             </div>
        </div>
    </div>
  );
}
