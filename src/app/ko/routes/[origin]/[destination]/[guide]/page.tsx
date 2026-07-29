import { notFound } from "next/navigation"
import { RouteGuidePage } from "@/components/routes/route-guide-page"
import { getRouteGuide, ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export function generateStaticParams() {
  return ROUTE_GUIDES.map((guide) => ({
    origin: guide.origin.slug,
    destination: guide.destination.slug,
    guide: guide.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ origin: string; destination: string; guide: string }> }) {
  const route = await params
  const guide = getRouteGuide(route.origin, route.destination, route.guide)
  if (!guide) return {}
  return pageMetadata({
    title: `${guide.title.ko} | CampCareer`,
    description: guide.summary.ko,
    path: `/ko${routeGuideHref(guide)}`,
  })
}

export default async function KoreanRouteGuideRoute({ params }: { params: Promise<{ origin: string; destination: string; guide: string }> }) {
  const route = await params
  const guide = getRouteGuide(route.origin, route.destination, route.guide)
  if (!guide) notFound()
  return <RouteGuidePage guide={guide} locale="ko" />
}
