"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, RotateCcw } from "lucide-react"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import {
  DEFAULT_AU_PATHFINDER_PROFILE,
  rankAustralianPathways,
  ruleWeightSummary,
  type AuPathfinderBudget,
  type AuPathfinderCategory,
  type AuPathfinderGoal,
  type AuPathfinderProfile,
  type AuPathfinderReason,
  type AuPathfinderStudyStage,
  type AuPathfinderTimeline,
  type RankedAuPathway,
} from "@/lib/au-pathfinder"
import { localizePath } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/locale-provider"
import { track } from "@/lib/analytics"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { IconPicker, type PickerOption } from "@/components/ui/icon-picker"

export function AustraliaPathfinder({ initialProfile }: { initialProfile: AuPathfinderProfile }) {
  const locale = useLocale()
  const isKo = locale === "ko"
  const pathLocale = isKo ? "ko" : "en"
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const ranked = useMemo(() => rankAustralianPathways(profile), [profile])
  const ruleSummary = useMemo(() => ruleWeightSummary(profile).slice(0, 3), [profile])

  useEffect(() => {
    setProfile(initialProfile)
  }, [initialProfile])

  const updateProfile = <Key extends keyof AuPathfinderProfile>(key: Key, value: AuPathfinderProfile[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams({
      pathGoal: profile.goal,
      budget: profile.budget,
      timeline: profile.timeline,
      stage: profile.studyStage,
      ...(profile.category !== "any" ? { category: profile.category } : {}),
    })
    track("comparison_personalized", { country: "AU", goal: profile.goal, category: profile.category, timeline: profile.timeline })
    router.replace(`${localizePath("/au/majors", pathLocale)}?${params}`, { scroll: false })
  }

  const categoryOptions = useMemo<PickerOption[]>(() => [
    { value: "any", label: isKo ? "모든 분야" : "All fields", description: isKo ? "전체 경로에서 순위 보기" : "Rank across all study paths", icon: "✨", keywords: "any all" },
    ...STUDY_CATEGORIES.map((category) => {
      const visual = getStudyCategoryVisual(category.id)
      return { value: category.id, label: isKo ? category.labelKo : category.label, description: isKo ? `${category.labelKo} 분야만` : `${category.label} only`, icon: "", iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${category.id} ${category.label} ${category.labelKo}` }
    }),
  ], [isKo])

  const goalOptions = useMemo<PickerOption[]>(() => (isKo
    ? [
        { value: "income", label: "높은 소득", description: "임금 신호를 가장 크게 반영", icon: "💰", keywords: "income salary pay" },
        { value: "security", label: "취업 안정성", description: "부족·고용전망을 더 반영", icon: "🛡️", keywords: "security job stable" },
        { value: "residency", label: "장기 경로", description: "PR 관련 신호를 더 반영", icon: "🧭", keywords: "residency pr pathway" },
        { value: "lower-cost", label: "낮은 학비", description: "학비·기간을 더 반영", icon: "🌱", keywords: "lower cost tuition" },
      ]
    : [
        { value: "income", label: "Higher income", description: "Prioritise pay signals", icon: "💰", keywords: "income salary pay" },
        { value: "security", label: "Job security", description: "Prioritise shortage and outlook", icon: "🛡️", keywords: "security job stable" },
        { value: "residency", label: "Longer-term pathway", description: "Prioritise PR-related signals", icon: "🧭", keywords: "residency pr pathway" },
        { value: "lower-cost", label: "Lower tuition", description: "Prioritise cost and duration", icon: "🌱", keywords: "lower cost tuition" },
      ]), [isKo])

  const budgetOptions = useMemo<PickerOption[]>(() => (isKo
    ? [
        { value: "lower", label: "비용을 낮추고", description: "학비 가중치를 높임", icon: "💵", keywords: "lower cost cheap" },
        { value: "balanced", label: "균형 있게", description: "비용과 결과를 함께 봄", icon: "⚖️", keywords: "balanced" },
        { value: "investment", label: "결과에 투자", description: "임금 신호를 조금 더 반영", icon: "📈", keywords: "invest outcome" },
      ]
    : [
        { value: "lower", label: "Keep tuition lower", description: "Adds weight to cost", icon: "💵", keywords: "lower cost cheap" },
        { value: "balanced", label: "Keep it balanced", description: "Balances cost and outcomes", icon: "⚖️", keywords: "balanced" },
        { value: "investment", label: "Invest for outcomes", description: "Adds weight to pay", icon: "📈", keywords: "invest outcome" },
      ]), [isKo])

  const timelineOptions = useMemo<PickerOption[]>(() => (isKo
    ? [
        { value: "fast", label: "2년 안쪽", description: "짧은 학업 기간을 더 반영", icon: "⚡", keywords: "fast short 2 year" },
        { value: "standard", label: "3–4년 가능", description: "표준 학위 경로도 고려", icon: "📅", keywords: "standard 3 4 year" },
        { value: "flexible", label: "기간 유연", description: "기간보다 결과를 우선", icon: "🕐", keywords: "flexible any time" },
      ]
    : [
        { value: "fast", label: "Within 2 years", description: "Adds weight to duration", icon: "⚡", keywords: "fast short 2 year" },
        { value: "standard", label: "3–4 years is okay", description: "Includes standard degrees", icon: "📅", keywords: "standard 3 4 year" },
        { value: "flexible", label: "Timeline is flexible", description: "Prioritise the outcome", icon: "🕐", keywords: "flexible any time" },
      ]), [isKo])

  const stageOptions = useMemo<PickerOption[]>(() => (isKo
    ? [
        { value: "school", label: "고등학교 이후", description: "학사·디플로마·수료 경로", icon: "🎓", keywords: "school high school fresh" },
        { value: "degree", label: "이미 학위 보유", description: "석사·대학원 수료 옵션도 반영", icon: "🎓", keywords: "degree graduate" },
        { value: "career", label: "경력 전환 중", description: "수료·디플로마 옵션도 반영", icon: "💼", keywords: "career change" },
      ]
    : [
        { value: "school", label: "Starting after school", description: "Bachelor, diploma and certificate routes", icon: "🎓", keywords: "school high school fresh" },
        { value: "degree", label: "I already have a degree", description: "Also values graduate options", icon: "🎓", keywords: "degree graduate" },
        { value: "career", label: "Changing careers", description: "Also values certificate and diploma options", icon: "💼", keywords: "career change" },
      ]), [isKo])

  return <main className="min-h-screen bg-slate-50">
    <section className="bg-gradient-to-b from-blue-600 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Australia Pathfinder · beta</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{isKo ? "내 조건에 맞는 호주 학업 경로" : "Find the best Australia study path"}</h1>

        <form onSubmit={submit} className="mt-6 rounded-2xl border border-blue-400/30 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:items-end">
            <div className="lg:col-span-3"><IconPicker name="category" label={isKo ? "전공" : "Major"} value={profile.category} options={categoryOptions} onChange={(value) => updateProfile("category", value as AuPathfinderCategory | "any")} searchPlaceholder={isKo ? "전공 검색" : "Search majors"} testId="category" /></div>
            <div className="lg:col-span-1"><IconPicker name="goal" label={isKo ? "목표" : "Goal"} value={profile.goal} options={goalOptions} onChange={(value) => updateProfile("goal", value as AuPathfinderGoal)} testId="goal" /></div>
            <div className="lg:col-span-1"><IconPicker name="budget" label={isKo ? "학비" : "Tuition Fees"} value={profile.budget} options={budgetOptions} onChange={(value) => updateProfile("budget", value as AuPathfinderBudget)} testId="budget" /></div>
          </div>
          <div className="mt-3 flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:items-end">
            <div className="lg:col-span-2"><IconPicker name="timeline" label={isKo ? "기간" : "Timeline"} value={profile.timeline} options={timelineOptions} onChange={(value) => updateProfile("timeline", value as AuPathfinderTimeline)} testId="timeline" /></div>
            <div className="lg:col-span-2"><IconPicker name="stage" label={isKo ? "단계" : "Stage"} value={profile.studyStage} options={stageOptions} onChange={(value) => updateProfile("studyStage", value as AuPathfinderStudyStage)} testId="stage" /></div>
            <div className="flex items-end gap-2 lg:col-span-1">
              <button type="submit" className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "검색" : "Search"}</button>
              <button type="button" onClick={() => setProfile(DEFAULT_AU_PATHFINDER_PROFILE)} className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"><RotateCcw className="size-4" /></button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section>
        <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">{isKo ? "설명 가능한 규칙" : "Explainable rules"}</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{isKo ? "현재 순위에서 가장 큰 비중" : "What drives this ranking now"}</h2></div>
          <div className="flex flex-wrap gap-2">{ruleSummary.map(([factor, weight]) => <span key={factor} className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900">{factorLabel(factor, isKo)} {weight}%</span>)}</div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {ranked.slice(0, 6).map((pathway, index) => <PathwayCard key={pathway.concept.id} pathway={pathway} rank={index + 1} locale={pathLocale} isKo={isKo} featured={index === 0} />)}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm"><p className="text-slate-600">{isKo ? "직접 전공을 둘러보고 싶나요?" : "Want to browse every field directly?"}</p><Link href={localizePath("/au/majors?mode=explore", pathLocale)} className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800">{isKo ? "전체 전공 탐색" : "Browse all majors"}<ArrowRight className="size-4" /></Link></div>
      </section>
    </div>
  </main>
}

function PathwayCard({ pathway, rank, locale, isKo, featured }: { pathway: RankedAuPathway; rank: number; locale: "en" | "ko"; isKo: boolean; featured: boolean }) {
  const { Icon, tone } = getStudyCategoryVisual(pathway.concept.category)
  const label = isKo ? pathway.concept.labelKo : pathway.concept.label
  const link = localizePath(`/au/majors/${pathway.concept.slug}`, locale)
  return <article className={`rounded-2xl border bg-white p-5 shadow-sm ${featured ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"}`}>
    <div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{featured ? (isKo ? "가장 잘 맞는 경로" : "Best current fit") : `${isKo ? "추천" : "Rank"} ${rank}`}</p><h3 className="mt-1 text-lg font-semibold text-slate-950">{label}</h3></div><div className="shrink-0 rounded-xl bg-slate-950 px-2.5 py-1.5 text-right text-white"><p className="text-base font-semibold leading-none">{pathway.score}</p><p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">{isKo ? "적합도" : "fit"}</p></div></div><p className="mt-2 text-sm leading-6 text-slate-600">{pathway.concept.description}</p></div></div>
    <div className="mt-5 flex flex-wrap gap-2">{pathway.reasons.map((reason) => <ReasonBadge key={reason.factor} reason={reason} isKo={isKo} />)}</div>
    <dl className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3"><Metric label={isKo ? "대표 중간임금" : "Mapped median pay"} value={moneyShort(pathway.salaryMedianAud)} /><Metric label={isKo ? "2035 고용전망" : "2035 outlook"} value={percentage(pathway.outlook2035Pct)} /><Metric label={isKo ? "부족 신호" : "Shortage signal"} value={percentage(pathway.shortagePct)} /><Metric label={isKo ? "PR 신호" : "PR signal"} value={pathway.prScore == null ? "—" : `${pathway.prScore}/100`} /><Metric label={isKo ? "연간 학비 기준" : "Annual tuition basis"} value={moneyShort(pathway.annualTuitionAud)} /><Metric label={isKo ? "일반 기간" : "Typical duration"} value={pathway.durationYears == null ? "—" : `${pathway.durationYears} ${isKo ? "년" : pathway.durationYears === 1 ? "year" : "years"}`} /></dl>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><p className="text-xs text-slate-500">{isKo ? `검증 신호 ${pathway.evidenceCount}/6개` : `${pathway.evidenceCount}/6 verified signal types`}</p><Link href={link} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">{isKo ? "경로 자세히" : "Explore pathway"}<ArrowRight className="size-4" /></Link></div>
  </article>
}

function ReasonBadge({ reason, isKo }: { reason: AuPathfinderReason; isKo: boolean }) {
  const value = reason.factor === "salary" || reason.factor === "cost" ? moneyShort(reason.value) : reason.factor === "outlook" || reason.factor === "shortage" ? percentage(reason.value) : reason.factor === "residency" ? `${reason.value}/100` : "✓"
  return <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">{reasonLabel(reason.factor, isKo)} {value}</span>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd></div>
}

function factorLabel(factor: string, isKo: boolean) {
  const labels: Record<string, [string, string]> = {
    salary: ["Pay", "임금"], outlook: ["Outlook", "고용전망"], shortage: ["Shortage", "부족 신호"], residency: ["PR signal", "PR 신호"], cost: ["Tuition", "학비"], duration: ["Study time", "학업 기간"], studyFit: ["Study-format fit", "학업 형태"],
  }
  return labels[factor]?.[isKo ? 1 : 0] ?? factor
}

function reasonLabel(factor: string, isKo: boolean) {
  const labels: Record<string, [string, string]> = {
    salary: ["Pay signal", "임금 신호"], outlook: ["2035 outlook", "2035 전망"], shortage: ["Shortage", "부족 신호"], residency: ["PR signal", "PR 신호"], cost: ["Lower tuition", "낮은 학비"], duration: ["Study time", "학업 기간"], studyFit: ["Route available", "학업 경로 있음"],
  }
  return labels[factor]?.[isKo ? 1 : 0] ?? factor
}

function moneyShort(value: number | null) {
  return value == null ? "—" : `A$${Math.round(value / 1000)}K`
}

function percentage(value: number | null) {
  return value == null ? "—" : `${value > 0 ? "+" : ""}${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
}
