'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Settings, 
  Bot, 
  Zap,
  Globe,
  Lock,
  PlusCircle,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  ChevronRight,
  LayoutGrid,
  Activity
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TerminalLog from './TerminalLog';
import ManagedNodeMonitor from './ManagedNodeMonitor';

export default function VaultView() {
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [brokerType, setBrokerType] = useState<'ZERODHA' | 'ANGELONE' | 'MT5'>('MT5');
  const [brokerData, setBrokerData] = useState({ accountId: '', apiKey: '', apiSecret: '' });
  const [activating, setActivating] = useState(false);
  const [logs, setLogs] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchVault();

    const supabase = createClient();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'subscription_logs',
        },
        (payload) => {
          const newLog = payload.new;
          setLogs(prev => {
            const subLogs = prev[newLog.subscription_id] || [];
            const updatedLogs = [...subLogs, newLog].slice(-20);
            return {
              ...prev,
              [newLog.subscription_id]: updatedLogs
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVault = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: subData } = await supabase
      .from('user_strategies')
      .select(`
        *,
        strategy:strategies (*)
      `)
      .eq('user_id', user.id);

    const { data: ownData } = await supabase
      .from('strategies')
      .select('*')
      .eq('creator_id', user.id);

    const merged = [...(subData || [])];
    
    if (ownData) {
      ownData.forEach(strategy => {
        const exists = merged.find(m => m.strategy_id === strategy.id);
        if (!exists) {
          merged.push({
            id: `own-${strategy.id}`,
            user_id: user.id,
            strategy_id: strategy.id,
            sync_active: true,
            strategy: strategy
          });
        }
      });
    }

    setStrategies(merged);
    
    merged.forEach(item => {
        const logId = item.id.startsWith('own-') ? item.strategy_id : item.id;
        fetchLogs(logId);
    });
    
    setLoading(false);
  };

  const fetchLogs = async (subId: string) => {
    const supabase = createClient();
    const { data } = await supabase
        .from('subscription_logs')
        .select('*')
        .eq('subscription_id', subId)
        .order('created_at', { ascending: true })
        .limit(20);
    
    if (data) {
        setLogs(prev => ({ ...prev, [subId]: data }));
    }
  };

  const linkBrokerAccount = async (subscriptionId: string) => {
    if (!brokerData.accountId) return;
    setActivating(true);
    try {
        const res = await fetch('/api/broker/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subscriptionId, 
                brokerType, 
                accountId: brokerData.accountId,
                apiKey: brokerData.apiKey,
                apiSecret: brokerData.apiSecret
            })
        });
        if (res.ok) {
            setLinkingId(null);
            setBrokerData({ accountId: '', apiKey: '', apiSecret: '' });
            fetchVault();
        }
    } catch (err) {
        console.error('Connection failed');
    } finally {
        setActivating(false);
    }
  };

  const toggleSync = async (subscriptionId: string, currentStatus: boolean) => {
    try {
        const res = await fetch('/api/subscription/toggle-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionId, active: !currentStatus })
        });
        if (res.ok) {
            fetchVault();
        }
    } catch (err) {
        console.error('Toggle failed');
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest italic">Synchronizing Secure Vault...</div>;

  const officialBots = strategies.filter(s => s.strategy.is_official || s.strategy.name.toLowerCase().includes('coppr') || s.strategy.creator_id === '00000000-0000-0000-0000-000000000000');
  const marketplaceBots = strategies.filter(s => !officialBots.includes(s));

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
            <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">Signal Sync Vault</h2>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">DIRECT CLOUD MIRRORING INFRASTRUCTURE</p>
        </div>
        <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 italic">
             <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
             <span className="text-[10px] font-black text-white/60 uppercase">Managed End-to-End Encryption</span>
        </div>
      </div>

      {strategies.length === 0 ? (
          <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] p-20 text-center space-y-8">
              <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto border border-white/10">
                    <Lock className="w-8 h-8 text-white/10" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-white uppercase italic tracking-[0.1em]">No Active Alphas Detected</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Connect to the Coppr Grid to begin cloud mirroring</p>
              </div>
              <button 
                onClick={() => window.location.href = '/dashboard/marketplace'} 
                className="px-10 py-4 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-2xl hover:scale-105 transition-all tracking-[0.2em] shadow-xl shadow-[#FFD700]/10"
              >
                Browse Official Alphas
              </button>
          </div>
      ) : (
          <div className="space-y-20">
            {/* 1. COPPR OFFICIAL HUB */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-[#FFD700]/10 pb-6 px-2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center border border-[#FFD700]/20">
                       <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Official <span className="text-[#FFD700]">High-Performance</span> Hub</h3>
                 </div>
                 <span className="text-[10px] font-black text-[#FFD700]/60 uppercase tracking-[0.2em] font-sans italic">Priority Execution</span>
              </div>

              <div className="space-y-8">
                {officialBots.map((sub) => (
                    <StrategyCard 
                        key={sub.id} 
                        sub={sub} 
                        isOfficial={true} 
                        linkingId={linkingId} 
                        setLinkingId={setLinkingId} 
                        toggleSync={toggleSync} 
                        brokerType={brokerType} 
                        setBrokerType={setBrokerType} 
                        brokerData={brokerData} 
                        setBrokerData={setBrokerData} 
                        activating={activating} 
                        linkBrokerAccount={linkBrokerAccount} 
                        logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []} 
                        fetchLogs={fetchLogs} 
                    />
                ))}
                {officialBots.length === 0 && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 bg-gradient-to-r from-[#FFD700]/5 to-transparent border border-[#FFD700]/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group"
                   >
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" />
                      <div className="flex items-center gap-8 relative z-10">
                         <div className="w-16 h-16 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center border border-[#FFD700]/20 group-hover:scale-105 transition-transform">
                            <Bot className="w-8 h-8 text-[#FFD700]" />
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-white uppercase italic tracking-widest leading-none mb-2">Coppr Labs: Official Upgrade</h4>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.1em] font-sans italic">Proprietary logic optimized for 99.9% heartbeat reliability and low-latency execution.</p>
                         </div>
                      </div>
                      <Link href="/dashboard/marketplace" className="px-8 py-4 bg-[#FFD700] text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 relative z-10">Explore Alphas</Link>
                   </motion.div>
                )}
              </div>
            </div>

            {/* 2. MARKETPLACE STRATEGIES */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 px-2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                       <LayoutGrid className="w-6 h-6 text-white/40" />
                    </div>
                    <h3 className="text-xl font-black text-white/40 uppercase italic tracking-tighter leading-none">Community <span className="text-white/20">Marketplace</span> Mirrored</h3>
                 </div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-sans italic">Third-Party Alphas</span>
              </div>

              <div className="space-y-8">
                {marketplaceBots.map((sub) => (
                    <StrategyCard 
                        key={sub.id} 
                        sub={sub} 
                        isOfficial={false} 
                        linkingId={linkingId} 
                        setLinkingId={setLinkingId} 
                        toggleSync={toggleSync} 
                        brokerType={brokerType} 
                        setBrokerType={setBrokerType} 
                        brokerData={brokerData} 
                        setBrokerData={setBrokerData} 
                        activating={activating} 
                        linkBrokerAccount={linkBrokerAccount} 
                        logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []} 
                        fetchLogs={fetchLogs} 
                    />
                ))}
              </div>
            </div>
          </div>
      )}

      {/* Pine Script Leg Teaser */}
      <div className="p-10 rounded-[48px] bg-[#00B0FF]/5 border border-[#00B0FF]/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00B0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-[28px] bg-[#00B0FF]/10 flex items-center justify-center shrink-0 border border-[#00B0FF]/20 group-hover:scale-105 transition-transform">
                <Globe className="w-8 h-8 text-[#00B0FF]" />
            </div>
            <div className="flex-1 space-y-2 relative z-10">
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                    Signal Fan-Out Infrastructure
                    <span className="text-[9px] bg-[#00B0FF] text-black px-2 py-0.5 rounded font-black uppercase">Phase 2</span>
                </h4>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-loose font-sans italic">
                    We are finalizing our high-performance webhook bridge. Soon you'll be able to link TradingView indicators directly to our broker network.
                </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:text-[#00B0FF] transition-colors relative z-10">
                <ChevronRight className="w-6 h-6" />
            </div>
      </div>
    </div>
  );
}

