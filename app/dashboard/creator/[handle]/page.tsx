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
  LayoutGrid,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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

export default function CreatorProfilePage() {
  const { handle } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchCreatorData() {
      const resp = await fetch(`/api/creators/${handle}/portfolio`);
      const json = await resp.json();
      if (!json.error) {
        setData(json);
      }
      setLoading(false);
    }
    fetchCreatorData();
  }, [handle]);

  if (loading) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Creator Portfolio...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-6 p-10">
      <AlertTriangle className="w-10 h-10 text-red-500" />
      <h2 className="text-2xl font-black text-white uppercase italic">Creator Protocol Not Found</h2>
      <Link href="/dashboard/marketplace" className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-2xl italic">Back to Marketplace</Link>
    </div>
  );

  const { creator, strategies } = data;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#060A12] py-12 px-6 lg:py-20 lg:px-20 space-y-16 pb-32"
    >
      {/* 1. CREATOR HEADER & STATUS */}
      <motion.div variants={item} className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-6">
            <Link href="/dashboard/marketplace" className="flex items-center gap-3 group text-white/40 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Back to Marketplace</span>
            </Link>

            <div className="flex items-center gap-6">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl md:text-6xl shadow-2xl">
                    {creator.avatar_data || '🤖'}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                          {creator.display_name}
                        </h1>
                        {creator.is_verified && <ShieldCheck className="w-6 h-6 text-[#FFD700]" strokeWidth={2.5} />}
                    </div>
                    <p className="text-[14px] md:text-[18px] font-black text-white/20 uppercase tracking-[0.4em] font-sans">@{creator.handle}</p>
                </div>
            </div>
            
            <p className="text-[12px] md:text-sm text-white/40 font-bold uppercase tracking-widest leading-relaxed max-w-xl italic">
                {creator.bio || 'Strategic asset deployment expert within the Coppr Managed Execution Network.'}
            </p>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] flex items-center gap-10 backdrop-blur-xl">
           <div className="flex flex-col">
              <span className="text-3xl font-black text-[#FFD700] leading-none uppercase italic">{creator.total_subscribers || 0}</span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2 italic">Subscribers</span>
           </div>
           <div className="w-[1px] h-12 bg-white/5" />
           <div className="flex flex-col">
              <span className="text-3xl font-black text-white leading-none uppercase italic">{strategies.length}</span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2 italic">Active Nodes</span>
           </div>
        </div>
      </motion.div>

      {/* 2. THE STRATEGY GRID */}
      <motion.div variants={item} className="max-w-[1200px] mx-auto space-y-10">
        <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Logic Portfolio</h3>
            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Verified Deployment History</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {strategies.map((strategy: any) => (
             <Link key={strategy.id} href={`/dashboard/marketplace/${strategy.id}`}>
               <motion.div 
                 whileHover={{ y: -8, scale: 1.02 }}
                 className="group relative p-8 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[40px] hover:border-white/10 transition-all flex flex-col justify-between aspect-[4/5] overflow-hidden"
               >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{strategy.type.replace('_', ' ')}</span>
                       <div className="p-2 rounded-xl bg-white/5 text-white/40">
                          {strategy.type === 'MT5_EA' ? <Bot className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-[#FFD700] transition-colors">{strategy.name}</h4>
                       <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{strategy.symbol} · {strategy.timeframe}</p>
                    </div>

                    <div className="pt-4 flex gap-2">
                       <span className="px-3 py-1 bg-[#FFD700]/10 text-[#FFD700] text-[9px] font-black rounded-lg">₹{strategy.monthly_price_inr}/mo</span>
                       <span className="px-3 py-1 bg-[#00E676]/10 text-[#00E676] text-[9px] font-black rounded-lg">{strategy.win_rate || 0}% WR</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-white/40 group-hover:text-white transition-colors">
                     <span className="text-[10px] font-black uppercase italic tracking-widest">Connect Node</span>
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
               </motion.div>
             </Link>
           ))}
        </div>
      </motion.div>

      {/* 3. PROPAGATION HUB FOOTER */}
      <motion.div 
        variants={item}
        className="max-w-[1200px] mx-auto relative p-12 bg-gradient-to-br from-[#FFD700]/5 to-transparent border border-[#FFD700]/10 rounded-[64px] text-center space-y-8 overflow-hidden group"
      >
         <div className="absolute inset-0 bg-[#FFD700]/[0.01] pointer-events-none" />
         
         <div className="relative z-10 space-y-4">
            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Unified Verification Protocol</h4>
            <p className="text-[12px] text-white/30 font-bold uppercase tracking-[0.3em] font-sans max-w-2xl mx-auto italic">
              All strategies listed by **{creator.display_name}** are mirrored via the Coppr fiber execution hub. 
              Subscribers receive automated sync signals directly on their broker terminals.
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
               <span className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none">Mirror Operational</span>
            </div>
         </div>
      </motion.div>

    </motion.div>
  );
}
