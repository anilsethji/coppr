'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import VaultView from '@/components/dashboard/VaultView';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Globe, 
  Zap 
} from 'lucide-react';

export default function BotsPage() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('strategies')
        .select('*')
        .eq('type', 'MT5_EA')
        .order('created_at', { ascending: false });
      
      setBots(data || []);
      if (data && data.length > 0) setActiveBotId(data[0].id);
      setLoading(false);
    };
    fetchBots();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#000000]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-none animate-spin" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono">INITIALIZING SECURE VAULT //</span>
      </div>
    </div>
  );

  return (
    <div className="w-full h-[calc(100vh-72px)] md:h-screen flex flex-col bg-[#000000] overflow-hidden">
      
      {/* 1. COMPRESSED TOP HERO NAV */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative px-6 py-3 w-full bg-[#000000] border-b border-[#1A1A1A] rounded-none z-10 shrink-0"
      >
        <div className="flex flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
               <Bot className="w-4 h-4 text-[#FFD700]" strokeWidth={2.5} />
               <h1 className="text-[12px] font-black text-white uppercase tracking-wider [word-spacing:0.2em] leading-none mt-0.5">
                  AUTOMATED <span className="text-[#FFD700]">TRADING BOTS</span>
               </h1>
            </div>
            <div className="hidden md:block w-px h-4 bg-[#1A1A1A]" />
            <p className="hidden md:block text-[8px] text-white/30 font-mono uppercase tracking-[0.2em] mt-1">
               BROWSE TOP-PERFORMING STRATEGIES & COPY TRADES INSTANTLY.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <Globe className="w-3 h-3 text-[#FFD700]" />
             <p className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest leading-none font-mono mt-0.5">Global_Access_VERIFIED</p>
          </div>
        </div>
      </motion.div>

      {/* 2. FULL-BLEED BOT VAULT */}
      <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar">
         <VaultView typeFilter="MT5_EA" timelineMode="bots" />
      </div>
    </div>
  );
}
