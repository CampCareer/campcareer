import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedBeCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  country_code: string
  slug: string
  name: string
  region: string
  scope_kind: string
  study_destination_scope: string
  population_geography_contract: string
  population_geography_label: string
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
  institution_coverage_status: string
  programme_coverage_status: string
}

type InstitutionRow = {
  city_id: string
  campus_id: string
  institution_id: string
  institution_name: string
  institution_slug: string
  official_identity: string
  identity_source_url: string
  website_url: string
  campus_name: string
  campus_city: string
  locality: string | null
  region: string
  address_line: string | null
  postal_code: string | null
  location_source_url: string
  location_quality: string
  record_scope: string
}

type MetricRow = {
  metric_key: string
  value: unknown
  source_name: string
  source_url: string
  data_as_of: string
  confidence: string
  evidence_kind: string
}

export type BeCityInstitution = {
  id: string
  name: string
  slug: string
  websiteUrl: string
  officialIdentity: string
  identitySourceUrl: string
  campuses: Array<{
    id: string
    name: string
    city: string
    locality: string | null
    addressLine: string | null
    postalCode: string | null
    sourceUrl: string
  }>
}

export type BeCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "BE"
  countryName: "Belgium"
  region: string
  scopeKind: string
  studyDestinationScope: string
  populationGeographyContract: string
  populationGeographyLabel: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  institutionCoverageStatus: string
  programmeCoverage: { status: "verification_pending"; label: string; detail: string }
  population: { amount: number; geography: string; geographyKind: string | null; refnisCode: string | null; dataAsOf: string } | null
  livingCost: { low: number; high: number; currency: string; period: string; referenceKind: string | null; note: string | null; confidence: string } | null
  transport: { amount: number; period: string; currency: string; referenceKind: string; eligibilityConditionsApply: boolean; sourceNativePeriod: boolean } | null
  workRights: { hoursSchoolPeriod: number; period: string; schoolHolidaysUnlimited: boolean; compatibilityWithStudiesRequired: boolean; eligibilityConditionsApply: boolean; nationalRule: boolean; residenceContext: string | null; note: string | null } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: BeCityInstitution[]
  sources: Array<{ name: string; url: string; dataAsOf: string; confidence: string }>
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function scopeLabel(city: CityRow) {
  if (city.study_destination_scope === "brussels_capital_region") return "Brussels-Capital Region"
  if (city.study_destination_scope === "louvain_la_neuve_study_destination") {
    return "Louvain-la-Neuve study destination"
  }
  return `${city.name} municipality`
}

