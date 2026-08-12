import "server-only"

import { supabase } from "@/lib/supabase"
import type {
  CareerDataFoundationResult,
  CareerFoundationBlocker,
  CareerFoundationEntryPoint,
  CareerFoundationNormalizedMetric,
  CareerFoundationRawObservation,
  CareerFoundationScoreComponent,
  CareerFoundationSource,
  FoundationComponentKey,
  FoundationMappingQuality,
  FoundationSourceType,
} from "./types"

type ResultRow = {
  profile_key: string
  country_code: string
  canonical_occupation_id: string
  currency: string
  source_checked_on: string
  official_taxonomy: string
  official_taxonomy_version: string
  official_code: string
  official_title: string
  mapping_relation: "exact" | "broader" | "narrower" | "composite" | "proxy"
  mapping_quality: "high" | "medium" | "low"
  mapping_rationale: string
  mapping_source_url: string
  mapping_verified_on: string
  snapshot_key: string
  formula_version: string
  required_component_count: number
  scored_components: number
  score_coverage_weight: number | string
  score_ready: boolean
  opportunity_score: number | string | null
  decision_ready: boolean
  publish_ready: boolean
  decision_readiness_reason: string
  score_explanation: string
  calculation_timestamp: string | null
}

type MappingRow = {
  mapping_key: string
  source_key: string
}

type RawRow = {
  observation_key: string
  metric_key: string
  source_key: string
  mapping_key: string | null
  reference_period: string
  as_of_date: string | null
  raw_value: unknown | null
  unit: string | null
  availability: "available" | "unavailable"
  reason: string | null
  directness: "direct" | "proxy"
  mapping_quality: FoundationMappingQuality
  proxy_reason: string | null
  source_type: FoundationSourceType
  quality: "high" | "medium" | "low"
  confidence: number | string
  last_verified_on: string
  explanation: string
}

type NormalizedRow = {
  normalized_metric_key: string
  metric_key: string
  input_observation_refs: string[]
  normalized_value: number | string | null
  normalized_unit: string | null
  formula_version: string
  availability: "available" | "unavailable"
  reason: string | null
  directness: "direct" | "proxy"
  mapping_quality: FoundationMappingQuality
  proxy_reason: string | null
  source_type: FoundationSourceType
  calculated_at: string
  quality: "high" | "medium" | "low"
  confidence: number | string
  explanation: string
}

type ComponentRow = {
  component_key: FoundationComponentKey
  raw_input_refs: string[]
  normalized_metric_refs: string[]
  normalized_value: number | string | null
  formula_version: string
  score_value: number | string | null
  max_score: number | string
  availability: "available" | "unavailable"
  directness: "direct" | "proxy"
  mapping_quality: FoundationMappingQuality
  proxy_reason: string | null
  source_type: FoundationSourceType
  calculated_at: string
  quality: "high" | "medium" | "low"
  confidence: number | string
  explanation: string
  reason: string | null
}

type BlockerRow = {
  blocker_key: string
  blocker_type: CareerFoundationBlocker["blockerType"]
  severity: CareerFoundationBlocker["severity"]
  reason: string
  source_key: string
  official_source_url: string
  applicability_scope: string
  last_verified_on: string
}

type EntryPointRow = {
  entry_point_key: string
  entry_type: CareerFoundationEntryPoint["entryType"]
  label: string
  provider: string
  url: string
  source_key: string
  applicability_scope: string
  last_verified_on: string
  notes: string | null
  sort_order: number
}

type SourceRow = {
  source_key: string
  authority: string
  title: string
  url: string
  source_type: FoundationSourceType
  last_verified_on: string
  notes: string | null
}

const numberOrNull = (value: number | string | null | undefined) =>
  value == null ? null : Number(value)

const rawNumber = (observations: CareerFoundationRawObservation[], metricKey: string) => {
  const value = observations.find((item) => item.metricKey === metricKey && item.availability === "available")?.rawValue
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value)
  return null
}

const rawObservation = (observations: CareerFoundationRawObservation[], metricKey: string) =>
  observations.find((item) => item.metricKey === metricKey) ?? null

