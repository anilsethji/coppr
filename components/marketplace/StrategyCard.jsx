'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, BarChart3, PlayCircle, Zap, ArrowUpRight, TrendingUp, Star } from 'lucide-react';

export default function StrategyCard({ strategy, isOwned, onCardClick, onCreatorClick }) {
  const Icon = strategy.type === 'MT5_EA' ? Bot : strategy.type === 'PINE_SCRIPT_WEBHOOK' ? PlayCircle : BarChart3;
  
  const isOfficial = strategy.is_official || strategy.creator_id === '00000000-0000-0000-0000-000000000000' || strategy.name?.toLowerCase().includes('coppr');
  
  // Theme selection: Priority to official gold, then custom theme_color, then type-based defaults
  const themeAccent = isOfficial ? '#FFD700' : (strategy.theme_color || (
    strategy.type === 'MT5_EA' ? '#FFD700' : 
    strategy.type === 'PINE_SCRIPT_WEBHOOK' ? '#00B0FF' : 
    '#9C6EFA'
  ));
  
  const accentColor = themeAccent;
  
  const creator = isOfficial ? { display_name: 'Coppr Labs', handle: 'coppr', is_verified: true, avatar_type: 'INITIALS', avatar_data: '#FFD700|#FFA500' } : (strategy.creator_profiles || {});

  const handleAction = (e) => {
    e.stopPropagation();
    if (isOwned) {
        window.location.href = '/dashboard/bots';
        return;
    }

    if (strategy.tier === 'FREE') {
        window.location.href = `/checkout/instant?strategy_id=${strategy.id}`;
        return;
    }

    window.location.href = `/dashboard/marketplace/${strategy.id}`;
  };

  const getButtonLabel = () => {
    if (isOwned) return 'DASHBOARD';
    if (strategy.tier === 'FREE') return 'ACTIVATE';
    return 'SUBSCRIBE';
  };

  // Visual type selection logic
  const renderVisual = () => {
    // Chart line - always rendered on top regardless of thumbnail
    const chartLine = (strategy.type === 'MT5_EA' || isOfficial) ? (
      <svg className="absolute inset-0 w-full h-full opacity-70 z-[2]" viewBox="0 0 200 120" preserveAspectRatio="none">
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="fill-none stroke-[2.5]" 
          style={{ stroke: accentColor }} 
          d="M0 100 L20 85 L40 90 L60 65 L80 75 L100 45 L120 55 L140 30 L160 40 L180 15 L200 20" 
        />
        <path d="M0 100 L20 85 L40 90 L60 65 L80 75 L100 45 L120 55 L140 30 L160 40 L180 15 L200 20 V120 H0 Z" fill={`url(#grad-${strategy.id})`} opacity="0.15" />
        <defs>
           <linearGradient id={`grad-${strategy.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor={accentColor} />
             <stop offset="100%" stopColor="transparent" />
           </linearGradient>
        </defs>
      </svg>
    ) : strategy.type === 'INDICATOR' ? (
      <div className="absolute inset-0 grid grid-cols-7 gap-1 p-4 opacity-40 z-[2]">
        {Array.from({ length: 21 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: i * 0.02 }}
            className="h-3 rounded-sm self-end" 
            style={{ backgroundColor: i % 3 === 0 ? accentColor : i % 5 === 0 ? '#FF4757' : 'rgba(255,255,255,0.05)' }} 
          />
        ))}
      </div>
    ) : (
      <svg className="absolute inset-0 w-full h-full opacity-40 z-[2]" viewBox="0 0 200 120">
        {[20, 50, 80, 110, 140, 170].map((x, i) => (
            <motion.circle 
                key={i} 
                initial={{ opacity: 0, r: 0 }} 
                animate={{ opacity: 1, r: i % 2 === 0 ? 4 : 2.5 }} 
                transition={{ delay: i * 0.1 }}
                cx={x} cy={40 + (i * 12)} 
                fill={i % 3 === 0 ? '#FF4757' : accentColor} 
            />
        ))}
      </svg>
    );

    return (
      <>
        {/* Thumbnail as background if set */}
        {strategy.thumbnail_url && (
          <div className="absolute inset-0 z-[1]">
            <img src={strategy.thumbnail_url} className="w-full h-full object-cover opacity-20" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080C14] opacity-90" />
          </div>
        )}
        {/* Always render the themed chart line on top */}
        {chartLine}
      </>
    );
  }

  const renderAvatar = () => {
    if (creator.avatar_type === 'PHOTO') return <img src={creator.avatar_data} className="w-full h-full object-cover" />;
    if (creator.avatar_type === 'INITIALS') {
        const [gs, ge] = creator.avatar_data?.split('|') || ['#FFD700', '#FFA500'];
        return <div className="w-full h-full flex items-center justify-center text-[7px] font-black uppercase italic" style={{ background: `linear-gradient(135deg, ${gs}, ${ge})` }}>{creator.display_name?.slice(0,2).toUpperCase()}</div>;
    }
    return <div className="w-full h-full flex items-center justify-center text-xs" style={{ background: 'rgba(255,255,255,0.05)' }}>{creator.avatar_data || '🤖'}</div>;
  }

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onCardClick(strategy.id)}
      className={`group w-full rounded-[24px] bg-[#0D121F]/60 border overflow-hidden cursor-pointer backdrop-blur-md transition-all duration-500 hover:shadow-2xl ${isOfficial ? 'border-[#FFD700]/30 border-b-[#FFD700]/50 hover:border-[#FFD700]/40 shadow-[#FFD700]/5' : 'border-white/5 border-b-white/10 hover:border-white/15'}`}
    >
      {/* Banner / Visual */}
      <div className="relative h-[130px] w-full bg-white/[0.02] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D121F] to-transparent z-1" />
        
        {/* Glow Blob */}
        <div className={`absolute -top-12 -right-12 w-[160px] h-[160px] rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${isOfficial ? 'bg-[#FFD700]' : 'bg-transparent'}`} style={!isOfficial ? { backgroundColor: accentColor } : {}} />

        {renderVisual()}

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex gap-2 pt-0.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border flex items-center gap-1.5 ${isOfficial ? 'bg-[#FFD700] text-black border-[#FFD700]' : ''}`} style={!isOfficial ? { color: accentColor, backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` } : {}}>
              {isOfficial && <Zap className="w-2.5 h-2.5 shadow-sm" />}
              {isOfficial ? 'Coppr Labs Official' : strategy.type.replace('_', ' ')}
            </span>
            {strategy.total_subscribers > 50 && !isOfficial && (
                <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-orange-500/10 border border-orange-500/30 text-orange-500">POPULAR</span>
            )}
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
            <span className="text-[7px] font-black text-white uppercase tracking-widest leading-none">Market Node</span>
          </div>
        </div>

        {/* Creator Strip */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 group/creator" onClick={(e) => { e.stopPropagation(); onCreatorClick(creator.handle); }}>
            <div className="w-6 h-6 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {renderAvatar()}
            </div>
            <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-black uppercase italic tracking-tighter transition-colors ${isOfficial ? 'text-[#FFD700]' : 'text-white/60 group-hover/creator:text-white'}`}>{creator.display_name}</span>
                {creator.is_verified && <div className="w-3 h-3 rounded-full bg-[#FFD700] flex items-center justify-center text-[7px] text-black font-black shadow-md">✓</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
            <h3 className={`text-base font-black uppercase italic tracking-widest truncate mb-1.5 transition-colors ${isOfficial ? 'text-[#FFD700]' : 'text-white'}`}>{strategy.name || 'Unnamed Strategy'}</h3>
            <div className="flex flex-wrap gap-2 opacity-40">
                <span className="text-[8px] px-1.5 py-1 rounded bg-white/5 border border-white/5 text-white/60 font-black uppercase tracking-widest italic">{strategy.symbol || 'MULTI'}</span>
                <span className="text-[8px] px-1.5 py-1 rounded bg-white/5 border border-white/5 text-white/60 font-black uppercase tracking-widest italic">{strategy.min_lot_size || 0.01} LOT</span>
                <span className="text-[8px] px-1.5 py-1 rounded bg-white/5 border border-white/5 text-white/60 font-black uppercase tracking-widest italic">{strategy.timeframe || 'M15'}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
            {[
                { l: 'Profit', v: `${strategy.win_rate}%`, c: accentColor },
                { l: 'Mirroring', v: strategy.total_trades, c: '#fff' },
                { l: 'Alpha', v: `+${strategy.avg_gain_pct}%`, c: '#00E676' }
            ].map((s, i) => (
                <div key={i} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-1">
                    <span className="text-[7px] uppercase font-black tracking-[0.2em] text-white/30">{s.l}</span>
                    <span className="text-[12px] font-black italic tracking-tighter leading-none" style={{ color: s.c }}>{s.v}</span>
                </div>
            ))}
        </div>

        {/* Win rate bar */}
        <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] italic">Mirror Precision</span>
                <span className="text-[9px] font-black italic" style={{ color: accentColor }}>{strategy.win_rate}% Reliability</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${strategy.win_rate}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full shadow-[0_0_8px_rgba(255,215,0,0.2)]" 
                    style={{ backgroundColor: accentColor }} 
                />
            </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-[7px] uppercase font-black tracking-[0.2em] text-white/20 italic">License Plan</span>
                <div className="flex items-baseline gap-1">
                    <span className={`text-base font-black italic leading-none ${isOfficial ? 'text-[#FFD700]' : 'text-white'}`}>₹{strategy.monthly_price_inr || 0}</span>
                    <span className="text-[8px] font-black text-white/20">/mo</span>
                </div>
            </div>
            <button 
                onClick={handleAction}
                className={`flex-1 py-3 rounded-xl text-black text-[11px] font-black uppercase italic tracking-widest hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-black/20 ${isOwned ? 'bg-[#00E676] shadow-[#00E676]/10' : 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]'}`}
            >
                {getButtonLabel()}
            </button>
        </div>
      </div>
    </motion.div>
  );
}
