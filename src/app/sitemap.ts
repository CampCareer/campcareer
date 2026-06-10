import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { supabase } from "@/lib/supabase"
import { FIELDS } from "@/lib/fields"

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
  // 정적 페이지 — lastModified는 의미 있는 값이 없으면 생략
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/roi-explorer`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/compare`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/checklist`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/timeline`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/career-path`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/games`, priority: 0.4, changeFrequency: "monthly" },
    { url: `${BASE}/methodology`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/fields`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/privacy`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, priority: 0.2, changeFrequency: "yearly" },
  ]

  // 프로그래매틱: 전공 허브 + 전공×국가 랭킹
  const fieldPages: MetadataRoute.Sitemap = FIELDS.flatMap((f) => [
    { url: `${BASE}/fields/${f.slug}`, priority: 0.7, changeFrequency: "weekly" as const },
    ...Object.keys(MATVIEW).map((country) => ({
      url: `${BASE}/rankings/${f.slug}/${country}`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
    })),
  ])

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

  return [...staticPages, ...fieldPages, ...blogPages, ...detailPages]
}
