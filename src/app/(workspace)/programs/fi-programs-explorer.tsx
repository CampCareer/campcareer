import Link from "next/link"
import { CalendarClock, GraduationCap, Languages, MapPin, ShieldCheck } from "lucide-react"
import type { FiProgramSearchResult } from "@/lib/programs/fi-programs.server"
import { fiProgramDetailPath } from "@/lib/programs/fi-program-seo"
import { buildProgramsUrl, type ProgramSearchFilters } from "@/lib/programs/program-search"
import { ProgramsSortControl } from "./programs-sort-control"

function admissionLabel(status: string, verified: string) {
  if (verified === "unverified" || verified === "stale" || verified === "rejected") return "Current admission not verified"
  if (status === "open") return "International applications open"
  if (status === "closed") return "Verified cycle closed"
  if (status === "restricted") return "International admission restricted"
  if (status === "not_yet_open") return "Next cycle not yet open"
  return "International pathway verified · current window unknown"
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
function Pagination({ filters, result }: { filters: ProgramSearchFilters; result: FiProgramSearchResult }) {
  if (result.pageCount <= 1) return null
  return <nav aria-label="Finland program pages" className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">
    {result.page > 1 ? <Link href={buildProgramsUrl(filters, { page: result.page - 1 })} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48]">Previous</Link> : <span />}
    <p className="text-[11.5px] font-medium text-[#8f8c85]">Page {result.page} of {result.pageCount}</p>
    {result.page < result.pageCount ? <Link href={buildProgramsUrl(filters, { page: result.page + 1 })} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white">Next</Link> : <span />}
  </nav>
}

export function FiProgramsExplorer({ filters, result }: { filters: ProgramSearchFilters; result: FiProgramSearchResult }) {
  return <section className="mt-7 min-w-0">
    <ProgramsSortControl filters={filters} total={result.total} />
    <div className="mt-3 space-y-3">
      {result.programs.map((program) => <Link key={program.id} href={fiProgramDetailPath(program.slug)} className="block rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#b9cdb2] hover:shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold">
          <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]">{program.degreeLevel}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />Official university source verified</span>
          <span className={`rounded-full px-2.5 py-1 ${admissionClass(program.internationalAdmissionStatus)}`}>{admissionLabel(program.internationalAdmissionStatus, program.admissionVerificationStatus)}</span>
        </div>
        <h2 className="mt-3 text-[17px] font-semibold tracking-[-0.015em] text-[#1b1b1b]">{program.title}</h2>
        <p className="mt-1 text-[12.5px] font-medium text-[#585650]">{program.institutionName}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-[#77746e]">
          {program.city && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{program.city}</span>}
          {program.languageContext && <span className="inline-flex items-center gap-1.5"><Languages className="size-3.5" />{program.languageContext}</span>}
          {durationLabel(program.durationMonths) && <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-3.5" />{durationLabel(program.durationMonths)}</span>}
          {program.intakeLabel && <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" />{program.intakeLabel}</span>}
        </div>
        {program.fieldCategory && <p className="mt-3 text-[11px] text-[#99968f]">{program.fieldCategory}</p>}
      </Link>)}
    </div>
    {result.programs.length === 0 && <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center text-[13px] text-[#77746e]">No Finland programs match these filters.</div>}
    <Pagination filters={filters} result={result} />
    <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Finland programme existence is verified from current official university listings. Studyinfo/institution admission windows are tracked separately, and institutional quality assurance is not represented as programme-level accreditation.</p>
  </section>
}
