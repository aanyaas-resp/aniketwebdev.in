import { createClient } from "@supabase/supabase-js";

// Public (anon) client for reading published content and inserting contact
// submissions. Row-level security in Supabase decides what it can access.
export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        // Cache public reads for 5 minutes so pages stay fast and crawlable.
        fetch: (url, options = {}) =>
          fetch(url, { ...options, next: { revalidate: 300 } } as RequestInit),
      },
    },
  );
}
