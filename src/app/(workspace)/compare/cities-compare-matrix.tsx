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
import type { AuCityProfile } from "@/lib/cities/au-city-profile.server"

type CitiesCompareMatrixProps = {
  sydney: AuCityProfile
  melbourne: AuCityProfile
  sharedProgramCount: number
}

function money(value: number, decimals = 0) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number) {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

function cityValue(
  profile: AuCityProfile,
  kind: "living" | "transport" | "work" | "population" | "programs" | "providers" | "locations",
) {
  if (kind === "living") {
    return profile.livingCost
      ? `${money(profile.livingCost.low)}–${money(profile.livingCost.high)} / month`
      : "—"
  }
  if (kind === "transport") {
    return profile.transport
      ? `${money(profile.transport.weeklyReference, profile.transport.weeklyReference < 20 ? 2 : 0)} / week`
      : "—"
  }
  if (kind === "work") {
    return profile.workRights ? `${profile.workRights.hoursPerFortnight} h / fortnight` : "—"
  }
  if (kind === "population") return profile.population ? compact(profile.population.amount) : "—"
  if (kind === "programs") return profile.verifiedProgramCount.toLocaleString("en-AU")
  if (kind === "providers") return profile.linkedInstitutionCount.toLocaleString("en-AU")
  return profile.linkedCampusCount.toLocaleString("en-AU")
}

function ComparisonRow({
  label,
  left,
  right,
  note,
  icon,
}: {
  label: string
  left: string
  right: string
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
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">
          Sydney
        </span>
        {left}
      </div>
      <div className="border-t border-[#f0efec] px-4 py-4 text-[14px] font-semibold text-[#1b1b1b] md:border-l md:border-t-0 md:px-5">
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">
          Melbourne
        </span>
        {right}
      </div>
    </div>
  )
}

function CityHeader({ city }: { city: AuCityProfile }) {
  return (
    <div className="px-4 py-5 md:px-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">
        {city.regionName}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">{city.name}</h2>
        <Link
          href={`/cities/au/${city.slug}`}
          className="text-[11px] font-semibold text-[#2563eb] hover:underline"
        >
          City profile →
        </Link>
      </div>
    </div>
  )
}

export function CitiesCompareMatrix({
  sydney,
  melbourne,
  sharedProgramCount,
}: CitiesCompareMatrixProps) {
  const lowerLiving =
    sydney.livingCost && melbourne.livingCost
      ? (sydney.livingCost.low + sydney.livingCost.high) / 2 <
        (melbourne.livingCost.low + melbourne.livingCost.high) / 2
        ? "Sydney"
        : "Melbourne"
      : null
  const morePrograms =
    sydney.verifiedProgramCount >= melbourne.verifiedProgramCount ? "Sydney" : "Melbourne"

  return (
    <div className="w-full">
      <header className="rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f5f9f3] via-white to-[#eef4ff] p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">
          City comparison
        </p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">
          Sydney vs Melbourne
        </h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">
          Compare international-student living context with official CRICOS delivery locations. Program
          counts are city-specific registered offerings, not institution-headquarter estimates.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/programs?country=AU&city=sydney"
            className="rounded-lg bg-[#2563eb] px-3.5 py-2 text-[11.5px] font-semibold text-white"
          >
            Sydney programs
          </Link>
          <Link
            href="/programs?country=AU&city=melbourne"
            className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[11.5px] font-semibold text-white"
          >
            Melbourne programs
          </Link>
        </div>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
        <div className="grid md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="hidden md:block" />
          <div className="border-l border-[#ecebe7]">
            <CityHeader city={sydney} />
          </div>
          <div className="border-l border-[#ecebe7]">
            <CityHeader city={melbourne} />
          </div>
        </div>
        <ComparisonRow
          icon={<Wallet className="size-4" />}
          label="Student living"
          note="Indicative monthly range · tuition excluded"
          left={cityValue(sydney, "living")}
          right={cityValue(melbourne, "living")}
        />
        <ComparisonRow
          icon={<TrainFront className="size-4" />}
          label="Transport reference"
          note="Not directly equivalent: Sydney is a full-fare weekly cap; Melbourne is an eligible 365-day international-student pass divided by 52."
          left={cityValue(sydney, "transport")}
          right={cityValue(melbourne, "transport")}
        />
        <ComparisonRow
          icon={<Clock3 className="size-4" />}
          label="Student work rule"
          note="National student-visa work-hours rule during study periods"
          left={cityValue(sydney, "work")}
          right={cityValue(melbourne, "work")}
        />
        <ComparisonRow
          icon={<GraduationCap className="size-4" />}
          label="Verified CRICOS programs"
          note="Active programs with at least one registered delivery location in the city"
          left={cityValue(sydney, "programs")}
          right={cityValue(melbourne, "programs")}
        />
        <ComparisonRow
          icon={<Building2 className="size-4" />}
          label="Registered providers"
          left={cityValue(sydney, "providers")}
          right={cityValue(melbourne, "providers")}
        />
        <ComparisonRow
          icon={<MapPin className="size-4" />}
          label="Registered locations"
          left={cityValue(sydney, "locations")}
          right={cityValue(melbourne, "locations")}
        />
        <ComparisonRow
          icon={<Users className="size-4" />}
          label="Metro population"
          note="ABS Greater Capital City Statistical Area"
          left={cityValue(sydney, "population")}
          right={cityValue(melbourne, "population")}
        />
        <ComparisonRow
          icon={<BriefcaseBusiness className="size-4" />}
          label="Career context"
          note="Official study-destination guidance, not shortage rankings"
          left={sydney.employmentSectors.slice(0, 4).join(" · ")}
          right={melbourne.employmentSectors.slice(0, 5).join(" · ")}
        />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#c2691e]">
            Living-cost signal
          </p>
          <p className="mt-2 text-[18px] font-semibold text-[#1b1b1b]">
            {lowerLiving ? `${lowerLiving} has the lower current midpoint` : "Compare the published ranges"}
          </p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
            This is an indicative source comparison, not a guaranteed personal budget. Melbourne&apos;s
            monthly range is calculated from Monash&apos;s annual range.
          </p>
        </article>
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">
            Program breadth
          </p>
          <p className="mt-2 text-[18px] font-semibold text-[#1b1b1b]">
            {morePrograms} currently has more verified programs
          </p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
            Sydney: {sydney.verifiedProgramCount.toLocaleString("en-AU")} · Melbourne:{" "}
            {melbourne.verifiedProgramCount.toLocaleString("en-AU")} active CRICOS programs.
          </p>
        </article>
        <article className="rounded-xl border border-[#e7e6e3] bg-white p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3e7a2e]">
            Available in both
          </p>
          <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[#1b1b1b]">
            {sharedProgramCount.toLocaleString("en-AU")}
          </p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">
            Active programs currently registered at delivery locations in both Greater Sydney and Greater
            Melbourne.
          </p>
        </article>
      </div>

      <section className="mt-5 rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-[#1b1b1b]">How to use this comparison</h2>
        <p className="mt-2 max-w-4xl text-[12px] leading-5 text-[#5e6f91]">
          Start with the city context, then filter the actual programs you are considering. Work-hour rules
          are national, while living costs and transport products differ by source and eligibility. The next
          meaningful comparison is program-by-program tuition, duration and campus location within these cities.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/cities/au/sydney"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#bfcff0] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#2563eb]"
          >
            View Sydney <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/cities/au/melbourne"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#cfd9ca] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#3e7a2e]"
          >
            View Melbourne <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
