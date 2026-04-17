'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  ChevronRight,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TerminalLog from './TerminalLog';
import ActivationModal from './ActivationModal';
import AssetDiscoveryDrawer from './AssetDiscoveryDrawer';
import { StrategyCard } from './StrategyCard';

const SUPPORTED_BROKERS = [
  { id: 'MT5', name: 'MetaTrader 5', region: 'GLOBAL', icon: Globe },
  { id: 'BINANCE_FUTURES', name: 'Binance Futures', region: 'GLOBAL', icon: Zap },
  { id: 'BYBIT', name: 'Bybit V5', region: 'GLOBAL', icon: Zap },
  { id: 'MEXC', name: 'MEXC Global', region: 'GLOBAL', icon: Zap },
  { id: 'BINGX', name: 'BingX', region: 'GLOBAL', icon: Zap },
  { id: 'ZERODHA', name: 'Zerodha Kite', region: 'INDIA', icon: ShieldCheck },
  { id: 'ANGELONE', name: 'AngelOne SmartAPI', region: 'INDIA', icon: ShieldCheck },
  { id: 'DHAN', name: 'Dhan', region: 'INDIA', icon: ShieldCheck },
  { id: 'GROWW', name: 'Groww', region: 'INDIA', icon: ShieldCheck },
  { id: 'TRADINGVIEW_DEMO', name: 'TradingView Demo', region: 'GLOBAL', icon: Globe }
];

