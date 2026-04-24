'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Quote, 
  BadgeCheck, 
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';

interface BotTrustHubProps {
  isOpen: boolean;
  onClose: () => void;
  botName: string;
  reviews: any[];
}

export default function BotTrustHub({ isOpen, onClose, botName, reviews }: BotTrustHubProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#06080E] border-l border-[#00E676]/20 flex flex-col shadow-2xl z-[610]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#00E676]/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00E676]/10 rounded-2xl border border-[#00E676]/20">
                  <ShieldCheck className="w-6 h-6 text-[#00E676]" />
                </div>
                <div>
                   <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Trust Hub</h2>
                   <p className="text-[10px] text-[#00E676] font-black uppercase tracking-[0.2em] mt-1 italic">Verified Customer Narratives</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-all group"
              >
                <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Smart Summary */}
            <div className="p-8 space-y-6">
               <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-between overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">Global Sentiment</p>
                     <p className="text-3xl font-black text-white italic tracking-tighter leading-none mt-2">Excellent</p>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1.5 justify-end">
                        <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                        <span className="text-xl font-black text-white">4.9</span>
                     </div>
                     <p className="text-[9px] font-black text-[#00E676] uppercase tracking-widest mt-1 italic">Verified Score</p>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#00E676]" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Verified Logs ({reviews.length})</span>
               </div>
            </div>

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4 no-scrollbar">
               {reviews.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 opacity-20">
                    <Activity className="w-12 h-12 mb-4" />
                    <span className="text-[10px] uppercase font-black tracking-widest italic text-center">No verified narratives cataloged for this node</span>
                 </div>
               ) : (
                 reviews.map((rev, i) => (
                   <motion.div 
                      key={rev.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#00E676]/20 transition-all group relative overflow-hidden"
                   >
                      <div className="absolute top-4 right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                         <Quote className="w-10 h-10 text-[#00E676]" />
                      </div>

                      <div className="flex items-center justify-between mb-4">
                         <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                               <Star key={j} className={`w-2.5 h-2.5 ${j < rev.rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-white/10'}`} />
                            ))}
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#00E676]/10 border border-[#00E676]/20 rounded-full">
                            <BadgeCheck className="w-3 h-3 text-[#00E676]" />
                            <span className="text-[8px] font-black text-[#00E676] uppercase tracking-widest italic">Verified</span>
                         </div>
                      </div>

                      <p className="text-[12px] text-white/50 font-medium italic leading-relaxed mb-6">"{rev.comment}"</p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white leading-none uppercase italic">{rev.profiles?.full_name || 'Anonymous User'}</span>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">
                               {new Date(rev.created_at).toLocaleDateString()}
                            </span>
                         </div>
                         <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-[#00E676]/20 transition-all">
                            <TrendingUp className="w-4 h-4 text-[#00E676]/40 group-hover:text-[#00E676] transition-all" />
                         </div>
                      </div>
                   </motion.div>
                 ))
               )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-black/40 border-t border-[#00E676]/10">
               <div className="p-6 bg-[#00E676]/10 border border-[#00E676]/20 rounded-[28px] flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black text-white uppercase italic leading-none">Guaranteed Integrity</p>
                     <p className="text-[8px] font-black text-[#00E676] uppercase tracking-[0.2em] mt-1.5 leading-none">Smart Trust Protocol Active</p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-[#00E676]/30" />
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
