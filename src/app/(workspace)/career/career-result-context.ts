import { buildCareerCompareHref } from "@/lib/career-comparison"
import type { OverviewSearchValues } from "../home/home-overview-config"

const AU_CAREER_COMPARE_ID_BY_CANONICAL_ID: Readonly<Record<string, "registered-nurse" | "software-engineer" | "early-childhood-teacher">> = {
  "registered-nurse": "registered-nurse",
  "software-developer": "software-engineer",
  "early-childhood-teacher": "early-childhood-teacher",
}

export function buildCareerResultHref(query: OverviewSearchValues, personalised = false) {
  const params = new URLSearchParams({
    country: query.country,
    occupation: query.occupation,
  })
  if (personalised) params.set("personalised", "1")
  return `/career?${params.toString()}`
}

export function getCareerResultCompareHref(query: OverviewSearchValues) {
  if (query.country.toUpperCase() !== "AU") return null
  const compareId = AU_CAREER_COMPARE_ID_BY_CANONICAL_ID[query.occupation]
  if (!compareId) return null
  return buildCareerCompareHref(null, [compareId])
}
