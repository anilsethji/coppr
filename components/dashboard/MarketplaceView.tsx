'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ArrowUpDown, LayoutGrid, Search, Loader2 } from 'lucide-react';
import JourneyBar from '@/components/marketplace/JourneyBar';
import StrategyCard from '@/components/marketplace/StrategyCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscriptions } from '@/hooks/useSubscriptions';

export function MarketplaceView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';
  const { isSubscribed } = useSubscriptions();
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState('winRate');
  const [search, setSearch] = useState('');

  const fetchStrategies = useCallback(async (pageNum = 1, isForward = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        type: filter,
        sort: sort,
        page: pageNum.toString(),
        limit: '9'
      });

      const res = await fetch(`/api/marketplace/list?${params}`);
      const data = await res.json();

      if (pageNum === 1) {
        setStrategies(data.strategies || []);
        setHasMore(data.hasMore);
      } else {
        setStrategies(prev => [...prev, ...(data.strategies || [])]);
        setHasMore(data.hasMore);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Failed to fetch strategies:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    setPage(1);
    fetchStrategies(1);
  }, [filter, sort, fetchStrategies]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStrategies(nextPage);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/marketplace/${id}`);
  };

  const handleCreatorClick = (handle: string) => {
    router.push(`/dashboard/creator/${handle}`);
  };

  return (
    <div className="space-y-4 pb-20">
      <JourneyBar currentStep={0} />

      {/* Header & Filter Row */}
      <div className="flex flex-col gap-6 sticky top-[72px] z-30 pt-4 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
                <LayoutGrid className="w-5 h-5 text-[#FFD700]" />
                <h1 className="text-[26px] font-extrabold tracking-tight text-white leading-none">Strategy Marketplace</h1>
            </div>
            <p className="text-[13px] text-white/40 font-medium">Discover trusted trading bots and indicators from verified creators.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group/search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within/search:text-[#FFD700] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search strategy..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-[#FFD700]/30 focus:bg-white/[0.05] transition-all w-full md:w-[220px]" 
                />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          {/* Main Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-2xl border border-white/5 w-fit">
            {['All', 'MT5 EA', 'Pine Script', 'Indicators', 'Coppr Originals'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-black tracking-widest uppercase px-5 py-2 rounded-xl transition-all ${
                  filter === f 
                    ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 shadow-[0_5px_15px_rgba(255,215,0,0.05)]' 
                    : 'text-white/30 hover:text-white/60 hover:bg-white/5 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[9px] text-white/15 uppercase tracking-[0.2em] font-black mr-2">
                <ArrowUpDown className="w-3 h-3" />
                Sort By
            </div>
            {(['winRate', 'roi', 'newest', 'subscribers']).map(s => (
                <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        sort === s 
                        ? 'bg-white/10 border-white/20 text-[#FFD700]' 
                        : 'border-transparent text-white/25 hover:text-white/50 hover:bg-white/5'
                    }`}
                >
                    {s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="min-h-[400px]">
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[380px] rounded-[20px] bg-white/[0.02] border border-white/5 animate-pulse" />
                ))}
            </div>
        ) : strategies.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {strategies.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((strat, i) => (
                            <motion.div
                                layout
                                key={strat.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2, delay: i * 0.05 }}
                            >
                                <StrategyCard 
                                    strategy={strat} 
                                    isOwned={isSubscribed(strat.id)}
                                    onCardClick={handleCardClick} 
                                    onCreatorClick={handleCreatorClick} 
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="btn-ghost flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-[#FFD700]/30 transition-all text-white/60 hover:text-[#FFD700]"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Load More'
                            )}
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-[32px] border border-white/5 border-dashed">
                <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-4">
                    <LayoutGrid className="w-8 h-8 text-white/5" />
                </div>
                <h3 className="text-lg font-bold text-white/40">No strategies matching your filters</h3>
                <p className="text-[12px] text-white/20 mt-1 mb-6">Try adjusting your category or sorting criteria.</p>
                <button onClick={() => { setFilter('All'); setSort('winRate'); setSearch(''); }} className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] underline underline-offset-8">Clear all filters</button>
            </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-16 pt-10 border-t border-white/5 text-center px-4 max-w-2xl mx-auto">
        <p className="text-[10px] text-white/10 leading-relaxed font-medium uppercase tracking-[0.05em]">
          All stats from live executed trades — not backtests. Past performance does not guarantee future results. 
          Algorithmic trading involves high risk of capital loss. Not financial advice. Not SEBI registered. 
          Protect your capital through proper risk allocation.
        </p>
      </div>
    </div>
  );
}
