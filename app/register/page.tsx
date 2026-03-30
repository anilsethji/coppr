'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill email from URL if guest just paid
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const isPrepaid = searchParams.get('status') === 'paid';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, whatsapp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // After successful registration, redirect to dashboard
      router.push('/dashboard');
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-sm text-gray-400">Join Coppr and access live-tested EA bots.</p>
        </div>

        {isPrepaid && (
          <div className="bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-xs p-4 rounded-card mb-6 text-center font-bold italic">
             🎉 Payment Successful! <br/>
             <span className="text-[10px] opacity-80 uppercase tracking-widest mt-1 block">Finish account setup to enter the dashboard.</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-card mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" 
              placeholder="John Doe" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number <span className="text-green-electric">*</span></label>
            <input 
              type="tel" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" 
              placeholder="+91..." 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none placeholder:opacity-20" 
              placeholder="you@domain.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isPrepaid}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
            <input 
              type="password" 
              className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="flex items-start pt-2 mb-4">
            <input type="checkbox" className="mt-1 w-5 h-5 min-w-[20px] rounded border-gray-600 outline-none accent-green-electric" required id="compliance" />
            <label htmlFor="compliance" className="ml-3 text-xs text-gray-400 leading-tight">
              I have read and agree to the <Link href="/terms" className="text-gold-badge hover:underline">Terms</Link>, <Link href="/privacy" className="text-gold-badge hover:underline">Privacy Policy</Link>, and <Link href="/refund" className="text-gold-badge hover:underline">Refund Policy</Link>.
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account & Continue'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account? <Link href="/login" className="text-white hover:text-green-electric font-medium transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#00E676] font-black uppercase tracking-widest animate-pulse italic">Initializing Terminal...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
