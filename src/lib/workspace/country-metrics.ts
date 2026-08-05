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

type MetricRow = {
  source_snapshot_id: string
  metric_key: string
  value: unknown
  unit: string | null
  confidence: string
  reviewed_at: string | null
  effective_from: string | null
}

type SnapshotRow = {
  id: string
  source_id: string
  source_url: string
  data_as_of: string | null
}

type SourceRow = {
  id: string
  organisation_name: string
  source_name: string
}

export async function getCountryMetrics(countryCode: string): Promise<CountryMetrics> {
  const code = countryCode.trim().toUpperCase()
  const { data: metricData, error: metricError } = await supabaseAdmin
    .schema("evidence")
    .from("metric_observations")
    .select(
      "source_snapshot_id, metric_key, value, unit, confidence, reviewed_at, effective_from"
    )
    .eq("scope_type", "country")
    .eq("scope_id", code)
    .eq("review_status", "verified")
    .in("metric_key", [...COUNTRY_METRIC_KEYS])
    .order("reviewed_at", { ascending: false, nullsFirst: false })

  if (metricError) {
    console.error(`[country-metrics] ${code} metric query failed:`, metricError)
    return { sources: [] }
  }

  const metricRows = (metricData ?? []) as MetricRow[]
  const snapshotIds = [...new Set(metricRows.map((row) => row.source_snapshot_id))]
  let snapshotRows: SnapshotRow[] = []
  let sourceRows: SourceRow[] = []

  if (snapshotIds.length) {
    const { data: snapshotData, error: snapshotError } = await supabaseAdmin
      .schema("evidence")
      .from("source_snapshots")
      .select("id, source_id, source_url, data_as_of")
      .in("id", snapshotIds)

    if (snapshotError) {
      console.error(`[country-metrics] ${code} snapshot query failed:`, snapshotError)
    } else {
      snapshotRows = (snapshotData ?? []) as SnapshotRow[]
      const sourceIds = [...new Set(snapshotRows.map((row) => row.source_id))]
      if (sourceIds.length) {
        const { data: sourceData, error: sourceError } = await supabaseAdmin
          .schema("evidence")
          .from("sources")
          .select("id, organisation_name, source_name")
          .in("id", sourceIds)

        if (sourceError) {
          console.error(`[country-metrics] ${code} source query failed:`, sourceError)
        } else {
          sourceRows = (sourceData ?? []) as SourceRow[]
        }
      }
    }
  }

  const metrics: CountryMetricRecord[] = metricRows.map((row) => ({
    sourceSnapshotId: row.source_snapshot_id,
    metricKey: row.metric_key,
    value: row.value,
    unit: row.unit,
    confidence: row.confidence,
    verifiedAt: row.reviewed_at,
    effectiveFrom: row.effective_from,
  }))
  const snapshots: CountryMetricSnapshotRecord[] = snapshotRows.map((row) => ({
    id: row.id,
    sourceId: row.source_id,
    sourceUrl: row.source_url,
    dataAsOf: row.data_as_of,
  }))
  const sources: CountryMetricSourceRecord[] = sourceRows.map((row) => ({
    id: row.id,
    organisationName: row.organisation_name,
    sourceName: row.source_name,
  }))

  return buildCountryMetrics(metrics, snapshots, sources)
}
