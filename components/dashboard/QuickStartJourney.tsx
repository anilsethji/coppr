'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Activity,
  Terminal,
  Settings,
  ArrowUpRight
} from 'lucide-react';

interface Step {
  title: string;
  desc: string;
  icon: any;
  color: string;
}

const subscriberSteps: Step[] = [
  { title: 'Explore Alpha', desc: 'Browse official and community strategies in the marketplace.', icon: Globe, color: '#FFD700' },
  { title: 'Join Mirror', desc: 'Add desired indicators or EAs to your Signal Sync Vault.', icon: Zap, color: '#00E676' },
  { title: 'Link Broker', desc: 'Initialize a secure, low-latency connection to your broker terminal.', icon: ShieldCheck, color: '#00B0FF' },
  { title: 'Mirror Active', desc: 'System automatically executes signals via the Coppr cloud network.', icon: Activity, color: '#FF4081' }
];

const creatorSteps: Step[] = [
  { title: 'Define Logic', desc: 'Configure your strategy name, asset symbol, and timeframe.', icon: Settings, color: '#FFD700' },
  { title: 'Get Connector', desc: 'Copy your unique Webhook URL and JSON Handshake template.', icon: Terminal, color: '#00E676' },
  { title: 'Trigger Alert', desc: 'Create a TradingView alert and paste the connector data.', icon: Zap, color: '#00B0FF' },
  { title: 'Live Pulse', desc: 'Verify your signal pulse in the terminal and launch public.', icon: Globe, color: '#FF4081' }
];

export default function QuickStartJourney({ type = 'subscriber' }: { type?: 'subscriber' | 'creator' }) {
  const steps = type === 'subscriber' ? subscriberSteps : creatorSteps;
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#00E676]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em] mb-3">Protocol Optimization</p>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                {type === 'subscriber' ? 'Mirroring' : 'Creator'} <span className="text-white/40">QuickStart</span> Journey
              </h3>
           </div>
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 italic">
              <span className="text-[10px] font-black text-white/40 uppercase">Handshake v2.1</span>
              <div className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
           </div>
        </div>

        {/* Step Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {steps.map((step, idx) => {
             const isActive = idx === currentStep;
             const isCompleted = idx < currentStep;
             const Icon = step.icon;

             return (
               <div 
                 key={idx} 
                 className={`relative space-y-6 transition-all duration-500 cursor-pointer group`}
                 onClick={() => setCurrentStep(idx)}
               >
                 {/* Progress Line */}
                 {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-full w-full h-[1px] bg-white/10 z-0">
                       <motion.div 
                        initial={false}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        className="h-full bg-gradient-to-r from-[#FFD700] to-[#00E676]" 
                       />
                    </div>
                 )}

                 <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all z-10 relative overflow-hidden ${
                        isActive ? 'bg-[#FFD700]/10 border-[#FFD700]/40 shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 
                        isCompleted ? 'bg-[#00E676]/10 border-[#00E676]/40' : 'bg-white/5 border-white/10'
                      }`}
                    >
                       {isCompleted ? (
                         <CheckCircle2 className="w-6 h-6 text-[#00E676]" />
                       ) : (
                         <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-white/40'}`} style={{ color: isActive ? step.color : undefined }} />
                       )}
                    </motion.div>

                    <div className="space-y-1">
                       <h4 className={`text-[12px] font-black uppercase tracking-widest italic transition-colors ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                         {idx + 1}. {step.title}
                       </h4>
                       <p className={`text-[10px] font-bold leading-relaxed transition-opacity font-sans uppercase tracking-tight ${isActive ? 'text-white/40' : 'text-white/10 opacity-0 group-hover:opacity-100'}`}>
                         {step.desc}
                       </p>
                    </div>
                 </div>

                 {isActive && (
                    <motion.div 
                      layoutId="journey-active"
                      className="absolute -inset-4 bg-white/[0.02] border border-white/5 rounded-3xl -z-10"
                    />
                 )}
               </div>
             );
           })}
        </div>

        {/* Action / Detail Box */}
        <AnimatePresence mode="wait">
           <motion.div 
             key={currentStep}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="p-8 md:p-10 bg-black/40 border border-white/5 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 group"
           >
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: steps[currentStep].color }} />
                    <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">Step Insight</span>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">
                    {steps[currentStep].title} <span className="text-white/20">Protocol</span>
                 </h4>
                 <p className="text-sm text-white/40 font-bold font-sans max-w-xl leading-relaxed italic">
                    {steps[currentStep].desc} Detailed documentation and protocol standards available in the central Knowledge Hub.
                 </p>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-black uppercase text-[10px] rounded-2xl hover:bg-white/10 transition-all font-sans italic flex items-center gap-3"
                 >
                    Next Logic <ChevronRight className="w-4 h-4" />
                 </button>
                 <button 
                  className="px-8 py-4 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 font-sans italic flex items-center gap-3"
                 >
                    Initialize Now <ArrowUpRight className="w-4 h-4" />
                 </button>
              </div>
           </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
