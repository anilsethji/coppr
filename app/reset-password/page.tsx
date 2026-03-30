'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage('✅ Security updated! Your new password is now active.');
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to update security credentials.');
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
          <h1 className="text-3xl font-bold text-white mb-2 text-glow">Secure Reset</h1>
          <p className="text-sm text-gray-400">Establish your new access credentials.</p>
        </div>
        
        {message && (
          <div className="bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-sm p-4 rounded-card mb-6 text-center italic font-bold">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-card mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        {!message && (
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">New Password</label>
              <input 
                type="password" 
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none transition-all placeholder:opacity-20" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Confirm Credentials</label>
              <input 
                type="password" 
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none transition-all placeholder:opacity-20" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] py-4 text-xs font-black uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Re-Securing Account...' : 'Confirm New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
