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
  ArrowUpRight,
  Monitor,
  Globe
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CreatorHandshakeTerminal from './CreatorHandshakeTerminal';
import QuickStartJourney from './QuickStartJourney';

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
    <div className="space-y-12 pb-20">
      <div className="space-y-4 border-l-2 border-[#FFD700] pl-8">
         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Signal Bridge Terminal</h3>
         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-sans">Zero-Code Indicator Configuration Management</p>
      </div>

      <QuickStartJourney type="creator" />

      <div className="grid grid-cols-1 gap-6">
        {strategies.map((s) => {
          const webhookUrl = `https://coppr.in/api/bridge/${s.master_webhook_key}`;
          const isExpanded = expandedId === s.id;

          return (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-[48px] border transition-all overflow-hidden ${
                isExpanded ? 'bg-white/[0.04] border-white/10 shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <div 
                className="p-8 md:p-10 flex items-center justify-between cursor-pointer group"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
              >
                <div className="flex items-center gap-8">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border border-white/5 shadow-inner transition-all ${isExpanded ? 'bg-[#FFD700]/10 border-[#FFD700]/20 scale-105' : 'bg-white/5'}`}>
                    {s.type === 'PINE_SCRIPT_WEBHOOK' ? <Zap className={`w-8 h-8 ${isExpanded ? 'text-[#00E676]' : 'text-white/20 group-hover:text-white/40'}`} /> : <Activity className={`w-8 h-8 ${isExpanded ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-white/40'}`} />}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${s.type === 'PINE_SCRIPT_WEBHOOK' ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
                        {s.type === 'PINE_SCRIPT_WEBHOOK' ? 'PineScript' : 'MT5 Bot'}
                      </span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.symbol}</span>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{s.name}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="hidden md:flex flex-col items-end">
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full leading-none ${
                            s.status === 'ACTIVE' ? 'bg-[#00E676]/10 text-[#00E676]' : 
                            s.status === 'PENDING' ? 'bg-[#FFD700]/10 text-[#FFD700]' : 
                            'bg-white/5 text-white/20'
                         }`}>
                            {s.status === 'ACTIVE' ? 'Bridge Active' : s.status === 'PENDING' ? 'Pending Clearance' : s.status}
                         </span>
                      </div>
                   </div>
                   <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]' : 'text-white/20 group-hover:text-white/60'}`}>
                      <ChevronDown className="w-5 h-5" />
                   </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-10 pb-12 overflow-hidden"
                  >
                    <div className="pt-10 border-t border-white/5 space-y-12">
                      {s.type === 'PINE_SCRIPT_WEBHOOK' ? (
                        <div className="space-y-12">
                           {/* 3-Step Fast Link Protocol (Vibe Coder Optimized) */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] space-y-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#FFD700] text-black flex items-center justify-center font-black text-[12px] italic">01</div>
                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Target Webhook</span>
                                 </div>
                                 <p className="text-[11px] text-white/20 font-bold leading-relaxed uppercase tracking-widest">
                                    Copy the direct bridge URL and paste it into TradingView's Webhook URL field.
                                 </p>
                                 <button 
                                    onClick={() => copyToClipboard(webhookUrl, `${s.id}-url`)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-3"
                                 >
                                    {copiedId === `${s.id}-url` ? <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> : <Globe className="w-4 h-4" />}
                                    {copiedId === `${s.id}-url` ? 'Link Copied' : 'Copy Webhook'}
                                 </button>
                              </div>

                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] space-y-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#00E676] text-black flex items-center justify-center font-black text-[12px] italic">02</div>
                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Handshake JSON</span>
                                 </div>
                                 <p className="text-[11px] text-white/20 font-bold leading-relaxed uppercase tracking-widest">
                                    Copy this JSON template and paste it directly into the TradingView Alert 'Message' box.
                                 </p>
                                 <button 
                                    onClick={() => copyToClipboard(`{"ticker": "{{ticker}}","side": "{{strategy.order.action}}","price": "{{close}}","id": "${s.id}"}`, `${s.id}-json`)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-3"
                                 >
                                    {copiedId === `${s.id}-json` ? <CheckCircle2 className="w-4 h-4 text-[#00E676]" /> : <Copy className="w-4 h-4" />}
                                    {copiedId === `${s.id}-json` ? 'JSON Copied' : 'Copy Message'}
                                 </button>
                              </div>

                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] space-y-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#00B0FF] text-black flex items-center justify-center font-black text-[12px] italic">03</div>
                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Verify Link</span>
                                 </div>
                                 <p className="text-[11px] text-white/20 font-bold leading-relaxed uppercase tracking-widest">
                                    Activate the Signal Listener below and trigger a manual alert from TV to confirm.
                                 </p>
                                 <div className="w-full py-4 bg-[#00B0FF]/10 rounded-2xl border border-[#00B0FF]/20 text-[10px] font-black uppercase tracking-widest text-[#00B0FF] flex items-center justify-center gap-3 italic">
                                    <Activity className="w-4 h-4 animate-pulse" /> Final Verification
                                 </div>
                              </div>
                           </div>

                           <CreatorHandshakeTerminal strategyId={s.id} webhookUrl={webhookUrl} />
                        </div>
                      ) : (
                        <div className="space-y-10">
                           <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
                              <div className="w-20 h-20 rounded-[30px] bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center shrink-0">
                                 <Monitor className="w-10 h-10 text-[#FFD700]" strokeWidth={1} />
                              </div>
                              <div className="flex-1 space-y-3">
                                 <h5 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Managed <span className="text-[#FFD700]">Fiber</span> Execution</h5>
                                 <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.1em] font-sans italic leading-relaxed">
                                    Your EA is hosted on our high-speed VPS network. Propagation to subscriber terminals is fully automated.
                                 </p>
                                 <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest font-mono text-[#00E676]/60">
                                    <span>Node: M-SHD-BETA</span>
                                    <span>Latency: 1.2ms</span>
                                    <span>Status: Heartbeat Stable</span>
                                 </div>
                              </div>
                              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] italic text-white/40 transition-all">Node Settings</button>
                           </div>
                        </div>
                      )}

                      <div className="p-6 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-[28px] flex items-center gap-4">
                         <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                         <p className="text-[10px] text-[#FFD700]/40 font-black uppercase tracking-[0.2em] italic">Protocols optimized for heartbeat reliability and broadcast integrity.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
