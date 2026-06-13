import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { supabase } from "@/lib/supabase"

const BASE = "https://www.campcareer.com"

const MATVIEW: Record<string, string> = {
  us: "roi_explorer_us",
  au: "roi_explorer_au",
  ca: "roi_explorer_ca",
  uk: "roi_explorer_uk",
  ie: "roi_explorer_ie",
}

const PAGE_SIZE = 1000

async function fetchCollegeIds(table: string): Promise<string[]> {
  const ids = new Set<string>()
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select("college_id")
      .range(from, from + PAGE_SIZE - 1)
    if (error) {
      console.error(`[sitemap] ${table} query failed:`, error)
      break
    }
    for (const row of data ?? []) {
      if (row.college_id) ids.add(row.college_id)
    }
    if (!data || data.length < PAGE_SIZE) break
  }
  return Array.from(ids)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지 — soft-hidden 라우트(career-path, fields, rankings, checklist,
  // timeline, games)는 next.config.mjs에서 / 로 302되므로 sitemap에서 제외.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/degree-risk`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/roi-explorer`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/compare`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/methodology`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, priority: 0.2, changeFrequency: "yearly" },
  ]

  // 블로그 글 — frontmatter date를 lastModified로
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
    changeFrequency: "monthly",
  }))

  // 대학 디테일 페이지 — matview에서 country별 college_id 목록
  const detailPages: MetadataRoute.Sitemap = []
  for (const [country, table] of Object.entries(MATVIEW)) {
    const ids = await fetchCollegeIds(table)
    for (const id of ids) {
      detailPages.push({
        url: `${BASE}/roi-explorer/${country}/${id}`,
        priority: 0.5,
        changeFrequency: "monthly",
      })
    }
  }

  return [...staticPages, ...blogPages, ...detailPages]
}
