import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck, Clock3, ExternalLink, GraduationCap, MapPin, ShieldCheck } from "lucide-react"
import { getStudyConcept } from "@/data/study-concepts"
import {
  getOfficialCourseRegistry,
  getVerifiedCourseOfferings,
} from "@/lib/study-product/course-offerings"

export const revalidate = 3600

const COUNTRY_NAMES: Record<string, string> = {
  au: "Australia",
  us: "United States",
  ca: "Canada",
  uk: "United Kingdom",
  ie: "Ireland",
  de: "Germany",
  nl: "Netherlands",
  be: "Belgium",
}

export async function generateMetadata(props: { params: Promise<{ concept: string; country: string }> }): Promise<Metadata> {
  const params = await props.params;
  const concept = getStudyConcept(params.concept)
  const country = COUNTRY_NAMES[params.country.toLowerCase()]
  if (!concept || !country) return {}
  const title = `${concept.label} courses in ${country}`
  const description = `Compare source-verified ${concept.label} courses in ${country}, including qualification, duration, tuition and official registration links.`
  return {
    title,
    description,
    alternates: { canonical: `/study-options/${concept.slug}/${params.country.toLowerCase()}` },
    openGraph: { title, description, url: `/study-options/${concept.slug}/${params.country.toLowerCase()}` },
  }
}

export default async function StudyOptionsPage(
  props: {
    params: Promise<{ concept: string; country: string }>
    searchParams: Promise<{ locale?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const concept = getStudyConcept(params.concept)
  const countryCode = params.country.toUpperCase()
  const countryName = COUNTRY_NAMES[params.country.toLowerCase()]
  if (!concept || !countryName) notFound()

  const isKo = searchParams.locale === "ko-KR"
  const offerings = await getVerifiedCourseOfferings(concept.id, countryCode, 20)
  const registry = getOfficialCourseRegistry(countryCode)

  return (
    <div className="bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <Link href={isKo ? "/ko" : "/"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />{isKo ? "비교 결과로 돌아가기" : "Back to comparison"}
          </Link>
          <div className="mt-7 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-blue-600">{countryName} · {concept.kind.replaceAll("_", " ")}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                {isKo ? `${countryName} ${concept.labelKo} 과정` : `${concept.label} courses in ${countryName}`}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {isKo
                  ? "공식 등록부에서 현재 확인 가능한 과정만 보여드립니다. 실제 입학 가능 여부와 intake는 교육기관에서 다시 확인하세요."
                  : "Only offerings that can be traced to an official registry are shown. Confirm current admission eligibility and intake directly with the provider."}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <BadgeCheck className="h-5 w-5" />
              {offerings.length} {isKo ? "개 검증 과정" : "verified offerings"}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {offerings.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {offerings.map((course) => (
              <article key={course.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{course.qualificationLevel ?? (isKo ? "과정" : "Course")}</p>
                    <h2 className="mt-2 text-xl font-bold leading-7 text-slate-950">{course.title}</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{course.providerName}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <CourseFact icon={GraduationCap} label={isKo ? "공식 코드" : "Official code"} value={course.courseCode ?? "—"} />
                  <CourseFact icon={Clock3} label={isKo ? "기간" : "Duration"} value={course.durationMonths ? `${course.durationMonths} months` : (isKo ? "기관 확인" : "Check provider")} />
                  <CourseFact icon={MapPin} label={isKo ? "캠퍼스" : "Campus"} value={course.campus ?? (isKo ? "기관 확인" : "Check provider")} />
                  <CourseFact icon={GraduationCap} label={isKo ? "연간 학비" : "Annual tuition"} value={course.tuitionAmount && course.tuitionCurrency ? new Intl.NumberFormat("en", { style: "currency", currency: course.tuitionCurrency, maximumFractionDigits: 0 }).format(course.tuitionAmount) : (isKo ? "공식 페이지 확인" : "Check official page")} />
                </div>
                <div className="mt-5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800">
                  <strong>{course.sourceName}</strong> · {isKo ? "최종 확인" : "Verified"} {formatDate(course.lastVerifiedAt)}
                </div>
                <a href={course.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">
                  {isKo ? "공식 과정 페이지" : "Open official course page"}<ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">{isKo ? "현재 검증된 shortlist가 없습니다" : "No verified shortlist is available yet"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              {isKo ? "등록 여부가 확인되지 않은 과정을 임의로 추천하지 않습니다. 아래 공식 등록부에서 최신 과정을 확인하세요." : "CampCareer does not pad this list with unverified courses. Use the official registry below for the current catalogue."}
            </p>
            {registry && <a href={registry.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">{registry.name}<ExternalLink className="h-4 w-4" /></a>}
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm font-bold text-blue-700">{isKo ? "다음 단계" : "Next step"}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{isKo ? "지원 준비가 되셨나요?" : "Ready to prepare an application?"}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{isKo ? "희망 과정과 예산을 확인한 뒤에만 검증된 학교 또는 에이전트 연결을 요청하세요. 파트너 비용은 과정·국가 순위에 반영되지 않습니다." : "Request help from a verified school or agent only after you have reviewed your shortlist and budget. Partner fees never affect course or country ranking."}</p>
          <Link href={`/support/request?concept=${encodeURIComponent(concept.id)}&country=${countryCode}&locale=${isKo ? "ko-KR" : "en"}`} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">{isKo ? "지원 준비 도움 요청" : "Request application support"}</Link>
        </section>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          {isKo ? "CampCareer는 정보·계획 도구이며 입학, 비자 또는 자격 적격성을 보장하지 않습니다. 지원 전에 교육기관과 정부 공식 페이지를 확인하세요." : "CampCareer is an information and planning tool and does not guarantee admission, visa or qualification eligibility. Verify requirements with the provider and official authority before applying."}
        </div>
      </section>
    </div>
  )
}

function CourseFact({ icon: Icon, label, value }: { icon: typeof GraduationCap; label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><Icon className="h-4 w-4 text-blue-600" /><p className="mt-2 text-[11px] font-bold text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{value}</p></div>
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date)
}
