import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import beRentRaw from "@/data/be-rent-by-city.json"
import beUniversitiesRaw from "@/data/be-universities.json"
import { getBelgiumOccupations } from "@/lib/country-occupation-data"
import { pageMetadata } from "@/lib/seo"
import {
  BelgiumDecisionOverview,
  BelgiumQuickRoiPreview,
} from "@/components/country-profiles/australia-decision-overview"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Belgium — Salary, Shortage & University Guide | CampCareer",
  description:
    "Browse Belgium occupations, shortage signals, rent by region, tax references, and universities across Brussels, Flanders, and Wallonia.",
  path: "/be",
})

type BelgianUniversity = { name: string; city: string; region: string; qs_rank: number | null; slug: string }

function getBelgiumStats() {
  const occupations = getBelgiumOccupations()
  const shortageCount = occupations.filter((occupation) => (occupation.shortageRating ?? 0) >= 4).length
  const universities = (beUniversitiesRaw as unknown as { universities: BelgianUniversity[] }).universities
  const rents = beRentRaw as unknown as { cities: Array<{ city: string; median_rent_2025: number }> }
  const medianRent = Math.round(
    rents.cities.reduce((sum, city) => sum + city.median_rent_2025, 0) / Math.max(rents.cities.length, 1),
  )

  return {
    occupations,
    shortageCount,
    universities: [...universities].sort((a, b) => (a.qs_rank ?? 9999) - (b.qs_rank ?? 9999)),
    medianRent,
  }
}

export default function BelgiumHubPage() {
  const { occupations, shortageCount, universities, medianRent } = getBelgiumStats()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Belgium", path: "/be" },
      ])} />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <section className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Belgium
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Work & Live in Belgium</h1>
            <p className="mb-8 max-w-2xl text-lg text-slate-600">
              Compare Belgian shortage occupations, gross monthly salary signals, rent by region,
              and universities across Brussels, Flanders, and Wallonia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/be/jobs"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-press"
              >
                Browse {occupations.length} Occupations
              </Link>
              <Link
                href="/map?country=be"
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
              >
                Open Belgium Map
              </Link>
            </div>
          </div>
          <BelgiumQuickRoiPreview />
        </section>

        <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: String(occupations.length), label: "Occupation Signals" },
            { value: String(shortageCount), label: "High-Shortage Roles" },
            { value: String(universities.length), label: "Universities" },
            { value: `EUR ${medianRent}`, label: "Median Rent Proxy" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
            </div>
          ))}
        </section>

        <BelgiumDecisionOverview />

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Top Belgian Universities</h2>
          <div className="space-y-2">
            {universities.slice(0, 6).map((university) => (
              <Link
                key={university.slug}
                href={`/map?country=be`}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 transition-colors hover:border-brand/30 hover:bg-slate-50"
              >
                <div>
                  <span className="font-medium text-slate-900">{university.name}</span>
                  <span className="ml-2 text-sm text-slate-400">
                    {university.city} · {university.region}
                  </span>
                </div>
                {university.qs_rank != null && (
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    QS #{university.qs_rank}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Start Exploring</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/be/jobs", title: "Jobs & Occupations", body: "Salary, shortage, and regional fit signals." },
              { href: "/roi-explorer?country=be", title: "University ROI", body: "Compare tuition, salary signals, and payback by institution." },
              { href: "/map?country=be", title: "Belgium Map", body: "Universities and regional labour-market context." },
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
