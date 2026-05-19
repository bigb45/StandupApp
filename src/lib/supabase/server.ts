import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Ignored
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Ignored
          }
        },
      },
    }
  )
}

/**
 * ARCHITECTURE NOTE: Microsoft SSO (Azure AD) Integration
 * To add Microsoft SSO, you would configure the provider in the Supabase Dashboard
 * and then use `supabase.auth.signInWithOAuth({ provider: 'azure' })` in your login logic.
 * The session management handled here via JWT and cookies will remain largely the same.
 */
