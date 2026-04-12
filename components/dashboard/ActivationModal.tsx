'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Check, 
  Loader2, 
  TrendingUp, 
  Target,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategyName: string;
  strategyId: string;
  onActivate: (brokerData: any) => Promise<void>;
  supportedBrokers: any[];
}

export default function ActivationModal({ 
  isOpen, 
  onClose, 
  strategyName, 
  strategyId, 
  onActivate,
  supportedBrokers 
}: ActivationModalProps) {
  const [step, setStep] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [accountId, setAccountId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);

  const handleFinalActivate = async () => {
    setIsActivating(true);
    await onActivate({
      brokerType: selectedBroker.id,
      accountId,
      apiKey,
      apiSecret
    });
    setIsActivating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#060A12]/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0D121F] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#FFD700]/10 rounded-xl">
                 <Zap className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Protocol Activation</h2>
                 <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">{strategyName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <X className="w-5 h-5 text-white/20" />
           </button>
        </div>

        <div className="p-10 space-y-10">
           
           {/* Step Indicator */}
           <div className="flex items-center gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs italic ${step === i ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : step > i ? 'bg-[#00E676] text-black' : 'bg-white/5 text-white/20'}`}>
                      {step > i ? <Check className="w-4 h-4" /> : i}
                   </div>
                   {i < 3 && <div className={`w-12 h-[2px] rounded-full ${step > i ? 'bg-[#00E676]' : 'bg-white/5'}`} />}
                </div>
              ))}
           </div>

           {/* Step 1: Broker Selection */}
           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="space-y-1">
                      <h3 className="text-lg font-black text-white uppercase italic">Target <span className="text-[#FFD700]">Broker</span></h3>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">Where should the signals be mirrored?</p>
                   </div>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {supportedBrokers.map(broker => (
                        <button 
                           key={broker.id} 
                           onClick={() => setSelectedBroker(broker)}
                           className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${selectedBroker?.id === broker.id ? 'bg-[#FFD700]/5 border-[#FFD700]/40' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                        >
                           <broker.icon className={`w-6 h-6 ${selectedBroker?.id === broker.id ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-white/40'}`} />
                           <span className={`text-[10px] font-black uppercase italic ${selectedBroker?.id === broker.id ? 'text-white' : 'text-white/20'}`}>{broker.name}</span>
                        </button>
                      ))}
                   </div>

                   <div className="flex justify-end pt-6">
                      <button 
                         disabled={!selectedBroker}
                         onClick={handleNext}
                         className="px-10 py-4 bg-[#FFD700] text-black rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 disabled:opacity-50"
                      >
                         Next Phase <ChevronRight className="inline w-4 h-4 ml-1" />
                      </button>
                   </div>
                </motion.div>
              )}

              {/* Step 2: Credentials */}
              {step === 2 && (
                 <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-white uppercase italic">Secure <span className="text-[#00B0FF]">Authentication</span></h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">Coppr uses end-to-end proprietary encryption.</p>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">Account Identifier</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#FFD700]/40 transition-all font-sans"
                            placeholder="Primary Account ID"
                            value={accountId}
                            onChange={e => setAccountId(e.target.value)}
                          />
                       </div>

                       {selectedBroker?.id !== 'MT5' && selectedBroker?.id !== 'ZERODHA' && (
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">API Token</label>
                                <input 
                                  type="password" 
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00B0FF]/40 transition-all font-sans"
                                  placeholder="Secret Key"
                                  value={apiKey}
                                  onChange={e => setApiKey(e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">Secret IV</label>
                                <input 
                                  type="password" 
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00B0FF]/40 transition-all font-sans"
                                  placeholder="IV / Salt"
                                  value={apiSecret}
                                  onChange={e => setApiSecret(e.target.value)}
                                />
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="flex justify-between pt-6">
                        <button onClick={() => setStep(1)} className="text-[10px] font-black text-white/20 uppercase italic tracking-widest hover:text-white transition-colors">Back</button>
                        <button 
                         disabled={!accountId}
                         onClick={handleNext}
                         className="px-10 py-4 bg-[#FFD700] text-black rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 disabled:opacity-50"
                      >
                         Next Phase <ChevronRight className="inline w-4 h-4 ml-1" />
                      </button>
                    </div>
                 </motion.div>
              )}

              {/* Step 3: Global Handshake */}
              {step === 3 && (
                 <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="p-8 rounded-[32px] bg-[#FF5252]/5 border border-[#FF5252]/20 space-y-4">
                        <div className="flex items-center gap-3 text-[#FF5252]">
                           <AlertTriangle className="w-5 h-5" />
                           <h4 className="text-[11px] font-black uppercase italic tracking-widest">Market Risk Acknowledgement</h4>
                        </div>
                        <p className="text-[10px] text-[#FF5252]/60 font-medium leading-loose italic">
                           By initiating this mirror, you acknowledge that algorithmic trading involves significant risk. Coppr Trade Network is an empanelled technology provider and does not provide financial advice. Your capital is exposed to live market conditions.
                        </p>
                    </div>

                    <label className="flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <div className="mt-1 relative flex items-center justify-center">
                           <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded-md checked:bg-[#00E676] checked:border-[#00E676] transition-all cursor-pointer" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} />
                           <Check className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className="text-[9px] text-white/50 leading-relaxed uppercase tracking-widest font-black italic">
                           I authorize the mirroring of signals from {strategyName} to my {selectedBroker?.name} account. I accept the SEBI framework (April 2026) guidelines for institutional copy-trading.
                        </span>
                    </label>

                    <div className="flex justify-between pt-6">
                        <button onClick={() => setStep(2)} className="text-[10px] font-black text-white/20 uppercase italic tracking-widest hover:text-white transition-colors">Back</button>
                        <button 
                         disabled={!legalAccepted || isActivating}
                         onClick={handleFinalActivate}
                         className="px-12 py-5 bg-[#00E676] text-black rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-[#00E676]/20 disabled:opacity-50 flex items-center gap-3"
                      >
                         {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                         Initiate Global Mirror
                      </button>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
