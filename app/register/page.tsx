import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const metadata = { title: 'Register | Coppr' };

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md card p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-electric rounded-t-card"></div>
        <div className="text-center mb-8 mt-2">
          <Logo variant="dark" className="w-24 h-24 shadow-[0_0_20px_rgba(255,215,0,0.3)] ring-2 ring-white/10 mb-6 rounded-full mx-auto" />
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-sm text-gray-400">Join Coppr and access live-tested EA bots.</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input type="text" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number <span className="text-green-electric">*</span></label>
            <input type="tel" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="+91..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input type="email" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="you@domain.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input type="password" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="••••••••" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
            <input type="password" className="w-full bg-[#0A0F1E] border border-white/10 rounded-card px-4 py-3 min-h-[48px] text-white focus:border-green-electric focus:outline-none" placeholder="••••••••" required />
          </div>
          
          <div className="flex items-start pt-2 mb-4">
            <input type="checkbox" className="mt-1 w-5 h-5 min-w-[20px] rounded border-gray-600 outline-none accent-green-electric" required id="compliance" />
            <label htmlFor="compliance" className="ml-3 text-xs text-gray-400 leading-tight">
              I have read and agree to the <Link href="/terms" className="text-gold-badge hover:underline">Terms</Link>, <Link href="/privacy" className="text-gold-badge hover:underline">Privacy Policy</Link>, and <Link href="/refund" className="text-gold-badge hover:underline">Refund Policy</Link>.
            </label>
          </div>
          
          <Link href="/checkout" className="btn-primary w-full shadow-[0_4px_14px_0_rgba(0,230,118,0.2)]">
            Create Account & Continue
          </Link>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account? <Link href="/login" className="text-white hover:text-green-electric font-medium transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
}
