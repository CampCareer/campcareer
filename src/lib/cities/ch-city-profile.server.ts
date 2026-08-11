import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isSupportedChCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  slug: string
  name: string
  region_code: string
  region_name: string
  municipality_code: string
  official_municipality_name: string
  study_destination_scope: string
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
  international_admission_status: string
  international_verification_status: string
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

export type ChCityProfile = {
  id: string
  slug: string
  name: string
  officialMunicipalityName: string
  countryCode: "CH"
  countryName: "Switzerland"
  regionCode: string
  regionName: string
  municipalityCode: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  institutionCoverageStatus: string
  institutionIdentifierMaturity: string
  programmeCoverage: {
    status: "verified_partial" | "verification_pending"
    label: string
    detail: string
  }
  population: { amount: number; geography: string; dataAsOf: string } | null
  livingCost: { low: number; high: number; currency: string; period: string; referenceKind: string | null; studentSpecific: boolean; note: string | null } | null
  transport: { amount: number | null; low: number | null; high: number | null; currency: string; period: string; referenceKind: string | null; studentSpecific: boolean; note: string | null } | null
  workRights: { hoursNormalPeriod: number; period: string; earliestStartAfterStudyMonths: number | null; fullTimeHolidays: boolean; appliesTo: string | null; note: string | null } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  employmentContextScope: string | null
  institutions: Array<{
    id: string
    name: string
    slug: string
    websiteUrl: string | null
    authorityIdentifierSystem: string
    authorityIdentifier: string
    authoritySourceUrl: string | null
    identifierMaturity: string
    locations: Array<{ id: string; name: string; addressLine: string | null; postalCode: string | null; sourceUrl: string }>
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
    internationalAdmissionStatus: string
    internationalVerificationStatus: string
  }>
  sources: Array<{ name: string; url: string; dataAsOf: string; confidence: string }>
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && Number.isFinite(Number(value))) return Number(value)
  return null
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

