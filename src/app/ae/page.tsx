import type { Metadata } from "next"
import Link from "next/link"
import {
  UnitedArabEmiratesDecisionOverview,
  UnitedArabEmiratesQuickRoiPreview,
} from "@/components/country-profiles/australia-decision-overview"
import {
  AE_EMIRATES,
  AE_HIGH_INCOME_OCCUPATIONS,
  AE_SHORTAGE_OCCUPATIONS,
} from "@/data/ae-map-data"
import { pageMetadata } from "@/lib/seo"

type ShortageCategory = {
  total_demand_occupations: number
  top_demand: Array<{ occupation: string; occupation_ko: string; min_salary_aed: number }>
}

type ShortageData = {
  categories: Record<string, ShortageCategory>
}

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
  title: "UAE Career, Salary, Visa & University Guide | CampCareer",
  description:
    "Compare UAE high-demand occupation signals, income benchmarks, emirate locations, and study-to-work pathways for international students.",
  path: "/ae",
})

export default function UnitedArabEmiratesHubPage() {
  const shortage = AE_SHORTAGE_OCCUPATIONS as ShortageData
  const highIncome = AE_HIGH_INCOME_OCCUPATIONS as HighIncomeData
  const categories = Object.entries(shortage.categories)

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">United Arab Emirates</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">UAE study and work decision data</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Compare high-skill demand signals, salary-guide benchmarks, emirate locations, and employer-led work-visa pathways.
              A shortage or high-income signal is not a visa outcome or a guaranteed job offer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/ae/jobs" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">Browse UAE occupation signals</Link>
              <Link href="/map?country=ae" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100">Open UAE Maps</Link>
            </div>
          </div>
          <UnitedArabEmiratesQuickRoiPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric value={String(AE_EMIRATES.length)} label="Emirates" note="Location comparison" />
          <Metric value={String(categories.length)} label="Demand sectors" note="MOHRE and priority-signal context" />
          <Metric value={String(highIncome.top_10_high_income_occupations.length)} label="Income benchmarks" note="Salary-guide reference roles" />
          <Metric value="0%" label="Personal income tax" note="VAT and other charges may apply" />
        </div>

        <UnitedArabEmiratesDecisionOverview />

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Emirate selection</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {AE_EMIRATES.map((emirate) => (
                <Link key={emirate.code} href={`/map?country=ae&state=${emirate.code}`} className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-slate-400 hover:bg-slate-50">
                  <span className="font-semibold text-slate-900">{emirate.nameEn}</span>
                  <span className="ml-2 text-slate-500">{emirate.nameKo}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Demand-signal sectors</h2>
            <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
              {categories.map(([key, category]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium capitalize text-slate-900">{key.replaceAll("_", " ")}</span>
                  <span className="text-sm tabular-nums text-slate-600">{category.total_demand_occupations} roles</span>
                </div>
              ))}
            </div>
            <Link href="/ae/jobs" className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:underline">View demand and income context →</Link>
          </div>
        </section>
      </section>
    </main>
  )
}

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>
}
