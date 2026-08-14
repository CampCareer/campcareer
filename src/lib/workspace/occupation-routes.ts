import { CANONICAL_CAREERS } from "@/data/career-comparison-catalog"
import {
  getLaunchCountry,
  getLaunchCountryBySlug,
  type LaunchCountry,
  type LaunchCountryCode,
} from "@/data/launch-countries"

export type IndexableCareerProfile = {
  countryCode: LaunchCountryCode
  careerId: string
  sourceCheckedAt: string
}

/** @deprecated Use IndexableCareerProfile. Kept while legacy /occupation URLs redirect. */
export type IndexableOccupationProfile = IndexableCareerProfile

/**
 * Explicit SEO publication inventory.
 *
 * This list must match the strict Ready pool in docs/CAREER_COVERAGE_INVENTORY.md.
 * A profile or provisional score is not enough to make a Career page indexable.
 */
export const INDEXABLE_CAREER_PROFILES: readonly IndexableCareerProfile[] = [
  { countryCode: "AU", careerId: "care-worker", sourceCheckedAt: "2026-08-14" },
  { countryCode: "AU", careerId: "carpenter", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "electrician", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "midwife", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "occupational-therapist", sourceCheckedAt: "2026-08-08" },
  { countryCode: "AU", careerId: "physiotherapist", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "registered-nurse", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "welder", sourceCheckedAt: "2026-08-14" },
] as const

/** @deprecated Use INDEXABLE_CAREER_PROFILES. */
export const INDEXABLE_OCCUPATION_PROFILES = INDEXABLE_CAREER_PROFILES

const careerById = new Map(CANONICAL_CAREERS.map((career) => [career.id, career]))
const indexableProfileKeys = new Set(
  INDEXABLE_CAREER_PROFILES.map(({ countryCode, careerId }) => `${countryCode}:${careerId}`),
)

export function normalizeOccupationCountryCode(value: string) {
  const normalized = value.trim().toUpperCase()
  return normalized === "GB" ? "UK" : normalized
}

function resolveCareerCountry(value: string): LaunchCountry | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  return getLaunchCountry(normalizeOccupationCountryCode(trimmed))
    ?? getLaunchCountryBySlug(trimmed.toLowerCase())
}

/**
 * Stable public Career identity.
 *
 * Database/data joins keep `countryCode + careerId`; the URL projects the
 * country to its human-readable launch slug so routing and storage can evolve
 * independently.
 */
export function getCareerRoute(country: string, careerId: string) {
  const resolvedCountry = resolveCareerCountry(country)
  const normalizedCareerId = careerId.trim().toLowerCase()
  const career = careerById.get(normalizedCareerId)
  if (!resolvedCountry || !career) return null

  return {
    country: resolvedCountry,
    career,
    path: `/career/${resolvedCountry.slug}/${career.id}`,
  }
}

export function careerCanonicalPath(country: string, careerId: string) {
  const route = getCareerRoute(country, careerId)
  if (!route) throw new Error(`Unsupported Career route: ${country}/${careerId}`)
  return route.path
}

export function getIndexableCareerRoute(country: string, careerId: string) {
  const route = getCareerRoute(country, careerId)
  if (!route) return null
  if (!indexableProfileKeys.has(`${route.country.code}:${route.career.id}`)) return null

  const profile = INDEXABLE_CAREER_PROFILES.find(
    (item) => item.countryCode === route.country.code && item.careerId === route.career.id,
  )!

  return {
    ...route,
    sourceCheckedAt: profile.sourceCheckedAt,
  }
}

/** @deprecated Legacy name. Canonical URLs now live under /career. */
export const occupationCanonicalPath = careerCanonicalPath

/** @deprecated Legacy name. Canonical URLs now live under /career. */
export const getIndexableOccupationRoute = getIndexableCareerRoute
