import Link from "next/link"
import { BadgeCheck, Building2, Clock3, GraduationCap, MapPin, ShieldCheck } from "lucide-react"
import { getCanonicalCareer } from "@/data/career-comparison-catalog"
import { institutionDetailPath } from "@/lib/institutions/institution-search"
import {
  caPgwpLabel,
  caPublicationEvidenceLabel,
  formatCaEvidenceDate,
} from "@/lib/programs/ca-program-presentation"
import type { CaProgramListItem } from "@/lib/programs/ca-programs.server"
import { caProgramDetailPath } from "@/lib/programs/program-search"
import { InstitutionLogo } from "./institution-logo"

function money(value: number | null) {
  if (value == null) return null
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value)
}

function duration(value: number | null) {
  if (value == null) return null
  if (value < 1) return `${Math.round(value * 12)} months`
  return `${new Intl.NumberFormat("en-CA", { maximumFractionDigits: 1 }).format(value)} ${
    value === 1 ? "year" : "years"
  }`
}

export function CaProgramCard({ program }: { program: CaProgramListItem }) {
  const tuition = money(program.tuitionFeeCad)
  const studyDuration = duration(program.durationYears)
  const location = [program.city, program.province].filter(Boolean).join(", ")
  const detailHref = caProgramDetailPath(program.id, program.title)
  const institutionHref = program.institutionSlug
    ? institutionDetailPath("CA", program.institutionSlug)
    : null
  const evidenceDate = formatCaEvidenceDate(program.verifiedAt)
  const careers = program.careerIds
    .map((id) => getCanonicalCareer(id))
    .filter((career): career is NonNullable<typeof career> => Boolean(career))

  return (
    <article className="group relative h-full cursor-pointer rounded-xl border border-[#e6e5e1] bg-white p-4 transition hover:border-[#bfcdb9] hover:shadow-[0_12px_30px_rgba(40,70,30,0.07)] focus-within:border-[#3e7a2e] focus-within:ring-4 focus-within:ring-[#3e7a2e]/15 sm:p-5">
      <Link
        href={detailHref}
        aria-label={`View ${program.title} at ${program.institutionName}`}
        className="absolute inset-0 z-10 rounded-xl outline-none"
      />

      <div className="pointer-events-none flex gap-4">
        <InstitutionLogo institutionName={program.institutionName} websiteUrl={program.institutionWebsite} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1.5">
                {program.credentialType && (
                  <span className="rounded-md bg-[#f3f3f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6c6963]">
                    {program.credentialType}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                    program.publicationTier === "A"
                      ? "bg-[#edf5ea] text-[#3e7a2e]"
                      : "bg-[#f5f3ee] text-[#786f60]"
                  }`}
                >
                  {program.publicationTier === "A" ? <BadgeCheck className="size-3" /> : <ShieldCheck className="size-3" />}
                  {caPublicationEvidenceLabel(program.publicationTier)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                    program.pgwpState === "eligible"
                      ? "bg-[#eef4ff] text-[#2563eb]"
                      : program.pgwpState === "ineligible"
                        ? "bg-[#fff2ee] text-[#b65c45]"
                        : "bg-[#f4f4f2] text-[#77746e]"
                  }`}
                >
                  <ShieldCheck className="size-3" /> {caPgwpLabel(program.pgwpState)}
                </span>
              </div>

              <h2 className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.015em] text-[#1b1b1b] transition group-hover:text-[#3e7a2e] sm:text-[17px]">
                {program.title}
              </h2>

              <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#5e5c57]">
                <Building2 className="size-3.5 shrink-0 text-[#9b9891]" />
                {institutionHref ? (
                  <Link
                    href={institutionHref}
                    className="pointer-events-auto relative z-20 truncate transition hover:text-[#3e7a2e] hover:underline"
                  >
                    {program.institutionName}
                  </Link>
                ) : (
                  <span className="truncate">{program.institutionName}</span>
                )}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
                {tuition ?? "Fee unavailable"}
              </p>
              {tuition && <p className="mt-0.5 text-[10.5px] text-[#9b9891]">published tuition · CAD</p>}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11.5px] text-[#76736d]">
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#a3a19b]" /> {location}
              </span>
            )}
            {studyDuration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-[#a3a19b]" /> {studyDuration}
              </span>
            )}
            {program.educationLevel && (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-[#a3a19b]" /> {program.educationLevel}
              </span>
            )}
            {program.dliNumber && (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#a3a19b]" /> DLI {program.dliNumber}
              </span>
            )}
          </div>

          {careers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {careers.slice(0, 4).map((career) => (
                <span key={career.id} className="rounded-full bg-[#f6f7f4] px-2.5 py-1 text-[10.5px] font-medium text-[#66645f]">
                  {career.label}
                </span>
              ))}
              {careers.length > 4 && (
                <span className="rounded-full bg-[#f6f7f4] px-2.5 py-1 text-[10.5px] font-medium text-[#8a8882]">
                  +{careers.length - 4} careers
                </span>
              )}
            </div>
          )}

          <div className="mt-4 border-t border-[#efeeea] pt-3">
            <p className="text-[10.5px] font-medium text-[#aaa7a0]">
              {evidenceDate ? `Evidence checked ${evidenceDate} · ` : ""}
              International admission and PGWP are evaluated separately
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
