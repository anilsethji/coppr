'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Logo variant="dark" className="w-10 h-10 shadow-lg rounded-full" />
          <span className="text-[1.35rem] font-bold tracking-normal hidden sm:block text-white font-brand -translate-y-1">Coppr</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-white transition-colors font-semibold text-green-electric">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="hover:text-white transition-colors opacity-70"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          )}
        </div>
        
        <Link href={user ? "/dashboard" : "/checkout"} className="btn-primary py-2 px-6 text-sm hidden sm:flex">
          {user ? 'Go to Dashboard' : 'Subscribe Now'}
        </Link>
      </div>
    </nav>
  );
}
