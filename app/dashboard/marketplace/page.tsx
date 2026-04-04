import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { MarketplaceView } from "@/components/dashboard/MarketplaceView";

export const metadata = { title: 'Strategy Marketplace | Coppr' };

export default async function MarketplacePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Marketplace Hub...</p>
        </div>
    }>
        <MarketplaceView />
    </Suspense>
  );
}
