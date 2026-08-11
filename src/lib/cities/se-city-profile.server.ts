import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedSeCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  slug: string
  name: string
  region_code: string
  region_name: string
  municipality_code: string
  study_destination_scope: string
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
  institution_coverage_status: string
  programme_coverage_status: string
}

type InstitutionRow = {
  institution_id: string
  institution_name: string
  institution_slug: string
  website_url: string | null
  authority_identifier: string
  authority_source_url: string
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

export type SeCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "SE"
  countryName: "Sweden"
  regionCode: string
  regionName: string
  municipalityCode: string
  scopeLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  linkedProgramCount: number
  institutionCoverageStatus: string
  programmeCoverage: { status: "verified_partial" | "verification_pending"; label: string; detail: string }
  population: { amount: number; geography: string; dataAsOf: string } | null
  livingCost: { low: number; high: number; currency: string; period: string; citySpecific: boolean } | null
  transport: { amount: number; currency: string; period: string; referenceKind: string | null; note: string | null } | null
  workRights: { hoursNormalPeriod: number; period: string; effectiveFrom: string | null; unlimitedWorkMonths: string[]; note: string | null } | null
  employmentSectors: string[]
  employmentSectorBasis: string | null
  institutions: Array<{
    id: string
    name: string
    slug: string
    websiteUrl: string | null
    authorityIdentifier: string
    authoritySourceUrl: string
    locations: Array<{ id: string; name: string; addressLine: string | null; postalCode: string | null; sourceUrl: string }>
  }>
  programmeSample: Array<{
    id: string
    title: string
    type: string | null
    fieldName: string | null
    institutionName: string
    institutionSlug: string
    locationName: string
    enrolmentStatus: string | null
    officialUrl: string
    verificationTier: string
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

async function loadSeCityProfile(input: string): Promise<SeCityProfile | null> {
  const slug = normalizeCitySlug(input)
  if (!slug || !isPublishedSeCitySlug(slug)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin
    .from("city_directory_se_v1")
    .select("city_id,slug,name,region_code,region_name,municipality_code,study_destination_scope,linked_campus_count,linked_institution_count,linked_program_count,institution_coverage_status,programme_coverage_status")
    .eq("slug", slug)
    .maybeSingle()
  if (cityError) throw new Error(`Unable to load Sweden city: ${cityError.message}`)
  if (!cityData) return null
  const city = cityData as CityRow

  const [institutionResult, programmeResult, metricResult] = await Promise.all([
    supabaseAdmin.from("city_institution_directory_se_v1")
      .select("institution_id,institution_name,institution_slug,website_url,authority_identifier,authority_source_url,campus_id,campus_name,address_line,postal_code,location_source_url")
      .eq("city_id", city.city_id).order("institution_name", { ascending: true }),
    supabaseAdmin.from("city_programme_directory_se_v1")
      .select("programme_id,programme_title,programme_type,field_name,institution_name,institution_slug,campus_name,enrolment_status,official_program_url,verification_tier")
      .eq("city_id", city.city_id).order("programme_title", { ascending: true }).limit(8),
    supabaseAdmin.from("report_metric_evidence_city")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("geography_id", city.city_id).eq("scope_type", "city").eq("review_status", "verified")
      .in("metric_key", ["city_population","student_living_cost_monthly_range","student_transport_reference","student_work_hours_week","employment_focus_sectors"])
      .order("metric_key", { ascending: true }),
  ])
  if (institutionResult.error) throw new Error(`Unable to load Sweden city institutions: ${institutionResult.error.message}`)
  if (programmeResult.error) throw new Error(`Unable to load Sweden city programmes: ${programmeResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load Sweden city metrics: ${metricResult.error.message}`)

  const institutionMap = new Map<string, SeCityProfile["institutions"][number]>()
  for (const row of (institutionResult.data ?? []) as InstitutionRow[]) {
    const location = { id: row.campus_id, name: row.campus_name, addressLine: row.address_line, postalCode: row.postal_code, sourceUrl: row.location_source_url }
    const existing = institutionMap.get(row.institution_id)
    if (existing) existing.locations.push(location)
    else institutionMap.set(row.institution_id, {
      id: row.institution_id, name: row.institution_name, slug: row.institution_slug, websiteUrl: row.website_url,
      authorityIdentifier: row.authority_identifier, authoritySourceUrl: row.authority_source_url, locations: [location],
    })
  }

  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))
  const popRow = metrics.get("city_population"); const pop = record(popRow?.value); const popAmount = numberValue(pop.amount)
  const livingRow = metrics.get("student_living_cost_monthly_range"); const living = record(livingRow?.value); const low = numberValue(living.low); const high = numberValue(living.high)
  const transportRow = metrics.get("student_transport_reference"); const transport = record(transportRow?.value); const fare = numberValue(transport.amount)
  const workRow = metrics.get("student_work_hours_week"); const work = record(workRow?.value); const hours = numberValue(work.hours_normal_period)
  const sectorRow = metrics.get("employment_focus_sectors"); const sectors = record(sectorRow?.value)

  const verifiedPartial = city.programme_coverage_status === "verified_partial"
  return {
    id: city.city_id, slug: city.slug, name: city.name, countryCode: "SE", countryName: "Sweden",
    regionCode: city.region_code, regionName: city.region_name, municipalityCode: city.municipality_code,
    scopeLabel: `${city.name} Municipality`, linkedCampusCount: city.linked_campus_count,
    linkedInstitutionCount: city.linked_institution_count, linkedProgramCount: city.linked_program_count,
    institutionCoverageStatus: city.institution_coverage_status,
    programmeCoverage: verifiedPartial ? {
      status: "verified_partial",
      label: `${city.linked_program_count} programmes with verified city evidence`,
      detail: "The published cohort requires the official Sweden programme source city to match the verified university location in this SCB municipality. It covers the selected university core, not every Swedish higher-education provider or programme in the municipality.",
    } : {
      status: "verification_pending", label: "Programme delivery verification pending",
      detail: "Institution presence is never used by itself to infer programme delivery.",
    },
    population: popRow && popAmount !== null ? { amount: popAmount, geography: stringValue(pop.geography) ?? `${city.name} Municipality`, dataAsOf: popRow.data_as_of } : null,
    livingCost: livingRow && low !== null && high !== null ? { low, high, currency: stringValue(living.currency) ?? "SEK", period: stringValue(living.period) ?? "month", citySpecific: living.city_specific === true } : null,
    transport: transportRow && fare !== null ? { amount: fare, currency: stringValue(transport.currency) ?? "SEK", period: stringValue(transport.period) ?? "source_native", referenceKind: stringValue(transport.reference_kind), note: stringValue(transport.note) } : null,
    workRights: workRow && hours !== null ? { hoursNormalPeriod: hours, period: stringValue(work.period) ?? "week", effectiveFrom: stringValue(work.effective_for_permit_granted_on_or_after), unlimitedWorkMonths: stringArray(work.unlimited_work_months), note: stringValue(work.note) } : null,
    employmentSectors: stringArray(sectors.sectors), employmentSectorBasis: stringValue(sectors.basis),
    institutions: [...institutionMap.values()].sort((a,b) => a.name.localeCompare(b.name)),
    programmeSample: ((programmeResult.data ?? []) as ProgrammeRow[]).map((row) => ({ id: row.programme_id, title: row.programme_title, type: row.programme_type, fieldName: row.field_name, institutionName: row.institution_name, institutionSlug: row.institution_slug, locationName: row.campus_name, enrolmentStatus: row.enrolment_status, officialUrl: row.official_program_url, verificationTier: row.verification_tier })),
    sources: [...new Map(metricRows.map((row) => [row.source_url, { name: row.source_name, url: row.source_url, dataAsOf: row.data_as_of, confidence: row.confidence }])).values()],
  }
}

export const getSeCityProfile = cache(loadSeCityProfile)
