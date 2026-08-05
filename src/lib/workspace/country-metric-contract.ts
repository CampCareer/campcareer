export const COUNTRY_DISPLAY_METRIC_KEYS = [
  "full_time_annual_earnings_range",
  "student_living_cost_monthly_range",
  "national_minimum_hourly_wage",
  "student_living_cost_shared_monthly_low",
  "student_living_cost_shared_monthly_average",
  "student_living_cost_shared_monthly_high",
] as const

export const COUNTRY_CALCULATION_METRIC_KEYS = [
  "average_annual_salary",
  "tuition_annual_low",
  "tuition_annual_high",
  "visa_application_fee",
  "student_work_hours_limit",
] as const

export const COUNTRY_METRIC_KEYS = [
  ...COUNTRY_DISPLAY_METRIC_KEYS,
  ...COUNTRY_CALCULATION_METRIC_KEYS,
] as const

export type CountryMetricKey = (typeof COUNTRY_METRIC_KEYS)[number]

export type CountryMetricRecord = {
  sourceSnapshotId: string
  metricKey: string
  value: unknown
  unit: string | null
  confidence: string
  verifiedAt: string | null
  effectiveFrom: string | null
}

export type CountryMetricSnapshotRecord = {
  id: string
  sourceId: string
  sourceUrl: string
  dataAsOf: string | null
}

export type CountryMetricSourceRecord = {
  id: string
  organisationName: string
  sourceName: string
}

export type CountryMetricSource = {
  key: string
  organisationName: string
  sourceName: string
  url: string
  dataAsOf: string | null
  verifiedAt: string | null
}

export type CountryMoneyRange = {
  low: number
  high: number
  rankingValue: number
  currency: string
  unit: string
  basis: string | null
  scenario: string | null
  confidence: string
  source: CountryMetricSource | null
}

export type CountryMoneyPoint = {
  amount: number
  currency: string
  unit: string
  confidence: string
  source: CountryMetricSource | null
}

