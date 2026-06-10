import { createClient } from '@supabase/supabase-js'

// 클라이언트 (읽기 전용 - 브라우저 안전)
// 쓰기용 service role 클라이언트는 '@/lib/supabase-admin' (server-only) 참조.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 타입 정의
// US 스키마(unit_id) 기준 — 타국 colleges_* 테이블은 institution_id를 사용함.
export type CollegeUS = {
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
