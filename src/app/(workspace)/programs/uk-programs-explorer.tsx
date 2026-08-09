import Link from "next/link"
import { CalendarClock, GraduationCap, ShieldCheck } from "lucide-react"
import type { UkProgramSearchResult } from "@/lib/programs/uk-programs.server"
import { ukProgramDetailPath } from "@/lib/programs/uk-program-seo"
import { buildProgramsUrl, type ProgramSearchFilters } from "@/lib/programs/program-search"
import { ProgramsSortControl } from "./programs-sort-control"

function admissionLabel(status: string) {
  if (status === "open") return "Applications open"
  if (status === "closed") return "Verified cycle closed"
  if (status === "not_yet_open") return "Next cycle not yet open"
  if (status === "restricted") return "Applicant restrictions apply"
  return "Current application window not confirmed"
}

function admissionClass(status: string) {
  if (status === "open") return "bg-[#edf5ea] text-[#3e7a2e]"
  if (status === "closed" || status === "restricted") return "bg-[#fff3ef] text-[#a14d37]"
  return "bg-[#eef4ff] text-[#2563eb]"
}

function durationLabel(months: number | null) {
  if (!months) return null
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

function levelLabel(level: string | null, qualification: string | null) {
  if (qualification) return qualification
  if (!level) return "Programme"
  return level.toLowerCase().replaceAll("_", " ")
}

function Pagination({ filters, result }: { filters: ProgramSearchFilters; result: UkProgramSearchResult }) {
  if (result.pageCount <= 1) return null
  return (
    <nav aria-label="UK programme pages" className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">
      {result.page > 1 ? (
        <Link href={buildProgramsUrl(filters, { page: result.page - 1 })} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48]">Previous</Link>
      ) : <span />}
      <p className="text-[11.5px] font-medium text-[#8f8c85]">Page {result.page} of {result.pageCount}</p>
      {result.page < result.pageCount ? (
        <Link href={buildProgramsUrl(filters, { page: result.page + 1 })} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white">Next</Link>
      ) : <span />}
    </nav>
  )
}

export function UkProgramsExplorer({ filters, result }: { filters: ProgramSearchFilters; result: UkProgramSearchResult }) {
  return (
    <section className="mt-7 min-w-0">
      <ProgramsSortControl filters={filters} total={result.total} availableSorts={["recommended", "duration-short", "title"]} />
      <div className="mt-3 space-y-3">
        {result.programs.map((program) => (
          <Link key={program.id} href={ukProgramDetailPath(program.slug)} className="block rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#b9cdb2] hover:shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold">
              <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]">{levelLabel(program.canonicalLevel, program.qualificationTitle)}</span>
              {program.indexable ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />Source verified</span>
              ) : (
                <span className="rounded-full bg-[#faf4e8] px-2.5 py-1 text-[#8a651f]">Eligibility review needed</span>
              )}
              <span className={`rounded-full px-2.5 py-1 ${admissionClass(program.admissionState)}`}>{admissionLabel(program.admissionState)}</span>
            </div>
            <h2 className="mt-3 text-[17px] font-semibold tracking-[-0.015em] text-[#1b1b1b]">{program.title}</h2>
            <p className="mt-1 text-[12.5px] font-medium text-[#585650]">{program.institutionName}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-[#77746e]">
              {durationLabel(program.durationMonths) && <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-3.5" />{durationLabel(program.durationMonths)}</span>}
              {program.studyMode && <span>{program.studyMode}</span>}
              {program.intakeLabel && <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" />{program.intakeLabel}</span>}
            </div>
            {program.fieldName && <p className="mt-3 text-[11px] text-[#99968f]">{program.fieldName}</p>}
            {program.careerIds.length > 0 && <p className="mt-2 text-[10.5px] text-[#aaa7a0]">Related careers: {program.careerIds.slice(0, 4).map((id) => id.replaceAll("-", " ")).join(" · ")}{program.careerIds.length > 4 ? " · more" : ""}</p>}
          </Link>
        ))}
      </div>
      {result.programs.length === 0 && <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center text-[13px] text-[#77746e]">No UK programmes match these filters.</div>}
      <Pagination filters={filters} result={result} />
      <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Programme existence, Student sponsor evidence, international-student eligibility and the current application window are tracked separately. Campus and city are not shown unless programme-level evidence supports them.</p>
    </section>
  )
}
