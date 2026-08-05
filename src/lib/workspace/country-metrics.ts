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

const PUBLISHED_METRIC_TABLES: Record<string, readonly string[]> = {
  AU: ["report_metric_evidence_country", "report_metric_evidence_au"],
  CA: ["report_metric_evidence_country"],
  US: ["report_metric_evidence_country"],
  UK: ["report_metric_evidence_country"],
}

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  AU: "AUD",
  CA: "CAD",
  US: "USD",
  UK: "GBP",
}

function metricUnit(countryCode: string, metricKey: string) {
  const currency = CURRENCY_BY_COUNTRY[countryCode]
  if (!currency) return null

  if (
    metricKey === "full_time_annual_earnings_range" ||
    metricKey === "average_annual_salary" ||
    metricKey === "tuition_annual_low" ||
    metricKey === "tuition_annual_high"
  ) {
    return `${currency}/year`
  }
  if (metricKey === "national_minimum_hourly_wage") return `${currency}/hour`
  if (
    metricKey === "student_living_cost_monthly_range" ||
    metricKey.startsWith("student_living_cost_shared_monthly_")
  ) {
    return `${currency}/month`
  }
  if (metricKey === "visa_application_fee") return currency
  if (metricKey === "student_work_hours_limit") return "hours/week"

  return null
}

function sourceOrganisation(row: PublishedMetricRow) {
  if (row.source_url.includes("abs.gov.au")) return "Australian Bureau of Statistics"
  if (row.source_url.includes("fairwork.gov.au")) return "Fair Work Ombudsman"
  if (row.source_url.includes("studyaustralia.gov.au")) return "Study Australia"
  if (row.source_url.includes("canada.ca")) return "Government of Canada"
  if (row.source_url.includes("educanada.ca")) return "EduCanada"
  if (row.source_url.includes("campcareer.com/methodology/canada")) return "CampCareer"
  if (row.source_url.includes("bls.gov")) return "U.S. Bureau of Labor Statistics"
  if (row.source_url.includes("dol.gov")) return "U.S. Department of Labor"
  if (row.source_url.includes("collegeboard.org")) return "College Board"
  if (row.source_url.includes("travel.state.gov")) return "U.S. Department of State"
  if (row.source_url.includes("studyinthestates.dhs.gov")) return "U.S. Department of Homeland Security"
  if (row.source_url.includes("ons.gov.uk")) return "Office for National Statistics"
  if (row.source_url.includes("britishcouncil.org")) return "British Council"
  if (row.source_url.includes("gov.uk")) return "UK Government"
  return row.source_name
}

async function readPublishedRows(code: string): Promise<PublishedMetricRow[]> {
  const tables = PUBLISHED_METRIC_TABLES[code] ?? []

  for (const [index, table] of tables.entries()) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(
        "id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence"
      )
      .eq("scope_type", "country")
      .eq("scope_id", code)
      .eq("review_status", "verified")
      .in("metric_key", [...COUNTRY_METRIC_KEYS])
      .order("last_verified_at", { ascending: false, nullsFirst: false })

    if (!error) return (data ?? []) as PublishedMetricRow[]

    const hasFallback = index < tables.length - 1
    if (!hasFallback) {
      console.error(`[country-metrics] ${code} published metric query failed:`, error)
    }
  }

  return []
}

export async function getCountryMetrics(countryCode: string): Promise<CountryMetrics> {
  const code = countryCode.trim().toUpperCase()
  if (!PUBLISHED_METRIC_TABLES[code]) return { sources: [] }

  const rows = await readPublishedRows(code)
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