function groupInstitutions(rows: InstitutionRow[]): BeCityInstitution[] {
  const grouped = new Map<string, BeCityInstitution>()
  for (const row of rows) {
    const campus = {
      id: row.campus_id,
      name: row.campus_name,
      city: row.campus_city,
      locality: row.locality,
      addressLine: row.address_line,
      postalCode: row.postal_code,
      sourceUrl: row.location_source_url,
    }
    const existing = grouped.get(row.institution_id)
    if (existing) existing.campuses.push(campus)
    else grouped.set(row.institution_id, {
      id: row.institution_id,
      name: row.institution_name,
      slug: row.institution_slug,
      websiteUrl: row.website_url,
      officialIdentity: row.official_identity,
      identitySourceUrl: row.identity_source_url,
      campuses: [campus],
    })
  }
  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadBeCityProfile(slug: string): Promise<BeCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedBeCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_be_v1")
    .select("city_id,country_code,slug,name,region,scope_kind,study_destination_scope,population_geography_contract,population_geography_label,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,programme_coverage_status")
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Belgium city: ${cityError.message}`)
  if (!cityData) return null
  const city = cityData as CityRow

  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_be_v1")
      .select("city_id,campus_id,institution_id,institution_name,institution_slug,official_identity,identity_source_url,website_url,campus_name,campus_city,locality,region,address_line,postal_code,location_source_url,location_quality,record_scope")
      .eq("city_id", city.city_id)
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("geography_id", city.city_id)
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .in("metric_key", ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]),
  ])

  if (institutionResult.error) throw new Error(`Unable to load Belgium city institutions: ${institutionResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load Belgium city metrics: ${metricResult.error.message}`)

  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))
  const populationRow = metrics.get("city_population")
  const populationValue = record(populationRow?.value)
  const livingRow = metrics.get("student_living_cost_monthly_range")
  const livingValue = record(livingRow?.value)
  const transportRow = metrics.get("student_transport_reference")
  const transportValue = record(transportRow?.value)
  const workRow = metrics.get("student_work_hours_week")
  const workValue = record(workRow?.value)
  const sectorsValue = record(metrics.get("employment_focus_sectors")?.value)

  const populationAmount = numberValue(populationValue.amount)
  const livingLow = numberValue(livingValue.low)
  const livingHigh = numberValue(livingValue.high)
  const transportAmount = numberValue(transportValue.amount)
  const workHours = numberValue(workValue.hours_school_period)

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "BE",
    countryName: "Belgium",
    region: city.region,
    scopeKind: city.scope_kind,
    studyDestinationScope: city.study_destination_scope,
    populationGeographyContract: city.population_geography_contract,
    populationGeographyLabel: city.population_geography_label,
    scopeLabel: scopeLabel(city),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    institutionCoverageStatus: city.institution_coverage_status,
    programmeCoverage: {
      status: "verification_pending",
      label: "Belgium programme delivery verification pending",
      detail: "CampCareer has 188 verified Belgium programme offering records, but their inherited primary-location relationships do not prove delivery at the Phase 3 verified teaching locations. Institution or campus presence is never used to infer city programme availability.",
    },
    population: populationRow && populationAmount != null ? {
      amount: populationAmount,
      geography: stringValue(populationValue.geography) ?? city.population_geography_label,
      geographyKind: stringValue(populationValue.geography_kind),
      refnisCode: stringValue(populationValue.refnis_code),
      dataAsOf: populationRow.data_as_of,
    } : null,
    livingCost: livingRow && livingLow != null && livingHigh != null ? {
      low: livingLow,
      high: livingHigh,
      currency: stringValue(livingValue.currency) ?? "EUR",
      period: stringValue(livingValue.period) ?? "month",
      referenceKind: stringValue(livingValue.reference_kind),
      note: stringValue(livingValue.note),
      confidence: livingRow.confidence,
    } : null,
    transport: transportRow && transportAmount != null ? {
      amount: transportAmount,
      period: stringValue(transportValue.period) ?? "published_period",
      currency: stringValue(transportValue.currency) ?? "EUR",
      referenceKind: stringValue(transportValue.reference_kind) ?? "student_transport_reference",
      eligibilityConditionsApply: transportValue.eligibility_or_enrolment_conditions_apply === true,
      sourceNativePeriod: transportValue.source_native_period === true,
    } : null,
    workRights: workRow && workHours != null ? {
      hoursSchoolPeriod: workHours,
      period: stringValue(workValue.period) ?? "week",
      schoolHolidaysUnlimited: workValue.school_holidays_unlimited_under_student_residence_work_rule === true,
      compatibilityWithStudiesRequired: workValue.compatibility_with_studies_required === true,
      eligibilityConditionsApply: workValue.eligibility_conditions_apply === true,
      nationalRule: workValue.national_rule === true,
      residenceContext: stringValue(workValue.residence_context),
      note: stringValue(workValue.note),
    } : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    employmentSectorBasis: stringValue(sectorsValue.basis),
    institutions: groupInstitutions((institutionResult.data ?? []) as InstitutionRow[]),
    sources: Array.from(new Map(metricRows.map((row) => [row.source_url, { name: row.source_name, url: row.source_url, dataAsOf: row.data_as_of, confidence: row.confidence }])).values()),
  }
}

export const getBeCityProfile = cache(loadBeCityProfile)
