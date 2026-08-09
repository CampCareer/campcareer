import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedNzCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  country_code: string
  slug: string
  name: string
  region: string
  scope_kind: string
  study_destination_scope: string
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
  provider_number: string
  provider_source_url: string
  website_url: string
  campus_name: string
  campus_city: string
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

export type NzCityCampus = {
  id: string
  name: string
  city: string
  addressLine: string | null
  postalCode: string | null
  sourceUrl: string
}

export type NzCityInstitution = {
  id: string
  name: string
  slug: string
  websiteUrl: string
  providerNumber: string
  providerSourceUrl: string
  campuses: NzCityCampus[]
}

export type NzCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type NzCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "NZ"
  countryName: "New Zealand"
  region: string
  scopeKind: string
  studyDestinationScope: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  institutionCoverageStatus: string
  programmeCoverage: {
    status: "verification_pending"
    label: string
    detail: string
  }
  population: {
    amount: number
    geography: string
    geographyKind: string | null
    dataAsOf: string
  } | null
  livingCost: {
    low: number
    high: number
    currency: string
    period: string
    scenario: string | null
    conversion: string | null
    evidenceKind: string
  } | null
  transport: {
    referenceAmount: number
    period: string
    currency: string
    referenceKind: string
    eligibilityOrFareCardRequired: boolean
    sourceNativePeriod: boolean
    note: string | null
    evidenceKind: string
  } | null
  workRights: {
    hoursTermTime: number
    period: string
    context: string
    effectiveFrom: string | null
    fullTimeDuringEligibleScheduledBreaks: boolean
    eligibilityConditionsApply: boolean
    nationalRule: boolean
    note: string | null
  } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: NzCityInstitution[]
  sources: NzCityMetricSource[]
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

function groupInstitutions(rows: InstitutionRow[]): NzCityInstitution[] {
  const grouped = new Map<string, NzCityInstitution>()

  for (const row of rows) {
    const campus: NzCityCampus = {
      id: row.campus_id,
      name: row.campus_name,
      city: row.campus_city,
      addressLine: row.address_line,
      postalCode: row.postal_code,
      sourceUrl: row.location_source_url,
    }

    const existing = grouped.get(row.institution_id)
    if (existing) {
      existing.campuses.push(campus)
      continue
    }

    grouped.set(row.institution_id, {
      id: row.institution_id,
      name: row.institution_name,
      slug: row.institution_slug,
      websiteUrl: row.website_url,
      providerNumber: row.provider_number,
      providerSourceUrl: row.provider_source_url,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function scopeLabel(city: CityRow) {
  return city.study_destination_scope === "stats_nz_urban_area"
    ? `${city.name} urban study scope`
    : `${city.name} approved study scope`
}

async function loadNzCityProfile(slug: string): Promise<NzCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedNzCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_nz_v1")
    .select(
      "city_id,country_code,slug,name,region,scope_kind,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,programme_coverage_status",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load New Zealand city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_nz_v1")
      .select(
        "city_id,campus_id,institution_id,institution_name,institution_slug,provider_number,provider_source_url,website_url,campus_name,campus_city,region,address_line,postal_code,location_source_url,location_quality,record_scope",
      )
      .eq("city_id", city.city_id)
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("geography_id", city.city_id)
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .in("metric_key", [
        "city_population",
        "student_living_cost_monthly_range",
        "student_transport_reference",
        "student_work_hours_week",
        "employment_focus_sectors",
      ])
      .order("metric_key", { ascending: true }),
  ])

  if (institutionResult.error) {
    throw new Error(`Unable to load New Zealand city institutions: ${institutionResult.error.message}`)
  }
  if (metricResult.error) {
    throw new Error(`Unable to load New Zealand city metrics: ${metricResult.error.message}`)
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
  const workTermHours = numberValue(workValue.hours_term_time)

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
        } satisfies NzCityMetricSource,
      ]),
    ).values(),
  )

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "NZ",
    countryName: "New Zealand",
    region: city.region,
    scopeKind: city.scope_kind,
    studyDestinationScope: city.study_destination_scope,
    scopeLabel: scopeLabel(city),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    programmeCoverage: {
      status: "verification_pending",
      label: "New Zealand programme delivery verification pending",
      detail:
        "The canonical New Zealand programme catalogue is not yet mature enough for city-level delivery claims. Institution or campus presence is never used to infer programme delivery; a programme will appear only after explicit offering-to-campus evidence is verified.",
    },
    population:
      populationRow && populationAmount != null && populationGeography
        ? {
            amount: populationAmount,
            geography: populationGeography,
            geographyKind: stringValue(populationValue.geography_kind),
            dataAsOf: populationRow.data_as_of,
          }
        : null,
    livingCost:
      livingRow && livingLow != null && livingHigh != null
        ? {
            low: livingLow,
            high: livingHigh,
            currency: stringValue(livingValue.currency) ?? "NZD",
            period: stringValue(livingValue.period) ?? "month",
            scenario: stringValue(livingValue.scenario),
            conversion: stringValue(livingValue.conversion),
            evidenceKind: livingRow.evidence_kind,
          }
        : null,
    transport:
      transportRow && transportAmount != null
        ? {
            referenceAmount: transportAmount,
            period: stringValue(transportValue.period) ?? "published_period",
            currency: stringValue(transportValue.currency) ?? "NZD",
            referenceKind:
              stringValue(transportValue.reference_kind) ?? "student_transport_reference",
            eligibilityOrFareCardRequired:
              transportValue.eligibility_or_fare_card_required === true,
            sourceNativePeriod: transportValue.source_native_period === true,
            note: stringValue(transportValue.note),
            evidenceKind: transportRow.evidence_kind,
          }
        : null,
    workRights:
      workRow && workTermHours != null
        ? {
            hoursTermTime: workTermHours,
            period: stringValue(workValue.period) ?? "week",
            context: stringValue(workValue.context) ?? "eligible_student_visa",
            effectiveFrom: stringValue(workValue.effective_from),
            fullTimeDuringEligibleScheduledBreaks:
              workValue.full_time_during_eligible_scheduled_breaks === true,
            eligibilityConditionsApply: workValue.eligibility_conditions_apply === true,
            nationalRule: workValue.national_rule === true,
            note: stringValue(workValue.note),
          }
        : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    employmentSectorBasis: stringValue(sectorsValue.basis),
    institutions: groupInstitutions(institutionRows),
    sources,
  }
}

export const getNzCityProfile = cache(loadNzCityProfile)
