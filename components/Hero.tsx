"use client";
import { motion } from 'framer-motion';
import { FloatingCard } from './FloatingCard';
import { LiquidText } from './LiquidText';

export function Hero() {
  return (
    <section className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[80vh] z-10">
      
      {/* Central Liquid Typography Abstract */}
      <div className="relative w-full flex justify-center items-center py-20">
        
        {/* Glow behind the liquid text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-metallic/10 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <LiquidText />

        {/* Floating Data Layout overlaying the center typography */}
        {/* Card 1: AI SIGNAL */}
        <FloatingCard 
          initialY={-60} 
          delay={0} 
          title="AI SIGNAL" 
          value="XAU/USD (GOLD)" 
          className="top-[15%] md:top-[20%] left-[5%] md:left-[15%] z-30 shadow-[0_20px_60px_rgba(0,0,0,0.4)]" 
          valueClassName="text-2xl md:text-3xl"
        />
        
        {/* Card 2: Massive Profit Number */}
        <FloatingCard 
          initialY={60} 
          delay={1.5} 
          title="PROFIT GENERATED" 
          value="$1000" 
          className="bottom-[10%] md:bottom-[15%] right-[5%] md:right-[15%] z-30 shadow-[0_20px_60px_rgba(0,0,0,0.4)]" 
          valueClassName="text-6xl md:text-8xl"
        />
      </div>

      {/* Subtext and CTA */}
      <motion.div
        className="mt-12 space-y-8 text-center z-20 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-lg text-gray-400 max-w-lg mx-auto font-inter">
          Experience liquid wealth. Pure minimalist luxury powered by advanced artificial intelligence signals.
        </p>
        
        <button className="px-10 py-5 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B87333] text-navy-deep font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 transform hover:scale-105 font-inter">
          Initialize Platform
        </button>
      </motion.div>

    </section>
  );
}
