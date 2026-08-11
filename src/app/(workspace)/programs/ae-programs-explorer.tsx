import Link from "next/link"
import { ArrowUpRight, CalendarClock, GraduationCap, MapPin, ShieldCheck } from "lucide-react"
import type { AeProgramSearchResult } from "@/lib/programs/ae-programs.server"
import { aeProgramDetailPath } from "@/lib/programs/ae-program-seo"
import { buildProgramsUrl, type ProgramSearchFilters } from "@/lib/programs/program-search"
import { ProgramsSortControl } from "./programs-sort-control"

function admissionLabel(status: string, verified: string) {
  if (verified !== "verified") return "Admission not yet verified"
  if (status === "open") return "International applications open"
  if (status === "closed") return "Current application cycle closed"
  if (status === "restricted") return "International admission restricted"
  if (status === "not_yet_open") return "Next cycle not yet open"
  return "International schedule not confirmed"
}

function admissionClass(status: string, verified: string) {
  if (verified !== "verified") return "bg-[#f4f3ef] text-[#77746e]"
  if (status === "open") return "bg-[#edf5ea] text-[#3e7a2e]"
  if (status === "closed" || status === "restricted") return "bg-[#fff3ef] text-[#a14d37]"
  return "bg-[#eef4ff] text-[#2563eb]"
}

function durationLabel(months: number | null) {
  if (!months) return null
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

function moneyLabel(value: number | null) {
  if (value == null) return null
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(value)
}

function Pagination({ filters, result }: { filters: ProgramSearchFilters; result: AeProgramSearchResult }) {
  if (result.pageCount <= 1) return null
  return (
    <nav aria-label="UAE program pages" className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">
      {result.page > 1 ? <Link href={buildProgramsUrl(filters, { page: result.page - 1 })} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] hover:text-[#3e7a2e]">Previous</Link> : <span />}
      <p className="text-[11.5px] font-medium text-[#8f8c85]">Page {result.page} of {result.pageCount}</p>
      {result.page < result.pageCount ? <Link href={buildProgramsUrl(filters, { page: result.page + 1 })} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white">Next</Link> : <span />}
    </nav>
  )
}

export function AeProgramsExplorer({ filters, result }: { filters: ProgramSearchFilters; result: AeProgramSearchResult }) {
  return (
    <section className="mt-7 min-w-0">
      <div className="mb-4 rounded-xl border border-[#dfe6dc] bg-[#f7faf5] px-4 py-3 text-[11.5px] leading-5 text-[#686660]">
        UAE catalogue status is split deliberately: <strong>accreditation</strong> confirms that a program exists, while <strong>international admission</strong> is verified separately. An active CAA record never implies applications are open.
      </div>
      <ProgramsSortControl filters={filters} total={result.total} />
      {result.programs.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center">
          <GraduationCap className="mx-auto size-6 text-[#3e7a2e]" />
          <h2 className="mt-3 text-[16px] font-semibold">No UAE programs match this search</h2>
          <Link href="/programs?country=AE" className="mt-3 inline-block text-[12px] font-semibold text-[#3e7a2e] hover:underline">Clear search</Link>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {result.programs.map((program) => {
            const duration = durationLabel(program.durationMonths)
            const tuition = moneyLabel(program.tuitionFeeAed)
            return (
              <article key={program.id} className="rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#cfd9ca] hover:shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold">
                  {program.credentialType && <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]">{program.credentialType}</span>}
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />{program.verificationTier === "A" ? "Tier A source verified" : "Registry verified"}</span>
                  <span className={`rounded-full px-2.5 py-1 ${admissionClass(program.internationalAdmissionStatus, program.admissionVerificationStatus)}`}>{admissionLabel(program.internationalAdmissionStatus, program.admissionVerificationStatus)}</span>
                </div>
                <Link href={aeProgramDetailPath(program.slug)} className="mt-3 block text-[17px] font-semibold leading-6 tracking-[-0.01em] text-[#1b1b1b] hover:text-[#3e7a2e]">{program.title}</Link>
                <p className="mt-1.5 text-[12.5px] font-medium text-[#65625c]">{program.institutionName}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-[#77746e]">
                  {(program.city || program.emirate) && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{[program.city, program.emirate].filter((value, index, all) => value && all.indexOf(value) === index).join(", ")}</span>}
                  {program.programmeLevel && <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-3.5" />{program.programmeLevel}</span>}
                  {duration && <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" />{duration}</span>}
                  {tuition && <span>{tuition}</span>}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Link href={aeProgramDetailPath(program.slug)} className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">View program</Link>
                  {program.officialProgramUrl && <a href={program.officialProgramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]">Official source <ArrowUpRight className="size-3" /></a>}
                </div>
              </article>
            )
          })}
        </div>
      )}
      <Pagination filters={filters} result={result} />
      <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">108 active source-verified programs are currently published for the UAE. 69 of the 80 CampCareer target careers have manually approved education links. Trade gaps remain unpublished where a recognized current UAE training source has not yet been verified.</p>
    </section>
  )
}
