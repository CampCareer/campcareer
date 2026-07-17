import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import {
  UnitedKingdomDecisionOverview,
  UnitedKingdomQuickRoiPreview,
} from "@/components/country-profiles/australia-decision-overview"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in the UK — Salary, Visa & Career Guide | CampCareer",
  description:
    "Browse 400+ occupations in the United Kingdom with real salary data, skills shortage ratings, and career pathways. Government data-backed career planning for international graduates.",
  path: "/uk",
})

async function getOccupationCount() {
  const { count } = await supabaseAdmin
    .from("occupations_uk")
    .select("*", { count: "exact", head: true })
  return count ?? 408
}

export default async function UkHubPage() {
  const occCount = await getOccupationCount()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "United Kingdom", item: "https://www.campcareer.com/uk" },
          ],
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">United Kingdom</p>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Work & Live in the UK
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mb-8">
              Real salary data, skills shortage ratings, and career pathways for {occCount}+ occupations —
              all sourced from UK government statistics (ONS ASHE).
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/uk/jobs"
                className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-press transition-colors"
              >
                Browse {occCount}+ Occupations
              </Link>
              <Link
                href="/map?country=uk&region=TLI&tab=shortage"
                className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                View Skills Shortage Map
              </Link>
            </div>
          </div>
          <UnitedKingdomQuickRoiPreview />
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: `${occCount}+`, label: "Occupations" },
            { value: "12", label: "ITL1 Regions" },
            { value: "140+", label: "Universities" },
            { value: "Graduate Visa", label: "Visa Pathway" },
          ].map(({ value, label }) => (
            <div key={label} className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </section>

        <UnitedKingdomDecisionOverview />

        <section>
          <h2 className="text-xl font-bold mb-5">Explore the UK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/uk/jobs"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">💼 Jobs & Occupations</div>
              <div className="text-sm text-slate-500">
                {occCount}+ occupations with salary, shortage & career pathways
              </div>
            </Link>
            <Link
              href="/roi-explorer?country=uk"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">🎓 Universities & Courses</div>
              <div className="text-sm text-slate-500">
                Compare UK universities by ROI, salary & tuition
              </div>
            </Link>
            <Link
              href="/map?country=uk&region=TLI&tab=shortage"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">🗺️ Regional Map</div>
              <div className="text-sm text-slate-500">
                Compare shortage & employment by ITL1 region
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
