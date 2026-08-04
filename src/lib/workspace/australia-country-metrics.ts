import "server-only"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const AUSTRALIA_COUNTRY_METRIC_KEYS = [
  "average_full_time_annual_earnings",
  "average_full_time_weekly_earnings",
  "national_minimum_hourly_wage",
  "national_minimum_weekly_wage",
  "national_minimum_casual_hourly_wage",
  "student_living_cost_shared_monthly_average",
  "student_living_cost_shared_monthly_low",
  "student_living_cost_shared_monthly_high",
  "student_living_cost_shared_weekly_average",
  "shared_room_rent_weekly_average",
] as const

export type AustraliaCountryMetricKey = (typeof AUSTRALIA_COUNTRY_METRIC_KEYS)[number]

export type AustraliaCountryMetric = {
  metricKey: AustraliaCountryMetricKey
  amount: number
  currency: string
  sourceName: string
  sourceUrl: string
  dataAsOf: string
  confidence: string
  evidenceKind: string
}

export type AustraliaCountryMetrics = Partial<
  Record<AustraliaCountryMetricKey, AustraliaCountryMetric>
>

type MetricRow = {
  metric_key: string
  value: unknown
  source_name: string
  source_url: string
  data_as_of: string
  confidence: string
  evidence_kind: string
}

function parseMoneyValue(value: unknown): { amount: number; currency: string } | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  const amount = record.amount
  const currency = record.currency
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null
  if (typeof currency !== "string" || !currency) return null
  return { amount, currency }
}

function isMetricKey(value: string): value is AustraliaCountryMetricKey {
  return (AUSTRALIA_COUNTRY_METRIC_KEYS as readonly string[]).includes(value)
}

export async function getAustraliaCountryMetrics(): Promise<AustraliaCountryMetrics> {
  const { data, error } = await supabaseAdmin
    .from("report_metric_evidence_au")
    .select(
      "metric_key, value, source_name, source_url, data_as_of, confidence, evidence_kind"
    )
    .eq("scope_type", "country")
    .eq("scope_id", "AU")
    .eq("review_status", "verified")
    .in("metric_key", [...AUSTRALIA_COUNTRY_METRIC_KEYS])

  if (error) {
    console.error("[australia-country-metrics] query failed:", error)
    return {}
  }

  const result: AustraliaCountryMetrics = {}
  for (const row of (data ?? []) as MetricRow[]) {
    if (!isMetricKey(row.metric_key)) continue
    const money = parseMoneyValue(row.value)
    if (!money) continue
    result[row.metric_key] = {
      metricKey: row.metric_key,
      amount: money.amount,
      currency: money.currency,
      sourceName: row.source_name,
      sourceUrl: row.source_url,
      dataAsOf: row.data_as_of,
      confidence: row.confidence,
      evidenceKind: row.evidence_kind,
    }
  }

  return result
}
