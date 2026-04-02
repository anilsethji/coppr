'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Check
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function VaultView() {
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [mt5Account, setMt5Account] = useState('');
  const [activating, setActivating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchVault();
  }, []);

  const fetchVault = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user_strategies joined with strategies
    const { data, error } = await supabase
      .from('user_strategies')
      .select(`
        *,
        strategy:strategies (*)
      `)
      .eq('user_id', user.id);

    if (data) setStrategies(data);
    setLoading(false);
  };

  const linkAccount = async (subscriptionId: string) => {
    if (!mt5Account) return;
    setActivating(true);
    try {
        const res = await fetch('/api/vault/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionId, mt5Account })
        });
        if (res.ok) {
            setLinkingId(null);
            fetchVault();
        }
    } catch (err) {
        console.error('Activation failed');
    } finally {
        setActivating(false);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest">Scanning Secure Vault...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <h2 className="text-3xl font-black text-white mb-2 italic">My Strategy Vault</h2>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">ACTIVE PROTOCOLS & AUTHORIZED TERMINALS</p>
        </div>
        <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
             <span className="text-[10px] font-black text-white/60 uppercase">AES-256 License Protection Active</span>
        </div>
      </div>

      {strategies.length === 0 ? (
          <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] p-20 text-center space-y-8">
              <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto border border-white/10">
                    <Lock className="w-8 h-8 text-white/10" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-white uppercase italic tracking-[0.1em]">Protocol Offline</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No active strategy licenses found in your encryption key</p>
              </div>
              <button 
                onClick={() => window.location.href = '/dashboard/marketplace'}
                className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl hover:scale-105 transition-all tracking-[0.2em]"
              >
                Browse Global Grid
              </button>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
            {strategies.map((sub) => (
                <motion.div 
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0D121F] border border-white/5 rounded-[40px] overflow-hidden group hover:border-[#FFD700]/20 transition-all flex flex-col"
                >
                    <div className="p-8 space-y-6 flex-1">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                    {sub.strategy.origin === 'OFFICIAL' ? <Zap className="w-7 h-7 text-[#FFD700]" /> : <Bot className="w-7 h-7 text-white/40" />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white leading-tight">{sub.strategy.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${sub.strategy.origin === 'OFFICIAL' ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-white/40'}`}>
                                            {sub.strategy.origin}
                                        </span>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${sub.strategy.tier === 'FREE' ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#00B0FF]/20 text-[#00B0FF]'}`}>
                                            {sub.strategy.tier}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Expires</p>
                                <p className="text-[11px] font-bold text-white/60">{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'LIFETIME'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Execution</p>
                                <div className="flex items-center gap-2">
                                     <Globe className="w-3 h-3 text-[#00E676]" />
                                     <span className="text-[10px] font-bold text-white/80 uppercase">{sub.strategy.mode === 'VPS_MANAGED' ? 'Cloud VPS' : 'Client Terminal'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Authorization</p>
                                <div className="flex items-center gap-2">
                                     <CheckCircle2 className={`w-3 h-3 ${sub.mt5_account_number ? 'text-[#00E676]' : 'text-orange-500'}`} />
                                     <span className="text-[10px] font-bold text-white/80 uppercase">{sub.mt5_account_number ? 'Authorized' : 'Pending Link'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Handshake Logic */}
                        <div className="pt-2">
                            {sub.strategy.mode === 'VPS_MANAGED' ? (
                                <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 p-4 rounded-2xl flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                         <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
                                         </span>
                                         <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">🟢 VPS SYNC ACTIVE</span>
                                     </div>
                                     <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Settings className="w-4 h-4 text-white/40" /></button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                     {linkingId === sub.id ? (
                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                                              <input 
                                                autoFocus
                                                type="text" 
                                                placeholder="Enter MT5 Account ID" 
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white outline-none focus:border-[#FFD700]/30"
                                                value={mt5Account}
                                                onChange={e => setMt5Account(e.target.value)}
                                              />
                                              <button onClick={() => linkAccount(sub.id)} disabled={activating} className="px-6 py-3 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-xl flex items-center justify-center min-w-[100px]">
                                                {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize'}
                                              </button>
                                         </motion.div>
                                     ) : (
                                         <button 
                                            onClick={() => {setLinkingId(sub.id); setMt5Account(sub.mt5_account_number || '');}}
                                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                                         >
                                            {sub.mt5_account_number ? `LINKED: ${sub.mt5_account_number}` : 'Handshake MT5 Account Number'}
                                            <PlusCircle className="w-4 h-4" />
                                         </button>
                                     )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interaction Bar */}
                    <div className="p-6 bg-white/[0.03] border-t border-white/5 space-y-4">
                        {sub.strategy.type === 'PINE_SCRIPT_WEBHOOK' && (
                            <div className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Signal Secret Key</span>
                                    {copiedKey === sub.signal_key ? <span className="text-[8px] font-black text-[#00E676] uppercase">Copied!</span> : null}
                                </div>
                                <div className="flex items-center gap-3">
                                    <code className="flex-1 text-[10px] text-white/40 truncate font-mono">{sub.signal_key}</code>
                                    <button onClick={() => copyKey(sub.signal_key)} className="p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-all">
                                        {copiedKey === sub.signal_key ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5 text-white/30" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Link 
                                href={sub.strategy.type === 'MT5_EA' ? `/api/strategies/download/${sub.strategy_id}` : '/docs/webhooks'}
                                prefetch={false}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.1em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all"
                            >
                                {sub.strategy.type === 'MT5_EA' ? <Download className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {sub.strategy.type === 'MT5_EA' ? 'Download Assets' : 'Configure Bridge'}
                            </Link>
                            <Link 
                                href={`/dashboard/marketplace/${sub.strategy_id}`}
                                className="aspect-square p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
          </div>
      )}

      {/* Security Notice */}
      <div className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Protocol Integrity Warning</h4>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-loose">
                    NEVER SHARE YOUR .EX5 FILES OR WEBHOOK ENCRYPTION KEYS. EACH BINARY IS WATERMARKED WITH YOUR ENCRYPTED USER ID. 
                    UNAUTHORIZED DISTRIBUTION WILL TRIGGER AN IMMEDIATE GLOBAL TERMINAL BAN AND LICENSE REVOCATION.
                </p>
            </div>
      </div>
    </div>
  );
}
