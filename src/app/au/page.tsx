import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Australia — Salary, Visa & PR Guide | CampCareer",
  description:
    "Browse 395+ occupations in Australia with real salary data, skills shortage ratings, and permanent residency pathways. Government data-backed career planning.",
  path: "/au",
})

async function getOccupationCount() {
  const { count } = await supabaseAdmin
    .from("occupations_au")
    .select("*", { count: "exact", head: true })
  return count ?? 395
}

export default async function AuHubPage() {
  const occCount = await getOccupationCount()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "Australia", item: "https://www.campcareer.com/au" },
          ],
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Australia</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Work & Live in Australia
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Real salary data, skills shortage ratings, and visa pathways for {occCount}+ occupations —
            all sourced from Australian government statistics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/au/jobs"
              className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-press transition-colors"
            >
              Browse {occCount}+ Occupations
            </Link>
            <Link
              href="/map?country=au&state=NSW&tab=shortage"
              className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              View Skills Shortage Map
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: `${occCount}+`, label: "Occupations" },
            { value: "8", label: "States & Territories" },
            { value: "43", label: "Universities" },
            { value: "TSS → PR", label: "Visa Pathway" },
          ].map(({ value, label }) => (
            <div key={label} className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </section>

        {/* Navigation grid — all links crawlable */}
        <section>
          <h2 className="text-xl font-bold mb-5">Explore Australia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/au/jobs"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">💼 Jobs &amp; Occupations</div>
              <div className="text-sm text-slate-500">
                {occCount}+ occupations with salary, shortage &amp; PR eligibility
              </div>
            </Link>
            <Link
              href="/roi-explorer/au"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">🎓 Universities &amp; Courses</div>
              <div className="text-sm text-slate-500">
                Find courses linked to in-demand occupations
              </div>
            </Link>
            <Link
              href="/map?country=au&state=NSW&tab=shortage"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">🗺️ State-by-State Map</div>
              <div className="text-sm text-slate-500">
                Compare shortage &amp; employment by state
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
