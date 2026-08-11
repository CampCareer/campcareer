import Link from "next/link"
import { ArrowUpRight, Clock3, GraduationCap, Languages, MapPin, ShieldCheck } from "lucide-react"
import type { KrProgramSearchResult } from "@/lib/programs/kr-programs.server"
import { krProgramDetailPath } from "@/lib/programs/kr-program-seo"
import { buildProgramsUrl, type ProgramSearchFilters } from "@/lib/programs/program-search"
import { ProgramsSortControl } from "./programs-sort-control"

function durationLabel(months: number | null) {
  if (!months) return null
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

function admissionLabel(status: string, verification: string) {
  if (verification === "verified_program" && status === "open") return "Applications open"
  if (status === "closed") return "Verified cycle closed"
  if (status === "restricted") return "Admission restricted"
  return "International pathway verified · current window not confirmed"
}

function Pagination({ filters, result }: { filters: ProgramSearchFilters; result: KrProgramSearchResult }) {
  if (result.pageCount <= 1) return null
  return <nav aria-label="South Korea program pages" className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">
    {result.page > 1 ? <Link href={buildProgramsUrl(filters, { page: result.page - 1 })} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] hover:text-[#3e7a2e]">Previous</Link> : <span />}
    <p className="text-[11.5px] font-medium text-[#8f8c85]">Page {result.page} of {result.pageCount}</p>
    {result.page < result.pageCount ? <Link href={buildProgramsUrl(filters, { page: result.page + 1 })} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white">Next</Link> : <span />}
  </nav>
}

export function KrProgramsExplorer({ filters, result }: { filters: ProgramSearchFilters; result: KrProgramSearchResult }) {
  return <section className="mt-7 min-w-0">
    <div className="mb-4 rounded-xl border border-[#d9e3f7] bg-[#f7f9ff] px-4 py-3 text-[11.5px] leading-5 text-[#5f6470]">
      South Korea programs use the Korean Government/NIIED <strong>Study in Korea</strong> international degree-seeking listings as the primary publication source. Department listing supports an international-study pathway, but it is <strong>not</strong> treated as proof that applications are open today or as a programme-accreditation claim.
    </div>
    <ProgramsSortControl filters={filters} total={result.total} />
    {result.programs.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center"><GraduationCap className="mx-auto size-6 text-[#3e7a2e]" /><h2 className="mt-3 text-[16px] font-semibold">No South Korea programs match this search</h2><Link href="/programs?country=KR" className="mt-3 inline-block text-[12px] font-semibold text-[#3e7a2e] hover:underline">Clear search</Link></div> : <div className="mt-3 space-y-3">
      {result.programs.map((program) => {
        const duration = durationLabel(program.durationMonths)
        return <article key={program.id} className="rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#cfd9ca] hover:shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold">
            <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]">{program.degreeLevel}</span>
            <span className={program.verificationTier === "A" ? "inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[#2563eb]" : "inline-flex items-center gap-1 rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]"}><ShieldCheck className="size-3" />{program.verificationTier === "A" ? "Tier A source verified" : "Study in Korea verified"}</span>
            <span className="rounded-full bg-[#f7f9ff] px-2.5 py-1 text-[#315f9f]">{admissionLabel(program.internationalAdmissionStatus, program.admissionVerificationStatus)}</span>
          </div>
          <Link href={krProgramDetailPath(program.slug)} className="mt-3 block text-[17px] font-semibold leading-6 tracking-[-0.01em] text-[#1b1b1b] hover:text-[#3e7a2e]">{program.title}</Link>
          {program.sourceDepartmentName && program.sourceDepartmentName !== program.title && <p className="mt-1 text-[11px] text-[#8f8c85]">Source department: {program.sourceDepartmentName}</p>}
          <p className="mt-1.5 text-[12.5px] font-medium text-[#65625c]">{program.institutionName}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-[#77746e]">
            {program.city && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{program.city}</span>}
            {duration && <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{duration}</span>}
            {program.englishCourseRatio && <span className="inline-flex items-center gap-1.5"><Languages className="size-3.5" />English courses {program.englishCourseRatio}</span>}
            {program.affiliation && <span>{program.affiliation}</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4"><Link href={krProgramDetailPath(program.slug)} className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">View program</Link><a href={program.studyInKoreaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]">Study in Korea source <ArrowUpRight className="size-3" /></a></div>
        </article>
      })}
    </div>}
    <Pagination filters={filters} result={result} />
    <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">185 source-verified South Korea programs are published in this first catalog, with 72/80 CampCareer career categories covered by manually reviewed education links. Bricklaying, carpentry, electrician, midwifery, plumbing, truck driving, tiling and welding remain gaps rather than being forced onto unrelated university degrees.</p>
  </section>
}
