import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Work & Study in Germany — Salary, Visa & Career Guide | CampCareer",
  description:
    "Browse 124 KldB-classified occupations in Germany with real salary data, skills shortage ratings, and career pathways. Data from Bundesagentur für Arbeit (BA).",
}

export default async function DeHubPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "Germany", item: "https://www.campcareer.com/de" },
          ],
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Germany (Deutschland)</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Work & Live in Germany
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Real salary data, skills shortage ratings, and career pathways for 124 KldB-classified occupations —
            all sourced from Bundesagentur für Arbeit (BA) statistics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/de/jobs"
              className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-press transition-colors"
            >
              Browse 124 Occupations
            </Link>
            <Link
              href="/roi-explorer?country=de"
              className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              View German Universities
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: "124", label: "Occupations" },
            { value: "16", label: "Bundesländer" },
            { value: "55+", label: "Universities" },
            { value: "EU Blue Card", label: "Visa Pathway" },
          ].map(({ value, label }) => (
            <div key={label} className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-5">Explore Germany</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/de/jobs"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">💼 Jobs & Occupations</div>
              <div className="text-sm text-slate-500">
                124 occupations with salary, shortage & career pathways
              </div>
            </Link>
            <Link
              href="/roi-explorer?country=de"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">🎓 Universities & Courses</div>
              <div className="text-sm text-slate-500">
                Compare German universities by ROI, salary & tuition
              </div>
            </Link>
            <Link
              href="/map?country=de"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">🗺️ Regional Map</div>
              <div className="text-sm text-slate-500">
                Compare shortage & employment by Bundesland
              </div>
            </Link>
            <Link
              href="/roi-explorer"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">📊 ROI Explorer</div>
              <div className="text-sm text-slate-500">
                Calculate study cost vs expected salary
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
