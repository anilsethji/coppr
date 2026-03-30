"use client";
import { motion } from 'framer-motion';

interface FloatingCardProps {
  initialY: number;
  delay: number;
  title: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

export function FloatingCard({ initialY, delay, title, value, className = '', valueClassName = 'text-3xl' }: FloatingCardProps) {
  return (
    <motion.div
      className={`glass-card p-6 min-w-[200px] absolute ${className}`}
      initial={{ y: initialY + 50, opacity: 0 }}
      animate={{ y: [initialY, initialY - 15, initialY], opacity: 1 }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        opacity: { duration: 1, delay: 0.5 } // Initial fade-in
      }}
    >
      <div className="text-sm font-semibold text-gray-400 font-inter tracking-widest mb-2 whitespace-nowrap">{title}</div>
      <div className={`font-black font-inter tracking-tight text-coppr-gradient ${valueClassName}`}>{value}</div>
    </motion.div>
  );
}
