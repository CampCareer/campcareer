import type { Metadata } from "next"
import Link from "next/link"
import { JP_HIGH_PAY_OCCUPATIONS } from "@/data/jp-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Japan Occupation Wage Signals | CampCareer",
  description:
    "Browse official MHLW national hourly wage baselines for Japanese occupations and continue to prefecture-level demand data.",
  path: "/jp/jobs",
})

export default function JapanJobsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link href="/jp" className="text-sm font-semibold text-rose-700 hover:underline">Japan hub</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">Japan occupation wage signals</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
        National MHLW hourly wage baselines for selected occupations. These are not job offers or prefecture-specific salaries; use the map for local openings-to-seekers signals.
      </p>
      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {JP_HIGH_PAY_OCCUPATIONS.map((occupation, index) => (
          <div key={occupation.occupationCode} className="flex items-center gap-4 py-4">
            <span className="w-7 shrink-0 text-center text-sm font-semibold text-slate-400">{index + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-slate-900">{occupation.localName}</span>
              <span className="mt-1 block text-sm text-slate-500">MHLW Wage Structure Basic Statistical Survey</span>
            </span>
            <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-rose-800">JPY {occupation.hourlyBaseWageYen.toLocaleString()}<span className="block text-[11px] font-normal text-slate-400">hourly baseline</span></span>
          </div>
        ))}
      </div>
      <Link href="/map?country=jp" className="mt-8 inline-flex rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Compare prefecture demand on Maps</Link>
    </main>
  )
}
