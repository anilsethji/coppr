'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A1A3A]/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-[60] relative">
          <Logo variant="dark" className="w-12 h-12 shadow-[0_0_20px_rgba(255,215,0,0.2)] rounded-full" />
          <span className="text-[1.5rem] font-bold tracking-tight hidden sm:block text-white font-brand mt-1">Coppr</span>
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
            <span className={`block w-7 h-[3px] rounded-full bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
            <span className={`block h-[3px] rounded-full bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0 w-7' : 'w-5'}`}></span>
            <span className={`block w-7 h-[3px] rounded-full bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
          </div>
        </button>

        {/* MOBILE SLIDE-IN MENU */}
        <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-400 ease-out md:hidden z-[55] flex flex-col justify-between`}>
          <div className="pt-28 px-8 flex flex-col gap-8 text-xl font-bold tracking-tight relative z-[60]">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors">About Us</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors">Contact</Link>
            
            <hr className="border-white/5 my-2" />
            
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-[#00E676] flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] group-hover:animate-ping"></span>
                  Member Dashboard
                </Link>
                {(user?.email === 'anilavababun@gmail.com' || user?.email === 'anilava.babun@gmail.com') && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="text-[#F5A623] flex items-center gap-2 mt-2">
                    <span className="text-xl -ml-1">👑</span>
                    Admin Console
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors text-gray-400">Login to Dashboard</Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="text-[#0B0F1A] bg-[#00E676] px-6 py-4 text-center rounded-[10px] uppercase font-black tracking-widest text-sm mt-4">
                  Join Coppr Now
                </Link>
              </>
            )}
          </div>

          {/* MOBILE LOGOUT FOOTER */}
          {user && (
            <div className="p-8 pb-12 border-t border-white/5">
               <button onClick={handleLogout} className="text-gray-500 text-sm font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
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
