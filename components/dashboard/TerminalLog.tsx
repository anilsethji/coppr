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
        <div className="bg-[#00E67611] border-b border-[#00E67633] px-4 py-2.5 flex items-center justify-between">
            <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#00E676]/40 border border-[#00E676]/20"></div>
            </div>
            <span className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.25em] animate-pulse">COPPR MISSION CONTROL // DATA FEED</span>
        </div>

        {/* Log Area */}
        <div 
            ref={scrollRef}
            className="p-5 h-[calc(100%-42px)] overflow-y-auto scrollbar-hide font-mono text-[11px] space-y-4 selection:bg-[#00E67633]"
        >
            <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                    <motion.div 
                        key={log.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-4 border-l-2 border-[#00E6761A] pl-4 py-1.5 group/log hover:border-[#00E67644] transition-colors"
                    >
                        <span className="text-white/20 shrink-0 font-bold">[{new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
                        
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <p className="text-[#00E676]/90 leading-relaxed font-bold group-hover/log:text-[#00E676] transition-colors">
                                {log.content ? (
                                    <span className="italic">“{log.content}”</span>
                                ) : (
                                    <>
                                        <span className="text-[#FFD700] mr-2">[{log.action?.replace('SIGNAL_', '') || 'EVENT'}]</span>
                                        {log.details?.payload?.action || log.action} {log.details?.payload?.symbol} @ {log.details?.payload?.price}
                                    </>
                                )}
                            </p>
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/5 opacity-40">
                                <span>REF: {log.id?.slice(0,8) || 'COPP-' + i}</span>
                                {log.details?.latency_ms && (
                                    <span className="text-[#00E676]/60">Latency: {log.details.latency_ms}ms</span>
                                )}
                                <span>STATUS: 200_OK</span>
                                <span>GRID: VERIFIED</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Simulated Live Blinking Cursor */}
            <div className="flex items-center gap-3 border-l-2 border-[#00E6761A] pl-4 py-2">
                <span className="text-white/20 font-bold">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
                    <span className="text-[#00E676]/40 text-[10px] font-black uppercase tracking-widest italic">Monitoring Active Grid...</span>
                </div>
            </div>
        </div>

        {/* Visual Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
}
