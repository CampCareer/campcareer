import type { RouteGuide } from "@/data/route-guides"
import { getAustraliaRouteCandidate } from "@/data/route-taxonomy"
import { parseAuState, type AuStateCode } from "@/data/au-route-study-contract"

/**
 * Carries the route context into the existing interactive map. `occ` is an
 * exact OSCA occupation code, never a broad-field label. The map may safely
 * leave the occupation panel closed when its legacy map dataset has no record
 * for that exact code.
 */
export function routeMapHref(guide: RouteGuide, state?: string | null) {
  const params = new URLSearchParams({
    route: guide.id,
    country: guide.destination.code.toLowerCase(),
  })
  const stateCode = parseAuState(state)
  if (stateCode) params.set("state", stateCode)

  const candidate = guide.candidateId ? getAustraliaRouteCandidate(guide.candidateId) : null
  const exactOccupation = candidate?.oscaCodes[0]
  if (exactOccupation) params.set("occ", exactOccupation)
  return `/maps?${params.toString()}`
}

export type { AuStateCode }
