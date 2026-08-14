import { resolveCareerCompareHref } from "@/lib/workspace/career-compare-context"
import { careerCanonicalPath } from "@/lib/workspace/occupation-routes"
import type { OverviewSearchValues } from "../home/home-overview-config"

export function buildCareerResultHref(query: OverviewSearchValues, personalised = false) {
  const path = careerCanonicalPath(query.country, query.occupation)
  if (!personalised) return path

  const params = new URLSearchParams({ personalised: "1" })
  return `${path}?${params.toString()}`
}

export function getCareerResultCompareHref(query: OverviewSearchValues) {
  return resolveCareerCompareHref(query.country, query.occupation)
}
