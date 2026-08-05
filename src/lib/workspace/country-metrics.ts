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

const PUBLISHED_METRIC_TABLES = {
  AU: "report_metric_evidence_au",
} as const

const METRIC_UNITS: Record<string, string> = {
  full_time_annual_earnings_range: "AUD/year",
  student_living_cost_monthly_range: "AUD/month",
  national_minimum_hourly_wage: "AUD/hour",
  student_living_cost_shared_monthly_low: "AUD/month",
  student_living_cost_shared_monthly_average: "AUD/month",
  student_living_cost_shared_monthly_high: "AUD/month",
}

function sourceOrganisation(row: PublishedMetricRow) {
  if (row.source_url.includes("abs.gov.au")) return "Australian Bureau of Statistics"
  if (row.source_url.includes("fairwork.gov.au")) return "Fair Work Ombudsman"
  if (row.source_url.includes("studyaustralia.gov.au")) return "Study Australia"
  return row.source_name
}

export async function getCountryMetrics(countryCode: string): Promise<CountryMetrics> {
  const code = countryCode.trim().toUpperCase()
  const table = PUBLISHED_METRIC_TABLES[code as keyof typeof PUBLISHED_METRIC_TABLES]

  if (!table) return { sources: [] }

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

  if (error) {
    console.error(`[country-metrics] ${code} published metric query failed:`, error)
    return { sources: [] }
  }

  const rows = (data ?? []) as PublishedMetricRow[]
  const metrics: CountryMetricRecord[] = rows.map((row) => ({
    sourceSnapshotId: row.id,
    metricKey: row.metric_key,
    value: row.value,
    unit: METRIC_UNITS[row.metric_key] ?? null,
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
