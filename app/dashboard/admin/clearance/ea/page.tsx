'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  Bot,
  FileCode,
  Loader2,
  ArrowLeft,
  Activity,
  Download,
  AlertTriangle,
  Eye,
  Image as LucideImage,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function EAClearance() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('strategies')
      .select(`
        *,
        creator_profiles (
          display_name,
          handle
        )
      `)
      .eq('status', 'PENDING')
      .eq('type', 'MT5_EA')
      .order('created_at', { ascending: false });

    setPending(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(id);
    const supabase = createClient();
    try {
        const { error } = await supabase
          .from('strategies')
          .update({ 
            status: action === 'APPROVE' ? 'ACTIVE' : 'REJECTED',
            is_public: action === 'APPROVE' ? true : false 
          })
          .eq('id', id);

        if (error) throw error;
        setPending(prev => prev.filter(s => s.id !== id));
    } catch (err) {
        console.error('Action failed');
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest italic font-sans">Syncing EA Protocol...</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
            <Link href="/dashboard/admin" className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Protocol Hub</span>
            </Link>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Managed EA Clearance Queue</h2>
            <p className="text-[10px] text-[#00E676] font-black uppercase tracking-[0.2em]">{pending.length} MT5 Bots Awaiting Approval</p>
        </div>
        <div className="px-6 py-2 bg-[#00E676]/5 border border-[#00E676]/10 rounded-full flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-[#00E676]" />
             <span className="text-[10px] font-black text-white/60 uppercase">Manual Integrity Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {pending.map((strat) => {
            const isExpanded = expandedId === strat.id;
            return (
              <motion.div 
                key={strat.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`bg-white/[0.02] border rounded-[40px] overflow-hidden transition-all shadow-2xl ${
                  isExpanded ? 'border-[#00E676]/40 bg-white/[0.04]' : 'border-white/5 hover:border-[#00E676]/20'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="p-10 flex-1 space-y-8">
                      <div className="flex items-start justify-between">
                          <div className="flex items-center gap-6">
                               <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5 text-white/20">
                                   <Bot className="w-8 h-8 text-[#00E676]" />
                               </div>
                               <div>
                                   <h3 className="text-2xl font-black text-white italic tracking-tight">{strat.name}</h3>
                                   <div className="flex items-center gap-3 mt-1">
                                       <span className="text-[10px] font-black text-[#00E676] uppercase tracking-widest">@{strat.creator_profiles?.handle}</span>
                                       <span className="w-1 h-1 rounded-full bg-white/10" />
                                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none bg-white/5 px-3 py-1.5 rounded-full">{strat.symbol}</span>
                                   </div>
                               </div>
                          </div>
                      </div>

                      <p className="text-sm text-white/30 font-bold uppercase tracking-wide leading-relaxed max-w-2xl italic">
                          {strat.description || 'No strategy documentation provided.'}
                      </p>

                      <div className="flex flex-wrap gap-4">
                          {strat.ea_file_url && (
                              <button className="px-5 py-3 bg-[#00E676]/5 rounded-2xl border border-[#00E676]/10 text-[10px] font-black text-[#00E676] uppercase tracking-widest italic flex items-center gap-3 hover:bg-[#00E676]/10 transition-all">
                                  <Download className="w-4 h-4" /> Download .EX5 Binary
                              </button>
                          )}
                          <button 
                            onClick={() => setExpandedId(isExpanded ? null : strat.id)}
                            className={`px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 transition-all ${
                              isExpanded ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <Eye className="w-4 h-4" /> {isExpanded ? 'Close Protocol Review' : 'Review Metadata'}
                          </button>
                          <div className="px-5 py-3 bg-red-500/5 rounded-2xl border border-red-500/10 text-[10px] font-black text-red-500 uppercase tracking-widest italic flex items-center gap-3">
                              <AlertTriangle className="w-4 h-4" /> Unsigned Code
                          </div>
                      </div>
                  </div>

                  <div className="bg-[#131929]/20 border-l border-white/5 p-10 flex flex-col justify-center gap-4 min-w-[280px]">
                      <button 
                          onClick={() => handleAction(strat.id, 'APPROVE')}
                          disabled={!!processingId}
                          className="w-full py-5 rounded-[24px] bg-[#00E676] text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-[#00E676]/10 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                          {processingId === strat.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Approve Listing</>}
                      </button>
                      <button 
                          onClick={() => handleAction(strat.id, 'REJECT')}
                          disabled={!!processingId}
                          className="w-full py-5 rounded-[24px] bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                          <XCircle className="w-5 h-5" /> Reject Bot
                      </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-black/20"
                    >
                      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* SCREENSHOTS */}
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.3em] flex items-center gap-2">
                             <LucideImage className="w-3 h-3" /> Visual Evidence
                           </h4>
                           <div className="grid grid-cols-3 gap-4">
                             {[0, 1, 2].map((idx) => (
                               <div key={idx} className="aspect-video rounded-2xl bg-white/5 border border-white/5 overflow-hidden group/img relative">
                                 {strat.screenshot_urls?.[idx] ? (
                                   <img src={strat.screenshot_urls[idx]} alt={`Preview ${idx}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-white/10">
                                      <LucideImage className="w-6 h-6" />
                                   </div>
                                 )}
                               </div>
                             ))}
                           </div>
                        </div>

                        {/* PROTOCOL POINTS */}
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.3em] flex items-center gap-2">
                             <Activity className="w-3 h-3" /> Strategic Protocol
                           </h4>
                           <div className="grid grid-cols-1 gap-3">
                             {(strat.how_it_works?.length > 0 ? strat.how_it_works : ['No specific logic points provided.']).map((point: string, i: number) => (
                               <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                  <div className="w-5 h-5 rounded-lg bg-[#00E676]/10 flex items-center justify-center text-[10px] font-black text-[#00E676] shrink-0">{i + 1}</div>
                                  <p className="text-[11px] text-white/60 font-bold uppercase italic tracking-wide">{point}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {pending.length === 0 && (
          <div className="p-24 border border-dashed border-white/5 rounded-[56px] text-center space-y-6">
              <Bot className="w-12 h-12 text-[#00E676]/20 mx-auto" />
              <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.3em] font-sans">Wait Protocol Active. Empty EA Queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
