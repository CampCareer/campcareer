import { notFound, permanentRedirect } from "next/navigation"
import { getRouteGuide, ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"

export const revalidate = 86400

export function generateStaticParams() {
  return ROUTE_GUIDES.map((guide) => ({
    origin: guide.origin.slug,
    destination: guide.destination.slug,
    guide: guide.slug,
  }))
}

export default async function KoreanRouteGuideRoute({ params }: { params: Promise<{ origin: string; destination: string; guide: string }> }) {
  const route = await params
  const guide = getRouteGuide(route.origin, route.destination, route.guide)
  if (!guide) notFound()
  permanentRedirect(`/ko${routeGuideHref(guide)}`)
}