export default function VaultView({ typeFilter, timelineMode }: { typeFilter?: 'MT5_EA' | 'PINE_SCRIPT_WEBHOOK', timelineMode?: 'bots' | 'indicators' }) {
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [activating, setActivating] = useState(false);
  const [logs, setLogs] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState<'MT5_EA' | 'PINE_SCRIPT_WEBHOOK'>(typeFilter || 'MT5_EA');
  const [activationTarget, setActivationTarget] = useState<any>(null);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [managingSub, setManagingSub] = useState<any>(null);
  const [previewSymbol, setPreviewSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetchVault();
    const supabase = createClient();
    const channel = supabase.channel('vault-logs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscription_logs' }, (payload) => {
        const newLog = payload.new;
        setLogs(prev => {
            const subLogs = prev[newLog.subscription_id] || [];
            return { ...prev, [newLog.subscription_id]: [...subLogs, newLog].slice(-20) };
        });
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  const fetchVault = async () => {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: subData } = await supabase.from('user_strategies').select('*, strategy:strategies (*)').eq('user_id', user.id);
        const { data: ownData } = await supabase.from('strategies').select('*').eq('creator_id', user.id);

        const merged = [...(subData || [])];
        merged.forEach(m => { if (m.strategy.creator_id === user.id || m.strategy.origin === 'PERSONAL') m.is_proprietary = true; });

        if (ownData) {
            ownData.forEach(strategy => {
                if (!merged.find(m => m.strategy_id === strategy.id)) {
                    merged.push({ id: `own-${strategy.id}`, user_id: user.id, strategy_id: strategy.id, sync_active: false, engine_mode: 'MULTIPLIER', engine_value: 1.0, strategy, is_proprietary: true });
                }
            });
        }
        setStrategies(merged.filter(item => item.strategy.type === activeTab));
        setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const fetchLogs = async (subId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('subscription_logs').select('*').eq('subscription_id', subId).order('created_at', { ascending: true }).limit(20);
    if (data) setLogs(prev => ({ ...prev, [subId]: data }));
  };

  const linkBrokerAccount = async (brokerData: any, subscriptionId?: string, strategyIdSelf?: string) => {
    setActivating(true);
    try {
        let finalId = subscriptionId;
        if (!finalId && strategyIdSelf) {
            const res = await fetch(`/api/marketplace/${strategyIdSelf}/subscribe`, { method: 'POST' });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error);
            finalId = d.subscriptionId;
        }
        const res = await fetch('/api/broker/connect', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            subscriptionId: finalId, 
            brokerType: brokerData.brokerType, 
            accountId: brokerData.accountId, 
            apiKey: brokerData.apiKey, 
            apiSecret: brokerData.apiSecret, 
            activeAssets: brokerData.activeAssets || [] 
          }) 
        });

        if (res.ok) { 
          fetchVault(); 
          alert("Institutional Connection Established. Node Active."); 
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "Handshake failed.");
        }
    } catch (err: any) { 
      alert(`Handshake Error: ${err.message}`); 
    } finally { 
      setActivating(false); 
    }
  };

  const toggleSync = async (subId: string, current: boolean) => {
    await fetch('/api/subscription/toggle-sync', { method: 'POST', body: JSON.stringify({ subscriptionId: subId, active: !current }) });
    fetchVault();
  };

  const removeSubscription = async (id: string) => {
    if (confirm("Decommission Node?")) { await fetch(`/api/subscription/remove?id=${id}`, { method: 'DELETE' }); fetchVault(); }
  };

  if (loading) return <div className="p-40 text-center text-white/20 font-black uppercase italic animate-pulse">Synchronizing Secure Vault...</div>;

  return (
    <div className="space-y-16 pb-20">
      <div className="flex justify-between items-end px-1">
        <div className="space-y-4">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Institutional Mirroring <span className="text-[#FFD700]">Terminals</span></h2>
            {!typeFilter && (
                <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <button onClick={() => setActiveTab('MT5_EA')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MT5_EA' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'text-white/20 hover:text-white/40'}`}>MT5 Nodes</button>
                    <button onClick={() => setActiveTab('PINE_SCRIPT_WEBHOOK')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PINE_SCRIPT_WEBHOOK' ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/20' : 'text-white/20 hover:text-white/40'}`}>Indicator Bridges</button>
                </div>
            )}
        </div>
        <div className="px-6 py-2 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-full flex items-center gap-3 italic animate-pulse">
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">Managed Encryption Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {strategies.map((sub) => (
            <StrategyCard 
                key={sub.id} 
                sub={sub} 
                isOfficial={sub.strategy?.origin === 'OFFICIAL'} 
                setActivationTarget={setActivationTarget}
                toggleSync={toggleSync}
                removeSubscription={removeSubscription}
                previewSymbol={managingSub?.id === sub.id ? previewSymbol : null}
                onManageAssets={(s: any) => { setManagingSub(s); setPreviewSymbol(s.active_assets?.[0] || 'XAUUSD'); setIsAssetDrawerOpen(true); }}
                logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []}
                fetchLogs={fetchLogs}
            />
        ))}
      </div>

      {activeTab === 'PINE_SCRIPT_WEBHOOK' && (
        <div className="p-10 rounded-[48px] bg-[#00B0FF]/5 border border-[#00B0FF]/10 flex items-center gap-8 relative overflow-hidden group">
            <Globe className="w-16 h-16 text-[#00B0FF] opacity-20" />
            <div className="flex-1">
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Signal Expansion Hub</h4>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-loose font-sans italic">Connect your TradingView scripts directly to our zero-latency execution cluster.</p>
            </div>
            <button onClick={() => window.open('https://tradingview.com', '_blank')} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:text-[#00E676] transition-all"><ChevronRight className="w-6 h-6" /></button>
        </div>
      )}

      <div className="relative mt-8 md:mt-16 pt-2 pb-10">
         <div className="space-y-2 mb-6 ml-2">
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Live <span className="text-[#FFD700]">Terminal Monitoring</span></h3>
         </div>
         <div className="h-[400px]">
            <TerminalLog logs={Object.values(logs).flat()} />
         </div>
      </div>

      <ActivationModal 
        isOpen={!!activationTarget} 
        onClose={() => setActivationTarget(null)} 
        strategyName={activationTarget?.strategy?.name || ''} 
        strategyId={activationTarget?.strategy_id || ''} 
        supportedBrokers={SUPPORTED_BROKERS as any} 
        onActivate={async (d) => { const sId = activationTarget.id.startsWith('own-') ? activationTarget.strategy_id : undefined; await linkBrokerAccount(activationTarget.id.startsWith('own-') ? undefined : activationTarget.id, sId, d.activeAssets); }} 
      />
      <AssetDiscoveryDrawer 
        isOpen={isAssetDrawerOpen} 
        onClose={() => { setIsAssetDrawerOpen(false); setManagingSub(null); setPreviewSymbol(null); }} 
        brokerType={managingSub?.broker_accounts?.broker_type || 'MT5'} 
        selectedAssets={managingSub?.active_assets || []} 
        onAssetToggle={async (sym) => { 
            const isAdding = !managingSub?.active_assets?.includes(sym);
            const next = isAdding ? [...(managingSub?.active_assets || []), sym] : managingSub.active_assets.filter((as: any) => as !== sym);
            if (isAdding) setPreviewSymbol(sym);
            setStrategies(prev => prev.map(s => s.id === managingSub.id ? { ...s, active_assets: next }: s)); 
            setManagingSub((p: any) => ({ ...p, active_assets: next })); 
            const supabase = createClient(); 
            await supabase.from('user_strategies').update({ active_assets: next }).eq('id', managingSub.id); 
        }} 
        onPreviewSymbol={setPreviewSymbol} 
      />
    </div>
  );
}
