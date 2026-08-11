import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { DeCityProfile } from "@/lib/cities/de-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = {
  left: DeCityProfile
  right: DeCityProfile
  options: readonly CityCompareOption[]
}

function money(value: number, currency = "EUR", decimals = 0) {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-DE", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function period(value: string) {
  return value.replaceAll("_", " ")
}

function living(profile: DeCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
    return `~${money(profile.livingCost.low, profile.livingCost.currency)} / month`
  }
  return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)} / month`
}

function transport(profile: DeCityProfile) {
  if (!profile.transport) return "—"
  if (profile.transport.referenceAmount != null) {
    const decimals = profile.transport.referenceAmount % 1 === 0 ? 0 : 2
    return `${money(profile.transport.referenceAmount, profile.transport.currency, decimals)} / ${period(profile.transport.period)}`
  }
  if (profile.transport.low != null && profile.transport.high != null) {
    return `${money(profile.transport.low, profile.transport.currency)}–${money(profile.transport.high, profile.transport.currency)} / ${period(profile.transport.period)}`
  }
  return "—"
}

function work(profile: DeCityProfile) {
  if (!profile.workRights) return "—"
  return `${profile.workRights.hoursTermTime} h / week · ${profile.workRights.fullDaysPerYear ?? 140} full / ${profile.workRights.halfDaysPerYear ?? 280} half days annually`
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

function Header({ city }: { city: DeCityProfile }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.region}</p>
      <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
      <p className="mt-1 text-[10.5px] text-[#77746e]">{city.scopeLabel}</p>
      <Link href={`/cities/de/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4d657c] hover:underline">
        City profile <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

export function GermanyCitiesCompareMatrix({ left, right, options }: Props) {
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
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="DE" />

      <header className="mt-4 rounded-2xl border border-[#dce3eb] bg-gradient-to-br from-[#f5f7f9] via-white to-[#faf8f3] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d657c]">Germany city comparison</p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare municipality population, source-native student living and transport references, federal student-work context, verified teaching locations and official economic-sector context. Programme delivery remains excluded until explicit offering-to-campus evidence is verified.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href={`/cities/de/${left.slug}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#4d657c] px-3.5 py-2.5 text-[11.5px] font-semibold text-white">
            View {left.name} <ArrowRight className="size-3.5" />
          </Link>
          <Link href={`/cities/de/${right.slug}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#7b6643] px-3.5 py-2.5 text-[11.5px] font-semibold text-white">
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
        <Row icon={<MapPin className="size-4" />} label="Study-destination scope" note="All nine Tier A destinations use the official Destatis / GV-ISys municipality boundary. Metro areas and neighbouring municipalities are not silently folded into the comparison." left={left.scopeLabel} right={right.scopeLabel} leftName={left.name} rightName={right.name} />
        <Row icon={<Wallet className="size-4" />} label="Student living" note="Indicative monthly EUR references from official university guidance. Source baskets and methodologies differ, so midpoint comparisons are directional only." left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<TrainFront className="size-4" />} label="Student transport" note="Source-native ticket products and periods are preserved. Enrolment, age or eligibility conditions can differ, and no synthetic monthly conversion is created." left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Clock3 className="size-4" />} label="International student work" note="Federal context for eligible third-country students. The rule is national, not a city differentiator, and individual residence conditions still control." left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Building2 className="size-4" />} label="Verified institutions" note="Initial canonical-institution set with explicit official teaching-location evidence, not an exhaustive directory." left={left.linkedInstitutionCount.toLocaleString("en-DE")} right={right.linkedInstitutionCount.toLocaleString("en-DE")} leftName={left.name} rightName={right.name} />
        <Row icon={<MapPin className="size-4" />} label="Verified teaching locations" left={left.linkedCampusCount.toLocaleString("en-DE")} right={right.linkedCampusCount.toLocaleString("en-DE")} leftName={left.name} rightName={right.name} />
        <Row icon={<Users className="size-4" />} label="Population" note="Both values use the same GV-ISys municipality contract and retain their official municipality labels and AGS identifiers." left={left.population ? `${compact(left.population.amount)} · ${left.population.geography}${left.population.ags ? ` · AGS ${left.population.ags}` : ""}` : "—"} right={right.population ? `${compact(right.population.amount)} · ${right.population.geography}${right.population.ags ? ` · AGS ${right.population.ags}` : ""}` : "—"} leftName={left.name} rightName={right.name} />
        <Row icon={<BriefcaseBusiness className="size-4" />} label="Career context" note="Official city economic-sector context, not shortage rankings, job guarantees or immigration eligibility signals." left={left.employmentSectors.slice(0, 5).join(" · ")} right={right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#a86b18]">Living-cost signal</p>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{lowerLiving}</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Official university guidance uses different baskets and assumptions, so this is a directional comparison rather than a personal-budget forecast.</p>
        </article>
        <article className="rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5">
          <div className="flex items-center gap-2 text-[#a86514]"><Info className="size-4" /><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">Programme coverage</p></div>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">Verified Germany city programme delivery is still pending</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#7a5a31]">CampCareer does not infer programme delivery from institution or teaching-location presence. The existing Germany programme catalogue therefore remains outside city comparison until explicit offering-to-campus evidence is verified.</p>
        </article>
      </div>
    </div>
  )
}
