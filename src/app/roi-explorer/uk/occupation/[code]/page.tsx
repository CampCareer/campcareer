import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"

export const revalidate = 3600
export const dynamicParams = true

type UkOccRow = {
  soc_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_gbp: number | null
  mean_salary_gbp: number | null
  q1_salary_gbp: number | null
  q3_salary_gbp: number | null
  employment_thousands: number | null
  on_sol: boolean
  on_isl: boolean
  shortage_rating: number | null
  related_broad_field: string | null
  source_name: string | null
  source_url: string | null
  last_verified: string | null
}

async function getOccupation(code: string): Promise<UkOccRow | null> {
  const { data } = await supabaseAdmin
    .from("occupations_uk")
    .select("*")
    .eq("soc_code", code)
    .maybeSingle()
  return data as UkOccRow | null
}

function formatSalary(gbp: number | null): string {
  return gbp != null ? `£${gbp.toLocaleString()}` : "—"
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const occ = await getOccupation(params.code)
  if (!occ) return { title: "Occupation Not Found" }

  const salary = occ.median_salary_gbp ? `£${occ.median_salary_gbp.toLocaleString()}` : ""
  const shortage = occ.shortage_rating != null ? `${"★".repeat(Math.round(occ.shortage_rating))} shortage` : ""

  return pageMetadata({
    title: `${occ.occupation_en} — SOC ${params.code} Salary & Career in the UK 2026`,
    description: `${occ.occupation_en} (SOC ${params.code}) salary data, skills shortage rating ${shortage}, and career pathways in the UK.${occ.median_salary_gbp ? ` Median salary ${salary}/yr.` : ""} Data from ONS ASHE.`,
    path: `/roi-explorer/uk/occupation/${params.code}`,
  })
}

export default async function Page({ params }: { params: { code: string } }) {
  const occ = await getOccupation(params.code)
  if (!occ) notFound()

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "CampCareer", path: "/" },
        { name: "United Kingdom", path: "/uk" },
        { name: "Jobs", path: "/uk/jobs" },
        { name: occ.occupation_en, path: `/roi-explorer/uk/occupation/${params.code}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: occ.occupation_en,
        occupationCategory: `SOC ${params.code}`,
        description: `${occ.occupation_en} in the United Kingdom. SOC code ${params.code}.`,
        ...(occ.median_salary_gbp && {
          estimatedSalary: { "@type": "MonetaryAmount", currency: "GBP", value: occ.median_salary_gbp },
        }),
        mainEntityOfPage: `https://www.campcareer.com/roi-explorer/uk/occupation/${params.code}`,
      }} />

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-sm text-slate-400 mb-6">
            <Link href="/uk" className="hover:underline">United Kingdom</Link>
            <span className="mx-2">/</span>
            <Link href="/uk/jobs" className="hover:underline">Jobs</Link>
            <span className="mx-2">/</span>
            <span>{occ.occupation_en}</span>
          </nav>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              SOC {params.code}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {occ.occupation_en}
            </h1>
            {occ.occupation_ko && (
              <p className="text-lg text-slate-500">{occ.occupation_ko}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Median Salary</div>
              <div className="text-2xl font-bold">{formatSalary(occ.median_salary_gbp)}</div>
              <div className="text-xs text-slate-400 mt-1">per year</div>
            </div>
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Salary Range (Q1–Q3)</div>
              <div className="text-2xl font-bold">
                {formatSalary(occ.q1_salary_gbp)} – {formatSalary(occ.q3_salary_gbp)}
              </div>
              <div className="text-xs text-slate-400 mt-1">lower to upper quartile</div>
            </div>
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Mean Salary</div>
              <div className="text-2xl font-bold">{formatSalary(occ.mean_salary_gbp)}</div>
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
            {occ.on_sol && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Skilled Occupations List (SOL)
              </span>
            )}
            {occ.on_isl && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Immigration Salary List (ISL)
              </span>
            )}
          </div>

          {occ.source_url && (
            <p className="text-xs text-slate-400">
              Source: <a href={occ.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">{occ.source_name ?? "Government Data"}</a>
              {occ.last_verified ? ` · Last verified: ${occ.last_verified.slice(0, 10)}` : ""}
            </p>
          )}

          <div className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-bold mb-3">Explore Related Pages</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/uk/jobs" className="text-sm text-brand hover:underline">← All UK Occupations</Link>
              <Link href="/roi-explorer?country=uk" className="text-sm text-brand hover:underline">UK Universities ROI →</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
