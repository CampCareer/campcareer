import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getAuCityProfile, type AuCityProfile } from "@/lib/cities/au-city-profile.server"

export type AuCityCompareOption = {
  slug: string
  name: string
  regionName: string
}

export type AuCityComparison = {
  left: AuCityProfile
  right: AuCityProfile
  options: AuCityCompareOption[]
  sharedProgramCount: number
}

type CityDirectoryCandidate = {
  city_id: string
  slug: string
  linked_campus_count: number
  linked_institution_count: number
}

type CityMetricCandidate = {
  geography_id: string
  metric_key: string
}

const REQUIRED_METRIC_KEYS = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_work_hours_fortnight",
  "employment_focus_sectors",
] as const

const TRANSPORT_METRIC_KEYS = [
  "student_transport_weekly_reference",
  "public_transport_weekly_cap",
  "public_transport_flat_fare",
] as const

const ALL_COMPARE_METRIC_KEYS = [...REQUIRED_METRIC_KEYS, ...TRANSPORT_METRIC_KEYS]

function normalizeSlug(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function isCompareReadyProfile(profile: AuCityProfile) {
  return Boolean(
    profile.population &&
      profile.livingCost &&
      profile.transport &&
      profile.workRights &&
      profile.employmentSectors.length > 0 &&
      profile.linkedCampusCount > 0 &&
      profile.linkedInstitutionCount > 0 &&
      profile.verifiedProgramCount > 0,
  )
}

async function loadCompareReadyAuCities(): Promise<AuCityProfile[]> {
  const [{ data: cityData, error: cityError }, { data: metricData, error: metricError }] = await Promise.all([
    supabaseAdmin
      .from("city_directory_au_v1")
      .select("city_id, slug, linked_campus_count, linked_institution_count")
      .gt("linked_campus_count", 0)
      .gt("linked_institution_count", 0),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("geography_id, metric_key")
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .in("metric_key", [...ALL_COMPARE_METRIC_KEYS]),
  ])

  if (cityError) throw new Error(`Unable to load Australian compare cities: ${cityError.message}`)
  if (metricError) throw new Error(`Unable to load Australian compare city metrics: ${metricError.message}`)

  const metricKeysByCity = new Map<string, Set<string>>()
  for (const row of (metricData ?? []) as CityMetricCandidate[]) {
    const keys = metricKeysByCity.get(row.geography_id) ?? new Set<string>()
    keys.add(row.metric_key)
    metricKeysByCity.set(row.geography_id, keys)
  }

  const candidateSlugs = ((cityData ?? []) as CityDirectoryCandidate[])
    .filter((city) => {
      const keys = metricKeysByCity.get(city.city_id)
      if (!keys) return false
      const hasRequired = REQUIRED_METRIC_KEYS.every((key) => keys.has(key))
      const hasTransport = TRANSPORT_METRIC_KEYS.some((key) => keys.has(key))
      return hasRequired && hasTransport
    })
    .map((city) => city.slug)

  const profiles = (await Promise.all(candidateSlugs.map((slug) => getAuCityProfile(slug)))).filter(
    (profile): profile is AuCityProfile => Boolean(profile && isCompareReadyProfile(profile)),
  )

  return profiles.sort((a, b) => {
    if (b.verifiedProgramCount !== a.verifiedProgramCount) {
      return b.verifiedProgramCount - a.verifiedProgramCount
    }
    return a.name.localeCompare(b.name)
  })
}

export const getCompareReadyAuCities = cache(loadCompareReadyAuCities)

function chooseComparisonPair(
  profiles: readonly AuCityProfile[],
  requestedLeft?: string | null,
  requestedRight?: string | null,
) {
  if (profiles.length < 2) return null

  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
  const leftSlug = normalizeSlug(requestedLeft)
  const rightSlug = normalizeSlug(requestedRight)

  const left = bySlug.get(leftSlug) ?? bySlug.get("sydney") ?? profiles[0]
  if (!left) return null

  const requestedRightProfile =
    rightSlug && rightSlug !== left.slug ? bySlug.get(rightSlug) : undefined
  const right =
    requestedRightProfile ??
    (left.slug !== "melbourne" ? bySlug.get("melbourne") : undefined) ??
    profiles.find((profile) => profile.slug !== left.slug)

  if (!right || left.slug === right.slug) return null
  return { left, right }
}

async function loadAuCityComparison(
  requestedLeft?: string | null,
  requestedRight?: string | null,
): Promise<AuCityComparison | null> {
  const profiles = await getCompareReadyAuCities()
  const pair = chooseComparisonPair(profiles, requestedLeft, requestedRight)
  if (!pair) return null

  const { count: sharedProgramCount, error: sharedProgramsError } = await supabaseAdmin
    .from("courses_au")
    .select("id", { count: "exact", head: true })
    .eq("cricos_status", "active")
    .contains("verified_city_slugs", [pair.left.slug, pair.right.slug])

  if (sharedProgramsError) {
    throw new Error(
      `Unable to count shared programs for ${pair.left.name} and ${pair.right.name}: ${sharedProgramsError.message}`,
    )
  }

  return {
    left: pair.left,
    right: pair.right,
    options: profiles.map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      regionName: profile.regionName,
    })),
    sharedProgramCount: sharedProgramCount ?? 0,
  }
}

export async function getAuCityComparison(
  leftSlug?: string | null,
  rightSlug?: string | null,
): Promise<AuCityComparison | null> {
  return loadAuCityComparison(leftSlug, rightSlug)
}
