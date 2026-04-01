'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh(); // Ensure the layout securely fetches the user session
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-electric/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md card p-8 sm:p-10 shadow-2xl relative z-10 border border-white/5 bg-[#0A0F1E]/90 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-electric to-[#00B0FF] rounded-t-card"></div>
        
        <div className="text-center mb-10 mt-2">
          <Logo variant="dark" className="w-20 h-20 shadow-[0_0_30px_rgba(0,230,118,0.15)] ring-1 ring-white/10 mb-6 rounded-2xl mx-auto block" />
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Member Portal</h1>
          <p className="text-sm text-gray-400">Sign in to access your EA Bots & Indicators.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 mb-4 text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white transition-all focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none focus:bg-[#0A0F1E]" 
              placeholder="you@domain.com" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white transition-all focus:border-green-electric focus:ring-1 focus:ring-green-electric focus:outline-none focus:bg-[#0A0F1E]" 
              placeholder="••••••••" 
              required 
            />
            <div className="text-right mt-2">
              <button type="button" className="text-[11px] font-bold text-gold-badge hover:text-white transition-colors tracking-wide uppercase">Forgot password?</button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 px-6 bg-[#00E676] hover:bg-[#00c853] text-[#050A14] font-black uppercase tracking-widest text-[13px] rounded-lg transition-all shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm font-medium text-gray-500">
            Don't have an active license? <br className="sm:hidden" />
            <Link href="/checkout" className="text-green-electric hover:text-white transition-colors ml-1 inline-block mt-1 sm:mt-0">Subscribe Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
