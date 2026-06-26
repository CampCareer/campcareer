import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { supabase } from "@/lib/supabase"

const BASE = "https://www.campcareer.com"

// 비치헤드 = 호주. 다른 국가 matview는 색인 집중을 위해 sitemap에서 의도적으로 제외.
const AU_MATVIEW = "roi_explorer_au"
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
      if (row.college_id) ids.add(row.college_id as string)
    }
    if (!data || data.length < PAGE_SIZE) break
  }
  return Array.from(ids)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // soft-hidden 라우트(career-path, fields, rankings, checklist, timeline, games,
  // compare, explore)는 next.config.mjs에서 / 로 리다이렉트되므로 sitemap에서 제외.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/roi-explorer`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/degree-risk`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/methodology`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, priority: 0.2, changeFrequency: "yearly" },
  ]

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
    changeFrequency: "monthly",
  }))

  // 대학 디테일 — 호주만 색인
  const detailPages: MetadataRoute.Sitemap = []
  const ids = await fetchCollegeIds(AU_MATVIEW)
  for (const id of ids) {
    detailPages.push({
      url: `${BASE}/roi-explorer/au/${id}`,
      priority: 0.5,
      changeFrequency: "monthly",
    })
  }

  // 직업 디테일 — ANZSCO 395개 전부 색인
  const occupationPages: MetadataRoute.Sitemap = []
  const { data: occCodes } = await supabase
    .from("occupations_au")
    .select("anzsco_code")
  for (const row of occCodes ?? []) {
    if (!row.anzsco_code) continue
    occupationPages.push({
      url: `${BASE}/roi-explorer/au/occupation/${row.anzsco_code}`,
      priority: 0.6,
      changeFrequency: "weekly",
    })
  }

  return [...staticPages, ...blogPages, ...detailPages, ...occupationPages]
}