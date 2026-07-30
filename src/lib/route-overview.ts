import "server-only"

import occupationShortages from "@/data/au-jsa-osl-2025.json"
import occupationProfiles from "@/data/au-osca-occupation-profiles.json"
import {
  getAuRouteOverviewAnchor,
  type JsaShortageRating,
  type RouteOverview,
  type RouteOverviewLabourProfile,
} from "@/data/au-route-overview-contract"
import { getAustraliaRouteCandidate } from "@/data/route-taxonomy"
import { supabaseAdmin } from "@/lib/supabase-admin"

type LabourProfileRow = {
  anzsco_v13: string
  employment_total: number | null
  median_weekly_earnings_aud: number | null
  median_hourly_earnings_aud: number | string | null
  part_time_share_pct: number | string | null
  female_share_pct: number | string | null
  median_age: number | string | null
  full_time_share_pct: number | string | null
  average_full_time_hours: number | string | null
  state_distribution: unknown
  education_distribution: unknown
  source_url: string
  data_as_at: string | null
}

type EducationRow = { name?: unknown; share?: unknown }
type ShortageRating = JsaShortageRating

const PROFILE_SOURCE_URL = "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupation-profiles"
const shortageByOsca = new Map(occupationShortages.occupations.map((occupation) => [occupation.oscaCode, occupation]))
const oscaProfileByCode = new Map(occupationProfiles.occupations.map((occupation) => [occupation.code, occupation]))

/**
 * Builds the public snapshot from only two official sources:
 * - JSA's reviewed 2025 Occupation Shortage List (exact OSCA occupations)
 * - JSA's February 2026 historical ANZSCO occupation profiles
 *
 * The classifications do not yet fully line up. When ABS correspondence is
 * not decision-useful, the profile anchors are intentionally empty.
 */
export async function getAuRouteOverview(candidateId: string): Promise<RouteOverview | null> {
  const candidate = getAustraliaRouteCandidate(candidateId)
  const anchor = getAuRouteOverviewAnchor(candidateId)
  if (!candidate || !anchor) return null

  const shortageRatings = candidate.oscaCodes.flatMap((oscaCode) => {
    const occupation = shortageByOsca.get(oscaCode)
    if (!occupation || !isShortageRating(occupation.nationalRating)) return []
    const stateRatings = Object.fromEntries(
      Object.entries(occupation.stateRatings).flatMap(([state, rating]) => isShortageRating(rating) ? [[state, rating]] : []),
    ) as Record<string, ShortageRating>
    return [{
      oscaCode,
      title: occupation.title,
      nationalRating: occupation.nationalRating,
      stateRatings,
    }]
  })

  const rowsByCode = await getLabourProfiles(anchor.profiles.map((profile) => profile.anzscoV13))
  const labourProfiles = anchor.profiles.flatMap((profile) => {
    const row = rowsByCode.get(profile.anzscoV13)
    return row ? [toPublicLabourProfile(row, profile)] : []
  })

  return {
    candidateId,
    shortage: shortageRatings.length
      ? {
          sourceUrl: occupationShortages.source.url,
          sourceAsOf: occupationShortages.source.year,
          checkedAt: occupationShortages.source.retrievedAt.slice(0, 10),
          exactOccupationCount: candidate.oscaCodes.length,
          ratings: shortageRatings,
        }
      : null,
    labourProfiles,
    skillLevels: candidate.oscaCodes.flatMap((oscaCode) => {
      const profile = oscaProfileByCode.get(oscaCode)
      return profile && Number.isInteger(profile.skillLevel) && profile.skillLevel > 0
        ? [{ oscaCode, level: profile.skillLevel, sourceUrl: profile.officialUrl }]
        : []
    }),
  }
}

async function getLabourProfiles(anzscoCodes: readonly string[]) {
  const uniqueCodes = [...new Set(anzscoCodes)]
  if (!uniqueCodes.length) return new Map<string, LabourProfileRow>()

  const { data, error } = await supabaseAdmin
    .from("occupation_profiles_au")
    .select("anzsco_v13, employment_total, median_weekly_earnings_aud, median_hourly_earnings_aud, part_time_share_pct, female_share_pct, median_age, full_time_share_pct, average_full_time_hours, state_distribution, education_distribution, source_url, data_as_at")
    .in("anzsco_v13", uniqueCodes)

  if (error || !data) return new Map<string, LabourProfileRow>()
  return new Map((data as LabourProfileRow[]).map((row) => [row.anzsco_v13, row]))
}

function toPublicLabourProfile(row: LabourProfileRow, anchor: { anzscoV13: string; label: RouteOverviewLabourProfile["label"] }): RouteOverviewLabourProfile {
  return {
    anzscoV13: anchor.anzscoV13,
    label: anchor.label,
    employmentTotal: positiveIntegerOrNull(row.employment_total),
    medianWeeklyEarningsAud: positiveIntegerOrNull(row.median_weekly_earnings_aud),
    medianHourlyEarningsAud: positiveNumberOrNull(row.median_hourly_earnings_aud),
    partTimeSharePct: percentageOrNull(row.part_time_share_pct),
    femaleSharePct: percentageOrNull(row.female_share_pct),
    medianAge: positiveNumberOrNull(row.median_age),
    fullTimeSharePct: percentageOrNull(row.full_time_share_pct),
    averageFullTimeHours: positiveNumberOrNull(row.average_full_time_hours),
    stateDistribution: percentageDistribution(row.state_distribution).map(({ label, sharePct }) => ({ name: label, sharePct })),
    educationDistribution: percentageDistribution(row.education_distribution).map(({ label, sharePct }) => ({ name: label, sharePct })),
    topEducation: highestEducation(row.education_distribution),
    sourceUrl: row.source_url || PROFILE_SOURCE_URL,
    dataAsAt: row.data_as_at,
  }
}

function highestEducation(value: unknown) {
  return percentageDistribution(value)[0] ?? null
}

function percentageDistribution(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const { name, share } = item as EducationRow
    const parsedShare = percentageOrNull(share)
    return typeof name === "string" && name.trim() && parsedShare != null ? [{ label: name.trim(), sharePct: parsedShare }] : []
  }).sort((a, b) => b.sharePct - a.sharePct)
}

function isShortageRating(value: unknown): value is ShortageRating {
  return value === "S" || value === "M" || value === "R" || value === "NS"
}

function positiveIntegerOrNull(value: unknown) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function positiveNumberOrNull(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function percentageOrNull(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100 ? parsed : null
}
