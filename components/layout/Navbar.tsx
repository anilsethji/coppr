'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    // Listen for auth changes to dynamically update desktop/mobile menus
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Hide Navbar completely on Dashboard, Admin, and Login routes
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A1A3A] border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-[6px] hover:opacity-80 transition-opacity z-[60] relative">
          <Logo variant="dark" className="w-11 h-11" />
          <span className="text-[1.5rem] font-bold tracking-tight hidden sm:block text-white font-brand">Coppr</span>
        </Link>
        
        {/* DESKTOP NAV LINKS (Centered) */}
        <div className="hidden md:flex items-center gap-10 text-[15px] font-bold text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          {user ? (
            <Link href="/dashboard" className="text-[#00E676] hover:text-[#00E676]/80 transition-colors uppercase tracking-widest text-[13px]">Dashboard</Link>
          ) : (
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          )}
        </div>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <button onClick={handleLogout} className="text-[13px] uppercase font-black tracking-widest text-gray-400 hover:text-white transition-colors">Logout</button>
          ) : (
            <Link href="/checkout" className="btn-primary py-3 px-8 text-[14px] uppercase tracking-wider font-black shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)]">
              Subscribe Now
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <button 
          className="md:hidden z-[60] p-2 focus:outline-none relative" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
        >
          <div className="space-y-1.5 flex flex-col items-end">
            <span className={`block w-6 h-[2px] rounded-full bg-white transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
            <span className={`block h-[2px] rounded-full bg-white transition-all duration-500 ${isOpen ? 'opacity-0 w-6' : 'w-4'}`}></span>
            <span className={`block w-6 h-[2px] rounded-full bg-white transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
          </div>
        </button>

        {/* MOBILE SLIDE-IN MENU */}
        <div className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#06080C]/90 backdrop-blur-3xl border-l border-white/5 shadow-[-20px_0_60px_rgba(0,0,0,0.9)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden z-[55] flex flex-col justify-between`}>
          <div className="pt-28 px-10 flex flex-col gap-10 relative z-[60]">
            {[
              { l: 'Home', h: '/' },
              { l: 'About Us', h: '/about' },
              { l: 'Contact', h: '/contact' }
            ].map((link, i) => (
              <Link 
                key={i} 
                href={link.h} 
                onClick={() => setIsOpen(false)} 
                className="text-2xl font-bold tracking-tight text-white/50 hover:text-white transition-all"
              >
                {link.l}
              </Link>
            ))}
            
            <hr className="border-white/5 my-2" />
            
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-[#00E676] text-2xl font-black flex items-center gap-3 group">
                  <div className="w-2 h-2 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
                  DASHBOARD
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-bold text-white/40">Login Hub</Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="text-black bg-[#FFD700] px-8 py-5 text-center rounded-2xl uppercase font-black tracking-[0.2em] text-[11px] mt-2 shadow-2xl">
                  Join Coppr
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE LOGOUT FOOTER */}
          {user && (
            <div className="p-10 pb-12 border-t border-white/5 bg-white/[0.02]">
               <button onClick={handleLogout} className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white/60 transition-colors">
                  Disconnect Session
               </button>
            </div>
          )}
        </div>
        
        {/* BACKDROP BLUR FOR MOBILE MENU */}
        <div 
           className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[50] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
           onClick={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
}
