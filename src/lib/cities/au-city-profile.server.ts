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
  source_system: string | null
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
  legacy_provider_id: string | null
}

type MetricRow = {
  metric_key: string
  value: unknown
  source_name: string
  source_url: string
  data_as_of: string
  last_verified_at: string
  confidence: string
  evidence_kind: string
}

type LocationFreshnessRow = {
  location_source_last_modified: string | null
}

export type AuCityCampus = {
  id: string
  name: string
  locality: string | null
}

export type AuCityInstitution = {
  id: string
  name: string
  type: string | null
  websiteUrl: string | null
  campuses: AuCityCampus[]
}

export type CityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type AuCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "AU"
  countryName: "Australia"
  regionCode: string
  regionName: string
  scopeKind: string | null
  latitude: number | null
  longitude: number | null
  linkedCampusCount: number
  linkedInstitutionCount: number
  verifiedProgramCount: number
  population: {
    amount: number
    geography: string
    annualChange: number | null
    annualChangePct: number | null
    dataAsOf: string
  } | null
  livingCost: {
    low: number
    high: number
    currency: string
    period: string
    evidenceKind: string
  } | null
  transport: {
    weeklyReference: number
    currency: string
    referenceKind: string
    eligibilityRequired: boolean
    eligibleConcessionAmount: number | null
    annualPass: number | null
    evidenceKind: string
  } | null
  workRights: {
    hoursPerFortnight: number
    unrestrictedWhenCourseNotInSession: boolean
  } | null
  employmentSectors: string[]
  institutions: AuCityInstitution[]
  sources: CityMetricSource[]
}

const REGION_NAMES: Record<string, string> = {
  ACT: "Australian Capital Territory",
  NSW: "New South Wales",
  NT: "Northern Territory",
  QLD: "Queensland",
  SA: "South Australia",
  TAS: "Tasmania",
  VIC: "Victoria",
  WA: "Western Australia",
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

function groupInstitutions(rows: InstitutionRow[]): AuCityInstitution[] {
  const grouped = new Map<string, AuCityInstitution>()

  for (const row of rows) {
    const existing = grouped.get(row.institution_id)
    const campus = { id: row.campus_id, name: row.campus_name, locality: row.locality }
    if (existing) {
      existing.campuses.push(campus)
      continue
    }

    grouped.set(row.institution_id, {
      id: row.institution_id,
      name: row.institution_name,
      type: row.institution_type,
      websiteUrl: row.website_url,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadAuCityProfile(slug: string): Promise<AuCityProfile | null> {
  const normalizedSlug = slug.trim().toLowerCase()
  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_au_v1")
    .select(
      "city_id, country_code, slug, name, region, scope_kind, latitude, longitude, linked_campus_count, linked_institution_count, source_system",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Australian city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [
    { data: institutionData, error: institutionError },
    { data: metricData, error: metricError },
    { count: verifiedProgramCount, error: programCountError },
    { data: locationFreshnessData, error: locationFreshnessError },
  ] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_au_v1")
      .select(
        "city_id, campus_id, institution_id, institution_name, institution_type, website_url, campus_name, locality, region, legacy_provider_id",
      )
      .eq("city_id", city.city_id)
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select(
        "metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence, evidence_kind",
      )
      .eq("geography_id", city.city_id)
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .order("metric_key", { ascending: true }),
    supabaseAdmin
      .from("courses_au")
      .select("id", { count: "exact", head: true })
      .eq("cricos_status", "active")
      .contains("verified_city_slugs", [normalizedSlug]),
    supabaseAdmin
      .from("courses_au")
      .select("location_source_last_modified")
      .eq("cricos_status", "active")
      .contains("verified_city_slugs", [normalizedSlug])
      .not("location_source_last_modified", "is", null)
      .order("location_source_last_modified", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (institutionError) throw new Error(`Unable to load Australian city institutions: ${institutionError.message}`)
  if (metricError) throw new Error(`Unable to load Australian city metrics: ${metricError.message}`)
  if (programCountError) throw new Error(`Unable to count verified Australian city programs: ${programCountError.message}`)
  if (locationFreshnessError) throw new Error(`Unable to load Australian city location freshness: ${locationFreshnessError.message}`)

  const institutionRows = (institutionData ?? []) as InstitutionRow[]
  const metricRows = (metricData ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))
  const locationFreshness = locationFreshnessData as LocationFreshnessRow | null
  const cricosDataAsOf = locationFreshness?.location_source_last_modified?.slice(0, 10) ?? "2026-08-04"

  const populationRow = metrics.get("city_population")
  const populationValue = record(populationRow?.value)
  const populationAmount = numberValue(populationValue.amount)
  const populationGeography = stringValue(populationValue.geography)

  const livingRow = metrics.get("student_living_cost_monthly_range")
  const livingValue = record(livingRow?.value)
  const livingLow = numberValue(livingValue.low)
  const livingHigh = numberValue(livingValue.high)

  const transportRow = metrics.get("student_transport_weekly_reference") ?? metrics.get("public_transport_weekly_cap")
  const transportValue = record(transportRow?.value)
  const transportWeeklyReference = numberValue(transportValue.amount) ?? numberValue(transportValue.adult)

  const workRow = metrics.get("student_work_hours_fortnight")
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
        } satisfies CityMetricSource,
      ]),
    ).values(),
  )

  if (["sydney", "melbourne"].includes(normalizedSlug)) {
    sources.push({
      name: "CRICOS Locations and Course Locations",
      url: "https://data.gov.au/data/dataset/commonwealth-register-of-institutions-and-courses-for-overseas-students-cricos",
      dataAsOf: cricosDataAsOf,
      confidence: "high",
    })
  }

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "AU",
    countryName: "Australia",
    regionCode: city.region,
    regionName: REGION_NAMES[city.region] ?? city.region,
    scopeKind: city.scope_kind,
    latitude: numberValue(city.latitude),
    longitude: numberValue(city.longitude),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    verifiedProgramCount: verifiedProgramCount ?? 0,
    population:
      populationRow && populationAmount != null && populationGeography
        ? {
            amount: populationAmount,
            geography: populationGeography,
            annualChange: numberValue(populationValue.annual_change),
            annualChangePct: numberValue(populationValue.annual_change_pct),
            dataAsOf: populationRow.data_as_of,
          }
        : null,
    livingCost:
      livingRow && livingLow != null && livingHigh != null
        ? {
            low: livingLow,
            high: livingHigh,
            currency: stringValue(livingValue.currency) ?? "AUD",
            period: stringValue(livingValue.period) ?? "month",
            evidenceKind: livingRow.evidence_kind,
          }
        : null,
    transport:
      transportRow && transportWeeklyReference != null
        ? {
            weeklyReference: transportWeeklyReference,
            currency: stringValue(transportValue.currency) ?? "AUD",
            referenceKind: stringValue(transportValue.transport_kind) ?? "weekly_reference",
            eligibilityRequired: transportValue.eligibility_required === true,
            eligibleConcessionAmount: numberValue(transportValue.eligible_concession_amount) ?? numberValue(transportValue.concession),
            annualPass: numberValue(transportValue.annual_pass),
            evidenceKind: transportRow.evidence_kind,
          }
        : null,
    workRights:
      workRow && workHours != null
        ? {
            hoursPerFortnight: workHours,
            unrestrictedWhenCourseNotInSession: workValue.unrestricted_when_course_not_in_session === true,
          }
        : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    institutions: groupInstitutions(institutionRows),
    sources,
  }
}

export const getAuCityProfile = cache(loadAuCityProfile)
