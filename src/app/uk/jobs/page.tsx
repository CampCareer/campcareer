import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { UkJobsClient } from "./UkJobsClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = pageMetadata({
  title: "UK Jobs & Occupations — Salary & Skills Shortage Guide | CampCareer",
  description:
    "Browse all 400+ SOC occupations in the United Kingdom. Compare median salaries, skills shortage ratings, and career pathways for each role. Data from ONS ASHE.",
  path: "/uk/jobs",
})

type OccRow = { soc_code: string; occupation_en: string; median_salary_gbp: number | null; shortage_rating: number | null }

async function getOccupations(): Promise<OccRow[]> {
  const { data } = await supabaseAdmin
    .from("occupations_uk")
    .select("soc_code, occupation_en, median_salary_gbp, shortage_rating")
    .order("occupation_en")
  return (data ?? []) as OccRow[]
}

export default async function UkJobsPage() {
  const occupations = await getOccupations()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "United Kingdom", item: "https://www.campcareer.com/uk" },
            { "@type": "ListItem", position: 3, name: "Jobs", item: "https://www.campcareer.com/uk/jobs" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "UK Occupations",
          description: `${occupations.length} SOC occupations in the United Kingdom with salary and shortage data`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: occupations.length,
            itemListElement: occupations.slice(0, 100).map((occ, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `https://www.campcareer.com/roi-explorer/uk/occupation/${occ.soc_code}`,
              name: occ.occupation_en,
            })),
          },
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4">
            <Link href="/uk" className="hover:underline">United Kingdom</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            UK Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            All SOC-classified occupations with median salary and skills information.
            Based on UK government data (ONS ASHE 2025 provisional).
          </p>
        </div>

        <UkJobsClient occupations={occupations} />
      </div>
    </main>
  )
}
