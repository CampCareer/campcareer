import { notFound } from "next/navigation"
import { RouteGuidePage } from "@/components/routes/route-guide-page"
import { getRouteGuideForDestination, ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export function generateStaticParams() {
  return ROUTE_GUIDES.map((guide) => ({ origin: guide.destination.slug, destination: guide.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ origin: string; destination: string }> }) {
  const route = await params
  const guide = getRouteGuideForDestination(route.origin, route.destination)
  if (!guide) return {}
  return pageMetadata({
    title: `호주 ${guide.target.ko}: 유학·취업 정보`,
    description: guide.summary.ko,
    path: `/ko${routeGuideHref(guide)}`,
  })
}

export default async function KoreanGlobalRouteGuideRoute({ params }: { params: Promise<{ origin: string; destination: string }> }) {
  const route = await params
  const guide = getRouteGuideForDestination(route.origin, route.destination)
  if (!guide) notFound()
  return <RouteGuidePage guide={guide} locale="ko" />
}
