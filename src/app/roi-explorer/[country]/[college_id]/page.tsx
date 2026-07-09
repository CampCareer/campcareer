import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { fetchRoiData, VALID_COUNTRIES, type RoiCountry } from "@/lib/roi-query"
import { supabase } from "@/lib/supabase"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { CollegeDetailClient, type DetailRow } from "./CollegeDetailClient"
import nlCollegesRaw from "@/data/nl-colleges.json"
import nlCitiesRaw from "@/data/nl-cities.json"
import deCollegesRaw from "@/data/de-colleges.json"
import deCitiesRaw from "@/data/de-cities.json"

export const revalidate = 86400

const COLLEGES_TABLE: Record<RoiCountry, string> = {
  us: "colleges_us",
  au: "colleges_au",
  ca: "colleges_ca",
  uk: "colleges_uk",
  ie: "colleges_ie",
  de: "colleges_de",
  nl: "colleges_nl",
}

const CURRENCY_SYMBOL: Record<RoiCountry, string> = {
  us: "$", au: "A$", ca: "C$", uk: "£", ie: "€", de: "€", nl: "€",
}

const COUNTRY_LABEL: Record<RoiCountry, string> = {
  us: "United States",
  au: "Australia",
  ca: "Canada",
  uk: "United Kingdom",
  ie: "Ireland",
  de: "Germany",
  nl: "Netherlands",
}

// JSON-based fallback for DE/NL when Supabase roi_explorer views are not yet set up
const STUDENT_RENT = 0.45
const LIVING_COST = 0.4

function earningsByQSRank(qs: number | null): number {
  if (qs == null) return 45000
  if (qs <= 50) return 70000
  if (qs <= 100) return 65000
  if (qs <= 150) return 58000
  if (qs <= 200) return 53000
  if (qs <= 300) return 48000
  return 43000
}

function makeDetailRowsFromJSON(collegeId: string, country: 'nl' | 'de'): DetailRow[] {
  const raw = country === 'nl' ? nlCollegesRaw : deCollegesRaw
  const citiesRaw = country === 'nl' ? nlCitiesRaw : deCitiesRaw

  type CollegeJSON = {
    institution_id: string
    name: string
    city: string
    province?: string
    region?: string
    qs_rank: number | null
    website?: string | null
  }
  type CityJSON = {
    name: string
    province?: string
    region?: string
    rent_median?: number | null
    cost_of_living_index?: number | null
  }

  const college = (raw as CollegeJSON[]).find(c => c.institution_id === collegeId)
  if (!college) return []

  const state = college.province ?? college.region ?? ''
  const cityRents = new Map<string, { rent: number; col: number }>()
  for (const c of (citiesRaw as CityJSON[])) {
    cityRents.set(c.name, {
      rent: c.rent_median ?? 1000,
      col: c.cost_of_living_index ?? 65,
    })
  }
  const cityData = cityRents.get(college.city) ?? { rent: 1000, col: 65 }

  const earnings = earningsByQSRank(college.qs_rank)
  const annualRent = cityData.rent * STUDENT_RENT * 12
  const living = annualRent * LIVING_COST
  const netSalary = Math.max(0, earnings - annualRent - living)
  const tuition = 15000
  const duration = 3
  const gradRate = 0.82
  const totalTuition = tuition * duration
  const roiScore = totalTuition > 0 && netSalary > 0
    ? Math.round(netSalary * gradRate / totalTuition * 100 * 10) / 10
    : 0
  const payback = netSalary > 0
    ? Math.round(totalTuition / netSalary * 10) / 10
    : 0

  return [{
    college_id: college.institution_id,
    college_name: college.name,
    college_state: state,
    college_city: college.city,
    school_type: 'public',
    tuition,
    graduation_rate: gradRate,
    median_earnings: earnings,
    field_name: null,
    rent_median: cityData.rent,
    cost_of_living_index: cityData.col,
    duration_years: duration,
    roi_score: roiScore,
    net_salary: netSalary,
    payback_years: payback,
  }]
}

type Params = { country: string; college_id: string }

function parseCountry(raw: string): RoiCountry | null {
  return (VALID_COUNTRIES as readonly string[]).includes(raw) ? (raw as RoiCountry) : null
}

function getJSONFallbackCountry(country: RoiCountry): 'nl' | 'de' | null {
  return country === 'nl' ? 'nl' : country === 'de' ? 'de' : null
}

const getDetailRows = unstable_cache(async (country: RoiCountry, collegeId: string): Promise<DetailRow[]> => {
  const jsonCountry = getJSONFallbackCountry(country)
  try {
    const result = await fetchRoiData({
      country,
      collegeId,
      limit: 200,
      sort: "roi_score",
    })
    if (result.data.length > 0) return result.data as DetailRow[]
    // Fall back to JSON when Supabase view/table doesn't exist yet
    if (jsonCountry) return makeDetailRowsFromJSON(collegeId, jsonCountry)
    return []
  } catch (err) {
    console.error("[college-detail] fetch failed:", err)
    if (jsonCountry) return makeDetailRowsFromJSON(collegeId, jsonCountry)
    return []
  }
}, ["college-detail-rows"], { revalidate: 86400 })

const getWebsiteUrl = unstable_cache(async (country: RoiCountry, collegeId: string): Promise<string | null> => {
  const jsonCountry = getJSONFallbackCountry(country)
  try {
    const { data, error } = await supabase
      .from(COLLEGES_TABLE[country])
      .select("website_url")
      .eq("id", collegeId)
      .maybeSingle()
    if (error) throw error
    return data?.website_url ?? null
  } catch {
    // Fall back to JSON for DE/NL
    if (jsonCountry) {
      const raw = jsonCountry === 'nl' ? nlCollegesRaw : deCollegesRaw
      type CollegeJSON = { institution_id: string; website?: string | null }
      const college = (raw as CollegeJSON[]).find(c => c.institution_id === collegeId)
      return college?.website ?? null
    }
    return null
  }
}, ["college-detail-website"], { revalidate: 86400 })

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const country = parseCountry(params.country)
  if (!country) return { title: "Not Found" }

  const rows = await getDetailRows(country, params.college_id)
  if (rows.length === 0) return { title: "Not Found" }

  const best = rows[0]
  const sym = CURRENCY_SYMBOL[country]
  return pageMetadata({
    title: `${best.college_name} — ROI, Graduate Salary & Tuition`,
    description: `${best.college_name} (${COUNTRY_LABEL[country]}): ROI score ${best.roi_score.toFixed(1)}, median graduate earnings ${sym}${Math.round(best.median_earnings).toLocaleString()}, tuition ${sym}${Math.round(best.tuition).toLocaleString()}/yr, payback ${best.payback_years} yrs. Compare outcomes on CampCareer.`,
    path: `/roi-explorer/${country}/${params.college_id}`,
  })
}

export default async function CollegeDetailPage({ params }: { params: Params }) {
  const country = parseCountry(params.country)
  if (!country) notFound()

  const [rows, websiteUrl] = await Promise.all([
    getDetailRows(country, params.college_id),
    getWebsiteUrl(country, params.college_id),
  ])

  if (rows.length === 0) notFound()

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "ROI Explorer", path: "/roi-explorer" },
        { name: COUNTRY_LABEL[country], path: `/roi-explorer?country=${country}` },
        { name: rows[0].college_name, path: `/roi-explorer/${country}/${params.college_id}` },
      ])} />
      <CollegeDetailClient country={country} rows={rows} websiteUrl={websiteUrl} />
    </>
  )
}
