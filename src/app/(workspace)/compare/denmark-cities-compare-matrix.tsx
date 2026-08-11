import Link from "next/link"
import { ArrowRight, BookOpen, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { DkCityProfile } from "@/lib/cities/dk-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = {
  left: DkCityProfile
  right: DkCityProfile
  options: readonly CityCompareOption[]
}

function money(value: number, currency = "DKK") {
  return new Intl.NumberFormat("en-DK", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-DK", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function living(profile: DkCityProfile) {
  if (!profile.livingCost) return "—"
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)} / month`
}

function transport(profile: DkCityProfile) {
  if (!profile.transport) return "—"
  return `${money(profile.transport.amount, profile.transport.currency)} / ${profile.transport.period.replaceAll("_", " ")}`
}

function work(profile: DkCityProfile) {
  if (!profile.workRights) return "—"
  return `${profile.workRights.hoursNormalPeriod} h / ${profile.workRights.period} · Sep–May`
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
  return (
    <div className="grid grid-cols-2 border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
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
  )
}

function Header({ city }: { city: DkCityProfile }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.regionName}</p>
      <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
      <p className="mt-1 text-[10.5px] text-[#77746e]">{city.scopeLabel} · municipality {city.municipalityCode}</p>
      <Link href={`/cities/dk/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#9d2633] hover:underline">
        City profile <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

export function DenmarkCitiesCompareMatrix({ left, right, options }: Props) {
  return (
    <div className="w-full">
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="DK" />

      <header className="mt-4 rounded-2xl border border-[#eadadd] bg-gradient-to-br from-[#fff7f8] via-white to-[#faf7f5] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9d2633]">Denmark city comparison</p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare the same Statistics Denmark municipality scope, verified university locations, verified-partial programme delivery, source-native transport references and official economic context. National student-budget and residence-permit work rules are kept visible as shared context rather than treated as city advantages.
        </p>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <div className="border-r border-[#ecebe7] md:border-l md:border-r-0"><Header city={left} /></div>
          <div className="md:border-l md:border-[#ecebe7]"><Header city={right} /></div>
        </div>
        <Row icon={<MapPin className="size-4" />} label="Study-destination scope" note="All five launch destinations use Statistics Denmark municipality boundaries. Copenhagen and Frederiksberg remain separate municipalities." left={left.scopeLabel} right={right.scopeLabel} leftName={left.name} rightName={right.name} />
        <Row icon={<Users className="size-4" />} label="Population" note="2026 Q3 municipality population on the same Statistics Denmark boundary family." left={left.population ? compact(left.population.amount) : "—"} right={right.population ? compact(right.population.amount) : "—"} leftName={left.name} rightName={right.name} />
        <Row icon={<Wallet className="size-4" />} label="Student living" note="The current Study in Denmark budget is a national baseline, not a city-specific basket, so identical values are not evidence that living costs are actually equal." left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<TrainFront className="size-4" />} label="Public transport" note="Source-native general adult fare references; products and periods differ and are not converted to a synthetic monthly student fare." left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Clock3 className="size-4" />} label="Student permit work" note="Shared national context: up to 90 hours per month September–May, with full-time work in June–August for the relevant permit context. The monthly cap is not converted to a weekly entitlement." left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Building2 className="size-4" />} label="Verified university institutions" note="Current canonical layer is a university core; professional higher-education providers remain a known expansion gap." left={left.linkedInstitutionCount.toLocaleString("en-DK")} right={right.linkedInstitutionCount.toLocaleString("en-DK")} leftName={left.name} rightName={right.name} />
        <Row icon={<MapPin className="size-4" />} label="Verified university locations" left={left.linkedCampusCount.toLocaleString("en-DK")} right={right.linkedCampusCount.toLocaleString("en-DK")} leftName={left.name} rightName={right.name} />
        <Row icon={<BookOpen className="size-4" />} label="Verified-partial programmes" note="Only Study in Denmark programme rows whose source city matches a verified official university location are counted. This is not a complete municipality catalogue." left={left.linkedProgramCount.toLocaleString("en-DK")} right={right.linkedProgramCount.toLocaleString("en-DK")} leftName={left.name} rightName={right.name} />
        <Row icon={<BriefcaseBusiness className="size-4" />} label="Career context" note="Official municipality economic context only; not shortage rankings or employment guarantees." left={left.employmentSectors.slice(0, 5).join(" · ")} right={right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5">
          <div className="flex items-center gap-2 text-[#5e6f91]"><Info className="size-4" /><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">Shared national context</p></div>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">Living baseline and work rights are not city differentiators</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#5e6f91]">CampCareer keeps the national Study in Denmark budget and SIRI residence-permit work rule visible without manufacturing a city ranking from national values.</p>
        </article>
        <article className="rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5">
          <div className="flex items-center gap-2 text-[#a86514]"><BookOpen className="size-4" /><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">Programme coverage</p></div>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">Verified delivery exists, but coverage is partial</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#7a5a31]">The compared counts are source-backed programme-location matches. Missing professional providers and unverified delivery locations remain explicit gaps rather than being treated as zero.</p>
        </article>
      </div>
    </div>
  )
}
