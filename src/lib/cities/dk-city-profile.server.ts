import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedDkCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  slug: string
  name: string
  region_code: string
  municipality_code: string
  study_destination_scope: string
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
  institution_coverage_status: string
  programme_coverage_status: string
}

type InstitutionRow = {
  city_id: string
  institution_id: string
  institution_name: string
  institution_slug: string
  website_url: string
  authority_identifier: string
  authority_source_url: string
  campus_id: string
  campus_name: string
  address_line: string | null
  postal_code: string | null
  location_source_url: string
  record_scope: string
  location_quality: string
}

type ProgrammeRow = {
  programme_id: string
  programme_title: string
  programme_type: string | null
  field_name: string | null
  institution_name: string
  institution_slug: string
  campus_name: string
  enrolment_status: string | null
  official_program_url: string
  verification_tier: string
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

export type DkCityInstitution = {
  id: string
  name: string
  slug: string
  websiteUrl: string
  authorityIdentifier: string
  authoritySourceUrl: string
  campuses: Array<{
    id: string
    name: string
    addressLine: string | null
    postalCode: string | null
    sourceUrl: string
  }>
}

export type DkCityProgramme = {
  id: string
  title: string
  type: string | null
  fieldName: string | null
  institutionName: string
  institutionSlug: string
  campusName: string
  enrolmentStatus: string | null
  officialUrl: string
  verificationTier: string
}

export type DkCityMetricSource = {
  name: string
  url: string
  dataAsOf: string
  confidence: string
}

export type DkCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "DK"
  countryName: "Denmark"
  regionCode: string
  regionName: string
  municipalityCode: string
  studyDestinationScope: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  institutionCoverageStatus: string
  programmeCoverage: {
    status: "verified_partial" | "verification_pending"
    label: string
    detail: string
  }
  population: {
    amount: number
    geography: string
    municipalityCode: string | null
    quarter: string | null
    dataAsOf: string
  } | null
  livingCost: {
    low: number
    high: number
    currency: string
    period: string
    referenceScope: string | null
    citySpecific: boolean
    evidenceKind: string
  } | null
  transport: {
    amount: number
    currency: string
    period: string
    referenceKind: string | null
    studentSpecific: boolean
    sourceNativePeriod: boolean
    note: string | null
    evidenceKind: string
  } | null
  workRights: {
    hoursNormalPeriod: number
    period: string
    normalPeriodMonths: string[]
    fullTimeMonths: string[]
    context: string
    nationalRule: boolean
    note: string | null
  } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: DkCityInstitution[]
  programmeSample: DkCityProgramme[]
  sources: DkCityMetricSource[]
}

