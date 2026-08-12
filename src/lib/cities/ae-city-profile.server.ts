import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isSupportedAeCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  slug: string
  name: string
  emirate_name: string
  study_destination_scope: string
  city_identifier_status: string
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
  institution_coverage_status: string
  institution_identifier_maturity: string
  programme_coverage_status: string
}

type InstitutionRow = {
  institution_id: string
  institution_name: string
  institution_slug: string
  website_url: string | null
  authority_identifier_system: string
  authority_identifier: string
  authority_source_url: string | null
  identifier_maturity: string
  campus_id: string
  campus_name: string
  address_line: string | null
  postal_code: string | null
  location_source_url: string
  programme_assignment_verified: boolean
}

type ProgrammeRow = {
  programme_id: string
  programme_title: string
  programme_type: string | null
  field_name: string | null
  source_degree_level: string | null
  institution_name: string
  institution_slug: string
  campus_name: string
  enrolment_status: string | null
  official_program_url: string
  verification_tier: string
  accreditation_source_url: string | null
  international_evidence_status: string | null
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

export type AeCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "AE"
  countryName: "United Arab Emirates"
  emirateName: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  institutionCoverageStatus: string
  institutionIdentifierMaturity: string
  programmeCoverage: {
    status: "verified_partial"
    label: string
    detail: string
  }
  population: {
    amount: number | null
    availabilityStatus: string
    geography: string
    note: string | null
  }
  livingCost: {
    low: number | null
    high: number | null
    sourceLow: number | null
    sourceHigh: number | null
    currency: string
    period: string
    referenceKind: string | null
    fullBudget: boolean
    availabilityStatus: string | null
    note: string | null
  } | null
  transport: {
    amount: number
    amountHigh: number | null
    currency: string
    period: string
    referenceKind: string | null
    studentSpecific: boolean
    note: string | null
  } | null
  workContext: {
    permitRequired: boolean
    permitKind: string | null
    permitDurationMonths: number | null
    fixedWeeklyLimitPublished: boolean
    note: string | null
  } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: Array<{
    id: string
    name: string
    slug: string
    websiteUrl: string | null
    authorityIdentifierSystem: string
    authorityIdentifier: string
    authoritySourceUrl: string | null
    locations: Array<{
      id: string
      name: string
      addressLine: string | null
      postalCode: string | null
      sourceUrl: string
      programmeAssignmentVerified: boolean
    }>
  }>
  programmeSample: Array<{
    id: string
    title: string
    type: string | null
    fieldName: string | null
    sourceDegreeLevel: string | null
    institutionName: string
    institutionSlug: string
    locationName: string
    enrolmentStatus: string | null
    officialUrl: string
    verificationTier: string
    accreditationSourceUrl: string | null
    internationalEvidenceStatus: string | null
  }>
  sources: Array<{ name: string; url: string; dataAsOf: string; confidence: string }>
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return null
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : []
}

