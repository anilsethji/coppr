'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/admin';

export function useSubscriptions() {
  const [subscriptionIds, setSubscriptionIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email || null);

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

  const isSubscribed = (strategyId: string) => isAdmin(userEmail) || subscriptionIds.has(strategyId);

  return { isSubscribed, loading, subscriptionIds, userEmail };
}
