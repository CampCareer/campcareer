import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, ExternalLink, GraduationCap, MapPinned, ShieldCheck, TrendingUp, WalletCards } from "lucide-react"
import { getStudyConcept, STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { AU_CONCEPT_OCCUPATIONS } from "@/data/au-major-occupation-map"
import costsSnapshot from "@/data/au-major-costs.json"
import { formatOutlook, formatSalaryRange, getAuMajorSignal, prBadge, shortageLabel, shortageLevel } from "@/lib/au-major-signals"
import { pageMetadata } from "@/lib/seo"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { SavedStudyConceptButton } from "@/components/saved/saved-study-concept-button"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { getLocalizedMajorCostNote, getLocalizedMajorDescription, getLocalizedOccupationLabel } from "@/lib/au-major-copy"

export const revalidate = 86400

type CostProvider = {
  name: string
  qsRank?: number
  bachelorFeeAud?: number
  feeAud?: number
  duration?: number
}

type CostProfile = {
  universities?: CostProvider[]
  diplomaOptions?: CostProvider[]
  notes?: string
}

type Params = { major: string }

const COSTS = costsSnapshot as Record<string, CostProfile>

export function generateStaticParams() {
  return STUDY_CONCEPTS.map((concept) => ({ major: concept.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { major } = await params
  const concept = getStudyConcept(major)
  if (!concept) return { title: "Major not found" }
  const isKo = (await getLocale()) === "ko"
  const label = isKo ? concept.labelKo : concept.label
  return pageMetadata({
    title: isKo ? `호주 ${label} — 과정·직업·연봉·영주권` : `${label} in Australia — Courses, Jobs, Salary & PR`,
    description: isKo ? `호주 ${label}의 학력 선택지, 과정 비용, 관련 직업, 인력 부족 신호, 연봉과 영주권 정보를 확인하세요.` : `Plan a ${label} pathway in Australia: qualification options, course costs, linked occupations, shortage signals, salary range and PR considerations.`,
    path: `/au/majors/${concept.slug}`,
  })
}

export default async function AustralianMajorDetailPage({ params }: { params: Promise<Params> }) {
  const [{ major }, locale] = await Promise.all([params, getLocale()])
  const isKo = locale === "ko"
  const concept = getStudyConcept(major)
  if (!concept) notFound()
  if (major !== concept.slug) permanentRedirect(localizePath(`/au/majors/${concept.slug}`, locale))

  const signal = getAuMajorSignal(concept.id)
  const pathway = AU_CONCEPT_OCCUPATIONS.find((item) => item.conceptId === concept.id)
  const costs = COSTS[concept.id]
  const category = STUDY_CATEGORIES.find((item) => item.id === concept.category)
  const { Icon, tone } = getStudyCategoryVisual(concept.category)
  const shortage = shortageLevel(signal?.shortage_national_pct ?? null)
  const pr = prBadge(signal?.pr_score ?? null)
  const providers = [...(costs?.universities ?? []), ...(costs?.diplomaOptions ?? [])].slice(0, 6)
  const annualFees = providers.map((provider) => provider.bachelorFeeAud ?? provider.feeAud).filter((fee): fee is number => typeof fee === "number")
  const feeRange = annualFees.length ? `${money(Math.min(...annualFees))}–${money(Math.max(...annualFees))}/${isKo ? "년" : "yr"}` : (isKo ? "교육기관 확인 필요" : "Check provider")
  const prLabel = isKo ? localizedPrLabel(pr.label) : pr.label
  const prNote = isKo
    ? (signal?.shortage_national_pct != null ? "관련 직업군의 인력 부족 신호가 확인됩니다. 최신 비자·영주권 조건은 공식 기관에서 확인하세요." : "최신 비자·영주권 조건은 공식 기관에서 확인하세요.")
    : (signal?.pr_note ?? "Check current visa settings")
  const occupations = signal?.representative_occupations?.length
    ? signal.representative_occupations.map((occupation) => {
      const mapped = pathway?.representativeOccupations.find((item) => item.oscaCode === occupation.oscaCode)
      return { ...occupation, label: getLocalizedOccupationLabel(mapped?.label ?? occupation.label, mapped?.labelKo ?? occupation.labelKo, isKo) }
    })
    : pathway?.representativeOccupations ?? []

  return <main className="min-h-screen bg-slate-50">
    <section className="relative overflow-hidden au-discovery-hero">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <Link href={localizePath("/au/majors", locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white"><ArrowLeft className="h-4 w-4" />{isKo ? "전공 목록으로 돌아가기" : "Back to majors"}</Link>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span><p className="text-sm font-semibold text-blue-100">{isKo ? "호주" : "Australia"} · {isKo ? (category?.labelKo ?? "전공 경로") : (category?.label ?? "Major pathway")}</p></div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{isKo ? concept.labelKo : concept.label}</h1>
            <p className="mt-3 text-base leading-7 text-blue-50">{getLocalizedMajorDescription(concept.id, isKo, concept.description)}</p>
          </div>
          <div className="flex flex-wrap gap-2"><SavedStudyConceptButton concept={{ slug: concept.slug, label: concept.label, labelKo: concept.labelKo, category: concept.category }} /><Link href={localizePath(`/au/study/programs/${concept.slug}`, locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{isKo ? "검증된 과정 보기" : "View verified programs"} <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-6xl space-y-12 px-5 py-8 sm:px-6 sm:py-12">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label={isKo ? "인력 부족 신호" : "Shortage signal"} value={shortageLabel(shortage, isKo)} detail={signal?.shortage_national_pct != null ? (isKo ? `관련 직업군의 ${signal.shortage_national_pct}%` : `${signal.shortage_national_pct}% of mapped occupations`) : (isKo ? "데이터 없음" : "Not available")} tone={shortage === "critical" ? "text-red-700" : shortage === "high" ? "text-orange-700" : "text-slate-700"} />
        <Metric icon={WalletCards} label={isKo ? "일반 연봉" : "Typical salary"} value={formatSalaryRange(signal?.salary_min_aud ?? null, signal?.salary_max_aud ?? null) || (isKo ? "데이터 없음" : "Not available")} detail={signal?.salary_median_aud ? (isKo ? `중위 연봉 ${money(signal.salary_median_aud)}` : `Median ${money(signal.salary_median_aud)}`) : (isKo ? "관련 직업군 연봉 범위" : "Mapped occupation range")} />
        <Metric icon={TrendingUp} label={isKo ? "2035년 전망" : "2035 outlook"} value={formatOutlook(signal?.outlook_2035_change_pct ?? null) || (isKo ? "데이터 없음" : "Not available")} detail={signal?.outlook_direction ? (isKo ? `${localizedOutlook(signal.outlook_direction)} 고용 전망` : `${signal.outlook_direction} employment outlook`) : (isKo ? "고용 전망" : "Employment projection")} tone="text-emerald-700" />
        <Metric icon={ShieldCheck} label={isKo ? "영주권 경로 신호" : "PR pathway signal"} value={prLabel} detail={prNote} tone={pr.className.includes("emerald") ? "text-emerald-700" : pr.className.includes("blue") ? "text-blue-700" : "text-slate-700"} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="py-1 sm:py-2">
          <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "학력·진로 경로" : "Credentials & pathway"}</h2></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Fact label={isKo ? "경로 유형" : "Pathway type"} value={localizedKind(concept.kind, isKo)} />
            <Fact label={isKo ? "일반 소요 기간" : "Typical duration"} value={pathway ? `${pathway.durationYears.min}${pathway.durationYears.min !== pathway.durationYears.max ? `–${pathway.durationYears.max}` : ""} ${isKo ? "년" : "years"}` : (isKo ? "교육기관 확인 필요" : "Check provider")} />
            <Fact label={isKo ? "학력 선택지" : "Qualification options"} value={pathway?.qualificationTypes.map((value) => localizedQualification(value, isKo)).join(" · ") ?? (isKo ? "교육기관 확인 필요" : "Check provider")} />
            <Fact label={isKo ? "관련 교육 분야" : "Related education fields"} value={pathway?.broadFields.map((value) => localizedBroadField(value, isKo)).join(" · ") ?? (isKo ? "교육기관 확인 필요" : "Check provider")} />
          </div>
          {costs?.notes && <p className="mt-5 text-sm leading-6 text-blue-800">{getLocalizedMajorCostNote(concept.id, isKo, costs.notes)}</p>}
        </section>

        <aside className="py-1 sm:py-2">
          <div className="flex items-center gap-2"><WalletCards className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "비용 요약" : "Cost snapshot"}</h2></div>
          <p className="mt-4 text-2xl font-semibold text-slate-950">{feeRange}</p>
          <p className="mt-1 text-sm text-slate-500">{isKo ? "현재 데이터 기준 국제학생 연간 예상 학비입니다." : "Indicative annual international tuition from the current snapshot."}</p>
          <Link href={localizePath(`/au/study/programs/${concept.slug}`, locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">{isKo ? "현재 CRICOS 과정 확인" : "Check current CRICOS programs"} <ExternalLink className="h-4 w-4" /></Link>
        </aside>
      </div>

      <section>
        <div className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "이 전공으로 이어지는 직업" : "Where this major can lead"}</h2></div>
        <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">{occupations.map((occupation) => <Link key={occupation.oscaCode} href={localizePath(`/au/jobs/${occupation.oscaCode}`, locale)} className="group -mx-2 rounded-xl px-2 py-1 transition hover:bg-blue-50/70"><p className="text-xs font-semibold tracking-wide text-blue-700">OSCA {occupation.oscaCode}</p><h3 className="mt-1 font-semibold text-slate-950">{occupation.label}</h3><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">{isKo ? "직업 정보 보기" : "View occupation"} <ArrowRight className="h-4 w-4" /></span></Link>)}</div>
      </section>

      {providers.length > 0 && <section>
        <div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "교육기관·학비 참고" : "Indicative providers & tuition"}</h2></div><p className="mt-1 text-sm text-slate-500">{isKo ? "비용 기준으로 참고하고, 지원 전에는 공식 과정 정보를 확인하세요." : "Use these as a cost benchmark; open verified listings before applying."}</p></div><Link href={localizePath(`/au/study/programs/${concept.slug}`, locale)} className="hidden text-sm font-semibold text-blue-700 hover:text-blue-800 sm:inline-flex sm:items-center sm:gap-1">{isKo ? "과정 보기" : "Programs"} <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-3 pr-4 font-semibold">{isKo ? "교육기관" : "Provider"}</th><th className="pb-3 pr-4 font-semibold">{isKo ? "연간 학비" : "Annual tuition"}</th><th className="pb-3 pr-4 font-semibold">{isKo ? "일반 소요 기간" : "Typical duration"}</th><th className="pb-3 font-semibold">QS {isKo ? "순위" : "rank"}</th></tr></thead><tbody className="divide-y divide-slate-100">{providers.map((provider) => <tr key={provider.name}><td className="py-4 pr-4 font-semibold text-slate-900">{provider.name}</td><td className="py-4 pr-4 text-slate-700">{money(provider.bachelorFeeAud ?? provider.feeAud)}</td><td className="py-4 pr-4 text-slate-700">{provider.duration ? `${provider.duration} ${isKo ? "년" : "years"}` : "—"}</td><td className="py-4 text-slate-700">{provider.qsRank ? `#${provider.qsRank}` : "—"}</td></tr>)}</tbody></table></div>
      </section>}

      <section className="pb-2 text-sm leading-6 text-slate-600">
        <h2 className="font-semibold text-slate-950">{isKo ? "데이터 상태" : "Data status"}</h2>
        <p className="mt-2">{isKo ? "노동시장 신호는 관련 직업군 데이터를 바탕으로 하며 취업·비자·입학 결과를 보장하지 않습니다. 현재 학비, CRICOS 등록, 자격증과 비자 요건은 교육기관과 관련 기관에서 확인하세요." : "Labour-market signals are derived from the mapped occupations, not a guarantee of a job, visa or admission result. Verify current course fees, CRICOS registration, licensing and visa eligibility with the relevant provider and regulator."}</p>
        <div className="mt-4 flex flex-wrap gap-2">{(signal?.data_sources ?? []).map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">{source.name}<ExternalLink className="ml-1 inline h-3 w-3" /></a>)}<span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{isKo ? "비용 스냅샷 · CRICOS·교육기관 학비 일정" : "Cost snapshot · CRICOS and provider fee schedules"}</span>{signal?.last_verified && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{isKo ? "확인일" : "Verified"} {signal.last_verified}</span>}</div>
      </section>
    </div>
  </main>
}

function Metric({ icon: Icon, label, value, detail, tone = "text-slate-950" }: { icon: typeof BriefcaseBusiness; label: string; value: string; detail: string; tone?: string }) {
  return <article className="px-1 py-3"><Icon className="h-5 w-5 text-blue-700" /><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></article>
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="py-2"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value}</p></div>
}

function localizedKind(kind: string, isKo: boolean) {
  if (!isKo) return humanize(kind)
  return { STUDY_FIELD: "학업 전공", QUALIFICATION: "자격·교육 과정", TRADE_PATHWAY: "기술직 경로" }[kind as "STUDY_FIELD" | "QUALIFICATION" | "TRADE_PATHWAY"] ?? "학업 경로"
}

function localizedQualification(value: string, isKo: boolean) {
  if (!isKo) return value
  return value
    .replace("Graduate Diploma", "대학원 디플로마")
    .replace("Graduate Certificate", "대학원 수료증")
    .replace("Certificate III", "수료증 III")
    .replace("Certificate IV", "수료증 IV")
    .replace("Bachelor", "학사")
    .replace("Master", "석사")
    .replace("Doctorate", "박사")
    .replace("Diploma", "디플로마")
}

function localizedBroadField(value: string, isKo: boolean) {
  const stripped = stripCode(value)
  if (!isKo) return stripped
  const labels: Record<string, string> = {
    "Information Technology": "정보기술",
    "Management and Commerce": "경영·상업",
    Health: "보건",
    "Engineering and Related Technologies": "공학·관련 기술",
    "Society and Culture": "사회·문화",
    Education: "교육",
    "Architecture and Building": "건축·건설",
    "Creative Arts": "창의예술",
    Agriculture: "농업",
    "Food, Hospitality and Personal Services": "식품·호텔·개인 서비스",
    "Natural and Physical Sciences": "자연·물리과학",
  }
  return labels[stripped] ?? stripped
}

function localizedOutlook(direction: string) {
  return { growing: "성장", declining: "감소", stable: "안정적" }[direction.toLowerCase()] ?? direction
}

function localizedPrLabel(label: string) {
  return {
    "Excellent PR": "매우 강한 영주권 신호",
    "Strong PR": "강한 영주권 신호",
    "Moderate PR": "보통 영주권 신호",
    "Limited PR": "제한적인 영주권 신호",
  }[label] ?? "영주권 신호 확인 필요"
}

function money(value: number | undefined) {
  return value ? `A$${Math.round(value).toLocaleString()}` : "—"
}

function humanize(value: string) {
  return value.split("_").map((word) => word[0] + word.slice(1).toLowerCase()).join(" ")
}

function stripCode(value: string) {
  return value.replace(/^\d+\s*-\s*/, "")
}
