'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Search as SearchIcon, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Layers, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Target,
  BarChart3,
  LineChart,
  Check,
  Plus
} from 'lucide-react';

interface AssetDiscoveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brokerType: string;
  selectedAssets: string[];
  onAssetToggle: (symbol: string) => void;
  onPreviewSymbol: (symbol: string) => void;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Assets', icon: Globe },
  { id: 'CRYPTO', label: 'Crypto', icon: Zap },
  { id: 'INDEX', label: 'Indices', icon: Activity },
  { id: 'FOREX', label: 'ForeX', icon: TrendingUp },
  { id: 'COMMODITY', label: 'Commodities', icon: Layers },
  { id: 'EQUITY', label: 'Equity', icon: Target },
  { id: 'OPTIONS', label: 'Options', icon: Layers },
];

export default function AssetDiscoveryDrawer({
  isOpen,
  onClose,
  brokerType,
  selectedAssets,
  onAssetToggle,
  onPreviewSymbol
}: AssetDiscoveryDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [instruments, setInstruments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const dynamicCategories = useMemo(() => {
    const categories = [ { id: 'ALL', label: 'All Assets', icon: Globe } ];
    
    if (brokerType === 'BINANCE_FUTURES' || brokerType === 'BYBIT') {
      categories.push({ id: 'CRYPTO', label: 'Crypto', icon: Zap });
    } else if (brokerType === 'MT5') {
      categories.push({ id: 'FOREX', label: 'ForeX', icon: TrendingUp }, { id: 'INDEX', label: 'Indices', icon: Activity }, { id: 'COMMODITY', label: 'Commodities', icon: Layers });
    } else if (brokerType === 'ZERODHA' || brokerType === 'ANGELONE') {
      categories.push({ id: 'EQUITY', label: 'Equity', icon: Target }, { id: 'OPTIONS', label: 'Options', icon: Layers }, { id: 'INDEX', label: 'Indices', icon: Activity });
    }
    
    return categories;
  }, [brokerType]);

  useEffect(() => {
    if (isOpen) {
      fetchInstruments();
      setActiveCategory('ALL');
    }
  }, [isOpen, brokerType]);
  const fetchInstruments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/broker/instruments?brokerType=${brokerType}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setInstruments(data);
      }
    } catch (err) {
      console.error('Failed to fetch instruments:', err);
    } finally {
      setLoading(false);
    }
  };
  const filteredInstruments = useMemo(() => {
    // High-performance filtering for 10k+ items: Search threshold
    if (searchQuery.length > 0 && searchQuery.length < 2) return [];

    return instruments.filter(inst => {
      const matchesSearch = searchQuery.length === 0 || 
                           (inst.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inst.displayName?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'ALL' || inst.type === activeCategory;
      return matchesSearch && matchesCategory;
    }).slice(0, 100); // Limit visible results for UI performance
  }, [instruments, searchQuery, activeCategory]);

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
            className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[300] bg-[#0D121F] border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#FFD700]/10 rounded-xl">
                  <Target className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-white tracking-tight">Asset Discovery</h2>
                   <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">Select your Mirror Targets</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-all group"
              >
                <X className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Search Bar Container */}
            <div className="p-6 space-y-6">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                     <SearchIcon className="w-4 h-4 text-white/20 group-focus-within:text-[#FFD700] transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search Symbols (e.g. BTC, Gold, Nifty)..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-[#FFD700]/40 transition-all font-sans placeholder:text-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>

               {/* Categories Selector */}
                   <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                      {dynamicCategories.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeCategory === cat.id ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-lg shadow-[#FFD700]/10' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'}`}
                        >
                          <cat.icon className="w-3 h-3" />
                          {cat.label}
                        </button>
                      ))}
                   </div>
            </div>

            {/* Assets List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 no-scrollbar">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-64 space-y-4 opacity-20">
                    <div className="w-8 h-8 border-t-2 border-[#FFD700] rounded-full animate-spin" />
                    <span className="text-[10px] uppercase font-black tracking-widest italic">Scanning Exchange...</span>
                 </div>
               ) : filteredInstruments.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 space-y-4 opacity-20">
                    <Search className="w-12 h-12" />
                    <span className="text-[10px] uppercase font-black tracking-widest italic text-center max-w-[200px]">No assets found for your criteria</span>
                 </div>
               ) : (
                 filteredInstruments.map(inst => {
                   const isSelected = selectedAssets.includes(inst.symbol);
                   return (
                     <div 
                        key={inst.symbol}
                        className={`group relative p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${isSelected ? 'bg-[#FFD700]/5 border-[#FFD700]/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'}`}
                        onClick={() => onAssetToggle(inst.symbol)}
                     >
                        <div className="flex items-center gap-4 flex-1">
                           <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/20 transition-all" onClick={(e) => { e.stopPropagation(); onPreviewSymbol(inst.symbol); }}>
                              <LineChart className={`w-4 h-4 ${isSelected ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-[#FFD700]'}`} />
                           </div>
                           <div className="flex flex-col gap-0.5">
                              <span className="text-[12px] font-semibold text-white tracking-tight">{inst.displayName || inst.symbol}</span>
                              <span className="text-[9px] font-medium text-white/30 uppercase tracking-widest">{inst.symbol} • {inst.type}</span>
                           </div>
                        </div>

                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isSelected ? 'bg-[#00E676]/20 border-[#00E676]/40 text-[#00E676]' : 'bg-white/5 border-white/10 text-white/10 group-hover:border-white/20'}`}>
                           {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                     </div>
                   );
                 })
               )}
            </div>

            {/* Footer Summary */}
            <div className="p-6 md:p-8 bg-black/40 border-t border-white/10 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Whitelisted Targets</span>
                     <span className="text-xl font-bold text-white">{selectedAssets.length} Assets selected</span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-[#FFD700] text-black rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10"
                  >
                    Confirm & Sync
                  </button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
