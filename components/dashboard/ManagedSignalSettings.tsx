'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Activity,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ManagedSignalSettings() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!profile) return;

    const { data } = await supabase
      .from('strategies')
      .select('*')
      .eq('creator_id', profile.id)
      .order('created_at', { ascending: false });

    setStrategies(data || []);
    setLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return null;
  if (!strategies.length) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-2 border-[#FFD700] pl-8">
         <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Signal Bridge Protocol</h3>
         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-sans">Active Webhook endpoints for your algorithmic assets.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {strategies.map((s) => (
          <motion.div 
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-[32px] border transition-all overflow-hidden ${
              expandedId === s.id ? 'bg-white/[0.04] border-white/10' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            <div 
              className="p-6 md:p-8 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:bg-[#FFD700]/10 transition-colors">
                  <Activity className={`w-6 h-6 ${s.theme_color ? `text-[${s.theme_color}]` : 'text-[#FFD700]'}`} style={{ color: s.theme_color || '#FFD700' }} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest">{s.type}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{s.symbol}</span>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{s.name}</h4>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 {s.master_webhook_key && (
                    <div className="hidden md:flex flex-col items-end">
                       <span className="text-[8px] font-black text-[#00E676] uppercase tracking-widest bg-[#00E676]/10 px-2 py-0.5 rounded leading-none">Bridge Active</span>
                    </div>
                 )}
                 <ChevronDown className={`w-5 h-5 text-white/20 transition-transform ${expandedId === s.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedId === s.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 pb-8 overflow-hidden"
                >
                  <div className="pt-4 border-t border-white/5 space-y-6">
                    {!s.master_webhook_key ? (
                      <div className="p-6 bg-red-400/5 border border-red-400/10 rounded-2xl flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-red-400" />
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Master Signal Key has not been generated for this node. Contact protocol support.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em]">Webhook Bridge URL</label>
                          <div className="relative group">
                            <code className="block w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-[10px] text-white/60 font-mono break-all group-hover:border-[#FFD700]/30 transition-all">
                              {`https://coppr.in/api/bridge/${s.master_webhook_key}`}
                            </code>
                            <button 
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(`https://coppr.in/api/bridge/${s.master_webhook_key}`, `${s.id}-url`); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all shadow-xl backdrop-blur-md"
                            >
                              {copiedId === `${s.id}-url` ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em]">Master Secret Key</label>
                          <div className="relative group">
                            <code className="block w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white/40 font-mono break-all group-hover:border-[#FFD700]/30 transition-all">
                              {s.master_webhook_key}
                            </code>
                            <button 
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(s.master_webhook_key, `${s.id}-key`); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all shadow-xl backdrop-blur-md"
                            >
                              {copiedId === `${s.id}-key` ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Pine Script Format Block */}
                        <div className="md:col-span-2 space-y-4 pt-4">
                           <div className="flex items-center gap-3">
                              <Zap className="w-4 h-4 text-[#FFD700]" />
                              <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Recommended Pine Script JSON</h5>
                           </div>
                           <pre className="p-4 bg-black/60 border border-white/5 rounded-2xl text-[10px] font-mono text-white/30 leading-relaxed overflow-x-auto">
{`{
  "ticker": "{{ticker}}",
  "side": "{{strategy.order.action}}",
  "price": "{{strategy.order.price}}",
  "contracts": "{{strategy.order.contracts}}"
}`}
                           </pre>
                           <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]/40" />
                              <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Coppr dynamically maps these keys to standard execution logs.</p>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
