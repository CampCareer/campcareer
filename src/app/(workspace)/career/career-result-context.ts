import { resolveCareerCompareHref } from "@/lib/workspace/career-compare-context"
import type { OverviewSearchValues } from "../home/home-overview-config"

export function buildCareerResultHref(query: OverviewSearchValues, personalised = false) {
  const params = new URLSearchParams({
    country: query.country,
    occupation: query.occupation,
  })
  if (personalised) params.set("personalised", "1")
  return `/career?${params.toString()}`
}

export function getCareerResultCompareHref(query: OverviewSearchValues) {
  return resolveCareerCompareHref(query.country, query.occupation)
}
