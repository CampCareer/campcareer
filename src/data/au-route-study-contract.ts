export const AU_STATE_CODES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"] as const
export type AuStateCode = (typeof AU_STATE_CODES)[number]

export const QUALIFICATION_LEVELS = [
  "doctorate", "master", "graduate-diploma", "graduate-certificate",
  "bachelor", "diploma", "certificate",
] as const
export type QualificationLevel = (typeof QUALIFICATION_LEVELS)[number]

const QUALIFICATION_RULES: { keyword: string; level: QualificationLevel }[] = [
  { keyword: "doctoral degree", level: "doctorate" },
  { keyword: "masters degree", level: "master" },
  { keyword: "master degree", level: "master" },
  { keyword: "graduate diploma", level: "graduate-diploma" },
  { keyword: "graduate certificate", level: "graduate-certificate" },
  { keyword: "bachelor honours", level: "bachelor" },
  { keyword: "bachelor degree", level: "bachelor" },
  { keyword: "advanced diploma", level: "diploma" },
  { keyword: "diploma", level: "diploma" },
  { keyword: "certificate iv", level: "certificate" },
  { keyword: "certificate iii", level: "certificate" },
]

export function normalizeQualification(raw: string | null): QualificationLevel | null {
  if (!raw) return null
  const key = raw.trim().toLowerCase()
  for (const { keyword, level } of QUALIFICATION_RULES) {
    if (key.includes(keyword)) return level
  }
  return null
}

export function qualificationLevelLabel(level: QualificationLevel, locale: "en" | "ko"): string {
  const labels: Record<QualificationLevel, { en: string; ko: string }> = {
    bachelor: { en: "Bachelor", ko: "학사" },
    master: { en: "Master", ko: "석사" },
    "graduate-diploma": { en: "Graduate Diploma", ko: "대학원 수료" },
    "graduate-certificate": { en: "Graduate Certificate", ko: "대학원 수료" },
    diploma: { en: "Diploma", ko: "전문학사" },
    certificate: { en: "Certificate", ko: "수료증" },
    doctorate: { en: "Doctorate", ko: "박사" },
  }
  return labels[level][locale]
}

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
  qualificationLevel: QualificationLevel | null
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
  const seen = new Set<string>()

  function addCampus(name: string, state: AuStateCode): RouteStudyCampus[] {
    const key = `${name}:${state}`
    if (seen.has(key)) return []
    seen.add(key)
    return [{ name, state }]
  }

  if (value && typeof value === "object" && "campuses" in value) {
    const rows = (value as { campuses: unknown }).campuses
    if (Array.isArray(rows)) {
      return rows.flatMap((row) => {
        if (!row || typeof row !== "object") return []
        const name = typeof (row as { name?: unknown }).name === "string" ? (row as { name: string }).name.trim() : ""
        const state = parseAuState((row as { state?: unknown }).state)
        if (!name || !state) return []
        return addCampus(name, state)
      })
    }
  }

  if (Array.isArray(value)) {
    return value.flatMap((row) => {
      if (!row || typeof row !== "object") return []
      const name = typeof (row as { name?: unknown }).name === "string" ? (row as { name: string }).name.trim() : ""
      const state = parseAuState((row as { state?: unknown }).state)
      if (!name || !state) return []
      return addCampus(name, state)
    })
  }

  if (typeof value === "string") {
    return value.split(";").flatMap((segment) => {
      const s = segment.trim()
      if (!s) return []
      const match = s.match(/^(.+)\s\(([A-Z]{2,3})\)$/)
      if (!match) return []
      const name = match[1].trim()
      const state = parseAuState(match[2])
      if (!name || !state) return []
      return addCampus(name, state)
    })
  }

  return []
}
