import { createBrowserClient } from "@supabase/ssr";

// Cookie-based client so the session lives in sb-* cookies the proxy can read.
// The localStorage client never set cookies, so the /dashboard server gate in
// proxy.ts saw no user and bounced every logged-in user back to /login.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
