import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { SUPPORTED_CH_CITY_SLUGS } from "@/lib/cities/city-routes"
import { getChCityProfile, type ChCityProfile } from "@/lib/cities/ch-city-profile.server"

export type ChCityCompareOption = { slug: string; name: string; regionName: string }
export type ChCityComparison = { left: ChCityProfile; right: ChCityProfile; options: ChCityCompareOption[] }

type CityCandidate = { city_id: string; slug: string; linked_campus_count: number; linked_institution_count: number }
type MetricCandidate = { geography_id: string; metric_key: string }

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

function readyProfile(profile: ChCityProfile) {
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

async function loadCompareReadyChCities(): Promise<ChCityProfile[]> {
  const [{ data: cityData, error: cityError }, { data: metricData, error: metricError }] = await Promise.all([
    supabaseAdmin
      .from("city_directory_ch_v1")
      .select("city_id,slug,linked_campus_count,linked_institution_count")
      .in("slug", [...SUPPORTED_CH_CITY_SLUGS])
      .gt("linked_campus_count", 0)
      .gt("linked_institution_count", 0),
    supabaseAdmin
      .from("report_metric_evidence_city")
      .select("geography_id,metric_key")
      .eq("scope_type", "city")
      .eq("review_status", "verified")
      .in("metric_key", [...REQUIRED_METRIC_KEYS]),
  ])

  if (cityError) throw new Error(`Unable to load Switzerland compare cities: ${cityError.message}`)
  if (metricError) throw new Error(`Unable to load Switzerland compare metrics: ${metricError.message}`)

  const keysByCity = new Map<string, Set<string>>()
  for (const row of (metricData ?? []) as MetricCandidate[]) {
    const set = keysByCity.get(row.geography_id) ?? new Set<string>()
    set.add(row.metric_key)
    keysByCity.set(row.geography_id, set)
  }

  const ready = new Set(
    ((cityData ?? []) as CityCandidate[])
      .filter((city) => {
        const keys = keysByCity.get(city.city_id)
        return Boolean(keys && REQUIRED_METRIC_KEYS.every((key) => keys.has(key)))
      })
      .map((city) => city.slug),
  )

  return (
    await Promise.all(
      SUPPORTED_CH_CITY_SLUGS.filter((slug) => ready.has(slug)).map((slug) => getChCityProfile(slug)),
    )
  ).filter((profile): profile is ChCityProfile => Boolean(profile && readyProfile(profile)))
}

export const getCompareReadyChCities = cache(loadCompareReadyChCities)

function choosePair(
  profiles: readonly ChCityProfile[],
  requestedLeft?: string | null,
  requestedRight?: string | null,
) {
  if (profiles.length < 2) return null

  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
  const left = bySlug.get(normalizeSlug(requestedLeft)) ?? bySlug.get("zurich") ?? profiles[0]
  if (!left) return null

  const rightSlug = normalizeSlug(requestedRight)
  const requestedRightProfile = rightSlug && rightSlug !== left.slug ? bySlug.get(rightSlug) : undefined
  const defaultRight = left.slug === "zurich" ? bySlug.get("lausanne") : bySlug.get("zurich")
  const right = requestedRightProfile ?? defaultRight ?? profiles.find((profile) => profile.slug !== left.slug)

  return right && right.slug !== left.slug ? { left, right } : null
}

async function loadChCityComparison(
  left?: string | null,
  right?: string | null,
): Promise<ChCityComparison | null> {
  const profiles = await getCompareReadyChCities()
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

export async function getChCityComparison(left?: string | null, right?: string | null) {
  return loadChCityComparison(left, right)
}
