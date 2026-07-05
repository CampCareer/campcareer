import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Canada Jobs & Occupations — Salary & Express Entry | CampCareer",
  description:
    "Browse 514+ NOC-classified occupations in Canada with median salary, provincial outlooks, and Express Entry eligibility for each role.",
  path: "/ca/jobs",
})

type CaOccRow = { noc_code: string; occupation_en: string; median_wage?: number | null }

async function getOccupations(): Promise<CaOccRow[]> {
  const { data } = await supabaseAdmin
    .from("occupations_ca")
    .select("noc_code, occupation_en, median_wage")
    .order("occupation_en")
  return (data ?? []) as CaOccRow[]
}

export default async function CaJobsPage() {
  const occupations = await getOccupations()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "Canada", item: "https://www.campcareer.com/ca" },
            { "@type": "ListItem", position: 3, name: "Jobs", item: "https://www.campcareer.com/ca/jobs" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Canadian Occupations",
          description: `${occupations.length} NOC occupations in Canada with salary and PR eligibility data`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: occupations.length,
            itemListElement: occupations.slice(0, 100).map((occ, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `https://www.campcareer.com/roi-explorer/ca/occupation/${occ.noc_code}`,
              name: occ.occupation_en,
            })),
          },
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4">
            <Link href="/ca" className="hover:underline">Canada</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Canadian Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            All NOC-classified occupations with median hourly wage and Express Entry eligibility.
            Based on Statistics Canada and IRCC data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {occupations.map((occ) => (
            <Link
              key={occ.noc_code}
              href={`/roi-explorer/ca/occupation/${occ.noc_code}`}
              className="group p-4 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-medium text-sm text-foreground group-hover:text-brand-press leading-snug mb-2">
                {occ.occupation_en}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {occ.median_wage && (
                  <span className="font-semibold text-slate-600">
                    C${occ.median_wage}/hr
                  </span>
                )}
                <span className="ml-auto">NOC {occ.noc_code}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
