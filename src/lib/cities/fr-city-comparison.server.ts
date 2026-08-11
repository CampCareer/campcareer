import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { PUBLISHED_FR_CITY_SLUGS } from "@/lib/cities/city-routes"
import { getFrCityProfile, type FrCityProfile } from "@/lib/cities/fr-city-profile.server"

export type FrCityCompareOption = {
  slug: string
  name: string
  regionName: string
}

export type FrCityComparison = {
  left: FrCityProfile
  right: FrCityProfile
  options: FrCityCompareOption[]
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
  "student_transport_reference",
  "student_work_hours_year",
  "employment_focus_sectors",
] as const

function normalizeSlug(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function isCompareReadyProfile(profile: FrCityProfile) {
  return Boolean(
    profile.population &&
      profile.livingCost &&
      profile.transport &&
      profile.workRights &&
      profile.employmentSectors.length > 0 &&
      profile.linkedCampusCount > 0 &&
      profile.linkedInstitutionCount > 0,
  )
}

async function loadCompareReadyFrCities(): Promise<FrCityProfile[]> {
  const [{ data: cityData, error: cityError }, { data: metricData, error: metricError }] = await Promise.all([
    supabaseAdmin
      .from("city_directory_fr_v1")
      .select("city_id,slug,linked_campus_count,linked_institution_count")
      .in("slug", [...PUBLISHED_FR_CITY_SLUGS])
      .gt("linked_campus_count", 0)
      .gt("linked_institution_count", 0),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("geography_id,metric_key")
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .in("metric_key", [...REQUIRED_METRIC_KEYS]),
  ])

  if (cityError) throw new Error(`Unable to load France compare cities: ${cityError.message}`)
  if (metricError) throw new Error(`Unable to load France compare metrics: ${metricError.message}`)

  const metricKeysByCity = new Map<string, Set<string>>()
  for (const row of (metricData ?? []) as CityMetricCandidate[]) {
    const keys = metricKeysByCity.get(row.geography_id) ?? new Set<string>()
    keys.add(row.metric_key)
    metricKeysByCity.set(row.geography_id, keys)
  }

  const ready = new Set(
    ((cityData ?? []) as CityDirectoryCandidate[])
      .filter((city) => {
        const keys = metricKeysByCity.get(city.city_id)
        return Boolean(keys && REQUIRED_METRIC_KEYS.every((key) => keys.has(key)))
      })
      .map((city) => city.slug),
  )

  return (await Promise.all(
    PUBLISHED_FR_CITY_SLUGS.filter((slug) => ready.has(slug)).map((slug) => getFrCityProfile(slug)),
  )).filter((profile): profile is FrCityProfile => Boolean(profile && isCompareReadyProfile(profile)))
}

export const getCompareReadyFrCities = cache(loadCompareReadyFrCities)

function chooseComparisonPair(
  profiles: readonly FrCityProfile[],
  requestedLeft?: string | null,
  requestedRight?: string | null,
) {
  if (profiles.length < 2) return null

  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
  const leftSlug = normalizeSlug(requestedLeft)
  const rightSlug = normalizeSlug(requestedRight)
  const left = bySlug.get(leftSlug) ?? bySlug.get("paris") ?? profiles[0]
  if (!left) return null

  const requestedRightProfile = rightSlug && rightSlug !== left.slug ? bySlug.get(rightSlug) : undefined
  const defaultRight = left.slug === "paris" ? bySlug.get("paris-saclay") : bySlug.get("paris")
  const right = requestedRightProfile ??
    (defaultRight?.slug !== left.slug ? defaultRight : undefined) ??
    profiles.find((profile) => profile.slug !== left.slug)

  if (!right || left.slug === right.slug) return null
  return { left, right }
}

async function loadFrCityComparison(
  requestedLeft?: string | null,
  requestedRight?: string | null,
): Promise<FrCityComparison | null> {
  const profiles = await getCompareReadyFrCities()
  const pair = chooseComparisonPair(profiles, requestedLeft, requestedRight)
  if (!pair) return null

  return {
    left: pair.left,
    right: pair.right,
    options: profiles.map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      regionName: `${profile.region} · ${profile.populationGeographyLabel}`,
    })),
  }
}

export async function getFrCityComparison(
  leftSlug?: string | null,
  rightSlug?: string | null,
): Promise<FrCityComparison | null> {
  return loadFrCityComparison(leftSlug, rightSlug)
}
