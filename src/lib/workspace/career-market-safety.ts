import type { CareerMarketProfile, CareerMarketRecommendation } from "./career-market-contract"

type RankableRecommendation = CareerMarketRecommendation & {
  opportunityScore: number
  scoreMethodologyVersion: string
}

/**
 * A market score is safe to show on an individual country result only after the
 * country-career profile itself has passed the decision-ready release gate.
 * Provisional scores remain useful to researchers, but are not public claims.
 */
export function canShowPublicMarketScore(profile: CareerMarketProfile | null): boolean {
  if (!profile || profile.metric.opportunityScore == null) return false
  if (profile.publicationStatus !== "decision_ready") return false
  return profile.metric.scoreStatus === "published" || profile.metric.scoreStatus === "foundation_ready"
}

/**
 * Country scores are comparable only within one reviewed methodology. Do not
 * turn provisional, differently calculated, or single-country values into a
 * ranked shortlist.
 */
export function selectComparableCareerRecommendations(
  recommendations: CareerMarketRecommendation[],
): CareerMarketRecommendation[] {
  const eligible = recommendations.filter((recommendation): recommendation is RankableRecommendation => (
    recommendation.publicationStatus === "decision_ready"
    && recommendation.opportunityScore != null
    && recommendation.scoreMethodologyVersion != null
    && (recommendation.scoreStatus === "published" || recommendation.scoreStatus === "foundation_ready")
  ))

  const groups = new Map<string, RankableRecommendation[]>()
  for (const recommendation of eligible) {
    const group = groups.get(recommendation.scoreMethodologyVersion) ?? []
    group.push(recommendation)
    groups.set(recommendation.scoreMethodologyVersion, group)
  }

  const comparableGroups = [...groups.values()].filter((group) => group.length >= 2)
  if (comparableGroups.length !== 1) return []

  return comparableGroups[0]
    .sort((first, second) => second.opportunityScore - first.opportunityScore || first.countryName.localeCompare(second.countryName))
    .slice(0, 8)
}
