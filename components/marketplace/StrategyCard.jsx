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

  // --- Institutional Chart Engine (Deterministic Pattern Generator) ---
  const getDeterministicPath = () => {
    // Generate a simple hash from ID to select one of 20 patterns
    const hash = strategy.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const patternType = hash % 20;
    
    // Seeded "randoms" for path variation
    const r1 = (hash % 10) / 10;
    const r2 = ((hash >> 2) % 10) / 10;
    
    let path = "M 0 100 ";
    
    switch (patternType) {
      case 0: // Parabolic Bull
        path += `Q 80 ${90 - r1*20}, 200 ${10 + r2*15}`;
        break;
      case 1: // Consolidation Breakout
        path += `L 80 ${95 - r1*5} L 120 ${85 - r2*10} Q 160 80, 200 20`;
        break;
      case 2: // Staircase / Step-up
        path += `L 40 100 L 40 70 L 80 70 L 80 40 L 120 40 L 120 20 L 200 20`;
        break;
      case 3: // Volatile Recovery (V-Shape)
        path += `L 60 110 L 100 80 L 140 100 L 200 10`;
        break;
      case 4: // Steady Channel Uptrend
        path += `L 40 85 L 80 95 L 120 70 L 160 80 L 200 50`;
        break;
      case 5: // Double Bottom Reversal
        path += `Q 30 115, 60 90 Q 90 115, 120 80 L 200 15`;
        break;
      case 6: // Bull Flag
        path += `L 60 30 L 100 50 L 140 40 L 200 5`;
        break;
      case 7: // Rounded Accumulation
        path += `C 50 110, 150 110, 200 30`;
        break;
      case 8: // Triple Tap
        path += `L 40 60 L 60 90 L 100 50 L 120 80 L 160 30 L 180 50 L 200 10`;
        break;
      case 9: // Aggressive Spike
        path += `L 100 95 L 110 10 L 120 30 L 200 15`;
        break;
      case 10: // Rising Wedge
        path += `L 50 80 L 80 90 L 130 60 L 160 70 L 200 45`;
        break;
      case 11: // S-Curve
        path += `C 40 100, 60 20, 100 60 C 140 110, 160 10, 200 10`;
        break;
      case 12: // Geometric Growth
        path += `L 100 100 L 100 50 L 200 50 L 200 10`;
        break;
      case 13: // Momentum Pulse
        path += `Q 40 90, 80 40 T 140 30 T 200 10`;
        break;
      case 14: // Fibonacci Arc (simulated)
        path += `Q 100 120, 200 30`;
        break;
      case 15: // Gap Up & Hold
        path += `L 60 100 M 60 40 L 200 40`;
        break;
      case 16: // Support Bounce
        path += `L 50 105 L 100 95 L 150 105 L 200 10`;
        break;
      case 17: // Clean Linear
        path += `L 200 ${10 + r1*20}`;
        break;
      case 18: // Low Vol Drift
        path += `L 50 90 L 100 95 L 150 85 L 200 75`;
        break;
      case 19: // Late Session Blast
        path += `L 150 90 Q 170 80, 200 5`;
        break;
      default:
        path += `L 200 20`;
    }
    
    return path;
  };

  // Visual type selection logic
  const renderVisual = () => {
    const isFallback = !strategy.thumbnail_url;
    const pathData = getDeterministicPath();
    
    // Professional Theme Constants
    const chartColor = isOfficial ? '#10B981' : (accentColor || '#3B82F6');
    const areaId = `area-${strategy.id}`;

    const institutionalChart = (
      <div className="absolute inset-0 z-[2] overflow-hidden bg-[#0D121F]">
        <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id={areaId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="2" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Elegant Horizontal Reference Lines */}
          {[20, 50, 80].map(y => (
             <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
          ))}

          {/* Area Fill */}
          <path 
            d={`${pathData} V 120 H 0 Z`} 
            fill={`url(#${areaId})`} 
          />

          {/* Sleek Price Line */}
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={pathData}
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          {/* Price Tip Node */}
          <motion.circle 
            animate={{ r: [2, 3, 2] }}
            transition={{ duration: 2, repeat: Infinity }}
            cx="200" cy={pathData.endsWith(' 20') ? 20 : (pathData.match(/[\d.]+$/)?.[0] || 20)} 
            r="2.5" fill={chartColor} 
          />
        </svg>
      </div>
    );

    return (
      <>
        {/* Thumbnail as background if set */}
        {strategy.thumbnail_url ? (
          <div className="absolute inset-0 z-[1]">
            <img src={strategy.thumbnail_url} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D121F] opacity-90" />
            
            {/* Minimal line overlay for screenshots */}
            <svg className="absolute inset-0 w-full h-full opacity-40 z-[2]" viewBox="0 0 200 120" preserveAspectRatio="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                d="M 0 100 Q 50 80, 100 90 T 200 20"
                fill="none" stroke={chartColor} strokeWidth="1.5"
              />
            </svg>
          </div>
        ) : (
          institutionalChart
        )}
      </>
    );
  }

  const renderAvatar = () => {
    if (creator.avatar_type === 'PHOTO') return <img src={creator.avatar_data} className="w-full h-full object-cover" />;
    if (creator.avatar_type === 'INITIALS') {
        const [gs, ge] = creator.avatar_data?.split('|') || ['#FFD700', '#FFA500'];
        return <div className="w-full h-full flex items-center justify-center text-[7px] font-black uppercase  
" style={{ background: `linear-gradient(135deg, ${gs}, ${ge})` }}>{creator.display_name?.slice(0,2).toUpperCase()}</div>;
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
                <span className={`text-[11px] font-black uppercase tracking-tighter transition-colors ${isOfficial ? 'text-[#FFD700]' : 'text-white/60 group-hover/creator:text-white'}`}>{creator.display_name}</span>
                {creator.is_verified && <div className="w-3 h-3 rounded-full bg-[#FFD700] flex items-center justify-center text-[7px] text-black font-black shadow-md">✓</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 space-y-4">
        <div>
            <h3 className={`text-sm md:text-base font-black uppercase tracking-widest truncate mb-1 transition-colors ${isOfficial ? 'text-[#FFD700]' : 'text-white'}`}>{strategy.name || 'Unnamed Strategy'}</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2 opacity-40">
                <span className="text-[7px] md:text-[8px] px-1.5 py-1 rounded bg-white/5 border border-white/5 text-white/60 font-black uppercase tracking-widest  
">{strategy.symbol || 'MULTI'}</span>
                <span className="text-[7px] md:text-[8px] px-1.5 py-1 rounded bg-white/5 border border-white/5 text-white/60 font-black uppercase tracking-widest  
">{strategy.min_lot_size || 0.01} LOT</span>
                <span className="text-[7px] md:text-[8px] px-1.5 py-1 rounded bg-white/5 border border-white/5 text-white/60 font-black uppercase tracking-widest  
">{strategy.timeframe || 'M15'}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
                { l: 'Profit', v: `${strategy.win_rate}%`, c: accentColor },
                { l: 'Mirror', v: strategy.total_trades, c: '#fff' },
                { l: 'Alpha', v: `+${strategy.avg_gain_pct}%`, c: '#00E676' }
            ].map((s, i) => (
                <div key={i} className="p-1.5 md:p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-0.5 md:gap-1">
                    <span className="text-[6px] md:text-[7px] uppercase font-black tracking-[0.2em] text-white/30">{s.l}</span>
                    <span className="text-[10px] md:text-[12px] font-black tracking-tighter leading-none" style={{ color: s.c }}>{s.v}</span>
                </div>
            ))}
        </div>

        {/* Win rate bar */}
        <div className="space-y-1.5 md:space-y-2 pt-1">
            <div className="flex justify-between items-center px-1">
                <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.2em]  
">Precision</span>
                <span className="text-[8px] md:text-[9px] font-black  
" style={{ color: accentColor }}>{strategy.win_rate}%</span>
            </div>
            <div className="w-full h-1 md:h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
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
        <div className="pt-3 md:pt-4 border-t border-white/5 flex items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col">
                <span className="text-[6px] md:text-[7px] uppercase font-black tracking-[0.2em] text-white/20  
">License</span>
                <div className="flex items-baseline gap-1">
                    <span className={`text-sm md:text-base font-black  
 leading-none ${isOfficial ? 'text-[#FFD700]' : 'text-white'}`}>₹{strategy.monthly_price_inr || 0}</span>
                    <span className="text-[7px] md:text-[8px] font-black text-white/20">/mo</span>
                </div>
            </div>
            <button 
                onClick={handleAction}
                className={`flex-1 py-2.5 md:py-3 rounded-xl text-black text-[9px] md:text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-black/20 ${isOwned ? 'bg-[#00E676] shadow-[#00E676]/10' : 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]'}`}
            >
                {getButtonLabel()}
            </button>
        </div>
      </div>
    </motion.div>
  );
}
