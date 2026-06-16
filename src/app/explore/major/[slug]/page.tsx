import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { majorLabel } from "@/lib/degree-risk"
import { EXPLORE_MAJORS, fetchMajorAcrossCountries, fitSort } from "@/lib/explore"
import { toExploreRows } from "@/lib/explore-display"
import { RankingTable, type RankingLabels } from "@/components/explore/ranking-table"
import { getTranslations } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/seo/json-ld"

// Dynamic so the NEXT_LOCALE cookie is honored (en/ko) — these are
// server-rendered on demand and fully indexable (crawlers get the en default).
export const dynamic = "force-dynamic"

function isExploreMajor(slug: string): slug is (typeof EXPLORE_MAJORS)[number] {
  return (EXPLORE_MAJORS as readonly string[]).includes(slug)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (!isExploreMajor(params.slug)) return { title: "Not Found" }
  const t = getTranslations()
  const opts = t.degreeRisk.options as Record<string, string>
  const major = opts[params.slug] ?? majorLabel(params.slug)
  return pageMetadata({
    title: t.explore.metaMajorTitle.replace("{major}", major),
    description: t.explore.metaMajorDesc.replace("{major}", major),
    path: `/explore/major/${params.slug}`,
  })
}

export default async function ExploreMajorPage({ params }: { params: { slug: string } }) {
  if (!isExploreMajor(params.slug)) notFound()

  const t = getTranslations()
  const ex = t.explore
  const rr = t.degreeRisk.result
  const opts = t.degreeRisk.options as Record<string, string>
  const major = opts[params.slug] ?? majorLabel(params.slug)

  const rows = fitSort(await fetchMajorAcrossCountries(params.slug))
  const displayRows = toExploreRows(rows, "country")

  const labels: RankingLabels = {
    nameHeader: ex.countryHeader,
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
          { name: major, path: `/explore/major/${params.slug}` },
        ])}
      />
      {displayRows.length > 0 && (
        <JsonLd
          data={itemListLd(displayRows.map((r) => ({ name: r.name, path: r.href })))}
        />
      )}

      <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft className="h-3.5 w-3.5" /> {ex.backToHub}
      </Link>

      <div className="mb-8 mt-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          {ex.majorH1.replace("{major}", major)}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-500">{ex.majorIntro.replace("{major}", major)}</p>
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
        <Link href="/methodology" className="text-slate-400 underline hover:text-slate-600">
          {t.degreeRisk.resultMeta.methodology}
        </Link>
      </div>
    </div>
  )
}
