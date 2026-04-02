'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Shield, 
  Users, 
  TrendingUp, 
  Activity, 
  Download, 
  CheckCircle2, 
  Info, 
  MessageSquare, 
  BookOpen,
  Loader2,
  ChevronRight,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import JourneyBar from '@/components/marketplace/JourneyBar';
import StrategyCard from '@/components/marketplace/StrategyCard'; // For the banner visual logic

export default function StrategyDetailPage({ params }: { params: { strategyId: string } }) {
  const router = useRouter();
  const { strategyId } = params;
  const [strategyData, setStrategyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Trade Log' | 'About' | 'Setup Guide' | 'Reviews'>('Trade Log');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/marketplace/${strategyId}`);
        const data = await res.json();
        setStrategyData(data);
        
        const revRes = await fetch(`/api/marketplace/${strategyId}/reviews`);
        const revData = await revRes.json();
        setReviews(revData);
        
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setLoading(false);
      }
    }
    fetchData();
  }, [strategyId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#FFD700]" />
      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Protocol Data...</span>
    </div>
  );

  if (!strategyData?.strategy) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h3 className="text-xl font-bold text-white/40">Strategy Not Found</h3>
      <button onClick={() => router.push('/dashboard/marketplace')} className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:underline underline-offset-8">Return to Marketplace</button>
    </div>
  );

  const { strategy, logs, reviewCount, avgRating, performanceByWeek } = strategyData;
  const creator = strategy.creator_profiles || {};

  return (
    <div className="space-y-6 pb-24">
      <JourneyBar currentStep={1} />

      <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/30 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* LEFT: INFO & TABS */}
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700]">
                    {strategy.type.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-white/40">
                    {strategy.symbol}
                </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{strategy.name}</h1>
            <p className="text-[12px] text-white/40 leading-relaxed max-w-2xl">{strategy.description}</p>
            
            {/* Creator Inline card */}
            <motion.div 
               whileHover={{ scale: 1.02 }}
               onClick={() => router.push(`/creator/${creator.handle}`)}
               className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer w-fit group"
            >
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-lg">
                    {creator.avatar_type === 'EMOJI' ? creator.avatar_data : '👤'}
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-black text-white">{creator.display_name}</span>
                        {creator.is_verified && <div className="p-0.5 rounded-full bg-[#FFD700] text-black"><CheckCircle2 className="w-2.5 h-2.5 fill-current" /></div>}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-wider">
                        <span>@{creator.handle}</span>
                        <span>•</span>
                        <span>{creator.total_subscribers} SUBSCRIBERS</span>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-2 group-hover:text-[#FFD700] transition-colors" />
            </motion.div>
          </section>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Win Rate', value: `${strategy.win_rate}%`, icon: TrendingUp, color: '#00E676' },
                { label: 'Total Trades', value: strategy.total_trades, icon: Activity, color: '#fff' },
                { label: 'Avg Gain', value: `+${strategy.avg_gain_pct}%`, icon: TrendingUp, color: '#00B0FF' },
                { label: 'Drawdown', value: `${strategy.max_drawdown_pct}%`, icon: Shield, color: '#FF4757' }
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center text-center gap-2">
                    <s.icon className="w-4 h-4 opacity-20 mb-1" />
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/20">{s.label}</span>
                    <span className="text-[18px] font-black" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
          </div>

          {/* TABS HEADER */}
          <div className="border-b border-white/5 flex gap-8">
            {(['Trade Log', 'About', 'Setup Guide', 'Reviews'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-widest relative transition-colors ${activeTab === tab ? 'text-[#FFD700]' : 'text-white/20 hover:text-white/40'}`}
                >
                    {tab}
                    {tab === 'Reviews' && reviewCount > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-[9px]">{reviewCount}</span>}
                    {activeTab === tab && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-[#FFD700]" />
                    )}
                </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="min-h-[200px]"
            >
                {activeTab === 'Trade Log' && (
                    <div className="space-y-6">
                        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.01]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/25">Trade Action</th>
                                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/25 text-center">Entry</th>
                                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/25 text-center">Exit</th>
                                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/25 text-right">P&L</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {logs.length > 0 ? logs.map((log: any, i: number) => (
                                        <tr key={log.id} className="hover:bg-white/[0.01]">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${log.action === 'BUY' ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-[#FF4757]/10 text-[#FF4757]'}`}>{log.action}</span>
                                                    <span className="text-[12px] font-bold text-white">{log.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center text-sm font-medium text-white/60">{log.entry_price || '-'}</td>
                                            <td className="p-4 text-center text-sm font-medium text-white/60">{log.exit_price || '-'}</td>
                                            <td className={`p-4 text-right text-sm font-bold ${log.pnl > 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                                                {log.pnl > 0 ? '+' : ''}{log.pnl_pct}%
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-10 text-center text-[11px] text-white/20 italic">No trade execution logs found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[10px] text-white/15 text-center font-bold tracking-widest uppercase italic">
                            All stats from live executed trades — not backtests
                        </p>
                    </div>
                )}

                {activeTab === 'Setup Guide' && (
                    <div className="space-y-6">
                        <section className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-[#FFD700]">
                                <Info className="w-4 h-4" />
                                Interactive Setup Steps
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { t: "Download Strategy File", d: "Get the executable file for MT5 or Pine Script code." },
                                    { t: "Configure Broker Webhook", d: "Connect your Zerodha or MT5 broker ID to enable auto-execution." },
                                    { t: "Enable Auto-Trading", d: "Toggle the 'Live Execution' switch in your dash to start mirroring signals." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-6 h-6 rounded-lg bg-[#FFD700]/10 flex items-center justify-center shrink-0 text-[#FFD700] text-[10px] font-black">{i+1}</div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-white mb-1">{step.t}</h4>
                                            <p className="text-[11px] text-white/30 leading-relaxed">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: BUY BOX */}
        <div className="relative">
          <aside className="lg:sticky lg:top-[120px] space-y-6">
            <div className="p-6 rounded-[32px] bg-gradient-to-br from-[#FFD700]/10 to-[#FF8C00]/[0.02] border border-[#FFD700]/20 shadow-[0_20px_50px_rgba(255,215,0,0.05)] backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#FFD700]/60">Monthly License</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-extrabold text-white tracking-tighter">₹{strategy.monthly_price_inr}</span>
                            <span className="text-xs font-bold text-white/30">/mo</span>
                        </div>
                    </div>
                    <div className="p-2 rounded-xl bg-black/20 border border-white/10">
                        <Download className="w-5 h-5 text-[#FFD700]" />
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    {[
                        "Instant .mq5 Strategy Download",
                        "Live Broker Webhook Access",
                        "Unlimited Auto-Execution",
                        "7-Day Satisfaction Refund"
                    ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-white/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                            {feat}
                        </div>
                    ))}
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/checkout?strategyId=${strategyId}`)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-black font-black uppercase tracking-widest text-[13px] shadow-[0_10px_30px_rgba(255,215,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,215,0,0.5)] transition-all mb-4"
                >
                    Subscribe Now
                </motion.button>
                <p className="text-center text-[10px] font-bold text-white/25 uppercase tracking-wide">Cancel anytime · SECURED PAYMENTS</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    Community Sentiment
                </h4>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-black text-white">{avgRating.toFixed(1)}</span>
                        <div className="flex gap-0.5 text-[#FFD700]">
                            {[1,2,3,4,5].map(i => <Star key={i} size={8} fill={i <= Math.round(avgRating) ? 'currentColor' : 'none'} />)}
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-white/40">
                            <span>REVIEWS</span>
                            <span>{reviewCount} RESPONSES</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FFD700]" style={{ width: `${(avgRating / 5) * 100}%` }} />
                        </div>
                    </div>
                </div>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
