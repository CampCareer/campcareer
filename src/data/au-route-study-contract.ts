export const AU_STATE_CODES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"] as const
export type AuStateCode = (typeof AU_STATE_CODES)[number]

export type RouteStudyCampus = {
  name: string
  state: AuStateCode
}

export type RouteStudyFact = {
  value: string
  sourceUrl: string
  reviewedAt: string | null
}

export type RouteStudyOption = {
  id: number
  providerName: string
  courseCode: string | null
  title: string
  qualification: string | null
  duration: RouteStudyFact | null
  tuitionAud: number | null
  tuitionYear: number | null
  tuitionSource: "provider" | "registry" | "unconfirmed"
  englishRequirement: RouteStudyFact | null
  entryRequirements: RouteStudyFact | null
  intakes: RouteStudyFact | null
  campuses: RouteStudyCampus[]
  officialUrl: string
  officialCheckedAt: string | null
}

export type RouteStudyOptions = {
  candidateId: string
  kind: "course" | "training"
  state: AuStateCode | null
  options: RouteStudyOption[]
}

export function parseAuState(value: unknown): AuStateCode | null {
  const normalized = typeof value === "string" ? value.trim().toUpperCase() : ""
  return (AU_STATE_CODES as readonly string[]).includes(normalized) ? normalized as AuStateCode : null
}

/** 0 is a missing value, never a free tuition claim. */
export function parsePositiveAud(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }
  if (value && typeof value === "object" && "amountAud" in value) {
    return parsePositiveAud((value as { amountAud?: unknown }).amountAud)
  }
  return null
}

export function parseTuitionYear(value: unknown): number | null {
  if (!value || typeof value !== "object" || !("year" in value)) return null
  const year = Number((value as { year?: unknown }).year)
  return Number.isInteger(year) && year >= 2020 && year <= 2100 ? year : null
}

/**
 * Campus facts must name the actual delivery campus and Australian state.
 * A plain provider city/state is deliberately insufficient for route results.
 */
export function parseVerifiedCampuses(value: unknown): RouteStudyCampus[] {
  const rows = Array.isArray(value)
    ? value
    : value && typeof value === "object" && "campuses" in value && Array.isArray((value as { campuses?: unknown }).campuses)
      ? (value as { campuses: unknown[] }).campuses
      : []

  const seen = new Set<string>()
  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return []
    const name = typeof (row as { name?: unknown }).name === "string" ? (row as { name: string }).name.trim() : ""
    const state = parseAuState((row as { state?: unknown }).state)
    if (!name || !state || seen.has(`${name}:${state}`)) return []
    seen.add(`${name}:${state}`)
    return [{ name, state }]
  })
}
