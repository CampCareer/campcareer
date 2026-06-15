import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role Supabase client — bypasses RLS. Server-side only (쓰기 가능).
// service role key는 RLS를 우회하므로 절대 클라이언트 번들에 포함되면 안 됨.
// Used by the visa-alert send layer: reading back unsubscribe_token, flipping
// confirmed/confirmed_at, soft-unsubscribe, and the broadcast target query +
// notifications_sent writes. `server-only` makes a client-bundle import fail
// the build. No session is persisted (request-scoped, key-authenticated).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
