import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedUkCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  country_code: string
  slug: string
  name: string
  region: string
  education_nation: string
  scope_kind: string
  study_destination_scope: string
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
  programme_coverage_status: string
}

type InstitutionRow = {
  city_id: string
  campus_id: string
  institution_id: string
  institution_name: string
  institution_slug: string
  ukprn: string
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

export type UkCityCampus = {
  id: string
  name: string
  city: string
  addressLine: string | null
  postalCode: string | null
  sourceUrl: string
}

export type UkCityInstitution = {
  id: string
  name: string
  profilePath: string
  websiteUrl: string
  ukprn: string
  campuses: UkCityCampus[]
}

export type UkCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type UkCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "UK"
  countryName: "United Kingdom"
  region: string
  educationNation: string
  scopeKind: string
  studyDestinationScope: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  programmeCoverage: {
    status: "verification_pending"
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
  } | null
  transport: {
    referenceAmount: number
    period: string
    currency: string
    referenceKind: string
    eligibilityRequired: boolean
    eligibility: string | null
    evidenceKind: string
  } | null
  workRights: {
    hours: number
    period: string
    context: string
    fullTimeOutsideTerm: boolean
    eligibilityConditionsApply: boolean
    nationalRule: boolean
    note: string | null
  } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: UkCityInstitution[]
  sources: UkCityMetricSource[]
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

function groupInstitutions(rows: InstitutionRow[]): UkCityInstitution[] {
  const grouped = new Map<string, UkCityInstitution>()

  for (const row of rows) {
    const campus: UkCityCampus = {
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
      profilePath: `/institutions/uk/${row.institution_slug}`,
      websiteUrl: row.website_url,
      ukprn: row.ukprn,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function scopeLabel(city: CityRow) {
  if (city.study_destination_scope === "greater_london") return "Greater London"
  return city.region ? `${city.name} city scope` : "Named-city scope"
}

async function loadUkCityProfile(slug: string): Promise<UkCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedUkCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_uk_v1")
    .select(
      "city_id,country_code,slug,name,region,education_nation,scope_kind,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,programme_coverage_status",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load UK city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_uk_v1")
      .select(
        "city_id,campus_id,institution_id,institution_name,institution_slug,ukprn,website_url,campus_name,campus_city,region,address_line,postal_code,location_source_url,location_quality,record_scope",
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
    throw new Error(`Unable to load UK city institutions: ${institutionResult.error.message}`)
  }
  if (metricResult.error) {
    throw new Error(`Unable to load UK city metrics: ${metricResult.error.message}`)
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
        } satisfies UkCityMetricSource,
      ]),
    ).values(),
  )

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "UK",
    countryName: "United Kingdom",
    region: city.region,
    educationNation: city.education_nation,
    scopeKind: city.scope_kind,
    studyDestinationScope: city.study_destination_scope,
    scopeLabel: scopeLabel(city),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    programmeCoverage: {
      status: "verification_pending",
      label: "UK programme delivery verification pending",
      detail:
        "Existing UK programme records are not shown as city-delivered programmes until an official programme page is explicitly verified against a delivery campus. Institution presence is never used to infer programme delivery.",
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
            currency: stringValue(livingValue.currency) ?? "GBP",
            period: stringValue(livingValue.period) ?? "month",
            scenario: stringValue(livingValue.scenario),
            evidenceKind: livingRow.evidence_kind,
          }
        : null,
    transport:
      transportRow && transportAmount != null
        ? {
            referenceAmount: transportAmount,
            period: stringValue(transportValue.period) ?? "published_period",
            currency: stringValue(transportValue.currency) ?? "GBP",
            referenceKind: stringValue(transportValue.transport_kind) ?? "student_transport_reference",
            eligibilityRequired: transportValue.eligibility_required === true,
            eligibility: stringValue(transportValue.eligibility),
            evidenceKind: transportRow.evidence_kind,
          }
        : null,
    workRights:
      workRow && workHours != null
        ? {
            hours: workHours,
            period: stringValue(workValue.period) ?? "week_during_term_time",
            context:
              stringValue(workValue.context) ??
              "student_visa_full_time_degree_level_or_above_at_compliant_higher_education_provider",
            fullTimeOutsideTerm: workValue.full_time_outside_term === true,
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

export const getUkCityProfile = cache(loadUkCityProfile)
