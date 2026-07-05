import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { getUSOccCodes } from "@/lib/us-occupation-detail"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in the USA — Salary, Visa & Career Guide | CampCareer",
  description:
    "Browse 116+ SOC occupations in the United States with median salary, job outlook, and visa pathways. Based on Bureau of Labor Statistics data.",
  path: "/us",
})

export default function UsHubPage() {
  const codes = getUSOccCodes()
  const occCount = codes.length

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "United States", item: "https://www.campcareer.com/us" },
          ],
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">United States</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Work & Live in the USA</h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Median salary data, job outlook, and H-1B / green card pathways for {occCount}+
            occupations — sourced from the Bureau of Labor Statistics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/us/jobs"
              className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-press transition-colors"
            >
              Browse {occCount}+ Occupations
            </Link>
            <Link
              href="/roi-explorer/us"
              className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Explore Universities
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: `${occCount}+`, label: "SOC Occupations" },
            { value: "50", label: "States" },
            { value: "H-1B", label: "Work Visa" },
            { value: "EB-2/EB-3", label: "Green Card" },
          ].map(({ value, label }) => (
            <div key={label} className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-5">Explore the USA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/us/jobs" className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors">
              <div className="font-semibold mb-1">💼 Jobs &amp; Occupations</div>
              <div className="text-sm text-slate-500">{occCount}+ SOC occupations with salary &amp; job outlook</div>
            </Link>
            <Link href="/roi-explorer/us" className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors">
              <div className="font-semibold mb-1">🎓 Universities</div>
              <div className="text-sm text-slate-500">Top universities with ROI and career outcome data</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
