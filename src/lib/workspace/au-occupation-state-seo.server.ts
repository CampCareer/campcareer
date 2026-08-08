import "server-only"

import { cache } from "react"
import { getCountryOccupationProfile } from "@/lib/workspace/country-occupation-read"
import { getAuOccupationStatePage } from "@/lib/workspace/au-occupation-state-seo"

async function loadAuOccupationStatePageData(stateSlug: string, careerSlug: string) {
  const route = getAuOccupationStatePage(stateSlug, careerSlug)
  if (!route) return null

  const profile = await getCountryOccupationProfile("AU", route.career.slug)
  if (!profile || profile.publicationStatus !== "decision_ready") return null

  const region = profile.regions.find((item) => item.regionCode === route.state.code)
  if (
    !region ||
    region.shortageRating == null ||
    region.vacancyCount == null ||
    region.vacancyCount <= 0 ||
    !region.sourceUrl
  ) {
    return null
  }

  const rankedRegions = profile.regions
    .filter((item) => item.vacancyCount != null && item.vacancyCount > 0)
    .sort((a, b) => (b.vacancyCount ?? 0) - (a.vacancyCount ?? 0))
  const vacancyRank = rankedRegions.findIndex((item) => item.regionCode === route.state.code) + 1
  const totalRegionalVacancies = rankedRegions.reduce(
    (total, item) => total + (item.vacancyCount ?? 0),
    0,
  )
  const vacancySharePct = totalRegionalVacancies > 0
    ? (region.vacancyCount / totalRegionalVacancies) * 100
    : null

  const stateLinks = profile.links.filter((link) => link.regionCode === route.state.code)
  const nationalLinks = profile.links.filter((link) => !link.regionCode)
  const relevantLinks = [...stateLinks, ...nationalLinks]
  const uniqueLinks = relevantLinks.filter(
    (link, index, items) => items.findIndex((item) => item.url === link.url) === index,
  )

  const verifiedRegion = { ...region, sourceUrl: region.sourceUrl }

  return {
    route,
    profile,
    region: verifiedRegion,
    vacancyRank,
    rankedRegionCount: rankedRegions.length,
    totalRegionalVacancies,
    vacancySharePct,
    links: uniqueLinks,
    employers: uniqueLinks.filter((link) => link.linkType === "employer").slice(0, 6),
    jobLinks: uniqueLinks.filter((link) => link.linkType === "job_search").slice(0, 5),
    entryLinks: uniqueLinks.filter(
      (link) => link.linkType === "entry_program" || link.linkType === "graduate_program",
    ).slice(0, 6),
    indexable: true,
  }
}

export const getAuOccupationStatePageData = cache(loadAuOccupationStatePageData)
