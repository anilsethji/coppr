'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  Bot, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Users, 
  PlayCircle,
  Globe,
  Cpu,
  Lock,
  ChevronDown,
  ArrowUpRight,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { PriceTicker } from '@/components/PriceTicker';
import { Logo } from '@/components/ui/Logo';
import Navbar from '@/components/layout/Navbar';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const headlines = [
    {
        main: <>TRADE LIKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">MACHINE.</span></>,
        sub: "Execute precision algorithms from verified creators. Mirror real-time trades on MT5 & TradingView with sub-second execution."
    },
    {
        main: <>INDIA'S FIRST <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00]">ALGO MARKETPLACE.</span></>,
        sub: "Buy, subscribe and run automated EA bots and indicators built by real traders. Live-tested on real accounts. Gold, Forex, NSE — all in one place."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
        setHeadlineIndex(prev => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080C14] text-white selection:bg-[#FFD700] selection:text-black font-sans overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-[#FFD700]/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-[#00E676]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-[#FFD700]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
                <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Marketplace V2.0 is Live</span>
            </motion.div>

            <div className="relative h-[220px] md:h-[300px] w-full flex flex-col items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={headlineIndex}
                        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center space-y-8 absolute w-full"
                    >
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl">
                            {headlines[headlineIndex].main}
                        </h1>

                        <p className="text-lg md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed">
                            {headlines[headlineIndex].sub}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
               className="flex flex-col sm:flex-row gap-4 pt-4"
            >
                <Link href="/login" className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-black font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(255,215,0,0.2)] hover:scale-105 transition-all flex items-center gap-3">
                    Launch Dashboard
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#marketplace" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                    Browse Marketplace
                </Link>
            </motion.div>
          </div>
        </div>

        {/* Live Ticker Integration */}
        <div className="mt-20 border-y border-white/5 bg-white/[0.01] backdrop-blur-md">
            <PriceTicker />
        </div>
      </section>

      {/* 2. PLATFORM STATS */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { label: 'Trade Volume', value: '$850k+', icon: Zap, color: '#FFD700' },
                { label: 'Active Signals', value: '124', icon: Activity, color: '#00E676' },
                { label: 'Verified Creators', value: '42', icon: ShieldCheck, color: '#00B0FF' },
                { label: 'Total Users', value: '4.2k', icon: Users, color: '#9C6EFA' }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <stat.icon className="w-5 h-5 opacity-20 mb-2" />
                    <span className="text-3xl md:text-5xl font-black text-white">{stat.value}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.label}</span>
                </div>
            ))}
        </div>
      </section>

      {/* 3. FEATURED STRATEGIES (Preview) */}
      <section id="marketplace" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter">ELITE <span className="text-white/20">STRATEGIES.</span></h2>
                    <p className="text-[14px] text-white/40 font-bold uppercase tracking-widest">Hand-picked algorithms with consistent performance history.</p>
                </div>
                <Link href="/dashboard/marketplace" className="group flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-[#FFD700] hover:underline underline-offset-8">
                    View Entire Marketplace
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: 'XAU Scalper V4', type: 'MT5 EA', wr: '74%', roi: '+12.5%', creator: 'ApexAlgo' },
                    { name: 'Nifty Trend Rider', type: 'Pine Script', wr: '68%', roi: '+8.2%', creator: 'QuantMaster' },
                    { name: 'Crypto Liquidity EA', type: 'MT5 EA', wr: '81%', roi: '+15.4%', creator: 'Coppr Official' }
                ].map((s, i) => (
                    <motion.div 
                       key={i}
                       whileHover={{ y: -10 }}
                       className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Bot className="w-20 h-20" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-4 block">{s.type}</span>
                        <h4 className="text-2xl font-black text-white mb-6">{s.name}</h4>
                        
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">WIN RATE</span>
                                <span className="text-[#00E676] font-black">{s.wr}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">AVG ROI</span>
                                <span className="text-white font-black">{s.roi}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10" />
                                <span className="text-[11px] font-bold text-white/40 group-hover:text-white transition-colors">{s.creator}</span>
                            </div>
                            <Link href="/dashboard/marketplace" className="p-3 rounded-xl bg-[#FFD700] text-black group-hover:scale-110 transition-transform">
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. CREATOR NETWORK SECTION */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">JOIN THE TOP <span className="text-[#FFD700]">1%</span> OF STRATEGY CREATORS.</h2>
                <p className="text-lg text-white/40 leading-relaxed max-w-lg">
                    Build your audience, publish your edge, and keep 70% of the revenue. Our infrastructure handles execution, billing, and distribution.
                </p>
                <div className="space-y-6">
                    {[
                        { t: 'Secure Distribution', d: 'High-fidelity verification protocols and encryption.', i: ShieldCheck },
                        { t: 'Global Payouts', d: 'Instant settlements in INR via Cashfree.', i: Zap },
                        { t: 'Unlimited Scalability', d: 'Mirror trades to thousands of accounts simultaneously.', i: Globe }
                    ].map((feat, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center shrink-0">
                                <feat.i className="w-5 h-5 text-[#FFD700]" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">{feat.t}</h4>
                                <p className="text-sm text-white/30">{feat.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/dashboard/creator/submit" className="inline-block px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[#FFD700] transition-all">
                    Apply to Publish
                </Link>
            </div>

            {/* Visual Abstract */}
            <div className="relative">
                <div className="absolute inset-0 bg-[#FFD700]/5 blur-[200px] rounded-full" />
                <div className="p-8 md:p-12 rounded-[60px] bg-white/[0.02] border border-white/10 relative z-10 backdrop-blur-3xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#FFD700] flex items-center justify-center text-black shadow-lg shadow-[#FFD700]/20">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="text-[14px] font-black text-white">Mainframe Terminal</h5>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol 1.0 Active</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-black text-white/20 uppercase mb-1">TOTAL DATA VOL.</span>
                                <span className="text-[#00E676] font-bold">1.2 TB/s</span>
                            </div>
                        </div>
                        
                        <div className="h-[200px] w-full bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                            <svg className="w-full h-full p-4" viewBox="0 0 400 150">
                                <path d="M0 100 Q50 90 100 110 T200 60 T300 80 T400 30" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,5" className="opacity-20" />
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    d="M0 100 Q50 90 100 110 T200 60 T300 80 T400 30" 
                                    fill="none" stroke="#FFD700" strokeWidth="3" 
                                />
                                {[100, 200, 300].map(x => (
                                    <circle key={x} cx={x} cy={70} r="4" fill="#FFD700" className="animate-pulse" />
                                ))}
                            </svg>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-[9px] font-black text-white/20 uppercase mb-2">Network Latency</span>
                                <span className="text-white font-bold tracking-tight">14ms AVG</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-[9px] font-black text-white/20 uppercase mb-2">Success Rate</span>
                                <span className="text-[#00E676] font-bold tracking-tight">99.98%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">CHOOSE YOUR <span className="text-white/20">SPEED.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Plan 1 */}
                <div className="p-10 rounded-[48px] bg-white/[0.03] border border-white/10 flex flex-col group hover:bg-white/[0.05] transition-all">
                    <div className="mb-8 p-3 rounded-2xl bg-white/5 w-fit">
                        <Users className="w-6 h-6 text-white/40" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Platform All-Access</h3>
                    <p className="text-[12px] text-white/40 uppercase font-bold tracking-widest mb-8">One subscription, all indicators.</p>
                    <div className="flex items-baseline gap-2 mb-10">
                        <span className="text-5xl font-black text-white tracking-tighter">₹1999</span>
                        <span className="text-sm font-bold text-white/20">/month</span>
                    </div>
                    <ul className="space-y-4 mb-12">
                        {['All Indicators included', 'MT5 Strategy Backtests', 'Platform Tutorials', 'Telegram Community'].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/60">
                                <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/checkout" className="mt-auto py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 text-center transition-all">
                        Get Started
                    </Link>
                </div>

                {/* Plan 2 */}
                <div className="p-10 rounded-[48px] bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/30 flex flex-col relative overflow-hidden shadow-2xl shadow-[#FFD700]/5">
                    <div className="absolute top-0 right-0 p-8">
                        <Zap className="w-12 h-12 text-[#FFD700] opacity-20" />
                    </div>
                    <div className="mb-8 p-3 rounded-2xl bg-[#FFD700]/20 w-fit">
                        <Lock className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Strategy License</h3>
                    <p className="text-[12px] text-[#FFD700] uppercase font-bold tracking-widest mb-8">Individual bot performance.</p>
                    <div className="flex items-baseline gap-2 mb-10">
                        <span className="text-sm font-bold text-white/20 uppercase">STARTING FROM</span>
                        <span className="text-5xl font-black text-white tracking-tighter">₹999</span>
                        <span className="text-sm font-bold text-white/20">/bot</span>
                    </div>
                    <ul className="space-y-4 mb-12">
                        {['Full Automated Execution', 'Webhook MT5 Setup', '7-Day Refund Policy', 'Creator Support Feed'].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/60">
                                <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/dashboard/marketplace" className="mt-auto py-5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FFD700]/20 text-center hover:scale-[1.02] transition-all">
                        Browse Strategies
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-16 underline underline-offset-[16px] decoration-white/5">TECHNICAL FAQ.</h2>
            <div className="space-y-4">
                {[
                    { q: 'How does auto-execution work?', a: 'Once you subscribe, you connect your broker API. Our bridge receives signals from the creator and mirrors them instantly in your terminal.' },
                    { q: 'Is my capital safe?', a: "We never have access to your funds. Trades are executed on your own broker terminal. You retain full control over your risk settings." },
                    { q: 'Can I cancel anytime?', a: 'Yes. All subscriptions are monthly with no long-term contracts. You can cancel with one click from your dashboard.' },
                    { q: 'What is the refund policy?', a: 'We offer a 7-day "No Questions Asked" refund on all new strategy subscriptions if you are not satisfied.' }
                ].map((faq, i) => (
                    <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
                        <button 
                           onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                           className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className="text-lg font-bold text-white/80">{faq.q}</span>
                            <ChevronDown className={`w-5 h-5 text-white/20 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {activeFaq === i && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-6"
                                >
                                    <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-40 relative">
        <div className="absolute inset-0 bg-[#FFD700]/5 blur-[250px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none">STOP WATCHING.<br/><span className="text-[#00E676]">START EXECUTING.</span></h2>
            <p className="text-[14px] text-white/30 font-bold uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                Join the thousands of traders automating their path to consistency.
            </p>
            <div className="pt-6">
                <Link href="/login" className="px-12 py-6 rounded-2xl bg-[#FFD700] text-black font-black uppercase tracking-widest text-lg shadow-2xl hover:scale-105 transition-all">
                    Get System Access
                </Link>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
                <Link href="/" className="flex items-center gap-3">
                    <Logo variant="dark" className="w-8 h-8 opacity-40" />
                    <span className="text-2xl font-black tracking-tighter opacity-40">Coppr</span>
                </Link>
                <p className="text-[11px] text-white/20 font-bold uppercase leading-relaxed">
                    Premium algorithmic infrastructure for the modern quantitative trader.
                </p>
            </div>
            {['Product', 'Legal', 'Connect'].map((col, i) => (
                <div key={i} className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{col}</h5>
                    <ul className="space-y-4">
                        {col === 'Product' && ['Marketplace', 'Creators', 'API Docs'].map(l => <li key={l}><Link href="#" className="text-sm font-bold text-white/20 hover:text-[#FFD700] transition-colors">{l}</Link></li>)}
                        {col === 'Legal' && ['Privacy', 'Terms', 'Refunds'].map(l => <li key={l}><Link href="#" className="text-sm font-bold text-white/20 hover:text-[#FFD700] transition-colors">{l}</Link></li>)}
                        {col === 'Connect' && ['Twitter', 'Discord', 'Support'].map(l => <li key={l}><Link href="#" className="text-sm font-bold text-white/20 hover:text-[#FFD700] transition-colors">{l}</Link></li>)}
                    </ul>
                </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/10">
            <span>© 2026 COPPR TRADE NETWORK</span>
            <span>SECURED BY COMTEL PROTOCOLS</span>
         </div>
      </footer>
      
    </div>
  );
}
