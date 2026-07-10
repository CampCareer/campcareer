import type { Metadata } from "next"
import Link from "next/link"
import { SG_DEMAND_OCCUPATIONS, SG_MAP_AREAS } from "@/data/sg-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Singapore Study and Work ROI Guide | CampCareer",
  description: "Use official Singapore job-demand, salary, work-pass and rental-market data to evaluate a study-to-work pathway.",
  path: "/countries/singapore",
})

export default function SingaporeCountryDetailPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Country decision guide</p><h1 className="mt-3 text-4xl font-semibold tracking-normal">Study and work in Singapore</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Singapore offers concentrated opportunities, but job demand, salary and foreign-worker access are separate questions. Compare them before treating a degree as an immigration route.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/sg/jobs" className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Browse demand cards</Link><Link href="/map?country=sg&area=cbd" className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-100">Compare areas</Link></div></div></section><section className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-3"><Info title="Job demand" value={`${SG_DEMAND_OCCUPATIONS.length} official cards`} body={"MOM's top PMET and non-PMET vacancy occupations with skills, offer ranges and experience context."} /><Info title="Resident wages" value="523 SSOC roles" body="MOM monthly median basic and gross wages are benchmarks, not job offers to foreign workers." /><Info title="Living cost" value={`${SG_MAP_AREAS.length} area comparisons`} body="URA CCR/RCR/OCR rental indices are used as transparent market proxies, never as invented room-rent averages." /></section><section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6"><div className="rounded-lg border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold text-amber-950">Policy review required</h2><p className="mt-2 text-sm leading-6 text-amber-900">{"Student's Pass, Employment Pass, S Pass and COMPASS information can change. CampCareer links official policy sources and does not label any occupation as visa-approved."}</p></div></section></main>
  )
}

function Info({ title, value, body }: { title: string; value: string; body: string }) { return <article className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="text-sm font-semibold text-slate-500">{title}</h2><p className="mt-2 text-xl font-semibold">{value}</p><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></article> }
