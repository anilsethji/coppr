'use client';

import React, { useState, useMemo } from 'react';
import { MarketplaceCard, StrategyType } from '@/components/dashboard/MarketplaceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Filter, ArrowUpDown } from 'lucide-react';

interface MarketplaceViewProps {
  initialStrategies: any[];
}

type SortMode = 'Win Rate' | 'ROI' | 'Total Trades' | 'Newest';

export function MarketplaceView({ initialStrategies }: MarketplaceViewProps) {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState<SortMode>('Win Rate');

  const strategies = useMemo(() => {
    return initialStrategies.map(s => {
      let visualType: StrategyType = 'MT5 EA';
      let badgeColor = '#00E676';
      let badgeText = s.type === 'indicator' ? 'Indicator' : 'MT5 EA';

      if (s.title.includes('RegressionX')) {
        visualType = 'MT5 EA';
        badgeText = 'NEW v2.1';
      } else if (s.title.includes('GoldScalper')) {
        visualType = 'Scalping';
        badgeColor = '#F5A623';
        badgeText = 'POPULAR';
      } else if (s.title.includes('Trend Filter')) {
        visualType = 'Pine Script';
        badgeColor = '#00B0FF';
        badgeText = 'Pine Script';
      } else if (s.title.includes('NewsFilter')) {
        visualType = 'Protection';
        badgeColor = '#9C6EFA';
        badgeText = 'MT5 EA';
      } else if (s.title.includes('StarterBot')) {
        visualType = 'Conservative';
        badgeColor = '#F5A623';
        badgeText = 'Beginner';
      } else if (s.title.includes('Momentum Algo')) {
        visualType = 'Zerodha';
        badgeColor = '#FF6B35';
        badgeText = 'Zerodha';
      }

      return {
        id: s.id,
        name: s.title,
        symbol: s.description,
        type: visualType,
        badge: { text: badgeText, color: badgeColor },
        stats: [
          { label: 'Win Rate', value: `${s.win_rate}%`, color: badgeColor },
          { label: s.prot_rate > 0 ? 'Protected' : 'Trades', value: s.prot_rate > 0 ? `${s.prot_rate}%` : s.trades_count.toString() },
          { label: 'Avg Gain', value: `+${s.avg_gain}%`, color: '#00E676' }
        ],
        winRate: s.win_rate,
        price: s.is_premium ? 'Rs.999/mo' : 'Free',
        roi: s.avg_gain,
        trades: s.trades_count,
        date: s.created_at
      };
    });
  }, [initialStrategies]);

  const filteredStrategies = useMemo(() => {
    let list = [...strategies];
    
    if (filter !== 'All') {
      list = list.filter(s => {
        if (filter === 'MT5 EA') return s.type === 'MT5 EA' || s.type === 'Scalping' || s.type === 'Protection' || s.type === 'Conservative';
        if (filter === 'Pine Script') return s.type === 'Pine Script' || s.type === 'Zerodha';
        if (filter === 'Indicators') return s.type === 'Pine Script';
        return true;
      });
    }

    list.sort((a, b) => {
      if (sort === 'Win Rate') return b.winRate - a.winRate;
      if (sort === 'ROI') return b.roi - a.roi;
      if (sort === 'Total Trades') return b.trades - a.trades;
      if (sort === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

    return list;
  }, [filter, sort, strategies]);

  return (
    <div className="space-y-8 pb-20">
      
      {/* PAGE HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="w-5 h-5 text-[#FFD700]" />
            <h1 className="text-[26px] font-extrabold tracking-tight text-white leading-none">Strategy Marketplace</h1>
          </div>
          <p className="text-[13px] text-white/40 font-medium">Live-tested bots and indicators. Real trades. Real results.</p>
        </div>

        {/* Custom Filters */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 w-fit shadow-inner">
          {['All', 'MT5 EA', 'Pine Script', 'Indicators'].map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-black tracking-widest uppercase px-5 py-2 rounded-xl transition-all ${
                filter === f 
                  ? 'bg-[#FFD700] text-[#080C14] shadow-[0_5px_15px_rgba(255,215,0,0.2)]' 
                  : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* SORTING BAR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between bg-white/[0.02] p-4 rounded-[20px] border border-white/5 backdrop-blur-md"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
            <Filter className="w-3 h-3" />
            Sort Execution
          </div>
          <div className="flex items-center gap-3">
            {(['Win Rate', 'ROI', 'Total Trades', 'Newest'] as SortMode[]).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  sort === s ? 'bg-white/10 border-white/10 text-[#FFD700]' : 'border-transparent text-white/30 hover:text-white/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-white/20">
          <ArrowUpDown className="w-3 h-3" />
          Descending Output
        </div>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredStrategies.map(strat => (
            <motion.div
              layout
              key={strat.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ 
                layout: { type: "spring", stiffness: 600, damping: 40 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
            >
              <MarketplaceCard {...strat} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12 py-10 border-t border-white/5"
      >
        <p className="text-[10px] text-white/15 font-medium tracking-widest uppercase mb-2">Protocol Disclaimer</p>
        <p className="text-[10px] text-white/10 max-w-[600px] mx-auto leading-relaxed">
          All stats from live executed trades — not backtests. Past performance does not guarantee future results. 
          Algorithmic trading involves high risk. Not financial advice. Protect your capital.
        </p>
      </motion.div>
    </div>
  );
}
