'use client';

import React, { useState } from 'react';

export type StrategyType = 'MT5 EA' | 'Scalping' | 'Pine Script' | 'Protection' | 'Conservative' | 'Zerodha';

interface MarketplaceCardProps {
  id: string;
  name: string;
  symbol: string;
  type: StrategyType;
  badge: { text: string; color: string };
  stats: { label: string; value: string; color?: string }[];
  winRate: number;
  price: string;
  isFollowing?: boolean;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  name, symbol, type, badge, stats, winRate, price, isFollowing: initialFollowing = false
}) => {
  const [following, setFollowing] = useState(initialFollowing);

  const renderVisual = () => {
    switch (type) {
      case 'MT5 EA':
        return (
          <div className="relative h-[110px] w-full bg-brand-green/10 flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E676" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                className="fill-none stroke-brand-green stroke-[1.5] animate-draw"
                style={{ strokeDasharray: 500, strokeDashoffset: 500 }}
                d="M0 80 L20 70 L40 65 L55 55 L70 58 L85 45 L100 40 L115 35 L130 28 L145 20 L160 15 L175 10 L200 8" 
              />
              <path d="M0 80 L20 70 L40 65 L55 55 L70 58 L85 45 L100 40 L115 35 L130 28 L145 20 L160 15 L175 10 L200 8 L200 90 L0 90 Z" fill="url(#sparkGradient)" />
            </svg>
            <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-white/50">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" /> LIVE
            </div>
          </div>
        );
      case 'Scalping':
        return (
          <div className="relative h-[110px] w-full bg-brand-hot/10 flex items-end justify-center gap-1.5 p-4 overflow-hidden">
             {[18, 12, 22, 8, 28, 16, 32, 20, 36].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-[1px] bg-white/20 h-2" />
                  <div 
                    className="w-2 rounded-sm" 
                    style={{ height: `${h}px`, backgroundColor: i % 3 === 1 ? '#FF4757' : '#00E676' }} 
                  />
                  <div className="w-[1px] bg-white/20 h-2" />
                </div>
             ))}
             <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-white/50">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" /> LIVE
            </div>
          </div>
        );
      case 'Pine Script':
        return (
          <div className="relative h-[110px] w-full bg-brand-pine/10 p-4">
             <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} className="h-3 rounded-sm" style={{ 
                    backgroundColor: [2, 5, 9, 13, 18].includes(i) ? 'rgba(255,71,87,0.4)' : 'rgba(0,230,118,0.6)'
                  }} />
                ))}
             </div>
             <div className="text-[9px] text-white/30 absolute bottom-2 right-4">Signal heatmap — last 21 days</div>
             <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-white/50">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" /> LIVE
            </div>
          </div>
        );
      case 'Protection':
        return (
          <div className="relative h-[110px] w-full bg-brand-purple/10 flex flex-col items-center justify-center pt-2">
            <svg width="100" height="70" viewBox="0 0 100 70">
              <path d="M10 65 A40 40 0 0 1 90 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
              <path d="M10 65 A40 40 0 0 1 90 65" fill="none" stroke="url(#purpleGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray="125" strokeDashoffset="12" className="animate-draw" />
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9C6EFA" />
                  <stop offset="100%" stopColor="#00B0FF" />
                </linearGradient>
              </defs>
              <text x="50" y="60" textAnchor="middle" fill="#9C6EFA" className="text-xl font-extrabold" style={{ fontStyle: 'normal' }}>94%</text>
            </svg>
            <div className="text-[9px] text-white/30 -mt-1">protection rate</div>
          </div>
        );
      case 'Conservative':
        return (
          <div className="relative h-[110px] w-full bg-brand-green/5 p-2 px-4">
             <svg width="100%" height="80" className="opacity-80">
                <line x1="0" y1="40" x2="100%" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                {[
                  { x: 20, y: 34, r: 4, c: '#00E676' },
                  { x: 45, y: 28, r: 3, c: '#00E676' },
                  { x: 70, y: 52, r: 4, c: '#FF4757' },
                  { x: 100, y: 22, r: 5, c: '#00E676' },
                  { x: 130, y: 18, r: 4, c: '#00E676' },
                  { x: 160, y: 48, r: 3, c: '#FF4757' },
                  { x: 190, y: 26, r: 4, c: '#00E676' }
                ].map((d, i) => (
                  <circle key={i} cx={`${d.x}`} cy={`${d.y}`} r={d.r} fill={d.c} className="opacity-80" />
                ))}
             </svg>
             <div className="text-[8px] text-white/30 absolute bottom-2 left-4">Each dot = 1 trade · green = win · red = loss</div>
             <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-white/50">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" /> LIVE
            </div>
          </div>
        );
      case 'Zerodha':
        return (
          <div className="relative h-[110px] w-full bg-brand-orange/10 flex items-center justify-center overflow-hidden">
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                className="fill-none stroke-brand-orange stroke-[1.5] animate-draw"
                style={{ strokeDasharray: 500, strokeDashoffset: 500 }}
                d="M0 75 L25 68 L40 72 L55 60 L70 62 L85 48 L95 52 L110 38 L125 30 L140 22 L155 18 L170 12 L185 8 L200 5" 
              />
              <path d="M0 75 L25 68 L40 72 L55 60 L70 62 L85 48 L95 52 L110 38 L125 30 L140 22 L155 18 L170 12 L185 8 L200 5 L200 90 L0 90 Z" fill="url(#orangeGrad)" />
            </svg>
            <div className="text-[8px] text-white/30 absolute bottom-2 left-4">Equity curve · NSE · NIFTY50</div>
            <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-white/50">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" /> LIVE
            </div>
          </div>
        );
    }
  };

  return (
    <div className="group relative bg-white/[0.03] border border-white/10 rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
      
      {/* Background Glow */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" 
        style={{ backgroundColor: badge.color }} 
      />

      {/* Visual Area */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: `${badge.color}33`, color: badge.color, borderColor: `${badge.color}66` }}>
            {badge.text}
          </span>
        </div>
        {renderVisual()}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h4 className="text-[13px] font-bold mb-0.5">{name}</h4>
        <p className="text-[10px] text-white/40 mb-3">{symbol}</p>

        {/* Mini Stats Row */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/5 rounded-md p-1.5 text-center">
              <div className="text-[8px] text-white/30 uppercase tracking-widest">{s.label}</div>
              <div className="text-[11px] font-bold" style={{ color: s.color || 'white' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Win Rate Progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[9px] text-white/30 whitespace-nowrap">Win rate</div>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500" 
              style={{ width: `${winRate}%`, backgroundColor: badge.color }} 
            />
          </div>
          <div className="text-[10px] font-bold" style={{ color: badge.color }}>{winRate}%</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#FFD700]">{price}</div>
            <div className="text-[8px] text-white/30">Cancel anytime</div>
          </div>
          <button 
            onClick={() => setFollowing(!following)}
            className={`text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all ${
              following 
                ? 'bg-brand-green/15 text-brand-green border border-brand-green/30' 
                : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:scale-105 active:scale-95'
            }`}
          >
            {following ? 'Following' : 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
};
