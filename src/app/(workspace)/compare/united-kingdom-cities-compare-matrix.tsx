import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { UkCityProfile } from "@/lib/cities/uk-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = {
  left: UkCityProfile
  right: UkCityProfile
  options: readonly CityCompareOption[]
}

function money(value: number, currency = "GBP", decimals = 0) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function period(periodValue: string) {
  return periodValue.replaceAll("_", " ")
}

function living(profile: UkCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low, profile.livingCost.currency)} / month`
  }
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)} / month`
}

function transport(profile: UkCityProfile) {
  if (!profile.transport) return "—"
  const decimals = profile.transport.referenceAmount % 1 === 0 ? 0 : 2
  return `${money(profile.transport.referenceAmount, profile.transport.currency, decimals)} / ${period(profile.transport.period)}`
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

function Header({ city }: { city: UkCityProfile }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.educationNation}</p>
      <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
      <p className="mt-1 text-[10.5px] text-[#77746e]">{city.scopeLabel}</p>
      <Link href={`/cities/uk/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline">
        City profile <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

export function UnitedKingdomCitiesCompareMatrix({ left, right, options }: Props) {
  const leftMid = left.livingCost ? (left.livingCost.low + left.livingCost.high) / 2 : null
  const rightMid = right.livingCost ? (right.livingCost.low + right.livingCost.high) / 2 : null
  const lowerLiving =
    leftMid == null || rightMid == null
      ? "Compare the published references"
      : Math.abs(leftMid - rightMid) < 1
        ? "Current published midpoints are effectively the same"
        : `${leftMid < rightMid ? left.name : right.name} has the lower current published midpoint`

  return (
    <div className="w-full">
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="UK" />

      <header className="mt-4 rounded-2xl border border-[#d9e3f7] bg-gradient-to-br from-[#f7f9fe] via-white to-[#f7faf5] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2563eb]">United Kingdom city comparison</p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare verified student living, transport, Student visa work context, institution presence and career sectors. Each city keeps its approved study-destination boundary, so Greater London is not silently treated as the same geography type as a named-city local authority.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href={`/cities/uk/${left.slug}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2.5 text-[11.5px] font-semibold text-white">
            View {left.name} <ArrowRight className="size-3.5" />
          </Link>
          <Link href={`/cities/uk/${right.slug}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3e7a2e] px-3.5 py-2.5 text-[11.5px] font-semibold text-white">
            View {right.name} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <div className="border-r border-[#ecebe7] md:border-l md:border-r-0"><Header city={left} /></div>
          <div className="md:border-l md:border-[#ecebe7]"><Header city={right} /></div>
        </div>
        <Row icon={<MapPin className="size-4" />} label="Study-destination scope" note="Scope labels are explicit because London uses Greater London while the other Tier A destinations use approved named-city/local-authority boundaries." left={left.scopeLabel} right={right.scopeLabel} leftName={left.name} rightName={right.name} />
        <Row icon={<Wallet className="size-4" />} label="Student living" note="Indicative monthly GBP references from official university sources. Source scenarios differ, so use the figures directionally rather than as identical baskets." left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<TrainFront className="size-4" />} label="Student transport" note="Source-native fare periods and eligibility rules are preserved instead of converting every product into a synthetic monthly figure." left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Clock3 className="size-4" />} label="Student visa work" note="The 20-hour figure applies to qualifying full-time degree-level study at a compliant higher education provider during term time. Other categories can differ or have no work permission." left={left.workRights ? `${left.workRights.hours} h / week during term` : "—"} right={right.workRights ? `${right.workRights.hours} h / week during term` : "—"} leftName={left.name} rightName={right.name} />
        <Row icon={<Building2 className="size-4" />} label="Verified institutions" left={left.linkedInstitutionCount.toLocaleString("en-GB")} right={right.linkedInstitutionCount.toLocaleString("en-GB")} leftName={left.name} rightName={right.name} />
        <Row icon={<MapPin className="size-4" />} label="Verified campus locations" left={left.linkedCampusCount.toLocaleString("en-GB")} right={right.linkedCampusCount.toLocaleString("en-GB")} leftName={left.name} rightName={right.name} />
        <Row icon={<Users className="size-4" />} label="Population" note="Population follows each approved city scope. London is Greater London; other destinations use their documented local-authority/council boundary." left={left.population ? compact(left.population.amount) : "—"} right={right.population ? compact(right.population.amount) : "—"} leftName={left.name} rightName={right.name} />
        <Row icon={<BriefcaseBusiness className="size-4" />} label="Career context" note="Official city or regional economic-development focus sectors, not shortage rankings or job guarantees." left={left.employmentSectors.slice(0, 5).join(" · ")} right={right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#c2691e]">Living-cost signal</p>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{lowerLiving}</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">The underlying university budget methodologies are not identical, so this is a directional comparison rather than a guaranteed personal budget.</p>
        </article>
        <article className="rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5">
          <div className="flex items-center gap-2 text-[#a86514]"><Info className="size-4" /><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">Programme coverage</p></div>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">Verified UK programme delivery is still pending</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#7a5a31]">CampCareer does not infer programme delivery from institution presence. The current verified programme count is therefore not presented as “0 programmes” and does not block city comparison.</p>
        </article>
      </div>
    </div>
  )
}
