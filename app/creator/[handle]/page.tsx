import { Metadata } from 'next';
import CreatorProfileContent from '@/components/marketplace/CreatorProfileContent';
import Link from 'next/link';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface CreatorPageProps {
  params: { handle: string };
}

// SEO & OG Tags
export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const handle = params.handle;
  // In a real app, we'd fetch the creator name here for the title
  return {
    title: `${handle} | Coppr Strategy Creator`,
    description: `Check out the high-performance trading strategies by @${handle} on Coppr Marketplace. Real trades, live stats, and auto-execution.`,
    openGraph: {
      title: `${handle}'s Trading Portfolio | Coppr`,
      description: `Mirror @${handle}'s automated trades on MT5 and Pine Script.`,
      images: ['/og-creator.png'], // Placeholder
    }
  };
}

async function getCreatorData(handle: string) {
  // Use absolute URL for server-side fetch in Next.js if needed, or query DB directly
  // For this environment, we'll assume the API is available or we'd move DB logic here.
  // Using a mock fetch-like pattern or direct DB query is better for RSC.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/creators/${handle}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicCreatorPage({ params }: CreatorPageProps) {
  const data = await getCreatorData(params.handle);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center p-6 text-center">
         <Logo variant="dark" className="w-12 h-12 mb-8 opacity-20" />
         <h1 className="text-2xl font-bold text-white/40 mb-2">Creator Profile Not Found</h1>
         <p className="text-sm text-white/20 mb-8 max-w-xs">The profile you're looking for might have been moved or the handle is incorrect.</p>
         <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] border-b border-[#FFD700]/30 pb-1">
            Browse Strategy Marketplace
         </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-white selection:bg-[#FFD700] selection:text-black">
      {/* Public Nav */}
      <nav className="h-[72px] flex items-center justify-between px-6 border-b border-white/5 sticky top-0 bg-[#080C14]/80 backdrop-blur-xl z-50">
         <Link href="/" className="flex items-center gap-3">
            <Logo variant="dark" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-extrabold tracking-tighter">Coppr</span>
         </Link>
         <Link href="/dashboard/marketplace" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Marketplace</span>
         </Link>
      </nav>

      <main className="max-w-[600px] mx-auto pt-8 pb-32">
        <div className="px-6 mb-8">
            <Link href="/dashboard/marketplace" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Back to Discovery
            </Link>
        </div>

        <div className="rounded-[40px] border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl shadow-black/50">
            <CreatorProfileContent initialData={data} isModal={false} onFollowToggle={() => {}} />
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-16 px-8 text-center">
            <p className="text-[9px] text-white/10 font-bold uppercase tracking-[0.1em] leading-relaxed">
                Trading carries significant risk. All performance metrics shown are derived from live executions but do not guarantee future profits. Coppr is a neutral infrastructure provider connecting traders to strategies.
            </p>
        </div>
      </main>
    </div>
  );
}
