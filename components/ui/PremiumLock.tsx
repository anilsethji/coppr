import Link from "next/link";
import React from "react";

export function PremiumLock({ isSubscribed, children }: { isSubscribed: boolean; children: React.ReactNode }) {
  if (isSubscribed) return <>{children}</>;

  return (
    <div className="relative min-h-[50vh]">
      <div className="blur-xl pointer-events-none select-none opacity-30 transition-all duration-500">
        {children}
      </div>
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
        <div className="bg-[#0A0F1E]/90 backdrop-blur-2xl border border-white/5 p-10 rounded-card max-w-md w-full mx-auto text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
             <span className="text-2xl">🔒</span>
           </div>
           <h3 className="text-2xl font-bold text-white mb-3 tracking-tighter">Premium Access Required</h3>
           <p className="text-sm text-gray-400 mb-8 leading-relaxed">
             You are currently on a free guest account. Activate your membership to unlock the professional algorithmic bot library, custom MT5 indicators, and setup tutorials.
           </p>
           <Link href="/checkout" className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all">
             Unlock Full Platform instantly
           </Link>
        </div>
      </div>
    </div>
  );
}
