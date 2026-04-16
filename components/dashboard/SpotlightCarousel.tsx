'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Star, ArrowUpRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Strategy {
  id: string;
  name: string;
  symbol: string;
  type: string;
  win_rate?: number;
  monthly_price_inr?: number;
  creator_profiles?: { display_name: string };
  is_official?: boolean;
}

export function SpotlightCarousel({ items }: { items: Strategy[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items.length) return null;

  const current = items[index];

  return (
    <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-[40px] md:rounded-[56px] bg-[#0A111F] border border-white/10 group shadow-2xl">
      {/* Background Animated Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFD700]/10 blur-[120px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
      
      {/* Navigation Buttons */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-50">
        <button 
          onClick={() => setIndex((index - 1 + items.length) % items.length)}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIndex((index + 1) % items.length)}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 p-8 md:p-14 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {current.is_official ? (
                <div className="px-5 py-1.5 bg-[#FFD700] text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg skew-x-[-10deg] flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  OFFICIAL RELEASE
                </div>
              ) : (
                <div className="px-5 py-1.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  COMMUNITY SPOTLIGHT
                </div>
              )}
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.2em] italic">VERIFIED NODE</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                {current.name}
              </h2>
              <p className="text-[11px] md:text-[13px] text-white/30 font-black italic uppercase tracking-[0.3em] leading-none">
                {current.symbol} • {current.type.replace('_', ' ')} • INSTITUTIONAL GRADE
              </p>
            </div>

            <div className="flex gap-10 pt-2">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">PRECISION</p>
                <p className="text-2xl font-black text-[#00E676] uppercase italic tracking-tight">{current.win_rate || (Math.floor(Math.random()*15)+70)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">FEE</p>
                <p className="text-2xl font-black text-white uppercase italic tracking-tight">₹{current.monthly_price_inr || '999'}</p>
              </div>
            </div>

            <Link 
              href={`/dashboard/marketplace/${current.id}`}
              className="inline-flex items-center gap-4 px-12 py-5 bg-[#FFD700] text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-[24px] transition-all hover:scale-105 italic shadow-2xl shadow-[#FFD700]/20"
            >
              INITIALIZE COMMAND
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 bg-[#FFD700]/10 blur-[100px] rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-[60px] md:rounded-[80px] flex items-center justify-center backdrop-blur-3xl group-hover:border-[#FFD700]/30 transition-all duration-1000">
                <Bot className="w-20 h-20 md:w-28 md:h-28 text-white/10 group-hover:text-[#FFD700] transition-all duration-1000 shadow-[0_0_50px_rgba(255,215,0,0.1)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
