import "server-only"

import { cache } from "react"
import type { CareerMarketInsight } from "./career-market-contract"
import { getCareerMarketInsight } from "./career-market-read"

/**
 * Remove legacy/internal totals before Career data reaches a public surface.
 * Historical values stay in the underlying read model and database for audit.
 */
export function toPublicCareerMarketInsight(insight: CareerMarketInsight): CareerMarketInsight {
  return {
    ...insight,
    profile: insight.profile
      ? {
          ...insight.profile,
          metric: {
            ...insight.profile.metric,
            opportunityScore: null,
          },
        }
      : null,
    recommendations: insight.recommendations.map((recommendation) => ({
      ...recommendation,
      opportunityScore: null,
    })),
  }
}

/**
 * Request-scoped cached server read shared by page metadata and the rendered
 * Career Page. String arguments keep React cache keys stable across callers.
 */
export const getPublicCareerMarketInsight = cache(
  async (countryCode: string, careerId: string) => {
    const insight = await getCareerMarketInsight({
      countryCode: countryCode.trim().toUpperCase(),
      careerId: careerId.trim().toLowerCase(),
    })
    return insight ? toPublicCareerMarketInsight(insight) : null
  },
)
