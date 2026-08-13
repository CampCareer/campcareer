import Link from "next/link"
import { ArrowUpRight, Clock3, GraduationCap, Languages, MapPin, ShieldCheck } from "lucide-react"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import type { KrProgramSearchResult } from "@/lib/programs/kr-programs.server"
import { krProgramDetailPath } from "@/lib/programs/kr-program-seo"
import { buildProgramsUrl, type ProgramSearchFilters } from "@/lib/programs/program-search"
import { ProgramsSortControl } from "./programs-sort-control"

function durationLabel(months: number | null, locale: Locale) {
  if (!months) return null
  if (locale === "ko") return months % 12 === 0 ? `${months / 12}년` : `${months}개월`
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

function admissionLabel(status: string, verification: string, locale: Locale) {
  if (locale === "ko") {
    if (verification === "verified_program" && status === "open") return "지원 접수 중"
    if (status === "closed") return "확인된 모집 주기 종료"
    if (status === "restricted") return "지원 제한"
    return "국제학생 경로 검증 완료 · 현재 모집 여부 미확인"
  }
  if (verification === "verified_program" && status === "open") return "Applications open"
  if (status === "closed") return "Verified cycle closed"
  if (status === "restricted") return "Admission restricted"
  return "International pathway verified · current window not confirmed"
}

function Pagination({ filters, result, locale }: { filters: ProgramSearchFilters; result: KrProgramSearchResult; locale: Locale }) {
  if (result.pageCount <= 1) return null
  const href = (page: number) => localizePath(buildProgramsUrl(filters, { page }), locale)
  return <nav aria-label={locale === "ko" ? "한국 과정 결과 페이지" : "South Korea program pages"} className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">
    {result.page > 1 ? <Link href={href(result.page - 1)} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] hover:text-[#3e7a2e]">{locale === "ko" ? "이전" : "Previous"}</Link> : <span />}
    <p className="text-[11.5px] font-medium text-[#8f8c85]">{locale === "ko" ? `${result.page} / ${result.pageCount}페이지` : `Page ${result.page} of ${result.pageCount}`}</p>
    {result.page < result.pageCount ? <Link href={href(result.page + 1)} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white">{locale === "ko" ? "다음" : "Next"}</Link> : <span />}
  </nav>
}

export async function KrProgramsExplorer({ filters, result }: { filters: ProgramSearchFilters; result: KrProgramSearchResult }) {
  const locale = await getLocale()
  const ko = locale === "ko"
  return <section className="mt-7 min-w-0">
    <div className="mb-4 rounded-xl border border-[#d9e3f7] bg-[#f7f9ff] px-4 py-3 text-[11.5px] leading-5 text-[#5f6470]">
      {ko ? <>한국 과정은 대한민국 정부·국립국제교육원의 <strong>Study in Korea</strong> 국제 학위과정 목록을 주요 공개 출처로 사용합니다. 학과가 목록에 있다는 것은 국제학생 학업 경로가 있다는 근거이지만, <strong>현재 지원 접수 중이라는 뜻이나 과정 인증을 보장하는 것은 아닙니다.</strong></> : <>South Korea programs use the Korean Government/NIIED <strong>Study in Korea</strong> international degree-seeking listings as the primary publication source. Department listing supports an international-study pathway, but it is <strong>not</strong> treated as proof that applications are open today or as a programme-accreditation claim.</>}
    </div>
    <ProgramsSortControl filters={filters} total={result.total} />
    {result.programs.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center"><GraduationCap className="mx-auto size-6 text-[#3e7a2e]" /><h2 className="mt-3 text-[16px] font-semibold">{ko ? "검색 조건에 맞는 한국 과정이 없습니다" : "No South Korea programs match this search"}</h2><Link href={localizePath("/programs?country=KR", locale)} className="mt-3 inline-block text-[12px] font-semibold text-[#3e7a2e] hover:underline">{ko ? "검색 초기화" : "Clear search"}</Link></div> : <div className="mt-3 space-y-3">
      {result.programs.map((program) => {
        const duration = durationLabel(program.durationMonths, locale)
        const detailPath = localizePath(krProgramDetailPath(program.slug), locale)
        return <article key={program.id} className="rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#cfd9ca] hover:shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold">
            <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]">{program.degreeLevel}</span>
            <span className={program.verificationTier === "A" ? "inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[#2563eb]" : "inline-flex items-center gap-1 rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[#686660]"}><ShieldCheck className="size-3" />{program.verificationTier === "A" ? (ko ? "Tier A 출처 검증" : "Tier A source verified") : (ko ? "Study in Korea 검증" : "Study in Korea verified")}</span>
            <span className="rounded-full bg-[#f7f9ff] px-2.5 py-1 text-[#315f9f]">{admissionLabel(program.internationalAdmissionStatus, program.admissionVerificationStatus, locale)}</span>
          </div>
          <Link href={detailPath} className="mt-3 block text-[17px] font-semibold leading-6 tracking-[-0.01em] text-[#1b1b1b] hover:text-[#3e7a2e]">{program.title}</Link>
          {program.sourceDepartmentName && program.sourceDepartmentName !== program.title && <p className="mt-1 text-[11px] text-[#8f8c85]">{ko ? "출처 학과명" : "Source department"}: {program.sourceDepartmentName}</p>}
          <p className="mt-1.5 text-[12.5px] font-medium text-[#65625c]">{program.institutionName}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-[#77746e]">
            {program.city && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{program.city}</span>}
            {duration && <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{duration}</span>}
            {program.englishCourseRatio && <span className="inline-flex items-center gap-1.5"><Languages className="size-3.5" />{ko ? "영어 강의" : "English courses"} {program.englishCourseRatio}</span>}
            {program.affiliation && <span>{program.affiliation}</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4"><Link href={detailPath} className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">{ko ? "과정 보기" : "View program"}</Link><a href={program.studyInKoreaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]">{ko ? "Study in Korea 출처" : "Study in Korea source"} <ArrowUpRight className="size-3" /></a></div>
        </article>
      })}
    </div>}
    <Pagination filters={filters} result={result} locale={locale} />
    <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">{ko ? "첫 카탈로그에는 출처 검증을 마친 한국 과정 185개가 공개되어 있으며, 수동 검토한 교육 연결을 기준으로 CampCareer 80개 직업군 중 72개를 다룹니다. 관련 과정이 확인되지 않은 직업은 억지로 무관한 대학 학위에 연결하지 않고 데이터 공백으로 남깁니다." : "185 source-verified South Korea programs are published in this first catalog, with 72/80 CampCareer career categories covered by manually reviewed education links. Bricklaying, carpentry, electrician, midwifery, plumbing, truck driving, tiling and welding remain gaps rather than being forced onto unrelated university degrees."}</p>
  </section>
}
