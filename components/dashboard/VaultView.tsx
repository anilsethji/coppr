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
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TerminalLog from './TerminalLog';

export default function VaultView() {
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [brokerType, setBrokerType] = useState<'ZERODHA' | 'ANGELONE' | 'MT5'>('MT5');
  const [brokerData, setBrokerData] = useState({ accountId: '', apiKey: '', apiSecret: '' });
  const [activating, setActivating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchVault();

    // 1. Initialize Realtime Subscription
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
            // Keep only last 20 logs to avoid memory bloat
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

    // 1. Fetch user_strategies (subscriptions)
    const { data: subData } = await supabase
      .from('user_strategies')
      .select(`
        *,
        strategy:strategies (*)
      `)
      .eq('user_id', user.id);

    // 2. Fetch owned strategies (creator bypass)
    const { data: ownData } = await supabase
      .from('strategies')
      .select('*')
      .eq('creator_id', user.id);

    // 3. Merge and deduplicate
    const merged = [...(subData || [])];
    
    if (ownData) {
      ownData.forEach(strategy => {
        // Check if already in subData to avoid duplicates
        const exists = merged.find(m => m.strategy_id === strategy.id);
        if (!exists) {
          merged.push({
            id: `own-${strategy.id}`,
            user_id: user.id,
            strategy_id: strategy.id,
            sync_active: true, // Creators always have sync active for their own nodes
            strategy: strategy
          });
        }
      });
    }

    setStrategies(merged);
    
    // Fetch logs for all visible strategies
    merged.forEach(item => {
        // For owned strategies, we use the strategy_id for logs
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

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest">Scanning Secure Vault...</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <h2 className="text-3xl font-black text-white mb-2 italic">Signal Sync Vault</h2>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">DIRECT CLOUD MIRRORING INFRASTRUCTURE</p>
        </div>
        <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
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
                <p className="text-sm font-black text-white uppercase italic tracking-[0.1em]">No Active Subscriptions</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Enroll in a strategy to begin cloud syncing</p>
              </div>
              <button onClick={() => window.location.href = '/dashboard/marketplace'} className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl hover:scale-105 tracking-[0.2em]">Browse Global Grid</button>
          </div>
      ) : (
          <div className="space-y-10">
            {strategies.map((sub) => (
                <motion.div 
                    key={sub.id} 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0D121F] border border-white/5 rounded-[40px] overflow-hidden group hover:border-[#FFD700]/20 transition-all"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* LEFT: Strategy Control */}
                        <div className="p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                        <Zap className="w-7 h-7 text-[#FFD700]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white leading-tight">{sub.strategy.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase italic ${sub.strategy.execution_mode === 'COPPR_MANAGED' ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-white/40'}`}>
                                                {sub.strategy.execution_mode === 'COPPR_MANAGED' ? 'Coppr Managed' : 'Self Hosted'}
                                            </span>
                                            {sub.strategy.execution_mode === 'COPPR_MANAGED' && (
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase animate-pulse ${
                                                    sub.strategy.managed_node_status === 'RUNNING' ? 'bg-[#00E676]/20 text-[#00E676]' :
                                                    sub.strategy.managed_node_status === 'STARTING' ? 'bg-orange-500/20 text-orange-500' :
                                                    'bg-red-500/20 text-red-500'
                                                }`}>
                                                    {sub.strategy.managed_node_status || 'STOPPED'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Execution Engine</p>
                                    <div className="flex items-center gap-2">
                                         <Globe className={`w-3 h-3 ${sub.strategy.managed_node_status === 'RUNNING' ? 'text-[#00E676]' : 'text-white/20'}`} />
                                         <span className="text-[10px] font-bold text-white/80 uppercase">
                                             {sub.strategy.execution_mode === 'COPPR_MANAGED' ? 'Cloud Logic Active' : 'Local Terminal Only'}
                                         </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Authorization</p>
                                    <div className="flex items-center gap-2">
                                         <CheckCircle2 className={`w-3 h-3 ${sub.sync_active ? 'text-[#00E676]' : 'text-orange-500'}`} />
                                         <span className="text-[10px] font-bold text-white/80 uppercase">{sub.sync_active ? 'Broker Connected' : 'Handshake Awaited'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Broker Form Section */}
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#FFD700]/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${sub.sync_active ? 'bg-[#00E676] shadow-[0_0_8px_#00E676]' : 'bg-red-500'}`}></div>
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{sub.sync_active ? 'Managed Sync Active' : 'Execution Halted'}</span>
                                    </div>
                                    <button 
                                        onClick={() => toggleSync(sub.id, sub.sync_active)}
                                        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${sub.sync_active ? 'bg-[#00E676]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${sub.sync_active ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                {linkingId === sub.id ? (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 bg-black/40 p-5 rounded-3xl border border-white/5">
                                        <div className="flex gap-2 mb-2">
                                            {(['ZERODHA', 'ANGELONE', 'MT5'] as const).map(type => (
                                                <button key={type} onClick={() => setBrokerType(type)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${brokerType === type ? 'bg-[#FFD700] text-black' : 'bg-white/5 text-white/40 border border-white/5'}`}>{type}</button>
                                            ))}
                                        </div>
                                        <input type="text" placeholder="Broker ID (e.g. AB1234)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" value={brokerData.accountId} onChange={e => setBrokerData({...brokerData, accountId: e.target.value})} />
                                        {(brokerType === 'ZERODHA' || brokerType === 'ANGELONE') && (
                                            <>
                                                <input type="password" placeholder="Broker API Key" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" value={brokerData.apiKey} onChange={e => setBrokerData({...brokerData, apiKey: e.target.value})} />
                                                <input type="password" placeholder="Broker API Secret" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" value={brokerData.apiSecret} onChange={e => setBrokerData({...brokerData, apiSecret: e.target.value})} />
                                            </>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={() => setLinkingId(null)} className="px-4 py-3 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] rounded-xl flex-1">Cancel</button>
                                            <button onClick={() => linkBrokerAccount(sub.id)} disabled={activating} className="px-4 py-3 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-xl flex-[2] flex items-center justify-center gap-2">
                                                {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Connect Node</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <button onClick={() => setLinkingId(sub.id)} className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${sub.sync_active ? 'bg-white/5 border border-white/10 text-[#00E676]' : 'bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20'}`}>
                                        {sub.sync_active ? 'Connection Handshake Robust' : 'Initialize Broker sync'}
                                        {sub.sync_active ? <ShieldCheck className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                                    </button>
                                )}
                        </div>

                        {/* RIGHT: Live Feed Terminal */}
                        <div className="p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
                                    Propagation Terminal
                                </span>
                                <span className="text-[8px] font-mono text-white/20">Uptime: 99.9%</span>
                            </div>
                            <TerminalLog logs={logs[sub.id] || []} />
                            <div className="mt-6 flex justify-between items-center">
                                <div className="text-[9px] text-white/20 font-bold uppercase leading-relaxed max-w-[200px]">
                                    Trades are mirrored from the VPS Cloud Master to your linked broker API instantly.
                                </div>
                                <button onClick={() => fetchLogs(sub.id)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                    <Settings className="w-4 h-4 text-white/40" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
          </div>
      )}

      {/* Pine Script Leg Teaser */}
      <div className="p-8 rounded-[40px] bg-[#00B0FF]/5 border border-[#00B0FF]/20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-[#00B0FF]/10 flex items-center justify-center shrink-0">
                <Globe className="w-8 h-8 text-[#00B0FF]" />
            </div>
            <div className="flex-1 space-y-1">
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                    Coming Soon: Pine Script Webhook Bridge
                    <span className="text-[8px] bg-[#00B0FF] text-black px-1.5 py-0.5 rounded font-black">LEG 2</span>
                </h4>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-loose">
                    Soon you'll be able to link your TradingView Indicators directly. We are finalizing our webhook-to-broker fan-out infrastructure.
                </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
      </div>
    </div>
  );
}
