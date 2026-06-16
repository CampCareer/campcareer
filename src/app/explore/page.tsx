import Link from "next/link"
import type { Metadata } from "next"
import { GraduationCap, ArrowRight } from "lucide-react"
import { ALL_COUNTRIES, COUNTRY_META, majorLabel } from "@/lib/degree-risk"
import { EXPLORE_MAJORS } from "@/lib/explore"
import { getTranslations } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, itemListLd } from "@/components/seo/json-ld"

export function generateMetadata(): Metadata {
  const t = getTranslations()
  return pageMetadata({
    title: t.explore.metaHubTitle,
    description: t.explore.metaHubDesc,
    path: "/explore",
  })
}

export default function ExploreHubPage() {
  const t = getTranslations()
  const ex = t.explore
  const rr = t.degreeRisk.result
  const opts = t.degreeRisk.options as Record<string, string>

  const majors = EXPLORE_MAJORS.map((slug) => ({
    slug,
    label: opts[slug] ?? majorLabel(slug),
    href: `/explore/major/${slug}`,
  }))
  const countries = ALL_COUNTRIES.map((c) => ({
    code: c,
    label: rr.countries[c],
    flag: COUNTRY_META[c].flag,
    href: `/explore/country/${c.toLowerCase()}`,
  }))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        data={itemListLd([
          ...majors.map((m) => ({ name: m.label, path: m.href })),
          ...countries.map((c) => ({ name: c.label, path: c.href })),
        ])}
      />

      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">{ex.hubTitle}</h1>
        <p className="mt-3 max-w-3xl text-slate-500">{ex.hubSubtitle}</p>
      </div>

      {/* By major */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900">{ex.byMajorTitle}</h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">{ex.byMajorDesc}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {majors.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-blue-300 hover:shadow"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="font-medium text-slate-800 transition-colors group-hover:text-blue-700">{m.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* By country */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900">{ex.byCountryTitle}</h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">{ex.byCountryDesc}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={c.href}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-blue-300 hover:shadow"
            >
              <span className="text-lg">{c.flag}</span>
              <span className="font-medium text-slate-800 transition-colors group-hover:text-blue-700">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4 text-sm">
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
