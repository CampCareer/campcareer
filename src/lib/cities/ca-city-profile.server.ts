import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"

type CityRow = {
  city_id: string
  country_code: string
  slug: string
  name: string
  region: string
  scope_kind: string | null
  latitude: number | string | null
  longitude: number | string | null
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
}

type InstitutionRow = {
  city_id: string
  campus_id: string
  institution_id: string
  institution_name: string
  institution_type: string | null
  website_url: string | null
  campus_name: string
  locality: string | null
  region: string
}

type InstitutionSlugRow = {
  institution_id: string
  slug: string
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

export type CaCityCampus = {
  id: string
  name: string
  locality: string | null
}

export type CaCityInstitution = {
  id: string
  name: string
  type: string | null
  websiteUrl: string | null
  profilePath: string | null
  campuses: CaCityCampus[]
}

export type CaCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type CaCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "CA"
  countryName: "Canada"
  regionCode: string
  regionName: string
  scopeKind: string | null
  latitude: number | null
  longitude: number | null
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  population: {
    amount: number
    geography: string
    dataAsOf: string
  } | null
  livingCost: {
    low: number
    high: number
    currency: string
    period: string
    scenario: string | null
    evidenceKind: string
  } | null
  transport: {
    referenceAmount: number
    period: string
    currency: string
    referenceKind: string
    eligibilityRequired: boolean
    adultSingleFare: number | null
    evidenceKind: string
  } | null
  workRights: {
    hours: number
    period: string
    unlimitedDuringEligibleScheduledBreaks: boolean
    eligibilityConditionsApply: boolean
  } | null
  employmentSectors: string[]
  institutions: CaCityInstitution[]
  sources: CaCityMetricSource[]
}

const REGION_NAMES: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
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

function groupInstitutions(rows: InstitutionRow[], slugs: Map<string, string>): CaCityInstitution[] {
  const grouped = new Map<string, CaCityInstitution>()

  for (const row of rows) {
    const campus = { id: row.campus_id, name: row.campus_name, locality: row.locality }
    const existing = grouped.get(row.institution_id)
    if (existing) {
      existing.campuses.push(campus)
      continue
    }

    const slug = slugs.get(row.institution_id)
    grouped.set(row.institution_id, {
      id: row.institution_id,
      name: row.institution_name,
      type: row.institution_type,
      websiteUrl: row.website_url,
      profilePath: slug ? `/institutions/ca/${slug}` : null,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadCaCityProfile(slug: string): Promise<CaCityProfile | null> {
  const normalizedSlug = slug.trim().toLowerCase()
  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_ca_v1")
    .select(
      "city_id,country_code,slug,name,region,scope_kind,latitude,longitude,linked_campus_count,linked_institution_count,linked_program_count",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Canadian city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_ca_v1")
      .select(
        "city_id,campus_id,institution_id,institution_name,institution_type,website_url,campus_name,locality,region",
      )
      .eq("city_id", city.city_id)
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("geography_id", city.city_id)
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .order("metric_key", { ascending: true }),
  ])

  if (institutionResult.error) {
    throw new Error(`Unable to load Canadian city institutions: ${institutionResult.error.message}`)
  }
  if (metricResult.error) {
    throw new Error(`Unable to load Canadian city metrics: ${metricResult.error.message}`)
  }

  const institutionRows = (institutionResult.data ?? []) as InstitutionRow[]
  const institutionIds = [...new Set(institutionRows.map((row) => row.institution_id))]
  const institutionSlugs = new Map<string, string>()

  if (institutionIds.length > 0) {
    const { data: slugData, error: slugError } = await supabaseAdmin
      .from("institution_explorer_v1")
      .select("institution_id,slug")
      .eq("country_code", "CA")
      .in("institution_id", institutionIds)

    if (slugError) throw new Error(`Unable to load Canadian institution slugs: ${slugError.message}`)
    for (const row of (slugData ?? []) as InstitutionSlugRow[]) {
      if (row.slug) institutionSlugs.set(row.institution_id, row.slug)
    }
  }

  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))

  const populationRow = metrics.get("city_population")
  const populationValue = record(populationRow?.value)
  const populationAmount = numberValue(populationValue.amount)
  const populationGeography = stringValue(populationValue.geography)

  const livingRow = metrics.get("student_living_cost_monthly_range")
  const livingValue = record(livingRow?.value)
  const livingLow = numberValue(livingValue.low)
  const livingHigh = numberValue(livingValue.high)

  const transportRow =
    metrics.get("student_transport_reference") ?? metrics.get("student_transport_monthly_reference")
  const transportValue = record(transportRow?.value)
  const transportAmount = numberValue(transportValue.amount)

  const workRow = metrics.get("student_work_hours_week")
  const workValue = record(workRow?.value)
  const workHours = numberValue(workValue.hours)

  const sectorsRow = metrics.get("employment_focus_sectors")
  const sectorsValue = record(sectorsRow?.value)

  const sources = Array.from(
    new Map(
      metricRows.map((row) => [
        row.source_url,
        {
          name: row.source_name,
          url: row.source_url,
          dataAsOf: row.data_as_of,
          confidence: row.confidence,
        } satisfies CaCityMetricSource,
      ]),
    ).values(),
  )

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "CA",
    countryName: "Canada",
    regionCode: city.region,
    regionName: REGION_NAMES[city.region] ?? city.region,
    scopeKind: city.scope_kind,
    latitude: numberValue(city.latitude),
    longitude: numberValue(city.longitude),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    population:
      populationRow && populationAmount != null && populationGeography
        ? { amount: populationAmount, geography: populationGeography, dataAsOf: populationRow.data_as_of }
        : null,
    livingCost:
      livingRow && livingLow != null && livingHigh != null
        ? {
            low: livingLow,
            high: livingHigh,
            currency: stringValue(livingValue.currency) ?? "CAD",
            period: stringValue(livingValue.period) ?? "month",
            scenario: stringValue(livingValue.scenario),
            evidenceKind: livingRow.evidence_kind,
          }
        : null,
    transport:
      transportRow && transportAmount != null
        ? {
            referenceAmount: transportAmount,
            period: stringValue(transportValue.period) ?? "month",
            currency: stringValue(transportValue.currency) ?? "CAD",
            referenceKind: stringValue(transportValue.transport_kind) ?? "student_transport_reference",
            eligibilityRequired: transportValue.eligibility_required === true,
            adultSingleFare:
              numberValue(transportValue.adult_single_fare) ?? numberValue(transportValue.adult_presto_single),
            evidenceKind: transportRow.evidence_kind,
          }
        : null,
    workRights:
      workRow && workHours != null
        ? {
            hours: workHours,
            period: stringValue(workValue.period) ?? "week",
            unlimitedDuringEligibleScheduledBreaks:
              workValue.unlimited_during_eligible_scheduled_breaks === true,
            eligibilityConditionsApply: workValue.eligibility_conditions_apply === true,
          }
        : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    institutions: groupInstitutions(institutionRows, institutionSlugs),
    sources,
  }
}

export const getCaCityProfile = cache(loadCaCityProfile)
