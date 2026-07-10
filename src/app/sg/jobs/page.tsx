import type { Metadata } from "next"
import Link from "next/link"
import { SG_DEMAND_OCCUPATIONS } from "@/data/sg-map-data"
import { pageMetadata } from "@/lib/seo"
import { slugifyMapTerm } from "@/lib/map-slugs"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Singapore Shortage and High-Demand Jobs | CampCareer",
  description: "Official MOM 2025 Singapore job-demand cards with employer offer ranges, required skills, experience context and work-pass cautions.",
  path: "/sg/jobs",
})

export default function SingaporeJobsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link href="/sg" className="text-sm font-semibold text-teal-700 hover:underline">Singapore hub</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">Singapore high-demand jobs</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">MOM&apos;s published top vacancy occupations by PMET and non-PMET group. Each card keeps its national scope, employer offer range and work-pass caution explicit.</p>
      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{SG_DEMAND_OCCUPATIONS.map((occupation) => <Link key={occupation.sourceCode} href={`/maps/sg/${slugifyMapTerm(occupation.nameEn)}`} className="flex items-center gap-4 py-4 transition-colors hover:bg-slate-50"><span className="w-7 shrink-0 text-center text-sm font-semibold text-slate-400">{occupation.rank}</span><span className="min-w-0 flex-1"><span className="block text-base font-semibold text-slate-900">{occupation.nameKo}</span><span className="mt-1 block text-sm text-slate-500">{occupation.nameEn} · {occupation.category}</span></span><span className="shrink-0 text-right text-sm font-semibold tabular-nums text-teal-800">S${occupation.offeredWageLowSgd.toLocaleString()}-{occupation.offeredWageHighSgd.toLocaleString()}<span className="block text-[11px] font-normal text-slate-400">MOM offer range/mo</span></span></Link>)}</div>
    </main>
  )
}
