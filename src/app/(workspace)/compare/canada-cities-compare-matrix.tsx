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
  sharedCareerCount: number
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

function publishedProgramCount(profile: CaCityProfile) {
  return profile.publishedPrograms?.totalPrograms ?? 0
}

function publishedInstitutionCount(profile: CaCityProfile) {
  return profile.publishedPrograms?.institutionCount ?? 0
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
  if (kind === "programs") return publishedProgramCount(profile).toLocaleString("en-CA")
  if (kind === "providers") return publishedInstitutionCount(profile).toLocaleString("en-CA")
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
    <div className="grid grid-cols-2 border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="col-span-2 flex items-start gap-2 px-4 py-3.5 text-[12px] font-semibold text-[#5f5d57] md:col-span-1 md:px-5 md:py-4">
        <span className="mt-0.5 text-[#8f8c85]">{icon}</span>
        <div><p>{label}</p>{note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}</div>
      </div>
      <div className="min-w-0 border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] sm:px-4 md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[14px]">
        <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span>
        <span className="break-words">{left}</span>
      </div>
      <div className="min-w-0 border-l border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] sm:px-4 md:px-5 md:py-4 md:text-[14px]">
        <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span>
        <span className="break-words">{right}</span>
      </div>
    </div>
  )
}

function CityHeader({ city }: { city: CaCityProfile }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
      <p className="truncate text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85] sm:text-[10.5px] sm:tracking-[0.1em]">{city.regionName}</p>
      <h2 className="mt-1 flex min-w-0 items-start gap-1.5 text-[18px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[20px] md:text-[24px]">
        <span aria-hidden="true" className="shrink-0">🏙️</span><span className="min-w-0 break-words">{city.name}</span>
      </h2>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <Link href={`/cities/ca/${city.slug}`} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563eb] hover:underline sm:text-[11px]">City profile <ArrowRight className="size-3" /></Link>
        <Link href={`/programs?country=CA&city=${city.slug}`} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e] hover:underline sm:text-[11px]">Programs <ArrowRight className="size-3" /></Link>
      </div>
    </div>
  )
}

function livingMidpoint(profile: CaCityProfile) {
  if (!profile.livingCost) return null
  return (profile.livingCost.low + profile.livingCost.high) / 2
}

