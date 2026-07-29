import { MetadataRoute } from "next"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"

const BASE = "https://www.campcareer.com"
const lastModified = new Date("2026-07-29")

/**
 * Index only the route-search product and its published, source-backed route
 * pages. Research and retired workflow URLs are intentionally not discoverable
 * through the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE}/ko`, lastModified, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/maps`, lastModified, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/methodology`, lastModified, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`, lastModified, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, lastModified, priority: 0.2, changeFrequency: "yearly" },
  ]
  const routePages: MetadataRoute.Sitemap = ROUTE_GUIDES.flatMap((guide) => [
    { url: `${BASE}${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${BASE}/ko${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.9, changeFrequency: "weekly" as const },
  ])

  return [...staticPages, ...routePages]
}
