'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md card p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-electric rounded-t-card"></div>
        <div className="text-center mb-8 mt-2">
          <Logo variant="dark" className="w-24 h-24 shadow-[0_0_20px_rgba(255,215,0,0.3)] ring-2 ring-white/10 mb-6 rounded-full mx-auto" />
          <h1 className="text-3xl font-bold text-white mb-2">Member Login</h1>
          <p className="text-sm text-gray-400">Access your bots, indicators, and tutorials.</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-card mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" 
              placeholder="you@domain.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-400">Password</label>
            </div>
            <input 
              type="password" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <div className="text-right mt-3">
              <Link href="/forgot-password" className="text-xs text-gold-badge hover:text-white transition-colors">Forgot password?</Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Securing Connection...' : 'Secure Login'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account? <Link href="/register" className="text-white hover:text-green-electric font-medium transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
}