export function CanadaCitiesCompareMatrix({ left, right, options, sharedCareerCount }: CanadaCitiesCompareMatrixProps) {
  const leftLivingMidpoint = livingMidpoint(left)
  const rightLivingMidpoint = livingMidpoint(right)
  const livingDifference = leftLivingMidpoint !== null && rightLivingMidpoint !== null ? leftLivingMidpoint - rightLivingMidpoint : null
  const livingSignal = livingDifference === null
    ? "Compare the published references"
    : Math.abs(livingDifference) < 1
      ? "Current published midpoints are effectively the same"
      : `${livingDifference < 0 ? left.name : right.name} has the lower current midpoint`

  const leftPrograms = publishedProgramCount(left)
  const rightPrograms = publishedProgramCount(right)
  const programmeDifference = leftPrograms - rightPrograms
  const programmeSignal = programmeDifference === 0
    ? "Published target-program counts are equal"
    : `${programmeDifference > 0 ? left.name : right.name} has more published target programs`

  const sharedCareerSignal = sharedCareerCount === 0
    ? "No shared target careers in current published coverage"
    : `${sharedCareerCount.toLocaleString("en-CA")} shared target ${sharedCareerCount === 1 ? "career" : "careers"}`

  return (
    <div className="w-full">
      <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="CA" />

      <header className="mt-4 rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f5f9f3] via-white to-[#eef4ff] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Canada city comparison</p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare named-city student living, transport, work rules and CampCareer&apos;s reviewed program set for the 80 target careers. Verified location records remain a separate source-backed layer.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href={`/cities/ca/${left.slug}`} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2.5 text-[11.5px] font-semibold text-white sm:w-auto sm:py-2">View {left.name} <ArrowRight className="size-3.5" /></Link>
          <Link href={`/cities/ca/${right.slug}`} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3e7a2e] px-3.5 py-2.5 text-[11.5px] font-semibold text-white sm:w-auto sm:py-2">View {right.name} <ArrowRight className="size-3.5" /></Link>
        </div>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <div className="border-r border-[#ecebe7] md:border-l md:border-r-0"><CityHeader city={left} /></div>
          <div className="md:border-l md:border-[#ecebe7]"><CityHeader city={right} /></div>
        </div>
        <ComparisonRow icon={<Wallet className="size-4" />} label="Student living" note="Indicative monthly reference · tuition excluded where the source permits separation" left={cityValue(left, "living")} right={cityValue(right, "living")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<TrainFront className="size-4" />} label="Student transport" note="Student products use source-native periods and eligibility rules; monthly and term products are not directly equivalent." left={cityValue(left, "transport")} right={cityValue(right, "transport")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<Clock3 className="size-4" />} label="Student work rule" note="National IRCC off-campus rule during regular academic sessions; this is not a city differentiator." left={cityValue(left, "work")} right={cityValue(right, "work")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<GraduationCap className="size-4" />} label="Published target programs" note="Public programs in CampCareer's reviewed Canada 80-career set; this is not each institution's full catalogue." left={cityValue(left, "programs")} right={cityValue(right, "programs")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<Building2 className="size-4" />} label="Institutions with published programs" note="Distinct institutions represented in the published target-program set." left={cityValue(left, "providers")} right={cityValue(right, "providers")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<MapPin className="size-4" />} label="Verified location records" note="Source-backed location links remain separate from program publication eligibility." left={cityValue(left, "locations")} right={cityValue(right, "locations")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<Users className="size-4" />} label="City population" note="Named-city / census-subdivision geography, not CMA population" left={cityValue(left, "population")} right={cityValue(right, "population")} leftName={left.name} rightName={right.name} />
        <ComparisonRow icon={<BriefcaseBusiness className="size-4" />} label="Career context" note="Official city economic guidance, not occupation-shortage rankings" left={left.employmentSectors.slice(0, 5).join(" · ")} right={right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#c2691e]">Living-cost signal</p>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{livingSignal}</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">Source scenarios differ by institution, so use this as a directional city signal rather than a guaranteed personal budget.</p>
        </article>
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">Published program coverage</p>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{programmeSignal}</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{left.name}: {leftPrograms.toLocaleString("en-CA")} · {right.name}: {rightPrograms.toLocaleString("en-CA")} published target-career programs.</p>
        </article>
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3e7a2e]">Target careers in both</p>
          <p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{sharedCareerSignal}</p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">This compares reviewed target-career coverage across published programs; it does not require the same program identity to exist in both cities.</p>
        </article>
      </div>

      <section className="mt-5 rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-[#1b1b1b]">How to use this comparison</h2>
        <p className="mt-2 max-w-4xl text-[12px] leading-5 text-[#5e6f91]">Use living, transport, local career context and published target-program coverage to choose the city environment that fits you. The work-hours row is a national rule, not a city differentiator. Then verify the actual institution, location, admission evidence and PGWP status before applying.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href={`/programs?country=CA&city=${left.slug}`} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#bfcff0] bg-white px-3.5 py-2.5 text-[11.5px] font-semibold text-[#2563eb] sm:w-auto sm:py-2">Browse {left.name} programs <ArrowRight className="size-3.5" /></Link>
          <Link href={`/programs?country=CA&city=${right.slug}`} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#cfd9ca] bg-white px-3.5 py-2.5 text-[11.5px] font-semibold text-[#3e7a2e] sm:w-auto sm:py-2">Browse {right.name} programs <ArrowRight className="size-3.5" /></Link>
        </div>
      </section>
    </div>
  )
}
