import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { SUPPORTED_ES_CITY_SLUGS } from "@/lib/cities/city-routes"
import { getEsCityProfile, type EsCityProfile } from "@/lib/cities/es-city-profile.server"

export type EsCityCompareOption = { slug: string; name: string; regionName: string }
export type EsCityComparison = { left: EsCityProfile; right: EsCityProfile; options: EsCityCompareOption[] }

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

function readyProfile(profile: EsCityProfile) {
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

async function loadCompareReadyEsCities(): Promise<EsCityProfile[]> {
  const [{ data: cityData, error: cityError }, { data: metricData, error: metricError }] = await Promise.all([
    supabaseAdmin
      .from("city_directory_es_v1")
      .select("city_id,slug,linked_campus_count,linked_institution_count")
      .in("slug", [...SUPPORTED_ES_CITY_SLUGS])
      .gt("linked_campus_count", 0)
      .gt("linked_institution_count", 0),
    supabaseAdmin
      .from("city_metric_directory_es_v1")
      .select("city_id,metric_key")
      .in("metric_key", [...REQUIRED_METRIC_KEYS]),
  ])

  if (cityError) throw new Error(`Unable to load Spain compare cities: ${cityError.message}`)
  if (metricError) throw new Error(`Unable to load Spain compare metrics: ${metricError.message}`)

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
    SUPPORTED_ES_CITY_SLUGS.filter((slug) => ready.has(slug)).map((slug) => getEsCityProfile(slug)),
  )).filter((profile): profile is EsCityProfile => Boolean(profile && readyProfile(profile)))
}

export const getCompareReadyEsCities = cache(loadCompareReadyEsCities)

function choosePair(
  profiles: readonly EsCityProfile[],
  requestedLeft?: string | null,
  requestedRight?: string | null,
) {
  if (profiles.length < 2) return null
  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
  const left = bySlug.get(normalizeSlug(requestedLeft)) ?? bySlug.get("madrid") ?? profiles[0]
  if (!left) return null

  const rightSlug = normalizeSlug(requestedRight)
  const requestedRightProfile = rightSlug && rightSlug !== left.slug ? bySlug.get(rightSlug) : undefined
  const defaultRight = left.slug === "madrid" ? bySlug.get("barcelona") : bySlug.get("madrid")
  const right = requestedRightProfile ?? defaultRight ?? profiles.find((profile) => profile.slug !== left.slug)

  return right && right.slug !== left.slug ? { left, right } : null
}

async function loadEsCityComparison(
  left?: string | null,
  right?: string | null,
): Promise<EsCityComparison | null> {
  const profiles = await getCompareReadyEsCities()
  const pair = choosePair(profiles, left, right)
  if (!pair) return null

  return {
    left: pair.left,
    right: pair.right,
    options: profiles.map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      regionName: `${profile.regionName} · ${profile.scopeLabel}`,
    })),
  }
}

export async function getEsCityComparison(left?: string | null, right?: string | null) {
  return loadEsCityComparison(left, right)
}