export type CountryMetrics = {
  salaryRange?: CountryMoneyRange
  livingCostRange?: CountryMoneyRange
  minimumHourlyWage?: CountryMoneyPoint
  sources: CountryMetricSource[]
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function sourceFor(
  metric: CountryMetricRecord,
  snapshots: Map<string, CountryMetricSnapshotRecord>,
  sources: Map<string, CountryMetricSourceRecord>
): CountryMetricSource | null {
  const snapshot = snapshots.get(metric.sourceSnapshotId)
  if (!snapshot) return null
  const source = sources.get(snapshot.sourceId)
  if (!source) return null

  return {
    key: `${source.id}:${snapshot.id}`,
    organisationName: source.organisationName,
    sourceName: source.sourceName,
    url: snapshot.sourceUrl,
    dataAsOf: snapshot.dataAsOf,
    verifiedAt: metric.verifiedAt,
  }
}

function parseRange(
  metric: CountryMetricRecord | undefined,
  snapshots: Map<string, CountryMetricSnapshotRecord>,
  sources: Map<string, CountryMetricSourceRecord>
): CountryMoneyRange | undefined {
  if (!metric) return undefined
  const value = asRecord(metric.value)
  if (!value) return undefined

  const low = finiteNumber(value.low)
  const high = finiteNumber(value.high)
  const rankingValue = finiteNumber(value.ranking_value)
  const currency = nonEmptyString(value.currency)
  if (low === null || high === null || rankingValue === null || !currency || low > high) {
    return undefined
  }

  return {
    low,
    high,
    rankingValue,
    currency,
    unit: metric.unit ?? "",
    basis: nonEmptyString(value.basis) ?? nonEmptyString(value.measure_type),
    scenario: nonEmptyString(value.scenario),
    confidence: metric.confidence,
    source: sourceFor(metric, snapshots, sources),
  }
}

function parsePoint(
  metric: CountryMetricRecord | undefined,
  snapshots: Map<string, CountryMetricSnapshotRecord>,
  sources: Map<string, CountryMetricSourceRecord>
): CountryMoneyPoint | undefined {
  if (!metric) return undefined
  const value = asRecord(metric.value)
  if (!value) return undefined
  const amount = finiteNumber(value.amount)
  const currency = nonEmptyString(value.currency)
  if (amount === null || !currency) return undefined

  return {
    amount,
    currency,
    unit: metric.unit ?? "",
    confidence: metric.confidence,
    source: sourceFor(metric, snapshots, sources),
  }
}

function fallbackLivingRange(
  metrics: Map<string, CountryMetricRecord>,
  snapshots: Map<string, CountryMetricSnapshotRecord>,
  sources: Map<string, CountryMetricSourceRecord>
): CountryMoneyRange | undefined {
  const lowMetric = metrics.get("student_living_cost_shared_monthly_low")
  const averageMetric = metrics.get("student_living_cost_shared_monthly_average")
  const highMetric = metrics.get("student_living_cost_shared_monthly_high")
  if (!lowMetric || !averageMetric || !highMetric) return undefined

  const lowValue = asRecord(lowMetric.value)
  const averageValue = asRecord(averageMetric.value)
  const highValue = asRecord(highMetric.value)
  const low = finiteNumber(lowValue?.amount)
  const rankingValue = finiteNumber(averageValue?.amount)
  const high = finiteNumber(highValue?.amount)
  const currency = nonEmptyString(averageValue?.currency)
  if (low === null || rankingValue === null || high === null || !currency || low > high) {
    return undefined
  }

  return {
    low,
    high,
    rankingValue,
    currency,
    unit: averageMetric.unit ?? "AUD/month",
    basis: "scenario_range",
    scenario: nonEmptyString(averageValue?.scenario),
    confidence: averageMetric.confidence,
    source: sourceFor(averageMetric, snapshots, sources),
  }
}

export function buildCountryMetrics(
  metricRecords: CountryMetricRecord[],
  snapshotRecords: CountryMetricSnapshotRecord[],
  sourceRecords: CountryMetricSourceRecord[]
): CountryMetrics {
  const metrics = new Map<string, CountryMetricRecord>()
  for (const metric of metricRecords) {
    if (!metrics.has(metric.metricKey)) metrics.set(metric.metricKey, metric)
  }
  const snapshots = new Map(snapshotRecords.map((snapshot) => [snapshot.id, snapshot]))
  const sources = new Map(sourceRecords.map((source) => [source.id, source]))

  const salaryRange = parseRange(metrics.get("full_time_annual_earnings_range"), snapshots, sources)
  const livingCostRange =
    parseRange(metrics.get("student_living_cost_monthly_range"), snapshots, sources) ??
    fallbackLivingRange(metrics, snapshots, sources)
  const minimumHourlyWage = parsePoint(
    metrics.get("national_minimum_hourly_wage"),
    snapshots,
    sources
  )

  const usedSources = [salaryRange?.source, livingCostRange?.source, minimumHourlyWage?.source]
    .filter((source): source is CountryMetricSource => Boolean(source))
  const dedupedSources = [...new Map(usedSources.map((source) => [source.url, source])).values()]

  return {
    salaryRange,
    livingCostRange,
    minimumHourlyWage,
    sources: dedupedSources,
  }
}

function compactAmount(amount: number) {
  if (Math.abs(amount) < 1_000) return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)
  const digits = Math.abs(amount) < 10_000 ? 1 : 0
  return `${(amount / 1_000).toFixed(digits).replace(/\.0$/, "")}k`
}

export function formatMoneyRange(range: CountryMoneyRange | undefined) {
  if (!range) return "—"
  return `${range.currency} ${compactAmount(range.low)}–${compactAmount(range.high)}`
}

export function formatRankingValue(range: CountryMoneyRange | undefined) {
  if (!range) return "—"
  return `${range.currency} ${compactAmount(range.rankingValue)}`
}
