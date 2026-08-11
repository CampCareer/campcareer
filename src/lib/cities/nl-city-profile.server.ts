import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedNlCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

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
  city_slug: string
  city_name: string
  campus_id: string
  campus_name: string
  campus_city: string
  campus_region: string
  address_line: string | null
  postal_code: string | null
  location_source_url: string
  location_source_checked_at: string
  record_scope: string
  location_quality: string
  institution_id: string
  institution_name: string
  institution_slug: string
  website_url: string
  brin_code: string
  brin_source_url: string
  linkage_basis: string
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

export type NlCityCampus = {
  id: string
  name: string
  city: string
  addressLine: string | null
  postalCode: string | null
  sourceUrl: string
}

export type NlCityInstitution = {
  id: string
  name: string
  slug: string
  websiteUrl: string
  brinCode: string
  brinSourceUrl: string
  campuses: NlCityCampus[]
}

export type NlCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type NlCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "NL"
  countryName: "Netherlands"
  region: string
  scopeKind: string
  studyDestinationScope: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  institutionCoverageStatus: string
  institutionCoverage: {
    label: string
    detail: string
  }
  programmeCoverage: {
    status: string
    label: string
    detail: string
  }
  population: {
    amount: number
    geography: string
    geographyKind: string | null
    municipalityCode: string | null
    dataAsOf: string
  } | null
  livingCost: {
    low: number
    high: number
    currency: string
    period: string
    scenario: string | null
    referenceScope: string | null
    citySpecific: boolean
    evidenceKind: string
  } | null
  transport: {
    referenceAmount: number
    period: string
    currency: string
    referenceKind: string
    studentSpecific: boolean
    sourceNativePeriod: boolean
    note: string | null
    evidenceKind: string
  } | null
  workRights: {
    hoursTermTime: number
    period: string
    context: string
    fullTimeMonths: string[]
    employerWorkPermitRequired: boolean
    choiceRequired: boolean
    nationalRule: boolean
    selfEmploymentRuleSeparate: boolean
    note: string | null
  } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: NlCityInstitution[]
  sources: NlCityMetricSource[]
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

function groupInstitutions(rows: InstitutionRow[]): NlCityInstitution[] {
  const grouped = new Map<string, NlCityInstitution>()

  for (const row of rows) {
    const campus: NlCityCampus = {
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
      brinCode: row.brin_code,
      brinSourceUrl: row.brin_source_url,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function scopeLabel(city: CityRow) {
  return city.study_destination_scope === "cbs_municipality"
    ? `${city.name} municipality study scope`
    : `${city.name} approved study scope`
}

function programmeCoverage(city: CityRow): NlCityProfile["programmeCoverage"] {
  if (city.programme_coverage_status === "verified_partial" && city.linked_program_count > 0) {
    return {
      status: "verified_partial",
      label: "Partial Netherlands programme delivery verified",
      detail:
        "Only programmes with explicit verified offering-to-campus evidence are counted. The wider Dutch programme catalogue may still contain programmes whose city delivery has not yet been verified.",
    }
  }

  return {
    status: "verification_pending",
    label: "Netherlands programme delivery verification pending",
    detail:
      "Canonical Dutch programme identities and verified programme records do not by themselves prove city delivery. A programme appears for a city only after an explicit verified offering-to-campus link exists.",
  }
}

async function loadNlCityProfile(slug: string): Promise<NlCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedNlCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_nl_v1")
    .select(
      "city_id,country_code,slug,name,region,scope_kind,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,programme_coverage_status",
    )
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Netherlands city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_nl_v1")
      .select(
        "city_id,city_slug,city_name,campus_id,campus_name,campus_city,campus_region,address_line,postal_code,location_source_url,location_source_checked_at,record_scope,location_quality,institution_id,institution_name,institution_slug,website_url,brin_code,brin_source_url,linkage_basis",
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
    throw new Error(`Unable to load Netherlands city institutions: ${institutionResult.error.message}`)
  }
  if (metricResult.error) {
    throw new Error(`Unable to load Netherlands city metrics: ${metricResult.error.message}`)
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
        } satisfies NlCityMetricSource,
      ]),
    ).values(),
  )

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "NL",
    countryName: "Netherlands",
    region: city.region,
    scopeKind: city.scope_kind,
    studyDestinationScope: city.study_destination_scope,
    scopeLabel: scopeLabel(city),
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    institutionCoverage: {
      label: "Research-university core coverage",
      detail:
        "The current verified city layer covers the research-university core. Dutch HBO providers remain an explicit expansion gap and are not silently treated as absent from the city.",
    },
    programmeCoverage: programmeCoverage(city),
    population:
      populationRow && populationAmount != null && populationGeography
        ? {
            amount: populationAmount,
            geography: populationGeography,
            geographyKind: stringValue(populationValue.geography_kind),
            municipalityCode: stringValue(populationValue.municipality_code),
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
            scenario: stringValue(livingValue.scenario),
            referenceScope: stringValue(livingValue.reference_scope),
            citySpecific: livingValue.city_specific === true,
            evidenceKind: livingRow.evidence_kind,
          }
        : null,
    transport:
      transportRow && transportAmount != null
        ? {
            referenceAmount: transportAmount,
            period: stringValue(transportValue.period) ?? "published_period",
            currency: stringValue(transportValue.currency) ?? "EUR",
            referenceKind: stringValue(transportValue.reference_kind) ?? "transport_reference",
            studentSpecific: transportValue.student_specific === true,
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
            context: stringValue(workValue.context) ?? "study_residence_permit_employee",
            fullTimeMonths: stringArray(workValue.full_time_months),
            employerWorkPermitRequired: workValue.employer_work_permit_required === true,
            choiceRequired: workValue.choice_required === true,
            nationalRule: workValue.national_rule === true,
            selfEmploymentRuleSeparate: workValue.self_employment_rule_separate === true,
            note: stringValue(workValue.note),
          }
        : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    employmentSectorBasis: stringValue(sectorsValue.basis),
    institutions: groupInstitutions(institutionRows),
    sources,
  }
}

export const getNlCityProfile = cache(loadNlCityProfile)
