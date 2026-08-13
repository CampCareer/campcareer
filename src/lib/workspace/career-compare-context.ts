import { buildCareerCompareHref } from "@/lib/career-comparison"

const AU_CAREER_COMPARE_ID_BY_CANONICAL_ID: Readonly<Record<string, "registered-nurse" | "software-engineer" | "early-childhood-teacher">> = {
  "registered-nurse": "registered-nurse",
  "software-developer": "software-engineer",
  "early-childhood-teacher": "early-childhood-teacher",
}

export function resolveCareerCompareHref(countryCode: string, canonicalCareerId: string) {
  if (countryCode.toUpperCase() !== "AU") return null
  const compareId = AU_CAREER_COMPARE_ID_BY_CANONICAL_ID[canonicalCareerId]
  if (!compareId) return null
  return buildCareerCompareHref(null, [compareId])
}
