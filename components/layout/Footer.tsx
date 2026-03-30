import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#0B0F1A] border-t border-white/5 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center gap-1 mb-4">
            <Logo variant="dark" className="w-12 h-12 shadow-lg rounded-full" />
            <h3 className="font-bold text-[1.45rem] font-brand tracking-normal text-white -translate-y-1.5">Coppr</h3>
          </div>
          <p className="text-gray-400 text-sm">Automated trading, proven live.</p>
          <p className="text-gray-400 text-sm mt-2">Connaught Place, New Delhi 110001, India</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Member Login</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Legal Information</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white transition-colors">General Disclaimer</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>anil@coppr.com</li>
            <li>+91 9876543210 (WhatsApp)</li>
            <li>Mon–Sat 10AM–7PM IST</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
        <p>© {currentYear} Coppr. All rights reserved. | New Delhi, India | Not SEBI registered. Not financial advice.</p>
      </div>
    </footer>
  );
}
