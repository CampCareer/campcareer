import { CANONICAL_CAREERS } from "@/data/career-comparison-catalog"
import { getLaunchCountry, type LaunchCountryCode } from "@/data/launch-countries"

export type IndexableOccupationProfile = {
  countryCode: LaunchCountryCode
  careerId: string
  sourceCheckedAt: string
}

/** Explicit SEO publication inventory. Only source-reviewed AU profiles are listed. */
export const INDEXABLE_OCCUPATION_PROFILES: readonly IndexableOccupationProfile[] = [
  { countryCode: "AU", careerId: "bricklayer", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "care-worker", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "carpenter", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "construction-manager", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "electrician", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "hvac-technician", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "medical-laboratory-technician", sourceCheckedAt: "2026-08-08" },
  { countryCode: "AU", careerId: "midwife", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "occupational-therapist", sourceCheckedAt: "2026-08-08" },
  { countryCode: "AU", careerId: "pharmacist", sourceCheckedAt: "2026-08-08" },
  { countryCode: "AU", careerId: "physiotherapist", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "plumber", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "radiographer", sourceCheckedAt: "2026-08-08" },
  { countryCode: "AU", careerId: "registered-nurse", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "wall-floor-tiler", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "welder", sourceCheckedAt: "2026-08-07" },
] as const

const careerById = new Map(CANONICAL_CAREERS.map((career) => [career.id, career]))
const indexableProfileKeys = new Set(
  INDEXABLE_OCCUPATION_PROFILES.map(({ countryCode, careerId }) => `${countryCode}:${careerId}`),
)

export function normalizeOccupationCountryCode(value: string) {
  const normalized = value.trim().toUpperCase()
  return normalized === "GB" ? "UK" : normalized
}

export function occupationCanonicalPath(countryCode: string, careerId: string) {
  return `/occupation/${normalizeOccupationCountryCode(countryCode).toLowerCase()}/${careerId.trim().toLowerCase()}`
}

export function getIndexableOccupationRoute(countryCode: string, careerId: string) {
  const normalizedCountry = normalizeOccupationCountryCode(countryCode)
  const normalizedCareerId = careerId.trim().toLowerCase()
  const country = getLaunchCountry(normalizedCountry)
  const career = careerById.get(normalizedCareerId)
  if (!country || !career) return null
  if (!indexableProfileKeys.has(`${country.code}:${career.id}`)) return null

  const profile = INDEXABLE_OCCUPATION_PROFILES.find(
    (item) => item.countryCode === country.code && item.careerId === career.id,
  )!

  return {
    country,
    career,
    sourceCheckedAt: profile.sourceCheckedAt,
    path: occupationCanonicalPath(country.code, career.id),
  }
}
