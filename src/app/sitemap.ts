// POST-DEPLOY ACTIONS:
// 1. Check build log for "[sitemap] counts" line — AU occupations: 395, US: 116, CA occupations: 514, CA colleges: ~30
// 2. Open https://www.campcareer.com/sitemap.xml in browser and verify 1,900+ URLs are present
// 3. Go to Google Search Console → Sitemaps → delete old sitemap.xml entry → resubmit
// 4. Go to Search Console → URL Inspection → manually request indexing for 10 high-priority occupation pages per day
// 5. Monitor Search Console → Pages tab over the next 2–4 weeks for indexed page count increase

import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { getAllSlugs, getCities } from "@/lib/language-schools-ie"
import { SA4_BY_STATE } from "@/data/sa4-regions"
import { COUNTRY_ROI_DATA_META, COUNTRY_ROI_INSIGHTS } from "@/data/country-roi-mvp"
import { getMapData } from "@/lib/map-data"
import { getIndexableMapOccupations, MAP_COUNTRIES } from "@/lib/map-slugs"

const BASE = "https://www.campcareer.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // soft-hidden 라우트(career-path, fields, rankings, checklist, timeline, games,
  // compare, explore)는 next.config.mjs에서 / 로 리다이렉트되므로 sitemap에서 제외.
  const lastModStatic = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: lastModStatic, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/maps`, lastModified: lastModStatic, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/roi-explorer`, lastModified: lastModStatic, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/degree-risk`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/blog`, lastModified: lastModStatic, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/methodology`, lastModified: lastModStatic, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`, lastModified: lastModStatic, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, lastModified: lastModStatic, priority: 0.2, changeFrequency: "yearly" },
    // 국가별 허브 페이지 — 크롤러 진입점. orphan 페이지 문제 해결.
    { url: `${BASE}/au`, lastModified: lastModStatic, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/au/jobs`, lastModified: lastModStatic, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/ca`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ca/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/us`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/us/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/uk`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/uk/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/de`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/de/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/nl`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/nl/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ie`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/ie/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/be`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/be/jobs`, lastModified: lastModStatic, priority: 0.8, changeFrequency: "weekly" },
  ]

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
    changeFrequency: "monthly",
  }))

  const countryDetailPages: MetadataRoute.Sitemap = COUNTRY_ROI_INSIGHTS.map((country) => ({
    url: `${BASE}${country.href}`,
    lastModified: new Date(COUNTRY_ROI_DATA_META.lastUpdated),
    priority: 0.85,
    changeFrequency: "weekly",
  }))

  // Raw college IDs/UUIDs are intentionally excluded from the sitemap.
  // Search indexing is concentrated on readable Maps URLs instead.
  const lastMod = new Date()
  const mapOccupationPages: MetadataRoute.Sitemap = []
  for (const country of MAP_COUNTRIES) {
    const occupations = await getIndexableMapOccupations(country)
    mapOccupationPages.push(...occupations.map((occupation) => ({
      url: `${BASE}${occupation.path}`,
      lastModified: lastMod,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })))
  }

  // 아일랜드 어학원
  const ieSchoolSlugs = await getAllSlugs()
  const ieCities = await getCities()
  const ieLangSchoolPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/roi-explorer/ie/language-schools`, lastModified: lastMod, priority: 0.7, changeFrequency: "weekly" },
    ...ieCities.map((city) => ({
      url: `${BASE}/roi-explorer/ie/language-schools/city/${city.toLowerCase()}` as const,
      lastModified: lastMod,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })),
    ...ieSchoolSlugs.map((slug) => ({
      url: `${BASE}/roi-explorer/ie/language-schools/${slug}` as const,
      lastModified: lastMod,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })),
  ]

  // US 대학 SEO 페이지 (88개)
  const mapData = await getMapData()
  const usUnivPages: MetadataRoute.Sitemap = mapData.usRankedColleges.map((c) => ({
    url: `${BASE}/map/us/university/${c.slug}`,
    lastModified: lastMod,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // AU 대학 SEO 페이지 (28개)
  const auUnivPages: MetadataRoute.Sitemap = mapData.auRankedColleges.map((c) => ({
    url: `${BASE}/map/au/university/${c.slug}`,
    lastModified: lastMod,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // CA 대학 SEO 페이지 (~30개)
  const caUnivPages: MetadataRoute.Sitemap = mapData.caColleges.map((c) => ({
    url: `${BASE}/map/ca/university/${c.slug}`,
    lastModified: lastMod,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // UK 대학 SEO 페이지 (~80개)
  const ukUnivPages: MetadataRoute.Sitemap = mapData.ukColleges.map((c) => ({
    url: `${BASE}/map/uk/university/${c.slug}`,
    lastModified: lastMod,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // DE 대학 SEO 페이지 (55개)
  const deUnivPages: MetadataRoute.Sitemap = mapData.deColleges.map((c: { slug: string }) => ({
    url: `${BASE}/map/de/university/${c.slug}`,
    lastModified: lastMod,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // NL 대학 SEO 페이지 (13개)
  const nlUnivPages: MetadataRoute.Sitemap = mapData.nlColleges.map((c: { slug: string }) => ({
    url: `${BASE}/map/nl/university/${c.slug}`,
    lastModified: lastMod,
    priority: 0.6,
    changeFrequency: "weekly",
  }))

  // 전용 페이지: /map/au/employment/:state (8개) + /map/au/whv/:state (8개) + /map/au/whv/:state/:sa4 (88개)
  const mapPages: MetadataRoute.Sitemap = []
  const STATE_CODES = ["nsw", "vic", "qld", "sa", "wa", "tas", "nt", "act"]
  for (const sc of STATE_CODES) {
    mapPages.push({ url: `${BASE}/map/au/employment/${sc}`, lastModified: lastMod, priority: 0.7, changeFrequency: "weekly" })
    mapPages.push({ url: `${BASE}/map/au/whv/${sc}`, lastModified: lastMod, priority: 0.6, changeFrequency: "weekly" })
    const scUpper = sc.toUpperCase() as string
    const regions = SA4_BY_STATE[scUpper] ?? []
    for (const r of regions) {
      mapPages.push({ url: `${BASE}/map/au/whv/${sc}/${r.code}`, lastModified: lastMod, priority: 0.5, changeFrequency: "weekly" })
    }
  }

  const total = staticPages.length + blogPages.length + countryDetailPages.length + mapOccupationPages.length +
    ieLangSchoolPages.length + mapPages.length + usUnivPages.length + auUnivPages.length + caUnivPages.length + ukUnivPages.length + deUnivPages.length + nlUnivPages.length
  console.log(`[sitemap] counts — static: ${staticPages.length}, blog: ${blogPages.length}, country details: ${countryDetailPages.length}, map occupations: ${mapOccupationPages.length}, IE schools: ${ieLangSchoolPages.length}, map: ${mapPages.length}, US universities: ${usUnivPages.length}, AU universities: ${auUnivPages.length}, CA universities: ${caUnivPages.length}, UK universities: ${ukUnivPages.length}, DE universities: ${deUnivPages.length}, NL universities: ${nlUnivPages.length}, TOTAL: ${total}`)

  return [...staticPages, ...blogPages, ...countryDetailPages, ...mapOccupationPages, ...ieLangSchoolPages, ...mapPages, ...usUnivPages, ...auUnivPages, ...caUnivPages, ...ukUnivPages, ...deUnivPages, ...nlUnivPages]
}
