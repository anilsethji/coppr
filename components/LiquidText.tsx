"use client";
import { motion } from "framer-motion";

export function LiquidText() {
  return (
    <div className="relative inline-flex justify-center items-center z-10 pointer-events-none my-10">
      
      {/* Background radial glow specifically for the text caustics */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-40 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(212,175,55,0.1) 40%, transparent 70%)"
        }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Container to apply the abstract liquid CSS text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h1 
          className="text-[100px] sm:text-[140px] md:text-[220px] font-black font-outfit tracking-tighter leading-none relative z-10"
          style={{
            background: "linear-gradient(135deg, #FFEF96 0%, #FFD700 30%, #D4AF37 50%, #B87333 75%, #4D3319 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            textShadow: "0px 0px 40px rgba(255, 215, 0, 0.3), 0px 4px 20px rgba(184, 115, 51, 0.5)",
            WebkitTextStroke: "1px rgba(255, 215, 0, 0.2)"
          }}
        >
          COPPR
        </h1>
      </motion.div>
    </div>
  );
}
