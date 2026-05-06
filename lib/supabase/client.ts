import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (client) return client;

  if (!supabaseUrl || !supabaseAnonKey) {
    client = createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
    return client;
  }

  client = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
  
  return client;
}
