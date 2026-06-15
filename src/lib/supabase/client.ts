import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (_client) return _client;

  // During build/prerender, env vars may not be available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your-supabase-url") {
    // Return a dummy client during build — it'll be recreated client-side
    if (typeof window === "undefined") {
      return createBrowserClient("https://placeholder.supabase.co", "placeholder");
    }
  }

  _client = createBrowserClient(url!, key!);
  return _client;
}
