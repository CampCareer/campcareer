import type { Metadata } from "next"
import Link from "next/link"
import { AE_HIGH_INCOME_OCCUPATIONS, AE_SHORTAGE_OCCUPATIONS } from "@/data/ae-map-data"
import { pageMetadata } from "@/lib/seo"

type ShortageCategory = {
  total_demand_occupations: number
  top_demand: Array<{
    occupation: string
    occupation_ko: string
    min_salary_aed: number
    demand_reason: string
  }>
}

type ShortageData = { categories: Record<string, ShortageCategory> }
type HighIncomeData = {
  top_10_high_income_occupations: Array<{
    rank: number
    occupation: string
    sector: string
    monthly_min_aed: number
    monthly_max_aed: number
  }>
}

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "UAE Occupation Demand and Income Signals | CampCareer",
  description:
    "Review UAE high-skill demand context and salary-guide income benchmarks with clear source and visa limitations.",
  path: "/ae/jobs",
})

export default function UnitedArabEmiratesJobsPage() {
  const shortage = AE_SHORTAGE_OCCUPATIONS as ShortageData
  const highIncome = AE_HIGH_INCOME_OCCUPATIONS as HighIncomeData

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link href="/ae" className="text-sm font-semibold text-amber-700 hover:underline">UAE hub</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">UAE occupation signals</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
        UAE does not publish one formal shortage occupation list. These signals combine high-skill and sector-priority context; salary-guide figures are benchmarks, not job offers or visa approvals.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950">High-skill demand context</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(shortage.categories).map(([key, category]) => (
            <section key={key} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold capitalize text-slate-950">{key.replaceAll("_", " ")}</h3>
              <p className="mt-1 text-sm text-slate-500">{category.total_demand_occupations} referenced roles</p>
              <div className="mt-4 space-y-3">
                {category.top_demand.slice(0, 4).map((occupation) => (
                  <div key={occupation.occupation} className="flex items-start justify-between gap-4 text-sm">
                    <span><span className="block font-medium text-slate-900">{occupation.occupation_ko}</span><span className="text-slate-500">{occupation.occupation}</span></span>
                    <span className="shrink-0 text-right text-xs text-slate-600">AED {occupation.min_salary_aed.toLocaleString()}<span className="block text-slate-400">context floor</span></span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950">High-income benchmark roles</h2>
        <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
          {highIncome.top_10_high_income_occupations.map((occupation) => (
            <div key={occupation.rank} className="flex items-center gap-4 py-4">
              <span className="w-7 shrink-0 text-center text-sm font-semibold text-slate-400">{occupation.rank}</span>
              <span className="min-w-0 flex-1"><span className="block text-base font-semibold text-slate-900">{occupation.occupation}</span><span className="mt-1 block text-sm text-slate-500">{occupation.sector}</span></span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-amber-800">AED {occupation.monthly_min_aed.toLocaleString()}–{occupation.monthly_max_aed.toLocaleString()}<span className="block text-[11px] font-normal text-slate-400">monthly gross guide</span></span>
            </div>
          ))}
        </div>
      </section>
      <Link href="/map?country=ae" className="mt-8 inline-flex rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Compare emirates on Maps</Link>
    </main>
  )
}
