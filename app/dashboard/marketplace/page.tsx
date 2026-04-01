import { createClient } from "@/lib/supabase/server";
import { MarketplaceView } from "@/components/dashboard/MarketplaceView";

export const metadata = { title: 'Strategy Marketplace | Coppr' };

export default async function MarketplacePage() {
  const supabase = createClient();
  const { data: strategies } = await supabase
    .from('content')
    .select('*')
    .or('type.eq.bot,type.eq.indicator')
    .order('created_at', { ascending: false });

  return <MarketplaceView initialStrategies={strategies || []} />;
}
