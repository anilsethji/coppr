'use client';

import React, { useState, useMemo } from 'react';
import { MarketplaceCard, StrategyType } from '@/components/dashboard/MarketplaceCard';

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
        price: s.is_premium ? 'Rs.999/mo' : 'Free', // Default or from DB if added
        roi: s.avg_gain,
        trades: s.trades_count,
        date: s.created_at
      };
    });
  }, [initialStrategies]);

  const filteredStrategies = useMemo(() => {
    let list = [...strategies];
    
    // Filter
    if (filter !== 'All') {
      list = list.filter(s => {
        if (filter === 'MT5 EA') return s.type === 'MT5 EA' || s.type === 'Scalping' || s.type === 'Protection' || s.type === 'Conservative';
        if (filter === 'Pine Script') return s.type === 'Pine Script' || s.type === 'Zerodha';
        if (filter === 'Indicators') return s.type === 'Pine Script';
        return true;
      });
    }

    // Sort
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
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight mb-1">Strategy Marketplace</h1>
          <p className="text-[13px] text-white/40">Live-tested bots and indicators. Real trades. Real results.</p>
        </div>

        {/* Custom Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full border border-white/10 w-fit">
          {['All', 'MT5 EA', 'Pine Script', 'Indicators'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${
                filter === f ? 'bg-brand-hot/20 text-brand-hot border border-brand-hot/30' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SORTING BAR */}
      <div className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Sort by:</span>
        <div className="flex items-center gap-2">
          {(['Win Rate', 'ROI', 'Total Trades', 'Newest'] as SortMode[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                sort === s ? 'bg-white/10 border-white/20 text-[#FFD700]' : 'border-transparent text-white/40 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map(strat => (
          <MarketplaceCard 
            key={strat.id}
            {...strat}
          />
        ))}
      </div>

      <div className="text-center mt-12 py-8 border-t border-white/5">
        <p className="text-[10px] text-white/20">
          All stats from live executed trades — not backtests. Past performance does not guarantee future results. Not financial advice.
        </p>
      </div>
    </div>
  );
}
