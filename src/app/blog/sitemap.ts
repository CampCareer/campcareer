import type { MetadataRoute } from "next"
import { getPublishedBlogPosts } from "@/lib/blog"
import { SITE_URL } from "@/lib/seo-routes.mjs"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedBlogPosts()

  return [
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date("2026-08-14"),
      changeFrequency: "weekly",
      priority: 0.72,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.lastReviewed ?? post.date),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.72 : 0.64,
    })),
  ]
}
