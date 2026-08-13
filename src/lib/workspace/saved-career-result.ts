import { getCanonicalCareer } from "@/data/career-comparison-catalog"
import { getLaunchCountry } from "@/data/launch-countries"

export const SAVED_CAREER_RESULT_NEXT_ACTIONS = [
  "review_registration",
  "review_evidence",
] as const

export type SavedCareerResultNextAction = (typeof SAVED_CAREER_RESULT_NEXT_ACTIONS)[number]

export type SavedCareerResultInput = {
  countryCode: string
  occupationId: string
  personalised: boolean
  evidenceCheckedAt: string | null
  nextAction: SavedCareerResultNextAction
}

export type SavedCareerResultWrite = {
  country_code: string
  career_id: string
  occupation_id: string
  personalised: boolean
  evidence_checked_at: string | null
  next_action: SavedCareerResultNextAction
  updated_at: string
}

function normaliseDate(value: unknown) {
  if (typeof value !== "string") return null
  const date = value.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(`${date}T00:00:00Z`))
    ? date
    : null
}

/** A saved result is a validated product selection, never arbitrary user text. */
export function normalizeSavedCareerResultInput(input: unknown): SavedCareerResultInput | null {
  if (!input || typeof input !== "object") return null
  const candidate = input as Partial<SavedCareerResultInput>
  const countryCode = typeof candidate.countryCode === "string" ? candidate.countryCode.toUpperCase() : ""
  const occupationId = typeof candidate.occupationId === "string" ? candidate.occupationId : ""
  const nextAction = candidate.nextAction

  if (!getLaunchCountry(countryCode) || !getCanonicalCareer(occupationId)) return null
  if (typeof candidate.personalised !== "boolean") return null
  if (!SAVED_CAREER_RESULT_NEXT_ACTIONS.includes(nextAction as SavedCareerResultNextAction)) return null

  return {
    countryCode,
    occupationId,
    personalised: candidate.personalised,
    evidenceCheckedAt: normaliseDate(candidate.evidenceCheckedAt),
    nextAction: nextAction as SavedCareerResultNextAction,
  }
}

export function toSavedCareerResultWrite(
  input: SavedCareerResultInput,
  updatedAt: string,
): SavedCareerResultWrite {
  return {
    country_code: input.countryCode,
    career_id: input.occupationId,
    occupation_id: input.occupationId,
    personalised: input.personalised,
    evidence_checked_at: input.evidenceCheckedAt,
    next_action: input.nextAction,
    updated_at: updatedAt,
  }
}
