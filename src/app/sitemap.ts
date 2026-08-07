import type { MetadataRoute } from "next"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"
import { CANONICAL_COUNTRY_SLUGS, SITE_URL, countryCanonicalPath } from "@/lib/seo-routes.mjs"

const lastModified = new Date("2026-08-07")

export default function sitemap(): MetadataRoute.Sitemap {
  const methodologies = ["australia", "canada", "united-states", "united-kingdom", "ireland", "germany", "netherlands", "belgium", "france", "spain", "singapore", "south-korea", "japan", "new-zealand", "norway", "sweden", "denmark", "finland", "switzerland", "united-arab-emirates"]
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE_URL}/maps`, lastModified, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/programs`, lastModified, priority: 0.8, changeFrequency: "weekly" },
    ...CANONICAL_COUNTRY_SLUGS.map((slug) => ({ url: `${SITE_URL}${countryCanonicalPath(slug)}`, lastModified, priority: 0.85, changeFrequency: "monthly" as const })),
    { url: `${SITE_URL}/cities/au/sydney`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/cities/au/melbourne`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/cities/au/compare`, lastModified, priority: 0.82, changeFrequency: "monthly" },
    { url: `${SITE_URL}/methodology`, lastModified, priority: 0.5, changeFrequency: "monthly" },
    ...methodologies.map((slug) => ({ url: `${SITE_URL}/methodology/${slug}`, lastModified, priority: 0.45, changeFrequency: "monthly" as const })),
    { url: `${SITE_URL}/privacy`, lastModified, priority: 0.2, changeFrequency: "yearly" },
    { url: `${SITE_URL}/terms`, lastModified, priority: 0.2, changeFrequency: "yearly" },
  ]
  const routePages: MetadataRoute.Sitemap = ROUTE_GUIDES.flatMap((guide) => [
    { url: `${SITE_URL}${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/ko${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.9, changeFrequency: "weekly" as const },
  ])

  return Array.from(
    new Map([...staticPages, ...routePages].map((entry) => [entry.url, entry])).values(),
  )
}
