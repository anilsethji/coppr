'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, BadgeCheck, Quote } from 'lucide-react';

const testimonials = [
  { n: "Rahul Sharma", l: "Mumbai, MH", t: "Paisa vasool strategy! MT5 sync is flawless, entries are extremely sharp.", r: 5 },
  { n: "Ananya Iyer", l: "Bangalore, KA", t: "The official bots are institutional grade. Sub-second execution is a game changer.", r: 5 },
  { n: "Vikram Singh", l: "Delhi", t: "Ekdam premium feel. Simple logic but very effective for regular trading.", r: 5 },
  { n: "Priya Patel", l: "Ahmedabad, GJ", t: "Market me bohot filters hai par Coppr is different. 100% transparent results.", r: 5 },
  { n: "Siddharth Das", l: "Kolkata, WB", t: "Handshake process was instant. No complex coding required at all.", r: 5 },
  { n: "Meera Reddy", l: "Hyderabad, TS", t: "Drawdown control is top notch. It trades exactly like a machine.", r: 4 },
  { n: "Arjun Kapoor", l: "Chandigarh", t: "Hinglish narratives are real, just like the performance. Best in India.", r: 5 },
  { n: "Sanjana Gupta", l: "Pune, MH", t: "Secure payment logic with Cashfree makes it very reliable for retail users.", r: 5 },
  { n: "Kishan Lal", l: "Jaipur, RJ", t: "Truly institutional edge. Mirroring signals has never been this fast.", r: 5 },
  { n: "Neha Verma", l: "Lucknow, UP", t: "Simplified terminology makes it so easy to understand risk. Great UX!", r: 4 }
];

export function TrustMarquee() {
  // Duplicate for seamless infinite loop
  const duplicated = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-[#080C14] overflow-hidden border-y border-white/5 relative">
      <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-[#080C14] to-transparent z-10" />
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#080C14] to-transparent z-10" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <BadgeCheck className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em]">Verified Community Proof</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
          Our <span className="text-white/20 italic">Global</span> Trust Wall
        </h2>
      </div>

      <div className="relative flex">
        <motion.div 
          animate={{ x: [0, -1920] }} 
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-6 whitespace-nowrap items-center"
        >
          {duplicated.map((rev, i) => (
            <div key={i} className="w-[320px] p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6 flex-shrink-0 relative group hover:border-[#FFD700]/20 transition-all backdrop-blur-3xl">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-white/[0.03] group-hover:text-[#FFD700]/10 transition-colors" />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                   {[...Array(5)].map((_, j) => (
                     <Star key={j} className={`w-3 h-3 ${j < rev.r ? 'text-[#FFD700] fill-[#FFD700]' : 'text-white/10'}`} />
                   ))}
                </div>
                <div className="px-3 py-1 bg-[#00E676]/5 border border-[#00E676]/10 rounded-full flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
                    <span className="text-[8px] font-black text-[#00E676] uppercase tracking-widest">VERIFIED</span>
                </div>
              </div>

              <p className="text-[13px] text-white/50 font-medium italic leading-relaxed whitespace-normal">&quot;{rev.t}&quot;</p>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="space-y-0.5">
                    <p className="text-[12px] font-black text-white italic group-hover:text-[#FFD700] transition-colors">{rev.n}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{rev.l}</p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-black text-[#FFD700]">{rev.n[0]}</span>
                 </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
