import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const metadata = { title: 'Member Login | Coppr' };

export default function LoginPage() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md card p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-electric rounded-t-card"></div>
        <div className="text-center mb-8 mt-2">
          <Logo variant="dark" className="w-24 h-24 shadow-[0_0_20px_rgba(255,215,0,0.3)] ring-2 ring-white/10 mb-6 rounded-full mx-auto" />
          <h1 className="text-3xl font-bold text-white mb-2">Member Login</h1>
          <p className="text-sm text-gray-400">Access your bots, indicators, and tutorials.</p>
        </div>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email or WhatsApp</label>
            <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="you@domain.com or +91..." required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-400">Password</label>
            </div>
            <input type="password" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="••••••••" required />
            <div className="text-right mt-3">
              <button type="button" className="text-xs text-gold-badge hover:text-white transition-colors">Forgot password? (OTP via WhatsApp)</button>
            </div>
          </div>
          
          <Link href="/dashboard" className="btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] mt-4">
            Secure Login
          </Link>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account? <Link href="/register" className="text-white hover:text-green-electric font-medium transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
}
