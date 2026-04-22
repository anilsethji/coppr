'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function addAsset(payload: any) {
  const { error } = await supabaseAdmin.from('content').insert(payload);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateAsset(id: string, payload: any) {
  const { error } = await supabaseAdmin.from('content').update(payload).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAsset(id: string) {
  const { error } = await supabaseAdmin.from('content').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function addUpdate(content: string) {
  const { error } = await supabaseAdmin.from('updates').insert({ content });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteUpdate(id: string) {
  const { error } = await supabaseAdmin.from('updates').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateStrategy(id: string, payload: any) {
  const { error } = await supabaseAdmin.from('strategies').update(payload).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteStrategy(id: string) {
  try {
    console.log(`[ATOMIC_CORE_PURGE] Initializing decommissioning for node: ${id}`);
    
    // 0. Dissolve High-Level Discovery Metrics (Featured Assets)
    console.log(`[ATOMIC_CORE_PURGE] Stage 0: Purging marketplace content links`);
    await supabaseAdmin.from('content').delete().eq('linked_strategy_id', id);

    // 1. Purge Signal Handshakes & Logs
    console.log(`[ATOMIC_CORE_PURGE] Stage 1: Severing signal chains`);
    await supabaseAdmin.from('signal_logs').delete().eq('strategy_id', id);
    await supabaseAdmin.from('strategy_reviews').delete().eq('strategy_id', id);
    
    // 2. Identify and purge cross-linked subscription logs
    console.log(`[ATOMIC_CORE_PURGE] Stage 2: Purging subscription metadata`);
    const { data: subs } = await supabaseAdmin
      .from('user_strategies')
      .select('id')
      .eq('strategy_id', id);
    
    if (subs && subs.length > 0) {
      const subIds = subs.map(s => s.id);
      await supabaseAdmin.from('subscription_logs').delete().in('subscription_id', subIds);
      await supabaseAdmin.from('user_strategies').delete().eq('strategy_id', id);
    }

    // 3. Purge financial artifacts (Revenue & Ledgers)
    console.log(`[ATOMIC_CORE_PURGE] Stage 3: Wiping financial ledgers`);
    await supabaseAdmin.from('creator_revenue').delete().eq('strategy_id', id);
    await supabaseAdmin.from('transactions').delete().eq('strategy_id', id);
    
    // 4. Final atomic purge of the core strategy record
    console.log(`[ATOMIC_CORE_PURGE] Stage 4: Decommissioning core node`);
    const { error } = await supabaseAdmin.from('strategies').delete().eq('id', id);
    
    if (error) {
      console.error('[ATOMIC_CORE_PURGE] FINAL_FAILURE:', error.message);
      return { success: false, error: `Critical Block: ${error.message}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[ATOMIC_CORE_PURGE] HANDSHAKE_TIMEOUT:', err.message);
    return { success: false, error: err.message || 'Handshake disruption at core level.' };
  }
}

export async function deployStrategy(payload: any) {
  const { data, error } = await supabaseAdmin
    .from('strategies')
    .insert(payload)
    .select('id')
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, id: data.id };
}
