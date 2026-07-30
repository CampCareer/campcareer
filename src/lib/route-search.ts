import { ROUTE_GUIDES, type RouteGoal, type RouteGuide, type RouteLocale } from "@/data/route-guides"
import { AU_ROUTE_CANDIDATES, getAustraliaRouteCandidate } from "@/data/route-taxonomy"
import { getCountryOptions } from "@/lib/study-product/countries"

export type { RouteGoal } from "@/data/route-guides"

export type RouteSearchInput = {
  citizenship: string
  destination: string
  field: string
  goal: RouteGoal
}

/**
 * The published-answer gate is intentionally narrow, but demand collection is
 * global. This keeps a Romanian → Korea beauty request possible without
 * pretending that a verified answer already exists.
 */
export function getRouteSearchCountries(locale: RouteLocale) {
  return getCountryOptions(locale === "ko" ? "ko-KR" : "en")
}

export function normalizeCountryCode(value: string) {
  return value.trim().toUpperCase()
}

export function normalizeRouteField(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase().slice(0, 80)
}

export function normalizeRouteGoal(value: string | undefined | null): RouteGoal {
  return value === "study" || value === "study-to-work" ? value : "work"
}

/**
 * Search-result URLs preserve what the visitor searched for. Published route
 * pages remain the canonical, indexable editorial URLs.
 */
export function routeResultsHref(field: string, goal: RouteGoal) {
  const params = new URLSearchParams({ search_query: field.trim().slice(0, 80) })
  if (goal !== "work") params.set("goal", goal)
  return `/results?${params.toString()}`
}

/** Only show fully published answers in empty-state autocomplete. */
export function getPublishedAustraliaRouteCandidates() {
  return ROUTE_GUIDES.flatMap((guide) => {
    const candidate = guide.candidateId ? AU_ROUTE_CANDIDATES.find((item) => item.id === guide.candidateId) : undefined
    return candidate ? [candidate] : []
  })
}

export function findPublishedRoute(input: RouteSearchInput): RouteGuide | null {
  const citizenship = normalizeCountryCode(input.citizenship)
  const destination = normalizeCountryCode(input.destination)
  const field = normalizeRouteField(input.field)

  if (!citizenship || !destination || !field) return null

  const candidate = destination === "AU" ? getAustraliaRouteCandidate(field) : null

  return ROUTE_GUIDES.find((guide) =>
    guide.publication.status === "published" &&
    guide.origin.code === citizenship &&
    guide.destination.code === destination &&
    guide.goals.some((goal) => goal === input.goal) &&
    (candidate ? guide.candidateId === candidate.id : guide.searchTerms.some((term) => field.includes(normalizeRouteField(term)))),
  ) ?? null
}
