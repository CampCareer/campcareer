import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedUsCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

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
  institution_slug: string | null
  us_unit_id: string | null
  campus_name: string
  locality: string | null
  region: string
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

export type UsCityCampus = {
  id: string
  name: string
  locality: string | null
}

export type UsCityInstitution = {
  id: string
  name: string
  type: string | null
  websiteUrl: string | null
  profilePath: string | null
  usUnitId: string | null
  campuses: UsCityCampus[]
}

export type UsCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type UsCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "US"
  countryName: "United States"
  regionCode: string
  regionName: string
  scopeKind: string | null
  latitude: number | null
  longitude: number | null
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  programmeCoverage: {
    status: "catalogue_gap"
    label: string
    detail: string
  }
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
    summerReference: boolean
  } | null
  transport: {
    referenceAmount: number
    period: string
    currency: string
    referenceKind: string
    eligibilityRequired: boolean
    baseFare: number | null
    dailyCap: number | null
    monthlyEquivalent: number | null
    evidenceKind: string
  } | null
  workRights: {
    hours: number
    period: string
    workContext: string
    fullTimeDuringEligibleBreaks: boolean
    offCampusRequiresSeparateAuthorization: boolean
    eligibilityConditionsApply: boolean
  } | null
  employmentSectors: string[]
  institutions: UsCityInstitution[]
  sources: UsCityMetricSource[]
}

const REGION_NAMES: Record<string, string> = {
  AZ: "Arizona",
  CA: "California",
  IL: "Illinois",
  MA: "Massachusetts",
  NY: "New York",
  PA: "Pennsylvania",
  WA: "Washington",
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

function groupInstitutions(rows: InstitutionRow[]): UsCityInstitution[] {
  const grouped = new Map<string, UsCityInstitution>()

  for (const row of rows) {
    const campus = { id: row.campus_id, name: row.campus_name, locality: row.locality }
    const existing = grouped.get(row.institution_id)
    if (existing) {
      existing.campuses.push(campus)
      continue
    }

    grouped.set(row.institution_id, {
      id: row.institution_id,
      name: row.institution_name,
      type: row.institution_type,
      websiteUrl: row.website_url,
      profilePath: row.institution_slug ? `/institutions/us/${row.institution_slug}` : null,
      usUnitId: row.us_unit_id,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadUsCityProfile(slug: string): Promise<UsCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedUsCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_us_v1")
    .select(
      "city_id,country_code,slug,name,region,scope_kind,latitude,longitude,linked_campus_count,linked_institution_count,linked_program_count",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load U.S. city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_us_v1")
      .select(
        "city_id,campus_id,institution_id,institution_name,institution_type,website_url,institution_slug,us_unit_id,campus_name,locality,region",
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
    throw new Error(`Unable to load U.S. city institutions: ${institutionResult.error.message}`)
  }
  if (metricResult.error) {
    throw new Error(`Unable to load U.S. city metrics: ${metricResult.error.message}`)
  }

  const institutionRows = (institutionResult.data ?? []) as InstitutionRow[]
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

  const transportRow = metrics.get("student_transport_reference")
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
        } satisfies UsCityMetricSource,
      ]),
    ).values(),
  )

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "US",
    countryName: "United States",
    regionCode: city.region,
    regionName: REGION_NAMES[city.region] ?? city.region,
    scopeKind: city.scope_kind,
    latitude: numberValue(city.latitude),
    longitude: numberValue(city.longitude),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    programmeCoverage: {
      status: "catalogue_gap",
      label: "U.S. programme catalogue coverage pending",
      detail:
        "CampCareer has not yet published a canonical U.S. programme catalogue. Institution presence is not used to infer programme delivery.",
    },
    population:
      populationRow && populationAmount != null && populationGeography
        ? { amount: populationAmount, geography: populationGeography, dataAsOf: populationRow.data_as_of }
        : null,
    livingCost:
      livingRow && livingLow != null && livingHigh != null
        ? {
            low: livingLow,
            high: livingHigh,
            currency: stringValue(livingValue.currency) ?? "USD",
            period: stringValue(livingValue.period) ?? "month",
            scenario: stringValue(livingValue.scenario),
            evidenceKind: livingRow.evidence_kind,
            summerReference: livingValue.summer_reference === true,
          }
        : null,
    transport:
      transportRow && transportAmount != null
        ? {
            referenceAmount: transportAmount,
            period: stringValue(transportValue.period) ?? "published_period",
            currency: stringValue(transportValue.currency) ?? "USD",
            referenceKind: stringValue(transportValue.transport_kind) ?? "student_transport_reference",
            eligibilityRequired: transportValue.eligibility_required === true,
            baseFare: numberValue(transportValue.base_fare),
            dailyCap: numberValue(transportValue.daily_cap),
            monthlyEquivalent: numberValue(transportValue.monthly_equivalent),
            evidenceKind: transportRow.evidence_kind,
          }
        : null,
    workRights:
      workRow && workHours != null
        ? {
            hours: workHours,
            period: stringValue(workValue.period) ?? "week_during_academic_sessions",
            workContext: stringValue(workValue.work_context) ?? "f1_on_campus",
            fullTimeDuringEligibleBreaks: workValue.full_time_during_eligible_breaks === true,
            offCampusRequiresSeparateAuthorization:
              workValue.off_campus_requires_separate_authorization === true,
            eligibilityConditionsApply: workValue.eligibility_conditions_apply === true,
          }
        : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    institutions: groupInstitutions(institutionRows),
    sources,
  }
}

export const getUsCityProfile = cache(loadUsCityProfile)
