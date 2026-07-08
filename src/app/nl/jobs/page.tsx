import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import nlOccupationsRaw from "@/data/nl-occupations.json"
import { NlJobsClient } from "./NlJobsClient"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Netherlands Jobs & Occupations — Salary & Shortage Guide | CampCareer",
  description:
    "Browse 72 SBC-classified occupations in the Netherlands. Compare median salaries, CBS shortage ratings, and career pathways for international graduates. Data from CBS (Statistics Netherlands).",
  path: "/nl/jobs",
})

type NlOccRow = {
  sbc_code: string
  occupation_en: string
  occupation_nl: string
  median_salary_eur: number | null
  shortage_rating: number | null
  related_broad_field: string | null
}

function getOccupations(): NlOccRow[] {
  const raw = nlOccupationsRaw as unknown as Record<string, NlOccRow>
  return Object.values(raw).sort((a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0))
}

export default async function NlJobsPage() {
  const occupations = getOccupations()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbLd([
          { name: "CampCareer", path: "/" },
          { name: "Netherlands", path: "/nl" },
          { name: "Jobs", path: "/nl/jobs" },
        ])}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="mb-4 text-sm text-slate-400">
            <Link href="/nl" className="hover:underline">Netherlands</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Netherlands Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            SBC-classified occupations with median salary and CBS labour market data.
            Sorted by skills shortage — highest demand first.
          </p>
        </div>

        <NlJobsClient occupations={occupations} />
      </div>
    </main>
  )
}
