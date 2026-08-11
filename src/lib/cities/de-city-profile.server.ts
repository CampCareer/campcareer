import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedDeCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

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
  verified_domain: string
  identity_source_url: string
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

export type DeCityCampus = {
  id: string
  name: string
  city: string
  addressLine: string | null
  postalCode: string | null
  sourceUrl: string
}

export type DeCityInstitution = {
  id: string
  name: string
  slug: string
  websiteUrl: string
  verifiedDomain: string
  identitySourceUrl: string
  campuses: DeCityCampus[]
}

export type DeCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type DeCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "DE"
  countryName: "Germany"
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
    ags: string | null
    dataAsOf: string
  } | null
  livingCost: {
    low: number
    high: number
    currency: string
    period: string
    referenceKind: string | null
    note: string | null
    evidenceKind: string
    confidence: string
  } | null
  transport: {
    referenceAmount: number | null
    low: number | null
    high: number | null
    period: string
    currency: string
    referenceKind: string
    eligibilityOrEnrolmentConditionsApply: boolean
    sourceNativePeriod: boolean
    note: string | null
    evidenceKind: string
  } | null
  workRights: {
    hoursTermTime: number
    period: string
    fullDaysPerYear: number | null
    halfDaysPerYear: number | null
    residenceContext: string | null
    fullTimeDuringSemesterBreaks: boolean
    studentAuxiliaryTaskException: boolean
    eligibilityConditionsApply: boolean
    nationalRule: boolean
    note: string | null
  } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: DeCityInstitution[]
  sources: DeCityMetricSource[]
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

function groupInstitutions(rows: InstitutionRow[]): DeCityInstitution[] {
  const grouped = new Map<string, DeCityInstitution>()

  for (const row of rows) {
    const campus: DeCityCampus = {
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
      verifiedDomain: row.verified_domain,
      identitySourceUrl: row.identity_source_url,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadDeCityProfile(slug: string): Promise<DeCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedDeCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_de_v1")
    .select(
      "city_id,country_code,slug,name,region,scope_kind,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,programme_coverage_status",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Germany city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_de_v1")
      .select(
        "city_id,campus_id,institution_id,institution_name,institution_slug,verified_domain,identity_source_url,website_url,campus_name,campus_city,region,address_line,postal_code,location_source_url,location_quality,record_scope",
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
    throw new Error(`Unable to load Germany city institutions: ${institutionResult.error.message}`)
  }
  if (metricResult.error) {
    throw new Error(`Unable to load Germany city metrics: ${metricResult.error.message}`)
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
  const transportLow = numberValue(transportValue.low)
  const transportHigh = numberValue(transportValue.high)

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
        } satisfies DeCityMetricSource,
      ]),
    ).values(),
  )

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "DE",
    countryName: "Germany",
    region: city.region,
    scopeKind: city.scope_kind,
    studyDestinationScope: city.study_destination_scope,
    scopeLabel: `${city.name} municipality`,
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    programmeCoverage: {
      status: "verification_pending",
      label: "Germany programme delivery verification pending",
      detail:
        "CampCareer has a Germany programme catalogue, but the current city seed relationships do not prove campus-specific delivery. Institution or teaching-location presence is never used to infer programme delivery; city programmes will appear only after explicit offering-to-campus evidence is verified.",
    },
    population:
      populationRow && populationAmount != null && populationGeography
        ? {
            amount: populationAmount,
            geography: populationGeography,
            geographyKind: stringValue(populationValue.geography_kind),
            ags: stringValue(populationValue.ags),
            dataAsOf: populationRow.data_as_of,
          }
        : null,
    livingCost:
      livingRow && livingLow != null && livingHigh != null
        ? {
            low: livingLow,
            high: livingHigh,
            currency: stringValue(livingValue.currency) ?? "EUR",
            period: stringValue(livingValue.period) ?? "month",
            referenceKind: stringValue(livingValue.reference_kind),
            note: stringValue(livingValue.note),
            evidenceKind: livingRow.evidence_kind,
            confidence: livingRow.confidence,
          }
        : null,
    transport:
      transportRow && (transportAmount != null || (transportLow != null && transportHigh != null))
        ? {
            referenceAmount: transportAmount,
            low: transportLow,
            high: transportHigh,
            period: stringValue(transportValue.period) ?? "published_period",
            currency: stringValue(transportValue.currency) ?? "EUR",
            referenceKind: stringValue(transportValue.reference_kind) ?? "student_transport_reference",
            eligibilityOrEnrolmentConditionsApply:
              transportValue.eligibility_or_enrolment_conditions_apply === true,
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
            fullDaysPerYear: numberValue(workValue.full_days_per_year),
            halfDaysPerYear: numberValue(workValue.half_days_per_year),
            residenceContext: stringValue(workValue.residence_context),
            fullTimeDuringSemesterBreaks: workValue.full_time_during_semester_breaks === true,
            studentAuxiliaryTaskException: workValue.student_auxiliary_task_exception === true,
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

export const getDeCityProfile = cache(loadDeCityProfile)
