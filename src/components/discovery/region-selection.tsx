import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPinned } from "lucide-react"
import { regionalDiscoveryFor } from "@/data/regional-discovery"
import type { LaunchCountry } from "@/data/launch-countries"
import { getStudyConcept } from "@/data/study-concepts"
import { LANDING_GOALS } from "@/lib/discovery/landing-discovery"
import { localizePath } from "@/lib/i18n/config"

export function RegionSelection({
  country,
  major,
  goal,
  locale,
}: {
  country: LaunchCountry
  major: string
  goal: string
  locale: "en" | "ko"
}) {
  const regions = regionalDiscoveryFor(country.code)
  const context = [major === "anything" ? "Any field" : getStudyConcept(major)?.label ?? major, LANDING_GOALS.find((item) => item.id === goal)?.label ?? goal].join(" · ")

  return <section>
    <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-3xl font-semibold tracking-tight text-slate-950">Where in {country.name}?</h2><span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800">{context}</span></div>
    {regions.length > 0 ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{regions.map((region) => <Link key={`${region.code}-${region.city}`} href={localizePath(`/regional-workspace?${new URLSearchParams({ country: country.code, state: region.code, city: region.city, major, goal })}`, locale)} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-md"><div className="relative h-40 overflow-hidden"><Image src={region.image} alt={`${region.city}, ${region.region}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></div><div className="p-4"><p className="text-xs font-semibold tracking-[.15em] text-blue-700">{region.region}</p><h3 className="mt-1 font-semibold text-slate-950">{region.city}</h3><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">Open workspace <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div> : <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h3 className="font-semibold text-blue-950">Regional cards are being curated for {country.name}.</h3><p className="mt-1 text-sm leading-6 text-blue-900">You can already open the regional map and choose an available area there.</p><Link href={localizePath(`/maps?country=${country.code.toLowerCase()}`, locale)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-800"><MapPinned className="h-4 w-4" />Open {country.name} Maps</Link></div>}
  </section>
}
