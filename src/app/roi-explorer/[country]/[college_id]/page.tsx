import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchRoiData, VALID_COUNTRIES, type RoiCountry } from "@/lib/roi-query"
import { supabase } from "@/lib/supabase"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { CollegeDetailClient, type DetailRow } from "./CollegeDetailClient"

export const revalidate = 3600

const COLLEGES_TABLE: Record<RoiCountry, string> = {
  us: "colleges_us",
  au: "colleges_au",
  ca: "colleges_ca",
  uk: "colleges_uk",
  ie: "colleges_ie",
}

const CURRENCY_SYMBOL: Record<RoiCountry, string> = {
  us: "$", au: "A$", ca: "C$", uk: "£", ie: "€",
}

const COUNTRY_LABEL: Record<RoiCountry, string> = {
  us: "United States",
  au: "Australia",
  ca: "Canada",
  uk: "United Kingdom",
  ie: "Ireland",
}

type Params = { country: string; college_id: string }

function parseCountry(raw: string): RoiCountry | null {
  return (VALID_COUNTRIES as readonly string[]).includes(raw) ? (raw as RoiCountry) : null
}

// generateMetadata와 페이지 본문이 같은 요청 안에서 데이터를 공유하도록 cache로 감쌈
const getDetailRows = cache(async (country: RoiCountry, collegeId: string): Promise<DetailRow[]> => {
  try {
    const result = await fetchRoiData({
      country,
      collegeId,
      limit: 200,
      sort: "roi_score",
    })
    return result.data as DetailRow[]
  } catch (err) {
    console.error("[college-detail] fetch failed:", err)
    return []
  }
})

async function getWebsiteUrl(country: RoiCountry, collegeId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from(COLLEGES_TABLE[country])
    .select("website_url")
    .eq("id", collegeId)
    .maybeSingle()
  if (error) {
    console.error("[college-detail] website_url query failed:", error)
    return null
  }
  return data?.website_url ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const country = parseCountry(params.country)
  if (!country) return { title: "Not Found" }

  const rows = await getDetailRows(country, params.college_id)
  if (rows.length === 0) return { title: "Not Found" }

  const best = rows[0]
  const sym = CURRENCY_SYMBOL[country]
  return pageMetadata({
    title: `${best.college_name} — ROI, Graduate Salary & Tuition`,
    description: `${best.college_name} (${COUNTRY_LABEL[country]}): ROI score ${best.roi_score.toFixed(1)}, median graduate earnings ${sym}${Math.round(best.median_earnings).toLocaleString()}, tuition ${sym}${Math.round(best.tuition).toLocaleString()}/yr, payback ${best.payback_years} yrs. Compare outcomes on CampCareer.`,
    path: `/roi-explorer/${country}/${params.college_id}`,
  })
}

export default async function CollegeDetailPage({ params }: { params: Params }) {
  const country = parseCountry(params.country)
  if (!country) notFound()

  const [rows, websiteUrl] = await Promise.all([
    getDetailRows(country, params.college_id),
    getWebsiteUrl(country, params.college_id),
  ])

  if (rows.length === 0) notFound()

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "ROI Explorer", path: "/roi-explorer" },
        { name: COUNTRY_LABEL[country], path: `/roi-explorer?country=${country}` },
        { name: rows[0].college_name, path: `/roi-explorer/${country}/${params.college_id}` },
      ])} />
      <CollegeDetailClient country={country} rows={rows} websiteUrl={websiteUrl} />
    </>
  )
}
