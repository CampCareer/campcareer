import type { MetadataRoute } from "next"
import { getIndexableCaProgramsForSitemap } from "@/lib/programs/ca-programs.server"
import { caProgramDetailPath } from "@/lib/programs/program-search"
import { SITE_URL } from "@/lib/seo-routes.mjs"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const programs = await getIndexableCaProgramsForSitemap()
    return programs.map((program) => ({
      url: `${SITE_URL}${caProgramDetailPath(program.id, program.title)}`,
      lastModified: new Date(program.lastModified),
      changeFrequency: "weekly" as const,
      priority: 0.72,
    }))
  } catch (error) {
    console.error("Unable to build Canada program sitemap", error)
    return []
  }
}
