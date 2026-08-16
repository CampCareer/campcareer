import type { MetadataRoute } from "next"
import { ALL_FIFO_PATHS } from "@/lib/fifo/all-fifo-paths"
import { SITE_URL } from "@/lib/seo-routes.mjs"

const lastModified = new Date("2026-08-16")

export default function sitemap(): MetadataRoute.Sitemap {
  const verifiedPaths = ALL_FIFO_PATHS.filter(
    (path) => path.status === "verified" && Boolean(path.published),
  )

  return [
    {
      url: `${SITE_URL}/fifo`,
      lastModified,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    ...verifiedPaths.map((path) => ({
      url: `${SITE_URL}/fifo/${path.slug}`,
      lastModified,
      priority: 0.85,
      changeFrequency: "weekly" as const,
    })),
  ]
}
