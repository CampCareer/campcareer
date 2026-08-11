import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { FrCityProfile } from "@/lib/cities/fr-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = {
  left: FrCityProfile
  right: FrCityProfile
  options: readonly CityCompareOption[]
}

function money(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-FR", { style: "currency", currency, maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-FR", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function period(value: string) {
  return value.replaceAll("_", " ")
}

function living(profile: FrCityProfile) {
  if (!profile.livingCost) return "—"
  if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) return `~${money(profile.livingCost.low)} / month`
  return `${money(profile.livingCost.low)}–${money(profile.livingCost.high)} / month`
}

function transport(profile: FrCityProfile) {
  if (!profile.transport) return "—"
  return `${money(profile.transport.amount)} / ${period(profile.transport.period)}`
}

function Row({ label, note, icon, left, right, leftName, rightName }: {
  label: string
  note?: string
  icon: React.ReactNode
  left: string
  right: string
  leftName: string
  rightName: string
}) {
  return <div className="grid grid-cols-2 border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
    <div className="col-span-2 flex items-start gap-2 px-4 py-3.5 text-[12px] font-semibold text-[#5f5d57] md:col-span-1 md:px-5 md:py-4"><span className="mt-0.5 text-[#8f8c85]">{icon}</span><div><p>{label}</p>{note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}</div></div>
    <div className="min-w-0 border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[14px]"><span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span>{left}</div>
    <div className="min-w-0 border-l border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 md:px-5 md:py-4 md:text-[14px]"><span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span>{right}</div>
  </div>
}

function Header({ city }: { city: FrCityProfile }) {
  return <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.region}</p>
    <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] md:text-[24px]">{city.name}</h2>
    <p className="mt-1 text-[10.5px] text-[#77746e]">{city.populationGeographyLabel}</p>
    <Link href={`/cities/fr/${city.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#315f9c] hover:underline">City profile <ArrowRight className="size-3" /></Link>
  </div>
}

export function FranceCitiesCompareMatrix({ left, right, options }: Props) {
  const leftMid = left.livingCost ? (left.livingCost.low + left.livingCost.high) / 2 : null
  const rightMid = right.livingCost ? (right.livingCost.low + right.livingCost.high) / 2 : null
  const livingSignal = leftMid == null || rightMid == null
    ? "Compare the published references"
    : Math.abs(leftMid - rightMid) < 1
      ? "Current published planning midpoints are effectively the same"
      : `${leftMid < rightMid ? left.name : right.name} has the lower published planning midpoint`

  return <div className="w-full">
    <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="FR" />

    <header className="mt-4 rounded-2xl border border-[#dce3ee] bg-gradient-to-br from-[#f3f6fb] via-white to-[#f8f7f3] p-5 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#315f9c]">France city comparison</p>
      <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] sm:text-[40px]">{left.name} vs {right.name}</h2>
      <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">Compare verified planning references, public-transport products, the national 964-hour student-work rule, verified teaching locations and INSEE employment context. Public population scopes can differ between a commune and an EPCI, so each geography label remains visible instead of implying perfect like-for-like boundaries.</p>
    </header>

    <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
      <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]"><div className="hidden md:block" /><div className="border-r border-[#ecebe7] md:border-l md:border-r-0"><Header city={left} /></div><div className="md:border-l md:border-[#ecebe7]"><Header city={right} /></div></div>
      <Row icon={<MapPin className="size-4" />} label="Public geography" note="Phase 2 population scope. France launch destinations intentionally mix Paris commune and metropolitan/EPCI study-destination contracts." left={left.populationGeographyLabel} right={right.populationGeographyLabel} leftName={left.name} rightName={right.name} />
      <Row icon={<Wallet className="size-4" />} label="Student living" note="Indicative source-native monthly planning references; source baskets and assumptions are not identical." left={living(left)} right={living(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<TrainFront className="size-4" />} label="Student transport" note="Source-native fare products and periods are preserved; no synthetic monthly normalization is created." left={transport(left)} right={transport(right)} leftName={left.name} rightName={right.name} />
      <Row icon={<Clock3 className="size-4" />} label="Student work" note="National France rule, not a city differentiator." left={left.workRights ? `${left.workRights.hours} h / ${left.workRights.period}` : "—"} right={right.workRights ? `${right.workRights.hours} h / ${right.workRights.period}` : "—"} leftName={left.name} rightName={right.name} />
      <Row icon={<Building2 className="size-4" />} label="Verified institutions" note="Initial verified nine-university foundation, not the full French provider universe." left={left.linkedInstitutionCount.toLocaleString("en-FR")} right={right.linkedInstitutionCount.toLocaleString("en-FR")} leftName={left.name} rightName={right.name} />
      <Row icon={<MapPin className="size-4" />} label="Verified teaching locations" left={left.linkedCampusCount.toLocaleString("en-FR")} right={right.linkedCampusCount.toLocaleString("en-FR")} leftName={left.name} rightName={right.name} />
      <Row icon={<Users className="size-4" />} label="Population" note="Each value uses its own Phase 2 public geography. Different geography types mean population is contextual rather than a perfectly equivalent city-size ranking." left={left.population ? `${compact(left.population.amount)} · ${left.population.geography}` : "—"} right={right.population ? `${compact(right.population.amount)} · ${right.population.geography}` : "—"} leftName={left.name} rightName={right.name} />
      <Row icon={<BriefcaseBusiness className="size-4" />} label="Employment context" note="INSEE employment-sector context; not shortage rankings, job guarantees or immigration eligibility." left={left.employmentSectors.slice(0, 4).map((sector) => `${sector.name}${sector.sharePercent != null ? ` ${sector.sharePercent}%` : ""}`).join(" · ")} right={right.employmentSectors.slice(0, 4).map((sector) => `${sector.name}${sector.sharePercent != null ? ` ${sector.sharePercent}%` : ""}`).join(" · ")} leftName={left.name} rightName={right.name} />
    </section>

    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <article className="rounded-xl border border-[#e7e6e3] bg-white p-5"><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#315f9c]">Living-cost signal</p><p className="mt-2 text-[18px] font-semibold leading-6">{livingSignal}</p><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">This is directional only. Different official sources use different baskets and student assumptions.</p></article>
      <article className="rounded-xl border border-[#eadfca] bg-[#fffaf1] p-5"><div className="flex items-center gap-2 text-[#a86514]"><Info className="size-4" /><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em]">Programme coverage</p></div><p className="mt-2 text-[18px] font-semibold leading-6">Verified France programme delivery is still pending</p><p className="mt-2 text-[11.5px] leading-5 text-[#7a5a31]">CampCareer does not infer programme delivery from university or teaching-location presence. The 132 verified national offering records therefore remain excluded from city comparison until explicit delivery evidence exists.</p></article>
    </div>
  </div>
}
