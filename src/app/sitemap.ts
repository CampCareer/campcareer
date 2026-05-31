import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.campcareer.com"
  const now = new Date()

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${base}/roi-explorer`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${base}/compare`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${base}/roi-explorer?country=ie`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/roi-explorer?country=au`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/roi-explorer?country=ca`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/roi-explorer?country=uk`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/roi-explorer?country=us`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/blog`, priority: 0.7, changeFrequency: "weekly" as const },
  ]

  return staticPages.map((page) => ({
    ...page,
    lastModified: now,
  }))
}
