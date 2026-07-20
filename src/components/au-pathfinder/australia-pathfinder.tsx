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

type Choice<T extends string> = { value: T; label: string; detail?: string }

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

  const goals: Choice<AuPathfinderGoal>[] = isKo
    ? [
        { value: "income", label: "높은 소득" },
        { value: "security", label: "취업 안정성" },
        { value: "residency", label: "장기 경로" },
        { value: "lower-cost", label: "낮은 학비" },
      ]
    : [
        { value: "income", label: "Higher income" },
        { value: "security", label: "Job security" },
        { value: "residency", label: "Longer-term pathway" },
        { value: "lower-cost", label: "Lower tuition" },
      ]
  const budgets: Choice<AuPathfinderBudget>[] = isKo
    ? [
        { value: "lower", label: "비용을 낮추고 싶어요" },
        { value: "balanced", label: "균형 있게" },
        { value: "investment", label: "결과에 투자 가능" },
      ]
    : [
        { value: "lower", label: "Keep tuition lower" },
        { value: "balanced", label: "Keep it balanced" },
        { value: "investment", label: "Invest for outcomes" },
      ]
  const timelines: Choice<AuPathfinderTimeline>[] = isKo
    ? [
        { value: "fast", label: "2년 안쪽" },
        { value: "standard", label: "3–4년 가능" },
        { value: "flexible", label: "기간 유연" },
      ]
    : [
        { value: "fast", label: "Within 2 years" },
        { value: "standard", label: "3–4 years is okay" },
        { value: "flexible", label: "Timeline is flexible" },
      ]
  const stages: Choice<AuPathfinderStudyStage>[] = isKo
    ? [
        { value: "school", label: "고등학교 이후 시작" },
        { value: "degree", label: "이미 학위가 있어요" },
        { value: "career", label: "경력 전환 중" },
      ]
    : [
        { value: "school", label: "Starting after school" },
        { value: "degree", label: "I already have a degree" },
        { value: "career", label: "Changing careers" },
      ]
  const categories: Choice<AuPathfinderCategory | "any">[] = [
    { value: "any", label: isKo ? "아직 열어둘게요" : "Keep every field open", detail: isKo ? "전체 경로에서 순위 보기" : "Rank across all study paths" },
    ...STUDY_CATEGORIES.map((category) => ({
      value: category.id,
      label: isKo ? category.labelKo : category.label,
      detail: isKo ? "이 분야 안에서만 보기" : "Rank paths in this field only",
    })),
  ]

  return <main className="min-h-screen bg-slate-50">
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Australia Pathfinder · beta</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{isKo ? "내 조건에서 가장 유리한 호주 학업·직업 경로를 찾아보세요" : "Find the Australia study path that best fits your constraints"}</h1>
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h2 className="text-xl font-semibold text-slate-950">{isKo ? "나에게 맞게 정렬" : "Personalise the ranking"}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{isKo ? "다섯 가지 답변으로 순위와 근거가 즉시 달라집니다." : "Five answers change the order and the visible reasons."}</p></div>
          <button type="button" onClick={() => setProfile(DEFAULT_AU_PATHFINDER_PROFILE)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-700"><RotateCcw className="size-4" />{isKo ? "초기화" : "Reset"}</button>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChoiceGroup label={isKo ? "가장 중요한 목표" : "What matters most?"} value={profile.goal} choices={goals} onChange={(value) => updateProfile("goal", value)} />
          <CategorySelect label={isKo ? "관심 분야" : "Which field interests you?"} value={profile.category} choices={categories} onChange={(value) => updateProfile("category", value)} />
          <ChoiceGroup label={isKo ? "학비 여유" : "How should tuition affect the choice?"} value={profile.budget} choices={budgets} onChange={(value) => updateProfile("budget", value)} />
          <ChoiceGroup label={isKo ? "공부 가능한 기간" : "How soon do you want to qualify?"} value={profile.timeline} choices={timelines} onChange={(value) => updateProfile("timeline", value)} />
          <ChoiceGroup label={isKo ? "현재 단계" : "Where are you starting from?"} value={profile.studyStage} choices={stages} onChange={(value) => updateProfile("studyStage", value)} />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5"><button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "검색" : "Search"}</button><p className="text-xs leading-5 text-slate-500">{isKo ? "답변은 이 링크에만 반영됩니다. 계정을 만들기 전에는 저장하지 않습니다." : "Answers stay in this link only; they are not saved before you create a plan."}</p></div>
      </form>

      <section className="mt-8">
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

function ChoiceGroup<T extends string>({ label, value, choices, onChange }: { label: string; value: T; choices: Choice<T>[]; onChange: (value: T) => void }) {
  return <label className="block"><span className="text-sm font-semibold text-slate-900">{label}</span><select value={value} onChange={(event) => onChange(event.target.value as T)} className="mt-3 block h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select></label>
}

function CategorySelect({ label, value, choices, onChange }: { label: string; value: AuPathfinderCategory | "any"; choices: Choice<AuPathfinderCategory | "any">[]; onChange: (value: AuPathfinderCategory | "any") => void }) {
  const selected = choices.find((choice) => choice.value === value)
  return <label className="block"><span className="text-sm font-semibold text-slate-900">{label}</span><select value={value} onChange={(event) => onChange(event.target.value as AuPathfinderCategory | "any")} className="mt-3 block h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select><span className="mt-2 block text-xs leading-5 text-slate-500">{selected?.detail}</span></label>
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
