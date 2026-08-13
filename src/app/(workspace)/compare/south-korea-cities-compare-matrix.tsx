import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { KrCityProfile } from "@/lib/cities/kr-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = { left: KrCityProfile; right: KrCityProfile; options: readonly CityCompareOption[] }

function money(value: number, currency = "KRW") {
  return new Intl.NumberFormat("en-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "KRW" ? 0 : value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-KR", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function period(value: string) {
  return value.replaceAll("_", " ")
}

function living(profile: KrCityProfile) {
  if (!profile.livingCost) return "—"
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)} / ${period(profile.livingCost.period)} · national planning reference`
}

function transport(profile: KrCityProfile) {
  if (!profile.transport) return "—"
  return `${money(profile.transport.amount, profile.transport.currency)} / ${period(profile.transport.period)}`
}

function work(profile: KrCityProfile) {
  if (!profile.workRights) return "—"
  return `${profile.workRights.hoursNormalPeriod} h / ${period(profile.workRights.period)} · conditional national context`
}

function programmes(profile: KrCityProfile) {
  return profile.programmeCoverage.status === "verified_partial"
    ? `${profile.linkedProgramCount} verified-partial programmes`
    : "Verification pending"
}

function Row({ icon, label, note, left, right, leftName, rightName }: {
  icon: React.ReactNode
  label: string
  note?: string
  left: string
  right: string
  leftName: string
  rightName: string
}) {
  return <div className="grid grid-cols-2 border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
    <div className="col-span-2 flex items-start gap-2 px-4 py-3.5 text-[12px] font-semibold text-[#5f5d57] md:col-span-1 md:px-5 md:py-4">
      <span className="mt-0.5 text-[#8f8c85]">{icon}</span>
      <div><p>{label}</p>{note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}</div>
    </div>
    <div className="min-w-0 border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[14px]">
      <span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span>{left}
    </div>
    <div className="min-w-0 border-l border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] md:px-5 md:py-4 md:text-[14px]">
      <span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span>{right}
    </div>
  </div>
}

function Header({ city }: { city: KrCityProfile }) {
  return <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.regionName}</p>
    <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
    <p className="mt-1 text-[10.5px] text-[#77746e]">MOIS administrative code {city.adminCode}</p>
    <Link href={`/cities/kr/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#315ea8] hover:underline">City profile <ArrowRight className="size-3" /></Link>
  </div>
}

export function SouthKoreaCitiesCompareMatrix({ left, right, options }: Props) {
  return <div className="w-full">
    <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="KR" />

    <header className="mt-4 rounded-2xl border border-[#dce5f3] bg-gradient-to-br from-[#f4f8ff] via-white to-[#f8f5ee] p-5 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#315ea8]">South Korea city comparison</p>
      <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
      <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">Compare the same MOIS/KOSIS administrative population boundary, verified teaching-location evidence and the five reviewed decision metrics. The current living-cost planning range is national and is therefore never used to rank Korean cities by affordability.</p>
    </header>

    <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
      <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]"><div className="hidden md:block" /><Header city={left} /><div className="border-l border-[#ecebe7]"><Header city={right} /></div></div>
      <Row icon={<MapPin className="size-3.5" />} label="Administrative population" note="Same MOIS resident-registration boundary and June 2026 reference month" left={left.population ? compact(left.population.amount) : "—"} right={right.population ? compact(right.population.amount) : "—"} leftName={left.name} rightName={right.name} />
      <Row icon={<Wallet className="size-3.5" />} label="Student living-cost planning range" note="National Study in Korea planning reference; city_specific=false and ranking_safe=false" left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<TrainFront className="size-3.5" />} label="Local transport reference" note="Source-native operator fare; no synthetic monthly normalization" left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<Clock3 className="size-3.5" />} label="Student work context" note="National immigration context with permission and eligibility conditions; not a city differentiator" left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<Building2 className="size-3.5" />} label="Verified teaching locations" note="Current Study in Korea provider foundation, not a complete Korean HEI inventory" left={`${left.linkedInstitutionCount} institutions · ${left.linkedCampusCount} locations`} right={`${right.linkedInstitutionCount} institutions · ${right.linkedCampusCount} locations`} leftName={left.name} rightName={right.name} />
      <Row icon={<Users className="size-3.5" />} label="Programme evidence" note="Strict source-city linkage only; no inherited Seoul leakage from Suwon or Yongin" left={programmes(left)} right={programmes(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<BriefcaseBusiness className="size-3.5" />} label="Career environment" note="Official local economic context; not a shortage ranking or job guarantee" left={left.employmentSectors.join(" · ") || "—"} right={right.employmentSectors.join(" · ") || "—"} leftName={left.name} rightName={right.name} />
    </div>

    <div className="mt-4 rounded-xl border border-[#e4e3df] bg-[#fafaf8] p-4 text-[11px] leading-5 text-[#74716b]"><div className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0" /><p>South Korea Compare intentionally does not score a winner. Living-cost evidence is currently a national planning range, local transport products retain their source-native fare basis, student-work rules are conditional national context, and programme counts are limited to strict city-linked evidence.</p></div></div>
  </div>
}
