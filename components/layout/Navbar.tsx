import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A1A3A]/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Logo variant="dark" className="w-10 h-10 shadow-lg rounded-full" />
          <span className="text-[1.35rem] font-bold tracking-normal hidden sm:block text-white font-brand -translate-y-1">Coppr</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
        </div>
        <Link href="/checkout" className="btn-primary py-2 px-6 text-sm hidden sm:flex">
          Subscribe Now
        </Link>
      </div>
    </nav>
  );
}
