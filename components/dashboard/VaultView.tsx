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
  const [allMergedStats, setAllMergedStats] = useState<any[]>([]);
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
    const channel = supabase.channel('vault-logs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscription_logs' }, (payload: any) => {
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
            ownData.forEach((strategy: any) => {
                if (!merged.find((m: any) => m.strategy_id === strategy.id)) {
                    merged.push({ id: `own-${strategy.id}`, user_id: user.id, strategy_id: strategy.id, sync_active: false, engine_mode: 'MULTIPLIER', engine_value: 1.0, strategy, is_proprietary: true });
                }
            });
        }
        setAllMergedStats(merged);
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
    try {
        console.log(`[DECOMMISSION_DEBUG] Initiating removal for node: ${id}`);
        // Redundant confirm removed - handled by UI button
        
        const res = await fetch(`/api/subscription/remove?id=${encodeURIComponent(id)}`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await res.json();
        
        if (res.ok) {
            console.log(`[DECOMMISSION_DEBUG] Successfully removed node: ${id}`);
            await fetchVault();
            alert("Institutional Handshake Complete. Node successfully decommissioned.");
        } else {
            console.error('[DECOMMISSION_DEBUG] Server-side removal failure:', data.error);
            alert(`Decomission Failed: ${data.error || 'Unknown system error.'}`);
        }
    } catch (err: any) {
        console.error('[DECOMMISSION_DEBUG] Network or handshake failure:', err.message);
        alert('Institutional Link disruption. Please check your network connection.');
    }
  };

  if (loading) return <div className="p-40 text-center text-white/20 font-black uppercase animate-pulse">Synchronizing Secure Vault...</div>;

  return (
    <div className="space-y-12 pb-20 w-full max-w-none mx-auto">
      {/* VAULT HEADERS PURGED FOR V3 TERMINAL BLEED */}

      <div className="grid grid-cols-1 gap-10">
        {strategies.map((sub) => {
            const activeCount = allMergedStats.filter(s => s.sync_active).length;
            const isLocked = !sub.sync_active && activeCount >= 5;
            return (
                <StrategyCard 
                    key={sub.id} 
                    sub={sub} 
                    isOfficial={sub.strategy?.origin === 'OFFICIAL'} 
                    isLocked={isLocked}
                    setActivationTarget={setActivationTarget}
                    toggleSync={toggleSync}
                    removeSubscription={removeSubscription}
                    previewSymbol={managingSub?.id === sub.id ? previewSymbol : null}
                    onManageAssets={(s: any) => { setManagingSub(s); setPreviewSymbol(s.active_assets?.[0] || 'XAUUSD'); setIsAssetDrawerOpen(true); }}
                    logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []}
                    fetchLogs={fetchLogs}
                    fetchVault={fetchVault}
                />
            );
        })}
        {strategies.length === 0 && (
          <div className="py-32 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-6 bg-white/[0.01]">
             <div className="w-16 h-16 rounded-xl bg-white/[0.02] flex items-center justify-center">
                <Globe className="w-8 h-8 text-white/10" />
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono">No Active Terminals Detected</p>
           </div>
        )}
      </div>

      {activeTab === 'PINE_SCRIPT_WEBHOOK' && (
        <div className="p-10 rounded-2xl bg-[#00B0FF]/5 border border-[#00B0FF]/10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
            <div className="w-16 h-16 rounded-xl bg-[#00B0FF]/10 flex items-center justify-center shrink-0">
               <Globe className="w-8 h-8 text-[#00B0FF]" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tight [word-spacing:0.6rem] leading-none">Signal Expansion <span className="text-[#00B0FF]">Hub</span></h4>
                <p className="text-xs text-white/40 font-medium uppercase leading-relaxed max-w-2xl font-mono">Connect your external quant scripts directly to our zero-latency institutional execution cluster via the RSA Bridge.</p>
            </div>
            <button onClick={() => window.open('https://tradingview.com', '_blank')} className="px-8 py-4 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-[#00B0FF] hover:text-black transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-4">
               Initialize Bridge
               <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      )}

      <div className="relative mt-8 md:mt-16 space-y-6">
         <div className="px-2 flex items-center gap-4">
            <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.4em] font-mono">Sub-Space Monitoring</span>
            <div className="h-[1px] flex-1 bg-white/[0.03]" />
         </div>
         <div className="rounded-2xl overflow-hidden border border-white/[0.03]">
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
