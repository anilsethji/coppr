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
    <div className="relative w-full h-[350px] bg-[#020617] border border-white/[0.03] overflow-hidden group">
        {/* Matrix Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ 
            background: 'linear-gradient(rgba(0, 230, 118, 0.02) 50%, transparent 50%)', 
            backgroundSize: '100% 2px' 
        }}></div>

        {/* Console Header */}
        <div className="bg-white/[0.02] border-b border-white/[0.03] px-6 py-3 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/10"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/10"></div>
                    <div className="w-2 h-2 rounded-full bg-[#00E676]/20 border border-[#00E676]/10"></div>
                </div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono">Propagation Console // Node_Alpha</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-[#00E676] uppercase tracking-widest font-mono animate-pulse">Sync_Verified</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
            </div>
        </div>

        {/* Log Area */}
        <div 
            ref={scrollRef}
            className="p-6 h-[calc(100%-48px)] overflow-y-auto scrollbar-hide font-mono text-[12px] space-y-4 selection:bg-[#00E67633]"
        >
            <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                    <motion.div 
                        key={log.id || i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 py-1.5 group/log"
                    >
                        <span className="text-white/10 shrink-0 font-black tabular-nums">
                            {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        
                        <div className="space-y-2 flex-1 min-w-0">
                            <div className="text-white/80 leading-relaxed font-semibold transition-colors">
                                {log.content ? (
                                    <span className="text-white/60">“{log.content}”</span>
                                ) : (
                                    <>
                                        <span className="text-[#FFD700] mr-2">[{log.action?.replace('SIGNAL_', '') || 'EVENT'}]</span>
                                        <span className="opacity-60">{log.details?.payload?.action || log.action}</span> 
                                        <span className="text-white mx-1.5">{log.details?.payload?.symbol}</span> 
                                        <span className="text-[#00E676] shrink-0 font-black">@{log.details?.payload?.price}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/5 group-hover/log:text-white/10 transition-colors">
                                <span>REF: {log.id?.slice(0,8) || 'COPP-' + i}</span>
                                {log.details?.latency_ms && (
                                    <span className="text-[#00E676]/40">LATENCY: {log.details.latency_ms}MS</span>
                                )}
                                <span>STATUS: 200_OK</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Simulated Live Blinking Cursor */}
            <div className="flex items-center gap-4 py-2 opacity-40">
                <span className="text-white/10 font-black tabular-nums">
                    {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-3 bg-[#00E676] animate-pulse" />
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Grid Response...</span>
                </div>
            </div>
        </div>

        {/* Visual Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_70%,rgba(0,0,0,0.4)_100%)]"></div>
    </div>
  );
}
