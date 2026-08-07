import Link from "next/link"
import {
  BadgeCheck,
  Building2,
  Clock3,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { InstitutionLogo } from "./institution-logo"
import type { AuProgramListItem } from "@/lib/programs/au-programs.server"
import { getProgramDiscipline } from "@/lib/programs/program-discipline"
import { programDetailPath } from "@/lib/programs/program-search"

function money(value: number | null) {
  if (value == null) return null
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value)
}

function duration(value: number | null) {
  if (value == null) return null
  if (value < 1) return `${Math.round(value * 12)} months`
  return `${new Intl.NumberFormat("en-AU", { maximumFractionDigits: 1 }).format(value)} ${
    value === 1 ? "year" : "years"
  }`
}

function programLocation(program: AuProgramListItem) {
  if (program.deliveryLocations.length > 0) {
    const cityNames = [
      program.verifiedCitySlugs.includes("sydney") ? "Sydney" : null,
      program.verifiedCitySlugs.includes("melbourne") ? "Melbourne" : null,
      program.verifiedCitySlugs.includes("brisbane") ? "Brisbane" : null,
    ].filter((value): value is string => Boolean(value))

    if (cityNames.length > 0) {
      return `${cityNames.join(" & ")} · ${program.deliveryLocations.length} registered ${
        program.deliveryLocations.length === 1 ? "location" : "locations"
      }`
    }

    const first = program.deliveryLocations[0]
    const primary = [first.locality, first.state].filter(Boolean).join(", ") || first.locationName
    const extra = program.deliveryLocations.length - 1
    return extra > 0 ? `${primary} + ${extra} registered ${extra === 1 ? "location" : "locations"}` : primary
  }

  return [program.city, program.state].filter(Boolean).join(", ")
}

export function ProgramCard({ program }: { program: AuProgramListItem }) {
  const tuition = money(program.tuitionFeeAud)
  const studyDuration = duration(program.durationYears)
  const location = programLocation(program)
  const detailHref = programDetailPath(program.id, program.title)
  const verified = program.officialUrlStatus === "verified"
  const locationVerified = program.deliveryLocations.length > 0
  const discipline = getProgramDiscipline({
    title: program.title,
    fieldName: program.fieldName,
    broadField: program.broadField,
  })

  return (
    <article className="group relative h-full cursor-pointer rounded-xl border border-[#e6e5e1] bg-white p-4 transition hover:border-[#bfcdb9] hover:shadow-[0_12px_30px_rgba(40,70,30,0.07)] focus-within:border-[#3e7a2e] focus-within:ring-4 focus-within:ring-[#3e7a2e]/15 sm:p-5">
      <Link
        href={detailHref}
        aria-label={`View ${program.title} at ${program.institutionName}`}
        className="absolute inset-0 z-10 rounded-xl outline-none"
      />

      <div className="pointer-events-none flex gap-4">
        <InstitutionLogo
          institutionName={program.institutionName}
          websiteUrl={program.institutionWebsite}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1.5">
                {program.courseType && (
                  <span className="rounded-md bg-[#f3f3f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6c6963]">
                    {program.courseType}
                  </span>
                )}
                {verified && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#edf5ea] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3e7a2e]">
                    <BadgeCheck className="size-3" />
                    Official page verified
                  </span>
                )}
                {locationVerified && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#eef4ff] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2563eb]">
                    <MapPin className="size-3" />
                    CRICOS location verified
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.015em] text-[#1b1b1b] transition group-hover:text-[#3e7a2e] sm:text-[17px]">
                {program.title}
              </h2>

              <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#5e5c57]">
                <Building2 className="size-3.5 shrink-0 text-[#9b9891]" />
                <span className="truncate">{program.institutionName}</span>
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
                {tuition ?? "Fee unavailable"}
              </p>
              {tuition && <p className="mt-0.5 text-[10.5px] text-[#9b9891]">estimated annual tuition</p>}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11.5px] text-[#76736d]">
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#a3a19b]" />
                {location}
              </span>
            )}
            {studyDuration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-[#a3a19b]" />
                {studyDuration}
              </span>
            )}
            {program.aqfLevel != null && (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-[#a3a19b]" />
                AQF level {program.aqfLevel}
              </span>
            )}
            {program.cricosCode && (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#a3a19b]" />
                Provider {program.cricosCode}
              </span>
            )}
          </div>

          {(program.fieldName || program.broadField) && (
            <p className="mt-3 line-clamp-2 text-[12.5px] leading-5 text-[#74716b]">
              <span aria-hidden="true" className="mr-1.5 text-[13px]">
                {discipline.emoji}
              </span>
              {program.fieldName ?? program.broadField}
            </p>
          )}

          <div className="mt-4 border-t border-[#efeeea] pt-3">
            <p className="text-[10.5px] font-medium text-[#aaa7a0]">
              {locationVerified ? "Official CRICOS delivery locations synced" : "Active CRICOS record · location review pending"}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
