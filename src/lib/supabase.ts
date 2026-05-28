import { createClient } from '@supabase/supabase-js'

// 클라이언트 (읽기 전용 - 브라우저 안전)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 서버 클라이언트 (쓰기 가능 - 서버 사이드 전용)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 타입 정의
export type College = {
  id: string
  unit_id: string
  name: string
  state: string
  city: string
  school_type: 'public' | 'private_nonprofit' | 'private_forprofit'
  enrollment: number
  admission_rate: number
  graduation_rate: number
  avg_net_price: number
  median_earnings: number | null
}

export type City = {
  id: string
  city_slug: string
  name: string
  state: string
  cost_of_living_index: number | null
  rent_median: number | null
  synced_at: string | null
}

export type RoiExplorer = {
  id: string
  roi_score: number
  payback_years: number
  net_salary: number
  college_name: string
  college_state: string
  school_type: string
  tuition: number
  field_name: string
  median_earnings: number
  city_name: string
  cost_of_living_index: number
}
