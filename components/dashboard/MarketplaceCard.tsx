'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  Plus
} from 'lucide-react';

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
          <div className="relative h-[120px] w-full bg-brand-green/10 flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E676" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="fill-none stroke-[#00E676] stroke-[1.5]"
                d="M0 80 L20 70 L40 65 L55 55 L70 58 L85 45 L100 40 L115 35 L130 28 L145 20 L160 15 L175 10 L200 8" 
              />
              <path d="M0 80 L20 70 L40 65 L55 55 L70 58 L85 45 L100 40 L115 35 L130 28 L145 20 L160 15 L175 10 L200 8 L200 90 L0 90 Z" fill="url(#sparkGradient)" />
            </svg>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[8px] font-black tracking-widest text-[#00E676] uppercase">Active</span>
            </div>
          </div>
        );
      case 'Scalping':
        return (
          <div className="relative h-[120px] w-full bg-[#F5A623]/10 flex items-end justify-center gap-1.5 p-4 overflow-hidden">
             {[18, 12, 22, 8, 28, 16, 32, 20, 36].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}px` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div className="w-[1px] bg-white/20 h-2" />
                  <div 
                    className="w-2 rounded-sm" 
                    style={{ backgroundColor: i % 3 === 1 ? '#FF4757' : '#00E676' }} 
                  />
                  <div className="w-[1px] bg-white/20 h-2" />
                </motion.div>
             ))}
             <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[8px] font-black tracking-widest text-[#00E676] uppercase">Scalp</span>
            </div>
          </div>
        );
      case 'Pine Script':
        return (
          <div className="relative h-[120px] w-full bg-[#00B0FF]/10 p-4">
             <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="h-3 rounded-sm" 
                    style={{ 
                      backgroundColor: [2, 5, 9, 13, 18].includes(i) ? 'rgba(255,71,87,0.4)' : 'rgba(0,230,118,0.6)'
                    }} 
                  />
                ))}
             </div>
             <div className="text-[9px] text-white/30 absolute bottom-3 right-4 font-medium italic">21-day signal efficiency</div>
             <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               <div className="w-1 h-1 rounded-full bg-[#00B0FF] animate-pulse" />
               <span className="text-[8px] font-black tracking-widest text-[#00B0FF] uppercase">Script</span>
            </div>
          </div>
        );
      case 'Protection':
        return (
          <div className="relative h-[120px] w-full bg-[#9C6EFA]/10 flex flex-col items-center justify-center pt-2">
            <svg width="100" height="70" viewBox="0 0 100 70">
              <path d="M10 65 A40 40 0 0 1 90 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
              <motion.path 
                initial={{ strokeDashoffset: 125 }}
                animate={{ strokeDashoffset: 12 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M10 65 A40 40 0 0 1 90 65" 
                fill="none" 
                stroke="url(#purpleGrad)" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeDasharray="125" 
              />
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9C6EFA" />
                  <stop offset="100%" stopColor="#00B0FF" />
                </linearGradient>
              </defs>
              <text x="50" y="60" textAnchor="middle" fill="#9C6EFA" className="text-xl font-black" style={{ fontStyle: 'normal' }}>94%</text>
            </svg>
            <div className="text-[9px] text-white/30 -mt-1 font-black uppercase tracking-widest">Protocol Active</div>
          </div>
        );
      case 'Conservative':
        return (
          <div className="relative h-[120px] w-full bg-brand-green/5 p-2 px-4">
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
                  <motion.circle 
                    key={i} 
                    initial={{ opacity: 0, r: 0 }}
                    animate={{ opacity: 0.8, r: d.r }}
                    transition={{ delay: i * 0.1 }}
                    cx={`${d.x}`} cy={`${d.y}`} fill={d.c} 
                  />
                ))}
             </svg>
             <div className="text-[8px] text-white/30 absolute bottom-3 left-4 italic">Balanced execution protocol</div>
             <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[8px] font-black tracking-widest text-[#00E676] uppercase">Safe</span>
            </div>
          </div>
        );
      case 'Zerodha':
        return (
          <div className="relative h-[120px] w-full bg-[#FF6B35]/10 flex items-center justify-center overflow-hidden">
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="fill-none stroke-[#FF6B35] stroke-[1.5]"
                d="M0 75 L25 68 L40 72 L55 60 L70 62 L85 48 L95 52 L110 38 L125 30 L140 22 L155 18 L170 12 L185 8 L200 5" 
              />
              <path d="M0 75 L25 68 L40 72 L55 60 L70 62 L85 48 L95 52 L110 38 L125 30 L140 22 L155 18 L170 12 L185 8 L200 5 L200 90 L0 90 Z" fill="url(#orangeGrad)" />
            </svg>
            <div className="text-[8px] text-white/30 absolute bottom-3 left-4 font-black uppercase tracking-tighter">NSE:INDIA</div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               <div className="w-1 h-1 rounded-full bg-[#FF6B35] animate-pulse" />
               <span className="text-[8px] font-black tracking-widest text-[#FF6B35] uppercase">Live</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="group relative bg-white/[0.03] border border-white/5 rounded-[24px] overflow-hidden transition-all duration-200 hover:bg-white/[0.05] hover:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" 
        style={{ backgroundColor: badge.color }} 
      />

      {/* Visual Area */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-black px-3 py-1 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1.5" style={{ backgroundColor: `${badge.color}22`, color: badge.color, borderColor: `${badge.color}44` }}>
             <Activity className="w-3 h-3" />
             {badge.text}
          </span>
        </div>
        {renderVisual()}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="mb-4">
          <h4 className="text-[16px] font-bold text-white mb-1 group-hover:text-[#FFD700] transition-colors">{name}</h4>
          <p className="text-[11px] text-white/30 font-medium line-clamp-1">{symbol}</p>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-2.5 border border-white/5 group-hover:border-white/10 transition-colors text-center">
              <div className="text-[9px] text-white/20 uppercase tracking-[0.15em] font-black mb-1">{s.label}</div>
              <div className="text-[12px] font-bold" style={{ color: s.color || 'white' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* win Rate Slider */}
        <div className="space-y-2 mb-6">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
             <span>Efficiency</span>
             <span style={{ color: badge.color }}>{winRate}%</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${winRate}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full rounded-full" 
               style={{ backgroundColor: badge.color }} 
             />
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-[#FFD700] tracking-tight">{price}</span>
            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Active Access</span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFollowing(!following)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
              following 
                ? 'bg-white/5 text-white/40 border border-white/10 cursor-default' 
                : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#080C14] shadow-[0_10px_25px_rgba(255,215,0,0.2)]'
            }`}
          >
            {following ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {following ? 'Following' : 'Subscribe'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

