import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import ieGraduateOutcomesRaw from "@/data/ie-graduate-outcomes.json"
import { getIrelandOccupations } from "@/lib/country-occupation-data"
import { getAllSlugs, getCities } from "@/lib/language-schools-ie"
import { pageMetadata } from "@/lib/seo"
import { IrelandDecisionOverview, IrelandQuickRoiPreview } from "@/components/country-profiles/australia-decision-overview"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Ireland — Graduate Outcomes, Critical Skills & Schools | CampCareer",
  description:
    "Browse Ireland Critical Skills occupations, graduate outcomes by field, language schools, and post-study work pathways.",
  path: "/ie",
})

type FieldSummary = {
  isced_code: string
  field_name: string
  total_graduates: number
  employment_rate_pct: number
}

export default async function IrelandHubPage() {
  const occupations = getIrelandOccupations()
  const schoolSlugs = await getAllSlugs()
  const cities = await getCities()
  const graduateOutcomes = ieGraduateOutcomesRaw as unknown as {
    source: string
    source_url: string
    last_updated: string
    field_summaries: FieldSummary[]
  }
  const topFields = graduateOutcomes.field_summaries
    .filter((field) => field.isced_code)
    .sort((a, b) => b.employment_rate_pct - a.employment_rate_pct)
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Ireland", path: "/ie" },
      ])} />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <section className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Ireland</p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Work & Live in Ireland</h1>
            <p className="mb-8 max-w-2xl text-lg text-slate-600">
              Compare Critical Skills occupation fit, graduate employment outcomes by field,
              English-language study options, and post-study routes into the Irish labour market.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/ie/jobs" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-press">Browse {occupations.length} Critical Skills Roles</Link>
              <Link href="/roi-explorer/ie/language-schools" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50">Language Schools</Link>
            </div>
          </div>
          <IrelandQuickRoiPreview />
        </section>

        <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: String(occupations.length), label: "Critical Skills Signals" },
            { value: String(schoolSlugs.length), label: "Language Schools" },
            { value: String(cities.length), label: "School Cities" },
            { value: "Stamp 1G", label: "Graduate Route" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Strongest Graduate Outcome Fields</h2>
          <div className="space-y-2">
            {topFields.map((field) => (
              <div
                key={field.isced_code}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3"
              >
                <div>
                  <span className="font-medium text-slate-900">{field.field_name}</span>
                  <span className="ml-2 text-sm text-slate-400">
                    {field.total_graduates.toLocaleString()} graduates
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {field.employment_rate_pct}% employed
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Source: {graduateOutcomes.source} · Updated {graduateOutcomes.last_updated}
          </p>
        </section>

        <IrelandDecisionOverview />

        <section>
          <h2 className="mb-4 text-xl font-bold">Start Exploring</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/ie/jobs", title: "Critical Skills Jobs", body: "Role-level shortage signals linked to graduate fields." },
              { href: "/roi-explorer/ie/language-schools", title: "Language Schools", body: "Browse Irish language schools and city pages." },
              { href: "/roi-explorer?country=ie", title: "University ROI", body: "Compare tuition, salary signals, and payback by institution." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand/40 hover:bg-brand-tint"
              >
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-sm text-slate-500">{item.body}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
