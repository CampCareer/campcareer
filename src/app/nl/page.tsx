import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"
import nlCollegesRaw from "@/data/nl-colleges.json"
import nlOccupationsRaw from "@/data/nl-occupations.json"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in the Netherlands — Salary, Visa & University Guide | CampCareer",
  description:
    "Browse 72 SBC occupations in the Netherlands with CBS salary data and shortage ratings. Compare 13 top Dutch universities (WO) by QS ranking and tuition. Orientation Year, Kennismigrant, and EU Blue Card visa pathways.",
  path: "/nl",
})

type NlOcc = { shortage_rating: number | null; median_salary_eur: number | null }
type NlCollege = { qs_rank: number | null; name: string; slug: string; city: string }

function getStats() {
  const occs = Object.values(nlOccupationsRaw as unknown as Record<string, NlOcc>)
  const highDemand = occs.filter((o) => (o.shortage_rating ?? 0) >= 4).length
  return { occCount: occs.length, highDemand }
}

function getTopColleges(): NlCollege[] {
  const raw = nlCollegesRaw as unknown as NlCollege[]
  return [...raw]
    .filter((c) => c.qs_rank != null)
    .sort((a, b) => (a.qs_rank ?? 999) - (b.qs_rank ?? 999))
    .slice(0, 5)
}

export default async function NlHubPage() {
  const { occCount, highDemand } = getStats()
  const topColleges = getTopColleges()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "Netherlands", item: "https://www.campcareer.com/nl" },
          ],
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Netherlands (Nederland)
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Work & Live in the Netherlands
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-600">
            Real salary data, CBS shortage ratings, and career pathways for {occCount} SBC-classified
            occupations — plus tuition and ROI data for all {topColleges.length > 0 ? "13" : ""} top Dutch
            research universities (WO).
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/nl/jobs"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-press"
            >
              Browse {occCount} Occupations
            </Link>
            <Link
              href="/map?country=nl"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
            >
              View University Map
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: String(occCount), label: "Occupations" },
            { value: String(highDemand), label: "High-Demand Roles" },
            { value: "13", label: "WO Universities" },
            { value: "Kennismigrant", label: "Visa Pathway" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
            </div>
          ))}
        </section>

        {/* Top universities */}
        {topColleges.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold">Top Dutch Universities</h2>
            <div className="space-y-2">
              {topColleges.map((c) => {
                const slug = c.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
                return (
                  <Link
                    key={c.name}
                    href={`/map/nl/university/${slug}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 transition-colors hover:border-brand/30 hover:bg-slate-50"
                  >
                    <div>
                      <span className="font-medium text-slate-900">{c.name}</span>
                      <span className="ml-2 text-sm text-slate-400">{c.city}</span>
                    </div>
                    <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                      QS #{c.qs_rank}
                    </span>
                  </Link>
                )
              })}
            </div>
            <Link href="/map?country=nl" className="mt-3 block text-sm font-medium text-brand hover:underline">
              View all 13 universities on map →
            </Link>
          </section>
        )}

        {/* Visa overview */}
        <section className="mb-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="mb-4 text-xl font-bold">Visa Pathways for International Graduates</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "Orientation Year (Zoekjaar)",
                desc: "1-year permit to find a job after graduating from a Dutch (or recognized foreign) university.",
              },
              {
                name: "Knowledge Migrant (Kennismigrant)",
                desc: "Work permit for highly-skilled migrants with a qualifying salary (~€38K–€66K/yr depending on age).",
              },
              {
                name: "EU Blue Card",
                desc: "For non-EU nationals with a degree and a job offer meeting the EU Blue Card salary threshold.",
              },
            ].map((v) => (
              <div key={v.name} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="mb-1 text-sm font-bold text-slate-900">{v.name}</p>
                <p className="text-xs leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Start Exploring</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/nl/jobs"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
            >
              Browse All {occCount} Occupations
            </Link>
            <Link
              href="/map?country=nl"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
            >
              Netherlands University Map
            </Link>
            <Link
              href="/roi-explorer?country=nl"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
            >
              ROI Explorer
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
