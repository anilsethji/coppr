'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Settings, 
  ExternalLink, 
  CheckCircle2, 
  Loader2,
  Cpu,
  Monitor,
  Zap
} from 'lucide-react';
import { downloadEAConfig } from '@/lib/utils/config-generator';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: any;
  subscription: any;
  onAccountLinked: (newAccountId: string) => void;
}

export default function ConnectModal({ isOpen, onClose, strategy, subscription, onAccountLinked }: ConnectModalProps) {
  const [mt5Account, setMt5Account] = useState(subscription?.mt5_account_number || '');
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(!!subscription?.mt5_account_number);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const handleLink = async () => {
    if (!mt5Account) return;
    setLinking(true);
    setStatus({ type: null, msg: '' });
    try {
      const res = await fetch('/api/vault/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id, mt5Account })
      });
      if (res.ok) {
        setLinked(true);
        setStatus({ type: 'success', msg: 'MT5 Account successfully linked to license!' });
        onAccountLinked(mt5Account);
      } else {
        const errorData = await res.json();
        setStatus({ type: 'error', msg: errorData.error || 'Failed to authorize account.' });
      }
    } catch (err) {
      console.error('Handshake error');
      setStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setLinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0A0E17] border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#FFD700]/10 text-[#FFD700]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase italic">Signal Matrix Sync</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{strategy.name} • Managed License</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Step 1: MT5 Linking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FFD700]">Step 1: Broker API Authorization</h4>
                {linked && (
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-[#00E676] uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Sync Active
                  </span>
                )}
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <p className="text-[11px] text-white/40 leading-relaxed font-medium">Link your secure Broker Account ID (MT5/Zerodha) to enable the Coppr Cloud Signal Matrix.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Account ID / API ID" 
                    value={mt5Account}
                    onChange={(e) => setMt5Account(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 text-sm text-white placeholder:text-white/10 outline-none focus:border-[#FFD700]/30 transition-colors"
                  />
                  <button 
                    onClick={handleLink}
                    disabled={linking || !mt5Account}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all disabled:opacity-30"
                  >
                    {linking ? <Loader2 className="w-4 h-4 animate-spin" /> : (linked ? 'Update Link' : 'Authorize')}
                  </button>
                </div>
                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[10px] font-bold uppercase tracking-wider ${status.type === 'success' ? 'text-[#00E676]' : 'text-[#FF4757]'}`}
                  >
                    {status.msg}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Step 2: Cloud Activation */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FFD700]">Step 2: Cloud Synchronization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#00E676]/10 to-transparent border border-[#00E676]/20 flex flex-col justify-between gap-6 group hover:border-[#00E676]/40 transition-all cursor-pointer">
                  <div className="space-y-2">
                    <div className="p-2 w-fit rounded-xl bg-black/40 text-[#00E676]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-black text-white uppercase italic">Active Mirroring</h5>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Execute signals directly from Coppr Cloud</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#00E676] uppercase tracking-widest">
                    Activate Protocol <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col justify-between gap-6 group hover:border-white/20 transition-all opacity-40">
                  <div className="space-y-2">
                    <div className="p-2 w-fit rounded-xl bg-black/40 text-white/30">
                      <Download className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-black text-white/30 uppercase italic">Local Assets (.ex5)</h5>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">For manual setup on private terminals</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Manual Access <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Support Link */}
            <div className="flex items-center justify-center pt-2">
              <a href="/dashboard/guides" className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-[#FFD700] transition-colors flex items-center gap-2">
                Need Help connecting to VPS? <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
