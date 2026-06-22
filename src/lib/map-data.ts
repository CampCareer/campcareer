import "server-only"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { STATE_CODES, type StateCode } from "@/app/map/states"
import { readFileSync } from "fs"
import path from "path"

// 지도 페이지용 데이터 계층. occupations_au + occupation_state_au 를 읽어 JS 에서 조인한다.
// occupation_state_au 는 anon RLS 가 막혀 있어 서버 전용 service-role 클라이언트로 읽는다.

export interface StateOccupation {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
  state_shortage_rating: number
  state_count: number
}

export interface HighPayOccupation {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
}

export interface USOccupation {
  occ_code: string
  occ_title: string
  tot_emp: number
  median_wage: number
  pct_change: number
  annual_openings: number
  shortage_score: number
}

export interface USCollege {
  college_id: string
  college_name: string
  city_name: string
  college_state: string
  lat: number
  lng: number
  roi_score: number | null
  net_salary: number | null
  tuition: number | null
  median_earnings: number | null
  graduation_rate: number | null
}

// { "WA": { "1": 1.000, "3": 1.222, ... } }
export type StateSalaryMult = Record<string, Record<string, number>>

export interface MapData {
  shortageByState: Record<string, StateOccupation[]>
  highPay: HighPayOccupation[]
  usColleges: USCollege[]
  stateSalaryMult: StateSalaryMult
  usShortageByState: Record<string, USOccupation[]>
  usHighPayByState: Record<string, USOccupation[]>
  auOccupations: Record<string, OccRow>
  auStateShortages: Record<string, StateShortageByOcc[]>
}

export type OccRow = {
  anzsco_code: string | null
  occupation_en: string
  occupation_ko: string | null
  shortage_rating: number | null
  median_salary_aud: number | null
  on_csol: boolean
  confidence: string | null
  related_broad_field: string | null
  pr_note_ko: string | null
  source_name: string | null
  source_url: string | null
  last_verified: string | null
}

type StateRow = {
  anzsco_code: string | null
  state: string | null
  shortage_rating: number
}