function StrategyCard({ sub, isOfficial, linkingId, setLinkingId, toggleSync, brokerType, setBrokerType, brokerData, setBrokerData, activating, linkBrokerAccount, logs, fetchLogs }: any) {
    const logId = sub.id.startsWith('own-') ? sub.strategy_id : sub.id;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[#0D121F]/60 border rounded-[48px] overflow-hidden group transition-all duration-700 hover:scale-[1.005] ${isOfficial ? 'border-[#FFD700]/20 hover:border-[#FFD700]/40 shadow-2xl shadow-[#FFD700]/5' : 'border-white/5 hover:border-white/10'}`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 relative overflow-hidden">
                    {isOfficial && (
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FFD700]/5 blur-[100px] pointer-events-none" />
                    )}
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center border transition-all ${isOfficial ? 'bg-[#FFD700]/10 border-[#FFD700]/20 group-hover:scale-105' : 'bg-white/5 border-white/5'}`}>
                                <Zap className={`w-8 h-8 ${isOfficial ? 'text-[#FFD700]' : 'text-white/20'}`} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase italic leading-none tracking-tighter mb-2">{sub.strategy.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase font-sans tracking-widest ${isOfficial ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/10' : 'bg-white/10 text-white/40'}`}>
                                        {isOfficial ? 'Coppr Official Alpha' : 'Community Mirror'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {sub.strategy.execution_mode === 'COPPR_MANAGED' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Proprietary Fiber Node Heartbeat</span>
                                <span className="text-[8px] font-black text-[#00E676]/60 uppercase tracking-widest font-sans animate-pulse">Synchronized</span>
                            </div>
                            <ManagedNodeMonitor strategyId={sub.strategy_id} isCreator={false} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest font-sans italic">Infrastructure</p>
                            <div className="flex items-center gap-3">
                                    <Globe className={`w-4 h-4 ${sub.strategy.managed_node_status === 'RUNNING' ? 'text-[#00E676]' : 'text-white/20'}`} />
                                    <span className="text-[11px] font-black text-white/80 uppercase italic tracking-widest leading-none">
                                        {isOfficial ? 'Direct Fiber' : sub.strategy.execution_mode === 'COPPR_MANAGED' ? 'Managed Cloud' : 'Self Hosted'}
                                    </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest font-sans italic">Handshake</p>
                            <div className="flex items-center gap-3">
                                    <CheckCircle2 className={`w-4 h-4 ${sub.sync_active ? 'text-[#00E676]' : 'text-[#FFD700]/40'}`} />
                                    <span className="text-[11px] font-black text-white/80 uppercase italic tracking-widest leading-none">
                                        {sub.sync_active ? 'Mirror Active' : 'Waiting Link'}
                                    </span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center justify-between p-5 rounded-[24px] border transition-all ${isOfficial && sub.sync_active ? 'bg-[#FFD700]/5 border-[#FFD700]/20' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-2.5 h-2.5 rounded-full ${sub.sync_active ? 'bg-[#00E676] shadow-[0_0_12px_#00E676]' : 'bg-red-500'}`}></div>
                            <span className="text-[11px] font-black text-white/60 uppercase tracking-widest font-sans italic">{sub.sync_active ? 'Mirror Operational' : 'Node Halted'}</span>
                        </div>
                        <button 
                            onClick={() => toggleSync(sub.id, sub.sync_active)}
                            className={`relative w-12 h-6 rounded-full transition-all duration-500 ${sub.sync_active ? 'bg-[#00E676]' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${sub.sync_active ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {linkingId === sub.id ? (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 bg-black/40 p-6 rounded-[32px] border border-white/5">
                            <div className="flex gap-2">
                                {(['ZERODHA', 'ANGELONE', 'MT5'] as const).map(type => (
                                    <button key={type} onClick={() => setBrokerType(type)} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase ${brokerType === type ? 'bg-[#FFD700] text-black' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}>{type}</button>
                                ))}
                            </div>
                            <input type="text" placeholder="Account ID (Private)" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" value={brokerData.accountId} onChange={e => setBrokerData({...brokerData, accountId: e.target.value})} />
                            {(brokerType === 'ZERODHA' || brokerType === 'ANGELONE') && (
                                <>
                                    <input type="password" placeholder="API Key" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" value={brokerData.apiKey} onChange={e => setBrokerData({...brokerData, apiKey: e.target.value})} />
                                    <input type="password" placeholder="API Secret" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" value={brokerData.apiSecret} onChange={e => setBrokerData({...brokerData, apiSecret: e.target.value})} />
                                </>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setLinkingId(null)} className="px-6 py-4 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] rounded-2xl flex-1 hover:bg-white/10 transition-all font-sans italic">Cancel</button>
                                <button onClick={() => linkBrokerAccount(sub.id)} disabled={activating} className="px-6 py-4 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-2xl flex-[2] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-[#FFD700]/10 font-sans italic">
                                    {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-5 h-5" /> Initialize Linking</>}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <button 
                            onClick={() => setLinkingId(sub.id)} 
                            className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all duration-500 italic ${sub.sync_active ? 'bg-white/5 border border-white/10 text-[#00E676] hover:bg-white/10' : 'bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 hover:scale-[1.02]'}`}
                        >
                            {sub.sync_active ? 'Connection Optimized' : 'Initialize High-Performance Link'}
                            {sub.sync_active ? <ShieldCheck className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                <div className="p-10 flex flex-col justify-between bg-black/40 relative">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-3 font-sans italic">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isOfficial ? 'bg-[#FFD700]' : 'bg-[#00E676]'}`}></span>
                            Mirror Propagation Terminal
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-[11px] font-black text-[#00E676]/40 uppercase tracking-widest font-sans italic animate-pulse">Live</span>
                            <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Latency: 24ms</span>
                        </div>
                    </div>
                    <TerminalLog logs={logs} />
                    <div className="mt-8 flex justify-between items-center px-1">
                        <div className={`text-[10px] font-black uppercase tracking-widest leading-loose max-w-[280px] font-sans italic ${isOfficial ? 'text-[#FFD700]/40' : 'text-white/20'}`}>
                            {isOfficial ? 'Elite Enterprise Hub: Mirrored via Coppr Proprietary High-Performance Fiber Network.' : 'Marketplace Alpha: Mirror propagated via standard virtual hosting nodes.'}
                        </div>
                        <button onClick={() => fetchLogs(logId)} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/btn">
                            <Settings className="w-5 h-5 text-white/30 group-hover/btn:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
