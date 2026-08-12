import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { SUPPORTED_AE_CITY_SLUGS } from "@/lib/cities/city-routes"
import { getAeCityProfile, type AeCityProfile } from "@/lib/cities/ae-city-profile.server"

export type AeCityCompareOption = { slug: string; name: string; regionName: string }
export type AeCityComparison = { left: AeCityProfile; right: AeCityProfile; options: AeCityCompareOption[] }

type CityCandidate = { city_id: string; slug: string; linked_campus_count: number; linked_institution_count: number }
type MetricCandidate = { city_id: string; metric_key: string }

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

function readyProfile(profile: AeCityProfile) {
  return Boolean(
    profile.population &&
    profile.livingCost &&
    profile.transport &&
    profile.workContext &&
    profile.employmentSectors.length > 0 &&
    profile.linkedCampusCount > 0 &&
    profile.linkedInstitutionCount > 0,
  )
}

async function loadCompareReadyAeCities(): Promise<AeCityProfile[]> {
  const [{ data: cityData, error: cityError }, { data: metricData, error: metricError }] = await Promise.all([
    supabaseAdmin
      .from("city_directory_ae_v1")
      .select("city_id,slug,linked_campus_count,linked_institution_count")
      .in("slug", [...SUPPORTED_AE_CITY_SLUGS])
      .gt("linked_campus_count", 0)
      .gt("linked_institution_count", 0),
    supabaseAdmin
      .from("city_metric_directory_ae_v1")
      .select("city_id,metric_key")
      .in("metric_key", [...REQUIRED_METRIC_KEYS]),
  ])

  if (cityError) throw new Error(`Unable to load UAE compare cities: ${cityError.message}`)
  if (metricError) throw new Error(`Unable to load UAE compare metrics: ${metricError.message}`)

  const keysByCity = new Map<string, Set<string>>()
  for (const row of (metricData ?? []) as MetricCandidate[]) {
    const set = keysByCity.get(row.city_id) ?? new Set<string>()
    set.add(row.metric_key)
    keysByCity.set(row.city_id, set)
  }

  const ready = new Set(
    ((cityData ?? []) as CityCandidate[])
      .filter((city) => {
        const keys = keysByCity.get(city.city_id)
        return Boolean(keys && REQUIRED_METRIC_KEYS.every((key) => keys.has(key)))
      })
      .map((city) => city.slug),
  )

  return (await Promise.all(
    SUPPORTED_AE_CITY_SLUGS.filter((slug) => ready.has(slug)).map((slug) => getAeCityProfile(slug)),
  )).filter((profile): profile is AeCityProfile => Boolean(profile && readyProfile(profile)))
}

export const getCompareReadyAeCities = cache(loadCompareReadyAeCities)

function choosePair(
  profiles: readonly AeCityProfile[],
  requestedLeft?: string | null,
  requestedRight?: string | null,
) {
  if (profiles.length < 2) return null
  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
  const left = bySlug.get(normalizeSlug(requestedLeft)) ?? bySlug.get("abu-dhabi") ?? profiles[0]
  if (!left) return null

  const rightSlug = normalizeSlug(requestedRight)
  const requestedRightProfile = rightSlug && rightSlug !== left.slug ? bySlug.get(rightSlug) : undefined
  const defaultRight = left.slug === "abu-dhabi" ? bySlug.get("dubai") : bySlug.get("abu-dhabi")
  const right = requestedRightProfile ?? defaultRight ?? profiles.find((profile) => profile.slug !== left.slug)

  return right && right.slug !== left.slug ? { left, right } : null
}

async function loadAeCityComparison(
  left?: string | null,
  right?: string | null,
): Promise<AeCityComparison | null> {
  const profiles = await getCompareReadyAeCities()
  const pair = choosePair(profiles, left, right)
  if (!pair) return null

  return {
    left: pair.left,
    right: pair.right,
    options: profiles.map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      regionName: `${profile.emirateName} emirate · ${profile.scopeLabel}`,
    })),
  }
}

export async function getAeCityComparison(left?: string | null, right?: string | null) {
  return loadAeCityComparison(left, right)
}
