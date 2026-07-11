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
import ukCollegesRaw from "@/data/uk-colleges.json"
import deOccupationsRaw from "@/data/de-occupations.json"
import deCollegesRaw from "@/data/de-colleges.json"
import deCitiesRaw from "@/data/de-cities.json"
import deRegionOccupationsRaw from "@/data/de-region-occupations.json"
import nlOccupationsRaw from "@/data/nl-occupations.json"
import nlCollegesRaw from "@/data/nl-colleges.json"
import nlCitiesRaw from "@/data/nl-cities.json"
import nlRegionOccupationsRaw from "@/data/nl-region-occupations.json"
import beGraduateSalaryRaw from "@/data/be-graduate-salary.json"
import beRentByCityRaw from "@/data/be-rent-by-city.json"
import beShortageOccupationsRaw from "@/data/be-shortage-occupations.json"
import beHighIncomeOccupationsRaw from "@/data/be-high-income-occupations.json"
import beOccupationsSalaryRaw from "@/data/be-occupations-salary.json"
import beUniversitiesRaw from "@/data/be-universities.json"
import beTaxRatesRaw from "@/data/be-tax-rates.json"
import beJobatLinksRaw from "@/data/be-jobat-links.json"
import { JP_CITIES, JP_HIGH_PAY_OCCUPATIONS, JP_JOBTAG_PROFILES_BY_WAGE_CODE, JP_RENT_BY_PREFECTURE, JP_SHORTAGE_BY_PREFECTURE, type JPHighPayOccupation, type JPJobTagProfile, type JPRentArea, type JPShortageGroup } from "@/data/jp-map-data"
import { SG_DEMAND_OCCUPATIONS, SG_HIGH_PAY_OCCUPATIONS, SG_MAP_AREAS, SG_WORK_PASS_PATHWAYS, type SingaporeDemandOccupation, type SingaporeMapArea, type SingaporeWageOccupation, type SingaporeWorkPassPathway } from "@/data/sg-map-data"
import { KR_HIGH_PAY_BY_REGION, KR_OCCUPATIONS, KR_OCCUPATIONS_BY_REGION, KR_REGIONS, KR_UNIVERSITIES, type KoreaOccupation, type KoreaRegion, type KoreaUniversity } from "@/data/kr-map-data"
import { FR_CITIES, FR_DEMAND_BY_REGION, FR_DEMAND_OCCUPATIONS, FR_REGIONS, FR_SALARY_BY_REGION, FR_UNIVERSITIES, type FranceCity, type FranceDemandOccupation, type FranceRegion, type FranceSalaryGroup, type FranceUniversity } from "@/data/fr-map-data"
import { ES_CITIES, ES_COMMUNITIES, ES_HIGH_PAY_BY_COMMUNITY, ES_OCCUPATIONS, ES_PROVINCES, ES_SHORTAGE_BY_COMMUNITY, ES_SHORTAGE_BY_PROVINCE, ES_UNIVERSITIES, type SpainCity, type SpainCommunity, type SpainOccupation, type SpainProvince, type SpainSalaryGroup, type SpainUniversity } from "@/data/es-map-data"

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
  mean_salary_gbp: number | null
  q1_salary_gbp: number | null
  q3_salary_gbp: number | null
  employment_thousands: number | null
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
  mean_salary_gbp: number | null
  q1_salary_gbp: number | null
  q3_salary_gbp: number | null
  employment_thousands: number | null
  shortage_rating: number | null
}

