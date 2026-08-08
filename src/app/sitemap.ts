import type { MetadataRoute } from "next"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"
import { AU_PROGRAMMATIC_STUDY_PAGES } from "@/lib/programs/au-programmatic-seo"
import { INDEXABLE_AU_PROGRAMS, indexableAuProgramPath } from "@/lib/programs/program-routes"
import { AU_OCCUPATION_STATE_PAGES } from "@/lib/workspace/au-occupation-state-seo"
import { INDEXABLE_OCCUPATION_PROFILES, occupationCanonicalPath } from "@/lib/workspace/occupation-routes"
import { getCompletedVisaCatalog } from "@/lib/workspace/visa-catalog-complete"
import { getIndexableVisaRoutes } from "@/lib/workspace/visa-routes"
import { INDEXABLE_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo"
import { INDEXABLE_UK_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-uk"
import { CANONICAL_COUNTRY_SLUGS, SITE_URL, countryCanonicalPath } from "@/lib/seo-routes.mjs"

const lastModified = new Date("2026-08-08")

export default function sitemap(): MetadataRoute.Sitemap {
  const methodologies = ["australia", "canada", "united-states", "united-kingdom", "ireland", "germany", "netherlands", "belgium", "france", "spain", "singapore", "south-korea", "japan", "new-zealand", "norway", "sweden", "denmark", "finland", "switzerland", "united-arab-emirates"]

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE_URL}/maps`, lastModified, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/programs`, lastModified, priority: 0.85, changeFrequency: "weekly" },
    { url: `${SITE_URL}/institutions`, lastModified, priority: 0.85, changeFrequency: "weekly" },
    { url: `${SITE_URL}/institutions/au`, lastModified, priority: 0.82, changeFrequency: "weekly" },
    { url: `${SITE_URL}/institutions/ca`, lastModified, priority: 0.82, changeFrequency: "weekly" },
    { url: `${SITE_URL}/institutions/uk`, lastModified, priority: 0.82, changeFrequency: "weekly" },
    ...CANONICAL_COUNTRY_SLUGS.map((slug) => ({ url: `${SITE_URL}${countryCanonicalPath(slug)}`, lastModified, priority: 0.85, changeFrequency: "monthly" as const })),
    { url: `${SITE_URL}/cities/au/sydney`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/cities/au/melbourne`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/cities/au/brisbane`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/cities/au/perth`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/cities/au/adelaide`, lastModified, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/methodology`, lastModified, priority: 0.5, changeFrequency: "monthly" },
    ...methodologies.map((slug) => ({ url: `${SITE_URL}/methodology/${slug}`, lastModified, priority: 0.45, changeFrequency: "monthly" as const })),
    { url: `${SITE_URL}/privacy`, lastModified, priority: 0.2, changeFrequency: "yearly" },
    { url: `${SITE_URL}/terms`, lastModified, priority: 0.2, changeFrequency: "yearly" },
  ]

  const programPages: MetadataRoute.Sitemap = INDEXABLE_AU_PROGRAMS.map((program) => ({
    url: `${SITE_URL}${indexableAuProgramPath(program)}`,
    lastModified: new Date(program.sourceCheckedAt),
    priority: 0.74,
    changeFrequency: "weekly" as const,
  }))

  const occupationPages: MetadataRoute.Sitemap = INDEXABLE_OCCUPATION_PROFILES.map((profile) => ({
    url: `${SITE_URL}${occupationCanonicalPath(profile.countryCode, profile.careerId)}`,
    lastModified: new Date(profile.sourceCheckedAt),
    priority: 0.74,
    changeFrequency: "weekly" as const,
  }))

  const visaPages: MetadataRoute.Sitemap = getIndexableVisaRoutes(getCompletedVisaCatalog()).map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }))

  const studyPages: MetadataRoute.Sitemap = AU_PROGRAMMATIC_STUDY_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified,
    priority: 0.72,
    changeFrequency: "weekly" as const,
  }))

  const occupationStatePages: MetadataRoute.Sitemap = AU_OCCUPATION_STATE_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified,
    priority: 0.71,
    changeFrequency: "monthly" as const,
  }))

  const institutionPages: MetadataRoute.Sitemap = [...INDEXABLE_INSTITUTION_PATHS, ...INDEXABLE_UK_INSTITUTION_PATHS].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    priority: 0.72,
    changeFrequency: "weekly" as const,
  }))

  const routePages: MetadataRoute.Sitemap = ROUTE_GUIDES.flatMap((guide) => [
    { url: `${SITE_URL}${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/ko${routeGuideHref(guide)}`, lastModified: new Date(guide.lastVerified), priority: 0.9, changeFrequency: "weekly" as const },
  ])

  return Array.from(
    new Map([
      ...staticPages,
      ...programPages,
      ...occupationPages,
      ...visaPages,
      ...studyPages,
      ...occupationStatePages,
      ...institutionPages,
      ...routePages,
    ].map((entry) => [entry.url, entry])).values(),
  )
}
