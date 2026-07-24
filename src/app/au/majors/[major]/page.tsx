import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  WalletCards,
  NotebookPen,
} from "lucide-react"
import { getStudyConcept, STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { AU_CONCEPT_OCCUPATIONS } from "@/data/au-major-occupation-map"
import costsSnapshot from "@/data/au-major-costs.json"
import {
  formatOutlook,
  formatSalaryRange,
  getAuMajorSignal,
  prBadge,
  shortageLabel,
  shortageLevel,
} from "@/lib/au-major-signals"
import { pageMetadata } from "@/lib/seo"
import { SavedStudyConceptButton } from "@/components/saved/saved-study-concept-button"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import {
  getLocalizedMajorCostNote,
  getLocalizedMajorDescription,
  getLocalizedOccupationLabel,
} from "@/lib/au-major-copy"

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

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { major } = await params
  const concept = getStudyConcept(major)
  if (!concept) return { title: "Major not found" }
  const isKo = (await getLocale()) === "ko"
  const label = isKo ? concept.labelKo : concept.label
  return pageMetadata({
    title: isKo
      ? `호주 ${label} — 과정·직업·연봉·영주권`
      : `${label} in Australia — Courses, Jobs, Salary & PR`,
    description: isKo
      ? `호주 ${label}의 학력 선택지, 과정 비용, 관련 직업, 인력 부족 신호, 연봉과 영주권 정보를 확인하세요.`
      : `Plan a ${label} pathway in Australia: qualification options, course costs, linked occupations, shortage signals, salary range and PR considerations.`,
    path: `/au/majors/${concept.slug}`,
  })
}

