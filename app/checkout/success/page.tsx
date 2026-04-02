'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  Download, 
  MessageCircle, 
  LayoutDashboard,
  ShieldCheck,
  Star,
  Copy,
  Check,
  Globe,
  Loader2,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import JourneyBar from '@/components/marketplace/JourneyBar';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const strategyId = searchParams.get('strategy_id');
  
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [mt5Account, setMt5Account] = useState('');
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    if (orderId && strategyId) {
      verifyPayment();
    } else {
        setVerifying(false);
        setError('Missing transaction protocol identifiers.');
    }
  }, [orderId, strategyId]);

  const verifyPayment = async () => {
    try {
        const res = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, strategyId })
        });
        const data = await res.json();

        if (data.status === 'SUCCESSFUL_FULFILLMENT' || data.status === 'ALREADY_FULFILLED') {
            setDetails(data);
            setVerifying(false);
        } else {
            setError(data.error || 'Payment verification in progress or failed.');
            setVerifying(false);
        }
    } catch (err) {
        setError('Connection to fulfillment engine lost.');
        setVerifying(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!mt5Account) return;
    setLinking(true);
    try {
        const res = await fetch('/api/vault/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subscriptionId: details?.subscriptionId, 
                mt5Account 
            })
        });
        if (res.ok) setLinked(true);
    } catch (err) {
        console.error('Linking error');
    } finally {
        setLinking(false);
    }
  };

  if (verifying) {
    return (
        <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin" />
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Verifying Secure Protocol...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center p-6 text-center space-y-8">
            <div className="w-20 h-20 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase italic">Handshake Failed</h2>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-xs mx-auto">
                    {error}
                </p>
            </div>
            <Link href="/dashboard/marketplace" className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-[#FFD700] uppercase tracking-widest">Return to Terminal</Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[800px]">
        <JourneyBar currentStep={4} />
      </div>

      <main className="max-w-3xl w-full mt-16 text-center space-y-12 pb-20">
        <div className="relative inline-block">
             <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00E676] to-[#00B0FF] flex items-center justify-center shadow-[0_0_50px_rgba(0,176,255,0.3)]"
             >
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
             </motion.div>
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-[-10px] border border-dashed border-[#00E676]/20 rounded-full" />
        </div>

        <section className="space-y-4">
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Access Granted.</h1>
             <p className="text-[#00E676] text-[13px] font-black tracking-[0.2em] uppercase">{details?.strategy_name} is now Authorized</p>
        </section>

        {/* Fulfillment Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Action 1: Activation */}
            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-6 text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Activation Handshake</h3>
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed">
                    Link your MetaTrader 5 account ID now to authorize the license for life.
                </p>
                {linked ? (
                     <div className="py-4 px-6 bg-[#00E676]/10 border border-[#00E676]/30 rounded-2xl flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[#00E676]" />
                        <span className="text-[10px] font-black text-[#00E676] uppercase">Account Authorized</span>
                     </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="MT5 Account Number" 
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs text-white outline-none focus:border-[#FFD700]/30"
                            value={mt5Account}
                            onChange={(e) => setMt5Account(e.target.value)}
                        />
                        <button onClick={handleLinkAccount} disabled={linking} className="px-6 py-4 bg-[#FFD700] text-black font-black uppercase text-[10px] rounded-2xl hover:scale-105 transition-all">
                            {linking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Link'}
                        </button>
                    </div>
                )}
            </div>

            {/* Action 2: Asset Download */}
            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-6 text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#00B0FF]/10 text-[#00B0FF]">
                        <Download className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Secure Asset</h3>
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed">
                    Secure the .ex5 binary watermarked for your account. One-time encrypted build.
                </p>
                <Link 
                    href={`/api/strategies/download/${strategyId}`} 
                    prefetch={false}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase hover:bg-white/10 transition-all"
                >
                    Download Compiled Asset <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { 
                    label: 'Sync Now', 
                    title: 'Vault Access', 
                    desc: 'Manage your active strategies', 
                    icon: LayoutDashboard, 
                    link: '/dashboard/bots',
                    color: '#FFD700'
                },
                { 
                    label: 'Setup Guide', 
                    title: 'Protocol Manual', 
                    desc: 'Installation instructions', 
                    icon: ShieldCheck, 
                    link: '/docs', 
                    color: '#00E676'
                },
                { 
                    label: 'Join Feed', 
                    title: 'WhatsApp Ops', 
                    desc: 'Live execution alerts', 
                    icon: MessageCircle, 
                    link: '#', 
                    color: '#00B0FF'
                }
            ].map((item, i) => (
                <motion.div 
                   key={i}
                    whileHover={{ y: -5 }}
                   className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col items-center text-center group cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-[#FFD700]/10 group-hover:text-[#FFD700] transition-colors mb-4">
                        <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{item.label}</span>
                    <h4 className="text-[14px] font-black text-white mb-1">{item.title}</h4>
                    <Link href={item.link} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:underline">
                        Launch <ArrowRight className="w-3 h-3" />
                    </Link>
                </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
}
