import type { LaunchCountryCode } from "@/data/launch-countries"

export type ScoreReadyCareerProfile = {
  countryCode: LaunchCountryCode
  careerId: string
  sourceCheckedAt: string
}

/**
 * Public CampCareer Score readiness inventory.
 *
 * Keep this aligned with docs/CAREER_COVERAGE_INVENTORY.md. A legacy profile,
 * provisional component total or SEO route is not enough to make a public
 * CampCareer Score ready. Missing evidence must remain Score not ready yet.
 */
export const SCORE_READY_CAREER_PROFILES: readonly ScoreReadyCareerProfile[] = [
  { countryCode: "AU", careerId: "care-worker", sourceCheckedAt: "2026-08-14" },
  { countryCode: "AU", careerId: "carpenter", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "electrician", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "midwife", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "occupational-therapist", sourceCheckedAt: "2026-08-08" },
  { countryCode: "AU", careerId: "physiotherapist", sourceCheckedAt: "2026-08-07" },
  { countryCode: "AU", careerId: "registered-nurse", sourceCheckedAt: "2026-08-06" },
  { countryCode: "AU", careerId: "welder", sourceCheckedAt: "2026-08-14" },
] as const

const scoreReadyKeys = new Set(
  SCORE_READY_CAREER_PROFILES.map(({ countryCode, careerId }) => `${countryCode}:${careerId}`),
)

export function isCareerScoreReady(countryCode: string, careerId: string) {
  const key = `${countryCode.trim().toUpperCase()}:${careerId.trim().toLowerCase()}`
  return scoreReadyKeys.has(key)
}
