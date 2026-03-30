import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Logic that requires DB/Auth will fail.");
    // Return a dummy client or null if you prefer, but createBrowserClient 
    // requires strings. We'll return the call but it will naturally 404/fail 
    // rather than crashing the entire Next.js build/runtime process.
  }

  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
  )
}

