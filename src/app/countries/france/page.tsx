import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/seo/json-ld"
import {
  FR_CITIES,
  FR_DEMAND_OCCUPATIONS,
  FR_REGIONS,
  FR_UNIVERSITIES,
  isFranceDemandOccupationIndexable,
} from "@/data/fr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in France — Careers, Regions & Universities | CampCareer",
  description:
    "Explore France Travail recruitment demand, INSEE salary groups, regional living-cost indicators, and MESR public higher-education institutions across France.",
  path: "/countries/france",
})

export default function FranceCountryPage() {
  const occupationCount = FR_DEMAND_OCCUPATIONS.filter(isFranceDemandOccupationIndexable).length

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "France", item: "https://www.campcareer.com/countries/france" },
          ],
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <section className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">France</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Work &amp; Study in France</h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-600">
            Recruitment-demand signals, salary groups, regional rent indicators, and public higher-education institutions
            for {occupationCount}+ occupation groups — sourced from France Travail, INSEE, and MESR.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/fr/jobs"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-press"
            >
              Browse {occupationCount}+ Occupation Groups
            </Link>
            <Link
              href="/maps?country=fr"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
            >
              View Regional Map
            </Link>
          </div>
        </section>

        <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: `${occupationCount}+`, label: "Occupation Groups" },
            { value: `${FR_REGIONS.length}`, label: "Metropolitan Regions" },
            { value: `${FR_UNIVERSITIES.length}`, label: "Public Institutions" },
            { value: "BMO · INSEE", label: "Reviewed Evidence" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="mt-1 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold">Explore France</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/fr/jobs"
              className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-brand/40 hover:bg-brand-tint"
            >
              <div className="mb-1 font-semibold">Jobs &amp; Occupations</div>
              <div className="text-sm text-slate-500">
                {occupationCount}+ France Travail BMO occupation groups with recruitment projects and difficulty indicators
              </div>
            </Link>
            <Link
              href="/maps?country=fr"
              className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-brand/40 hover:bg-brand-tint"
            >
              <div className="mb-1 font-semibold">Universities &amp; Institutions</div>
              <div className="text-sm text-slate-500">
                Browse {FR_UNIVERSITIES.length} MESR public higher-education institution pins by region
              </div>
            </Link>
            <Link
              href="/maps?country=fr"
              className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-brand/40 hover:bg-brand-tint"
            >
              <div className="mb-1 font-semibold">Regional Map</div>
              <div className="text-sm text-slate-500">
                Compare {FR_REGIONS.length} metropolitan regions, {FR_CITIES.length} city profiles, and local recruitment signals
              </div>
            </Link>
            <Link
              href="/countries/search"
              className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-brand/40 hover:bg-brand-tint"
            >
              <div className="mb-1 font-semibold">Country Rankings</div>
              <div className="text-sm text-slate-500">
                Compare France with other destinations after choosing a career, budget, and priority
              </div>
            </Link>
          </div>
        </section>

        <aside className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          France Travail BMO records employer recruitment intentions, not a statutory shortage list or visa approval.
          INSEE salary groups and city rent indicators are shown separately where their source coverage is reviewed.
        </aside>
      </div>
    </main>
  )
}
