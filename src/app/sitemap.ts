// POST-DEPLOY ACTIONS:
// 1. Check build log for "[sitemap] counts" line — AU occupations: 395, US: 116, CA occupations: 514, CA colleges: ~30
// 2. Open https://www.campcareer.com/sitemap.xml in browser and verify 1,900+ URLs are present
// 3. Go to Google Search Console → Sitemaps → delete old sitemap.xml entry → resubmit
// 4. Go to Search Console → URL Inspection → manually request indexing for 10 high-priority occupation pages per day
// 5. Monitor Search Console → Pages tab over the next 2–4 weeks for indexed page count increase

import { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"
import { getAllPosts } from "@/lib/blog"
import { getUSOccCodes } from "@/lib/us-occupation-detail"
import { getAllSlugs, getCities } from "@/lib/language-schools-ie"
import { SA4_BY_STATE } from "@/data/sa4-regions"
import { getMapData } from "@/lib/map-data"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    // 국가별 허브 페이지 — 크롤러 진입점. orphan 페이지 문제 해결.
    { url: `${BASE}/au`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/au/jobs`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/ca`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ca/jobs`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/us`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/us/jobs`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/uk`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/uk/jobs`, priority: 0.8, changeFrequency: "weekly" },
  ]

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
    changeFrequency: "monthly",
  }))

  // 대학 디테일 — 호주 + 캐나다
  const detailPages: MetadataRoute.Sitemap = []
  const auIds = await fetchCollegeIds(AU_MATVIEW)
  for (const id of auIds) {
    detailPages.push({
      url: `${BASE}/roi-explorer/au/${id}`,
      priority: 0.5,
      changeFrequency: "monthly",
    })
  }
  const { data: caColleges } = await supabase
    .from("colleges_ca")
    .select("institution_id")
  for (const row of caColleges ?? []) {
    if (!row.institution_id) continue
    detailPages.push({
      url: `${BASE}/roi-explorer/ca/${row.institution_id}`,
      priority: 0.5,
      changeFrequency: "monthly",
    })
  }

  // 대학 디테일 — 영국
  const ukIds = await fetchCollegeIds("roi_explorer_uk")
  for (const id of ukIds) {
    detailPages.push({
      url: `${BASE}/roi-explorer/uk/${id}`,
      priority: 0.5,
      changeFrequency: "monthly",
    })
  }

  // 직업 디테일 — ANZSCO 395개 전부 색인
  const occupationPages: MetadataRoute.Sitemap = []
  const { data: occCodes, error: occError } = await supabase
    .from("occupations_au")
    .select("anzsco_code")
  if (occError) console.error("[sitemap] occupations_au failed:", occError.message)
  for (const row of occCodes ?? []) {
    if (!row.anzsco_code) continue
    occupationPages.push({
      url: `${BASE}/roi-explorer/au/occupation/${row.anzsco_code}`,
      priority: 0.6,
      changeFrequency: "weekly",
    })
  }

  // US 직업 디테일 — SOC 116개
  const usCodes = getUSOccCodes()
  console.log("[sitemap] US occ codes count:", usCodes.length)
  const usOccupationPages: MetadataRoute.Sitemap = usCodes.map((code) => ({
    url: `${BASE}/roi-explorer/us/occupation/${code}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // CA 직업 디테일 — NOC 514개
  const caOccupationPages: MetadataRoute.Sitemap = []
  const { data: caOccCodes, error: caOccError } = await supabase
    .from("occupations_ca")
    .select("noc_code")
  if (caOccError) console.error("[sitemap] occupations_ca failed:", caOccError.message)
  for (const row of caOccCodes ?? []) {
    if (!row.noc_code) continue
    caOccupationPages.push({
      url: `${BASE}/roi-explorer/ca/occupation/${row.noc_code}`,
      priority: 0.6,
      changeFrequency: "weekly",
    })
  }

  // UK 직업 디테일 — SOC 코드
  const ukOccupationPages: MetadataRoute.Sitemap = []
  const { data: ukOccCodes, error: ukOccError } = await supabase
    .from("occupations_uk")
    .select("soc_code")
  if (ukOccError) console.error("[sitemap] occupations_uk failed:", ukOccError.message)
  for (const row of ukOccCodes ?? []) {
    if (!row.soc_code) continue
    ukOccupationPages.push({
      url: `${BASE}/roi-explorer/uk/occupation/${row.soc_code}`,
      priority: 0.6,
      changeFrequency: "weekly",
    })
  }

  // 아일랜드 어학원
  const ieSchoolSlugs = await getAllSlugs()
  const ieCities = await getCities()
  const ieLangSchoolPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/roi-explorer/ie/language-schools`, priority: 0.7, changeFrequency: "weekly" },
    ...ieCities.map((city) => ({
      url: `${BASE}/roi-explorer/ie/language-schools/city/${city.toLowerCase()}` as const,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })),
    ...ieSchoolSlugs.map((slug) => ({
      url: `${BASE}/roi-explorer/ie/language-schools/${slug}` as const,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })),
  ]

  // US 대학 SEO 페이지 (88개)
  const mapData = await getMapData()
  const usUnivPages: MetadataRoute.Sitemap = mapData.usRankedColleges.map((c) => ({
    url: `${BASE}/map/us/university/${c.slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // AU 대학 SEO 페이지 (28개)
  const auUnivPages: MetadataRoute.Sitemap = mapData.auRankedColleges.map((c) => ({
    url: `${BASE}/map/au/university/${c.slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // CA 대학 SEO 페이지 (~30개)
  const caUnivPages: MetadataRoute.Sitemap = mapData.caColleges.map((c) => ({
    url: `${BASE}/map/ca/university/${c.slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // UK 대학 SEO 페이지 (~80개)
  const ukUnivPages: MetadataRoute.Sitemap = mapData.ukColleges.map((c) => ({
    url: `${BASE}/map/uk/university/${c.slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // DE 정적 페이지
  const deStaticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/de`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/de/jobs`, priority: 0.8, changeFrequency: "weekly" },
  ]

  // DE 직업 디테일 — KldB 124개
  const deOccData = (await import("@/data/de-occupations.json")).default as Record<string, { kldb_code: string }>
  const deOccupationPages: MetadataRoute.Sitemap = Object.values(deOccData).map((occ) => ({
    url: `${BASE}/roi-explorer/de/occupation/${occ.kldb_code}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // DE 대학 SEO 페이지 (55개)
  const deUnivPages: MetadataRoute.Sitemap = mapData.deColleges.map((c: { slug: string }) => ({
    url: `${BASE}/map/de/university/${c.slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // 전용 페이지: /map/au/employment/:state (8개) + /map/au/whv/:state (8개) + /map/au/whv/:state/:sa4 (88개)
  const mapPages: MetadataRoute.Sitemap = []
  const STATE_CODES = ["nsw", "vic", "qld", "sa", "wa", "tas", "nt", "act"]
  for (const sc of STATE_CODES) {
    mapPages.push({ url: `${BASE}/map/au/employment/${sc}`, priority: 0.7, changeFrequency: "weekly" })
    mapPages.push({ url: `${BASE}/map/au/whv/${sc}`, priority: 0.6, changeFrequency: "weekly" })
    const scUpper = sc.toUpperCase() as string
    const regions = SA4_BY_STATE[scUpper] ?? []
    for (const r of regions) {
      mapPages.push({ url: `${BASE}/map/au/whv/${sc}/${r.code}`, priority: 0.5, changeFrequency: "weekly" })
    }
  }

  const total = staticPages.length + blogPages.length + detailPages.length +
    occupationPages.length + usOccupationPages.length + caOccupationPages.length + ukOccupationPages.length + ieLangSchoolPages.length + mapPages.length + usUnivPages.length + auUnivPages.length + caUnivPages.length + ukUnivPages.length + deStaticPages.length + deOccupationPages.length + deUnivPages.length
  console.log(`[sitemap] counts — static: ${staticPages.length}, blog: ${blogPages.length}, AU colleges: ${detailPages.length}, AU occupations: ${occupationPages.length}, US occupations: ${usOccupationPages.length}, CA occupations: ${caOccupationPages.length}, UK occupations: ${ukOccupationPages.length}, IE schools: ${ieLangSchoolPages.length}, map: ${mapPages.length}, US universities: ${usUnivPages.length}, AU universities: ${auUnivPages.length}, CA universities: ${caUnivPages.length}, UK universities: ${ukUnivPages.length}, DE static: ${deStaticPages.length}, DE occupations: ${deOccupationPages.length}, DE universities: ${deUnivPages.length}, TOTAL: ${total}`)

  return [...staticPages, ...blogPages, ...detailPages, ...occupationPages, ...usOccupationPages, ...caOccupationPages, ...ukOccupationPages, ...ieLangSchoolPages, ...mapPages, ...usUnivPages, ...auUnivPages, ...caUnivPages, ...ukUnivPages, ...deStaticPages, ...deOccupationPages, ...deUnivPages]
}