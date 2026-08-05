import { MetadataRoute } from "next"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"

const BASE = "https://www.campcareer.com"
const lastModified = new Date("2026-08-05")

/**
 * Index only completed, source-backed product pages. Country pages are added
 * individually after their numeric metrics and methodology are verified.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/home`, lastModified, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE}/maps`, lastModified, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/countries/au`, lastModified, priority: 0.85, changeFrequency: "monthly" },
    { url: `${BASE}/methodology`, lastModified, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/methodology/australia`, lastModified, priority: 0.45, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`, lastModified, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, lastModified, priority: 0.2, changeFrequency: "yearly" },
  ]
  const routePages: MetadataRoute.Sitemap = ROUTE_GUIDES.flatMap((guide) => [
    { url: `${BASE}${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${BASE}/ko${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.9, changeFrequency: "weekly" as const },
  ])

  return [...staticPages, ...routePages]
}
