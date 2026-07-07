import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import deOccupationsRaw from "@/data/de-occupations.json"
import { DeJobsClient } from "./DeJobsClient"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Germany Jobs & Occupations — Salary & Skills Shortage Guide | CampCareer",
  description:
    "Browse all KldB-classified occupations in Germany. Compare median salaries, skills shortage ratings, and career pathways for each role. Data from Bundesagentur für Arbeit.",
  path: "/de/jobs",
})

type DeOccRow = {
  kldb_code: string
  occupation_en: string
  median_salary_eur: number | null
  shortage_rating: number | null
}

function getOccupations(): DeOccRow[] {
  const raw = deOccupationsRaw as unknown as Record<string, DeOccRow>
  return Object.values(raw).sort((a, b) => a.occupation_en.localeCompare(b.occupation_en))
}

export default async function DeJobsPage() {
  const occupations = getOccupations()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Germany", path: "/de" },
        { name: "Jobs", path: "/de/jobs" },
      ])} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4">
            <Link href="/de" className="hover:underline">Germany</Link>
            <span className="mx-2">/</span>
            <span>Jobs</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Germany Occupations ({occupations.length})
          </h1>
          <p className="text-slate-600">
            All KldB-classified occupations with median salary and skills information.
            Based on Bundesagentur für Arbeit data.
          </p>
        </div>

        <DeJobsClient occupations={occupations} />
      </div>
    </main>
  )
}
