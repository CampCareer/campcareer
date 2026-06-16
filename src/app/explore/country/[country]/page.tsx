import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { type CountryCode, ALL_COUNTRIES, COUNTRY_META } from "@/lib/degree-risk"
import { fetchCountryMajors, fitSort } from "@/lib/explore"
import { toExploreRows } from "@/lib/explore-display"
import { RankingTable, type RankingLabels } from "@/components/explore/ranking-table"
import { getTranslations } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/seo/json-ld"

// Dynamic so the NEXT_LOCALE cookie is honored (en/ko) — server-rendered on
// demand and fully indexable (crawlers get the en default).
export const dynamic = "force-dynamic"

function parseCountry(raw: string): CountryCode | null {
  const up = raw.toUpperCase()
  return (ALL_COUNTRIES as string[]).includes(up) ? (up as CountryCode) : null
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const code = parseCountry(params.country)
  if (!code) return { title: "Not Found" }
  const t = getTranslations()
  const country = t.degreeRisk.result.countries[code]
  return pageMetadata({
    title: t.explore.metaCountryTitle.replace("{country}", country),
    description: t.explore.metaCountryDesc.replace("{country}", country),
    path: `/explore/country/${params.country.toLowerCase()}`,
  })
}

export default async function ExploreCountryPage({ params }: { params: { country: string } }) {
  const code = parseCountry(params.country)
  if (!code) notFound()

  const t = getTranslations()
  const ex = t.explore
  const rr = t.degreeRisk.result
  const country = rr.countries[code]

  const rows = fitSort(await fetchCountryMajors(code))
  const displayRows = toExploreRows(rows, "major")

  const labels: RankingLabels = {
    nameHeader: ex.majorHeader,
    risk: ex.riskHeader,
    employment: rr.layerEmployment,
    visa: rr.layerVisa,
    demand: rr.layerDemand,
    ai: rr.layerAi,
    roi: rr.layerRoi,
    estimate: t.degreeRisk.resultMeta.estimateBadge,
    view: ex.view,
    sortHint: ex.sortHint,
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        data={breadcrumbLd([
          { name: ex.hubTitle, path: "/explore" },
          { name: country, path: `/explore/country/${params.country.toLowerCase()}` },
        ])}
      />
      {displayRows.length > 0 && (
        <JsonLd data={itemListLd(displayRows.map((r) => ({ name: r.name, path: r.href })))} />
      )}

      <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft className="h-3.5 w-3.5" /> {ex.backToHub}
      </Link>

      <div className="mb-8 mt-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          {COUNTRY_META[code].flag} {ex.countryH1.replace("{country}", country)}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-500">{ex.countryIntro.replace("{country}", country)}</p>
      </div>

      {displayRows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
          {ex.noData}
        </div>
      ) : (
        <RankingTable rows={displayRows} labels={labels} />
      )}

      <p className="mt-4 max-w-3xl text-xs text-slate-400">
        {ex.estimateNote}{" "}
        <Link href="/methodology" className="underline underline-offset-2 hover:text-slate-600">
          {t.degreeRisk.resultMeta.methodology}
        </Link>
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        <Link href="/degree-risk" className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700">
          {ex.ctaCheck} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link href="/compare" className="text-blue-600 hover:underline">{ex.ctaCompare}</Link>
      </div>
    </div>
  )
}
