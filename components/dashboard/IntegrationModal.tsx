'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Download, ExternalLink, X } from 'lucide-react';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sub: any;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose, sub, copyToClipboard, copiedText }) => {
  if (!isOpen) return null;

  const downloadConfig = () => {
    const config = {
      strategy_id: sub.strategy_id,
      subscription_id: sub.id,
      execution_mode: sub.strategy.execution_mode,
      broker: sub.broker_accounts?.broker_type || 'MT5',
      timestamp: new Date().toISOString(),
      node_endpoint: "wss://node.coppr.terminal/v1/handshake"
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coppr_config_${sub.strategy.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0D121F] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
        >
          <div className="p-10 md:p-14 space-y-10">
            <div className="flex justify-between items-start">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00B0FF]/10 rounded-lg">
                            <Globe className="w-5 h-5 text-[#00B0FF]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Signal Integration Protocol</h2>
                    </div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest leading-loose">Establish a zero-latency digital handshake between your external signals and the Coppr execution node.</p>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/20"><X className="w-6 h-6" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={downloadConfig}
                  className="flex flex-col items-center gap-6 p-10 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#00B0FF]/40 hover:bg-[#00B0FF]/5 transition-all group"
                >
                    <Download className="w-10 h-10 text-[#00B0FF] group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                        <span className="block text-xs font-black text-white uppercase tracking-widest mb-1">Download Config</span>
                        <span className="block text-[8px] text-white/20 uppercase font-bold">MT5 / JSON HANDSHAKE</span>
                    </div>
                </button>
                <button 
                  onClick={() => copyToClipboard(`coppr_hook_${sub.id}`, 'Webhook URL')}
                  className="flex flex-col items-center gap-6 p-10 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#00E676]/40 hover:bg-[#00E676]/5 transition-all group"
                >
                    <ExternalLink className="w-10 h-10 text-[#00E676] group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                        <span className="block text-xs font-black text-white uppercase tracking-widest mb-1">Copy Webhook</span>
                        <span className="block text-[8px] text-white/20 uppercase font-bold">TRADINGVIEW / PINESCRIPT</span>
                    </div>
                </button>
            </div>

            <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>Handshake Authorization</span>
                <span className="text-[#00E676]">Active</span>
              </div>
              <div className="h-px bg-white/5" />
              <p className="text-[10px] leading-relaxed text-white/20 font-medium italic">These protocols ensure a secure, encrypted tunnel is maintained between your signal provider and our execution cluster.</p>
            </div>
          </div>
          
          <div className="px-10 py-8 bg-black/60 border-t border-white/5 flex justify-between items-center">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Institutional Grade Bridge</span>
            <button onClick={onClose} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-black uppercase rounded-xl transition-all">Close Dashboard</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
