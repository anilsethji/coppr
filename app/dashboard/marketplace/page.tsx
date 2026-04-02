import { createClient } from "@/lib/supabase/server";
import { MarketplaceView } from "@/components/dashboard/MarketplaceView";

export const metadata = { title: 'Strategy Marketplace | Coppr' };

export default async function MarketplacePage() {
  return <MarketplaceView />;
}
