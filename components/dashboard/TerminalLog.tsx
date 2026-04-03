'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLogProps {
  logs: any[];
}

export default function TerminalLog({ logs }: TerminalLogProps) {
  const [displayLogs, setDisplayLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative w-full h-[300px] bg-[#05080A] rounded-[14px] border border-[#00E67633] overflow-hidden group shadow-[0_20px_50px_rgba(0,230,118,0.05)]">
        {/* Matrix Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ 
            background: 'linear-gradient(rgba(0, 230, 118, 0.03) 50%, transparent 50%)', 
            backgroundSize: '100% 4px' 
        }}></div>
        <div className="absolute inset-0 pointer-events-none z-10 animate-pulse bg-gradient-to-b from-transparent via-[#00E67605] to-transparent h-[20%] w-full"></div>

        {/* Console Header */}
        <div className="bg-[#00E67611] border-b border-[#00E67633] px-4 py-2 flex items-center justify-between">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[9px] font-mono font-black text-[#00E676] uppercase tracking-[0.2em] animate-pulse">COPPR SIGNAL Hub // Live Feed</span>
        </div>

        {/* Log Area */}
        <div 
            ref={scrollRef}
            className="p-4 h-[calc(100%-36px)] overflow-y-auto scrollbar-hide font-mono text-[10px] space-y-2 selection:bg-[#00E67633]"
        >
            <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                    <motion.div 
                        key={log.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 border-l border-[#00E6761A] pl-3 py-1"
                    >
                        <span className="text-white/20 shrink-0">[{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className={`font-black shrink-0 ${
                            log.action === 'SIGNAL_INGESTED' ? 'text-[#FFD700]' : 
                            log.action === 'SIGNAL_PROPAGATED' ? 'text-blue-400' : 
                            log.action === 'EXECUTED' ? 'text-[#00E676]' : 'text-red-500'
                        }`}>
                            [{log.action.replace('SIGNAL_', '')}]
                        </span>
                        <div className="space-y-1">
                            <p className="text-[#00E676] leading-relaxed drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]">
                                {log.details?.payload?.action || log.action} {log.details?.payload?.symbol} @ {log.details?.payload?.price}
                            </p>
                            <span className="text-white/10 text-[8px] block">
                                REFID: {log.details?.orderId || 'COPP-' + i} // NODE: {log.subscription_id?.substr(0,8)} // STAT: 200 OK
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Simulated Live Blinking Cursor */}
            <div className="flex items-center gap-2 border-l border-[#00E6761A] pl-3 py-1">
                <span className="text-white/20">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="text-[#00E676] animate-pulse">_</span>
                <span className="text-white/10 italic">Awaiting Next Signal Broadcast...</span>
            </div>
        </div>

        {/* Visual Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
}