export default async function AustralianMajorDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const [{ major }, locale] = await Promise.all([params, getLocale()])
  const isKo = locale === "ko"
  const concept = getStudyConcept(major)
  if (!concept) notFound()
  if (major !== concept.slug)
    permanentRedirect(localizePath(`/au/majors/${concept.slug}`, locale))

  const signal = getAuMajorSignal(concept.id)
  const pathway = AU_CONCEPT_OCCUPATIONS.find(
    (item) => item.conceptId === concept.id,
  )
  const costs = COSTS[concept.id]
  const category = STUDY_CATEGORIES.find((item) => item.id === concept.category)
  const shortage = shortageLevel(signal?.shortage_national_pct ?? null)
  const pr = prBadge(signal?.pr_score ?? null)
  const providers = [
    ...(costs?.universities ?? []),
    ...(costs?.diplomaOptions ?? []),
  ].slice(0, 6)
  const annualFees = providers
    .map((p) => p.bachelorFeeAud ?? p.feeAud)
    .filter((f): f is number => typeof f === "number")
  const feeRange = annualFees.length
    ? `${money(Math.min(...annualFees))}–${money(Math.max(...annualFees))}/${isKo ? "년" : "yr"}`
    : isKo
      ? "교육기관 확인 필요"
      : "Check provider"
  const prLabel = isKo ? localizedPrLabel(pr.label) : pr.label
  const prNote = isKo
    ? signal?.shortage_national_pct != null
      ? "관련 직업군의 인력 부족 신호가 확인됩니다. 최신 비자·영주권 조건은 공식 기관에서 확인하세요."
      : "최신 비자·영주권 조건은 공식 기관에서 확인하세요."
    : (signal?.pr_note ?? "Check current visa settings")
  const occupations = signal?.representative_occupations?.length
    ? signal.representative_occupations.map((occ) => {
        const mapped = pathway?.representativeOccupations.find(
          (item) => item.oscaCode === occ.oscaCode,
        )
        return {
          ...occ,
          label: getLocalizedOccupationLabel(
            mapped?.label ?? occ.label,
            mapped?.labelKo ?? occ.labelKo,
            isKo,
          ),
        }
      })
    : pathway?.representativeOccupations ?? []

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden au-discovery-hero">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
          <div className="flex items-center gap-3">
            <Link href={localizePath("/au/majors", locale)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"><ArrowLeft className="h-4 w-4" />{isKo ? "전체 전공" : "All majors"}</Link>
            <Link href={localizePath("/myplan", locale)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"><NotebookPen className="h-4 w-4" />MyPlan</Link>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-100">{isKo ? "호주" : "Australia"} · {isKo ? (category?.labelKo ?? "전공 경로") : (category?.label ?? "Major pathway")}</p>
              <div className="mt-5 flex items-center gap-2.5"><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{isKo ? concept.labelKo : concept.label}</h1><SavedStudyConceptButton concept={{ slug: concept.slug, label: concept.label, labelKo: concept.labelKo, category: concept.category }} compact className="size-9 rounded-lg border-0 bg-transparent p-0 text-white hover:bg-white/15 hover:text-white" /></div>
              <p className="mt-3 text-base leading-7 text-blue-50">{getLocalizedMajorDescription(concept.id, isKo, concept.description)}</p>
            </div>
            <div className="flex flex-wrap gap-2"><Link href={localizePath(`/au/study/programs/${concept.slug}`, locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{isKo ? "과정" : "Programs"} <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-5 py-8 sm:px-6 sm:py-12">
        {/* ── Key metrics ── */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            label={isKo ? "인력 부족" : "Shortage"}
            value={shortageLabel(shortage, isKo)}
            detail={
              signal?.shortage_national_pct != null
                ? isKo
                  ? `관련 직업군 ${signal.shortage_national_pct}%`
                  : `${signal.shortage_national_pct}% of occupations`
                : isKo
                  ? "데이터 없음"
                  : "No data"
            }
            accent={
              shortage === "critical"
                ? "bg-red-50 text-red-700 ring-red-200"
                : shortage === "high"
                  ? "bg-orange-50 text-orange-700 ring-orange-200"
                  : "bg-slate-50 text-slate-700 ring-slate-200"
            }
          />
          <MetricCard
            icon={<WalletCards className="h-5 w-5" />}
            label={isKo ? "일반 연봉" : "Salary range"}
            value={
              formatSalaryRange(
                signal?.salary_min_aud ?? null,
                signal?.salary_max_aud ?? null,
              ) || (isKo ? "데이터 없음" : "No data")
            }
            detail={
              signal?.salary_median_aud
                ? isKo
                  ? `중위 ${money(signal.salary_median_aud)}`
                  : `Median ${money(signal.salary_median_aud)}`
                : isKo
                  ? "관련 직업군 기준"
                  : "Mapped occupations"
            }
            accent="bg-emerald-50 text-emerald-700 ring-emerald-200"
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label={isKo ? "2035 전망" : "2035 outlook"}
            value={
              formatOutlook(signal?.outlook_2035_change_pct ?? null) ||
              (isKo ? "데이터 없음" : "No data")
            }
            detail={
              signal?.outlook_direction
                ? isKo
                  ? `${localizedOutlook(signal.outlook_direction)} 전망`
                  : `${signal.outlook_direction}`
                : isKo
                  ? "고용 전망"
                  : "Projection"
            }
            accent="bg-blue-50 text-blue-700 ring-blue-200"
          />
          <MetricCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label={isKo ? "영주권 신호" : "PR signal"}
            value={prLabel}
            detail={prNote}
            accent={
              pr.className.includes("emerald")
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : pr.className.includes("blue")
                  ? "bg-blue-50 text-blue-700 ring-blue-200"
                  : "bg-slate-50 text-slate-700 ring-slate-200"
            }
          />
        </section>

        {/* ── Pathway + Cost ── */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold text-slate-950">
                {isKo ? "학력·진로 경로" : "Credentials & pathway"}
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PathwayFact
                label={isKo ? "경로 유형" : "Pathway type"}
                value={localizedKind(concept.kind, isKo)}
              />
              <PathwayFact
                label={isKo ? "소요 기간" : "Duration"}
                value={
                  pathway
                    ? `${pathway.durationYears.min}${
                        pathway.durationYears.min !== pathway.durationYears.max
                          ? `–${pathway.durationYears.max}`
                          : ""
                      } ${isKo ? "년" : "years"}`
                    : isKo
                      ? "교육기관 확인 필요"
                      : "Check provider"
                }
              />
              <PathwayFact
                label={isKo ? "학력 선택지" : "Qualifications"}
                value={
                  pathway?.qualificationTypes
                    .map((v) => localizedQualification(v, isKo))
                    .join(" · ") ??
                  (isKo ? "교육기관 확인 필요" : "Check provider")
                }
              />
              <PathwayFact
                label={isKo ? "교육 분야" : "Education fields"}
                value={
                  pathway?.broadFields
                    .map((v) => localizedBroadField(v, isKo))
                    .join(" · ") ??
                  (isKo ? "교육기관 확인 필요" : "Check provider")
                }
              />
            </div>
            {costs?.notes && (
              <p className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
                {getLocalizedMajorCostNote(concept.id, isKo, costs.notes)}
              </p>
            )}
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <WalletCards className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold text-slate-950">
                {isKo ? "비용 요약" : "Cost snapshot"}
              </h2>
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              {feeRange}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {isKo
                ? "국제학생 연간 예상 학비입니다."
                : "Indicative annual international tuition."}
            </p>
            <Link
              href={localizePath(`/au/study/programs/${concept.slug}`, locale)}
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isKo ? "CRICOS 과정 확인" : "Check CRICOS programs"}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </aside>
        </div>

        {/* ── Occupations ── */}
        {occupations.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-violet-50 text-violet-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold text-slate-950">
                {isKo ? "이어지는 직업" : "Where this leads"}
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {occupations.map((occ) => (
                <Link
                  key={occ.oscaCode}
                  href={localizePath(`/au/jobs/${occ.oscaCode}`, locale)}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700">
                    {occ.oscaCode}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                      {occ.label}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-blue-600">
                      {isKo ? "직업 정보" : "Details"}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Providers table ── */}
        {providers.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-700">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {isKo ? "교육기관·학비" : "Providers & tuition"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isKo
                      ? "비용 참고용 — 지원 전 공식 확인 필요"
                      : "Cost benchmark — verify before applying"}
                  </p>
                </div>
              </div>
              <Link
                href={localizePath(
                  `/au/study/programs/${concept.slug}`,
                  locale,
                )}
                className="hidden text-sm font-semibold text-blue-700 hover:text-blue-800 sm:inline-flex sm:items-center sm:gap-1"
              >
                {isKo ? "전체 과정" : "All programs"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4 font-semibold">
                      {isKo ? "교육기관" : "Provider"}
                    </th>
                    <th className="pb-3 pr-4 font-semibold">
                      {isKo ? "연간 학비" : "Annual fee"}
                    </th>
                    <th className="pb-3 pr-4 font-semibold">
                      {isKo ? "기간" : "Duration"}
                    </th>
                    <th className="pb-3 font-semibold">QS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {providers.map((p) => (
                    <tr key={p.name} className="hover:bg-slate-50">
                      <td className="py-3.5 pr-4 font-semibold text-slate-900">
                        {p.name}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-700">
                        {money(p.bachelorFeeAud ?? p.feeAud)}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-700">
                        {p.duration
                          ? `${p.duration} ${isKo ? "년" : "yr"}`
                          : "—"}
                      </td>
                      <td className="py-3.5 text-slate-700">
                        {p.qsRank ? `#${p.qsRank}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Disclaimer ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
          <h2 className="font-semibold text-slate-950">
            {isKo ? "데이터 안내" : "Data notice"}
          </h2>
          <p className="mt-2">
            {isKo
              ? "노동시장 신호는 관련 직업군 데이터를 바탕으로 하며 취업·비자·입학 결과를 보장하지 않습니다. 학비, CRICOS, 자격증과 비자 요건은 교육기관과 관련 기관에서 확인하세요."
              : "Labour-market signals are derived from mapped occupations, not a guarantee. Verify fees, CRICOS registration, licensing and visa eligibility with the relevant provider and regulator."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(signal?.data_sources ?? []).map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {source.name}
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            ))}
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {isKo
                ? "비용 스냅샷 · CRICOS·교육기관 학비"
                : "Cost snapshot · CRICOS fees"}
            </span>
            {signal?.last_verified && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {isKo ? "확인일" : "Verified"} {signal.last_verified}
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
  accent: string
}) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 ring-1 transition-shadow hover:shadow-md ${accent}`}
    >
      <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-white/80">
        {icon}
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

function PathwayFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

/* ── Helpers ── */

function localizedKind(kind: string, isKo: boolean) {
  if (!isKo) return humanize(kind)
  return (
    ({
      STUDY_FIELD: "학업 전공",
      QUALIFICATION: "자격·교육 과정",
      TRADE_PATHWAY: "기술직 경로",
    })[kind as "STUDY_FIELD" | "QUALIFICATION" | "TRADE_PATHWAY"] ?? "학업 경로"
  )
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
  return (
    ({ growing: "성장", declining: "감소", stable: "안정적" })[
      direction.toLowerCase()
    ] ?? direction
  )
}

function localizedPrLabel(label: string) {
  return (
    ({
      "Excellent PR": "매우 강한 영주권 신호",
      "Strong PR": "강한 영주권 신호",
      "Moderate PR": "보통 영주권 신호",
      "Limited PR": "제한적인 영주권 신호",
    })[label] ?? "영주권 신호 확인 필요"
  )
}

function money(value: number | undefined) {
  return value ? `A$${Math.round(value).toLocaleString()}` : "—"
}

function humanize(value: string) {
  return value
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ")
}

function stripCode(value: string) {
  return value.replace(/^\d+\s*-\s*/, "")
}
