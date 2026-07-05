import "server-only"
import { unstable_cache } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { STATE_CODES, CA_PROVINCE_CODES, UK_REGION_CODES, type StateCode } from "@/app/map/states"
import { MAJOR_OCCUPATIONS } from "@/lib/major-occupation-map"
import usCitiesRaw from "@/data/us-cities.json"
import usStateInfoRaw from "@/data/us-state-info.json"
import usUniversityRankingsRaw from "@/data/us-university-rankings.json"
import auUniversityRankingsRaw from "@/data/au-university-rankings.json"
import usOccupationStateRaw from "@/data/us-occupation-state.json"
import caOccupationStateRaw from "@/data/ca-occupation-state.json"
import caCitiesRaw from "@/data/ca-cities.json"
import ukCitiesRaw from "@/data/uk-cities.json"
import ukOccupationsRaw from "@/data/uk-occupations.json"
import ukRegionOccupationsRaw from "@/data/uk-region-occupations.json"

// 지도 페이지용 데이터 계층. occupations_au + occupation_state_au 를 읽어 JS 에서 조인한다.
// occupation_state_au 는 anon RLS 가 막혀 있어 서버 전용 service-role 클라이언트로 읽는다.

export interface StateOccupation {
  anzsco_code: string
  anzsco_v13: string | null
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

export interface USStateInfo {
  medianRent: number | null
  medianIncome: number | null
  rentIncomeRatio: number | null
  rentByBedrooms: {
    studio: number | null
    "1br": number | null
    "2br": number | null
    "3br": number | null
    "4br": number | null
  } | null
}

// Per-state computed major density data
export interface StateMajorDensity {
  slug: string
  label: string
  // Number of mapped occupations that have data in this state
  occupationCount: number
  // Total employment across matched occupations
  totalEmp: number
  // Average wage across matched occupations
  avgWage: number
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

export interface USRankedCollege extends USCollege {
  qsRank: number
  website: string
  slug: string
}

export interface AURankedCollege {
  college_name: string
  city_name: string
  college_state: string
  lat: number
  lng: number
  qsRank: number
  website: string
  slug: string
}

export interface CACollege {
  institution_id: string
  college_name: string
  city_name: string
  province: string
  lat: number
  lng: number
  median_earnings: number | null
  graduation_rate: number | null
  avg_net_price: number | null
  qs_rank: number | null
  website: string | null
  slug: string
}

export interface CAOccRow {
  noc_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_cad: number | null
  low_wage_cad: number | null
  high_wage_cad: number | null
  average_wage_cad: number | null
  q1_wage_cad: number | null
  q3_wage_cad: number | null
  shortage_rating: number | null
  on_teer_eligible: boolean | null
  related_broad_field: string | null
  confidence: string | null
  data_source: string | null
  last_verified: string | null
}

export interface CAHighPayOccupation {
  noc_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_cad: number | null
  shortage_rating: number | null
}

export interface CAProvinceOccupation {
  noc_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_cad: number | null
  low_wage_cad: number | null
  high_wage_cad: number | null
  shortage_rating: number | null
  province_shortage_rating: number | null
}

export interface CAStateRow {
  noc_code: string
  province: string
  median_wage_cad: number | null
  low_wage_cad: number | null
  high_wage_cad: number | null
  shortage_rating: number | null
  data_source: string | null
}

// ── UK occupation interfaces ───────────────────────────────────────────────────

export interface UKOccRow {
  soc_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_gbp: number | null
  on_sol: boolean
  on_isl: boolean
  confidence: string | null
  related_broad_field: string | null
  source_name: string | null
  source_url: string | null
  last_verified: string | null
}

export interface UKRegionOccupation {
  soc_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_gbp: number | null
  shortage_rating: number | null
}

export interface UKStateRow {
  soc_code: string
  region: string
  median_salary_gbp: number | null
  shortage_rating: number | null
  data_source: string | null
}

export interface UKCollege {
  institution_id: string
  college_name: string
  city_name: string
  region: string
  lat: number
  lng: number
  median_earnings: number | null
  tuition: number | null
  qs_rank: number | null
  website: string | null
  slug: string
}

// { "WA": { "1": 1.000, "3": 1.222, ... } }
export type StateSalaryMult = Record<string, Record<string, number>>

// 직업 상세 카드의 "공부하는 곳"·"비자"는 예전엔 카드를 열 때 클라이언트가 별도
// API(/api/occupations/related)로 가져와 몇 초 지연이 있었다. 이제 이 두 가지를
// 맵 초기 데이터에 미리 실어 보내 fetch 없이 즉시 렌더한다.
//  - coursesByFieldState: 분야(broad_field) × 주(state) 별 학위 코스 (주당 6개 cap)

export interface CourseLite {
  id: number
  title: string
  institution_id: string | null
  institution_name: string | null
  state: string | null
  website_url: string | null
  cricos_url: string | null
  aqf_level: number | null
  duration_years: number | null
  tuition_fee_aud: number | null
}

export interface MapData {
  shortageByState: Record<string, StateOccupation[]>
  highPay: HighPayOccupation[]
  usColleges: USCollege[]
  stateSalaryMult: StateSalaryMult
  usShortageByState: Record<string, USOccupation[]>
  usHighPayByState: Record<string, USOccupation[]>
  auOccupations: Record<string, OccRow>
  auStateShortages: Record<string, StateShortageByOcc[]>
  coursesByFieldState: Record<string, Record<string, CourseLite[]>>
  usStateInfo: Record<string, USStateInfo>
  usMajorDensity: Record<string, StateMajorDensity[]>
  usRankedColleges: USRankedCollege[]
  auRankedColleges: AURankedCollege[]
  caColleges: CACollege[]
  caOccupations: Record<string, CAOccRow>
  caHighPay: CAHighPayOccupation[]
  caHighPayByProvince: Record<string, CAHighPayOccupation[]>
  caProvinceOccupations: Record<string, CAProvinceOccupation[]>
  caProvinceShortages: Record<string, StateShortageByOcc[]>
  caCities: CACity[]
  ukOccupations: Record<string, UKOccRow>
  ukShortageByRegion: Record<string, UKRegionOccupation[]>
  ukHighPayByRegion: Record<string, UKRegionOccupation[]>
  ukColleges: UKCollege[]
}

export interface CACity {
  name: string
  province: string
  rent_median: number | null
  cost_of_living_index: number | null
}

export type OccRow = {
  anzsco_code: string | null
  anzsco_v13: string | null
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
  const cities = usCitiesRaw as unknown as Array<{ c: string; s: string; lat: number; lng: number }>
  for (const city of cities) {
    const key = `${city.c.toLowerCase()}|${city.s}`
    map.set(key, { lat: city.lat, lng: city.lng })
  }
  _cityCoords = map
  return map
}

// Canadian city → coordinate lookup
let _caCityCoords: Map<string, { lat: number; lng: number }> | null = null

function getCACityCoords(): Map<string, { lat: number; lng: number }> {
  if (_caCityCoords) return _caCityCoords
  const map = new Map<string, { lat: number; lng: number }>()
  const cities = caCitiesRaw as unknown as Array<{ c: string; s: string; lat: number; lng: number }>
  for (const city of cities) {
    const key = `${city.c.toLowerCase()}|${city.s}`
    map.set(key, { lat: city.lat, lng: city.lng })
  }
  _caCityCoords = map
  return map
}

async function getUSColleges(): Promise<USCollege[]> {
  // roi_explorer_us 는 (대학 × 전공) 행이라 college_id 가 중복된다. 도시 컬럼명은 college_city.
  const { data, error } = await supabaseAdmin
    .from("roi_explorer_us")
    .select("college_id, college_name, college_city, college_state, roi_score, net_salary, tuition, median_earnings, graduation_rate")
    .gt("roi_score", 0)
    .order("roi_score", { ascending: false })
    .limit(3000)

  if (error) {
    console.error("[map-data] roi_explorer_us fetch failed:", error)
    return []
  }

  const rows = (data ?? []) as Array<{
    college_id: string
    college_name: string
    college_city: string
    college_state: string
    roi_score: number
    net_salary: number
    tuition: number
    median_earnings: number
    graduation_rate: number
  }>

  const coords = getCityCoords()
  // 대학 단위로 접되, ROI 최고값(첫 등장) 행만 남긴다.
  const byCollege = new Map<string, USCollege>()

  for (const r of rows) {
    if (!r.college_city || byCollege.has(r.college_id)) continue
    const key = `${r.college_city.toLowerCase()}|${r.college_state}`
    const coord = coords.get(key)
    if (!coord) continue
    byCollege.set(r.college_id, {
      college_id: r.college_id,
      college_name: r.college_name,
      city_name: r.college_city,
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

  // ROI 높은 순 정렬 (이미 쿼리에서 정렬됐지만 dedup 후 보장)
  return Array.from(byCollege.values()).sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
}

let _usStateInfo: Record<string, USStateInfo> | null = null

function getUSStateInfo(): Record<string, USStateInfo> {
  if (_usStateInfo) return _usStateInfo
  _usStateInfo = usStateInfoRaw as unknown as Record<string, USStateInfo>
  return _usStateInfo
}

function computeMajorDensity(): Record<string, StateMajorDensity[]> {
  const occData = getUSOccupationData()
  const result: Record<string, StateMajorDensity[]> = {}

  // Collect all unique state codes from us-occupation-state.json
  const states = new Set<string>()
  for (const state of Object.keys(occData.shortageByState)) states.add(state)
  for (const state of Object.keys(occData.highPayByState)) states.add(state)

  for (const state of Array.from(states)) {
    const shortageOccs = occData.shortageByState[state] ?? []
    const highPayOccs = occData.highPayByState[state] ?? []
    const allOccs = [...shortageOccs, ...highPayOccs]
    const byCode = new Map<string, USOccupation>()
    for (const occ of allOccs) byCode.set(occ.occ_code, occ)

    const densities: StateMajorDensity[] = []

    for (const major of MAJOR_OCCUPATIONS) {
      let totalEmp = 0
      let totalWage = 0
      let matchCount = 0

      for (const socCode of major.socCodes) {
        const match = byCode.get(socCode)
        if (match) {
          totalEmp += match.tot_emp
          totalWage += match.median_wage * match.tot_emp
          matchCount++
        }
      }

      if (matchCount > 0) {
        densities.push({
          slug: major.slug,
          label: major.label,
          occupationCount: matchCount,
          totalEmp,
          avgWage: totalEmp > 0 ? Math.round(totalWage / totalEmp) : 0,
        })
      }
    }

    densities.sort((a, b) => b.totalEmp - a.totalEmp)
    result[state] = densities
  }

  return result
}

let _rankedColleges: USRankedCollege[] | null = null

function getUSRankedColleges(colleges: USCollege[]): USRankedCollege[] {
  if (_rankedColleges) return _rankedColleges
  const rankings = usUniversityRankingsRaw as unknown as Array<{ qsRank: number; name: string; alias?: string; city: string; state: string; website: string }>

  const ranked: USRankedCollege[] = []

  for (const r of rankings) {
    // Try to match by name or alias, within the same state
    const match = colleges.find((c) => {
      const cn = c.college_name.toLowerCase()
      const rn = r.name.toLowerCase()
      const alias = r.alias?.toLowerCase()
      return (
        cn.includes(rn) ||
        rn.includes(cn) ||
        (alias && (cn.includes(alias) || alias.includes(cn)))
      ) && c.college_state === r.state
    })

    if (match) {
      const slug = match.college_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      ranked.push({
        ...match,
        qsRank: r.qsRank,
        website: r.website,
        slug,
      })
    }
  }

  // Also add ranked colleges with no matching data (show without financial data)
  for (const r of rankings) {
    const exists = ranked.some((c) => c.qsRank === r.qsRank && c.college_state === r.state)
    if (exists) continue
    // Use ranking data as fallback
    const slug = r.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    ranked.push({
      college_id: `qs-${r.qsRank}-${r.state}`,
      college_name: r.name,
      city_name: r.city,
      college_state: r.state,
      // Estimate lat/lng from state centroid or city lookup? Skip for now.
      lat: 0,
      lng: 0,
      roi_score: null,
      net_salary: null,
      tuition: null,
      median_earnings: null,
      graduation_rate: null,
      qsRank: r.qsRank,
      website: r.website,
      slug,
    })
  }

  ranked.sort((a, b) => a.qsRank - b.qsRank)
  _rankedColleges = ranked
  return _rankedColleges
}

let _auRankedColleges: AURankedCollege[] | null = null

function getAURankedColleges(): AURankedCollege[] {
  if (_auRankedColleges) return _auRankedColleges
  const rankings = auUniversityRankingsRaw as unknown as Array<{ qsRank: number; name: string; alias?: string; city: string; state: string; lat: number; lng: number; website: string }>

  _auRankedColleges = rankings.map((r) => {
    const slug = r.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    return {
      college_name: r.name,
      city_name: r.city,
      college_state: r.state,
      lat: r.lat,
      lng: r.lng,
      qsRank: r.qsRank,
      website: r.website,
      slug,
    }
  })
  return _auRankedColleges
}

let _usOccData: { shortageByState: Record<string, USOccupation[]>; highPayByState: Record<string, USOccupation[]> } | null = null

function getUSOccupationData() {
  if (_usOccData) return _usOccData
  _usOccData = usOccupationStateRaw as unknown as { shortageByState: Record<string, USOccupation[]>; highPayByState: Record<string, USOccupation[]> }
  return _usOccData
}

// 분야(broad_field) × 주(state) → 학위 코스 6개. 학교 state 는 colleges_au 에서 조인.
// courses_au 는 거의 안 바뀌므로 서버 인스턴스 메모리에 캐시한다 (us-cities 캐시와 동일 패턴).
let _coursesByFieldState: Record<string, Record<string, CourseLite[]>> | null = null

async function getCoursesByFieldState(): Promise<Record<string, Record<string, CourseLite[]>>> {
  if (_coursesByFieldState) return _coursesByFieldState

  const colleges = await fetchAll<{
    institution_id: string
    name: string
    state: string | null
    website_url: string | null
  }>("colleges_au", "institution_id, name, state, website_url")
  const collegeMap = new Map(colleges.map((c) => [c.institution_id, c]))

  const courses = await fetchAll<{
    id: number
    title: string
    institution_id: string | null
    broad_field: string | null
    aqf_level: number | null
    duration_years: number | null
    tuition_fee_aud: number | null
    cricos_url: string | null
  }>(
    "courses_au",
    "id, title, institution_id, broad_field, aqf_level, duration_years, tuition_fee_aud, cricos_url",
  )

  const result: Record<string, Record<string, CourseLite[]>> = {}
  for (const c of courses) {
    if (!c.broad_field || !c.institution_id) continue
    const col = collegeMap.get(c.institution_id)
    const state = col?.state ?? null
    if (!state) continue
    const byState = (result[c.broad_field] ??= {})
    const arr = (byState[state] ??= [])
    if (arr.length >= 6) continue // 주당 6개 cap (id 순)
    arr.push({
      id: c.id,
      title: c.title,
      institution_id: c.institution_id,
      institution_name: col?.name ?? null,
      state,
      website_url: col?.website_url ?? null,
      cricos_url: c.cricos_url,
      aqf_level: c.aqf_level,
      duration_years: c.duration_years,
      tuition_fee_aud: c.tuition_fee_aud,
    })
  }

  _coursesByFieldState = result
  return result
}

async function getCACities(): Promise<CACity[]> {
  const { data, error } = await supabaseAdmin
    .from("cities_ca")
    .select("name, province, rent_median, cost_of_living_index")
    .order("rent_median", { ascending: false })

  if (error) {
    console.error("[map-data] cities_ca fetch failed:", error)
    return []
  }

  return (data ?? []).map((r: {
    name: string
    province: string
    rent_median: number | null
    cost_of_living_index: number | null
  }) => ({
    name: r.name,
    province: r.province,
    rent_median: r.rent_median,
    cost_of_living_index: r.cost_of_living_index,
  }))
}

// UK city → coordinate lookup
let _ukCityCoords: Map<string, { lat: number; lng: number }> | null = null

function getUKCityCoords(): Map<string, { lat: number; lng: number }> {
  if (_ukCityCoords) return _ukCityCoords
  const map = new Map<string, { lat: number; lng: number }>()
  const cities = ukCitiesRaw as unknown as Array<{ c: string; s: string; lat: number; lng: number }>
  for (const city of cities) {
    const key = `${city.c.toLowerCase()}|${city.s}`
    map.set(key, { lat: city.lat, lng: city.lng })
  }
  _ukCityCoords = map
  return map
}

async function getUKColleges(): Promise<UKCollege[]> {
  const { data, error } = await supabaseAdmin
    .from("colleges_uk")
    .select("institution_id, name, city, region, median_earnings, tuition, qs_rank, website")
    .order("median_earnings", { ascending: false })
    .limit(100)

  if (error) {
    console.error("[map-data] colleges_uk fetch failed:", error)
    return []
  }

  const coords = getUKCityCoords()
  const defaultCoord = { lat: 54, lng: -2 }  // UK centroid fallback

  return (data ?? []).map((r: {
    institution_id: string
    name: string
    city: string
    region: string
    median_earnings: number | null
    tuition: number | null
    qs_rank: number | null
    website: string | null
  }) => {
    const key = `${r.city.toLowerCase()}|${r.region}`
    const coord = coords.get(key) ?? defaultCoord
    return {
      institution_id: r.institution_id,
      college_name: r.name,
      city_name: r.city,
      region: r.region,
      lat: coord.lat,
      lng: coord.lng,
      median_earnings: r.median_earnings,
      tuition: r.tuition,
      qs_rank: r.qs_rank,
      website: r.website,
      slug: r.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }
  })
}

async function getCAColleges(): Promise<CACollege[]> {
  const { data, error } = await supabaseAdmin
    .from("colleges_ca")
    .select("institution_id, name, city, province, median_earnings, graduation_rate, avg_net_price, qs_rank, website")
    .order("median_earnings", { ascending: false })
    .limit(100)

  if (error) {
    console.error("[map-data] colleges_ca fetch failed:", error)
    return []
  }

  const coords = getCACityCoords()
  const defaultCoord = { lat: 56, lng: -106 }  // Canada centroid fallback

  return (data ?? []).map((r: {
    institution_id: string
    name: string
    city: string
    province: string
    median_earnings: number | null
    graduation_rate: number | null
    avg_net_price: number | null
    qs_rank: number | null
    website: string | null
  }) => {
    const key = `${r.city.toLowerCase()}|${r.province}`
    const coord = coords.get(key) ?? defaultCoord
    return {
      institution_id: r.institution_id,
      college_name: r.name,
      city_name: r.city,
      province: r.province,
      lat: coord.lat,
      lng: coord.lng,
      median_earnings: r.median_earnings,
      graduation_rate: r.graduation_rate,
      avg_net_price: r.avg_net_price,
      qs_rank: r.qs_rank,
      website: r.website,
      slug: r.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }
  })
}

async function getMapDataUncached(): Promise<MapData> {
  const [occupations, stateRows, usColleges, multRows, coursesByFieldState, caColleges, caOccupationsList, caStateRows, caCities, ukOccupationsList, ukStateRows, ukColleges] = await Promise.all([
    fetchAll<OccRow>(
      "occupations_au",
      "anzsco_code, anzsco_v13, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, related_broad_field, pr_note_ko, source_name, source_url, last_verified",
    ),
    fetchAll<StateRow>("occupation_state_au", "anzsco_code, state, shortage_rating"),
    getUSColleges(),
    supabaseAdmin
      .from("state_salary_multiplier")
      .select("state, anzsco_1digit, multiplier")
      .then((r) => (r.data ?? []) as { state: string; anzsco_1digit: string; multiplier: number }[]),
    getCoursesByFieldState(),
    getCAColleges(),
    fetchAll<CAOccRow>(
      "occupations_ca",
      "noc_code, occupation_en, occupation_ko, median_salary_cad, low_wage_cad, high_wage_cad, average_wage_cad, q1_wage_cad, q3_wage_cad, shortage_rating, on_teer_eligible, related_broad_field, confidence, data_source, last_verified",
    ),
    fetchAll<CAStateRow>(
      "occupation_state_ca",
      "noc_code, province, median_wage_cad, low_wage_cad, high_wage_cad, shortage_rating, data_source",
    ),
    getCACities(),
    fetchAll<UKOccRow>(
      "occupations_uk",
      "soc_code, occupation_en, occupation_ko, median_salary_gbp, on_sol, on_isl, confidence, related_broad_field, source_name, source_url, last_verified",
    ),
    fetchAll<UKStateRow>(
      "occupation_state_uk",
      "soc_code, region, median_salary_gbp, shortage_rating, data_source",
    ),
    getUKColleges(),
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
      anzsco_v13: o.anzsco_v13 || null,
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

  const caOccupations: Record<string, CAOccRow> = {}
  for (const o of caOccupationsList) {
    caOccupations[o.noc_code] = o
  }

  const caHighPay: CAHighPayOccupation[] = caOccupationsList
    .filter((o) => o.noc_code != null)
    .sort((a, b) => (b.median_salary_cad ?? 0) - (a.median_salary_cad ?? 0))
    .slice(0, 12)
    .map((o) => ({
      noc_code: o.noc_code,
      occupation_en: o.occupation_en,
      occupation_ko: o.occupation_ko,
      median_salary_cad: o.median_salary_cad,
      shortage_rating: o.shortage_rating,
    }))

  // CA province-level data from occupation_state_ca (or JSON fallback)
  const caStateRowsRaw: CAStateRow[] = caStateRows.length > 0
    ? caStateRows
    : Object.entries(caOccupationStateRaw as Record<string, Array<Omit<CAStateRow, "province">>>)
        .flatMap(([province, rows]) =>
          rows.map((r) => ({ ...r, province }))
        )

  const caOccByProvince = new Map<string, CAStateRow[]>()
  const caShortagesByOcc = new Map<string, StateShortageByOcc[]>()
  for (const r of caStateRowsRaw) {
    const arr = caOccByProvince.get(r.province) ?? []
    arr.push(r)
    caOccByProvince.set(r.province, arr)

    if (r.shortage_rating != null) {
      const sArr = caShortagesByOcc.get(r.noc_code) ?? []
      sArr.push({ state: r.province, rating: r.shortage_rating })
      caShortagesByOcc.set(r.noc_code, sArr)
    }
  }

  const caProvinceOccupations: Record<string, CAProvinceOccupation[]> = {}
  const caHighPayByProvince: Record<string, CAHighPayOccupation[]> = {}
  for (const province of CA_PROVINCE_CODES) {
    const rows = caOccByProvince.get(province) ?? []
    caProvinceOccupations[province] = rows
      .filter((r) => caOccupations[r.noc_code])
      .map((r) => {
        const occ = caOccupations[r.noc_code]
        return {
          noc_code: r.noc_code,
          occupation_en: occ.occupation_en,
          occupation_ko: occ.occupation_ko,
          median_salary_cad: r.median_wage_cad ?? occ.median_salary_cad,
          low_wage_cad: r.low_wage_cad ?? occ.low_wage_cad,
          high_wage_cad: r.high_wage_cad ?? occ.high_wage_cad,
          shortage_rating: occ.shortage_rating,
          province_shortage_rating: r.shortage_rating,
        }
      })

    caHighPayByProvince[province] = caProvinceOccupations[province]
      .filter((o) => o.median_salary_cad != null)
      .sort((a, b) => (b.median_salary_cad ?? 0) - (a.median_salary_cad ?? 0))
      .slice(0, 12)
      .map((o) => ({
        noc_code: o.noc_code,
        occupation_en: o.occupation_en,
        occupation_ko: o.occupation_ko,
        median_salary_cad: o.median_salary_cad,
        shortage_rating: o.province_shortage_rating ?? o.shortage_rating,
      }))
  }

  const caProvinceShortages: Record<string, StateShortageByOcc[]> = {}
  caShortagesByOcc.forEach((arr, code) => {
    caProvinceShortages[code] = arr
  })

  const usStateInfo = getUSStateInfo()
  const usMajorDensity = computeMajorDensity()
  const usRankedColleges = getUSRankedColleges(usColleges)
  const auRankedColleges = getAURankedColleges()

  // ── UK data aggregation (fall back to JSON if Supabase empty) ─────────────────

  const ukOccupations: Record<string, UKOccRow> = {}
  const ukOccByRegion = new Map<string, UKStateRow[]>()

  if (ukOccupationsList.length > 0) {
    // Supabase data — prefer this
    for (const o of ukOccupationsList) {
      ukOccupations[o.soc_code] = o
    }
    for (const r of ukStateRows) {
      const arr = ukOccByRegion.get(r.region) ?? []
      arr.push(r)
      ukOccByRegion.set(r.region, arr)
    }
  } else {
    // JSON fallback
    const raw = ukOccupationsRaw as unknown as Record<string, {
      soc_code: string
      occupation_en: string
      median_salary_gbp: number | null
      on_sol: boolean
      on_isl: boolean
      source_name: string
    }>
    for (const occ of Object.values(raw)) {
      ukOccupations[occ.soc_code] = { ...occ, occupation_ko: null, confidence: null, related_broad_field: null, source_url: null, last_verified: null }
    }
    const regRaw = ukRegionOccupationsRaw as unknown as Record<string, Array<{
      soc_code: string
      median_salary_gbp: number | null
    }>>
    for (const [region, occs] of Object.entries(regRaw)) {
      ukOccByRegion.set(region, occs.map((r) => ({
        soc_code: r.soc_code,
        region,
        median_salary_gbp: r.median_salary_gbp,
        shortage_rating: null,
        data_source: "ONS ASHE 2025 provisional (JSON fallback)",
      })))
    }
  }

  const ukShortageByRegion: Record<string, UKRegionOccupation[]> = {}
  const ukHighPayByRegion: Record<string, UKRegionOccupation[]> = {}
  for (const code of UK_REGION_CODES) {
    const rows = ukOccByRegion.get(code) ?? []
    const occs: UKRegionOccupation[] = rows
      .filter((r) => ukOccupations[r.soc_code])
      .map((r) => {
        const occ = ukOccupations[r.soc_code]
        return {
          soc_code: r.soc_code,
          occupation_en: occ.occupation_en,
          occupation_ko: occ.occupation_ko,
          median_salary_gbp: r.median_salary_gbp ?? occ.median_salary_gbp,
          shortage_rating: r.shortage_rating,
        }
      })

    ukShortageByRegion[code] = occs.sort(
      (a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0) ||
                ((b.median_salary_gbp ?? 0) - (a.median_salary_gbp ?? 0)),
    )

    ukHighPayByRegion[code] = occs
      .filter((o) => o.median_salary_gbp != null)
      .sort((a, b) => (b.median_salary_gbp ?? 0) - (a.median_salary_gbp ?? 0))
      .slice(0, 12)
  }

  return { shortageByState, highPay, usColleges, stateSalaryMult, usShortageByState: usOccData.shortageByState, usHighPayByState: usOccData.highPayByState, auOccupations, auStateShortages, coursesByFieldState, usStateInfo, usMajorDensity, usRankedColleges, auRankedColleges, caColleges, caOccupations, caHighPay, caHighPayByProvince, caProvinceOccupations, caProvinceShortages, caCities, ukOccupations, ukShortageByRegion, ukHighPayByRegion, ukColleges }
}

// cross-instance 공유 캐시(방어선). 페이지가 force-static이라 보통 빌드/리밸리데이트
// 때만 돌지만, 콜드 인스턴스·리밸리데이트에서도 Supabase 6쿼리가 중복 실행되지
// 않도록 24h 캐시한다. 페이지의 revalidate(86400)와 동일하게 맞춘다.
const getMapDataCached = unstable_cache(getMapDataUncached, ["map-data"], {
  revalidate: 86400,
})

export async function getMapData(): Promise<MapData> {
  return getMapDataCached()
}
