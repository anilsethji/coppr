'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Bot, 
  Target, 
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';

interface BotSelectorDrawerProps {
  type: 'bot' | 'indicator';
  bots: any[];
  activeBotId?: string;
  onClose: () => void;
  onSelect: (bot: any) => void;
}

export default function BotSelectorDrawer({
  type,
  bots,
  activeBotId,
  onClose,
  onSelect
}: BotSelectorDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBots = useMemo(() => {
    return bots.filter(bot => {
      const matchesSearch = searchQuery.length === 0 || 
                           (bot.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            bot.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [bots, searchQuery]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Drawer */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#0D121F] border-l border-white/10 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${type === 'bot' ? 'bg-[#FFD700]/10' : 'bg-[#00B0FF]/10'}`}>
                {type === 'bot' ? <Bot className="w-6 h-6 text-[#FFD700]" /> : <Zap className="w-6 h-6 text-[#00B0FF]" />}
              </div>
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Select {type === 'bot' ? 'EA Bot' : 'Indicator'}</h2>
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1 italic">Switch active terminal node</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-full transition-all group"
            >
              <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Search Bar Container */}
          <div className="p-8">
             <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                   <Search className="w-4 h-4 text-white/20 group-focus-within:text-[#FFD700] transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Filter nodes..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[20px] pl-14 pr-8 py-5 text-[12px] font-black text-white outline-none focus:border-[#FFD700]/40 transition-all font-sans placeholder:text-white/10 uppercase tracking-widest"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          {/* Bots List */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4 no-scrollbar">
             {filteredBots.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 opacity-20">
                  <Activity className="w-12 h-12 mb-4" />
                  <span className="text-[10px] uppercase font-black tracking-widest italic text-center">No nodes found in directory</span>
               </div>
             ) : (
               filteredBots.map(bot => {
                 const isActive = bot.id === activeBotId;
                 return (
                   <motion.div 
                      key={bot.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative p-6 rounded-[28px] border transition-all flex items-center justify-between cursor-pointer ${isActive ? 'bg-[#FFD700]/10 border-[#FFD700]/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/20'}`}
                      onClick={() => onSelect(bot)}
                   >
                      <div className="flex items-center gap-5 flex-1">
                         <div className={`p-3 rounded-xl border border-white/5 ${isActive ? 'bg-[#FFD700]/20' : 'bg-white/5 group-hover:bg-white/10'} transition-all`}>
                            {type === 'bot' ? <Target className={`w-5 h-5 ${isActive ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-white/40'}`} /> : <Activity className={`w-5 h-5 ${isActive ? 'text-[#00B0FF]' : 'text-white/20 group-hover:text-white/40'}`} />}
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-black text-white uppercase italic tracking-tight">{bot.name}</span>
                            <div className="flex items-center gap-2">
                               <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-[#FFD700]' : 'text-white/20'}`}>{bot.symbol || 'Universal'}</span>
                               <span className="w-1 h-1 rounded-full bg-white/10" />
                               <span className="text-[8px] font-black text-white/10 uppercase tracking-widest italic">Institutional</span>
                            </div>
                         </div>
                      </div>

                      {isActive && (
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center shadow-xl shadow-[#FFD700]/20">
                           <Check className="w-4 h-4 text-black" strokeWidth={3} />
                        </div>
                      )}
                   </motion.div>
                 );
               })
             )}
          </div>

          {/* Footer Summary */}
          <div className="p-8 bg-black/40 border-t border-white/10">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[12px] text-white/20 uppercase italic">
                      {filteredBots.length}
                   </div>
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Nodes Cataloged</span>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:text-white hover:border-white/20"
                >
                  Close Directory
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
