"use client";
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const assets = [
  { symbol: 'XAU/USD', name: 'Gold', basePrice: 2340.50, volatility: 2.5 },
  { symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 68420.00, volatility: 150 },
  { symbol: 'XAG/USD', name: 'Silver', basePrice: 28.40, volatility: 0.15 },
  { symbol: 'NIFTY', name: 'Nifty 50', basePrice: 22450.00, volatility: 45 },
  { symbol: 'BANKNIFTY', name: 'Bank Nifty', basePrice: 47200.00, volatility: 120 },
];

export function PriceTicker() {
  const [data, setData] = useState(assets.map(a => ({ ...a, currentPrice: a.basePrice, change: 0, isUp: true })));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => prevData.map(asset => {
        const move = (Math.random() - 0.5) * asset.volatility;
        const newPrice = asset.currentPrice + move;
        const isUp = newPrice >= asset.currentPrice;
        const change = ((newPrice - asset.basePrice) / asset.basePrice) * 100;
        
        return {
          ...asset,
          currentPrice: parseFloat(newPrice.toFixed(asset.symbol.includes('USD') ? 2 : 0)),
          change: parseFloat(change.toFixed(2)),
          isUp
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white/[0.01] backdrop-blur-xl border-y border-white/5 py-4">
      <motion.div 
        className="flex items-center gap-12 whitespace-nowrap px-6"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {/* Render twice for seamless loop */}
        {[...data, ...data].map((asset, i) => (
          <div key={i} className="flex items-center gap-6 text-sm font-bold tracking-tight">
            <span className="text-white/30 uppercase font-black tracking-widest text-[10px]">{asset.symbol}</span>
            <span className="text-white">
                {asset.symbol.includes('USD') ? '$' : ''}{asset.currentPrice.toLocaleString()}
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-black ${asset.isUp ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
              {asset.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {asset.isUp ? '+' : ''}{asset.change}%
            </span>
            <div className="w-[1px] h-3 bg-white/10 mx-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
