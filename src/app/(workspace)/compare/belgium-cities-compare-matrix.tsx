import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { BeCityProfile } from "@/lib/cities/be-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = {
  left: BeCityProfile
  right: BeCityProfile
  options: readonly CityCompareOption[]
}

function money(value: number, currency = "EUR", decimals = 0) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-BE", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function period(value: string) {
  return value.replaceAll("_", " ")
}

function living(profile: BeCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low, profile.livingCost.currency)} / month`
  }
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)} / month`
}

function transport(profile: BeCityProfile) {
  if (!profile.transport) return "—"
  const decimals = profile.transport.amount % 1 === 0 ? 0 : 2
  return `${money(profile.transport.amount, profile.transport.currency, decimals)} / ${period(profile.transport.period)}`
}

function work(profile: BeCityProfile) {
  if (!profile.workRights) return "—"
  return `${profile.workRights.hoursSchoolPeriod} h / week during school periods${profile.workRights.schoolHolidaysUnlimited ? " · no hourly cap under this student-work rule during school holidays" : ""}`
}

function Row({
  icon,
  label,
  note,
  left,
  right,
  leftName,
  rightName,
}: {
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
        <div>
          <p>{label}</p>
          {note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}
        </div>
      </div>
      <div className="min-w-0 border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[14px]">
        <span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span>
        {left}
      </div>
      <div className="min-w-0 border-l border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] md:px-5 md:py-4 md:text-[14px]">
        <span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span>
        {right}
      </div>
    </div>
  )
}

function Header({ city }: { city: BeCityProfile }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.region}</p>
      <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
      <p className="mt-1 text-[10.5px] text-[#77746e]">{city.scopeLabel}</p>
      <Link href={`/cities/be/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4d657c] hover:underline">
        City profile <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

export function BelgiumCitiesCompareMatrix({ left, right, options }: Props) {
  return (
    <div className="w-full">
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="BE" />

      <header className="mt-4 rounded-2xl border border-[#dce3eb] bg-gradient-to-br from-[#f5f7f9] via-white to-[#faf8f3] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d657c]">Belgium city comparison</p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare the approved Belgium study destinations using the Phase 2 geography contracts, source-native living and transport references, national student-work context, verified university teaching locations and official economic-sector context. Programme delivery remains excluded until explicit offering-to-teaching-location evidence is verified.
        </p>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <div className="border-r border-[#ecebe7] md:border-l md:border-r-0"><Header city={left} /></div>
          <div className="md:border-l md:border-[#ecebe7]"><Header city={right} /></div>
        </div>
        <Row icon={<MapPin className="size-4" />} label="Study-destination scope" note="Belgium does not force every destination into one geography type. Brussels uses the Brussels-Capital Region; Louvain-la-Neuve is a study-destination label with an Ottignies-Louvain-la-Neuve municipality population contract; the other Tier A destinations use municipality scope." left={left.scopeLabel} right={right.scopeLabel} leftName={left.name} rightName={right.name} />
        <Row icon={<Wallet className="size-4" />} label="Student living" note="Published student-budget references are preserved as source-native ranges. They use different baskets and assumptions, so this is not a synthetic cheapest-city ranking." left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<TrainFront className="size-4" />} label="Student transport" note="Ticket products and periods are preserved as published. Age, enrolment, operator or eligibility conditions may differ and no artificial monthly normalization is created." left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Clock3 className="size-4" />} label="International student work" note="The stored Belgian rule is a national context, not a city differentiator. Individual residence and employment conditions still control." left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Building2 className="size-4" />} label="Verified universities" note="Initial verified university set only. Belgian university colleges and other applied-sciences providers may not yet be represented." left={left.linkedInstitutionCount.toLocaleString("en-BE")} right={right.linkedInstitutionCount.toLocaleString("en-BE")} leftName={left.name} rightName={right.name} />
        <Row icon={<MapPin className="size-4" />} label="Verified teaching locations" left={left.linkedCampusCount.toLocaleString("en-BE")} right={right.linkedCampusCount.toLocaleString("en-BE")} leftName={left.name} rightName={right.name} />
        <Row icon={<Users className="size-4" />} label="Population" note="Population values preserve each destination's Phase 2 boundary contract. Do not compare Brussels-Capital Region or Louvain-la-Neuve as though all six values were the same municipal geography type." left={left.population ? `${compact(left.population.amount)} · ${left.population.geography}${left.population.refnisCode ? ` · REFNIS ${left.population.refnisCode}` : ""}` : "—"} right={right.population ? `${compact(right.population.amount)} · ${right.population.geography}${right.population.refnisCode ? ` · REFNIS ${right.population.refnisCode}` : ""}` : "—"} leftName={left.name} rightName={right.name} />
        <Row icon={<BriefcaseBusiness className="size-4" />} label="Career context" note="Official city or regional economic-sector context only; not a shortage ranking, job guarantee or immigration signal." left={left.employmentSectors.slice(0, 5).join(" · ")} right={right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#dce3eb] bg-[#f7f9fb] p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#4d657c]">Comparison guardrail</p>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">Source-native evidence stays source-native</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#64748b]">Belgium's linguistic communities, transport operators and destination boundaries differ. CampCareer therefore shows the evidence side by side without manufacturing one composite city score.</p>
        </article>
        <article className="rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5">
          <div className="flex items-center gap-2 text-[#a86514]"><Info className="size-4" /><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">Programme coverage</p></div>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">Verified Belgium city programme delivery is still pending</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#7a5a31]">The 188 verified Belgium programme offering records are not treated as city delivery evidence because their inherited primary-location relationships do not prove delivery at the Phase 3 teaching locations.</p>
        </article>
      </div>
    </div>
  )
}
