import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchRoiData, VALID_COUNTRIES } from "@/lib/roi-query"
import { FIELDS, getFieldBySlug, COUNTRY_INFO, formatMoney } from "@/lib/fields"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/seo/json-ld"

export const revalidate = 86400

const RANK_LIMIT = 25

export function generateStaticParams() {
  return FIELDS.flatMap((f) =>
    VALID_COUNTRIES.map((c) => ({ field: f.slug, country: c }))
  )
}

function parseParams(params: { field: string; country: string }) {
  const field = getFieldBySlug(params.field)
  const country = (VALID_COUNTRIES as readonly string[]).includes(params.country)
    ? params.country
    : null
  return { field, country }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRanking(country: string, fieldQuery: string): Promise<any[]> {
  try {
    const result = await fetchRoiData({
      country,
      state: "ALL_STATES",
      field: fieldQuery,
      limit: RANK_LIMIT,
      sort: "roi_score",
    })
    return result.data
  } catch (err) {
    console.error(`[rankings] ${country}/${fieldQuery} fetch failed:`, err)
    return []
  }
}

export async function generateMetadata({ params }: { params: { field: string; country: string } }): Promise<Metadata> {
  const { field, country } = parseParams(params)
  if (!field || !country) return { title: "Not Found" }
  const info = COUNTRY_INFO[country]
  return pageMetadata({
    title: `Best ${field.label} Programs in ${info.label} by ROI (2026)`,
    description: `${info.label} ${field.label} programs ranked by return on investment — graduate salary vs tuition, payback period, and graduation rate, from government data.`,
    path: `/rankings/${params.field}/${params.country}`,
  })
}

export default async function RankingPage({ params }: { params: { field: string; country: string } }) {
  const { field, country } = parseParams(params)
  if (!field || !country) notFound()

  const info = COUNTRY_INFO[country]
  const rows = await getRanking(country, field.query)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLd data={breadcrumbLd([
        { name: "Fields", path: "/fields" },
        { name: field.label, path: `/fields/${field.slug}` },
        { name: info.label, path: `/rankings/${field.slug}/${country}` },
      ])} />
      {rows.length > 0 && (
        <JsonLd data={itemListLd(rows.map((row) => ({
          name: row.college_name,
          path: `/roi-explorer/${country}/${row.college_id}`,
        })))} />
      )}

      <Link href={`/fields/${field.slug}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
        ← {field.label} in all countries
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          {info.flag} Best {field.label} Programs in {info.label} by ROI
        </h1>
        <p className="text-slate-500 max-w-3xl">
          Ranked by ROI score — net salary after rent and living costs, weighted by graduation
          rate, relative to total degree tuition. Salary figures are median graduate earnings
          from government data ({new Date().getFullYear()}).
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500">
          No {field.label} data for {info.label} yet — coverage is being expanded.{" "}
          <Link href={`/roi-explorer?country=${country}`} className="text-blue-600 hover:underline">
            Browse all {info.label} programs
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["#", "University", "ROI", `Salary (${info.currency})`, "Payback", `Tuition (${info.currency}/yr)`].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${i < 2 ? "text-left" : "text-right"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                  <tr key={`${row.college_id}-${i}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/roi-explorer/${country}/${row.college_id}`}
                        className="font-medium text-slate-800 hover:text-blue-600 hover:underline"
                      >
                        {row.college_name}
                      </Link>
                      {row.field_name && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{row.field_name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {row.roi_score.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                      {formatMoney(country, row.gross_salary ?? row.median_earnings ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                      {row.payback_years} yrs
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">
                      {formatMoney(country, row.tuition ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        <Link href={`/roi-explorer?country=${country}&field=${encodeURIComponent(field.query)}`} className="text-blue-600 hover:underline">
          Explore with filters →
        </Link>
        <Link href="/methodology" className="text-slate-400 hover:text-slate-600 underline">
          How this ranking works
        </Link>
      </div>
    </div>
  )
}