export async function getCareerDataFoundation({
  countryCode,
  careerId,
}: {
  countryCode: string
  careerId: string
}): Promise<CareerDataFoundationResult | null> {
  const country = countryCode.trim().toUpperCase()
  const resultQuery = await supabase
    .from("career_foundation_result_v1")
    .select("*")
    .eq("country_code", country)
    .eq("canonical_occupation_id", careerId)
    .maybeSingle()

  if (resultQuery.error) throw resultQuery.error
  if (!resultQuery.data) return null
  const result = resultQuery.data as ResultRow

  const [mappingQuery, rawQuery, normalizedQuery, componentQuery, blockerQuery, entryPointQuery] = await Promise.all([
    supabase.from("career_occupation_mappings").select("mapping_key,source_key").eq("profile_key", result.profile_key).eq("is_primary", true).single(),
    supabase.from("career_raw_observations").select("*").eq("profile_key", result.profile_key).order("observation_key"),
    supabase.from("career_normalized_metrics").select("*").eq("profile_key", result.profile_key).order("normalized_metric_key"),
    supabase.from("career_score_components").select("*").eq("snapshot_key", result.snapshot_key).order("component_key"),
    supabase.from("career_foundation_blockers").select("*").eq("profile_key", result.profile_key).eq("active", true).order("blocker_type"),
    supabase.from("career_foundation_entry_points").select("*").eq("profile_key", result.profile_key).order("sort_order"),
  ])

  for (const query of [mappingQuery, rawQuery, normalizedQuery, componentQuery, blockerQuery, entryPointQuery]) {
    if (query.error) throw query.error
  }

  const mappingRow = mappingQuery.data as MappingRow
  const rawObservations: CareerFoundationRawObservation[] = ((rawQuery.data ?? []) as RawRow[]).map((row) => ({
    observationKey: row.observation_key,
    metricKey: row.metric_key,
    sourceKey: row.source_key,
    mappingKey: row.mapping_key,
    referencePeriod: row.reference_period,
    asOfDate: row.as_of_date,
    rawValue: row.raw_value,
    unit: row.unit,
    availability: row.availability,
    reason: row.reason,
    directness: row.directness,
    mappingQuality: row.mapping_quality,
    proxyReason: row.proxy_reason,
    sourceType: row.source_type,
    quality: row.quality,
    confidence: Number(row.confidence),
    lastVerifiedOn: row.last_verified_on,
    explanation: row.explanation,
  }))

  const normalizedMetrics: CareerFoundationNormalizedMetric[] = ((normalizedQuery.data ?? []) as NormalizedRow[]).map((row) => ({
    normalizedMetricKey: row.normalized_metric_key,
    metricKey: row.metric_key,
    inputObservationRefs: row.input_observation_refs,
    normalizedValue: numberOrNull(row.normalized_value),
    normalizedUnit: row.normalized_unit,
    formulaVersion: row.formula_version,
    availability: row.availability,
    reason: row.reason,
    directness: row.directness,
    mappingQuality: row.mapping_quality,
    proxyReason: row.proxy_reason,
    sourceType: row.source_type,
    calculatedAt: row.calculated_at,
    quality: row.quality,
    confidence: Number(row.confidence),
    explanation: row.explanation,
  }))

  const scoreComponents: CareerFoundationScoreComponent[] = ((componentQuery.data ?? []) as ComponentRow[]).map((row) => ({
    componentKey: row.component_key,
    rawInputRefs: row.raw_input_refs,
    normalizedMetricRefs: row.normalized_metric_refs,
    normalizedValue: numberOrNull(row.normalized_value),
    formulaVersion: row.formula_version,
    scoreValue: numberOrNull(row.score_value),
    maxScore: Number(row.max_score),
    availability: row.availability,
    directness: row.directness,
    mappingQuality: row.mapping_quality,
    proxyReason: row.proxy_reason,
    sourceType: row.source_type,
    calculatedAt: row.calculated_at,
    quality: row.quality,
    confidence: Number(row.confidence),
    explanation: row.explanation,
    reason: row.reason,
  }))

  const blockers: CareerFoundationBlocker[] = ((blockerQuery.data ?? []) as BlockerRow[]).map((row) => ({
    blockerKey: row.blocker_key,
    blockerType: row.blocker_type,
    severity: row.severity,
    reason: row.reason,
    sourceKey: row.source_key,
    officialSourceUrl: row.official_source_url,
    applicabilityScope: row.applicability_scope,
    lastVerifiedOn: row.last_verified_on,
  }))

  const entryPoints: CareerFoundationEntryPoint[] = ((entryPointQuery.data ?? []) as EntryPointRow[]).map((row) => ({
    entryPointKey: row.entry_point_key,
    entryType: row.entry_type,
    label: row.label,
    provider: row.provider,
    url: row.url,
    sourceKey: row.source_key,
    applicabilityScope: row.applicability_scope,
    lastVerifiedOn: row.last_verified_on,
    notes: row.notes,
    sortOrder: row.sort_order,
  }))

  const sourceKeys = [...new Set([
    mappingRow.source_key,
    ...rawObservations.map((item) => item.sourceKey),
    ...blockers.map((item) => item.sourceKey),
    ...entryPoints.map((item) => item.sourceKey),
  ])]
  const sourceQuery = await supabase.from("career_official_sources").select("*").in("source_key", sourceKeys).order("source_key")
  if (sourceQuery.error) throw sourceQuery.error
  const sources: CareerFoundationSource[] = ((sourceQuery.data ?? []) as SourceRow[]).map((row) => ({
    sourceKey: row.source_key,
    authority: row.authority,
    title: row.title,
    url: row.url,
    sourceType: row.source_type,
    lastVerifiedOn: row.last_verified_on,
    notes: row.notes,
  }))

  const vacancy = rawObservation(rawObservations, "national_vacancy_intensity")
  const shortage = rawObservation(rawObservations, "national_shortage_signal")
  const employment = rawObservation(rawObservations, "employment_total")
  const annualWage = rawObservation(rawObservations, "median_annual_wage")
  const hourlyWage = rawObservation(rawObservations, "median_hourly_wage")
  const projectedEmployment = rawObservation(rawObservations, "projected_employment_total")
  const projectedGrowth = rawObservation(rawObservations, "projected_growth_pct")
  const annualOpenings = rawObservation(rawObservations, "projected_annual_openings")

  return {
    profileKey: result.profile_key,
    countryCode: result.country_code,
    canonicalOccupationId: result.canonical_occupation_id,
    currency: result.currency,
    sourceCheckedOn: result.source_checked_on,
    mapping: {
      mappingKey: mappingRow.mapping_key,
      canonicalOccupationId: result.canonical_occupation_id,
      countryCode: result.country_code,
      officialTaxonomy: result.official_taxonomy,
      officialTaxonomyVersion: result.official_taxonomy_version,
      officialCode: result.official_code,
      officialTitle: result.official_title,
      mappingRelation: result.mapping_relation,
      mappingQuality: result.mapping_quality,
      rationale: result.mapping_rationale,
      sourceKey: mappingRow.source_key,
      sourceUrl: result.mapping_source_url,
      verifiedOn: result.mapping_verified_on,
      isPrimary: true,
    },
    readiness: {
      decisionReady: result.decision_ready,
      scoreReady: result.score_ready,
      publishReady: result.publish_ready,
      decisionReason: result.decision_readiness_reason,
      scoredComponents: result.scored_components,
      requiredComponents: result.required_component_count,
      scoreCoverageWeight: Number(result.score_coverage_weight),
      formulaVersion: result.formula_version,
      calculationTimestamp: result.calculation_timestamp,
    },
    opportunityScore: numberOrNull(result.opportunity_score),
    scoreExplanation: result.score_explanation,
    decisionMetrics: {
      employmentTotal: rawNumber(rawObservations, "employment_total"),
      employmentReferencePeriod: employment?.referencePeriod ?? null,
      medianAnnualWage: rawNumber(rawObservations, "median_annual_wage"),
      medianHourlyWage: rawNumber(rawObservations, "median_hourly_wage"),
      wageReferencePeriod: annualWage?.referencePeriod ?? hourlyWage?.referencePeriod ?? null,
      projectedEmployment2034: rawNumber(rawObservations, "projected_employment_total"),
      projectedGrowthPct: rawNumber(rawObservations, "projected_growth_pct"),
      projectedAnnualOpenings: rawNumber(rawObservations, "projected_annual_openings"),
      projectionsReferencePeriod: annualOpenings?.referencePeriod ?? projectedGrowth?.referencePeriod ?? projectedEmployment?.referencePeriod ?? null,
      vacancyAvailability: vacancy?.availability ?? "unavailable",
      vacancyReason: vacancy?.reason ?? "No validated vacancy observation is available.",
      shortageAvailability: shortage?.availability ?? "unavailable",
      shortageReason: shortage?.reason ?? "No validated shortage observation is available.",
    },
    sources,
    rawObservations,
    normalizedMetrics,
    scoreComponents,
    blockers,
    entryPoints,
  }
}

export async function getFoundationCountriesForCareer(careerId: string) {
  const query = await supabase
    .from("career_foundation_result_v1")
    .select("country_code,decision_ready,score_ready,publish_ready,opportunity_score,official_title")
    .eq("canonical_occupation_id", careerId)
  if (query.error) throw query.error
  return (query.data ?? []).map((row) => ({
    countryCode: String(row.country_code),
    decisionReady: Boolean(row.decision_ready),
    scoreReady: Boolean(row.score_ready),
    publishReady: Boolean(row.publish_ready),
    opportunityScore: numberOrNull(row.opportunity_score as number | string | null),
    officialTitle: String(row.official_title),
  }))
}