export interface UKStateRow {
  soc_code: string
  region: string
  median_salary_gbp: number | null
  mean_salary_gbp: number | null
  q1_salary_gbp: number | null
  q3_salary_gbp: number | null
  employment_thousands: number | null
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

export interface UKCity {
  name: string
  region: string
  rent_median: number | null
  cost_of_living_index: number | null
}

export interface DEOccRow {
  kldb_code: string
  occupation_de: string
  occupation_en: string
  median_salary_eur: number | null
  mean_salary_eur: number | null
  q1_salary_eur: number | null
  q3_salary_eur: number | null
  employment_thousands: number | null
  shortage_rating: number | null
  on_blue_card_list: boolean
  related_broad_field: string | null
  median_salary_spezialist_eur?: number | null
  median_salary_experte_eur?: number | null
  shortage_rating_spezialist?: number | null
  shortage_rating_experte?: number | null
}

export interface DERegionOccupation {
  kldb_code: string
  occupation_en: string
  median_salary_eur: number | null
  shortage_rating: number | null
  employment_thousands: number | null
  median_salary_spezialist_eur?: number | null
  median_salary_experte_eur?: number | null
  shortage_rating_spezialist?: number | null
  shortage_rating_experte?: number | null
}

export interface DECollege {
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

export interface DECity {
  name: string
  region: string
  rent_median: number | null
  cost_of_living_index: number | null
}

// ── NL (Netherlands) interfaces ──────────────────────────────────────────────────

export interface NLOccRow {
  sbc_code: string
  occupation_nl: string
  occupation_en: string
  median_salary_eur: number | null
  mean_salary_eur: number | null
  q1_salary_eur: number | null
  q3_salary_eur: number | null
  employment_thousands: number | null
  shortage_rating: number | null
  related_broad_field: string | null
}

export interface NLRegionOccupation {
  sbc_code: string
  occupation_en: string
  median_salary_eur: number | null
  shortage_rating: number | null
  employment_thousands: number | null
}

export interface NLCollege {
  institution_id: string
  college_name: string
  city_name: string
  province: string
  lat: number
  lng: number
  median_earnings: number | null
  tuition: number | null
  qs_rank: number | null
  website: string | null
  slug: string
}

export interface NLCity {
  name: string
  province: string
  rent_median: number | null
  cost_of_living_index: number | null
}

// ── BE (Belgium) interfaces ──────────────────────────────────────────────────

export interface BEOccRow {
  occupation_code: string
  occupation_en: string
  occupation_nl: string | null
  occupation_fr: string | null
  median_salary_eur: number | null
  mean_salary_eur: number | null
  shortage_rating: number | null
  related_broad_field: string | null
}

export interface BERegionOccupation {
  occupation_code: string
  occupation_en: string
  median_salary_eur: number | null
  shortage_rating: number | null
}

export interface BECollege {
  institution_id: string
  college_name: string
  city_name: string
  region: string
  lat: number
  lng: number
  median_earnings: number | null
  tuition: number | null
  qs_rank: number | null
  the_rank: number | null
  website: string | null
  slug: string
}

export interface BECity {
  name: string
  region: string
  rent_median: number | null
  cost_of_living_index: number | null
}

export interface BEStateInfo {
  average_rent_eur: number | null
  average_salary_eur: number | null
  cost_of_living_index: number | null
  shortage_occupations: string[] | null
  high_income_occupations: string[] | null
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
  ukCities: UKCity[]
  deOccupations: Record<string, DEOccRow>
  deHighPayByRegion: Record<string, DERegionOccupation[]>
  deShortageByRegion: Record<string, DERegionOccupation[]>
  deColleges: DECollege[]
  deCities: DECity[]
  nlOccupations: Record<string, NLOccRow>
  nlShortageByRegion: Record<string, NLRegionOccupation[]>
  nlHighPayByRegion: Record<string, NLRegionOccupation[]>
  nlColleges: NLCollege[]
  nlCities: NLCity[]
  beOccupations: Record<string, BEOccRow>
  beHighPayByRegion: Record<string, BERegionOccupation[]>
  beShortageByRegion: Record<string, BERegionOccupation[]>
  beColleges: BECollege[]
  beCities: BECity[]
  beStateInfo: Record<string, BEStateInfo>
  beTaxRates: Record<string, unknown>
  beJobatLinks: Record<string, { occupation_en: string; jobat_url: string; salary_url: string; course_url: string | null; course_keywords: string[] }>
  jpShortageByPrefecture: Record<string, JPShortageGroup[]>
  jpHighPayOccupations: JPHighPayOccupation[]
  jpRentByPrefecture: Record<string, JPRentArea>
  jpCities: JPRentArea[]
  jpJobTagProfilesByWageCode: Record<string, JPJobTagProfile[]>
  sgDemandOccupations: SingaporeDemandOccupation[]
  sgHighPayOccupations: SingaporeWageOccupation[]
  sgAreas: SingaporeMapArea[]
  sgWorkPassPathways: { country: "SG"; reviewStatus: "review-required"; lastChecked: string; pathways: SingaporeWorkPassPathway[] }
  krRegions: KoreaRegion[]
  krOccupations: KoreaOccupation[]
  krOccupationsByRegion: Record<string, KoreaOccupation[]>
  krHighPayByRegion: Record<string, KoreaOccupation[]>
  krUniversities: KoreaUniversity[]
  frRegions: FranceRegion[]
  frCities: FranceCity[]
  frDemandOccupations: FranceDemandOccupation[]
  frDemandByRegion: Record<string, Array<FranceDemandOccupation & { regionalProjects: number }>>
  frSalaryByRegion: Record<string, FranceSalaryGroup[]>
  frUniversities: FranceUniversity[]
  esCommunities: SpainCommunity[]
  esProvinces: SpainProvince[]
  esCities: SpainCity[]
  esOccupations: SpainOccupation[]
  esShortageByCommunity: Record<string, SpainOccupation[]>
  esShortageByProvince: Record<string, SpainOccupation[]>
  esHighPayByCommunity: Record<string, SpainSalaryGroup[]>
  esUniversities: SpainUniversity[]
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
  const coords = getUKCityCoords()
  const defaultCoord = { lat: 54, lng: -2 }  // UK centroid fallback

  const { data, error } = await supabaseAdmin
    .from("colleges_uk")
    .select("institution_id, name, city, region, median_earnings, tuition, qs_rank, website")
    .order("median_earnings", { ascending: false })
    .limit(100)

