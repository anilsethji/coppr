'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
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

import AssetDiscoveryDrawer from './AssetDiscoveryDrawer';

const SignalVisualizer = dynamic(
  () => import('./SignalVisualizer').then(mod => mod.SignalVisualizer),
  { ssr: false }
);

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
  const [serverName, setServerName] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activeAssets, setActiveAssets] = useState<string[]>([]);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [previewSymbol, setPreviewSymbol] = useState('XAUUSD');

  const handleNext = () => setStep(prev => prev + 1);

  const handleFinalActivate = async () => {
    setIsActivating(true);
    await onActivate({
      brokerType: selectedBroker.id,
      accountId,
      apiKey,
      apiSecret,
      activeAssets,
      meta: {
        server: serverName
      }
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
        className="relative w-full max-w-2xl bg-[#0D121F] border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-2.5 bg-[#FFD700]/10 rounded-xl">
                 <Zap className="w-4 h-4 md:w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                 <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Protocol Activation</h2>
                 <p className="text-[9px] md:text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">{strategyName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <X className="w-4 h-4 md:w-5 h-5 text-white/20" />
           </button>
        </div>

        <div className="p-6 md:p-10 space-y-8 md:space-y-10">
           
           {/* Step Indicator */}
           <div className="flex items-center gap-3 md:gap-4 px-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2 md:gap-3">
                   <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-[10px] md:text-xs italic ${step === i ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : step > i ? 'bg-[#00E676] text-black' : 'bg-white/5 text-white/20'}`}>
                      {step > i ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : i}
                   </div>
                   {i < 4 && <div className={`w-8 md:w-10 h-[2px] rounded-full ${step > i ? 'bg-[#00E676]' : 'bg-white/5'}`} />}
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
                   className="space-y-5 md:space-y-6"
                 >
                    <div className="space-y-1 px-1">
                       <h3 className="text-base md:text-lg font-black text-white uppercase italic">Target <span className="text-[#FFD700]">Broker</span></h3>
                       <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest italic">Where should the signals be mirrored?</p>
                    </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                       {supportedBrokers.map(broker => (
                         <button 
                            key={broker.id} 
                            onClick={() => setSelectedBroker(broker)}
                            className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all flex flex-col items-center gap-2 md:gap-3 group relative overflow-hidden ${selectedBroker?.id === broker.id ? 'bg-[#FFD700]/5 border-[#FFD700]/40' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                         >
                            <broker.icon className={`w-5 h-5 md:w-6 md:h-6 ${selectedBroker?.id === broker.id ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-white/40'}`} />
                            <span className={`text-[9px] md:text-[10px] font-black uppercase italic truncate w-full px-1 ${selectedBroker?.id === broker.id ? 'text-white' : 'text-white/20'}`}>{broker.name}</span>
                         </button>
                       ))}
                    </div>

                    <div className="flex justify-end pt-2 md:pt-6">
                       <button 
                          disabled={!selectedBroker}
                          onClick={handleNext}
                          className="w-full md:w-auto px-10 py-4 bg-[#FFD700] text-black rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10 disabled:opacity-50"
                       >
                          Next Phase <ChevronRight className="inline w-4 h-4 ml-1" />
                       </button>
                    </div>
                </motion.div>
              )}

              {/* Step 2: "Invisible Execution" Handshake */}
              {step === 2 && (
                 <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-white uppercase italic">Invisible <span className="text-[#00B0FF]">Execution Handshake</span></h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">Pairing your broker node with the Coppr Propagation Engine.</p>
                    </div>

                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">
                              {['ZERODHA', 'ANGELONE', 'DHAN', 'GROWW'].includes(selectedBroker?.id) ? 'Institutional Client ID' : 'Account Identifier'}
                           </label>
                           <input 
                             type="text" 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#FFD700]/40 transition-all font-sans"
                             placeholder={selectedBroker?.id === 'MT5' ? "MT5 Login ID" : "Secure Node Identifier"}
                             value={accountId}
                             onChange={e => setAccountId(e.target.value)}
                           />
                        </div>

                        {selectedBroker?.id === 'MT5' ? (
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">Master Password</label>
                                 <input 
                                   type="password" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#FFD700]/40 transition-all font-sans"
                                   placeholder="Broker Password"
                                   value={apiKey}
                                   onChange={e => setApiKey(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">Meta Server</label>
                                 <input 
                                   type="text" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#FFD700]/40 transition-all font-sans"
                                   placeholder="e.g. MetaQuotes-Demo"
                                   value={serverName}
                                   onChange={e => setServerName(e.target.value)}
                                 />
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">
                                    Execution API Token
                                 </label>
                                 <input 
                                   type="password" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00B0FF]/40 transition-all font-sans"
                                   placeholder="Enter Key"
                                   value={apiKey}
                                   onChange={e => setApiKey(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase italic tracking-widest ml-1">
                                    Secure Secret Bridge
                                 </label>
                                 <input 
                                   type="password" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00B0FF]/40 transition-all font-sans"
                                   placeholder="Enter Secret"
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

              {/* Step 3: SEBI 2026 Compliance Handshake */}
              {step === 3 && (
                 <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="p-6 md:p-10 rounded-[40px] bg-[#FF5252]/5 border border-[#FF5252]/20 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <AlertTriangle className="w-24 h-24 text-[#FF5252]" />
                        </div>
                        <div className="flex items-center gap-3 text-[#FF5252]">
                           <ShieldCheck className="w-5 h-5" />
                           <h4 className="text-[11px] font-black uppercase italic tracking-widest">Regulatory Compliance Header (SEBI 2026)</h4>
                        </div>
                        <div className="space-y-4 relative z-10">
                           <p className="text-[10px] text-[#FF5252]/70 font-bold leading-relaxed italic uppercase tracking-wider">
                              Algotrading and signal mirroring carry extreme market risk. Coppr is a technology-agent service bridging master nodes to retail proxies. 
                           </p>
                           <ul className="space-y-2 text-[9px] text-white/30 uppercase font-black italic tracking-widest list-none">
                              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF5252]" /> No guaranteed returns</li>
                              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF5252]" /> Full capital exposure</li>
                              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF5252]" /> Manual kill-switch available</li>
                           </ul>
                        </div>
                    </div>
 
                    <label className="flex items-start gap-5 p-6 md:p-8 rounded-[40px] bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all group">
                        <div className="mt-1 relative flex items-center justify-center shrink-0">
                           <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded-lg checked:bg-[#00E676] checked:border-[#00E676] transition-all cursor-pointer" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} />
                           <Check className="absolute w-4 h-4 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className="text-[9px] text-white/50 leading-relaxed uppercase tracking-widest font-black italic group-hover:text-white/70 transition-colors">
                           I authorize {strategyName} to mirror execution commands to my {selectedBroker?.name} node. I accept all regulatory frameworks effective April 1, 2026.
                        </span>
                    </label>

                    <div className="flex justify-between items-center pt-2 md:pt-6 gap-4">
                        <button onClick={() => setStep(2)} className="text-[9px] md:text-[10px] font-black text-white/20 uppercase italic tracking-widest hover:text-white transition-colors">Back</button>
                        <button 
                         disabled={!legalAccepted}
                         onClick={handleNext}
                         className="flex-1 md:flex-none px-12 py-5 bg-[#FFD700] text-black rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/10"
                       >
                          Discovery Phase <ChevronRight className="inline w-4 h-4 ml-1" />
                       </button>
                    </div>
                 </motion.div>
               )}

               {/* Step 4: Asset Discovery & Dynamic Sync */}
               {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                     <div className="space-y-1">
                        <h3 className="text-lg font-black text-white uppercase italic">Target <span className="text-[#00E676]">Whitelisting</span></h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">Only signals for authorized assets will be mirrored.</p>
                     </div>

                     <div className="p-6 md:p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00E676]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex flex-col gap-1 relative z-10">
                           <span className="text-2xl font-black text-[#00E676] italic tracking-tighter">{activeAssets.length} Assets Authorized</span>
                           <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] leading-none">Institutional Whitelist Pool</span>
                        </div>
                        <button 
                          onClick={() => setIsAssetDrawerOpen(true)}
                          className="px-8 py-4 bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00E676]/20 transition-all italic relative z-10"
                        >
                          Discover & Add
                        </button>
                     </div>

                     {/* Live Chart Preview (Instantly Synced) */}
                     <div className="space-y-4">
                        <div className="flex items-center justify-between px-3">
                           <div className="flex flex-col">
                              <h4 className="text-[9px] font-black text-white uppercase tracking-widest italic opacity-40">Dynamic Data Link</h4>
                              <div className="flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{previewSymbol} LIVE</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-1.5 opacity-20">
                              <span className="text-[8px] font-mono uppercase tracking-widest font-black italic">Mirror_Ready</span>
                           </div>
                        </div>
                        
                        <div className="h-[220px] rounded-[40px] border border-white/5 bg-black/60 overflow-hidden relative group shadow-2xl flex flex-col">
                           {activeAssets.length > 0 && (
                                <div className="absolute top-4 right-4 z-40 max-w-[250px] flex flex-wrap justify-end gap-1.5 pointer-events-none">
                                    {activeAssets.slice(0, 4).map(a => (
                                        <span key={a} className="px-2 py-1 bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] rounded-md text-[8px] font-black uppercase tracking-widest shadow-lg shadow-[#00E676]/10">{a}</span>
                                    ))}
                                    {activeAssets.length > 4 && <span className="px-2 py-1 bg-white/10 text-white/50 rounded-md text-[8px] font-black border border-white/5">+{activeAssets.length - 4}</span>}
                                </div>
                           )}
                           <SignalVisualizer 
                               symbol={previewSymbol} 
                               logs={[]} 
                               activeSymbols={activeAssets.length > 0 ? activeAssets : [previewSymbol]}
                               onSymbolChange={setPreviewSymbol}
                           />
                        </div>

                        <AssetDiscoveryDrawer 
                           isOpen={isAssetDrawerOpen}
                           onClose={() => setIsAssetDrawerOpen(false)}
                           brokerType={selectedBroker?.id}
                           selectedAssets={activeAssets}
                           onAssetToggle={(sym) => {
                               setActiveAssets(prev => {
                                   if (prev.includes(sym)) return prev.filter(s => s !== sym);
                                   setPreviewSymbol(sym); // Instantly flash chart to newly selected asset
                                   return [...prev, sym];
                               });
                           }}
                           onPreviewSymbol={setPreviewSymbol}
                        />
                     </div>

                     <div className="flex justify-between items-center pt-2 md:pt-6 gap-4">
                        <button onClick={() => setStep(3)} className="text-[9px] md:text-[10px] font-black text-white/20 uppercase italic tracking-widest hover:text-white transition-colors">Back</button>
                        <button 
                         disabled={isActivating}
                         onClick={handleFinalActivate}
                         className="flex-1 md:flex-none px-12 py-5 bg-[#00E676] text-black rounded-3xl text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-[#00E676]/20 disabled:opacity-50 flex items-center justify-center gap-3"
                       >
                          {isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                          Initialize Global Mirror
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
