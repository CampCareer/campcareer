import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import nlOccupationsRaw from "@/data/nl-occupations.json"

export const revalidate = 3600
export const dynamicParams = true

type NlOccRow = {
  sbc_code: string
  occupation_nl: string
  occupation_en: string
  median_salary_eur: number | null
  mean_salary_eur: number | null
  q1_salary_eur: number | null
  q3_salary_eur: number | null
  employment_thousands: number | null
  shortage_rating: number | null
  related_broad_field: string | null
}

function getOccupation(code: string): NlOccRow | null {
  const raw = nlOccupationsRaw as unknown as Record<string, NlOccRow>
  return raw[code] ?? null
}

export function generateStaticParams() {
  const raw = nlOccupationsRaw as unknown as Record<string, NlOccRow>
  return Object.keys(raw).map((code) => ({ code }))
}

function fmt(eur: number | null) {
  return eur != null ? `€${eur.toLocaleString()}` : "—"
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const occ = getOccupation(params.code)
  if (!occ) return { title: "Occupation Not Found" }

  const salary = occ.median_salary_eur ? `€${occ.median_salary_eur.toLocaleString()}` : ""
  const shortageStr = occ.shortage_rating != null
    ? `Shortage rating ${occ.shortage_rating}/5. `
    : ""

  return pageMetadata({
    title: `${occ.occupation_en} Salary & Shortage in Netherlands — SBC ${params.code} | CampCareer`,
    description: `${occ.occupation_en} (SBC ${params.code}) in the Netherlands. ${shortageStr}${salary ? `Median salary ${salary}/yr. ` : ""}Salary range Q1–Q3, employment data, and career overview. CBS/SBC data.`,
    path: `/roi-explorer/nl/occupation/${params.code}`,
  })
}

export default async function Page({ params }: { params: { code: string } }) {
  const occ = getOccupation(params.code)
  if (!occ) notFound()

  const isHighShortage = (occ.shortage_rating ?? 0) >= 4

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "Netherlands", path: "/nl" },
        { name: "Jobs", path: "/nl/jobs" },
        { name: occ.occupation_en, path: `/roi-explorer/nl/occupation/${params.code}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: occ.occupation_en,
        occupationCategory: `SBC ${params.code}`,
        description: `${occ.occupation_en} in the Netherlands. SBC code ${params.code}. ${occ.related_broad_field ?? ""}`.trim(),
        ...(occ.median_salary_eur && {
          estimatedSalary: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: occ.median_salary_eur,
          },
        }),
        mainEntityOfPage: `https://www.campcareer.com/roi-explorer/nl/occupation/${params.code}`,
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the average salary for ${occ.occupation_en} in the Netherlands?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: occ.median_salary_eur
                ? `The median salary for ${occ.occupation_en} in the Netherlands is €${occ.median_salary_eur.toLocaleString()} per year. The Q1–Q3 salary range is ${fmt(occ.q1_salary_eur)} to ${fmt(occ.q3_salary_eur)}.`
                : `Salary data for ${occ.occupation_en} in the Netherlands varies by employer and region. Check current job listings for up-to-date figures.`,
            },
          },
          {
            "@type": "Question",
            name: `Is ${occ.occupation_en} in demand in the Netherlands?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: occ.shortage_rating != null
                ? `${occ.occupation_en} has a shortage rating of ${occ.shortage_rating}/5 in the Netherlands based on CBS/SBC labour market data. ${isHighShortage ? "This is a high-demand occupation with strong hiring activity across the country." : "Demand varies by region and employer."}`
                : `Demand data for ${occ.occupation_en} in the Netherlands is not available at this time.`,
            },
          },
          {
            "@type": "Question",
            name: `Can international students work as ${occ.occupation_en} in the Netherlands?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `International students who graduate from a Dutch university (WO research university) can apply for a one-year Orientation Year (Zoekjaar) permit to find a job in the Netherlands. Highly skilled migrants may qualify for the Kennismigrant (Knowledge Migrant) visa if their salary meets the Dutch minimum threshold.`,
            },
          },
        ],
      }} />

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-6 text-sm text-slate-400">
            <Link href="/nl" className="hover:underline">Netherlands</Link>
            <span className="mx-2">/</span>
            <Link href="/nl/jobs" className="hover:underline">Jobs</Link>
            <span className="mx-2">/</span>
            <span>{occ.occupation_en}</span>
          </nav>

          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              SBC {params.code} {occ.related_broad_field ? `· ${occ.related_broad_field}` : ""}
            </p>
            <h1 className="mb-1 text-3xl font-bold tracking-tight">{occ.occupation_en}</h1>
            {occ.occupation_nl && (
              <p className="text-lg text-slate-500">{occ.occupation_nl}</p>
            )}
            {isHighShortage && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                <span className="text-sm font-bold text-orange-700">High Demand</span>
                <span className="text-xs text-orange-600">
                  Shortage rating {occ.shortage_rating}/5 — strong hiring activity across the Netherlands
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Median Salary</div>
              <div className="text-2xl font-bold">{fmt(occ.median_salary_eur)}</div>
              <div className="mt-1 text-xs text-slate-400">per year · Netherlands</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Salary Range (Q1–Q3)</div>
              <div className="text-2xl font-bold">{fmt(occ.q1_salary_eur)} – {fmt(occ.q3_salary_eur)}</div>
              <div className="mt-1 text-xs text-slate-400">lower to upper quartile</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Employment</div>
              <div className="text-2xl font-bold">
                {occ.employment_thousands != null ? `${occ.employment_thousands}K` : "—"}
              </div>
              <div className="mt-1 text-xs text-slate-400">workers in the Netherlands</div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-10 flex flex-wrap gap-3">
            {occ.shortage_rating != null && (
              <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                occ.shortage_rating >= 4 ? "bg-red-100 text-red-700" :
                occ.shortage_rating >= 3 ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              }`}>
                Shortage: {occ.shortage_rating}/5
              </span>
            )}
            {occ.related_broad_field && (
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                {occ.related_broad_field}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              SBC {params.code}
            </span>
          </div>

          {/* Visa note */}
          <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-2 text-base font-bold">Working in the Netherlands as an International</h2>
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>
                <span className="font-medium">Orientation Year (Zoekjaar):</span> Graduates from a Dutch or
                recognized foreign university get 1 year to find a job after graduating.
              </li>
              <li>
                <span className="font-medium">Knowledge Migrant (Kennismigrant):</span> Work permit for
                highly-skilled migrants whose salary meets the Dutch threshold (~€38K–€66K/yr depending on age).
              </li>
              <li>
                <span className="font-medium">EU Blue Card:</span> Available for highly-skilled non-EU nationals
                with a university degree and a job offer meeting the salary threshold.
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="border-t border-slate-200 pt-8">
            <h2 className="mb-3 text-lg font-bold">Explore Related Pages</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/nl/jobs" className="text-sm text-brand hover:underline">← All Netherlands Occupations</Link>
              <Link href="/map?country=nl" className="text-sm text-brand hover:underline">Netherlands University Map →</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
