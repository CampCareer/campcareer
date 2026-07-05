import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { getUSOccCodes, getUSOccDetail } from "@/lib/us-occupation-detail"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "USA Jobs & Occupations — Salary & Job Outlook | CampCareer",
  description:
    "Browse SOC-classified occupations in the United States with median annual salary, projected job growth, and H-1B eligibility.",
  path: "/us/jobs",
})

export default function UsJobsPage() {
  const codes = getUSOccCodes()
  const occupations = codes
    .map((code) => {
      const d = getUSOccDetail(code)
      return d ? { code, title: d.occ_title, medianWage: d.median_wage } : null
    })
    .filter(Boolean) as { code: string; title: string; medianWage: number }[]

  occupations.sort((a, b) => a.title.localeCompare(b.title))

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "United States", item: "https://www.campcareer.com/us" },
            { "@type": "ListItem", position: 3, name: "Jobs", item: "https://www.campcareer.com/us/jobs" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "US Occupations",
          description: `${occupations.length} SOC occupations in the United States with salary and job outlook data`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: occupations.length,
            itemListElement: occupations.slice(0, 100).map((occ, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `https://www.campcareer.com/roi-explorer/us/occupation/${occ.code}`,
              name: occ.title,
            })),
          },
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4">
            <Link href="/us" className="hover:underline">United States</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            US Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            SOC-classified occupations with median annual salary and projected job growth.
            Based on Bureau of Labor Statistics Occupational Outlook Handbook data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {occupations.map((occ) => (
            <Link
              key={occ.code}
              href={`/roi-explorer/us/occupation/${occ.code}`}
              className="group p-4 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-medium text-sm text-foreground group-hover:text-brand-press leading-snug mb-2">
                {occ.title}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {occ.medianWage > 0 && (
                  <span className="font-semibold text-slate-600">
                    ${occ.medianWage.toLocaleString()}/yr
                  </span>
                )}
                <span className="ml-auto">SOC {occ.code}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
