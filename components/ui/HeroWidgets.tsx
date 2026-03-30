'use client';
import { useState, useEffect } from 'react';

export function HeroWidgets() {
  const [pnl, setPnl] = useState(134.50);
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  // Simulate live PnL fluctuating between $2 and $500
  useEffect(() => {
    const interval = setInterval(() => {
      setPnl(prev => {
        // Randomly decide to increase or decrease
        const change = (Math.random() * 60) - 25; // random between -25 and +35
        let next = prev + change;
        
        // Boundaries
        if (next > 490) next = 490 - Math.random() * 30;
        if (next < 5) next = 5 + Math.random() * 20;
        
        setTrend(next >= prev ? 'up' : 'down');
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto z-20">
      
      {/* LEFT WIDGET: Algo Trade Signal */}
      <div 
        className="absolute top-6 md:top-24 lg:top-32 left-0 md:-left-10 lg:-left-20 card p-6 flex items-center gap-5 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl scale-[0.65] sm:scale-90 md:scale-100 origin-top-left animate-float"
      >
        <div className="w-14 h-14 rounded-full bg-[#F5A623]/20 flex items-center justify-center border border-[#F5A623]/40 relative">
          <div className="absolute inset-0 rounded-full border-2 border-[#F5A623] opacity-20 animate-ping"></div>
          <div className="w-5 h-5 bg-[#F5A623] rounded-full shadow-[0_0_20px_rgba(245,166,35,1)] animate-pulse"></div>
        </div>
        <div>
          <p className="text-[#F5A623] font-bold text-xl font-brand tracking-wide drop-shadow-md">Algo Trade Signal</p>
          <p className="text-white/80 text-xs font-bold mt-1 tracking-widest uppercase">XAUUSD • Executing</p>
        </div>
      </div>

      {/* RIGHT WIDGET: Live PnL Ticker */}
      <div 
        className="absolute bottom-6 md:bottom-16 lg:bottom-24 right-0 md:-right-8 lg:-right-16 card p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[20px] min-w-[240px] scale-[0.65] sm:scale-90 md:scale-100 origin-bottom-right animate-float-delayed"
      >
        <div className="flex justify-between items-start mb-3">
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Live Floating PnL</p>
            <div className="flex items-center gap-1.5 bg-green-electric/10 px-2 py-0.5 rounded-full border border-green-electric/20">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-electric opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-electric"></span>
                </span>
                <span className="text-[10px] text-green-electric font-bold uppercase">Active</span>
            </div>
        </div>
        
        <div className="flex items-end gap-3 mt-1">
          <p className={`text-[2.75rem] leading-none font-bold font-mono transition-all duration-500 ${trend === 'up' ? 'text-green-electric drop-shadow-[0_0_25px_rgba(0,230,118,0.4)]' : 'text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]'}`}>
            ${pnl.toFixed(2)}
          </p>
        </div>
      </div>

    </div>
  );
}
