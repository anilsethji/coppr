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

  // Logic to conditionally add Admin Console
  const finalSupportLinks = [...supportLinks];
  if (isAdmin) {
    finalSupportLinks.push({ name: 'Admin Console', href: '/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col md:flex-row pt-[72px] md:pt-0 overflow-x-hidden">
      
      {/* GLASSSMORPHIC SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-[200px] h-screen sticky top-0 border-r border-white/5 z-50 overflow-y-auto no-scrollbar" style={{ backgroundColor: 'rgba(8,12,20,0.4)', backdropFilter: 'blur(30px)' }}>
        
        {/* Logo Area */}
        <div className="px-5 py-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Logo variant="dark" className="w-8 h-8 rounded-full shadow-[0_4px_20px_rgba(255,215,0,0.2)]" />
            <span className="text-xl font-bold tracking-tight text-white font-sans">Coppr</span>
          </Link>
        </div>

        {/* Navigation Wrapper */}
        <nav className="flex-1 pt-6 space-y-8 pb-6">
          
          {/* MAIN SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-black tracking-[0.2em] mb-4 pl-2 text-white/20">MAIN</h3>
            <div className="space-y-1">
              {mainLinks.map((item) => {
                const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <motion.div key={item.name} whileTap={{ scale: 0.96 }}>
                    <Link href={item.href} className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300 group ${isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`} style={
                      isActive 
                        ? { background: 'linear-gradient(90deg, rgba(255,215,0,0.1), transparent)', borderLeft: '2px solid #FFD700' }
                        : {}
                    }>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#FFD700]' : 'text-white/20 group-hover:text-white/60'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* SUPPORT/ADMIN SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-black tracking-[0.2em] mb-4 pl-2 text-white/20">SUPPORT</h3>
            <div className="space-y-1">
              {finalSupportLinks.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                const isSpecial = item.name === 'Admin Console';
                return (
                  <motion.div key={item.name} whileTap={{ scale: 0.96 }}>
                    <Link href={item.href} className={`flex items-center px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-300 group ${isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`} style={
                      isActive 
                        ? { background: 'linear-gradient(90deg, rgba(255,215,0,0.1), transparent)', borderLeft: '2px solid #FFD700' }
                        : isSpecial ? { color: '#00E676' } : {}
                    }>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#FFD700]' : isSpecial ? 'text-[#00E676]/60' : 'text-white/20 group-hover:text-white/60'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </nav>

        {/* LOGOUT BUTTON (Bottom) */}
        <div className="px-4 py-6 border-t border-white/5 mt-auto">
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#FF4757' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold text-white/30 transition-all duration-300 group"
          >
            <LogOut className="w-[18px] h-[18px] text-white/20 group-hover:text-[#FF4757]" />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* MOBILE DRAWER (Slide-out) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-[#080C14] border-r border-white/10 z-[101] md:hidden flex flex-col pt-20 pb-10"
              style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(255,215,0,0.05) 0%, transparent 50%)' }}
            >
              <div className="absolute top-6 right-6">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/40 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 space-y-10 no-scrollbar">
                {/* Main Links */}
                <div>
                  <h3 className="text-[10px] uppercase font-black tracking-[0.2em] mb-6 text-white/20">Navigation</h3>
                  <div className="space-y-2">
                    {mainLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link 
                          key={item.name} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-4 py-3 text-lg font-bold transition-all ${isActive ? 'text-[#FFD700]' : 'text-white/40'}`}
                        >
                          <Icon className="w-6 h-6" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Support/Account */}
                <div>
                  <h3 className="text-[10px] uppercase font-black tracking-[0.2em] mb-6 text-white/20">System</h3>
                  <div className="space-y-2">
                    {finalSupportLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.name} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 py-3 text-lg font-bold text-white/40"
                        >
                          <Icon className="w-6 h-6" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Logout */}
              <div className="px-6 border-t border-white/5 pt-8">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 py-4 px-6 rounded-2xl bg-red-500/10 text-red-500 font-bold text-lg"
                >
                  <LogOut className="w-6 h-6" />
                  Logout Session
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] z-[100] flex justify-around p-2 rounded-[28px] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden" style={{ backgroundColor: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(25px)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.05] to-transparent pointer-events-none" />
        {[ mainLinks[0], mainLinks[1], mainLinks[2], supportLinks[2] ].map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center p-3 transition-all relative z-10">
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={`transition-colors duration-100 ${isActive ? 'text-[#FFD700]' : 'text-white/30'}`}
              >
                <Icon className="w-[22px] h-[22px]" />
              </motion.div>
              {isActive && (
                <motion.div 
                  layoutId="mobile-glow" 
                  className="absolute inset-0 bg-[#FFD700]/10 blur-xl rounded-full" 
                  initial={false}
                  transition={{ duration: 0.2 }}
                />
              )}
              {isActive && (
                <motion.div 
                  layoutId="mobile-dot" 
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" 
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen pb-24 md:pb-0 relative overflow-x-hidden bg-[#080C14]">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FFD700]/[0.03] to-transparent pointer-events-none" />
        
        {/* HIGH-END TOP BAR */}
        <header className="h-[72px] flex items-center justify-between px-4 md:px-8 border-b fixed md:sticky top-0 left-0 w-full z-40 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.2)]" style={{ backgroundColor: 'rgba(8,12,20,0.8)', backdropFilter: 'blur(30px)', borderColor: 'rgba(255,255,255,0.04)' }}>
          
          {/* LEFT: Live Ticker */}
          <div className="flex items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.06)' }} 
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.1 }}
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] cursor-pointer transition-all"
            >
               <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_12px_rgba(0,230,118,0.8)]"></div>
               <span className="text-[10px] uppercase font-black text-white/20 tracking-[0.2em]">XAU/USD</span>
               <div className="flex items-baseline gap-1.5">
                 <span className="text-[14px] font-bold text-white tracking-tight">2,154.30</span>
                 <span className="text-[10px] font-black text-[#00E676]">+0.82%</span>
               </div>
            </motion.div>
            
            {/* Mobile Hamburger / Logo */}
            <div className="md:hidden flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <Logo variant="dark" className="w-8 h-8 rounded-full shadow-[0_4px_15px_rgba(255,215,0,0.3)]" />
                <span className="text-xl font-black text-white tracking-tighter">Coppr</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: User Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full border border-[#00E676]/30 bg-[#00E676]/5">
              <div className="w-1 h-1 rounded-full bg-[#00E676] mr-2 shadow-[0_0_8px_#00E676]" />
              <span className="text-[9px] font-black text-[#00E676] tracking-[0.15em] uppercase">Security Active</span>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer border ${isNotifOpen ? 'bg-white/10 text-white border-white/10' : 'text-white/30 border-transparent hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                <div className="absolute top-2.5 right-2.5 w-[6px] h-[6px] rounded-full bg-red-500 border-2 border-[#080C14] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              </motion.button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-[130%] right-0 w-[280px] p-5 rounded-[24px] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    style={{ backgroundColor: 'rgba(8,12,20,0.95)', backdropFilter: 'blur(25px)' }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />
                    <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4 border border-[#FFD700]/20">
                      <Zap className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <h4 className="text-[15px] font-bold text-white mb-1.5 text-center">Network Broadcast</h4>
                    <p className="text-[11px] text-white/40 text-center leading-relaxed">
                      You're fully synced with the mainframe. No new updates at this time.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar Link */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }} transition={{ duration: 0.1 }}>
              <Link href="/dashboard/account" className="w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-black text-black border border-[#FFD700]/30 shadow-[0_5px_20px_rgba(255,215,0,0.2)] cursor-pointer hover:shadow-[0_8px_30px_rgba(255,215,0,0.4)] transition-all bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00]">
                {initials}
              </Link>
            </motion.div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 md:p-10 flex-1 w-full max-w-[1440px] mx-auto overflow-visible z-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
