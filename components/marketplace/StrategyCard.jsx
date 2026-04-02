'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, BarChart3, PlayCircle, Zap, ArrowUpRight, TrendingUp, Star } from 'lucide-react';

export default function StrategyCard({ strategy, isOwned, onCardClick, onCreatorClick }) {
  const Icon = strategy.type === 'MT5_EA' ? Bot : strategy.type === 'PINE_SCRIPT_WEBHOOK' ? PlayCircle : BarChart3;
  
  // Theme selection: Priority to custom theme_color, then type-based defaults
  const themeAccent = strategy.theme_color || (
    strategy.type === 'MT5_EA' ? '#FFD700' : 
    strategy.type === 'PINE_SCRIPT_WEBHOOK' ? '#00B0FF' : 
    '#9C6EFA'
  );
  
  const accentColor = themeAccent;
  
  const creator = strategy.creator_profiles || {};

  const handleAction = (e) => {
    e.stopPropagation();
    if (isOwned) {
        window.location.href = '/dashboard/bots';
        return;
    }

    if (strategy.tier === 'FREE') {
        // Trigger Instant Activation API (Implementation pending in next step)
        window.location.href = `/checkout/instant?strategy_id=${strategy.id}`;
        return;
    }

    // Default: To Checkout
    window.location.href = `/dashboard/marketplace/${strategy.id}`;
  };

  const getButtonLabel = () => {
    if (isOwned) return 'MANAGE';
    if (strategy.tier === 'FREE') return 'GET ACCESS';
    return 'SUBSCRIBE';
  };

  // Visual type selection logic
  const renderVisual = () => {
    // Chart line - always rendered on top regardless of thumbnail
    const chartLine = strategy.type === 'MT5_EA' ? (
      <svg className="absolute inset-0 w-full h-full opacity-70 z-[2]" viewBox="0 0 200 120" preserveAspectRatio="none">
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="fill-none stroke-[2]" 
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
        return <div className="w-full h-full flex items-center justify-center text-[8px] font-black" style={{ background: `linear-gradient(135deg, ${gs}, ${ge})` }}>{creator.display_name?.slice(0,2).toUpperCase()}</div>;
    }
    return <div className="w-full h-full flex items-center justify-center text-xs" style={{ background: 'rgba(255,255,255,0.05)' }}>{creator.avatar_data || '🤖'}</div>;
  }

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => onCardClick(strategy.id)}
      className="group w-full rounded-[20px] bg-white/[0.03] border border-white/5 border-b-white/10 overflow-hidden cursor-pointer backdrop-blur-md transition-all duration-300 hover:bg-white/[0.05] hover:border-white/15"
    >
      {/* Banner / Visual */}
      <div className="relative h-[120px] w-full bg-white/[0.02] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] to-transparent z-1" />
        
        {/* Glow Blob */}
        <div className="absolute -top-12 -right-12 w-[120px] h-[120px] rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: accentColor }} />

        {renderVisual()}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border" style={{ color: accentColor, backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }}>
              {strategy.type.replace('_', ' ')}
            </span>
            {strategy.total_subscribers > 50 && (
                <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-orange-500/10 border border-orange-500/30 text-orange-500">POPULAR</span>
            )}
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <div className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[7px] font-black text-white/50 uppercase tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Creator Strip */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 group/creator" onClick={(e) => { e.stopPropagation(); onCreatorClick(creator.handle); }}>
            <div className="w-5 h-5 rounded-full border border-white/10 overflow-hidden flex items-center justify-center">
                {renderAvatar()}
            </div>
            <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-white group-hover/creator:underline">{creator.display_name}</span>
                {creator.is_verified && <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] flex items-center justify-center text-[6px] text-black font-black">✓</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3.5">
        <div>
            <h3 className="text-sm font-bold text-white mb-1 truncate">{strategy.name || 'Unnamed Strategy'}</h3>
            <div className="flex flex-wrap gap-1.5 opacity-60">
                <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase">{strategy.symbol || 'N/A'}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase">{strategy.min_lot_size || 0.01} LOT</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase">{strategy.timeframe || 'M15'}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
            {[
                { l: 'Win Rate', v: `${strategy.win_rate}%`, c: accentColor },
                { l: 'Trades', v: strategy.total_trades, c: '#fff' },
                { l: 'Avg Gain', v: `+${strategy.avg_gain_pct}%`, c: '#00E676' }
            ].map((s, i) => (
                <div key={i} className="p-1.5 rounded-lg bg-white/[0.04] border border-white/5 flex flex-col items-center">
                    <span className="text-[7px] uppercase font-black tracking-widest text-white/20 mb-1">{s.l}</span>
                    <span className="text-[10px] font-black" style={{ color: s.c }}>{s.v}</span>
                </div>
            ))}
        </div>

        {/* Win rate bar */}
        <div className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
                <span className="text-[8px] font-bold text-white/25 uppercase tracking-widest">Performance Reliability</span>
                <span className="text-[8px] font-bold" style={{ color: accentColor }}>{strategy.win_rate}% Accuracy</span>
            </div>
            <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${strategy.win_rate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: accentColor }} 
                />
            </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[7px] uppercase font-black tracking-widest text-white/20">Monthly Plan</span>
                <span className="text-[13px] font-black text-[#FFD700]">₹{strategy.monthly_price_inr || 0}</span>
            </div>
            <button 
                onClick={handleAction}
                className={`px-4 py-1.5 rounded-lg text-black text-[10px] font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FFD700]/10 ${isOwned ? 'bg-[#00E676] shadow-[#00E676]/10' : 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]'}`}
            >
                {getButtonLabel()}
            </button>
        </div>
      </div>
    </motion.div>
  );
}
