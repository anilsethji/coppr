'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { label: "Home Overview", href: "/dashboard", icon: "🏠" },
  { label: "EA Bots", href: "/dashboard/bots", icon: "🤖" },
  { label: "Indicators", href: "/dashboard/indicators", icon: "📊" },
  { label: "Video Tutorials", href: "/dashboard/tutorials", icon: "🎬" },
  { label: "Live Updates", href: "/dashboard/updates", icon: "📡" },
  { label: "Setup Guides", href: "/dashboard/guides", icon: "📖" },
  { label: "Support", href: "/dashboard/support", icon: "🎧" },
  { label: "My Account", href: "/dashboard/account", icon: "👤" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#131929] border-r border-white/5 fixed h-full z-50 hidden md:block">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-10 group">
             <Logo variant="dark" className="w-8 h-8 group-hover:scale-110 transition-transform" />
             <span className="text-xl font-bold text-white font-brand">Coppr</span>
          </Link>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-bold transition-all ${
                    isActive 
                    ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="p-4 bg-white/[0.02] rounded-[12px] border border-white/5 text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Live Status</p>
            <div className="flex items-center justify-center gap-2">
               <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse"></span>
               <span className="text-[11px] font-bold text-white">System Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#131929] border-b border-white/5 z-50 flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="dark" className="w-8 h-8" />
            <span className="text-xl font-bold text-white font-brand">Coppr</span>
        </Link>
        <button className="text-white text-2xl">☰</button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0">
        {children}
      </main>
    </div>
  );
}
