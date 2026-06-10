import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchRoiData } from "@/lib/roi-query"
import { FIELDS, getFieldBySlug, COUNTRY_INFO, formatMoney } from "@/lib/fields"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd, faqLd } from "@/components/seo/json-ld"

export const revalidate = 86400

const COUNTRIES = ["us", "uk", "ie", "ca", "au"] as const

export function generateStaticParams() {
  return FIELDS.map((f) => ({ field: f.slug }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCountrySummary(country: string, fieldQuery: string): Promise<any> {
  try {
    const result = await fetchRoiData({
      country,
      state: "ALL_STATES",
      field: fieldQuery,
      limit: 10,
      sort: "roi_score",
    })
    const rows = result.data
    if (rows.length === 0) return { country, rows: [] }
    const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
    return {
      country,
      rows,
      top: rows[0],
      avgRoi: Math.round(avg(rows.map((r) => r.roi_score)) * 10) / 10,
      avgSalary: Math.round(avg(rows.map((r) => r.gross_salary ?? r.median_earnings ?? 0))),
      avgPayback: Math.round(avg(rows.map((r) => r.payback_years)) * 10) / 10,
    }
  } catch (err) {
    console.error(`[fields] ${country}/${fieldQuery} fetch failed:`, err)
    return { country, rows: [] }
  }
}

export async function generateMetadata({ params }: { params: { field: string } }): Promise<Metadata> {
  const field = getFieldBySlug(params.field)
  if (!field) return { title: "Not Found" }
  return pageMetadata({
    title: `${field.label} Abroad — ROI, Salaries & Best Universities in 5 Countries`,
    description: `Where should you study ${field.label}? Compare graduate salaries, tuition ROI, and payback periods for ${field.label} across the US, UK, Ireland, Canada, and Australia.`,
    path: `/fields/${params.field}`,
  })
}

export default async function FieldPage({ params }: { params: { field: string } }) {
  const field = getFieldBySlug(params.field)
  if (!field) notFound()

  const summaries = await Promise.all(
    COUNTRIES.map((c) => getCountrySummary(c, field.query))
  )
  const withData = summaries.filter((s) => s.rows.length > 0)

  const faqs = [
    {
      question: `Which country is best for studying ${field.label}?`,
      answer:
        withData.length > 0
          ? `It depends on tuition, salaries, and visa goals. Top ${field.label} programs by ROI include ${withData
              .slice(0, 3)
              .map((s) => `${s.top.college_name} (${COUNTRY_INFO[s.country].label})`)
              .join(", ")}. ROI scores are computed per country — compare patterns, not exact numbers across currencies.`
          : `Data for ${field.label} is being expanded. Use the ROI Explorer to browse available programs.`,
    },
    {
      question: `How much do ${field.label} graduates earn?`,
      answer:
        withData.length > 0
          ? withData
              .map((s) => `${COUNTRY_INFO[s.country].label}: about ${formatMoney(s.country, s.avgSalary)} (median, top programs)`)
              .join("; ") + ". Figures come from government graduate-outcome datasets."
          : `Earnings data for ${field.label} is being expanded.`,
    },
    {
      question: "How is ROI calculated?",
      answer:
        "ROI = (net salary after rent and living costs × graduation rate) ÷ total degree tuition. See campcareer.com/methodology for the full formula, tax assumptions, and data sources.",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLd data={breadcrumbLd([
        { name: "Fields", path: "/fields" },
        { name: field.label, path: `/fields/${field.slug}` },
      ])} />
      <JsonLd data={faqLd(faqs)} />

      <Link href="/fields" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
        ← All fields
      </Link>

      <div className="mt-4 mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          {field.label} Abroad — ROI & Salaries in 5 Countries
        </h1>
        <p className="text-slate-500 max-w-3xl">
          Median graduate earnings, tuition ROI, and payback periods for {field.label}, computed
          from government data. Scores are per-country (local currency and tax) — use them to
          rank programs within a country, and the salary/payback columns to reason across
          countries.
        </p>
      </div>

      <div className="space-y-4">
        {summaries.map((s) => {
          const info = COUNTRY_INFO[s.country]
          if (s.rows.length === 0) {
            return (
              <div key={s.country} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm opacity-70">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{info.flag}</span>
                  <h2 className="font-semibold text-slate-800">{info.label}</h2>
                  <span className="ml-auto text-xs text-slate-400">No {field.label} data yet</span>
                </div>
              </div>
            )
          }
          return (
            <div key={s.country} className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{info.flag}</span>
                <h2 className="font-semibold text-slate-800">{info.label}</h2>
                <Link
                  href={`/rankings/${field.slug}/${s.country}`}
                  className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Full {info.label} ranking →
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Top program</p>
                  <Link
                    href={`/roi-explorer/${s.country}/${s.top.college_id}`}
                    className="font-medium text-slate-800 hover:text-indigo-600 hover:underline line-clamp-2"
                  >
                    {s.top.college_name}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Avg ROI (top 10)</p>
                  <p className="font-semibold text-indigo-600 text-lg">{s.avgRoi}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Median salary</p>
                  <p className="font-semibold text-slate-800 text-lg">{formatMoney(s.country, s.avgSalary)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Avg payback</p>
                  <p className="font-semibold text-slate-800 text-lg">{s.avgPayback} yrs</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
        <Link href="/compare" className="text-indigo-600 hover:underline">Compare all countries side-by-side</Link>
        <Link href="/methodology" className="text-slate-400 hover:text-slate-600 underline">Methodology</Link>
      </div>
    </div>
  )
}
