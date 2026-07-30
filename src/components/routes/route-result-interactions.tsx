"use client"

import Link from "next/link"
import { useEffect } from "react"
import type { RouteLinkType, RouteLocale } from "@/data/route-guides"
import { recordRouteEvent } from "@/lib/analytics"

export function RouteResultAnalytics({ guideId, locale }: { guideId: string; locale: RouteLocale }) {
  useEffect(() => {
    recordRouteEvent("route_result_viewed", { route_id: guideId, locale, surface: "route_result" })
  }, [guideId, locale])
  return null
}

export function RouteExternalLink({
  href,
  linkType,
  guideId,
  locale,
  className,
  children,
}: {
  href: string
  linkType: RouteLinkType
  guideId: string
  locale: RouteLocale
  className?: string
  children: React.ReactNode
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} onClick={() => recordRouteEvent("route_external_link_clicked", { route_id: guideId, locale, link_type: linkType, surface: "route_result" })}>
      {children}
    </a>
  )
}

export function RouteMapLink({
  href,
  guideId,
  locale,
  className,
  children,
}: {
  href: string
  guideId: string
  locale: RouteLocale
  className?: string
  children: React.ReactNode
}) {
  return <Link href={href} className={className} onClick={() => recordRouteEvent("map_opened_from_route", { route_id: guideId, locale, surface: "route_result", link_type: "map" })}>{children}</Link>
}
