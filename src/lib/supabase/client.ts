import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * ARCHITECTURE NOTE: Microsoft SSO (Azure AD) Integration
 * To add Microsoft SSO, use `supabase.auth.signInWithOAuth({ provider: 'azure' })`
 * in the login component. All logic here remains the same.
 */