const REGION_NAMES: Record<string, string> = {
  "081": "Region Nordjylland",
  "082": "Region Midtjylland",
  "083": "Region Syddanmark",
  "084": "Region Hovedstaden",
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

function booleanValue(value: unknown): boolean {
  return value === true
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function groupInstitutions(rows: InstitutionRow[]): DkCityInstitution[] {
  const grouped = new Map<string, DkCityInstitution>()

  for (const row of rows) {
    const campus = {
      id: row.campus_id,
      name: row.campus_name,
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
      authorityIdentifier: row.authority_identifier,
      authoritySourceUrl: row.authority_source_url,
      campuses: [campus],
    })
  }

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadDkCityProfile(slug: string): Promise<DkCityProfile | null> {
  const normalizedSlug = normalizeCitySlug(slug)
  if (!normalizedSlug || !isPublishedDkCitySlug(normalizedSlug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_dk_v1")
    .select("city_id,slug,name,region_code,municipality_code,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,programme_coverage_status")
    .eq("slug", normalizedSlug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Denmark city: ${cityError.message}`)
  if (!cityData) return null

  const city = cityData as CityRow
  const [institutionResult, programmeResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_dk_v1")
      .select("city_id,institution_id,institution_name,institution_slug,website_url,authority_identifier,authority_source_url,campus_id,campus_name,address_line,postal_code,location_source_url,record_scope,location_quality")
      .eq("city_id", city.city_id)
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("city_programme_directory_dk_v1")
      .select("programme_id,programme_title,programme_type,field_name,institution_name,institution_slug,campus_name,enrolment_status,official_program_url,verification_tier")
      .eq("city_id", city.city_id)
      .order("programme_title", { ascending: true })
      .limit(8),
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

  if (institutionResult.error) throw new Error(`Unable to load Denmark city institutions: ${institutionResult.error.message}`)
  if (programmeResult.error) throw new Error(`Unable to load Denmark city programmes: ${programmeResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load Denmark city metrics: ${metricResult.error.message}`)

  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))

  const populationRow = metrics.get("city_population")
  const populationValue = record(populationRow?.value)
  const populationAmount = numberValue(populationValue.amount)

  const livingRow = metrics.get("student_living_cost_monthly_range")
  const livingValue = record(livingRow?.value)
  const livingLow = numberValue(livingValue.low)
  const livingHigh = numberValue(livingValue.high)

  const transportRow = metrics.get("student_transport_reference")
  const transportValue = record(transportRow?.value)
  const transportAmount = numberValue(transportValue.amount)

  const workRow = metrics.get("student_work_hours_week")
  const workValue = record(workRow?.value)
  const workHours = numberValue(workValue.hours_normal_period)

  const sectorsRow = metrics.get("employment_focus_sectors")
  const sectorsValue = record(sectorsRow?.value)

  const programmeStatus = city.programme_coverage_status === "verified_partial" ? "verified_partial" : "verification_pending"
  const programmeCoverage = programmeStatus === "verified_partial"
    ? {
        status: "verified_partial" as const,
        label: `${city.linked_program_count} programmes with verified city delivery evidence`,
        detail: "These programmes have an explicit Study in Denmark source city that matches a verified official university location. This is a verified partial catalogue, not a complete inventory of every programme or higher-education provider in the municipality.",
      }
    : {
        status: "verification_pending" as const,
        label: "Programme delivery verification pending",
        detail: "Institution presence is not used to infer programme delivery. Programmes appear only after an explicit source-city and verified-location relationship is established.",
      }

  const sources = [...new Map(metricRows.map((row) => [row.source_url, {
    name: row.source_name,
    url: row.source_url,
    dataAsOf: row.data_as_of,
    confidence: row.confidence,
  }])).values()]

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "DK",
    countryName: "Denmark",
    regionCode: city.region_code,
    regionName: REGION_NAMES[city.region_code] ?? city.region_code,
    municipalityCode: city.municipality_code,
    studyDestinationScope: city.study_destination_scope,
    scopeLabel: `${city.name} Municipality`,
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    programmeCoverage,
    population: populationRow && populationAmount !== null ? {
      amount: populationAmount,
      geography: stringValue(populationValue.geography) ?? `${city.name} Municipality`,
      municipalityCode: stringValue(populationValue.municipality_code),
      quarter: stringValue(populationValue.quarter),
      dataAsOf: populationRow.data_as_of,
    } : null,
    livingCost: livingRow && livingLow !== null && livingHigh !== null ? {
      low: livingLow,
      high: livingHigh,
      currency: stringValue(livingValue.currency) ?? "DKK",
      period: stringValue(livingValue.period) ?? "month",
      referenceScope: stringValue(livingValue.reference_scope),
      citySpecific: booleanValue(livingValue.city_specific),
      evidenceKind: livingRow.evidence_kind,
    } : null,
    transport: transportRow && transportAmount !== null ? {
      amount: transportAmount,
      currency: stringValue(transportValue.currency) ?? "DKK",
      period: stringValue(transportValue.period) ?? "source_native",
      referenceKind: stringValue(transportValue.reference_kind),
      studentSpecific: booleanValue(transportValue.student_specific),
      sourceNativePeriod: booleanValue(transportValue.source_native_period),
      note: stringValue(transportValue.note),
      evidenceKind: transportRow.evidence_kind,
    } : null,
    workRights: workRow && workHours !== null ? {
      hoursNormalPeriod: workHours,
      period: stringValue(workValue.period) ?? "month",
      normalPeriodMonths: stringArray(workValue.normal_period_months),
      fullTimeMonths: stringArray(workValue.full_time_months),
      context: stringValue(workValue.context) ?? "student_residence_permit",
      nationalRule: booleanValue(workValue.national_rule),
      note: stringValue(workValue.note),
    } : null,
    employmentSectors: stringArray(sectorsValue.sectors),
    employmentSectorBasis: stringValue(sectorsValue.basis),
    institutions: groupInstitutions((institutionResult.data ?? []) as InstitutionRow[]),
    programmeSample: ((programmeResult.data ?? []) as ProgrammeRow[]).map((row) => ({
      id: row.programme_id,
      title: row.programme_title,
      type: row.programme_type,
      fieldName: row.field_name,
      institutionName: row.institution_name,
      institutionSlug: row.institution_slug,
      campusName: row.campus_name,
      enrolmentStatus: row.enrolment_status,
      officialUrl: row.official_program_url,
      verificationTier: row.verification_tier,
    })),
    sources,
  }
}

export const getDkCityProfile = cache(loadDkCityProfile)
