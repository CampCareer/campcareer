import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { AustraliaDecisionOverview, AustraliaQuickRoiPreview } from "@/components/country-profiles/australia-decision-overview"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Australia — Salary, Visa & PR Guide | CampCareer",
  description:
    "Browse 395+ occupations in Australia with real salary data, skills shortage ratings, and permanent residency pathways. Government data-backed career planning.",
  path: "/au",
})

async function getOccupationCount() {
  // Static CI builds intentionally do not receive production service-role
  // credentials. The public copy already has a controlled fallback, while
  // deployed environments continue to use the live count.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return 395
  }

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
        <section className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Australia</p>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Work & Live in Australia
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mb-8">
              Real salary data, skills shortage ratings, and visa pathways for {occCount}+ occupations —
              all sourced from Australian government statistics.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/au/majors" className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-press transition-colors">Choose a major to start</Link>
              <Link href="/au/study" className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">Compare schools and programs</Link>
            </div>
          </div>
          <AustraliaQuickRoiPreview />
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

        <AustraliaDecisionOverview />

        {/* Navigation grid — replaces the retired country-profile next steps. */}
        <section>
          <h2 className="text-xl font-bold mb-5">Build your Australia pathway</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/au/majors"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">1 · 🧭 Choose a Major</div>
              <div className="text-sm text-slate-500">
                Find a field that fits your career, salary and PR goals
              </div>
            </Link>
            <Link
              href="/au/jobs"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">3 · 💼 Validate the Career</div>
              <div className="text-sm text-slate-500">
                {occCount}+ occupations with salary, shortage &amp; PR eligibility
              </div>
            </Link>
            <Link
              href="/au/study"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">2 · 🎓 Compare Study Options</div>
              <div className="text-sm text-slate-500">
                Compare university study options, levels and outcomes
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
              href="/au/budget"
              className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-semibold mb-1">💰 Budget Planner</div>
              <div className="text-sm text-slate-500">
                Calculate tuition, living costs &amp; break-even timeline
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
