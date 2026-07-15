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
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Next: choose a region</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Where in {country.name}?</h2><p className="mt-2 text-slate-600">Choose a state or city to explore local occupations, universities, and opportunities.</p></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800">{context}</span></div>
    {regions.length > 0 ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{regions.map((region) => <Link key={`${region.code}-${region.city}`} href={localizePath(`/maps?country=${country.code.toLowerCase()}&state=${region.code}`, locale)} className="group relative isolate min-h-56 overflow-hidden rounded-2xl bg-slate-950"><Image src={region.image} alt={`${region.city}, ${region.region}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" /><span className={`absolute inset-0 bg-gradient-to-t to-transparent ${region.accent}`} /><span className="absolute inset-x-0 bottom-0 p-5 text-white"><span className="text-xs font-semibold uppercase tracking-[.16em] text-white/75">{region.region}</span><span className="mt-1 block text-2xl font-semibold">{region.city}</span><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">Choose this region <ArrowRight className="h-4 w-4" /></span></span></Link>)}</div> : <div className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h3 className="font-semibold text-blue-950">Regional cards are being curated for {country.name}.</h3><p className="mt-1 text-sm leading-6 text-blue-900">You can already open the regional map and choose an available area there.</p><Link href={localizePath(`/maps?country=${country.code.toLowerCase()}`, locale)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-800"><MapPinned className="h-4 w-4" />Open {country.name} Maps</Link></div>}
  </section>
}