async function loadChCityProfile(input: string): Promise<ChCityProfile | null> {
  const slug = normalizeCitySlug(input)
  if (!slug || !isSupportedChCitySlug(slug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_ch_v1")
    .select("city_id,slug,name,region_code,region_name,municipality_code,official_municipality_name,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,institution_identifier_maturity,programme_coverage_status")
    .eq("slug", slug)
    .maybeSingle()

  if (cityError) throw new Error(`Unable to load Switzerland city: ${cityError.message}`)
  if (!cityData) return null
  const city = cityData as CityRow

  const [institutionResult, programmeResult, metricResult] = await Promise.all([
    supabaseAdmin.from("city_institution_directory_ch_v1")
      .select("institution_id,institution_name,institution_slug,website_url,authority_identifier_system,authority_identifier,authority_source_url,identifier_maturity,campus_id,campus_name,address_line,postal_code,location_source_url")
      .eq("city_id", city.city_id).order("institution_name", { ascending: true }),
    supabaseAdmin.from("city_programme_directory_ch_v1")
      .select("programme_id,programme_title,programme_type,field_name,source_degree_level,institution_name,institution_slug,campus_name,enrolment_status,official_program_url,verification_tier,international_admission_status,international_verification_status")
      .eq("city_id", city.city_id).order("programme_title", { ascending: true }).limit(8),
    supabaseAdmin.from("report_metric_evidence_city")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("geography_id", city.city_id).eq("scope_type", "city").eq("review_status", "verified")
      .in("metric_key", ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"])
      .order("metric_key", { ascending: true }),
  ])

  if (institutionResult.error) throw new Error(`Unable to load Switzerland city institutions: ${institutionResult.error.message}`)
  if (programmeResult.error) throw new Error(`Unable to load Switzerland city programmes: ${programmeResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load Switzerland city metrics: ${metricResult.error.message}`)

  const institutionMap = new Map<string, ChCityProfile["institutions"][number]>()
  for (const row of (institutionResult.data ?? []) as InstitutionRow[]) {
    const location = { id: row.campus_id, name: row.campus_name, addressLine: row.address_line, postalCode: row.postal_code, sourceUrl: row.location_source_url }
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
      identifierMaturity: row.identifier_maturity,
      locations: [location],
    })
  }

  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))

  const popRow = metrics.get("city_population")
  const pop = record(popRow?.value)
  const popAmount = numberValue(pop.amount)

  const livingRow = metrics.get("student_living_cost_monthly_range")
  const living = record(livingRow?.value)
  const livingLow = numberValue(living.low)
  const livingHigh = numberValue(living.high)

  const transportRow = metrics.get("student_transport_reference")
  const transport = record(transportRow?.value)
  const transportAmount = numberValue(transport.amount)
  const transportLow = numberValue(transport.low)
  const transportHigh = numberValue(transport.high)
  const hasTransportValue = transportAmount !== null || (transportLow !== null && transportHigh !== null)

  const workRow = metrics.get("student_work_hours_week")
  const work = record(workRow?.value)
  const hours = numberValue(work.hours_normal_period)

  const sectorRow = metrics.get("employment_focus_sectors")
  const sectors = record(sectorRow?.value)
  const verifiedPartial = city.programme_coverage_status === "verified_partial"

  return {
    id: city.city_id,
    slug: city.slug,
    name: city.name,
    officialMunicipalityName: city.official_municipality_name,
    countryCode: "CH",
    countryName: "Switzerland",
    regionCode: city.region_code,
    regionName: city.region_name,
    municipalityCode: city.municipality_code,
    scopeLabel: `${city.official_municipality_name} municipality`,
    linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count,
    linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    institutionIdentifierMaturity: city.institution_identifier_maturity,
    programmeCoverage: verifiedPartial ? {
      status: "verified_partial",
      label: `${city.linked_program_count} programmes with verified municipality evidence`,
      detail: city.slug === "lausanne"
        ? "The Lausanne municipality profile includes the current UNIL programme cohort with verified municipality linkage. EPFL's Lausanne-labelled programme cohort is deliberately excluded because the main EPFL campus is in Ecublens near Lausanne, and a destination label is not treated as municipality-delivery proof."
        : "Each programme requires exact CH_SWISSUNIVERSITIES offering provenance, the same canonical university, a verified study-location representative and a source city matching this municipality. The current institution foundation covers the 12-university category rather than the complete accredited Swiss HEI universe.",
    } : {
      status: "verification_pending",
      label: "Programme delivery verification pending",
      detail: "Institution presence is never used by itself to infer programme delivery.",
    },
    population: popRow && popAmount !== null ? {
      amount: popAmount,
      geography: stringValue(pop.geography) ?? `${city.official_municipality_name} municipality`,
      dataAsOf: popRow.data_as_of,
    } : null,
    livingCost: livingRow && livingLow !== null && livingHigh !== null ? {
      low: livingLow,
      high: livingHigh,
      currency: stringValue(living.currency) ?? "CHF",
      period: stringValue(living.period) ?? "month",
      referenceKind: stringValue(living.reference_kind),
      studentSpecific: living.student_specific === true,
      note: stringValue(living.note),
    } : null,
    transport: transportRow && hasTransportValue ? {
      amount: transportAmount,
      low: transportLow,
      high: transportHigh,
      currency: stringValue(transport.currency) ?? "CHF",
      period: stringValue(transport.period) ?? "month",
      referenceKind: stringValue(transport.reference_kind),
      studentSpecific: transport.student_specific === true,
      note: stringValue(transport.note),
    } : null,
    workRights: workRow && hours !== null ? {
      hoursNormalPeriod: hours,
      period: stringValue(work.period) ?? "week",
      earliestStartAfterStudyMonths: numberValue(work.earliest_start_after_study_months),
      fullTimeHolidays: work.full_time_holidays === true,
      appliesTo: stringValue(work.applies_to),
      note: stringValue(work.note),
    } : null,
    employmentSectors: stringArray(sectors.sectors),
    employmentSectorBasis: stringValue(sectors.basis),
    employmentContextScope: stringValue(sectors.context_scope),
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
      internationalAdmissionStatus: row.international_admission_status,
      internationalVerificationStatus: row.international_verification_status,
    })),
    sources: [...new Map(metricRows.map((row) => [row.source_url, {
      name: row.source_name,
      url: row.source_url,
      dataAsOf: row.data_as_of,
      confidence: row.confidence,
    }])).values()],
  }
}

export const getChCityProfile = cache(loadChCityProfile)
