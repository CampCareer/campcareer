import type { Metadata } from "next"
import { TrendingUp, Info } from "lucide-react"
import { createClient } from "@/lib/supabase-server"
import { fetchPrPathways } from "@/lib/pr-pathways"
import { getTranslations } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"
import {
  type MajorRow,
  type CountryCode,
  ALL_COUNTRIES,
  COUNTRY_META,
  isMajorSlug,
  majorLabel,
  layerMeta,
} from "@/lib/degree-risk"
import { ImmigrationTimeline } from "@/components/immigration-timeline"
import { CompareSelectors } from "./compare-selectors"
import { ComparisonTable } from "./comparison-table"

const DEFAULT_FIELD = "computer-science"
const DEFAULT_A: CountryCode = "IE"
const DEFAULT_B: CountryCode = "CA"

type SearchParams = { field?: string; a?: string; b?: string }

function normCountry(raw: string | undefined, fallback: CountryCode): CountryCode {
  const up = (raw ?? "").toUpperCase()
  return (ALL_COUNTRIES as string[]).includes(up) ? (up as CountryCode) : fallback
}

// Resolve + sanitize the three selections. Enforces A ≠ B (the brief's
// "same-country selection blocked"); a duplicate B falls to the next country.
function resolveParams(sp: SearchParams) {
  const field = sp.field && isMajorSlug(sp.field) ? sp.field : DEFAULT_FIELD
  const a = normCountry(sp.a, DEFAULT_A)
  let b = normCountry(sp.b, DEFAULT_B)
  if (b === a) b = ALL_COUNTRIES.find((c) => c !== a) as CountryCode
  return { field, a, b }
}

export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  const { field, a, b } = resolveParams(searchParams)
  const t = getTranslations()
  const opts = t.degreeRisk.options as Record<string, string>
  const majorName = opts[field] ?? majorLabel(field)
  const an = t.degreeRisk.result.countries[a]
  const bn = t.degreeRisk.result.countries[b]

  const title = `${majorName}: ${an} vs ${bn} — degree risk`
  const description = `Compare ${majorName} in ${an} and ${bn} side by side — employment, post-study visa, market demand, AI exposure, and study ROI, with verified sources.`
  const path = `/compare?field=${field}&a=${a}&b=${b}`
  const ogImage = `/compare/og?field=${field}&a=${a}&b=${b}`

  const base = pageMetadata({ title, description, path })
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { ...base.twitter, images: [ogImage] },
  }
}

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const { field, a, b } = resolveParams(searchParams)

  const t = getTranslations()
  const tc = t.compare
  const opts = t.degreeRisk.options as Record<string, string>
  const majorName = opts[field] ?? majorLabel(field)

  // Verified majors layer — same resilient select("*") the result page uses, so
  // layer_meta is picked up after its migration without breaking the query.
  const supabase = createClient()
  const { data, error } = await supabase
    .from("majors")
    .select("*")
    .eq("slug", field)
    .in("country", [a, b])
  if (error) console.error("[compare] majors query failed:", error.message)

  const rows = (data ?? []) as unknown as MajorRow[]
  const rowA = rows.find((r) => r.country === a) ?? null
  const rowB = rows.find((r) => r.country === b) ?? null

  const prMap = rowA || rowB ? await fetchPrPathways() : {}

  const cols: { country: CountryCode; row: MajorRow | null }[] = [
    { country: a, row: rowA },
    { country: b, row: rowB },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-blue-100">
          <TrendingUp className="w-3 h-3" />
          {tc.badge}
        </div>
        <h1 className="font-display text-3xl font-semibold text-slate-900 tracking-tight">{tc.pageTitle}</h1>
        <p className="mt-2 text-slate-500 text-sm">{tc.pageSubtitle}</p>
      </div>

      {/* Selectors */}
      <CompareSelectors field={field} a={a} b={b} />

      {/* Apple-style layer comparison */}
      <section>
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-3">{tc.tableHeading}</h2>
        <ComparisonTable a={a} b={b} rowA={rowA} rowB={rowB} />
        {(!rowA || !rowB) && (
          <p className="mt-3 inline-flex items-start gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <Info className="w-3.5 h-3.5 mt-px shrink-0 text-amber-500" />
            {tc.notScoredBody
              .replace("{major}", majorName)
              .replace(
                "{country}",
                t.degreeRisk.result.countries[!rowA ? a : b]
              )}
          </p>
        )}
      </section>

      {/* Two immigration timelines, side by side */}
      {(rowA || rowB) && (
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-1">{tc.timelineHeading}</h2>
          <p className="text-sm text-slate-500 mb-4">{tc.timelineSubtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {cols.map(({ country, row }) =>
              row ? (
                <ImmigrationTimeline
                  key={country}
                  country={country}
                  postStudyYears={row.post_study_work_years}
                  visa={layerMeta(row, "visa")}
                  pr={prMap[country] ?? null}
                  heading={
                    <span className="flex items-center gap-2">
                      <span>{COUNTRY_META[country].flag}</span>
                      {t.degreeRisk.result.countries[country]}
                    </span>
                  }
                />
              ) : (
                <div
                  key={country}
                  className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-sm text-slate-400"
                >
                  {tc.notScoredBody
                    .replace("{major}", majorName)
                    .replace("{country}", t.degreeRisk.result.countries[country])}
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  )
}
