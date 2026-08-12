import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { AeCityProfile } from "@/lib/cities/ae-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = { left: AeCityProfile; right: AeCityProfile; options: readonly CityCompareOption[] }

function money(value: number, currency: string) {
  return new Intl.NumberFormat(currency === "AED" ? "en-AE" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function period(value: string) {
  return value.replaceAll("_", " ")
}

function population(profile: AeCityProfile) {
  return profile.population.amount === null
    ? "No comparable City-locality value"
    : new Intl.NumberFormat("en-AE").format(profile.population.amount)
}

function living(profile: AeCityProfile) {
  const value = profile.livingCost
  if (!value) return "Not published"
  if (value.low !== null && value.high !== null) {
    return `${money(value.low, value.currency)}–${money(value.high, value.currency)} / ${period(value.period)}`
  }
  if (value.sourceLow !== null && value.sourceHigh !== null) {
    return `${money(value.sourceLow, value.currency)}–${money(value.sourceHigh, value.currency)} / ${period(value.period)}`
  }
  return "No release-safe numeric reference"
}

function transport(profile: AeCityProfile) {
  if (!profile.transport) return "Not published"
  const price = profile.transport.amountHigh !== null
    ? `${money(profile.transport.amount, profile.transport.currency)}–${money(profile.transport.amountHigh, profile.transport.currency)}`
    : money(profile.transport.amount, profile.transport.currency)
  return `${price} / ${period(profile.transport.period)}`
}

function work(profile: AeCityProfile) {
  if (!profile.workContext) return "Not published"
  return profile.workContext.permitRequired
    ? `Permit-based national context${profile.workContext.permitDurationMonths ? ` · ${profile.workContext.permitDurationMonths}-month permit` : ""}`
    : "Verified context unavailable"
}

function programmes(profile: AeCityProfile) {
  return `${profile.linkedProgramCount} verified-partial programmes`
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

function Header({ city }: { city: AeCityProfile }) {
  return <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.emirateName} emirate</p>
    <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
    <p className="mt-1 text-[10.5px] text-[#77746e]">{city.scopeLabel}</p>
    <Link href={`/cities/ae/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2f6b50] hover:underline">
      City profile <ArrowRight className="size-3" />
    </Link>
  </div>
}

export function UaeCitiesCompareMatrix({ left, right, options }: Props) {
  return <div className="w-full">
    <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="AE" />

    <header className="mt-4 rounded-2xl border border-[#dce8e1] bg-gradient-to-br from-[#f2faf5] via-white to-[#fff8e8] p-5 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2f6b50]">United Arab Emirates city comparison</p>
      <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
      <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
        Compare verified City-locality teaching evidence and five reviewed decision-context metrics without converting emirate totals, heterogeneous accommodation references or different transport products into a false ranking.
      </p>
    </header>

    <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
      <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="hidden md:block" /><Header city={left} /><div className="border-l border-[#ecebe7]"><Header city={right} /></div>
      </div>
      <Row icon={<MapPin className="size-3.5" />} label="City-locality population" note="Emirate-wide population is never substituted; unavailable values remain explicitly unavailable" left={population(left)} right={population(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<Wallet className="size-3.5" />} label="Student living-cost reference" note="Source-native currency and period; ranking_safe=false and no cheapest-city inference" left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<TrainFront className="size-3.5" />} label="Local transport reference" note="Operator-native validity period and eligibility; no synthetic monthly normalization" left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<Clock3 className="size-3.5" />} label="Student work context" note="National MOHRE permit context; no invented universal weekly-hour cap" left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<Building2 className="size-3.5" />} label="Verified teaching locations" note="Selected provider foundation, not the complete UAE higher-education inventory" left={`${left.linkedInstitutionCount} providers · ${left.linkedCampusCount} locations`} right={`${right.linkedInstitutionCount} providers · ${right.linkedCampusCount} locations`} leftName={left.name} rightName={right.name} />
      <Row icon={<Users className="size-3.5" />} label="Programme evidence" note="Strict source-City linkage only; counts are verified-partial, not market totals" left={programmes(left)} right={programmes(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<BriefcaseBusiness className="size-3.5" />} label="Career environment" note="Official local economic context; not a shortage ranking or job guarantee" left={left.employmentSectors.join(" · ") || "—"} right={right.employmentSectors.join(" · ") || "—"} leftName={left.name} rightName={right.name} />
    </div>

    <div className="mt-4 rounded-xl border border-[#e4e3df] bg-[#fafaf8] p-4 text-[11px] leading-5 text-[#74716b]">
      <div className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0" /><p>UAE Compare intentionally does not score a winner. Population values are withheld where only emirate-level figures would be available, living-cost evidence uses different provider methodologies and currencies, transport uses different validity periods, and the student-work rule is national permit context.</p></div>
    </div>
  </div>
}
