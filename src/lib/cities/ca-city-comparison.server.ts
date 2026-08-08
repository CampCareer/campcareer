import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getCaCityProfile, type CaCityProfile } from "@/lib/cities/ca-city-profile.server"

export type CaCityCompareOption = {
  slug: string
  name: string
  regionName: string
}

export type CaCityComparison = {
  left: CaCityProfile
  right: CaCityProfile
  options: CaCityCompareOption[]
  sharedProgramCount: number
}

type CityDirectoryCandidate = {
  city_id: string
  slug: string
  linked_campus_count: number
  linked_institution_count: number
  linked_program_count: number
}

type CityMetricCandidate = {
  geography_id: string
  metric_key: string
}

type CityProgrammeRow = {
  city_id: string
  programme_id: string
}

const REQUIRED_METRIC_KEYS = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

function normalizeSlug(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function isCompareReadyProfile(profile: CaCityProfile) {
  return Boolean(
    profile.population &&
      profile.livingCost &&
      profile.transport &&
      profile.workRights &&
      profile.employmentSectors.length > 0 &&
      profile.linkedCampusCount > 0 &&
      profile.linkedInstitutionCount > 0 &&
      profile.linkedProgramCount > 0,
  )
}

async function loadCompareReadyCaCities(): Promise<CaCityProfile[]> {
  const [{ data: cityData, error: cityError }, { data: metricData, error: metricError }] = await Promise.all([
    supabaseAdmin
      .from("city_directory_ca_v1")
      .select("city_id,slug,linked_campus_count,linked_institution_count,linked_program_count")
      .gt("linked_campus_count", 0)
      .gt("linked_institution_count", 0)
      .gt("linked_program_count", 0),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("geography_id,metric_key")
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .in("metric_key", [...REQUIRED_METRIC_KEYS]),
  ])

  if (cityError) throw new Error(`Unable to load Canadian compare cities: ${cityError.message}`)
  if (metricError) throw new Error(`Unable to load Canadian compare city metrics: ${metricError.message}`)

  const metricKeysByCity = new Map<string, Set<string>>()
  for (const row of (metricData ?? []) as CityMetricCandidate[]) {
    const keys = metricKeysByCity.get(row.geography_id) ?? new Set<string>()
    keys.add(row.metric_key)
    metricKeysByCity.set(row.geography_id, keys)
  }

  const candidateSlugs = ((cityData ?? []) as CityDirectoryCandidate[])
    .filter((city) => {
      const keys = metricKeysByCity.get(city.city_id)
      return Boolean(keys && REQUIRED_METRIC_KEYS.every((key) => keys.has(key)))
    })
    .map((city) => city.slug)

  const profiles = (await Promise.all(candidateSlugs.map((slug) => getCaCityProfile(slug)))).filter(
    (profile): profile is CaCityProfile => Boolean(profile && isCompareReadyProfile(profile)),
  )

  return profiles.sort((a, b) => {
    if (b.linkedProgramCount !== a.linkedProgramCount) return b.linkedProgramCount - a.linkedProgramCount
    return a.name.localeCompare(b.name)
  })
}

export const getCompareReadyCaCities = cache(loadCompareReadyCaCities)

function chooseComparisonPair(
  profiles: readonly CaCityProfile[],
  requestedLeft?: string | null,
  requestedRight?: string | null,
) {
  if (profiles.length < 2) return null

  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
  const leftSlug = normalizeSlug(requestedLeft)
  const rightSlug = normalizeSlug(requestedRight)
  const left = bySlug.get(leftSlug) ?? bySlug.get("toronto") ?? profiles[0]
  if (!left) return null

  const requestedRightProfile = rightSlug && rightSlug !== left.slug ? bySlug.get(rightSlug) : undefined
  const defaultRight = left.slug === "toronto" ? bySlug.get("vancouver") : bySlug.get("toronto")
  const right =
    requestedRightProfile ??
    (defaultRight?.slug !== left.slug ? defaultRight : undefined) ??
    profiles.find((profile) => profile.slug !== left.slug)

  if (!right || left.slug === right.slug) return null
  return { left, right }
}

async function countSharedProgrammes(leftCityId: string, rightCityId: string) {
  const { data, error } = await supabaseAdmin
    .from("city_programme_directory_ca_v1")
    .select("city_id,programme_id")
    .in("city_id", [leftCityId, rightCityId])

  if (error) throw new Error(`Unable to load shared Canadian city programmes: ${error.message}`)

  const leftProgrammes = new Set<string>()
  const rightProgrammes = new Set<string>()
  for (const row of (data ?? []) as CityProgrammeRow[]) {
    if (row.city_id === leftCityId) leftProgrammes.add(row.programme_id)
    if (row.city_id === rightCityId) rightProgrammes.add(row.programme_id)
  }

  let shared = 0
  for (const programmeId of leftProgrammes) {
    if (rightProgrammes.has(programmeId)) shared += 1
  }
  return shared
}

async function loadCaCityComparison(
  requestedLeft?: string | null,
  requestedRight?: string | null,
): Promise<CaCityComparison | null> {
  const profiles = await getCompareReadyCaCities()
  const pair = chooseComparisonPair(profiles, requestedLeft, requestedRight)
  if (!pair) return null

  return {
    left: pair.left,
    right: pair.right,
    options: profiles.map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      regionName: profile.regionName,
    })),
    sharedProgramCount: await countSharedProgrammes(pair.left.id, pair.right.id),
  }
}

export async function getCaCityComparison(
  leftSlug?: string | null,
  rightSlug?: string | null,
): Promise<CaCityComparison | null> {
  return loadCaCityComparison(leftSlug, rightSlug)
}
