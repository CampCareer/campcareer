import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { SG_DEMAND_OCCUPATIONS, SG_HIGH_PAY_OCCUPATIONS, SG_MAP_AREAS } from "@/data/sg-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Singapore - Jobs, Salary and Work-Pass Context | CampCareer",
  description: "Compare official Singapore job-demand signals, MOM wages, URA rental market segments, SkillsFuture pathways and work-pass context.",
  path: "/sg",
})

export default function SingaporeHubPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <JsonLd data={breadcrumbLd([{ name: "CampCareer", path: "/" }, { name: "Singapore", path: "/sg" }])} />
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Singapore</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">Singapore study and work decision data</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Compare official job-demand signals with resident wage benchmarks, rental-market segments and employer-led work-pass requirements. A shortage signal is not a work-pass outcome.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/sg/jobs" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">Browse official job signals</Link><Link href="/map?country=sg&area=central" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100">Open Singapore Maps</Link></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-3"><Metric value={String(SG_DEMAND_OCCUPATIONS.length)} label="MOM demand cards" note="National top-vacancy occupations" /><Metric value={String(SG_HIGH_PAY_OCCUPATIONS.length)} label="High-pay wage cards" note="MOM resident wage benchmark" /><Metric value={String(SG_MAP_AREAS.length)} label="Living comparisons" note="URA rental market proxies" /></div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2"><section><h2 className="text-xl font-semibold">How to read the data</h2><div className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><p><b className="text-slate-900">Demand:</b> MOM publishes national job-vacancy rankings, skills, employer-offer ranges and experience context for selected occupations.</p><p><b className="text-slate-900">Salary:</b> MOM wage cards are median monthly gross wages of full-time resident employees, not foreign-worker salary offers.</p><p><b className="text-slate-900">Location:</b> Singapore is a city-state. Central, East, North, North-East, West and CBD are living and commute comparisons; demand data remains national.</p></div></section><section className="rounded-lg border border-slate-200 bg-slate-50 p-5"><h2 className="text-xl font-semibold">Work-pass caution</h2><p className="mt-3 text-sm leading-6 text-slate-600">Employment Pass and S Pass applications are employer-led. Salary thresholds, COMPASS, quota and job requirements must be checked from the official MOM source for the actual application.</p><div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold"><a href="https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">Employment Pass</a><a href="https://www.mom.gov.sg/passes-and-permits/s-pass/eligibility" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">S Pass</a><a href="https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility/compass-c5-skills-bonus-shortage-occupation-list-sol" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">COMPASS SOL</a></div></section></div>
      </section>
    </main>
  )
}

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>
}
