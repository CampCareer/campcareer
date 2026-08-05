import { createBrowserClient } from '@supabase/ssr'

const BUILD_PLACEHOLDER_URL = 'https://build-placeholder.supabase.co'
const BUILD_PLACEHOLDER_ANON_KEY = 'build-placeholder-anon-key'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Client components are also evaluated during server rendering and static
  // generation. In that environment no browser auth call can run, so a
  // non-network placeholder client keeps rendering deterministic without
  // exposing or requiring production credentials. The browser still fails
  // closed when its public configuration is missing.
  if ((!url || !anonKey) && typeof window !== 'undefined') {
    throw new Error('Supabase public environment variables are required in the browser.')
  }

  return createBrowserClient(
    url ?? BUILD_PLACEHOLDER_URL,
    anonKey ?? BUILD_PLACEHOLDER_ANON_KEY
  )
}
