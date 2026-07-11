import Link from "next/link"
import { FR_CITIES, FR_DEMAND_OCCUPATIONS, FR_REGIONS, FR_UNIVERSITIES, isFranceDemandOccupationIndexable } from "@/data/fr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const metadata = pageMetadata({ title: "France Study and Career ROI | CampCareer", description: "A source-led overview of France career demand, salary groups, rental indicators and public higher education options.", path: "/countries/france" })

export default function FranceCountryPage() {
  const indexable = FR_DEMAND_OCCUPATIONS.filter(isFranceDemandOccupationIndexable)
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="text-sm font-semibold text-blue-700">France</p><h1 className="mt-4 text-4xl font-semibold">France study and career decision data</h1><p className="mt-4 max-w-3xl leading-7 text-slate-600">This country view separates employer recruitment intentions, salary groups, advertised-rent indicators and public institutions so a single statistic is not used as a blanket recommendation.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><Fact value={`${FR_REGIONS.length} regions`} label="Metropolitan launch" /><Fact value={`${FR_CITIES.length} cities`} label="BMO-linked city profiles" /><Fact value={`${indexable.length} occupations`} label="Indexable demand profiles" /><Fact value={`${FR_UNIVERSITIES.length} institutions`} label="MESR public pins" /></div><Link href="/fr" className="mt-8 inline-flex text-sm font-semibold text-blue-700 hover:underline">Open France Maps and data</Link></main>
}
function Fact({ value, label }: { value: string; label: string }) { return <div className="rounded-lg border border-slate-200 p-4"><p className="font-semibold">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div> }
