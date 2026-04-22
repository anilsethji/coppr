'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Store, 
  Bot, 
  BarChart3, 
  PlayCircle, 
  Zap, 
  LifeBuoy, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [initials, setInitials] = useState('JD');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, is_admin')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setIsAdmin(!!profile.is_admin);
          if (profile.full_name) {
            const parts = profile.full_name.split(' ');
            const first = parts[0]?.charAt(0) || '';
            const last = parts[parts.length - 1]?.charAt(0) || '';
            setInitials((first + last).toUpperCase() || 'JD');
          }
        }
      }
    };
    fetchProfile();
  }, []);

  const mainLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: Store },
    { name: 'EA Bots', href: '/dashboard/bots', icon: Bot },
    { name: 'Indicators', href: '/dashboard/indicators', icon: BarChart3 },
    { name: 'Video Tutorials', href: '/dashboard/tutorials', icon: PlayCircle },
    { name: 'Live Updates', href: '/dashboard/updates', icon: Zap, badge: true }
  ];

  const supportLinks = [
    { name: 'Setup Guides', href: '/dashboard/guides', icon: LifeBuoy },
    { name: 'Support', href: '/dashboard/support', icon: MessageSquare },
    { name: 'My Account', href: '/dashboard/account', icon: User }
  ];

  const creatorLinks = [
    { name: 'My Algos & Indicators', href: '/dashboard/creator/submit', icon: Zap }
  ];

  // Logic to conditionally add Admin Console
  const finalSupportLinks = [...supportLinks];
  if (isAdmin) {
    finalSupportLinks.push({ name: 'Admin Console', href: '/dashboard/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row pt-[72px] md:pt-0 overflow-x-hidden selection:bg-[#FFD700] selection:text-black">
      
      {/* INSTITUTIONAL SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-[240px] h-screen sticky top-0 border-r border-white/[0.03] z-50 overflow-y-auto no-scrollbar bg-[#050810]/80 backdrop-blur-3xl">
        
        {/* Logo Area */}
        <div className="px-6 py-8 border-b border-white/[0.03]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Logo variant="dark" className="w-8 h-8 rounded-lg shadow-2xl transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">Coppr</span>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#FFD700] mt-1 opacity-60">Terminal // v2.0 // 2026</span>
            </div>
          </Link>
        </div>

        {/* Navigation Wrapper */}
        <nav className="flex-1 py-8 space-y-10">
          
          {/* MAIN SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-black tracking-[0.4em] mb-5 pl-3 text-white/20">Operational</h3>
            <div className="space-y-1.5">
              {mainLinks.map((item) => {
                const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <motion.div key={item.name} whileTap={{ scale: 0.98 }}>
                    <Link href={item.href} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all duration-300 group ${isActive ? 'text-white bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.02)]' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`} 
                      style={isActive ? { borderLeft: '2px solid #FFD700' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[16px] h-[16px] transition-colors ${isActive ? 'text-[#FFD700]' : 'text-white/10 group-hover:text-white/40'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CREATORS SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-black tracking-[0.4em] mb-5 pl-3 text-white/20">Alpha Source</h3>
            <div className="space-y-1.5">
              {creatorLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.div key={item.name} whileTap={{ scale: 0.98 }}>
                    <Link href={item.href} className={`flex items-center px-3 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all duration-300 group ${isActive ? 'text-[#FFD700] bg-[#FFD700]/5' : 'text-[#FFD700]/40 hover:text-[#FFD700] hover:bg-[#FFD700]/5'}`} 
                      style={isActive ? { borderLeft: '2px solid #FFD700' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[16px] h-[16px] transition-colors ${isActive ? 'text-[#FFD700]' : 'text-[#FFD700]/10 group-hover:text-[#FFD700]/40'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* SUPPORT SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-black tracking-[0.4em] mb-5 pl-3 text-white/20">Configuration</h3>
            <div className="space-y-1.5">
              {finalSupportLinks.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                const isSpecial = item.name === 'Admin Console';
                return (
                  <motion.div key={item.name} whileTap={{ scale: 0.98 }}>
                    <Link href={item.href} className={`flex items-center px-3 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all duration-300 group ${isActive ? 'text-white bg-white/[0.03]' : isSpecial ? 'text-[#00E676]/60 font-black' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`}
                      style={isActive ? { borderLeft: '2px solid #FFD700' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[16px] h-[16px] transition-colors ${isActive ? 'text-[#FFD700]' : isSpecial ? 'text-[#00E676]/30' : 'text-white/10 group-hover:text-white/40'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </nav>

        {/* LEGAL COMPLIANCE */}
        <div className="px-5 mb-8">
            <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#00E676]" />
                    <span className="text-[8px] font-black tracking-[0.2em] uppercase text-[#00E676]">Certified Bridge</span>
                </div>
                <p className="text-[7px] font-bold tracking-widest uppercase text-white/20 leading-relaxed">
                    Institutional Data Agent<br />
                    Handshake: Verified 2026
                </p>
            </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="px-4 py-8 border-t border-white/[0.03]">
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(239,68,68,0.05)', color: '#FF5252' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white/20 transition-all duration-300 group"
          >
            <LogOut className="w-[16px] h-[16px] text-white/10 group-hover:text-[#FF5252]/60" />
            <span>Terminate</span>
          </motion.button>
        </div>
      </aside>

      {/* MOBILE DRAWER (Slides out) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] md:hidden"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-[#020617] border-r border-white/5 z-[101] md:hidden flex flex-col pt-24 pb-10"
            >
              <div className="absolute top-8 right-8">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/20 hover:text-white">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 space-y-12 no-scrollbar">
                <div>
                   <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-6 text-white/20">Navigation</h3>
                   <div className="space-y-4">
                     {mainLinks.map((item) => {
                       const Icon = item.icon;
                       const isActive = pathname === item.href;
                       return (
                         <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 text-[14px] font-black uppercase tracking-widest ${isActive ? 'text-[#FFD700]' : 'text-white/30'}`}>
                           <Icon className="w-5 h-5" />
                           {item.name}
                         </Link>
                       );
                     })}
                   </div>
                </div>
                
                <div>
                  <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-6 text-white/20">Creators</h3>
                  <div className="space-y-4">
                    {creatorLinks.map((item) => (
                      <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-[14px] font-black uppercase tracking-widest text-[#FFD700]/60">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 pt-8 border-t border-white/5">
                <button onClick={handleLogout} className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-[0.2em] text-xs">
                   Terminate Session
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAV (Terminal Style) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-[100] flex justify-around p-3 rounded-2xl border border-white/5 bg-[#050810]/90 backdrop-blur-3xl shadow-2xl">
        {[ mainLinks[0], mainLinks[1], mainLinks[2], supportLinks[2] ].map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="relative p-2">
              <Icon className={`w-6 h-6 ${isActive ? 'text-[#FFD700]' : 'text-white/20'}`} />
              {isActive && <motion.div layoutId="m-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />}
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen pb-24 md:pb-0 relative overflow-x-hidden bg-[#020617]">
        
        {/* COMMAND TOP BAR */}
        <header className="h-[72px] flex items-center justify-between px-6 md:px-10 border-b border-white/[0.03] fixed md:sticky top-0 left-0 w-full z-40 bg-[#020617]/80 backdrop-blur-xl">
          
          <div className="flex items-center gap-6">
            {/* Live Ticker */}
            <motion.div className="hidden lg:flex items-center gap-4 px-5 py-2.5 rounded-full border border-white/[0.03] bg-white/[0.01]">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">XAU/USD // NODE_01</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-[16px] font-black text-white">$2,342.10</span>
                 <span className="text-[10px] font-black text-[#00E676]">+1.24%</span>
               </div>
            </motion.div>
            
            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-white/40"><Menu className="w-6 h-6" /></button>
              <span className="text-lg font-black tracking-tighter text-white uppercase">Coppr</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex items-center px-4 py-1.5 rounded-lg border border-[#00E676]/10 bg-[#00E676]/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E676] mr-2.5" />
              <span className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.2em]">SEC_VERIFIED_2FA</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2.5 rounded-xl border transition-all ${isNotifOpen ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-white/30 hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF5252] shadow-[0_0_10px_#FF5252]" />
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="absolute top-[130%] right-0 w-[300px] p-6 rounded-2xl border border-white/10 bg-[#050810] shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
                    <div className="flex items-start gap-4">
                      <Zap className="w-5 h-5 text-[#FFD700] shrink-0 mt-1" />
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-black text-white uppercase">Broadcast Active</h4>
                        <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase">System health at 100%. All trading nodes synchronized with mainframe.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/dashboard/account" className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center text-[12px] font-black text-black shadow-lg hover:scale-105 transition-transform">
              {initials}
            </Link>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="p-6 md:p-12 flex-1 w-full max-w-[1920px] mx-auto z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
