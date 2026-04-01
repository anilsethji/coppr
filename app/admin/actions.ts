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
