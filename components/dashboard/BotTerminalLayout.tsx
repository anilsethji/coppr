'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  ChevronDown, 
  Download, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  ArrowUpRight,
  Target,
  Settings,
  LayoutGrid,
  Star,
  MessageSquare,
  Activity,
  Globe,
  LineChart,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { SignalVisualizer } from './SignalVisualizer';
import BotSelectorDrawer from './BotSelectorDrawer';
import BotTrustHub from './BotTrustHub';
import { createClient } from '@/lib/supabase/client';
import ActivationModal from './ActivationModal';
import { IntegrationModal } from './IntegrationModal';
import AssetDiscoveryDrawer from './AssetDiscoveryDrawer';

interface BotTerminalLayoutProps {
  type: 'bot' | 'indicator';
  initialBotId?: string;
  bots: any[];
  onBotChange?: (bot: any) => void;
}

export default function BotTerminalLayout({ type, bots, initialBotId, onBotChange }: BotTerminalLayoutProps) {
  const [activeBot, setActiveBot] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTrustHubOpen, setIsTrustHubOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  
  // Handshake State
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [previewSymbol, setPreviewSymbol] = useState<string | null>(null);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    if (bots.length > 0) {
      const initial = bots.find(b => b.id === initialBotId) || bots[0];
      setActiveBot(initial);
    }
  }, [bots, initialBotId]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!activeBot?.id) return;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_strategies')
        .select('*, strategy:strategies (*)')
        .eq('strategy_id', activeBot.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setActiveSubscription(data);
    };
    fetchSession();
  }, [activeBot]);

  // Latency Heartbeat simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(18, Math.min(32, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeBot?.id) {
      const fetchReviews = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from('strategy_reviews')
          .select('*, profiles(full_name)')
          .eq('strategy_id', activeBot.id)
          .order('created_at', { ascending: false });
        setReviews(data || []);
      };
      fetchReviews();
    }
  }, [activeBot]);

  // Rolling narrative carousel logic
  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIdx((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  const linkBrokerAccount = async (brokerData: any, subscriptionId?: string, strategyIdSelf?: string) => {
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
          alert("Institutional Connection Established. Node Active."); 
          setIsActivationModalOpen(false);
          // Refresh session
          window.location.reload();
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "Handshake failed.");
        }
    } catch (err: any) { 
      alert(`Handshake Error: ${err.message}`); 
    }
  };

  const onAssetToggle = async (sym: string) => {
    if (!activeSubscription) return;
    const isAdding = !activeSubscription.active_assets?.includes(sym);
    const next = isAdding 
      ? [...(activeSubscription.active_assets || []), sym] 
      : activeSubscription.active_assets.filter((as: any) => as !== sym);
    
    if (isAdding) setPreviewSymbol(sym);
    setActiveSubscription({ ...activeSubscription, active_assets: next });
    
    const supabase = createClient(); 
    await supabase.from('user_strategies').update({ active_assets: next }).eq('id', activeSubscription.id); 
  };

  const handleSelectBot = (bot: any) => {
    setActiveBot(bot);
    setIsDrawerOpen(false);
    onBotChange?.(bot);
  };

  if (!activeBot) return (
    <div className="flex items-center justify-center h-screen bg-[#06080E]">
      <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-[750px] md:h-[800px] w-full overflow-hidden bg-[#06080E] rounded-[32px] border border-white/5 shadow-2xl relative z-10">
      
      {/* TOP 80%: THE CHART */}
      <div className="flex-none h-[68%] md:h-[78%] lg:h-[82%] w-full relative border-b border-white/5 bg-black/20">
        <div className="absolute inset-0">
          <SignalVisualizer 
            symbol={activeBot.symbol || 'XAUUSD'} 
            logs={[]} // We can pass logs if available
            activeSymbols={[activeBot.symbol || 'XAUUSD']}
          />
        </div>

        {/* FLOATING HEADER */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 px-3 md:px-4 py-2 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-xl hover:bg-white/5 transition-all group shadow-2xl"
          >
            <div className="flex flex-col items-end">
               <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">Switch Node</span>
               <span className="text-[10px] md:text-[12px] font-black text-[#FFD700] uppercase italic tracking-tighter leading-none mt-1">{activeBot.name}</span>
            </div>
            <LayoutGrid className="w-3 h-3 md:w-4 md:h-4 text-white/20 group-hover:text-[#FFD700]" />
          </button>
        </div>
      </div>

      {/* BOTTOM 20%: THE COMMAND DOCK */}
      <div className="flex-grow w-full bg-gradient-to-t from-black via-[#06080E] to-transparent backdrop-blur-3xl p-4 md:p-8 relative overflow-hidden group flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12 relative z-10 h-full">
          
          {/* BOT IDENTITY */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0 w-full md:w-auto">
             <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center shadow-2xl relative">
                <Bot className="w-5 h-5 md:w-8 md:h-8 text-[#FFD700] animate-pulse" />
             </div>
              <div className="flex flex-col">
                 <div className="flex items-center gap-2 md:gap-3">
                    <h2 className="text-sm md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{activeBot.name}</h2>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 md:px-3 md:py-1 ${activeSubscription?.sync_active ? 'bg-[#00E676]/10 border border-[#00E676]/20' : 'bg-white/5 border border-white/10'} rounded-full shrink-0`}>
                       <div className={`w-1 h-1 rounded-full ${activeSubscription?.sync_active ? 'bg-[#00E676] animate-pulse' : 'bg-white/20'}`} />
                       <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest italic ${activeSubscription?.sync_active ? 'text-[#00E676]' : 'text-white/20'}`}>
                          {activeSubscription?.sync_active ? 'Online' : 'Standby'}
                       </span>
                    </div>
                    <div className="hidden md:flex flex-col ml-2 border-l border-white/10 pl-4">
                       <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mb-1 font-mono">RSA_SECURE_TUNNEL</span>
                       <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
                          <span className="text-[8px] font-black text-[#00E676] uppercase tracking-widest font-mono">{latency}ms_LATENCY</span>
                       </div>
                    </div>
                 </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                   <p className="text-[8px] md:text-[12px] font-bold text-white/20 uppercase tracking-[0.1em] italic line-clamp-1 max-w-[200px] md:max-w-none">
                      {activeBot.description || 'Institutional-grade node operating on H1 timeframe.'}
                   </p>
                   
                   {/* NARRATIVE BEACON - ROLLING FEEDBACK */}
                   <AnimatePresence mode="wait">
                      {reviews.length > 0 && (
                         <motion.div 
                           key={currentReviewIdx}
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -10 }}
                           className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-full cursor-pointer hover:bg-[#FFD700]/10 transition-all shrink-0"
                           onClick={() => setIsTrustHubOpen(true)}
                         >
                            <span className="text-[7px] font-black text-[#FFD700] uppercase tracking-widest italic line-clamp-1 max-w-[150px]">
                               "{reviews[currentReviewIdx].comment}"
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </div>

          {/* QUICK METRICS (DESKTOP) */}
          <div className="hidden lg:grid grid-cols-3 gap-12 px-12 border-x border-white/5 h-12 items-center">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Risk Factor</span>
                <span className="text-xl font-black text-[#FFD700] uppercase italic tracking-tighter leading-none mt-1">{activeSubscription?.engine_value || '1.0'}X_ALPHA</span>
             </div>
             <div className="flex flex-col text-center">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Protocol</span>
                <span className="text-xl font-black text-[#00B0FF] uppercase italic tracking-tighter leading-none mt-1">
                   {activeSubscription?.engine_mode === 'MULTIPLIER' ? 'Scaler' : 'Fixed'}
                </span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Verified Trust</span>
                <div className="flex items-center justify-end gap-1.5 mt-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsTrustHubOpen(true)}>
                   <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                   <span className="text-xl font-black text-white italic tracking-tighter">4.9</span>
                </div>
             </div>
          </div>

          {/* PRIMARY ACTIONS */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0 w-full md:w-auto">
             <button 
               onClick={() => activeSubscription?.sync_active ? setIsIntegrationModalOpen(true) : setIsActivationModalOpen(true)}
               className={`flex-1 md:flex-none px-6 md:px-12 py-3.5 md:py-5 font-black uppercase text-[10px] md:text-[13px] tracking-widest rounded-xl md:rounded-[24px] shadow-2xl transition-all italic flex items-center justify-center gap-3 relative overflow-hidden group/btn ${activeSubscription?.sync_active ? 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10' : 'bg-[#FFD700] text-black shadow-[#FFD700]/20 hover:scale-105'}`}
             >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                {activeSubscription?.sync_active ? 'Manage Bridge' : (type === 'bot' ? 'Activate' : 'Initialize')}
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAssetDrawerOpen(true)}
                  className="p-3.5 md:p-5 rounded-xl md:rounded-[24px] border border-[#00E676]/20 bg-[#00E676]/5 text-[#00E676] hover:bg-[#00E676]/10 transition-all shadow-xl group/targets"
                  title="Configure Targets"
                >
                   <Target className="w-4 h-4 md:w-5 md:h-5 group-hover/targets:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setIsTrustHubOpen(true)}
                  className="p-3.5 md:p-5 rounded-xl md:rounded-[24px] border border-[#00B0FF]/20 bg-[#00B0FF]/5 text-[#00B0FF] hover:bg-[#00B0FF]/10 transition-all shadow-xl group/trust"
                  title="Trust Metrics"
                >
                   <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 group-hover/trust:scale-110 transition-transform" />
                </button>
             </div>
          </div>

        </div>

        {/* BOTTOM DECORATIONS */}
        <div className="absolute bottom-4 left-8 hidden md:flex items-center gap-6 opacity-10">
           <span className="text-[8px] font-black text-white uppercase tracking-[0.5em] italic">Institutional Terminal v4.2 // Node Connection: Encrypted</span>
        </div>
      </div>

      {/* DISCOVERY DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <BotSelectorDrawer 
             type={type} 
             bots={bots}
             activeBotId={activeBot?.id}
             onClose={() => setIsDrawerOpen(false)} 
             onSelect={handleSelectBot}
          />
        )}
      </AnimatePresence>

      {/* OPERATIONAL MODALS (RESTORED) */}
      <ActivationModal 
        isOpen={isActivationModalOpen} 
        onClose={() => setIsActivationModalOpen(false)} 
        strategyName={activeBot.name || ''} 
        strategyId={activeBot.id || ''} 
        supportedBrokers={[
          { id: 'MT5', name: 'MetaTrader 5', region: 'GLOBAL', icon: Globe },
          { id: 'ZERODHA', name: 'Zerodha Kite', region: 'INDIA', icon: ShieldCheck },
          { id: 'ANGELONE', name: 'AngelOne SmartAPI', region: 'INDIA', icon: ShieldCheck },
          { id: 'DHAN', name: 'Dhan', region: 'INDIA', icon: ShieldCheck },
          { id: 'BINANCE_FUTURES', name: 'Binance Futures', region: 'GLOBAL', icon: Zap }
        ] as any} 
        onActivate={async (d) => { await linkBrokerAccount(d, undefined, activeBot.id); }} 
      />
      <IntegrationModal 
        isOpen={isIntegrationModalOpen} 
        onClose={() => setIsIntegrationModalOpen(false)} 
        sub={activeSubscription} 
        copyToClipboard={(t, l) => { navigator.clipboard.writeText(t); alert(`${l} copied to secure buffer.`); }} 
        copiedText={null}
      />
      <AssetDiscoveryDrawer 
        isOpen={isAssetDrawerOpen} 
        onClose={() => setIsAssetDrawerOpen(false)} 
        brokerType={activeSubscription?.broker_accounts?.broker_type || 'MT5'} 
        selectedAssets={activeSubscription?.active_assets || []} 
        onAssetToggle={onAssetToggle}
        onPreviewSymbol={setPreviewSymbol} 
      />
    </div>
  );
}
