import 'server-only'
import { createClient } from '@supabase/supabase-js'

// 서버 클라이언트 (쓰기 가능 - 서버 사이드 전용)
// service role key는 RLS를 우회하므로 절대 클라이언트 번들에 포함되면 안 됨.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
