import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { SeCityProfile } from "@/lib/cities/se-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = {
  left: SeCityProfile
  right: SeCityProfile
  options: readonly CityCompareOption[]
}

function money(value: number, currency = "SEK") {
  return new Intl.NumberFormat("en-SE", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-SE", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function period(value: string) {
  return value.replaceAll("_", " ")
}

function living(profile: SeCityProfile) {
  if (!profile.livingCost) return "—"
  const { low, high, currency } = profile.livingCost
  if (Math.abs(high - low) < 1) return `~${money(low, currency)} / month`
  return `${money(low, currency)}–${money(high, currency)} / month`
}

function transport(profile: SeCityProfile) {
  if (!profile.transport) return "—"
  return `${money(profile.transport.amount, profile.transport.currency)} / ${period(profile.transport.period)}`
}

function work(profile: SeCityProfile) {
  if (!profile.workRights) return "—"
  return `${profile.workRights.hoursNormalPeriod} h / ${profile.workRights.period}`
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

function Header({ city }: { city: SeCityProfile }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.regionName}</p>
      <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2>
      <p className="mt-1 text-[10.5px] text-[#77746e]">SCB municipality {city.municipalityCode}</p>
      <Link href={`/cities/se/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4d657c] hover:underline">
        City profile <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

export function SwedenCitiesCompareMatrix({ left, right, options }: Props) {
  return (
    <div className="w-full">
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="SE" />

      <header className="mt-4 rounded-2xl border border-[#dce3eb] bg-gradient-to-br from-[#f5f7f9] via-white to-[#faf8f3] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d657c]">Sweden city comparison</p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare SCB municipality population, source-native public-transport references, verified university locations, verified-partial programme coverage and official economic-sector context. Sweden-wide student budget and work-permit rules are shown as shared national context, not city rankings.
        </p>
      </header>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <Header city={left} />
          <div className="border-l border-[#ecebe7]"><Header city={right} /></div>
        </div>
        <Row icon={<MapPin className="size-3.5" />} label="Municipality population" note="Same SCB municipality boundary contract" left={left.population ? compact(left.population.amount) : "—"} right={right.population ? compact(right.population.amount) : "—"} leftName={left.name} rightName={right.name} />
        <Row icon={<Wallet className="size-3.5" />} label="Student budget baseline" note="National Study in Sweden baseline; not city-specific and not ranked" left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<TrainFront className="size-3.5" />} label="Local transport reference" note="Source-native product and validity period; no synthetic normalization" left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Clock3 className="size-3.5" />} label="Student work context" note="National residence-permit rule; not a city differentiator" left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} />
        <Row icon={<Building2 className="size-3.5" />} label="Verified university locations" note="Selected university core only" left={`${left.linkedInstitutionCount} institutions · ${left.linkedCampusCount} locations`} right={`${right.linkedInstitutionCount} institutions · ${right.linkedCampusCount} locations`} leftName={left.name} rightName={right.name} />
        <Row icon={<Users className="size-3.5" />} label="Verified-partial programmes" note="Source-city matched; not a complete municipal catalogue" left={`${left.linkedProgramCount} programmes`} right={`${right.linkedProgramCount} programmes`} leftName={left.name} rightName={right.name} />
        <Row icon={<BriefcaseBusiness className="size-3.5" />} label="Career environment" note="Official economic-sector context; not shortage rankings" left={left.employmentSectors.join(" · ") || "—"} right={right.employmentSectors.join(" · ") || "—"} leftName={left.name} rightName={right.name} />
      </div>

      <div className="mt-4 rounded-xl border border-[#e4e3df] bg-[#fafaf8] p-4 text-[11px] leading-5 text-[#74716b]">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>
            Sweden Compare intentionally does not score a winner. The SEK 10,656 monthly student-budget reference and the relevant 15-hour-per-week permit rule are national baselines. Transport products use different operator periods, and programme counts cover only the current verified ten-university core.
          </p>
        </div>
      </div>
    </div>
  )
}
