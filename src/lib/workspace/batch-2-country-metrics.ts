import "server-only"
import { supabaseAdmin } from "@/lib/supabase-admin"
import {
  buildCountryMetrics,
  COUNTRY_METRIC_KEYS,
  type CountryMetricRecord,
  type CountryMetrics,
  type CountryMetricSnapshotRecord,
  type CountryMetricSourceRecord,
} from "./country-metric-contract"

type PublishedMetricRow = {
  id: string
  metric_key: string
  value: unknown
  source_name: string
  source_url: string
  data_as_of: string | null
  last_verified_at: string | null
  confidence: string
}

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  ES: "EUR",
  SG: "SGD",
  KR: "KRW",
  JP: "JPY",
  NZ: "NZD",
}

function metricUnit(countryCode: string, metricKey: string) {
  const currency = CURRENCY_BY_COUNTRY[countryCode]
  if (!currency) return null
  if (["full_time_annual_earnings_range", "average_annual_salary", "tuition_annual_low", "tuition_annual_high"].includes(metricKey)) return `${currency}/year`
  if (metricKey === "national_minimum_hourly_wage") return `${currency}/hour`
  if (metricKey === "student_living_cost_monthly_range") return `${currency}/month`
  if (metricKey === "visa_application_fee") return currency
  if (metricKey === "student_work_hours_limit") return "hours/week"
  return null
}

function sourceOrganisation(row: PublishedMetricRow) {
  const url = row.source_url
  if (url.includes("ine.es")) return "Instituto Nacional de Estadística"
  if (url.includes("sepie.es")) return "SEPIE"
  if (url.includes("inclusion.gob.es")) return "Spanish Ministry of Inclusion"
  if (url.includes("boe.es")) return "Boletín Oficial del Estado"
  if (url.includes("exteriores.gob.es")) return "Spanish Ministry of Foreign Affairs"
  if (url.includes("mom.gov.sg")) return "Singapore Ministry of Manpower"
  if (url.includes("ica.gov.sg")) return "Singapore Immigration & Checkpoints Authority"
  if (url.includes("nus.edu.sg")) return "National University of Singapore"
  if (url.includes("ntu.edu.sg")) return "Nanyang Technological University"
  if (url.includes("sutd.edu.sg")) return "Singapore University of Technology and Design"
  if (url.includes("moel.go.kr") || url.includes("laborstat.moel.go.kr")) return "Korean Ministry of Employment and Labour"
  if (url.includes("minimumwage.go.kr")) return "Korean Minimum Wage Commission"
  if (url.includes("studyinkorea.go.kr")) return "Study in Korea"
  if (url.includes("mofa.go.kr")) return "Korean Ministry of Foreign Affairs"
  if (url.includes("mhlw.go.jp")) return "Japan Ministry of Health, Labour and Welfare"
  if (url.includes("nta.go.jp")) return "Japan National Tax Agency"
  if (url.includes("studyinjapan.go.jp")) return "Study in Japan"
  if (url.includes("mofa.go.jp")) return "Japan Ministry of Foreign Affairs"
  if (url.includes("parliament.nz")) return "New Zealand Parliamentary Library"
  if (url.includes("employment.govt.nz")) return "Employment New Zealand"
  if (url.includes("immigration.govt.nz")) return "Immigration New Zealand"
  if (url.includes("studywithnewzealand.govt.nz")) return "Study with New Zealand"
  return row.source_name
}

export async function getBatch2CountryMetrics(countryCode: string): Promise<CountryMetrics> {
  const code = countryCode.trim().toUpperCase()
  if (!CURRENCY_BY_COUNTRY[code]) return { sources: [] }

  const { data, error } = await supabaseAdmin
    .from("report_metric_evidence_country")
    .select("id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence")
    .eq("scope_type", "country")
    .eq("scope_id", code)
    .eq("review_status", "verified")
    .in("metric_key", [...COUNTRY_METRIC_KEYS])
    .order("last_verified_at", { ascending: false, nullsFirst: false })

  if (error) {
    console.error(`[batch-2-country-metrics] ${code} query failed:`, error)
    return { sources: [] }
  }

  const rows = (data ?? []) as PublishedMetricRow[]
  const metrics: CountryMetricRecord[] = rows.map((row) => ({
    sourceSnapshotId: row.id,
    metricKey: row.metric_key,
    value: row.value,
    unit: metricUnit(code, row.metric_key),
    confidence: row.confidence,
    verifiedAt: row.last_verified_at,
    effectiveFrom: row.data_as_of,
  }))
  const snapshots: CountryMetricSnapshotRecord[] = rows.map((row) => ({
    id: row.id,
    sourceId: row.id,
    sourceUrl: row.source_url,
    dataAsOf: row.data_as_of,
  }))
  const sources: CountryMetricSourceRecord[] = rows.map((row) => ({
    id: row.id,
    organisationName: sourceOrganisation(row),
    sourceName: row.source_name,
  }))

  return buildCountryMetrics(metrics, snapshots, sources)
}
