import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import deOccupationsRaw from "@/data/de-occupations.json"

export const revalidate = 3600
export const dynamicParams = true

export function generateStaticParams() {
  const raw = deOccupationsRaw as unknown as Record<string, DeOccRow>
  return Object.keys(raw).map((code) => ({ code }))
}

type DeOccRow = {
  kldb_code: string
  occupation_de: string
  occupation_en: string
  median_salary_eur: number | null
  mean_salary_eur: number | null
  q1_salary_eur: number | null
  q3_salary_eur: number | null
  employment_thousands: number | null
  shortage_rating: number | null
  on_blue_card_list: boolean
  related_broad_field: string | null
}

function getOccupation(code: string): DeOccRow | null {
  const raw = deOccupationsRaw as unknown as Record<string, DeOccRow>
  return raw[code] ?? null
}

function formatSalary(eur: number | null): string {
  return eur != null ? `€${eur.toLocaleString()}` : "—"
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const occ = getOccupation(params.code)
  if (!occ) return { title: "Occupation Not Found" }

  const salary = occ.median_salary_eur ? `€${occ.median_salary_eur.toLocaleString()}` : ""
  const shortage = occ.shortage_rating != null ? `${"★".repeat(Math.round(occ.shortage_rating))} shortage` : ""

  return pageMetadata({
    title: `${occ.occupation_en} — KldB ${params.code} Salary & Career in Germany 2026`,
    description: `${occ.occupation_en} (KldB ${params.code}) salary data, skills shortage rating ${shortage}, and career pathways in Germany.${occ.median_salary_eur ? ` Median salary ${salary}/yr.` : ""} Data from Bundesagentur für Arbeit.`,
    path: `/roi-explorer/de/occupation/${params.code}`,
  })
}

export default async function Page({ params }: { params: { code: string } }) {
  const occ = getOccupation(params.code)
  if (!occ) notFound()

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Germany", path: "/de" },
        { name: "Jobs", path: "/de/jobs" },
        { name: occ.occupation_en, path: `/roi-explorer/de/occupation/${params.code}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: occ.occupation_en,
        occupationCategory: `KldB ${params.code}`,
        description: `${occ.occupation_en} in Germany. KldB code ${params.code}.`,
        ...(occ.median_salary_eur && {
          estimatedSalary: { "@type": "MonetaryAmount", currency: "EUR", value: occ.median_salary_eur },
        }),
        mainEntityOfPage: `https://www.campcareer.com/roi-explorer/de/occupation/${params.code}`,
      }} />

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-sm text-slate-400 mb-6">
            <Link href="/de" className="hover:underline">Germany</Link>
            <span className="mx-2">/</span>
            <Link href="/de/jobs" className="hover:underline">Jobs</Link>
            <span className="mx-2">/</span>
            <span>{occ.occupation_en}</span>
          </nav>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              KldB {params.code}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {occ.occupation_en}
            </h1>
            {occ.occupation_de && (
              <p className="text-lg text-slate-500">{occ.occupation_de}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Median Salary</div>
              <div className="text-2xl font-bold">{formatSalary(occ.median_salary_eur)}</div>
              <div className="text-xs text-slate-400 mt-1">per year</div>
            </div>
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Salary Range (Q1–Q3)</div>
              <div className="text-2xl font-bold">
                {formatSalary(occ.q1_salary_eur)} – {formatSalary(occ.q3_salary_eur)}
              </div>
              <div className="text-xs text-slate-400 mt-1">lower to upper quartile</div>
            </div>
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Mean Salary</div>
              <div className="text-2xl font-bold">{formatSalary(occ.mean_salary_eur)}</div>
              <div className="text-xs text-slate-400 mt-1">{occ.employment_thousands != null ? `${occ.employment_thousands}K employed` : ""}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {occ.shortage_rating != null && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                occ.shortage_rating >= 4 ? "bg-red-100 text-red-700" :
                occ.shortage_rating >= 3 ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              }`}>
                Shortage: {occ.shortage_rating}/5
              </span>
            )}
            {occ.on_blue_card_list && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                EU Blue Card Eligible
              </span>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-bold mb-3">Explore Related Pages</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/de/jobs" className="text-sm text-brand hover:underline">← All German Occupations</Link>
              <Link href="/roi-explorer?country=de" className="text-sm text-brand hover:underline">German Universities ROI →</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
