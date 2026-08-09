import type { MetadataRoute } from "next"
import { getIndexableCaProgramsForSitemap } from "@/lib/programs/ca-programs.server"
import { caProgramDetailPath } from "@/lib/programs/program-search"
import { programsCanonicalPath, SITE_URL } from "@/lib/seo-routes.mjs"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const programs = await getIndexableCaProgramsForSitemap()
    const detailPages: MetadataRoute.Sitemap = programs.map((program) => ({
      url: `${SITE_URL}${caProgramDetailPath(program.id, program.title)}`,
      lastModified: new Date(program.lastModified),
      changeFrequency: "weekly" as const,
      priority: 0.72,
    }))

    return [
      {
        url: `${SITE_URL}${programsCanonicalPath("CA")}`,
        lastModified: new Date("2026-08-09"),
        changeFrequency: "weekly" as const,
        priority: 0.84,
      },
      ...detailPages,
    ]
  } catch (error) {
    console.error("Unable to build Canada program sitemap", error)
    return []
  }
}
