'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Wifi, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Globe,
  Zap
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CreatorHandshakeTerminal({ strategyId, webhookUrl }: { strategyId: string, webhookUrl: string }) {
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'RECEIVED' | 'ERROR'>('IDLE');
  const [signals, setSignals] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (status !== 'LISTENING') return;

    const supabase = createClient();
    const channel = supabase
      .channel('strategy-signals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'strategy_signals',
          filter: `strategy_id=eq.${strategyId}`
        },
        (payload) => {
          setSignals(prev => [payload.new, ...prev].slice(0, 5));
          setStatus('RECEIVED');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status, strategyId]);

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E676]/20 to-transparent" />
      
      <div className="flex flex-col md:flex-row justify-between gap-10 items-start">
        <div className="flex-1 space-y-6">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className={`w-2 h-2 rounded-full ${status === 'LISTENING' ? 'bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]' : 'bg-white/10'}`} />
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Master <span className="text-[#00E676]">Propagation</span> Terminal</h3>
              </div>
              <p className="text-[11px] text-white/30 font-black uppercase tracking-widest font-sans italic leading-relaxed">
                 Institutional Broadcast Logic Active. Only you need TradingView Premium—your subscribers follow for free.
              </p>
           </div>

           <div className="space-y-4">
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4 shadow-inner">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-[#FFD700] tracking-[0.2em] italic">01. COPY BRIDGE URL</label>
                    <Globe className="w-3.5 h-3.5 text-white/10" />
                 </div>
                 <div className="flex gap-3">
                    <code className="flex-1 bg-black/40 p-4 rounded-xl text-[10px] text-white/60 font-mono break-all border border-white/5">
                       {webhookUrl}
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(webhookUrl);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase text-white/40 hover:text-[#FFD700] transition-all"
                    >
                       {isCopied ? 'COPIED' : 'COPY'}
                    </button>
                 </div>
              </div>

              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4 shadow-inner">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-[#00E676] tracking-[0.2em] italic">02. MASTER BROADCAST HANDSHAKE</label>
                    <Zap className="w-3.5 h-3.5 text-white/10" />
                 </div>
                 <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed italic">
                    Configure your TV alert with the bridge URL. Your one signal will automatically propagate to all authorized subscriber accounts.
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => setStatus(status === 'LISTENING' ? 'IDLE' : 'LISTENING')}
                className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                  status === 'LISTENING' ? 'bg-[#00E676] text-black shadow-[#00E676]/20' : 
                  status === 'RECEIVED' ? 'bg-white/5 text-[#00E676] border border-[#00E676]/20' : 
                  'bg-[#FFD700] text-black shadow-[#FFD700]/10 hover:scale-[1.02]'
                }`}
              >
                 {status === 'LISTENING' ? (
                   <> <Loader2 className="w-4 h-4 animate-spin text-black" /> LISTENING FOR HEARTBEAT... </>
                 ) : status === 'RECEIVED' ? (
                   <> <CheckCircle2 className="w-4 h-4" /> HANDSHAKE VERIFIED </>
                 ) : (
                   <> <Wifi className="w-4 h-4" /> START LINK LISTENER </>
                 )}
              </button>
           </div>
        </div>

        {/* Signal Monitor Log UI */}
        <div className="w-full md:w-[350px] aspect-square md:aspect-auto h-[400px] bg-black/40 border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-white/20" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Signal Stream</span>
               </div>
               <Activity className={`w-4 h-4 ${status === 'LISTENING' ? 'text-[#00E676] animate-pulse' : 'text-white/10'}`} />
            </div>

            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-4 scrollbar-hide">
              <AnimatePresence>
                {status === 'IDLE' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-4">
                     <Wifi className="w-8 h-8 text-white/5 mb-2" />
                     <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest leading-loose italic max-w-[200px]">
                        Listener idle. Click start to begin handshake monitoring.
                     </p>
                  </motion.div>
                )}
                {signals.map((sig, idx) => (
                  <motion.div 
                    key={sig.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 relative group-hover:border-[#00E676]/20 transition-all shadow-inner"
                  >
                     <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.2em]">{sig.side || 'SIGNAL'}</span>
                        <span className="text-[8px] text-white/20">{new Date(sig.created_at).toLocaleTimeString()}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[8px] text-white/10 font-black uppercase">Symbol</p>
                           <p className="text-[10px] text-white/60 font-black uppercase italic">{sig.symbol}</p>
                        </div>
                        <div>
                           <p className="text-[8px] text-white/10 font-black uppercase">TP/SL Mapped</p>
                           <p className="text-[10px] text-[#FFD700] font-black italic">PROTOCOL_OK</p>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom Status Overlay */}
            {status === 'LISTENING' && (
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#00E676]/10 border border-[#00E676]/20 rounded-2xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.3em]">Awaiting Fiber Pulse...</span>
               </div>
            )}
        </div>
      </div>
    </div>
  );
}