async function loadAeCityProfile(input: string): Promise<AeCityProfile | null> {
  const slug = normalizeCitySlug(input)
  if (!slug || !isSupportedAeCitySlug(slug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_ae_v1")
    .select("city_id,slug,name,emirate_name,study_destination_scope,city_identifier_status,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,institution_identifier_maturity,programme_coverage_status")
    .eq("slug", slug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load UAE city: ${cityError.message}`)
  if (!cityData) return null
  const city = cityData as CityRow

  const [institutionResult, programmeResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("city_institution_directory_ae_v1")
      .select("institution_id,institution_name,institution_slug,website_url,authority_identifier_system,authority_identifier,authority_source_url,identifier_maturity,campus_id,campus_name,address_line,postal_code,location_source_url,programme_assignment_verified")
      .eq("city_id", city.city_id)
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("city_programme_directory_ae_v1")
      .select("programme_id,programme_title,programme_type,field_name,source_degree_level,institution_name,institution_slug,campus_name,enrolment_status,official_program_url,verification_tier,accreditation_source_url,international_evidence_status")
      .eq("city_id", city.city_id)
      .order("programme_title", { ascending: true })
      .limit(8),
    supabaseAdmin
      .from("city_metric_directory_ae_v1")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("city_id", city.city_id)
      .order("metric_key", { ascending: true }),
  ])

  if (institutionResult.error) throw new Error(`Unable to load UAE city institutions: ${institutionResult.error.message}`)
  if (programmeResult.error) throw new Error(`Unable to load UAE city programmes: ${programmeResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load UAE city metrics: ${metricResult.error.message}`)

  const institutionMap = new Map<string, AeCityProfile["institutions"][number]>()
  for (const row of (institutionResult.data ?? []) as InstitutionRow[]) {
    const location = {
      id: row.campus_id,
      name: row.campus_name,
      addressLine: row.address_line,
      postalCode: row.postal_code,
      sourceUrl: row.location_source_url,
      programmeAssignmentVerified: row.programme_assignment_verified,
    }
    const existing = institutionMap.get(row.institution_id)
    if (existing) existing.locations.push(location)
    else institutionMap.set(row.institution_id, {
      id: row.institution_id,
      name: row.institution_name,
      slug: row.institution_slug,
      websiteUrl: row.website_url,
      authorityIdentifierSystem: row.authority_identifier_system,
      authorityIdentifier: row.authority_identifier,
      authoritySourceUrl: row.authority_source_url,
      locations: [location],
    })
  }

  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))

  const populationValue = record(metrics.get("city_population")?.value)
  const livingValue = record(metrics.get("student_living_cost_monthly_range")?.value)
  const transportValue = record(metrics.get("student_transport_reference")?.value)
  const workValue = record(metrics.get("student_work_hours_week")?.value)
  const sectorValue = record(metrics.get("employment_focus_sectors")?.value)

  const transportAmount = numberValue(transportValue.amount)
  const hasLivingReference = metrics.has("student_living_cost_monthly_range")

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    countryCode: "AE",
    countryName: "United Arab Emirates",
    emirateName: city.emirate_name,
    scopeLabel: `${city.name} City/locality`,
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    institutionIdentifierMaturity: city.institution_identifier_maturity,
    programmeCoverage: {
      status: "verified_partial",
      label: `${city.linked_program_count} programmes with verified City-location linkage`,
      detail: "Counts include only the current UAE programme foundation where a verified provider teaching-location representative, source-specific provider identity, active accreditation evidence, and exact staging City agree. This is a partial CampCareer collection, not the complete UAE higher-education market.",
    },
    population: {
      amount: numberValue(populationValue.amount),
      availabilityStatus: stringValue(populationValue.availability_status) ?? "not_published_at_verified_city_scope",
      geography: stringValue(populationValue.geography) ?? `${city.name} City/locality`,
      note: stringValue(populationValue.note),
    },
    livingCost: hasLivingReference ? {
      low: numberValue(livingValue.low),
      high: numberValue(livingValue.high),
      sourceLow: numberValue(livingValue.source_low),
      sourceHigh: numberValue(livingValue.source_high),
      currency: stringValue(livingValue.currency) ?? "AED",
      period: stringValue(livingValue.period) ?? "source_native",
      referenceKind: stringValue(livingValue.reference_kind),
      fullBudget: livingValue.full_budget === true,
      availabilityStatus: stringValue(livingValue.availability_status),
      note: stringValue(livingValue.note),
    } : null,
    transport: transportAmount !== null ? {
      amount: transportAmount,
      amountHigh: numberValue(transportValue.amount_high),
      currency: stringValue(transportValue.currency) ?? "AED",
      period: stringValue(transportValue.period) ?? "source_native",
      referenceKind: stringValue(transportValue.reference_kind),
      studentSpecific: transportValue.student_specific === true,
      note: stringValue(transportValue.note),
    } : null,
    workContext: metrics.has("student_work_hours_week") ? {
      permitRequired: workValue.permit_required === true,
      permitKind: stringValue(workValue.permit_kind),
      permitDurationMonths: numberValue(workValue.permit_duration_months),
      fixedWeeklyLimitPublished: workValue.fixed_weekly_limit_published === true,
      note: stringValue(workValue.note),
    } : null,
    employmentSectors: stringArray(sectorValue.sectors),
    employmentSectorBasis: stringValue(sectorValue.basis),
    institutions: [...institutionMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    programmeSample: ((programmeResult.data ?? []) as ProgrammeRow[]).map((row) => ({
      id: row.programme_id,
      title: row.programme_title,
      type: row.programme_type,
      fieldName: row.field_name,
      sourceDegreeLevel: row.source_degree_level,
      institutionName: row.institution_name,
      institutionSlug: row.institution_slug,
      locationName: row.campus_name,
      enrolmentStatus: row.enrolment_status,
      officialUrl: row.official_program_url,
      verificationTier: row.verification_tier,
      accreditationSourceUrl: row.accreditation_source_url,
      internationalEvidenceStatus: row.international_evidence_status,
    })),
    sources: [...new Map(metricRows.map((row) => [row.source_url, {
      name: row.source_name,
      url: row.source_url,
      dataAsOf: row.data_as_of,
      confidence: row.confidence,
    }])).values()],
  }
}

export const getAeCityProfile = cache(loadAeCityProfile)