export type StateShortageByOcc = {
  state: string
  rating: number
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

function normalizeStateCode(raw: string | null): StateCode | null {
  if (!raw) return null
  const upper = raw.trim().toUpperCase()
  if ((STATE_CODES as string[]).includes(upper)) return upper as StateCode
  return FULL_NAME_TO_CODE[raw.trim().toLowerCase()] ?? null
}

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

// 간이 US 도시 → 위경도 매칭 (city_ascii + state_abbr 키)
let _cityCoords: Map<string, { lat: number; lng: number }> | null = null

function getCityCoords(): Map<string, { lat: number; lng: number }> {
  if (_cityCoords) return _cityCoords
  const map = new Map<string, { lat: number; lng: number }>()
  try {
    const raw = readFileSync(path.join(process.cwd(), "src/data/us-cities.json"), "utf-8")
    const cities: Array<{ c: string; s: string; lat: number; lng: number }> = JSON.parse(raw)
    for (const city of cities) {
      const key = `${city.c.toLowerCase()}|${city.s}`
      map.set(key, { lat: city.lat, lng: city.lng })
    }
  } catch (e) {
    console.error("[map-data] failed to load us-cities.json:", e)
  }
  _cityCoords = map
  return map
}

async function getUSColleges(): Promise<USCollege[]> {
  const { data, error } = await supabaseAdmin
    .from("roi_explorer_us")
    .select("college_id, college_name, city_name, college_state, roi_score, net_salary, tuition, median_earnings, graduation_rate")
    .gt("roi_score", 0)
    .limit(500)

  if (error) {
    console.error("[map-data] roi_explorer_us fetch failed:", error)
    return []
  }

  const rows = (data ?? []) as Array<{
    college_id: string
    college_name: string
    city_name: string
    college_state: string
    roi_score: number
    net_salary: number
    tuition: number
    median_earnings: number
    graduation_rate: number
  }>

  const coords = getCityCoords()
  const results: USCollege[] = []

  for (const r of rows) {
    const key = `${r.city_name.toLowerCase()}|${r.college_state}`
    const coord = coords.get(key)
    if (!coord) continue
    results.push({
      college_id: r.college_id,
      college_name: r.college_name,
      city_name: r.city_name,
      college_state: r.college_state,
      lat: coord.lat,
      lng: coord.lng,
      roi_score: r.roi_score,
      net_salary: r.net_salary,
      tuition: r.tuition,
      median_earnings: r.median_earnings,
      graduation_rate: r.graduation_rate,
    })
  }

  // ROI 높은 순 정렬
  results.sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
  return results
}

let _usOccData: { shortageByState: Record<string, USOccupation[]>; highPayByState: Record<string, USOccupation[]> } | null = null

function getUSOccupationData() {
  if (_usOccData) return _usOccData
  try {
    const raw = readFileSync(path.join(process.cwd(), "src/data/us-occupation-state.json"), "utf-8")
    const parsed: {
      shortageByState: Record<string, USOccupation[]>
      highPayByState: Record<string, USOccupation[]>
    } = JSON.parse(raw)
    _usOccData = parsed
  } catch (e) {
    console.error("[map-data] failed to load us-occupation-state.json:", e)
    _usOccData = { shortageByState: {}, highPayByState: {} }
  }
  return _usOccData
}

export async function getMapData(): Promise<MapData> {
  const [occupations, stateRows, usColleges, multRows] = await Promise.all([
    fetchAll<OccRow>(
      "occupations_au",
      "anzsco_code, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, related_broad_field, pr_note_ko, source_name, source_url, last_verified",
    ),
    fetchAll<StateRow>("occupation_state_au", "anzsco_code, state, shortage_rating"),
    getUSColleges(),
    supabaseAdmin
      .from("state_salary_multiplier")
      .select("state, anzsco_1digit, multiplier")
      .then((r) => (r.data ?? []) as { state: string; anzsco_1digit: string; multiplier: number }[]),
  ])

  // { "WA": { "3": 1.222, ... } }
  const stateSalaryMult: StateSalaryMult = {}
  for (const row of multRows) {
    if (!stateSalaryMult[row.state]) stateSalaryMult[row.state] = {}
    stateSalaryMult[row.state][row.anzsco_1digit] = Number(row.multiplier)
  }

  const byCode = new Map<string, OccRow>()
  for (const o of occupations) {
    if (o.anzsco_code) byCode.set(o.anzsco_code, o)
  }

  const stateCountMap = new Map<string, number>()
  const stateShortagesByOcc = new Map<string, StateShortageByOcc[]>()
  for (const r of stateRows) {
    if (r.anzsco_code) {
      stateCountMap.set(r.anzsco_code, (stateCountMap.get(r.anzsco_code) ?? 0) + 1)
      const code = normalizeStateCode(r.state)
      if (code) {
        const arr = stateShortagesByOcc.get(r.anzsco_code) ?? []
        arr.push({ state: code, rating: r.shortage_rating })
        stateShortagesByOcc.set(r.anzsco_code, arr)
      }
    }
  }

  const shortageByState: Record<string, StateOccupation[]> = {}
  for (const code of STATE_CODES) shortageByState[code] = []

  for (const r of stateRows) {
    const code = normalizeStateCode(r.state)
    if (!code) continue
    const o = r.anzsco_code ? byCode.get(r.anzsco_code) : undefined
    if (!o || !o.anzsco_code) continue
    shortageByState[code].push({
      anzsco_code: o.anzsco_code,
      occupation_en: o.occupation_en,
      occupation_ko: o.occupation_ko,
      median_salary_aud: o.median_salary_aud,
      on_csol: o.on_csol,
      confidence: o.confidence,
      state_shortage_rating: r.shortage_rating,
      state_count: stateCountMap.get(o.anzsco_code) ?? 8,
    })
  }

  for (const code of STATE_CODES) {
    shortageByState[code].sort(
      (a, b) =>
        a.state_count - b.state_count ||
        b.state_shortage_rating - a.state_shortage_rating ||
        (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0),
    )
  }

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

  const usOccData = getUSOccupationData()

  const auOccupations: Record<string, OccRow> = {}
  byCode.forEach((occ, code) => {
    auOccupations[code] = occ
  })

  const auStateShortages: Record<string, StateShortageByOcc[]> = {}
  stateShortagesByOcc.forEach((arr, code) => {
    auStateShortages[code] = arr
  })

  return { shortageByState, highPay, usColleges, stateSalaryMult, usShortageByState: usOccData.shortageByState, usHighPayByState: usOccData.highPayByState, auOccupations, auStateShortages }
}
