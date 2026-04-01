'use client';

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Layers, 
  Target, 
  Compass, 
  Zap, 
  ShieldCheck, 
  ArrowDownToLine,
  Activity,
  ChevronRight
} from 'lucide-react';
import Link from "next/link";

export default function IndicatorsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [indicators, setIndicators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [pRes, iRes] = await Promise.all([
        supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
        supabase.from('content').select('*').eq('type', 'indicator').order('created_at', { ascending: false })
      ]);

      setProfile(pRes.data);
      setIndicators(iRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#00B0FF]/20 border-t-[#00B0FF] rounded-full animate-spin"></div>
    </div>
  );

  const isSubscribed = profile?.subscription_status === 'active';

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto pb-20">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-[#00B0FF]/10 border border-[#00B0FF]/20">
              <BarChart3 className="w-5 h-5 text-[#00B0FF]" />
            </div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-white">Market Indicators</h1>
          </div>
          <p className="text-[14px] text-white/40 max-w-[500px]">
            Enhanced visual tools for MT5 to identify high-probability entries. 
            Calibrated for maximum precision in volatile markets.
          </p>
        </div>
        
        <div className="px-4 py-2 rounded-full border border-[#00B0FF]/20 bg-[#00B0FF]/5 flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,176,255,0.05)]">
           <Layers className="w-3.5 h-3.5 text-[#00B0FF]" />
           <span className="text-[11px] font-black tracking-widest text-[#00B0FF] uppercase">
             {indicators.length} ACTIVE TOOLS
           </span>
        </div>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {indicators.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-[20px] border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-[#00B0FF]/30"
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#00B0FF] blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity"></div>

              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xl">
                   <Target className="w-5 h-5 text-[#00B0FF]" />
                 </div>
                 <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={item.external_link} 
                  className="px-4 py-2 bg-[#00B0FF]/10 hover:bg-[#00B0FF]/20 text-[#00B0FF] border border-[#00B0FF]/20 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2"
                 >
                   <ArrowDownToLine className="w-3 h-3" />
                   Install .ex5
                 </motion.a>
              </div>

              <h3 className="text-[16px] font-bold text-white mb-2 group-hover:text-[#00B0FF] transition-colors">{item.title}</h3>
              <p className="text-[12px] text-white/40 mb-6 leading-relaxed line-clamp-2">
                {item.description || 'Professional indicator for advanced market structure analysis.'}
              </p>
              
              <div className="pt-6 border-t border-white/5 flex justify-between items-center bg-transparent">
                 <div className="flex items-center gap-1.5 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                   <Compass className="w-3 h-3" />
                   Protocol v2.1
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00B0FF] animate-pulse shadow-[0_0_8px_#00B0FF]"></div>
                   <span className="text-[9px] font-bold text-[#00B0FF]">LATEST</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {indicators.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white/[0.01] rounded-[24px] border border-dashed border-white/10">
             <Layers className="w-8 h-8 text-white/5 mx-auto mb-4" />
             <p className="text-[13px] text-white/20 italic font-medium">
               No special indicators broadcasted yet. Check back soon for updates!
             </p>
          </div>
        )}
      </div>
    </div>
  );
}