  if (!error && data && data.length > 0) {
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

  // JSON fallback
  const raw = ukCollegesRaw as unknown as Array<{
    institution_id: string
    name: string
    city: string
    region: string
    qs_rank: number | null
    t?: number
    m?: number
    website: string | null
  }>
  return raw.map((r) => {
    const key = `${r.city.toLowerCase()}|${r.region}`
    const coord = coords.get(key) ?? defaultCoord
    return {
      institution_id: r.institution_id,
      college_name: r.name,
      city_name: r.city,
      region: r.region,
      lat: coord.lat,
      lng: coord.lng,
      median_earnings: r.m ?? null,
      tuition: r.t ?? null,
      qs_rank: r.qs_rank,
      website: r.website,
      slug: r.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }
  })
}

async function getUKCities(): Promise<UKCity[]> {
  const raw = ukCitiesRaw as unknown as Array<{
    c: string
    s: string
    r?: number
    cli?: number
  }>
  return raw.map((city) => ({
    name: city.c,
    region: city.s,
    rent_median: city.r ?? null,
    cost_of_living_index: city.cli ?? null,
  }))
}

// ── DE (Germany) data ───────────────────────────────────────────────────────────

async function getDEColleges(): Promise<DECollege[]> {
  const raw = deCollegesRaw as unknown as Array<{
    institution_id: string
    name: string
    city: string
    region: string
    qs_rank: number | null
    m?: number | null
    t?: number | null
    website: string | null
  }>
  const cityCoords = getDECityCoords()
  const defaultCoord = { lat: 51.165, lng: 10.451 }  // Germany centroid
  return raw.map((r) => {
    const slug = r.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const coord = cityCoords.get(r.city.toLowerCase()) ?? defaultCoord
    return {
      institution_id: r.institution_id,
      college_name: r.name,
      city_name: r.city,
      region: r.region,
      lat: coord.lat,
      lng: coord.lng,
      median_earnings: r.m ?? null,
      tuition: r.t ?? null,
      qs_rank: r.qs_rank,
      website: r.website,
      slug,
    }
  })
}

function getDECityCoords(): Map<string, { lat: number; lng: number }> {
  const map = new Map<string, { lat: number; lng: number }>()
  const cities = deCitiesRaw as unknown as Array<{ name: string; lat: number; lng: number }>
  for (const city of cities) {
    map.set(city.name.toLowerCase(), { lat: city.lat, lng: city.lng })
  }
  return map
}

async function getDECities(): Promise<DECity[]> {
  const raw = deCitiesRaw as unknown as Array<{
    name: string
    region: string
    rent_median: number | null
    cost_of_living_index: number | null
  }>
  return raw.map((city) => ({
    name: city.name,
    region: city.region,
    rent_median: city.rent_median ?? null,
    cost_of_living_index: city.cost_of_living_index ?? null,
  }))
}

// ── NL (Netherlands) data ─────────────────────────────────────────────────────────

async function getNLColleges(): Promise<NLCollege[]> {
  const raw = nlCollegesRaw as unknown as Array<{
    institution_id: string
    name: string
    city: string
    province: string
    qs_rank: number | null
    m?: number | null
    t?: number | null
    website: string | null
  }>
  const cityCoords = getNLCityCoords()
  const defaultCoord = { lat: 52.1326, lng: 5.2913 }  // Netherlands centroid
  return raw.map((r) => {
    const slug = r.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const coord = cityCoords.get(r.city.toLowerCase()) ?? defaultCoord
    return {
      institution_id: r.institution_id,
      college_name: r.name,
      city_name: r.city,
      province: r.province,
      lat: coord.lat,
      lng: coord.lng,
      median_earnings: r.m ?? null,
      tuition: r.t ?? null,
      qs_rank: r.qs_rank,
      website: r.website,
      slug,
    }
  })
}

function getNLCityCoords(): Map<string, { lat: number; lng: number }> {
  const map = new Map<string, { lat: number; lng: number }>()
  const cities = nlCitiesRaw as unknown as Array<{ name: string; lat: number; lng: number }>
  for (const city of cities) {
    map.set(city.name.toLowerCase(), { lat: city.lat, lng: city.lng })
  }
  return map
}

async function getNLCities(): Promise<NLCity[]> {
  const raw = nlCitiesRaw as unknown as Array<{
    name: string
    province: string
    rent_median: number | null
    cost_of_living_index: number | null
  }>
  return raw.map((city) => ({
    name: city.name,
    province: city.province,
    rent_median: city.rent_median ?? null,
    cost_of_living_index: city.cost_of_living_index ?? null,
  }))
}

// ── BE (Belgium) data ─────────────────────────────────────────────────────────

function getBEOccupations(): Record<string, BEOccRow> {
  const graduateSalary = beGraduateSalaryRaw as unknown as {
    graduate_salary_by_field: Array<{
      field: string
      field_nl: string
      field_fr: string
      starting_salary_eur: number
      experience_5yr_eur: number
    }>
  }

  const highIncomeData = beHighIncomeOccupationsRaw as unknown as {
    top_10_high_income_occupations: Array<{
      rank: number
      occupation: string
      occupation_nl: string
      occupation_fr: string
      average_gross_monthly_eur: number
    }>
  }

  const occupations: Record<string, BEOccRow> = {}

  // Graduate salary data
  for (const field of graduateSalary.graduate_salary_by_field) {
    const code = field.field.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    occupations[code] = {
      occupation_code: code,
      occupation_en: field.field,
      occupation_nl: field.field_nl,
      occupation_fr: field.field_fr,
      median_salary_eur: field.starting_salary_eur,
      mean_salary_eur: (field.starting_salary_eur + field.experience_5yr_eur) / 2,
      shortage_rating: null,
      related_broad_field: field.field,
    }
  }

  // High income occupations
  for (const occ of highIncomeData.top_10_high_income_occupations) {
    const code = occ.occupation.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (!occupations[code]) {
      occupations[code] = {
        occupation_code: code,
        occupation_en: occ.occupation,
        occupation_nl: occ.occupation_nl,
        occupation_fr: occ.occupation_fr,
        median_salary_eur: occ.average_gross_monthly_eur,
        mean_salary_eur: occ.average_gross_monthly_eur,
        shortage_rating: null,
        related_broad_field: null,
      }
    }
  }

  // Shortage occupations (so clicking them in the shortage tab resolves the detail card)
  const shortageData = beShortageOccupationsRaw as unknown as {
    flanders: { top_10_shortage: Array<{ rank: number; occupation: string; occupation_nl: string }> }
    brussels: { top_shortage: Array<{ occupation: string; occupation_fr: string }> }
    wallonia: { top_shortage: Array<{ occupation: string; occupation_fr: string }> }
  }

  const addShortage = (occ: { occupation: string; occupation_nl?: string; occupation_fr?: string }, rating: number | null) => {
    const code = occ.occupation.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (!occupations[code]) {
      occupations[code] = {
        occupation_code: code,
        occupation_en: occ.occupation,
        occupation_nl: occ.occupation_nl ?? null,
        occupation_fr: occ.occupation_fr ?? null,
        median_salary_eur: null,
        mean_salary_eur: null,
        shortage_rating: rating,
        related_broad_field: null,
      }
    } else if (occupations[code].shortage_rating == null && rating != null) {
      occupations[code].shortage_rating = rating
    }
  }

  for (const occ of shortageData.flanders.top_10_shortage) {
    addShortage(occ, 6 - Math.min(occ.rank, 5))
  }
  for (const occ of shortageData.brussels.top_shortage) {
    addShortage(occ, 5)
  }
  for (const occ of shortageData.wallonia.top_shortage) {
    addShortage(occ, 5)
  }

  // Enrich with Indeed/Jobat salary data (fill in missing salaries)
  const salaryData = beOccupationsSalaryRaw as unknown as {
    occupations: Record<string, { salary_eur_monthly: number | null; occupation_en: string }>
  }
  for (const [code, entry] of Object.entries(salaryData.occupations)) {
    if (entry.salary_eur_monthly != null && occupations[code] && occupations[code].median_salary_eur == null) {
      occupations[code].median_salary_eur = entry.salary_eur_monthly
      occupations[code].mean_salary_eur = entry.salary_eur_monthly
    }
  }

  return occupations
}

function getBEHighPayByRegion(): Record<string, BERegionOccupation[]> {
  const highIncomeData = beHighIncomeOccupationsRaw as unknown as {
    top_10_high_income_occupations: Array<{
      rank: number
      occupation: string
      occupation_nl: string
      occupation_fr: string
      average_gross_monthly_eur: number
    }>
  }

  const regions = ["FL", "WA", "BR"]
  const result: Record<string, BERegionOccupation[]> = {}

  for (const region of regions) {
    result[region] = highIncomeData.top_10_high_income_occupations.map((occ) => ({
      occupation_code: occ.occupation.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      occupation_en: occ.occupation,
      median_salary_eur: occ.average_gross_monthly_eur,
      shortage_rating: null,
    }))
  }

  return result
}

function getBEShortageByRegion(): Record<string, BERegionOccupation[]> {
  const shortageData = beShortageOccupationsRaw as unknown as {
    flanders: { top_10_shortage: Array<{ rank: number; occupation: string; occupation_nl: string }> }
    brussels: { top_shortage: Array<{ occupation: string; occupation_fr: string }> }
    wallonia: { top_shortage: Array<{ occupation: string; occupation_fr: string }> }
  }

  const result: Record<string, BERegionOccupation[]> = {}

  // Flanders
  result["FL"] = shortageData.flanders.top_10_shortage.map((occ) => ({
    occupation_code: occ.occupation.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    occupation_en: occ.occupation,
    median_salary_eur: null,
    shortage_rating: 6 - Math.min(occ.rank, 5),
  }))

  // Brussels
  result["BR"] = shortageData.brussels.top_shortage.map((occ) => ({
    occupation_code: occ.occupation.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    occupation_en: occ.occupation,
    median_salary_eur: null,
    shortage_rating: 5,
  }))

  // Wallonia
  result["WA"] = shortageData.wallonia.top_shortage.map((occ) => ({
    occupation_code: occ.occupation.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    occupation_en: occ.occupation,
    median_salary_eur: null,
    shortage_rating: 5,
  }))

  // Enrich with Indeed/Jobat salary data
  const salaryLookup = beOccupationsSalaryRaw as unknown as {
    occupations: Record<string, { salary_eur_monthly: number | null }>
  }
  for (const region of Object.keys(result)) {
    for (const occ of result[region]) {
      const salary = salaryLookup.occupations[occ.occupation_code]?.salary_eur_monthly
      if (salary != null) occ.median_salary_eur = salary
    }
  }

  return result
}

async function getBEColleges(): Promise<BECollege[]> {
  const uniData = beUniversitiesRaw as unknown as {
    universities: Array<{
      name: string
      name_nl?: string
      city: string
      region: string
      qs_rank: number
      the_rank: number
      website: string
      slug: string
    }>
  }

  // Approximate coordinates for Belgian university cities
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    "Leuven": { lat: 50.8798, lng: 4.7005 },
    "Ghent": { lat: 51.0543, lng: 3.7174 },
    "Antwerp": { lat: 51.2194, lng: 4.4025 },
    "Brussels": { lat: 50.8503, lng: 4.3517 },
    "Louvain-la-Neuve": { lat: 50.6699, lng: 4.6119 },
    "Liège": { lat: 50.6326, lng: 5.5797 },
    "Hasselt": { lat: 50.9307, lng: 5.3321 },
    "Mons": { lat: 50.4542, lng: 3.9520 },
    "Namur": { lat: 50.4669, lng: 4.8675 },
  }

