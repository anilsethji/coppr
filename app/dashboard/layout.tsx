import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col md:flex-row pt-20 mt-[-80px]">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-card border-r border-white/10 h-screen sticky top-0">
        <div className="p-6 border-b border-white/10 mt-16 md:mt-0 pb-4">
          <Link href="/dashboard" className="flex items-center gap-1 focus:outline-none hover:opacity-80 transition-opacity">
            <Logo variant="dark" className="w-10 h-10 shadow-lg rounded-full" />
            <span className="text-[1.35rem] font-bold tracking-normal text-white font-brand -translate-y-1">Member</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {[
            { name: "Home", href: "/dashboard" },
            { name: "EA Bots", href: "/dashboard/bots" },
            { name: "Indicators", href: "/dashboard/indicators" },
            { name: "Video Tutorials", href: "/dashboard/tutorials" },
            { name: "Live Updates", href: "/dashboard/updates" },
            { name: "Setup Guides", href: "/dashboard/guides" },
            { name: "Support", href: "/dashboard/support" },
            { name: "My Account", href: "/dashboard/account" }
          ].map((item) => (
            <Link key={item.name} href={item.href} className="block px-4 py-3 rounded-card text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium">
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-navy-card border-t border-white/10 z-50 flex justify-around p-3 pb-safe">
        {[
          { name: "Home", href: "/dashboard", icon: "🏠" },
          { name: "EA Bots", href: "/dashboard/bots", icon: "🤖" },
          { name: "Videos", href: "/dashboard/tutorials", icon: "🎬" },
          { name: "Account", href: "/dashboard/account", icon: "👤" }
        ].map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center text-gray-400 hover:text-white text-[10px] gap-1 px-3 py-1">
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="font-bold opacity-80">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* TOP BAR */}
        <header className="h-16 bg-navy-card border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40 mt-20 md:mt-0 shadow-md">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="md:hidden flex items-center gap-1">
              <Logo variant="dark" className="w-8 h-8 shadow-sm rounded-full" />
              <span className="text-[1.1rem] font-bold tracking-normal font-brand text-white -translate-y-0.5">Coppr</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block px-3 py-1 bg-green-electric/20 text-green-electric text-xs font-bold rounded-badge border border-green-electric/50">ACTIVE</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-gray-300 ring-2 ring-white/10">JD</div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
