import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { isPublishedFrCitySlug, normalizeCitySlug } from "@/lib/cities/city-routes"

type CityRow = {
  city_id: string
  slug: string
  name: string
  region: string
  scope_kind: string
  study_destination_scope: string
  population_geography_contract: string
  population_geography_label: string
  linked_campus_count: number
  linked_institution_count: number
  institution_coverage_status: string
  programme_coverage_status: string
}

type InstitutionRow = {
  city_id: string
  campus_id: string
  institution_id: string
  institution_name: string
  institution_slug: string
  official_identity: string
  identity_source_url: string
  website_url: string
  campus_name: string
  campus_city: string
  locality: string | null
  address_line: string | null
  postal_code: string | null
  location_source_url: string
  linkage_basis: string
}

type MetricRow = { metric_key: string; value: unknown; source_name: string; source_url: string; data_as_of: string; confidence: string }

type Campus = { id: string; name: string; city: string; locality: string | null; addressLine: string | null; postalCode: string | null; sourceUrl: string; linkageBasis: string }
export type FrCityInstitution = { id: string; name: string; slug: string; websiteUrl: string; officialIdentity: string; identitySourceUrl: string; campuses: Campus[] }

export type FrCityProfile = {
  id: string
  slug: string
  name: string
  countryCode: "FR"
  countryName: "France"
  region: string
  scopeKind: string
  studyDestinationScope: string
  populationGeographyLabel: string
  linkedCampusCount: number
  linkedInstitutionCount: number
  institutionCoverageStatus: string
  programmeCoverage: { status: "verification_pending"; label: string; detail: string }
  population: { amount: number; geography: string; geographyKind: string | null; officialCode: string | null; dataAsOf: string } | null
  livingCost: { low: number; high: number; currency: string; period: string; referenceKind: string | null; note: string | null; confidence: string } | null
  transport: { amount: number; period: string; currency: string; referenceKind: string; eligibility: string | null; effectiveFrom: string | null } | null
  workRights: { hours: number; period: string; normalWorkShare: number | null; exception: string | null; nationalRule: boolean; note: string | null } | null
  employmentSectors: Array<{ name: string; sharePercent: number | null }>
  employmentSectorBasis: string | null
  institutions: FrCityInstitution[]
  sources: Array<{ name: string; url: string; dataAsOf: string; confidence: string }>
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : null }
  return null
}
function str(value: unknown): string | null { return typeof value === "string" && value.trim() ? value : null }
function sectors(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const row = record(item)
    const name = str(row.name)
    if (!name) return []
    return [{ name, sharePercent: num(row.share_percent) }]
  })
}
function groupInstitutions(rows: InstitutionRow[]): FrCityInstitution[] {
  const map = new Map<string, FrCityInstitution>()
  for (const row of rows) {
    const campus: Campus = { id: row.campus_id, name: row.campus_name, city: row.campus_city, locality: row.locality, addressLine: row.address_line, postalCode: row.postal_code, sourceUrl: row.location_source_url, linkageBasis: row.linkage_basis }
    const current = map.get(row.institution_id)
    if (current) current.campuses.push(campus)
    else map.set(row.institution_id, { id: row.institution_id, name: row.institution_name, slug: row.institution_slug, websiteUrl: row.website_url, officialIdentity: row.official_identity, identitySourceUrl: row.identity_source_url, campuses: [campus] })
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function loadFrCityProfile(slug: string): Promise<FrCityProfile | null> {
  const normalized = normalizeCitySlug(slug)
  if (!normalized || !isPublishedFrCitySlug(normalized)) return null

  const { data: cityData, error: cityError } = await supabaseAdmin.from("city_directory_fr_v1")
    .select("city_id,slug,name,region,scope_kind,study_destination_scope,population_geography_contract,population_geography_label,linked_campus_count,linked_institution_count,institution_coverage_status,programme_coverage_status")
    .eq("slug", normalized).maybeSingle()
  if (cityError) throw new Error(`Unable to load France city: ${cityError.message}`)
  if (!cityData) return null
  const city = cityData as CityRow

  const [institutionResult, metricResult] = await Promise.all([
    supabaseAdmin.from("city_institution_directory_fr_v1")
      .select("city_id,campus_id,institution_id,institution_name,institution_slug,official_identity,identity_source_url,website_url,campus_name,campus_city,locality,address_line,postal_code,location_source_url,linkage_basis")
      .eq("city_id", city.city_id).order("institution_name", { ascending: true }),
    supabaseAdmin.from("report_metric_evidence_city")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence")
      .eq("geography_id", city.city_id).eq("scope_type", "city").eq("review_status", "verified")
      .in("metric_key", ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_year", "employment_focus_sectors"]),
  ])
  if (institutionResult.error) throw new Error(`Unable to load France city institutions: ${institutionResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load France city metrics: ${metricResult.error.message}`)

  const rows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(rows.map((row) => [row.metric_key, row]))
  const populationRow = metrics.get("city_population"); const population = record(populationRow?.value)
  const livingRow = metrics.get("student_living_cost_monthly_range"); const living = record(livingRow?.value)
  const transportRow = metrics.get("student_transport_reference"); const transport = record(transportRow?.value)
  const workRow = metrics.get("student_work_hours_year"); const work = record(workRow?.value)
  const sectorValue = record(metrics.get("employment_focus_sectors")?.value)
  const populationAmount = num(population.amount); const livingLow = num(living.low); const livingHigh = num(living.high); const transportAmount = num(transport.amount); const workHours = num(work.hours)

  return {
    id: city.city_id, slug: city.slug, name: city.name, countryCode: "FR", countryName: "France", region: city.region,
    scopeKind: city.scope_kind, studyDestinationScope: city.study_destination_scope, populationGeographyLabel: city.population_geography_label,
    linkedCampusCount: city.linked_campus_count, linkedInstitutionCount: city.linked_institution_count, institutionCoverageStatus: city.institution_coverage_status,
    programmeCoverage: { status: "verification_pending", label: "France programme delivery verification pending", detail: "CampCareer has 132 verified France programme offering records, but the inherited registered-location relationships do not prove delivery at the Phase 3 verified teaching locations. Institution or teaching-location presence is never used to infer city programme availability." },
    population: populationRow && populationAmount != null ? { amount: populationAmount, geography: str(population.geography) ?? city.population_geography_label, geographyKind: str(population.geography_kind), officialCode: str(population.official_code), dataAsOf: populationRow.data_as_of } : null,
    livingCost: livingRow && livingLow != null && livingHigh != null ? { low: livingLow, high: livingHigh, currency: str(living.currency) ?? "EUR", period: str(living.period) ?? "month", referenceKind: str(living.reference_kind), note: str(living.note), confidence: livingRow.confidence } : null,
    transport: transportRow && transportAmount != null ? { amount: transportAmount, period: str(transport.period) ?? "published_period", currency: str(transport.currency) ?? "EUR", referenceKind: str(transport.reference_kind) ?? "student_transport_reference", eligibility: str(transport.eligibility), effectiveFrom: str(transport.effective_from) } : null,
    workRights: workRow && workHours != null ? { hours: workHours, period: str(work.period) ?? "year", normalWorkShare: num(work.normal_work_share), exception: str(work.exception), nationalRule: work.national_rule === true, note: str(work.note) } : null,
    employmentSectors: sectors(sectorValue.sectors), employmentSectorBasis: str(sectorValue.basis),
    institutions: groupInstitutions((institutionResult.data ?? []) as InstitutionRow[]),
    sources: Array.from(new Map(rows.map((row) => [row.source_url, { name: row.source_name, url: row.source_url, dataAsOf: row.data_as_of, confidence: row.confidence }])).values()),
  }
}

export const getFrCityProfile = cache(loadFrCityProfile)
