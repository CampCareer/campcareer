import { MetadataRoute } from "next"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"

const BASE = "https://www.campcareer.com"
const lastModified = new Date("2026-08-06")

export default function sitemap(): MetadataRoute.Sitemap {
  const countries = ["au", "ca", "us", "uk", "ie", "de", "nl", "be", "fr"]
  const methodologies = ["australia", "canada", "united-states", "united-kingdom", "ireland", "germany", "netherlands", "belgium", "france"]
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/home`, lastModified, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE}/maps`, lastModified, priority: 0.9, changeFrequency: "daily" },
    ...countries.map((slug) => ({ url: `${BASE}/countries/${slug}`, lastModified, priority: 0.85, changeFrequency: "monthly" as const })),
    { url: `${BASE}/methodology`, lastModified, priority: 0.5, changeFrequency: "monthly" },
    ...methodologies.map((slug) => ({ url: `${BASE}/methodology/${slug}`, lastModified, priority: 0.45, changeFrequency: "monthly" as const })),
    { url: `${BASE}/privacy`, lastModified, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, lastModified, priority: 0.2, changeFrequency: "yearly" },
  ]
  const routePages: MetadataRoute.Sitemap = ROUTE_GUIDES.flatMap((guide) => [
    { url: `${BASE}${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${BASE}/ko${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.9, changeFrequency: "weekly" as const },
  ])
  return [...staticPages, ...routePages]
}
