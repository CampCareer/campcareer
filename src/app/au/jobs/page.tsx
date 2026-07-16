import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { AuJobsClient } from "./AuJobsClient"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Australia Jobs & Occupations — Salary & PR Eligibility | CampCareer",
  description:
    "Browse all 395+ OSCA occupations in Australia. Compare median salaries, skills shortage ratings, and permanent residency eligibility for each role.",
  path: "/au/jobs",
})

type OccRow = { anzsco_code: string; occupation_en: string; median_salary_aud: number | null; shortage_rating: number | null; on_csol: boolean }

async function getOccupations(): Promise<OccRow[]> {
  const { data } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, occupation_en, median_salary_aud, shortage_rating, on_csol")
    .order("occupation_en")
  return (data ?? []) as OccRow[]
}

export default async function AuJobsPage() {
  const occupations = await getOccupations()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "Australia", item: "https://www.campcareer.com/au" },
            { "@type": "ListItem", position: 3, name: "Jobs", item: "https://www.campcareer.com/au/jobs" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Australian Occupations",
          description: `${occupations.length} ANZSCO occupations in Australia with salary and PR eligibility data`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: occupations.length,
            itemListElement: occupations.slice(0, 100).map((occ, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `https://www.campcareer.com/roi-explorer/au/occupation/${occ.anzsco_code}`,
              name: occ.occupation_en,
            })),
          },
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4">
            <Link href="/au" className="hover:underline">Australia</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Australian Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            All OSCA-classified occupations with median salary, skills shortage ratings,
            and permanent residency eligibility. Based on Australian government data.
          </p>
        </div>

        {/* Client-side search + filter, with all occupation data pre-fetched server-side */}
        <AuJobsClient occupations={occupations} />
      </div>
    </main>
  )
}