  return uniData.universities.map((u, i) => {
    const coords = cityCoords[u.city] ?? { lat: 50.85, lng: 4.35 }
    return {
      institution_id: `be-uni-${i}`,
      college_name: u.name,
      city_name: u.city,
      region: u.region,
      lat: coords.lat,
      lng: coords.lng,
      median_earnings: null,
      tuition: null,
      qs_rank: u.qs_rank,
      the_rank: u.the_rank,
      website: u.website,
      slug: u.slug,
    }
  })
}

async function getBECities(): Promise<BECity[]> {
  const rentData = beRentByCityRaw as unknown as {
    cities: Array<{
      city: string
      region: string
      median_rent_2025: number
      total_cost_2025: number
    }>
  }

  return rentData.cities.map((city) => ({
    name: city.city,
    region: city.region === "Flanders" ? "FL" : city.region === "Wallonia" ? "WA" : "BR",
    rent_median: city.median_rent_2025,
    cost_of_living_index: null,
  }))
}

function getBEStateInfo(): Record<string, BEStateInfo> {
  const rentData = beRentByCityRaw as unknown as {
    regions: {
      Flanders: { average_rent_eur: number }
      Wallonia: { average_rent_eur: number }
      "Brussels-Capital": { average_rent_eur: number }
    }
  }

  const salaryData = beGraduateSalaryRaw as unknown as {
    national_average: { gross_monthly_eur: number }
  }

  const shortageData = beShortageOccupationsRaw as unknown as {
    flanders: { top_10_shortage: Array<{ occupation: string }> }
    brussels: { top_shortage: Array<{ occupation: string }> }
    wallonia: { top_shortage: Array<{ occupation: string }> }
  }

  const highIncomeData = beHighIncomeOccupationsRaw as unknown as {
    top_10_high_income_occupations: Array<{ occupation: string }>
  }

  return {
    FL: {
      average_rent_eur: rentData.regions.Flanders.average_rent_eur,
      average_salary_eur: salaryData.national_average.gross_monthly_eur,
      cost_of_living_index: null,
      shortage_occupations: shortageData.flanders.top_10_shortage.map((o) => o.occupation),
      high_income_occupations: highIncomeData.top_10_high_income_occupations.map((o) => o.occupation),
    },
    WA: {
      average_rent_eur: rentData.regions.Wallonia.average_rent_eur,
      average_salary_eur: salaryData.national_average.gross_monthly_eur,
      cost_of_living_index: null,
      shortage_occupations: shortageData.wallonia.top_shortage.map((o) => o.occupation),
      high_income_occupations: highIncomeData.top_10_high_income_occupations.map((o) => o.occupation),
    },
    BR: {
      average_rent_eur: rentData.regions["Brussels-Capital"].average_rent_eur,
      average_salary_eur: salaryData.national_average.gross_monthly_eur,
      cost_of_living_index: null,
      shortage_occupations: shortageData.brussels.top_shortage.map((o) => o.occupation),
      high_income_occupations: highIncomeData.top_10_high_income_occupations.map((o) => o.occupation),
    },
  }
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
  const [occupations, stateRows, usColleges, multRows, coursesByFieldState, caColleges, caOccupationsList, caStateRows, caCities, ukOccupationsList, ukStateRows, ukColleges, ukCities, deColleges, deCities, nlCities, nlColleges] = await Promise.all([
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
    getUKCities(),
    getDEColleges(),
    getDECities(),
    getNLCities(),
    getNLColleges(),
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
      mean_salary_gbp?: number | null
      q1_salary_gbp?: number | null
      q3_salary_gbp?: number | null
      employment_thousands?: number | null
      on_sol: boolean
      on_isl: boolean
      source_name: string
    }>
    for (const occ of Object.values(raw)) {
      ukOccupations[occ.soc_code] = {
        ...occ,
        mean_salary_gbp: occ.mean_salary_gbp ?? null,
        q1_salary_gbp: occ.q1_salary_gbp ?? null,
        q3_salary_gbp: occ.q3_salary_gbp ?? null,
        employment_thousands: occ.employment_thousands ?? null,
        occupation_ko: null, confidence: null, related_broad_field: null, source_url: null, last_verified: null,
      }
    }
    const regRaw = ukRegionOccupationsRaw as unknown as Record<string, Array<{
      soc_code: string
      median_salary_gbp: number | null
      mean_salary_gbp?: number | null
      q1_salary_gbp?: number | null
      q3_salary_gbp?: number | null
      employment_thousands?: number | null
    }>>
    for (const [region, occs] of Object.entries(regRaw)) {
      ukOccByRegion.set(region, occs.map((r) => ({
        soc_code: r.soc_code,
        region,
        median_salary_gbp: r.median_salary_gbp,
        mean_salary_gbp: r.mean_salary_gbp ?? null,
        q1_salary_gbp: r.q1_salary_gbp ?? null,
        q3_salary_gbp: r.q3_salary_gbp ?? null,
        employment_thousands: r.employment_thousands ?? null,
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
          mean_salary_gbp: r.mean_salary_gbp ?? occ.mean_salary_gbp,
          q1_salary_gbp: r.q1_salary_gbp ?? occ.q1_salary_gbp,
          q3_salary_gbp: r.q3_salary_gbp ?? occ.q3_salary_gbp,
          employment_thousands: r.employment_thousands ?? occ.employment_thousands,
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

  // ── DE (Germany) data from JSON ────────────────────────────────────────────────

  const deRaw = deOccupationsRaw as unknown as Record<string, {
    kldb_code: string
    occupation_de: string
    occupation_en: string
    median_salary_eur: number | null
    mean_salary_eur: number | null
    q1_salary_eur: number | null
    q3_salary_eur: number | null
    employment_thousands: number | null
    shortage_rating: number | null
    on_blue_card_list: boolean
    related_broad_field: string | null
  }>
  const deOccupations: Record<string, DEOccRow> = {}
  for (const occ of Object.values(deRaw)) {
    deOccupations[occ.kldb_code] = occ
  }

  const deRegRaw = deRegionOccupationsRaw as unknown as Record<string, {
    kldb_code: string; shortage_rating: number | null; median_salary_eur: number | null;
    median_salary_spezialist_eur?: number | null; median_salary_experte_eur?: number | null;
    shortage_rating_spezialist?: number | null; shortage_rating_experte?: number | null
  }[]>
  const deShortageByRegion: Record<string, DERegionOccupation[]> = {}
  const deHighPayByRegion: Record<string, DERegionOccupation[]> = {}
  for (const [code, entries] of Object.entries(deRegRaw)) {
    const occs = entries
      .map((e): DERegionOccupation | null => {
        const o = deOccupations[e.kldb_code]
        if (!o) return null
        return {
          kldb_code: o.kldb_code,
          occupation_en: o.occupation_en,
          median_salary_eur: e.median_salary_eur ?? o.median_salary_eur,
          shortage_rating: e.shortage_rating ?? o.shortage_rating,
          employment_thousands: o.employment_thousands,
          median_salary_spezialist_eur: e.median_salary_spezialist_eur ?? o.median_salary_spezialist_eur ?? null,
          median_salary_experte_eur: e.median_salary_experte_eur ?? o.median_salary_experte_eur ?? null,
          shortage_rating_spezialist: e.shortage_rating_spezialist ?? o.shortage_rating_spezialist ?? null,
          shortage_rating_experte: e.shortage_rating_experte ?? o.shortage_rating_experte ?? null,
        }
      })
      .filter((x): x is DERegionOccupation => x != null)
    deShortageByRegion[code] = occs.sort(
      (a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0),
    )
    deHighPayByRegion[code] = occs
      .filter((o) => o.median_salary_eur != null)
      .sort((a, b) => (b.median_salary_eur ?? 0) - (a.median_salary_eur ?? 0))
      .slice(0, 12)
  }

  // ── NL (Netherlands) data from JSON ──────────────────────────────────────────────

  const nlRaw = nlOccupationsRaw as unknown as Record<string, {
    sbc_code: string
    occupation_nl: string
    occupation_en: string
    median_salary_eur: number | null
    mean_salary_eur: number | null
    q1_salary_eur: number | null
    q3_salary_eur: number | null
    employment_thousands: number | null
    shortage_rating: number | null
    related_broad_field: string | null
  }>
  const nlOccupations: Record<string, NLOccRow> = {}
  for (const occ of Object.values(nlRaw)) {
    nlOccupations[occ.sbc_code] = occ
  }

  const nlRegRaw = nlRegionOccupationsRaw as unknown as Record<string, {
    sbc_code: string; shortage_rating: number | null; median_salary_eur: number | null
  }[]>
  const nlShortageByRegion: Record<string, NLRegionOccupation[]> = {}
  const nlHighPayByRegion: Record<string, NLRegionOccupation[]> = {}
  for (const [code, entries] of Object.entries(nlRegRaw)) {
    const occs = entries
      .map((e): NLRegionOccupation | null => {
        const o = nlOccupations[e.sbc_code]
        if (!o) return null
        return {
          sbc_code: o.sbc_code,
          occupation_en: o.occupation_en,
          median_salary_eur: e.median_salary_eur ?? o.median_salary_eur,
          shortage_rating: e.shortage_rating ?? o.shortage_rating,
          employment_thousands: o.employment_thousands,
        }
      })
      .filter((x): x is NLRegionOccupation => x != null)
    nlShortageByRegion[code] = occs.sort(
      (a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0),
    )
    nlHighPayByRegion[code] = occs
      .filter((o) => o.median_salary_eur != null)
      .sort((a, b) => (b.median_salary_eur ?? 0) - (a.median_salary_eur ?? 0))
      .slice(0, 12)
  }

  // ── BE (Belgium) data ────────────────────────────────────────────────────────

  const beOccupations = getBEOccupations()
  const beHighPayByRegion = getBEHighPayByRegion()
  const beShortageByRegion = getBEShortageByRegion()
  const beColleges = await getBEColleges()
  const beCities = await getBECities()
  const beStateInfo = getBEStateInfo()

  const beTaxRates = beTaxRatesRaw as unknown as Record<string, unknown>
  const beJobatLinksData = beJobatLinksRaw as unknown as { occupations: Record<string, { occupation_en: string; jobat_url: string; salary_url: string; course_url: string | null; course_keywords: string[] }> }
  const beJobatLinks = beJobatLinksData.occupations

  return { shortageByState, highPay, usColleges, stateSalaryMult, usShortageByState: usOccData.shortageByState, usHighPayByState: usOccData.highPayByState, auOccupations, auStateShortages, coursesByFieldState, usStateInfo, usMajorDensity, usRankedColleges, auRankedColleges, caColleges, caOccupations, caHighPay, caHighPayByProvince, caProvinceOccupations, caProvinceShortages, caCities, ukOccupations, ukShortageByRegion, ukHighPayByRegion, ukColleges, ukCities, deOccupations, deHighPayByRegion, deShortageByRegion, deColleges, deCities, nlOccupations, nlShortageByRegion, nlHighPayByRegion, nlColleges, nlCities, beOccupations, beHighPayByRegion, beShortageByRegion, beColleges, beCities, beStateInfo, beTaxRates, beJobatLinks, jpShortageByPrefecture: JP_SHORTAGE_BY_PREFECTURE, jpHighPayOccupations: JP_HIGH_PAY_OCCUPATIONS, jpRentByPrefecture: JP_RENT_BY_PREFECTURE, jpCities: JP_CITIES, jpJobTagProfilesByWageCode: JP_JOBTAG_PROFILES_BY_WAGE_CODE, sgDemandOccupations: SG_DEMAND_OCCUPATIONS, sgHighPayOccupations: SG_HIGH_PAY_OCCUPATIONS, sgAreas: SG_MAP_AREAS, sgWorkPassPathways: SG_WORK_PASS_PATHWAYS, krRegions: KR_REGIONS, krOccupations: KR_OCCUPATIONS, krOccupationsByRegion: KR_OCCUPATIONS_BY_REGION, krHighPayByRegion: KR_HIGH_PAY_BY_REGION, krUniversities: KR_UNIVERSITIES, frRegions: FR_REGIONS, frCities: FR_CITIES, frDemandOccupations: FR_DEMAND_OCCUPATIONS, frDemandByRegion: FR_DEMAND_BY_REGION, frSalaryByRegion: FR_SALARY_BY_REGION, frUniversities: FR_UNIVERSITIES, esCommunities: ES_COMMUNITIES, esProvinces: ES_PROVINCES, esCities: ES_CITIES, esOccupations: ES_OCCUPATIONS, esShortageByCommunity: ES_SHORTAGE_BY_COMMUNITY, esShortageByProvince: ES_SHORTAGE_BY_PROVINCE, esHighPayByCommunity: ES_HIGH_PAY_BY_COMMUNITY, esUniversities: ES_UNIVERSITIES }
}

// ── Per-country lightweight data (avoids 2 MB unstable_cache limit) ──────────

export interface AUMapData {
  shortageByState: Record<string, StateOccupation[]>
  stateSalaryMult: StateSalaryMult
  auRankedColleges: AURankedCollege[]
}

export interface USMapData {
  usRankedColleges: USRankedCollege[]
  usShortageByState: Record<string, USOccupation[]>
  usStateInfo: Record<string, USStateInfo>
}

export interface UKMapData {
  ukColleges: UKCollege[]
  ukHighPayByRegion: Record<string, UKRegionOccupation[]>
  ukCities: UKCity[]
}

export interface DEMapData {
  deColleges: DECollege[]
  deHighPayByRegion: Record<string, DERegionOccupation[]>
  deCities: DECity[]
}

export interface NLMapData {
  nlColleges: NLCollege[]
  nlHighPayByRegion: Record<string, NLRegionOccupation[]>
  nlCities: NLCity[]
}

export interface CAMapData {
  caColleges: CACollege[]
  caHighPayByProvince: Record<string, CAHighPayOccupation[]>
  caCities: CACity[]
}

async function getAUMapDataUncached(): Promise<AUMapData> {
  const [occupations, stateRows, multRows] = await Promise.all([
    fetchAll<OccRow>(
      "occupations_au",
      "anzsco_code, anzsco_v13, occupation_en, occupation_ko, shortage_rating, median_salary_aud, on_csol, confidence, related_broad_field, pr_note_ko, source_name, source_url, last_verified",
    ),
    fetchAll<StateRow>("occupation_state_au", "anzsco_code, state, shortage_rating"),
    supabaseAdmin
      .from("state_salary_multiplier")
      .select("state, anzsco_1digit, multiplier")
      .then((r) => (r.data ?? []) as { state: string; anzsco_1digit: string; multiplier: number }[]),
  ])

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
  for (const r of stateRows) {
    if (r.anzsco_code) stateCountMap.set(r.anzsco_code, (stateCountMap.get(r.anzsco_code) ?? 0) + 1)
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
      (a, b) => a.state_count - b.state_count || b.state_shortage_rating - a.state_shortage_rating || (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0),
    )
  }

  const auRankedColleges = getAURankedColleges()
  return { shortageByState, stateSalaryMult, auRankedColleges }
}

async function getUSMapDataUncached(): Promise<USMapData> {
  const usColleges = await getUSColleges()
  const usRankedColleges = getUSRankedColleges(usColleges)
  const usOccData = getUSOccupationData()
  const usStateInfo = getUSStateInfo()
  return { usRankedColleges, usShortageByState: usOccData.shortageByState, usStateInfo }
}

async function getUKMapDataUncached(): Promise<UKMapData> {
  const [ukOccupationsList, ukStateRows, ukColleges, ukCities] = await Promise.all([
    fetchAll<UKOccRow>(
      "occupations_uk",
      "soc_code, occupation_en, occupation_ko, median_salary_gbp, on_sol, on_isl, confidence, related_broad_field, source_name, source_url, last_verified",
    ),
    fetchAll<UKStateRow>(
      "occupation_state_uk",
      "soc_code, region, median_salary_gbp, shortage_rating, data_source",
    ),
    getUKColleges(),
    getUKCities(),
  ])

  const ukOccupations: Record<string, UKOccRow> = {}
  const ukOccByRegion = new Map<string, UKStateRow[]>()

  if (ukOccupationsList.length > 0) {
    for (const o of ukOccupationsList) ukOccupations[o.soc_code] = o
    for (const r of ukStateRows) {
      const arr = ukOccByRegion.get(r.region) ?? []
      arr.push(r)
      ukOccByRegion.set(r.region, arr)
    }
  } else {
    const raw = ukOccupationsRaw as unknown as Record<string, { soc_code: string; occupation_en: string; median_salary_gbp: number | null; mean_salary_gbp?: number | null; q1_salary_gbp?: number | null; q3_salary_gbp?: number | null; employment_thousands?: number | null; on_sol: boolean; on_isl: boolean; source_name: string }>
    for (const occ of Object.values(raw)) {
      ukOccupations[occ.soc_code] = { ...occ, mean_salary_gbp: occ.mean_salary_gbp ?? null, q1_salary_gbp: occ.q1_salary_gbp ?? null, q3_salary_gbp: occ.q3_salary_gbp ?? null, employment_thousands: occ.employment_thousands ?? null, occupation_ko: null, confidence: null, related_broad_field: null, source_url: null, last_verified: null }
    }
    const regRaw = ukRegionOccupationsRaw as unknown as Record<string, Array<{ soc_code: string; median_salary_gbp: number | null; mean_salary_gbp?: number | null; q1_salary_gbp?: number | null; q3_salary_gbp?: number | null; employment_thousands?: number | null }>>
    for (const [region, occs] of Object.entries(regRaw)) {
      ukOccByRegion.set(region, occs.map((r) => ({ soc_code: r.soc_code, region, median_salary_gbp: r.median_salary_gbp, mean_salary_gbp: r.mean_salary_gbp ?? null, q1_salary_gbp: r.q1_salary_gbp ?? null, q3_salary_gbp: r.q3_salary_gbp ?? null, employment_thousands: r.employment_thousands ?? null, shortage_rating: null, data_source: "ONS ASHE 2025 provisional (JSON fallback)" })))
    }
  }

  const ukHighPayByRegion: Record<string, UKRegionOccupation[]> = {}
  for (const code of UK_REGION_CODES) {
    const rows = ukOccByRegion.get(code) ?? []
    const occs: UKRegionOccupation[] = rows.filter((r) => ukOccupations[r.soc_code]).map((r) => {
      const occ = ukOccupations[r.soc_code]
      return { soc_code: r.soc_code, occupation_en: occ.occupation_en, occupation_ko: occ.occupation_ko, median_salary_gbp: r.median_salary_gbp ?? occ.median_salary_gbp, mean_salary_gbp: r.mean_salary_gbp ?? occ.mean_salary_gbp, q1_salary_gbp: r.q1_salary_gbp ?? occ.q1_salary_gbp, q3_salary_gbp: r.q3_salary_gbp ?? occ.q3_salary_gbp, employment_thousands: r.employment_thousands ?? occ.employment_thousands, shortage_rating: r.shortage_rating }
    })
    ukHighPayByRegion[code] = occs.filter((o) => o.median_salary_gbp != null).sort((a, b) => (b.median_salary_gbp ?? 0) - (a.median_salary_gbp ?? 0)).slice(0, 12)
  }

  return { ukColleges, ukHighPayByRegion, ukCities }
}

async function getDEMapDataUncached(): Promise<DEMapData> {
  const [deColleges, deCities] = await Promise.all([getDEColleges(), getDECities()])

  const deRaw = deOccupationsRaw as unknown as Record<string, { kldb_code: string; occupation_de: string; occupation_en: string; median_salary_eur: number | null; mean_salary_eur: number | null; q1_salary_eur: number | null; q3_salary_eur: number | null; employment_thousands: number | null; shortage_rating: number | null; on_blue_card_list: boolean; related_broad_field: string | null }>
  const deOccupations: Record<string, DEOccRow> = {}
  for (const occ of Object.values(deRaw)) deOccupations[occ.kldb_code] = occ

  const deRegRaw = deRegionOccupationsRaw as unknown as Record<string, { kldb_code: string; shortage_rating: number | null; median_salary_eur: number | null; median_salary_spezialist_eur?: number | null; median_salary_experte_eur?: number | null; shortage_rating_spezialist?: number | null; shortage_rating_experte?: number | null }[]>
  const deHighPayByRegion: Record<string, DERegionOccupation[]> = {}
  for (const [code, entries] of Object.entries(deRegRaw)) {
    const occs = entries.map((e): DERegionOccupation | null => {
      const o = deOccupations[e.kldb_code]
      if (!o) return null
      return { kldb_code: o.kldb_code, occupation_en: o.occupation_en, median_salary_eur: e.median_salary_eur ?? o.median_salary_eur, shortage_rating: e.shortage_rating ?? o.shortage_rating, employment_thousands: o.employment_thousands, median_salary_spezialist_eur: e.median_salary_spezialist_eur ?? o.median_salary_spezialist_eur ?? null, median_salary_experte_eur: e.median_salary_experte_eur ?? o.median_salary_experte_eur ?? null, shortage_rating_spezialist: e.shortage_rating_spezialist ?? o.shortage_rating_spezialist ?? null, shortage_rating_experte: e.shortage_rating_experte ?? o.shortage_rating_experte ?? null }
    }).filter((x): x is DERegionOccupation => x != null)
    deHighPayByRegion[code] = occs.filter((o) => o.median_salary_eur != null).sort((a, b) => (b.median_salary_eur ?? 0) - (a.median_salary_eur ?? 0)).slice(0, 12)
  }

  return { deColleges, deHighPayByRegion, deCities }
}

async function getNLMapDataUncached(): Promise<NLMapData> {
  const [nlColleges, nlCities] = await Promise.all([getNLColleges(), getNLCities()])

  const nlRaw = nlOccupationsRaw as unknown as Record<string, { sbc_code: string; occupation_nl: string; occupation_en: string; median_salary_eur: number | null; mean_salary_eur: number | null; q1_salary_eur: number | null; q3_salary_eur: number | null; employment_thousands: number | null; shortage_rating: number | null; related_broad_field: string | null }>
  const nlOccupations: Record<string, NLOccRow> = {}
  for (const occ of Object.values(nlRaw)) nlOccupations[occ.sbc_code] = occ

  const nlRegRaw = nlRegionOccupationsRaw as unknown as Record<string, { sbc_code: string; shortage_rating: number | null; median_salary_eur: number | null }[]>
  const nlHighPayByRegion: Record<string, NLRegionOccupation[]> = {}
  for (const [code, entries] of Object.entries(nlRegRaw)) {
    const occs = entries.map((e): NLRegionOccupation | null => {
      const o = nlOccupations[e.sbc_code]
      if (!o) return null
      return { sbc_code: o.sbc_code, occupation_en: o.occupation_en, median_salary_eur: e.median_salary_eur ?? o.median_salary_eur, shortage_rating: e.shortage_rating ?? o.shortage_rating, employment_thousands: o.employment_thousands }
    }).filter((x): x is NLRegionOccupation => x != null)
    nlHighPayByRegion[code] = occs.filter((o) => o.median_salary_eur != null).sort((a, b) => (b.median_salary_eur ?? 0) - (a.median_salary_eur ?? 0)).slice(0, 12)
  }

  return { nlColleges, nlHighPayByRegion, nlCities }
}

async function getCAMapDataUncached(): Promise<CAMapData> {
  const [caColleges, caOccupationsList, caStateRows, caCities] = await Promise.all([
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
  ])

  const caOccupations: Record<string, CAOccRow> = {}
  for (const o of caOccupationsList) caOccupations[o.noc_code] = o

  const caStateRowsRaw: CAStateRow[] = caStateRows.length > 0
    ? caStateRows
    : Object.entries(caOccupationStateRaw as Record<string, Array<Omit<CAStateRow, "province">>>).flatMap(([province, rows]) => rows.map((r) => ({ ...r, province })))

  const caOccByProvince = new Map<string, CAStateRow[]>()
  for (const r of caStateRowsRaw) {
    const arr = caOccByProvince.get(r.province) ?? []
    arr.push(r)
    caOccByProvince.set(r.province, arr)
  }

  const caHighPayByProvince: Record<string, CAHighPayOccupation[]> = {}
  for (const province of CA_PROVINCE_CODES) {
    const rows = caOccByProvince.get(province) ?? []
    const provinceOccs = rows.filter((r) => caOccupations[r.noc_code]).map((r) => {
      const occ = caOccupations[r.noc_code]
      return { noc_code: r.noc_code, occupation_en: occ.occupation_en, occupation_ko: occ.occupation_ko, median_salary_cad: r.median_wage_cad ?? occ.median_salary_cad, low_wage_cad: r.low_wage_cad ?? occ.low_wage_cad, high_wage_cad: r.high_wage_cad ?? occ.high_wage_cad, shortage_rating: occ.shortage_rating, province_shortage_rating: r.shortage_rating }
    })
    caHighPayByProvince[province] = provinceOccs.filter((o) => o.median_salary_cad != null).sort((a, b) => (b.median_salary_cad ?? 0) - (a.median_salary_cad ?? 0)).slice(0, 12).map((o) => ({ noc_code: o.noc_code, occupation_en: o.occupation_en, occupation_ko: o.occupation_ko, median_salary_cad: o.median_salary_cad, shortage_rating: o.province_shortage_rating ?? o.shortage_rating }))
  }

  return { caColleges, caHighPayByProvince, caCities }
}

// Cached wrappers — each well under the 2 MB limit
const getAUCached = unstable_cache(getAUMapDataUncached, ["map-data-au"], { revalidate: 86400 })
const getUSCached = unstable_cache(getUSMapDataUncached, ["map-data-us"], { revalidate: 86400 })
const getUKCached = unstable_cache(getUKMapDataUncached, ["map-data-uk"], { revalidate: 86400 })
const getDECached = unstable_cache(getDEMapDataUncached, ["map-data-de"], { revalidate: 86400 })
const getNLCached = unstable_cache(getNLMapDataUncached, ["map-data-nl"], { revalidate: 86400 })
const getCACached = unstable_cache(getCAMapDataUncached, ["map-data-ca"], { revalidate: 86400 })

export async function getAUMapData(): Promise<AUMapData> { return getAUCached() }
export async function getUSMapData(): Promise<USMapData> { return getUSCached() }
export async function getUKMapData(): Promise<UKMapData> { return getUKCached() }
export async function getDEMapData(): Promise<DEMapData> { return getDECached() }
export async function getNLMapData(): Promise<NLMapData> { return getNLCached() }
export async function getCAMapData(): Promise<CAMapData> { return getCACached() }

export async function getMapData(): Promise<MapData> {
  // /map is already force-static with a 24h ISR window. The complete map
  // payload is larger than Next's 2 MB data-cache item limit, so wrapping it
  // in unstable_cache causes runtime cache failures. Keep country-level
  // caches above; let the page-level ISR cache the rendered Maps route.
  return getMapDataUncached()
}
