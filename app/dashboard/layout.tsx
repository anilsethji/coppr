'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  const mainLinks = [
    { name: 'Home', href: '/dashboard', icon: '🏠' },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: '🏪' },
    { name: 'EA Bots', href: '/dashboard/bots', icon: '🤖' },
    { name: 'Indicators', href: '/dashboard/indicators', icon: '📊' },
    { name: 'Video Tutorials', href: '/dashboard/tutorials', icon: '🎬' },
    { name: 'Live Updates', href: '/dashboard/updates', icon: '🛰️', badge: true }
  ];

  const supportLinks = [
    { name: 'Setup Guides', href: '/dashboard/guides', icon: '📋' },
    { name: 'Support', href: '/dashboard/support', icon: '💬' },
    { name: 'My Account', href: '/dashboard/account', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col md:flex-row pt-[72px] md:pt-0">
      
      {/* GLASSSMORPHIC SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-[190px] h-screen sticky top-0 border-r" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        
        {/* Logo Area */}
        <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo variant="dark" className="w-8 h-8 rounded-full shadow-[0_4px_20px_rgba(255,215,0,0.15)]" />
            <span className="text-xl font-bold tracking-tight text-white font-sans">Coppr</span>
          </Link>
        </div>

        {/* Navigation Wrapper */}
        <nav className="flex-1 overflow-y-auto pt-6 space-y-8 no-scrollbar pb-6">
          
          {/* MAIN SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-bold tracking-[0.15em] mb-4 pl-2" style={{ color: 'rgba(255,255,255,0.25)' }}>MAIN</h3>
            <div className="space-y-1">
              {mainLinks.map((item) => {
                const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
                return (
                  <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-between px-2 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 group ${isActive ? 'text-white' : 'hover:text-white hover:bg-white/5'}`} style={
                    isActive 
                      ? { background: 'linear-gradient(90deg, rgba(255,215,0,0.1), transparent)', borderLeft: '2px solid #FFD700', color: '#fff' }
                      : { color: 'rgba(255,255,255,0.4)' }
                  }>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[16px]">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SUPPORT SECTION */}
          <div className="px-4">
            <h3 className="text-[9px] uppercase font-bold tracking-[0.15em] mb-4 pl-2" style={{ color: 'rgba(255,255,255,0.25)' }}>SUPPORT</h3>
            <div className="space-y-1">
              {supportLinks.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.name} href={item.href} className={`flex items-center px-2 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 group ${isActive ? 'text-white' : 'hover:text-white hover:bg-white/5'}`} style={
                    isActive 
                      ? { background: 'linear-gradient(90deg, rgba(255,215,0,0.1), transparent)', borderLeft: '2px solid #FFD700', color: '#fff' }
                      : { color: 'rgba(255,255,255,0.4)' }
                  }>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[16px]">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around p-2 pb-safe border-t shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" style={{ backgroundColor: 'rgba(8,12,20,0.95)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
        {[ mainLinks[0], mainLinks[1], mainLinks[3], supportLinks[2] ].map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center w-full h-[44px] transition-all" style={{ color: isActive ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
              <span className="text-[20px] mb-1">{item.icon}</span>
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 relative overflow-x-hidden">
        
        {/* HIGH-END TOP BAR */}
        <header className="h-[72px] flex items-center justify-between px-4 md:px-8 border-b fixed md:sticky top-0 left-0 w-full md:w-auto z-40 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]" style={{ backgroundColor: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.07)' }}>
          
          {/* LEFT: Live XAU/USD ticker pill */}
          <div className="flex items-center">
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-[20px] border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
               <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.8)]"></div>
               <span className="text-[11px] uppercase font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>XAU/USD</span>
               <span className="text-[13px] font-bold text-white tracking-wide">2,154.30</span>
               <span className="text-[11px] font-bold text-[#00E676] ml-1">+0.82%</span>
            </div>
            
            {/* Mobile Logo Fallback */}
            <Link href="/dashboard" className="md:hidden flex items-center gap-2">
              <Logo variant="dark" className="w-7 h-7 rounded-full shadow-[0_4px_15px_rgba(255,215,0,0.2)]" />
              <span className="text-lg font-bold text-white">Coppr</span>
            </Link>
          </div>

          {/* RIGHT: Status Cluster */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-[20px] border" style={{ background: 'linear-gradient(90deg, rgba(0,230,118,0.1), rgba(0,230,118,0.02))', borderColor: 'rgba(0,230,118,0.3)', boxShadow: '0 0 15px rgba(0,230,118,0.05)' }}>
              <span className="text-[10px] font-bold text-[#00E676] tracking-widest uppercase">Active</span>
            </div>
            
            {/* Notification Bell */}
            <button className="relative p-1.5 text-white/50 hover:text-white transition-colors cursor-pointer">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <div className="absolute top-1 right-1 w-[6px] h-[6px] rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#080C14]"></div>
            </button>

            {/* Avatar Gradient */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-black border border-white/10 shadow-[0_4px_15px_rgba(255,215,0,0.2)] cursor-pointer hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)] transition-all" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
              JD
            </div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="p-4 md:p-8 flex-1 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
