import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service-role Supabase client — bypasses RLS. Server-side only (쓰기 가능).
// service role key는 RLS를 우회하므로 절대 클라이언트 번들에 포함되면 안 됨.
// Used by the visa-alert send layer: reading back unsubscribe_token, flipping
// confirmed/confirmed_at, soft-unsubscribe, and the broadcast target query +
// notifications_sent writes. `server-only` makes a client-bundle import fail
// the build. No session is persisted (request-scoped, key-authenticated).
//
// 환경변수 검사는 실제 첫 DB 요청까지 지연한다. GitHub CI는 자격 증명 없이도
// route module을 분석할 수 있지만, 실행 시 키가 없으면 즉시 명확한 오류를 낸다.
let adminClient: SupabaseClient | null = null

function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase service-role environment variables are required when an admin database request is executed.'
    )
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return adminClient
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const activeClient = getSupabaseAdminClient()
    const value = Reflect.get(activeClient, property, activeClient)
    return typeof value === 'function' ? value.bind(activeClient) : value
  },
})
