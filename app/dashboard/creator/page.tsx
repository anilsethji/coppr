'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Plus, 
  Zap, 
  BarChart3, 
  Activity, 
  Settings,
  ChevronRight,
  Globe,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import CreatorStats from '@/components/dashboard/CreatorStats';
import ManagedSignalSettings from '@/components/dashboard/ManagedSignalSettings';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CreatorTerminal() {
  const [loading, setLoading] = useState(true);
  const [strategiesCount, setStrategiesCount] = useState(0);
  const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { count } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', (await supabase.from('creator_profiles').select('id').eq('user_id', user.id).single()).data?.id);

    setStrategiesCount(count || 0);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-[600px] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Creator Keys...</p>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1300px] mx-auto py-12 px-6 space-y-16 pb-20"
    >
      {/* 1. CREATOR HEADER & STATUS */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_10px_#FFD700]" />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] font-sans italic">Creator Core Protocol Live</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              Creator <span className="text-[#FFD700]">Terminal</span>
            </h1>
            <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.4em] font-sans">Strategic Asset Deployment Interface</p>
        </div>
        
        <div className="bg-[#131929]/40 border border-white/5 p-6 rounded-[28px] flex items-center gap-6 backdrop-blur-xl">
           <div className="flex flex-col">
              <span className="text-[24px] font-black text-[#FFD700] leading-none uppercase italic">{strategiesCount}</span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1 italic">Active Nodes</span>
           </div>
           <div className="w-[1px] h-10 bg-white/5" />
           <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E676]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
           </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <CreatorStats />
      </motion.div>

      {/* 2. THE LAUNCH PAD: PRODUCT ORIGIN (REPLACING THE FLEET) */}
      <div className="space-y-12">
        <div className="space-y-2 border-l-2 border-[#FFD700] pl-8">
           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Strategic Deployment Hub</h3>
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-sans">Choose your propagation vector below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* OPTION A: OFFICIAL PROPAGATION */}
          <Link href="/dashboard/creator/submit?origin=OFFICIAL" className="group">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredOrigin('OFFICIAL')}
              onHoverEnd={() => setHoveredOrigin(null)}
              className="relative p-8 md:p-12 rounded-[32px] md:rounded-[56px] bg-gradient-to-br from-[#131929] to-black border border-white/5 group-hover:border-[#FFD700]/30 transition-all flex flex-col justify-between overflow-hidden aspect-auto md:aspect-video md:min-h-[450px] shadow-2xl"
            >
              {/* REFLECTIVE GLYPH */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFD700]/10 transition-all duration-700" />
              <div className="absolute inset-0 bg-[#FFD700]/[0.01] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-6 md:space-y-8 relative z-10">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:bg-[#FFD700]/10 transition-colors">
                    <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#FFD700]" />
                 </div>
                 <div className="space-y-2 md:space-y-4">
                    <h4 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-[#FFD700] transition-colors">
                       Product <br /> <span className="text-white/20 group-hover:text-[#FFD700]/40 transition-colors italic">Origin: Official</span>
                    </h4>
                    <p className="text-[11px] md:text-sm text-white/30 font-bold uppercase tracking-widest leading-relaxed font-sans max-w-sm">
                       Proprietary Coppr Labs propagation server. Deployment on official virtual nodes with 100% managed uptime.
                    </p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-8 md:pt-10 relative z-10">
                 <span className="text-[9px] md:text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">Launch Official Logic →</span>
                 <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white/5 group-hover:text-[#FFD700] group-hover:translate-x-2 transition-all" />
              </div>
            </motion.div>
          </Link>

          {/* OPTION B: MARKETPLACE PROPAGATION */}
          <Link href="/dashboard/creator/submit?origin=MARKETPLACE" className="group">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredOrigin('MARKETPLACE')}
              onHoverEnd={() => setHoveredOrigin(null)}
              className="relative p-8 md:p-12 rounded-[32px] md:rounded-[56px] bg-gradient-to-br from-[#131929] to-black border border-white/5 group-hover:border-[#00E676]/30 transition-all flex flex-col justify-between overflow-hidden aspect-auto md:aspect-video md:min-h-[450px] shadow-2xl"
            >
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#00E676]/10 transition-all duration-700" />
              <div className="absolute inset-0 bg-[#00E676]/[0.01] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-6 md:space-y-8 relative z-10">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:bg-[#00E676]/10 transition-colors">
                    <Globe className="w-8 h-8 md:w-10 md:h-10 text-[#00E676]" />
                 </div>
                 <div className="space-y-2 md:space-y-4">
                    <h4 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-[#00E676] transition-colors">
                       Product <br /> <span className="text-white/20 group-hover:text-[#00E676]/40 transition-colors italic">Origin: Marketplace</span>
                    </h4>
                    <p className="text-[11px] md:text-sm text-white/30 font-bold uppercase tracking-widest leading-relaxed font-sans max-w-sm">
                       Community-sourced signal propagation. Self-hosted by subscribers or mirror-ready on the global marketplace hub.
                    </p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-8 md:pt-10 relative z-10">
                 <span className="text-[9px] md:text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">Launch Community Logic →</span>
                 <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white/5 group-hover:text-[#00E676] group-hover:translate-x-2 transition-all" />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* 2.5 SIGNAL BRIDGE MANAGEMENT (PHASE 2) */}
      <motion.div variants={item}>
        <ManagedSignalSettings />
      </motion.div>

      {/* 3. FOOTER LOGIC: RESTORING THE CLEAN "WHAT IT WAS" FOCUS */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10">
         {[
           { icon: Zap, t: 'Lightning Propagate', d: 'Proprietary Coppr Mainnet fiber integration.' },
           { icon: ShieldCheck, t: 'Elite Encryption', d: 'Source logic never leaves the secure vault.' },
           { icon: Sparkles, t: 'Proprietary Alpha', d: 'Advanced Managed Execution node architecture.' }
         ].map((f, i) => (
           <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-white/5">
                 <f.icon className="w-6 h-6 text-white/40" />
              </div>
              <div className="space-y-1">
                 <h5 className="text-[12px] font-black text-white uppercase italic">{f.t}</h5>
                 <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{f.d}</p>
              </div>
           </div>
         ))}
      </motion.div>

      {/* "PRODUCT ORIGIN" CENTERPIECE CALLOUT */}
      <motion.div 
        variants={item}
        className="relative p-12 bg-gradient-to-br from-[#FFD700]/5 to-transparent border border-[#FFD700]/10 rounded-[64px] text-center space-y-8 overflow-hidden group"
      >
         <div className="absolute inset-0 bg-[#FFD700]/[0.01] pointer-events-none" />
         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
         
         <div className="relative z-10 space-y-4">
            <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Unified Propagation Protocol</h4>
            <p className="text-[12px] md:text-sm text-white/30 font-bold uppercase tracking-[0.3em] font-sans max-w-2xl mx-auto italic">
              Whether through **Official Coppr Channels** or the **Marketplace Hub**, your algorithmic intellectual property is 100% mirrored via our secure Managed Execution fiber network.
            </p>
         </div>

         <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 pt-4">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-[#FFD700]/20 text-[#FFD700]">
                  <LayoutGrid className="w-5 h-5" />
               </div>
               <span className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none">Managed Deployment</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-[#00E676]/20 text-[#00E676]">
                  <Activity className="w-5 h-5" />
               </div>
               <span className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none">Global Propagation</span>
            </div>
         </div>
      </motion.div>

    </motion.div>
  );
}
