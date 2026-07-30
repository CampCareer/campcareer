import type { Metadata } from "next"
import { RouteGuidePage } from "@/components/routes/route-guide-page"
import { RouteSearchUnavailable } from "@/components/routes/route-search-unavailable"
import { parseAuState } from "@/data/au-route-study-contract"
import { routeGuideHref } from "@/data/route-guides"
import { findPublishedRoute, normalizeRouteGoal } from "@/lib/route-search"
import { getAuRouteOverview } from "@/lib/route-overview"

type SearchParams = { search_query?: string | string[]; goal?: string | string[]; state?: string | string[] }

function valueOf(value: string | string[] | undefined) {
  return typeof value === "string" ? value.slice(0, 80) : ""
}

function resolveResult(searchParams: SearchParams) {
  const query = valueOf(searchParams.search_query)
  const goal = normalizeRouteGoal(valueOf(searchParams.goal))
  const state = parseAuState(valueOf(searchParams.state))
  const guide = query ? findPublishedRoute({ citizenship: "KR", destination: "AU", field: query, goal }) : null
  return { query, goal, state, guide }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const result = resolveResult(await searchParams)
  if (!result.guide) return { robots: { index: false, follow: true } }
  return {
    title: `호주 ${result.guide.target.ko}: 유학·취업 정보`,
    description: result.guide.summary.ko,
    alternates: { canonical: `/ko${routeGuideHref(result.guide)}` },
    robots: { index: false, follow: true },
  }
}

export default async function KoreanResultsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { query, goal, state, guide } = resolveResult(await searchParams)
  if (!guide) return <RouteSearchUnavailable locale="ko" query={query} goal={goal} />
  const overview = guide.candidateId ? await getAuRouteOverview(guide.candidateId) : null
  return <RouteGuidePage guide={guide} locale="ko" initialQuery={query} goal={goal} initialState={state} initialOverview={overview} />
}
