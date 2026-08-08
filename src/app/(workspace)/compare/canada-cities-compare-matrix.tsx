import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  GraduationCap,
  MapPin,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react"
import type { CaCityProfile } from "@/lib/cities/ca-city-profile.server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type CanadaCitiesCompareMatrixProps = {
  left: CaCityProfile
  right: CaCityProfile
  options: readonly CityCompareOption[]
  sharedProgramCount: number
}

function money(value: number, currency = "CAD", decimals = 0) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-CA", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function transportPeriod(period: string) {
  if (period === "4_month_term") return "4-month term"
  if (period === "month") return "month"
  if (period === "term") return "term"
  return period.replaceAll("_", " ")
}

function cityValue(
  profile: CaCityProfile,
  kind: "living" | "transport" | "work" | "population" | "programs" | "providers" | "locations",
) {
  if (kind === "living") {
    if (!profile.livingCost) return "—"
    if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) {
      return `~${money(profile.livingCost.low, profile.livingCost.currency)} / month`
    }
    return `${money(profile.livingCost.low, profile.livingCost.currency)}–${money(profile.livingCost.high, profile.livingCost.currency)} / month`
  }
  if (kind === "transport") {
    if (!profile.transport) return "—"
    const decimals = profile.transport.referenceAmount % 1 === 0 ? 0 : 2
    return `${money(profile.transport.referenceAmount, profile.transport.currency, decimals)} / ${transportPeriod(profile.transport.period)}`
  }
  if (kind === "work") return profile.workRights ? `${profile.workRights.hours} h / week` : "—"
  if (kind === "population") return profile.population ? compact(profile.population.amount) : "—"
  if (kind === "programs") return profile.linkedProgramCount.toLocaleString("en-CA")
  if (kind === "providers") return profile.linkedInstitutionCount.toLocaleString("en-CA")
  return profile.linkedCampusCount.toLocaleString("en-CA")
}

function ComparisonRow({
  label,
  left,
  right,
  leftName,
  rightName,
  note,
  icon,
}: {
  label: string
  left: string
  right: string
  leftName: string
  rightName: string
  note?: string
  icon: React.ReactNode
}) {
  return (
    <div className="grid border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex items-start gap-2 px-4 py-4 text-[12px] font-semibold text-[#5f5d57] md:px-5">
        <span className="mt-0.5 text-[#8f8c85]">{icon}</span>
        <div>
          <p>{label}</p>
          {note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}
        </div>
      </div>
      <div className="border-t border-[#f0efec] px-4 py-4 text-[14px] font-semibold text-[#1b1b1b] md:border-l md:border-t-0 md:px-5">
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span>
        {left}
      </div>
      <div className="border-t border-[#f0efec] px-4 py-4 text-[14px] font-semibold text-[#1b1b1b] md:border-l md:border-t-0 md:px-5">
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span>
        {right}
      </div>
    </div>
  )
}

function CityHeader({ city }: { city: CaCityProfile }) {
  return (
    <div className="px-4 py-5 md:px-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.regionName}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[24px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">
          <span aria-hidden="true">🏙️</span>
          {city.name}
        </h2>
        <Link href={`/cities/ca/${city.slug}`} className="text-[11px] font-semibold text-[#2563eb] hover:underline">
          City profile →
        </Link>
      </div>
    </div>
  )
}

export function CanadaCitiesCompareMatrix({
  left,
  right,
  options,
  sharedProgramCount,
}: CanadaCitiesCompareMatrixProps) {
  const lowerLiving =
    left.livingCost && right.livingCost
      ? (left.livingCost.low + left.livingCost.high) / 2 < (right.livingCost.low + right.livingCost.high) / 2
        ? left.name
        : right.name
      : null
  const morePrograms = left.linkedProgramCount >= right.linkedProgramCount ? left.name : right.name

  return (
    <div className="w-full">
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="CA" />

      <header className="mt-4 rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f5f9f3] via-white to-[#eef4ff] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Canada city comparison</p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">
          {left.name} vs {right.name}
        </h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare named-city student living, transport, work rules and current canonical study coverage. Neighbouring municipalities are not inferred into a city unless explicit campus evidence supports the link.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/cities/ca/${left.slug}`} className="rounded-lg bg-[#2563eb] px-3.5 py-2 text-[11.5px] font-semibold text-white">
            View {left.name}
          </Link>
          <Link href={`/cities/ca/${right.slug}`} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[11.5px] font-semibold text-white">
            View {right.name}
          </Link>
        </div>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <div className="border-l border-[#ecebe7]"><CityHeader city={left} /></div>
          <div className="border-l border-[#ecebe7]"><CityHeader city={right} /></div>
        </div>
        <ComparisonRow icon={<Wallet className="size-4" />} label="Student living" note="Indicative monthly reference · tuition excluded where the source permits separation" left={cityValue(left, "living")} right={cityValue(right, "living")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<TrainFront className="size-4" />} label="Student transport" note="Student products use source-native periods and eligibility rules; monthly and term products are not directly equivalent." left={cityValue(left, "transport")} right={cityValue(right, "transport")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<Clock3 className="size-4" />} label="Student work rule" note="IRCC off-campus work limit during regular academic sessions for eligible students" left={cityValue(left, "work")} right={cityValue(right, "work")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<GraduationCap className="size-4" />} label="Canonical linked programmes" note="Current normalized canonical programme offerings attached to city campus records · not yet the full Canada catalogue" left={cityValue(left, "programs")} right={cityValue(right, "programs")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<Building2 className="size-4" />} label="Canonical institutions" left={cityValue(left, "providers")} right={cityValue(right, "providers")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<MapPin className="size-4" />} label="Canonical locations" left={cityValue(left, "locations")} right={cityValue(right, "locations")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<Users className="size-4" />} label="City population" note="Named-city / census-subdivision geography, not CMA population" left={cityValue(left, "population")} right={cityValue(right, "population")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<BriefcaseBusiness className="size-4" />} label="Career context" note="Official city economic guidance, not occupation-shortage rankings" left={left.employmentSectors.slice(0, 5).join(" · ")} right={right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#c2691e]">Living-cost signal</p>
          <p className="mt-2 text-[18px] font-semibold text-[#1b1b1b]">
            {lowerLiving ? `${lowerLiving} has the lower current midpoint` : "Compare the published references"}
          </p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Source scenarios differ by institution, so use this as a directional city signal rather than a guaranteed personal budget.</p>
        </article>
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">Current canonical coverage</p>
          <p className="mt-2 text-[18px] font-semibold text-[#1b1b1b]">{morePrograms} currently has more linked programmes</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
            {left.name}: {left.linkedProgramCount.toLocaleString("en-CA")} · {right.name}: {right.linkedProgramCount.toLocaleString("en-CA")}. These counts will expand as the Canada catalogue is normalized.
          </p>
        </article>
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3e7a2e]">Canonical in both</p>
          <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{sharedProgramCount.toLocaleString("en-CA")}</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Canonical programmes currently linked to campus offerings in both selected cities.</p>
        </article>
      </div>

      <section className="mt-5 rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-[#1b1b1b]">How to use this comparison</h2>
        <p className="mt-2 max-w-4xl text-[12px] leading-5 text-[#5e6f91]">
          Choose the city context first, then verify the actual institution, campus and programme. Canada city programme counts are intentionally conservative while official programme and DLI/PGWP catalogues are normalized into canonical offerings.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/cities/ca/${left.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#bfcff0] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#2563eb]">
            View {left.name} <ArrowRight className="size-3.5" />
          </Link>
          <Link href={`/cities/ca/${right.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#cfd9ca] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#3e7a2e]">
            View {right.name} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
