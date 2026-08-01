import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react"
import { getStudyConcept, STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"
import { getLocalizedMajorDescription } from "@/lib/au-major-copy"
import { profileFromSearchParams, rankAustralianPathways, type RankedAuPathway } from "@/lib/au-pathfinder"
import { SavedStudyConceptButton } from "@/components/saved/saved-study-concept-button"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Explore Australia study fields and career pathways",
  description: "Browse every Australia study field, then compare the pathway, programmes, costs and career signals that matter to you.",
  path: "/au/majors",
})

export default async function AustralianMajorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [locale, query] = await Promise.all([getLocale(), searchParams])
  const isKo = locale === "ko"
  const one = (key: string) => (typeof query[key] === "string" ? query[key] : undefined)
  const selectedMajor = one("major")
  const selectedCategory = STUDY_CATEGORIES.find((category) => category.id === one("category"))
  const rankingMode = ["pathGoal", "stage", "category", "budget", "timeline"].some((key) => Boolean(one(key)))
  const ranked = rankingMode
    ? rankAustralianPathways(profileFromSearchParams({
      pathGoal: one("pathGoal"),
      stage: one("stage"),
      category: one("category"),
      budget: one("budget"),
      timeline: one("timeline"),
    }))
    : []

  if (selectedMajor) {
    const concept = getStudyConcept(selectedMajor)
    if (concept) redirect(localizePath(`/au/majors/${concept.slug}`, locale))
  }

  const categories = selectedCategory ? [selectedCategory] : STUDY_CATEGORIES

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden au-discovery-hero">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <Link href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white">
            <ArrowLeft className="size-4" />
            {isKo ? "내 경로 찾기로 돌아가기" : "Back to Find my path"}
          </Link>
          <div className="mt-7 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="mt-0 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {rankingMode
                  ? (isKo
                    ? `${selectedCategory?.labelKo ?? "호주"} 추천 학업 경로`
                    : `${selectedCategory?.label ?? "Australia"} pathways ranked for you`)
                  : selectedCategory
                  ? (isKo ? selectedCategory.labelKo : selectedCategory.label)
                  : (isKo ? "호주의 모든 전공 경로 둘러보기" : "Browse every Australia study field")}
              </h1>
            </div>
            <Link href={localizePath("/au/study", locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50">
              <GraduationCap className="size-4" />
              {isKo ? "학교·비용 비교하기" : "Compare study options"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          {rankingMode ? (
            <RankedPathwayResults ranked={ranked} locale={locale} isKo={isKo} />
          ) : (
            <>
          {selectedCategory && (
            <Link href={localizePath("/au/majors", locale)} className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800">
              <ArrowLeft className="size-4" />
              {isKo ? "전체 전공 보기" : "View all fields"}
            </Link>
          )}
          <div className="grid gap-5 lg:grid-cols-2">
            {categories.map((category) => {
              const { Icon, tone } = getStudyCategoryVisual(category.id)
              const concepts = STUDY_CONCEPTS.filter((concept) => concept.category === category.id)
              return (
                <article key={category.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{isKo ? "전공 분야" : "Study field"}</p>
                        <h2 className="mt-1 text-lg font-semibold leading-6 text-slate-950">{isKo ? category.labelKo : category.label}</h2>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{concepts.length}</span>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {concepts.map((concept) => (
                      <Link key={concept.id} href={localizePath(`/au/majors/${concept.slug}`, locale)} className="group rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-blue-300 hover:bg-blue-50/60">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900">{isKo ? concept.labelKo : concept.label}</h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{getLocalizedMajorDescription(concept.id, isKo, concept.description)}</p>
                          </div>
                          <ArrowRight className="mt-0.5 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function RankedPathwayResults({ ranked, locale, isKo }: { ranked: RankedAuPathway[]; locale: "en" | "ko"; isKo: boolean }) {
  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{isKo ? "조건 기반 추천 순위" : "Ranked for your conditions"}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{isKo ? "다음에 검토할 전공" : "Study pathways to review next"}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{isKo ? "목표·학위·분야 조건을 랜딩과 같은 기준으로 계산했습니다. 점수는 후보를 좁히기 위한 신호입니다." : "These scores use the same goal, study-stage and field rules as the landing search. Use them to narrow your shortlist."}</p>
        </div>
        <Link href="/home" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">{isKo ? "조건 바꾸기" : "Change conditions"}<ArrowRight className="size-4" /></Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {ranked.map((pathway, index) => <RankedPathwayCard key={pathway.concept.id} pathway={pathway} rank={index + 1} locale={locale} isKo={isKo} />)}
      </div>
    </div>
  )
}

function RankedPathwayCard({ pathway, rank, locale, isKo }: { pathway: RankedAuPathway; rank: number; locale: "en" | "ko"; isKo: boolean }) {
  const { Icon, tone } = getStudyCategoryVisual(pathway.concept.category)
  const label = isKo ? pathway.concept.labelKo : pathway.concept.label
  const href = localizePath(`/au/majors/${pathway.concept.slug}`, locale)
  return (
    <article className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${rank === 1 ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"}`}>
      <Link href={href} aria-label={isKo ? `${label} 전공 경로 보기` : `View ${label} pathway`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"><span className="sr-only">{isKo ? `${label} 전공 상세` : `${label} pathway details`}</span></Link>
      <div className="pointer-events-none relative z-10">
        <div className="flex items-start gap-4">
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{rank === 1 ? (isKo ? "현재 가장 잘 맞는 경로" : "Best current fit") : `${isKo ? "추천" : "Rank"} ${rank}`}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{label}</h3>
              </div>
              <div className="flex shrink-0 items-start gap-2">
                <span className="pointer-events-auto"><SavedStudyConceptButton compact concept={{ slug: pathway.concept.slug, label: pathway.concept.label, labelKo: pathway.concept.labelKo, category: pathway.concept.category }} /></span>
                <div className="rounded-xl bg-slate-950 px-2.5 py-1.5 text-right text-white"><p className="text-base font-semibold leading-none">{pathway.score}</p><p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">{isKo ? "적합도" : "fit"}</p></div>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{getLocalizedMajorDescription(pathway.concept.id, isKo, pathway.concept.description)}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{pathway.reasons.map((reason) => <RankReason key={reason.factor} reason={reason} isKo={isKo} />)}</div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
          <RankMetric label={isKo ? "중위 연봉" : "Mapped median pay"} value={moneyShort(pathway.salaryMedianAud)} />
          <RankMetric label={isKo ? "2035 전망" : "2035 outlook"} value={percentage(pathway.outlook2035Pct)} />
          <RankMetric label={isKo ? "부족 신호" : "Shortage signal"} value={percentage(pathway.shortagePct)} />
          <RankMetric label={isKo ? "PR 신호" : "PR signal"} value={pathway.prScore == null ? "—" : `${pathway.prScore}/100`} />
          <RankMetric label={isKo ? "연간 학비 기준" : "Annual tuition basis"} value={moneyShort(pathway.annualTuitionAud)} />
          <RankMetric label={isKo ? "일반 기간" : "Typical duration"} value={pathway.durationYears == null ? "—" : `${pathway.durationYears} ${isKo ? "년" : pathway.durationYears === 1 ? "year" : "years"}`} />
        </dl>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><p className="text-xs text-slate-500">{isKo ? `검증 신호 ${pathway.evidenceCount}/6개` : `${pathway.evidenceCount}/6 verified signal types`}</p><span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:text-blue-800">{isKo ? "전공 경로 보기" : "Explore pathway"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></div>
      </div>
    </article>
  )
}

function RankReason({ reason, isKo }: { reason: RankedAuPathway["reasons"][number]; isKo: boolean }) {
  const value = reason.factor === "salary" || reason.factor === "cost" ? moneyShort(reason.value) : reason.factor === "outlook" || reason.factor === "shortage" ? percentage(reason.value) : reason.factor === "residency" ? `${reason.value}/100` : "✓"
  const labels: Record<string, [string, string]> = { salary: ["Pay signal", "임금 신호"], outlook: ["2035 outlook", "2035 전망"], shortage: ["Shortage", "부족 신호"], residency: ["PR signal", "PR 신호"], cost: ["Lower tuition", "낮은 학비"], duration: ["Study time", "학업 기간"], studyFit: ["Route available", "학업 경로 있음"] }
  return <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">{labels[reason.factor]?.[isKo ? 1 : 0] ?? reason.factor} {value}</span>
}

function RankMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd></div>
}

function moneyShort(value: number | null) {
  return value == null ? "—" : `A$${Math.round(value / 1000)}K`
}

function percentage(value: number | null) {
  return value == null ? "—" : `${value > 0 ? "+" : ""}${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
}
