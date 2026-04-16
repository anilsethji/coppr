'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  Activity,
  BarChart3,
  Trash2,
  LineChart,
  Terminal as Code,
  Target,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TerminalLog from './TerminalLog';
import { AstralTerminalWelcome } from './AstralTerminalWelcome';

const SignalVisualizer = dynamic(() => import('./SignalVisualizer').then(m => m.SignalVisualizer), { 
    ssr: false,
    loading: () => <div className="h-[300px] md:h-[500px] flex items-center justify-center bg-black/20 rounded-3xl border border-white/5 animate-pulse"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>
});

import ManagedNodeMonitor from './ManagedNodeMonitor';
import QuickStartJourney from './QuickStartJourney';
import BrokerGuardian from './BrokerGuardian';
import ActivationModal from './ActivationModal';
import AssetDiscoveryDrawer from './AssetDiscoveryDrawer';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sub: any;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
}

const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose, sub, copyToClipboard, copiedText }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#0D121F] border border-[#00B0FF]/30 rounded-[40px] shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00B0FF]/10 rounded-xl">
                <Globe className="w-6 h-6 text-[#00B0FF]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Signal Integration</h3>
                <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Institutional Access Protocol</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all group">
              <X className="w-5 h-5 text-white/20 group-hover:text-white" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-bold text-[#00B0FF] uppercase tracking-wider">Webhook Mirror URL</p>
                <button 
                  onClick={() => copyToClipboard(`http://localhost:3000/api/license/signal?key=${sub.strategy.master_signal_key}`, 'URL')}
                  className="text-[9px] font-black text-[#00B0FF] uppercase hover:underline"
                >
                  {copiedText === 'URL' ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <div className="p-4 bg-black/60 rounded-2xl border border-white/5 font-mono text-[10px] text-white/60 break-all leading-relaxed select-all">
                {`http://localhost:3000/api/license/signal?key=${sub.strategy.master_signal_key}`}
              </div>
              <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest text-center italic">Point your Pine Script OR Expert Advisor alerts to this endpoint</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-2">Ready-to-Mirror Templates</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Standard Unit (1.0)', symbol: 'BTCUSD', qty: 1 },
                  { name: 'Micro Scalp (0.01)', symbol: 'XAUUSD', qty: 0.1 }
                ].map(tmplt => (
                  <div key={tmplt.name} className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between group/tmplt hover:bg-white/[0.08] transition-all">
                    <div>
                      <p className="text-[10px] font-black text-white/60 uppercase italic mb-1">{tmplt.name}</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">JSON Handshake Message</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(`{ "action": "{{strategy.order.action}}", "symbol": "${tmplt.symbol}", "quantity": ${tmplt.qty}, "order_type": "MARKET" }`, tmplt.name)}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:bg-[#00B0FF] hover:border-[#00B0FF] transition-all"
                    >
                      {copiedText === tmplt.name ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-black/40 border-t border-white/5">
            <button 
              onClick={onClose}
              className="w-full py-5 bg-[#00B0FF] text-black rounded-2xl text-[11px] font-black uppercase italic tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#00B0FF]/10"
            >
              Close Bridge Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SUPPORTED_BROKERS = [
  { id: 'MT5', name: 'MetaTrader 5', region: 'GLOBAL', icon: Globe },
  { id: 'BINANCE_FUTURES', name: 'Binance Futures', region: 'GLOBAL', icon: Zap },
  { id: 'BYBIT', name: 'Bybit V5', region: 'GLOBAL', icon: Zap },
  { id: 'MEXC', name: 'MEXC Global', region: 'GLOBAL', icon: Globe },
  { id: 'BINGX', name: 'BingX Pro', region: 'GLOBAL', icon: Zap },
  { id: 'ZERODHA', name: 'Zerodha Kite', region: 'INDIA', icon: ShieldCheck },
  { id: 'ANGELONE', name: 'AngelOne', region: 'INDIA', icon: ShieldCheck },
  { id: 'DHAN', name: 'DhanHQ', region: 'INDIA', icon: Zap },
  { id: 'GROWW', name: 'Groww', region: 'INDIA', icon: ShieldCheck },
  { id: 'TRADINGVIEW_DEMO', name: 'TradingView Demo', region: 'GLOBAL', icon: Zap },
];

const RETAIL_JARGON: Record<string, { label: string; tip: string }> = {
  FIXED_QTY: { 
    label: 'Static Units', 
    tip: 'Trade an exact size (e.g. 0.1 lots) every time, ignoring the master signal size.' 
  },
  MULTIPLIER: { 
    label: 'Signal Scaler', 
    tip: 'Scale the master signal (e.g. 2x triples the risk, 0.5x reduces it by half).' 
  },
  PCT_BALANCE: { 
    label: 'Capital Allotment', 
    tip: 'Designate a specific percentage of your balance to be risked per signal.' 
  }
};

export default function VaultView({ typeFilter, timelineMode }: { typeFilter?: 'MT5_EA' | 'PINE_SCRIPT_WEBHOOK', timelineMode?: 'bots' | 'indicators' }) {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [brokerType, setBrokerType] = useState<'ZERODHA' | 'ANGELONE' | 'MT5' | 'BINANCE_FUTURES' | 'BYBIT' | 'DHAN' | 'MEXC' | 'BINGX' | 'GROWW' | 'TRADINGVIEW_DEMO'>('MT5');
  const [brokerData, setBrokerData] = useState({ 
    accountId: '', 
    apiKey: '', 
    apiSecret: '',
    meta: {} as Record<string, string>
  });
  const [activating, setActivating] = useState(false);
  const [globalLegalAccepted, setGlobalLegalAccepted] = useState(false);
  const [logs, setLogs] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState<'MT5_EA' | 'PINE_SCRIPT_WEBHOOK'>(typeFilter || 'MT5_EA');
  const [activationTarget, setActivationTarget] = useState<any>(null);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [managingSub, setManagingSub] = useState<any>(null);
  const [previewSymbol, setPreviewSymbol] = useState<string | null>(null);

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
  }, [activeTab]);

  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [riskData, setRiskData] = useState({ 
    engineMode: 'MULTIPLIER' as 'FIXED_QTY' | 'MULTIPLIER' | 'PCT_BALANCE', 
    engineValue: 1.0, 
    leverageOverride: 1,
    drawdownThreshold: 50.0
  });

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

    setUserId(user.id);

    const merged = [...(subData || [])];
    
    // 1. Mark as proprietary if owned OR origin is PERSONAL
    merged.forEach(m => {
        if (m.strategy.creator_id === user.id || m.strategy.origin === 'PERSONAL' || m.creator_id === user.id) {
            m.is_proprietary = true;
        }
    });

    if (ownData) {
      ownData.forEach(strategy => {
        const exists = merged.find(m => m.strategy_id === strategy.id);
        if (!exists) {
          merged.push({
            id: `own-${strategy.id}`,
            user_id: user.id,
            strategy_id: strategy.id,
            sync_active: false,
            engine_mode: strategy.type === 'MT5_EA' ? 'FIXED_QTY' : 'MULTIPLIER',
            engine_value: strategy.type === 'MT5_EA' ? 0.01 : 1.0,
            leverage_override: 1,
            drawdown_threshold: 50.0,
            strategy: strategy,
            is_proprietary: true
          });
        }
      });
    }

    const filtered = merged.filter(item => {
        return item.strategy.type === activeTab;
    });

    setStrategies(filtered);
    
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

  const linkBrokerAccount = async (subscriptionId?: string, strategyIdForSelfSub?: string, setError?: (msg: string | null) => void, activeAssets?: string[]) => {
    setError?.(null);
    if (!brokerData.accountId) {
        if (setError) setError("Missing Account ID / Simulation Name.");
        else alert("Please provide a Simulation Name or Account ID to continue.");
        return;
    }
    
    setActivating(true);
    try {
        let finalSubscriptionId = subscriptionId;

        // 1. SELF-SUBSCRIPTION (For proprietary bots not yet in user_strategies)
        if (!finalSubscriptionId && strategyIdForSelfSub) {
            const subRes = await fetch(`/api/marketplace/${strategyIdForSelfSub}/subscribe`, {
                method: 'POST'
            });
            const subData = await subRes.json();
            
            if (!subRes.ok) {
                throw new Error(subData.error || 'Identity initialization failed');
            }
            finalSubscriptionId = subData.subscriptionId;
        }

        // 2. CONNECT BROKER
        const res = await fetch('/api/broker/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subscriptionId: finalSubscriptionId || null, 
                brokerType, 
                accountId: brokerData.accountId,
                apiKey: brokerData.apiKey,
                apiSecret: brokerData.apiSecret,
                meta: brokerData.meta,
                activeAssets: activeAssets || []
            })
        });
        
        const data = await res.json();
        if (res.ok) {
            setLinkingId(null);
            setBrokerData({ accountId: '', apiKey: '', apiSecret: '', meta: {} });
            alert("Digital Broker Link Established. Status: Operational.");
            fetchVault();
        } else {
            if (setError) setError(data.error || 'Connection failed during handshake.');
            else alert(data.error || 'Connection failed during handshake.');
        }
    } catch (err: any) {
        console.error('Connection failed:', err.message);
        if (setError) setError(`Mirror Handshake Error: ${err.message}`);
        else alert(`Mirror Handshake Error: ${err.message}`);
    } finally {
        setActivating(false);
    }
  };

  const updateRisk = async (subscriptionId: string, setError?: (msg: string | null) => void) => {
    setError?.(null);
    setActivating(true);
    try {
        const res = await fetch('/api/subscription/update-risk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subscriptionId, 
                engineMode: riskData.engineMode,
                engineValue: riskData.engineValue,
                leverageOverride: riskData.leverageOverride,
                drawdownThreshold: riskData.drawdownThreshold
            })
        });
        if (res.ok) {
            setConfiguringId(null);
            fetchVault();
        }
    } catch (err) {
        console.error('Update failed');
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

  const removeSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to remove this bot protocol from your vault? This will stop all active mirroring for this node.")) return;
    
    setLoading(true);
    try {
        const res = await fetch(`/api/subscription/remove?id=${subscriptionId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            fetchVault();
        } else {
            const data = await res.json();
            alert(data.error || 'Removal failed. Please try again.');
        }
    } catch (err) {
        console.error('Removal failed');
        alert('Network error while removing node.');
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest italic">Synchronizing Secure Vault...</div>;

  const officialBots = strategies.filter(s => s.strategy.origin === 'OFFICIAL');
  const proprietaryBots = strategies.filter(s => s.is_proprietary);
  const marketplaceBots = strategies.filter(s => s.strategy.origin !== 'OFFICIAL' && !s.is_proprietary);

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="space-y-4 w-full md:w-auto">
            <div className="px-1">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2 italic uppercase tracking-tighter">My Linked Brokers</h2>
              <p className="text-[10px] md:text-[12px] text-white/40 font-medium tracking-wide">Manage your broker accounts and active bots.</p>
            </div>
            
            {/* Tab Switcher - Only visible if no typeFilter is provided */}
            {!typeFilter && (
              <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveTab('MT5_EA')}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'MT5_EA' ? 'bg-[#FFD700] text-black shadow-xl shadow-[#FFD700]/10' : 'text-white/20 hover:text-white/40'}`}
                >
                  MT5 Institutional Bots
                </button>
                <button 
                  onClick={() => setActiveTab('PINE_SCRIPT_WEBHOOK')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PINE_SCRIPT_WEBHOOK' ? 'bg-[#00E676] text-black shadow-xl shadow-[#00E676]/10' : 'text-white/20 hover:text-white/40'}`}
                >
                  TradingView Indicators
                </button>
              </div>
            )}
        </div>
        <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 italic">
             <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
             <span className="text-[10px] font-black text-white/60 uppercase">Managed End-to-End Encryption</span>
        </div>
      </div>

      {/* 0. STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl w-full max-w-2xl">
         <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-white/40" />
             <span className="text-[12px] font-medium text-white/50 tracking-wide">System Secure & Encrypted</span>
         </div>
         <div className="hidden sm:block w-1 h-1 rounded-full bg-white/10 mx-2" />
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[12px] font-medium text-white/50 tracking-wide">Latency: 244ms</span>
         </div>
      </div>

      {/* 0.5. PROTOCOL ENDPOINTS GRID (9-BROKER SYNC) */}
      <div className="space-y-6 md:space-y-10 relative">
          {timelineMode && (
              <div className="absolute -left-[40px] md:-left-[48px] top-1 z-20">
                 <div className={`w-8 h-8 rounded-full border bg-[#0D121F] flex items-center justify-center font-black shadow-2xl ${timelineMode === 'bots' ? 'border-[#FFD700]/40 text-[#FFD700] shadow-[#FFD700]/10' : 'border-[#00E676]/40 text-[#00E676] shadow-[#00E676]/10'}`}>1</div>
              </div>
          )}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end px-2">
            <div className="space-y-2">
               <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Add a <span className="text-[#FFD700]">Broker</span></h3>
               <p className="text-[11px] font-medium text-white/40 leading-relaxed px-1">Select your broker below to link your account securely.</p>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
               <span className="text-[9px] font-bold text-[#00E676] uppercase tracking-wider font-sans">All Systems Working</span>
            </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-6">
            {SUPPORTED_BROKERS.map((broker) => (
               <button 
                  key={broker.id}
                  onClick={() => {
                     setBrokerType(broker.id as any);
                     setLinkingId('NEW_BROKER');
                  }}
                  className={`group relative p-3.5 md:p-8 bg-[#161C2D] border transition-all flex flex-col items-center justify-center gap-2.5 md:gap-4 text-center overflow-hidden shadow-xl ${linkingId === 'NEW_BROKER' && brokerType === broker.id ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/5 hover:border-[#FFD700]/40'} rounded-2xl md:rounded-[40px]`}
               >
                  <div className="absolute inset-0 bg-[#FFD700]/[0.01] group-hover:bg-[#FFD700]/[0.05] transition-colors" />
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700 relative z-10">
                     <broker.icon className={`w-4 h-4 md:w-7 md:h-7 transition-colors ${linkingId === 'NEW_BROKER' && brokerType === broker.id ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-[#FFD700]'}`} />
                  </div>
                  <div className="relative z-10">
                     <h4 className="text-[12px] md:text-[14px] font-bold text-white tracking-tight truncate w-full max-w-[80px] md:max-w-[120px]">{broker.name}</h4>
                     <p className="text-[8px] md:text-[9px] font-semibold text-white/20 uppercase tracking-widest mt-1 font-sans">{broker.region}</p>
                  </div>
               </button>
            ))}
         </div>

         {/* UNIVERSAL CONNECTION BRIDGE */}
         <AnimatePresence>
            {linkingId === 'NEW_BROKER' && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="p-8 md:p-12 rounded-[48px] bg-[#161C2D] border border-[#FFD700]/20 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Globe className="w-32 h-32" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#FFD700]/10 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Connect Your Broker</h3>
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">Securely connecting to {brokerType.replace('_', ' ')}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">Primary Account ID</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Account ID" 
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                        value={brokerData.accountId} 
                                        onChange={e => setBrokerData({...brokerData, accountId: e.target.value})} 
                                    />
                                </div>

                                    {/* DYNAMIC FIELD ENGINE (GLOBAL) */}
                                    <div className="space-y-4">
                                        {/* MT5 Fields */}
                                        {brokerType === 'MT5' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">MT5 Server</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g. MetaQuotes-Demo" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.meta.server || ''} 
                                                        onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, server: e.target.value}})} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">Trading Password</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Password" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.meta.password || ''} 
                                                        onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, password: e.target.value}})} 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* AngelOne Fields */}
                                        {brokerType === 'ANGELONE' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">Trading Password</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Password" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.meta.password || ''} 
                                                        onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, password: e.target.value}})} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">TOTP Secret</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Token" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.meta.totp_secret || ''} 
                                                        onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, totp_secret: e.target.value}})} 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Groww Fields */}
                                        {brokerType === 'GROWW' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">Groww Password</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Password" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.meta.password || ''} 
                                                        onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, password: e.target.value}})} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">4-Digit PIN</label>
                                                    <input 
                                                        type="password" 
                                                        maxLength={4}
                                                        placeholder="PIN" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.meta.pin || ''} 
                                                        onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, pin: e.target.value}})} 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Standard Crypto / API Key Fields */}
                                        {(['BINANCE_FUTURES', 'BYBIT', 'MEXC', 'BINGX', 'ZERODHA', 'DHAN'].includes(brokerType)) && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">API Key / Client ID</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Key" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.apiKey} 
                                                        onChange={e => setBrokerData({...brokerData, apiKey: e.target.value})} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-white/20 uppercase ml-2 tracking-widest italic">Secret / Token</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Secret" 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                        value={brokerData.apiSecret} 
                                                        onChange={e => setBrokerData({...brokerData, apiSecret: e.target.value})} 
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end space-y-6">
                            <div className="p-6 rounded-3xl bg-black/20 border border-white/5 space-y-3">
                                <h4 className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest italic">One-Time Setup</h4>
                                <p className="text-[10px] text-white/30 font-bold leading-relaxed italic">
                                    Save your broker details once so you can deploy any bot instantly. You won't need to enter them again.
                                </p>
                            </div>

                            <label className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors">
                                <div className="mt-1 relative flex items-center justify-center">
                                    <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded-md checked:bg-[#00E676] checked:border-[#00E676] transition-all cursor-pointer" checked={globalLegalAccepted} onChange={e => setGlobalLegalAccepted(e.target.checked)} />
                                    <Check className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                </div>
                                <span className="text-[9px] text-white/50 leading-relaxed uppercase tracking-widest font-bold">
                                    I acknowledge that I am modifying my broker API via an empanelled 3rd-party integration. I accept full responsibility for all algorithmic execution risks as mandated by the SEBI Framework (April 2026).
                                </span>
                            </label>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setLinkingId(null)}
                                    className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/40 uppercase italic tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => linkBrokerAccount()}
                                    disabled={activating || !globalLegalAccepted}
                                    className="flex-[2] py-5 bg-[#FFD700] text-black rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#FFD700]/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                >
                                    {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Globe className="w-4 h-4" /> Link to Profile</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="relative mt-8 md:mt-16 pt-2">
         {timelineMode && (
              <div className="absolute -left-[40px] md:-left-[48px] top-1 z-20">
                 <div className={`w-8 h-8 rounded-full border bg-[#0D121F] flex items-center justify-center font-black shadow-2xl ${timelineMode === 'bots' ? 'border-[#FFD700]/40 text-[#FFD700] shadow-[#FFD700]/10' : 'border-[#00E676]/40 text-[#00E676] shadow-[#00E676]/10'}`}>2</div>
              </div>
         )}
         {timelineMode && (
             <div className="space-y-2 mb-6 ml-2">
                <h3 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">
                    {timelineMode === 'bots' ? <>Auto<span className="text-[#FFD700]">-Trade</span></> : <>Webhook <span className="text-[#00E676]">Alerts</span></>}
                </h3>
             </div>
         )}
      {activeTab === 'PINE_SCRIPT_WEBHOOK' && strategies.length === 0 && (
          <div className="space-y-12 -ml-2 md:ml-0 pr-2 md:pr-0">
            <div className="bg-[#00E676]/[0.02] border border-dashed border-[#00E676]/20 rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center space-y-8 md:space-y-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#00E676]/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]" />
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#00E676]/10 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto border border-[#00E676]/20 relative z-10 transition-transform group-hover:scale-110">
                      <BarChart3 className="w-7 h-7 md:w-10 md:h-10 text-[#00E676] animate-pulse" />
                </div>
                <div className="space-y-2 md:space-y-3 relative z-10">
                  <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-[0.1em]">No Active <span className="text-[#00E676]">Signals</span> Found</h4>
                  <p className="text-[10px] md:text-[12px] font-medium text-white/50 leading-relaxed max-w-sm mx-auto p-1">
                    Your institutional-grade signal bridge is hungry for data. Discover official Alphas to begin mirroring today.
                  </p>
                </div>
                <button 
                  onClick={() => window.location.href = '/dashboard/marketplace?filter=Pine+Script'} 
                  className="mx-auto block px-8 md:px-12 py-4 md:py-5 bg-[#00E676] text-black font-black uppercase text-[10px] md:text-[11px] rounded-xl md:rounded-2xl hover:scale-105 transition-all tracking-[0.2em] shadow-2xl shadow-[#00E676]/20 relative z-10 italic"
                >
                  Explore TradingView Alphas
                </button>
            </div>
          </div>
      )}

      {strategies.length === 0 && activeTab === 'MT5_EA' && (
          <div className="space-y-12 -ml-2 md:ml-0 pr-2 md:pr-0">
            <div className="bg-[#FFD700]/[0.02] border border-dashed border-[#FFD700]/20 rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center space-y-8 md:space-y-10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]" />
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-[#FFD700]/10 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto border border-[#FFD700]/20 relative z-10 transition-transform group-hover:scale-110">
                        <Lock className="w-7 h-7 md:w-10 md:h-10 text-[#FFD700] animate-pulse" />
                  </div>
                  <div className="space-y-2 md:space-y-3 relative z-10">
                    <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-[0.1em]">No <span className="text-[#FFD700]">Managed</span> Nodes Detected</h4>
                    <p className="text-[10px] md:text-[12px] font-medium text-white/50 leading-relaxed max-w-sm mx-auto p-1">
                      Mirror institutional Expert Advisors directly to your terminal. Begin your mirroring journey in the marketplace.
                    </p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/dashboard/marketplace'} 
                    className="mx-auto block px-8 md:px-12 py-4 md:py-5 bg-[#FFD700] text-black font-black uppercase text-[10px] md:text-[11px] rounded-xl md:rounded-2xl hover:scale-105 transition-all tracking-[0.2em] shadow-2xl shadow-[#FFD700]/20 relative z-10 italic"
                  >
                    Browse Official Alphas
                  </button>
            </div>
          </div>
      )}
      {strategies.length > 0 && (
          <div className="space-y-20">
            {/* 1. CREATOR HUB (PROPRIETARY BOTS) */}
            {proprietaryBots.length > 0 && (
                <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-[#00B0FF]/10 pb-6 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-[#00B0FF]/10 border-[#00B0FF]/20">
                                <Bot className="w-6 h-6 text-[#00B0FF]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Your <span className="text-[#00B0FF]">Proprietary</span> Bots</h3>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-[#00B0FF]/60">Private Ecosystem</span>
                    </div>

                    <div className="space-y-8">
                        {proprietaryBots.map((sub) => (
                            <StrategyCard 
                                key={sub.id} 
                                sub={sub} 
                                isProprietary={true}
                                setActivationTarget={setActivationTarget}
                                linkingId={linkingId} 
                                setLinkingId={setLinkingId} 
                                configuringId={configuringId}
                                setConfiguringId={setConfiguringId}
                                riskData={riskData}
                                setRiskData={setRiskData}
                                updateRisk={updateRisk}
                                toggleSync={toggleSync} 
                                brokerType={brokerType} 
                                setBrokerType={setBrokerType} 
                                brokerData={brokerData} 
                                setBrokerData={setBrokerData} 
                                activating={activating} 
                                linkBrokerAccount={linkBrokerAccount} 
                                logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []} 
                                fetchLogs={fetchLogs} 
                                removeSubscription={removeSubscription}
                                previewSymbol={managingSub?.id === sub.id ? previewSymbol : null}
                                onManageAssets={(subRecord: any) => {
                                    setManagingSub(subRecord);
                                    setPreviewSymbol(subRecord.active_assets?.[0] || 'XAUUSD');
                                    setIsAssetDrawerOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 2. OFFICIAL HUB */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-[#FFD700]/10 pb-6 px-2">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activeTab === 'MT5_EA' ? 'bg-[#FFD700]/10 border-[#FFD700]/20' : 'bg-[#00E676]/10 border-[#00E676]/20'}`}>
                       <ShieldCheck className={`w-6 h-6 ${activeTab === 'MT5_EA' ? 'text-[#FFD700]' : 'text-[#00E676]'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Coppr <span className={activeTab === 'MT5_EA' ? 'text-[#FFD700]' : 'text-[#00E676]'}>Institutional</span> Alphas</h3>
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-wider font-sans ${activeTab === 'MT5_EA' ? 'text-[#FFD700]/60' : 'text-[#00E676]/60'}`}>Running Securely</span>
              </div>

              <div className="space-y-8">
                {officialBots.map((sub) => (
                    <StrategyCard 
                        key={sub.id} 
                        sub={sub} 
                        isOfficial={true} 
                        linkingId={linkingId} 
                        setLinkingId={setLinkingId} 
                        configuringId={configuringId}
                        setConfiguringId={setConfiguringId}
                        riskData={riskData}
                        setRiskData={setRiskData}
                        updateRisk={updateRisk}
                        toggleSync={toggleSync} 
                        brokerType={brokerType} 
                        setBrokerType={setBrokerType} 
                        brokerData={brokerData} 
                        setBrokerData={setBrokerData} 
                        activating={activating} 
                        linkBrokerAccount={linkBrokerAccount} 
                        logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []} 
                        fetchLogs={fetchLogs} 
                        removeSubscription={removeSubscription}
                        setActivationTarget={setActivationTarget}
                        onManageAssets={(subRecord: any) => {
                            setManagingSub(subRecord);
                            setPreviewSymbol(subRecord.active_assets?.[0] || 'XAUUSD');
                            setIsAssetDrawerOpen(true);
                        }}
                    />
                ))}
              </div>
            </div>

            {/* 2. MARKETPLACE STRATEGIES */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 px-2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                       <LayoutGrid className="w-6 h-6 text-white/40" />
                    </div>
                    <h3 className="text-xl font-bold text-white/40 tracking-tight leading-none">Community <span className="text-white/20">Marketplace</span> Mirrored</h3>
                 </div>
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider font-sans">Third-Party Alphas</span>
              </div>

              <div className="space-y-8">
                {marketplaceBots.map((sub) => (
                    <StrategyCard 
                        key={sub.id} 
                        sub={sub} 
                        isOfficial={false} 
                        linkingId={linkingId} 
                        setLinkingId={setLinkingId} 
                        configuringId={configuringId}
                        setConfiguringId={setConfiguringId}
                        riskData={riskData}
                        setRiskData={setRiskData}
                        updateRisk={updateRisk}
                        toggleSync={toggleSync} 
                        brokerType={brokerType} 
                        setBrokerType={setBrokerType} 
                        brokerData={brokerData} 
                        setBrokerData={setBrokerData} 
                        activating={activating} 
                        linkBrokerAccount={linkBrokerAccount} 
                        logs={logs[sub.id.startsWith('own-') ? sub.strategy_id : sub.id] || []} 
                        fetchLogs={fetchLogs} 
                        removeSubscription={removeSubscription}
                        setActivationTarget={setActivationTarget}
                        previewSymbol={managingSub?.id === sub.id ? previewSymbol : null}
                        onManageAssets={(subRecord: any) => {
                            setManagingSub(subRecord);
                            setPreviewSymbol(subRecord.active_assets?.[0] || 'XAUUSD');
                            setIsAssetDrawerOpen(true);
                        }}
                    />
                ))}
              </div>
            </div>
          </div>
      )}

      {/* Signal Fan-Out Infrastructure */}
      {activeTab === 'MT5_EA' && (
      <div className="p-10 rounded-[48px] bg-[#00B0FF]/5 border border-[#00B0FF]/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00B0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-[28px] bg-[#00B0FF]/10 flex items-center justify-center shrink-0 border border-[#00B0FF]/20 group-hover:scale-105 transition-transform">
                <Globe className="w-8 h-8 text-[#00B0FF]" />
            </div>
            <div className="flex-1 space-y-2 relative z-10">
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                    TradingView Webhook Integration
                    <span className="text-[9px] bg-[#00E676] text-black px-2 py-0.5 rounded font-black uppercase">Active</span>
                </h4>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-loose font-sans italic">
                    Switch to the TradingView Indicators tab to link your PineScript signals directly to our broker network.
                </p>
            </div>
            <button 
              onClick={() => setActiveTab('PINE_SCRIPT_WEBHOOK')}
              className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#00E676]/40 group-hover:text-[#00E676] transition-all relative z-10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
      </div>
      )}
      
      {/* 3. LIVE MONITORING FEED (NEW) */}
      <div className="relative mt-8 md:mt-16 pt-2 pb-10">
         {timelineMode && (
              <div className="absolute -left-[40px] md:-left-[48px] top-1 z-20">
                 <div className={`w-8 h-8 rounded-full border bg-[#0D121F] flex items-center justify-center font-black shadow-2xl ${timelineMode === 'bots' ? 'border-[#FFD700]/40 text-[#FFD700] shadow-[#FFD700]/10' : 'border-[#00E676]/40 text-[#00E676] shadow-[#00E676]/10'}`}>3</div>
              </div>
         )}
         {timelineMode && (
             <div className="space-y-2 mb-6 ml-2">
                <h3 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">
                    Live <span className={timelineMode === 'bots' ? 'text-[#FFD700]' : 'text-[#00E676]'}>Terminal</span>
                </h3>
             </div>
         )}
         <div className="h-[300px] md:h-[400px]">
            <TerminalLog logs={Object.values(logs).flat()} />
         </div>
      </div>

      <ActivationModal 
        isOpen={!!activationTarget}
        onClose={() => setActivationTarget(null)}
        strategyName={activationTarget?.strategy?.name || ''}
        strategyId={activationTarget?.strategy_id || ''}
        supportedBrokers={SUPPORTED_BROKERS}
        onActivate={async (data) => {
            const strategyIdSelf = activationTarget.id.startsWith('own-') ? activationTarget.strategy_id : undefined;
            const subId = activationTarget.id.startsWith('own-') ? undefined : activationTarget.id;
            
            await linkBrokerAccount(
                subId, 
                strategyIdSelf, 
                undefined, 
                data.activeAssets
            );
        }}
      />

      <AssetDiscoveryDrawer 
        isOpen={isAssetDrawerOpen}
        onClose={() => {
            setIsAssetDrawerOpen(false);
            setManagingSub(null);
            setPreviewSymbol(null);
        }}
        brokerType={managingSub?.broker_accounts?.broker_type || brokerType}
        selectedAssets={managingSub?.active_assets || []}
        onAssetToggle={async (sym) => {
            const current = managingSub?.active_assets || [];
            const next = current.includes(sym) ? current.filter((s: string) => s !== sym) : [...current, sym];
            
            // Optimistic UI update
            setStrategies(prev => prev.map(s => s.id === managingSub.id ? { ...s, active_assets: next }: s));
            setManagingSub((prev: any) => ({ ...prev, active_assets: next }));

            // Persist to DB
            const supabase = createClient();
            await supabase.from('user_strategies').update({ active_assets: next }).eq('id', managingSub.id);
        }}
        onPreviewSymbol={setPreviewSymbol}
      />

      </div>
    </div>
  );
}

function StrategyCard({ 
    sub, 
    isOfficial, 
    isProprietary,
    setActivationTarget,
    linkingId, 
    setLinkingId, 
    configuringId, 
    setConfiguringId, 
    riskData, 
    setRiskData, 
    updateRisk, 
    toggleSync, 
    brokerType, 
    setBrokerType, 
    brokerData, 
    setBrokerData, 
    activating, 
    linkBrokerAccount, 
    logs,
    fetchLogs,
    removeSubscription,
    onManageAssets,
    previewSymbol
}: any) {
    const logId = sub.id.startsWith('own-') ? sub.strategy_id : sub.id;
    const [localLegalAccepted, setLocalLegalAccepted] = useState(false);
    const [showIntegration, setShowIntegration] = useState(false);
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [cardError, setCardError] = useState<string | null>(null);
    const [isVisualMode, setIsVisualMode] = useState(true);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [isTerminalWelcomeOpen, setIsTerminalWelcomeOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const isUniversal = 
        sub.strategy.type === 'PINE_SCRIPT_WEBHOOK' || 
        sub.strategy.execution_mode === 'WEBHOOK_BRIDGE' ||
        sub.strategy.name.toLowerCase().includes('universal') || 
        sub.strategy.name.toLowerCase().includes('multi') ||
        (sub.active_assets && sub.active_assets.length > 1);

    // Dynamic Symbol Resolution Hierarchy
    const activeSymbol = previewSymbol || 
                        selectedSymbol || 
                        (sub.active_assets && sub.active_assets.length > 0 ? sub.active_assets[0] : 
                        sub.strategy.name.toUpperCase().includes("BTC") ? "BTCUSD" : 
                        sub.strategy.name.toUpperCase().includes("ETH") ? "ETHUSD" : 
                        sub.strategy.name.toUpperCase().includes("SOL") ? "SOLUSD" :
                        sub.strategy.name.toUpperCase().includes("XRP") ? "XRPUSD" :
                        (sub.strategy.name.toUpperCase().includes("XAU") || sub.strategy.name.toUpperCase().includes("GOLD")) ? "XAUUSD" : 
                        "XAUUSD");

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[#0D121F]/60 border rounded-[32px] md:rounded-[48px] overflow-hidden group transition-all duration-700 hover:scale-[1.005] ${isOfficial ? 'border-[#FFD700]/20 hover:border-[#FFD700]/40 shadow-2xl shadow-[#FFD700]/5' : 'border-white/5 hover:border-white/10'}`}
        >
            <div className="grid grid-cols-1 xl:grid-cols-4">
                {/* 1. CINEMATIC COMMAND FRAME (CHART AREA) - Left 3 Columns */}
                <div className="xl:col-span-3 p-6 md:p-10 flex flex-col justify-between bg-black/40 relative min-h-[400px] md:min-h-[600px] border-b xl:border-b-0 xl:border-r border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-8 px-1 gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isOfficial ? 'bg-[#FFD700] shadow-[0_0_12px_#FFD700]' : 'bg-[#00E676] shadow-[0_0_12px_#00E676]'}`}></span>
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-[0.2em] font-sans leading-none mb-1">
                                    {isOfficial ? 'Institutional Fiber Node' : 'Community Mirror Protocol'}
                                </span>
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Mirror Propagation Terminal // LIVE</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                            {(sub.strategy.name.toUpperCase().includes('XAU') || sub.strategy.name.toUpperCase().includes('GOLD')) && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full animate-pulse shrink-0">
                                    <Zap className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[8px] font-black text-[#FFD700] uppercase tracking-widest leading-none">GOLD_HANDSHAKE_ACTIVE</span>
                                </div>
                            )}
                            <button 
                                onClick={() => setIsVisualMode(!isVisualMode)}
                                className={`p-2.5 rounded-xl transition-all border ${isVisualMode ? 'bg-[#00E676]/10 border-[#00E676]/20 text-[#00E676]' : 'bg-white/5 border-white/10 text-white/20 hover:bg-white/10'}`}
                                title={isVisualMode ? "Switch to Technical Terminal" : "Switch to Visual Flow"}
                            >
                                {isVisualMode ? <Code className="w-5 h-5" /> : <LineChart className="w-5 h-5" />}
                            </button>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[11px] font-black text-[#00E676] uppercase tracking-widest font-sans animate-pulse">24ms_LATENCY</span>
                                <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">SECURE_TUNNEL_READY</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        {isVisualMode ? (
                            <SignalVisualizer 
                                symbol={activeSymbol} 
                                activeSymbols={sub.active_assets || []}
                                onSymbolChange={setSelectedSymbol}
                                logs={logs} 
                            />
                        ) : (
                            <div className="h-[500px]">
                                <TerminalLog logs={logs} />
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-1 gap-6 relative z-10 border-t border-white/5 pt-8">
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-lg font-mono ${isOfficial ? 'text-[#FFD700]/30' : 'text-white/20'}`}>
                            {isOfficial ? '>> PRO_PROTOCOL_ENFORCED: Mirrored via Coppr Proprietary High-Performance Fiber Network. Sub-second execution parity confirmed.' : '>> COMMUNITY_MIRROR_ACTIVE: Local propagation active via standard virtual hosting nodes. Respect execution buffer.'}
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => fetchLogs(logId)} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/btn">
                                <Settings className="w-5 h-5 text-white/30 group-hover/btn:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. INSTITUTIONAL METRIC SIDEBAR (CONTROL AREA) - Right 1 Column */}
                <div className="xl:col-span-1 p-5 md:p-10 space-y-8 bg-white/[0.01] relative overflow-hidden flex flex-col">
                    {isOfficial && (
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FFD700]/5 blur-[100px] pointer-events-none" />
                    )}
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[28px] flex items-center justify-center border transition-all ${isOfficial ? 'bg-[#FFD700]/10 border-[#FFD700]/20' : 'bg-white/5 border-white/5'}`}>
                                <Zap className={`w-6 h-6 md:w-8 md:h-8 ${isOfficial ? 'text-[#FFD700]' : 'text-white/20'}`} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-none tracking-tight mb-2">{sub.strategy.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[8px] md:text-[10px] font-bold px-2.5 py-0.5 md:px-3 md:py-1 rounded-full uppercase font-sans tracking-widest ${isOfficial ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/10' : 'bg-white/10 text-white/40'}`}>
                                        {isOfficial ? 'Coppr Official Alpha' : 'Community Mirror'}
                                    </span>
                                    {isUniversal && (
                                        <span className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-bold px-2.5 py-0.5 md:px-3 md:py-1 rounded-full uppercase font-sans tracking-widest bg-[#00B0FF]/10 text-[#00B0FF] border border-[#00B0FF]/20 shadow-lg shadow-[#00B0FF]/5">
                                            <Globe className="w-2.5 h-2.5" />
                                            Universal
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!sub.id.startsWith('own-') && (
                            <button 
                                onClick={() => removeSubscription(sub.id)}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-[#FF5252] hover:bg-[#FF5252]/10 transition-all"
                                title="Remove from Vault"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 px-0.5">
                        <div className="p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5">
                             <p className="text-[7px] md:text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1.5">Protocol</p>
                             <div className="flex items-center gap-2.5">
                                <Activity className="w-3.5 h-3.5 text-[#00E676]" />
                                <span className="text-[10px] md:text-[11px] font-bold text-white uppercase truncate">{RETAIL_JARGON[sub.engine_mode || 'MULTIPLIER']?.label}</span>
                             </div>
                        </div>
                        <div className="p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5">
                             <p className="text-[7px] md:text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1.5">Risk Value</p>
                             <div className="flex items-center gap-2.5">
                                <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
                                <span className="text-[10px] md:text-[11px] font-bold text-white uppercase">{sub.engine_value || '1.0'}x</span>
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

                    <div className={`p-4 md:p-5 rounded-2xl md:rounded-[24px] border transition-all ${isOfficial && sub.sync_active ? 'bg-[#FFD700]/5 border-[#FFD700]/20' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${sub.sync_active ? 'bg-[#00E676] shadow-[0_0_12px_#00E676]' : 'bg-white/20'}`}></div>
                                <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest font-sans italic">{sub.sync_active ? 'Node Operational' : 'Node Halted'}</span>
                            </div>
                            <button 
                                onClick={() => toggleSync(sub.id, sub.sync_active)}
                                className={`relative w-10 h-5 md:w-12 md:h-6 rounded-full transition-all duration-500 ${sub.sync_active ? 'bg-[#00E676]' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-0.5 md:top-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-white transition-all duration-500 ${sub.sync_active ? 'left-6 md:left-7' : 'left-0.5 md:left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isProprietary && !sub.broker_account_id && !sub.mt5_account_number && (
                            <button 
                                onClick={() => setActivationTarget(sub)}
                                className="w-full py-5 bg-[#00E676] text-black rounded-[24px] text-[10px] font-black uppercase italic tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#00E676]/20 flex items-center justify-center gap-3 mb-4"
                            >
                                <Zap className="w-4 h-4" /> Start Mirroring Handshake
                            </button>
                        )}
                        {linkingId === sub.id ? (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full space-y-4 bg-black/40 p-6 rounded-[32px] border border-white/5">
                                <form onSubmit={(e) => { e.preventDefault(); linkBrokerAccount(sub.id.startsWith('own-') ? undefined : sub.id, sub.id.startsWith('own-') ? sub.strategy_id : undefined, setCardError); }} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['ZERODHA', 'ANGELONE', 'MT5', 'BINANCE_FUTURES', 'BYBIT', 'DHAN', 'MEXC', 'BINGX', 'GROWW', 'TRADINGVIEW_DEMO'] as const).map(type => (
                                            <button type="button" key={type} onClick={() => setBrokerType(type)} className={`flex-1 py-3 rounded-xl text-[7px] font-black transition-all uppercase ${brokerType === type ? 'bg-[#FFD700] text-black' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}>{type.replace('_', ' ')}</button>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder={brokerType === 'TRADINGVIEW_DEMO' ? 'Simulation Name (e.g. MyPaperTrade)' : 'Account ID (Private)'} 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                        value={brokerData.accountId} 
                                        onChange={e => setBrokerData({...brokerData, accountId: e.target.value})} 
                                    />
                                    {/* DYNAMIC FIELD ENGINE */}
                                    <div className="space-y-4">
                                        {/* MT5 Fields */}
                                        {brokerType === 'MT5' && (
                                            <>
                                                <input 
                                                    type="text" 
                                                    placeholder="MT5 Server (e.g. MetaQuotes-Demo)" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.meta.server || ''} 
                                                    onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, server: e.target.value}})} 
                                                />
                                                <input 
                                                    type="password" 
                                                    placeholder="Trading Password" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.meta.password || ''} 
                                                    onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, password: e.target.value}})} 
                                                />
                                            </>
                                        )}

                                        {/* AngelOne Fields */}
                                        {brokerType === 'ANGELONE' && (
                                            <>
                                                <input 
                                                    type="password" 
                                                    placeholder="Trading Password" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.meta.password || ''} 
                                                    onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, password: e.target.value}})} 
                                                />
                                                <input 
                                                    type="password" 
                                                    placeholder="TOTP Secret Token" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.meta.totp_secret || ''} 
                                                    onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, totp_secret: e.target.value}})} 
                                                />
                                                <input 
                                                    type="password" 
                                                    placeholder="AngelOne API Key" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.apiKey} 
                                                    onChange={e => setBrokerData({...brokerData, apiKey: e.target.value})} 
                                                />
                                            </>
                                        )}

                                        {/* Groww Fields */}
                                        {brokerType === 'GROWW' && (
                                            <>
                                                <input 
                                                    type="password" 
                                                    placeholder="Groww Password" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.meta.password || ''} 
                                                    onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, password: e.target.value}})} 
                                                />
                                                <input 
                                                    type="password" 
                                                    placeholder="4-Digit PIN" 
                                                    maxLength={4}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.meta.pin || ''} 
                                                    onChange={e => setBrokerData({...brokerData, meta: {...brokerData.meta, pin: e.target.value}})} 
                                                />
                                            </>
                                        )}

                                        {/* Crypto / Standard API Key Brokers */}
                                        {(['BINANCE_FUTURES', 'BYBIT', 'MEXC', 'BINGX'].includes(brokerType)) && (
                                            <>
                                                <input 
                                                    type="password" 
                                                    placeholder={`${brokerType.replace('_', ' ')} API Key`} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.apiKey} 
                                                    onChange={e => setBrokerData({...brokerData, apiKey: e.target.value})} 
                                                />
                                                <input 
                                                    type="password" 
                                                    placeholder={`${brokerType.replace('_', ' ')} Secret Key`} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.apiSecret} 
                                                    onChange={e => setBrokerData({...brokerData, apiSecret: e.target.value})} 
                                                />
                                            </>
                                        )}

                                        {/* Zerodha / Dhan */}
                                        {(brokerType === 'ZERODHA' || brokerType === 'DHAN') && (
                                            <>
                                                <input 
                                                    type="password" 
                                                    placeholder={brokerType === 'ZERODHA' ? 'Zerodha API Key' : 'Dhan Client ID'} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.apiKey} 
                                                    onChange={e => setBrokerData({...brokerData, apiKey: e.target.value})} 
                                                />
                                                <input 
                                                    type="password" 
                                                    placeholder={brokerType === 'ZERODHA' ? 'Zerodha API Secret' : 'Dhan Access Token'} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-colors" 
                                                    value={brokerData.apiSecret} 
                                                    onChange={e => setBrokerData({...brokerData, apiSecret: e.target.value})} 
                                                />
                                            </>
                                        )}
                                    </div>
                                    
                                    <label className="flex items-start gap-3 p-3 mt-4 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors">
                                        <div className="mt-0.5 relative flex items-center justify-center">
                                            <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded-md checked:bg-[#00E676] checked:border-[#00E676] transition-all cursor-pointer" checked={localLegalAccepted} onChange={e => setLocalLegalAccepted(e.target.checked)} />
                                            <Check className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                        </div>
                                        <span className="text-[7px] text-white/50 leading-relaxed uppercase tracking-widest font-bold">
                                            I accept liability for trading risks on an empanelled 3rd-party integration as per SEBI Framework.
                                        </span>
                                    </label>

                                    {cardError && (
                                        <div className="p-4 bg-[#FF5252]/10 border border-[#FF5252]/20 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <AlertCircle className="w-5 h-5 text-[#FF5252]" />
                                            <p className="text-[9px] font-black text-[#FF5252] uppercase tracking-widest leading-none">{cardError}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => { setLinkingId(null); setCardError(null); }} className="px-6 py-4 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] rounded-2xl flex-1 hover:bg-white/10 transition-all font-sans italic">Cancel</button>
                                        <button type="submit" disabled={activating || !localLegalAccepted} className="px-6 py-4 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-2xl flex-[2] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-[#FFD700]/10 font-sans italic disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">
                                            {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-5 h-5" /> Initialize Linking</>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : configuringId === sub.id ? (
                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full space-y-6 bg-black/40 p-8 rounded-[40px] border border-[#00E676]/20">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Configure Risk Protocol</h4>
                                    <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                                </div>

                                <div className="space-y-4">
                                     {/* MODE SELECTOR (INDICATORS ONLY) */}
                                     {sub.strategy.type === 'PINE_SCRIPT_WEBHOOK' ? (
                                         <div className="flex gap-2">
                                            {(['FIXED_QTY', 'MULTIPLIER', 'PCT_BALANCE'] as const).map(mode => (
                                                <div key={mode} className="flex-1 group/mode relative">
                                                    <button 
                                                        onClick={() => setRiskData({...riskData, engineMode: mode})} 
                                                        className={`w-full py-3 rounded-xl text-[8px] font-black transition-all uppercase ${riskData.engineMode === mode ? 'bg-[#00E676] text-black' : 'bg-white/5 text-white/40 border border-white/5'}`}
                                                    >
                                                        {RETAIL_JARGON[mode].label}
                                                    </button>
                                                    <div className="absolute top-full left-0 w-48 p-3 mt-2 bg-black border border-white/10 rounded-xl opacity-0 group-hover/mode:opacity-100 transition-opacity z-50 pointer-events-none">
                                                        <p className="text-[7px] font-bold text-white/60 uppercase leading-relaxed tracking-wider">{RETAIL_JARGON[mode].tip}</p>
                                                    </div>
                                                </div>
                                            ))}
                                         </div>
                                     ) : (
                                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                             <span className="text-[10px] font-black text-white/40 uppercase">Execution Protocol</span>
                                             <span className="text-[10px] font-black text-[#FFD700] uppercase italic">Institutional Standard</span>
                                         </div>
                                     )}

                                     <div className="space-y-2">
                                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] font-sans ml-2">
                                             {sub.strategy.type === 'MT5_EA' ? 'Static Units (Lots)' : `Risk Magnitude (${RETAIL_JARGON[riskData.engineMode].label})`}
                                         </p>
                                         <input 
                                            type="number" 
                                            step="0.01"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#00E676]/40 transition-all font-mono" 
                                            value={riskData.engineValue} 
                                            onChange={e => setRiskData({...riskData, engineValue: parseFloat(e.target.value)})} 
                                         />
                                     </div>

                                     {/* LEVERAGE (INDICATORS ONLY) */}
                                     {sub.strategy.type === 'PINE_SCRIPT_WEBHOOK' && (
                                         <div className="space-y-2">
                                            <div className="flex justify-between items-center px-2">
                                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] font-sans">Trade Capacity Override (Power Boost)</p>
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${riskData.leverageOverride > 20 ? 'text-[#FF5252]' : riskData.leverageOverride > 1 ? 'text-[#FFD700]' : 'text-[#00E676]'}`}>
                                                    {riskData.leverageOverride === 1 ? 'Standard Mirroring' : riskData.leverageOverride > 50 ? 'Aggressive Scaling' : 'Enhanced Efficiency'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <input 
                                                    type="range" min="1" max="100" 
                                                    className="flex-1 accent-[#FFD700]" 
                                                    value={riskData.leverageOverride} 
                                                    onChange={e => setRiskData({...riskData, leverageOverride: parseInt(e.target.value)})} 
                                                />
                                                <span className="text-[12px] font-black text-[#FFD700] w-10">{riskData.leverageOverride}x</span>
                                            </div>
                                            <p className="text-[7px] text-white/10 uppercase font-black tracking-[0.2em] text-center italic">Calculated Buying Power: ${((riskData.leverageOverride || 1) * 1000).toLocaleString()} per 1k USDT balance</p>
                                         </div>
                                     )}

                                     {/* DRAWDOWN KILL-SWITCH */}
                                     <div className="space-y-2">
                                         <div className="flex justify-between items-center px-1">
                                            <p className="text-[8px] font-black text-[#FF5252]/60 uppercase tracking-[0.2em] font-sans">Drawdown Kill-Switch</p>
                                            <span className="text-[10px] font-black text-[#FF5252] font-mono">{riskData.drawdownThreshold}%</span>
                                         </div>
                                         <div className="flex items-center gap-4 bg-[#FF5252]/5 p-4 rounded-2xl border border-[#FF5252]/10">
                                             <input 
                                                type="range" min="5" max="95" step="5"
                                                className="flex-1 accent-[#FF5252]" 
                                                value={riskData.drawdownThreshold} 
                                                onChange={e => setRiskData({...riskData, drawdownThreshold: parseInt(e.target.value)})} 
                                             />
                                             <AlertCircle className="w-4 h-4 text-[#FF5252]/40" />
                                         </div>
                                         <p className="text-[8px] text-white/10 uppercase font-black tracking-widest text-center mt-1 italic italic">Auto-Halts Node if Equity Drops {riskData.drawdownThreshold}%</p>
                                     </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setConfiguringId(null)} className="px-6 py-4 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] rounded-2xl flex-1 hover:bg-white/10 transition-all font-sans italic">Cancel</button>
                                    <button onClick={() => updateRisk(sub.id, setCardError)} disabled={activating} className="px-6 py-4 bg-[#00E676] text-black font-black uppercase text-[10px] rounded-2xl flex-[2] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-[#00E676]/10 font-sans italic">
                                        {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-5 h-5" /> Save Risk Protocol</>}
                                    </button>
                                </div>
                             </motion.div>
                        ) : (
                            <div className="w-full space-y-4">
                                {sub.is_paused && sub.last_kill_reason && (
                                    <div className="p-4 bg-[#FF5252]/10 border border-[#FF5252]/20 rounded-2xl flex items-center gap-4 group/alert animate-pulse">
                                        <AlertCircle className="w-5 h-5 text-[#FF5252]" />
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-[#FF5252] uppercase tracking-widest leading-none mb-1">Protection Engaged</p>
                                            <p className="text-[8px] font-bold text-[#FF5252]/60 uppercase tracking-tighter leading-none">{sub.last_kill_reason.replace(/_/g, ' ')}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {sub.broker_account_id && (
                                    <BrokerGuardian brokerType={sub.broker_accounts?.broker_type} accountId={sub.broker_account_id} />
                                )}

                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={() => {
                                            if (sub.sync_active) {
                                                setIsTerminalWelcomeOpen(true);
                                            } else {
                                                setLinkingId(sub.id);
                                            }
                                        }} 
                                        className={`flex-1 py-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 transition-all duration-500 italic ${sub.sync_active ? 'bg-[#FFD700]/5 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10' : 'bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20'}`}
                                    >
                                        {sub.sync_active ? (
                                            <><Terminal className="w-4 h-4" /> Entry Point</>
                                        ) : (
                                            'Connect API'
                                        )}
                                    </button>
                                    
                                    <button 
                                        onClick={() => onManageAssets?.(sub)}
                                        className="px-8 py-6 rounded-[32px] transition-all group border bg-[#00E676]/5 border-[#00E676]/20 text-[#00E676] hover:bg-[#00E676]/10"
                                        title="Manage Targets"
                                    >
                                        <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>

                                    <button 
                                        onClick={() => setIsIntegrationModalOpen(true)}
                                        className={`px-8 py-6 rounded-[32px] transition-all group border ${isIntegrationModalOpen ? 'bg-[#00B0FF]/10 border-[#00B0FF] text-[#00B0FF]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                                        title="Signal Integration"
                                    >
                                        <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <IntegrationModal 
                            isOpen={isIntegrationModalOpen}
                            onClose={() => setIsIntegrationModalOpen(false)}
                            sub={sub}
                            copyToClipboard={copyToClipboard}
                            copiedText={copiedText}
                        />

                        <AstralTerminalWelcome 
                            isOpen={isTerminalWelcomeOpen}
                            onClose={() => setIsTerminalWelcomeOpen(false)}
                            strategyName={sub.strategy.name}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
