'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useSubscriptions() {
  const [subscriptionIds, setSubscriptionIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_strategies')
        .select('strategy_id')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE');

      if (!error && data) {
        const ids = new Set<string>(data.map((s: any) => s.strategy_id as string));
        setSubscriptionIds(ids);
      }
      setLoading(false);
    }

    fetchSubs();
  }, []);

  const isSubscribed = (strategyId: string) => subscriptionIds.has(strategyId);

  return { isSubscribed, loading, subscriptionIds };
}
