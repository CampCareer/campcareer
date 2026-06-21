import "server-only"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { STATE_CODES, type StateCode } from "@/app/map/states"

// 지도 페이지용 데이터 계층. occupations_au + occupation_state_au 를 읽어 JS 에서 조인한다.
// (FK 가 없어 임베디드 조인 불가 — 각 테이블 한 번씩만 select.)
// occupation_state_au 는 anon RLS 가 막혀 있어(0행 반환) 서버 전용 service-role 클라이언트로 읽는다.
// 이 모듈은 server-only — page.tsx(서버 컴포넌트)에서만 import 한다.

export interface StateOccupation {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
  state_shortage_rating: number // 해당 주의 부족도(3=강, 2=중)
}

export interface HighPayOccupation {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
}

export interface MapData {
  shortageByState: Record<string, StateOccupation[]> // "NSW" -> [...] 부족도 desc, 연봉 desc
  highPay: HighPayOccupation[] // 전국 연봉 desc, 상위 12
}

type OccRow = {
  anzsco_code: string | null
  occupation_en: string
  occupation_ko: string | null
  shortage_rating: number | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
  related_broad_field: string | null
}

type StateRow = {
  anzsco_code: string | null
  state: string | null
  shortage_rating: number
}

const FULL_NAME_TO_CODE: Record<string, StateCode> = {
  "new south wales": "NSW",
  victoria: "VIC",
  queensland: "QLD",
  "south australia": "SA",
  "western australia": "WA",
  tasmania: "TAS",
  "northern territory": "NT",
  "australian capital territory": "ACT",
}

// DB 의 state 값을 표준 약어로 정규화. 약어/풀네임/대소문자 모두 수용, 미상이면 null.
function normalizeStateCode(raw: string | null): StateCode | null {
  if (!raw) return null
  const upper = raw.trim().toUpperCase()
  if ((STATE_CODES as string[]).includes(upper)) return upper as StateCode
  return FULL_NAME_TO_CODE[raw.trim().toLowerCase()] ?? null
}

// Supabase 는 요청당 최대 1,000행을 반환한다. 전 행이 필요하면 range 로 페이지네이션.
async function fetchAll<T>(table: string, columns: string): Promise<T[]> {
  const PAGE = 1000
  const all: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(columns)
      .range(from, from + PAGE - 1)
    if (error) {
      console.error(`[map-data] ${table} fetch failed:`, error)
      break
    }
    const rows = (data ?? []) as T[]
    all.push(...rows)
    if (rows.length < PAGE) break
  }
  return all
}

export async function getMapData(): Promise<MapData> {
  const [occupations, stateRows] = await Promise.all([
    fetchAll<OccRow>(
      "occupations_au",
      "anzsco_code, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, related_broad_field",
    ),
    // occupation_state_au 는 2,400+ 행 — Supabase 는 요청당 1,000행으로 제한하므로 페이지네이션 필수.
    fetchAll<StateRow>("occupation_state_au", "anzsco_code, state, shortage_rating"),
  ])

  // code -> occupation
  const byCode = new Map<string, OccRow>()
  for (const o of occupations) {
    if (o.anzsco_code) byCode.set(o.anzsco_code, o)
  }

  // 주별 부족 직종
  const shortageByState: Record<string, StateOccupation[]> = {}
  for (const code of STATE_CODES) shortageByState[code] = []

  for (const r of stateRows) {
    const code = normalizeStateCode(r.state)
    if (!code) continue
    const o = r.anzsco_code ? byCode.get(r.anzsco_code) : undefined
    if (!o || !o.anzsco_code) continue // 상세 페이지는 anzsco_code 로 조회 — 없으면 제외
    shortageByState[code].push({
      anzsco_code: o.anzsco_code,
      occupation_en: o.occupation_en,
      occupation_ko: o.occupation_ko,
      median_salary_aud: o.median_salary_aud,
      on_csol: o.on_csol,
      confidence: o.confidence,
      state_shortage_rating: r.shortage_rating,
    })
  }

  for (const code of STATE_CODES) {
    shortageByState[code].sort(
      (a, b) =>
        b.state_shortage_rating - a.state_shortage_rating ||
        (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0),
    )
  }

  // 전국 고연봉 상위 12 (anzsco_code 없는 행 제외)
  const highPay: HighPayOccupation[] = occupations
    .filter((o) => o.anzsco_code != null)
    .sort((a, b) => (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0))
    .slice(0, 12)
    .map((o) => ({
      anzsco_code: o.anzsco_code as string,
      occupation_en: o.occupation_en,
      occupation_ko: o.occupation_ko,
      median_salary_aud: o.median_salary_aud,
      on_csol: o.on_csol,
      confidence: o.confidence,
    }))

  return { shortageByState, highPay }
}
