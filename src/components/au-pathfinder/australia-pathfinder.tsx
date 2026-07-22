"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, RotateCcw, Check } from "lucide-react"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import {
  DEFAULT_AU_PATHFINDER_PROFILE,
  rankAustralianPathways,
  type AuPathfinderCategory,
  type AuPathfinderGoal,
  type AuPathfinderProfile,
  type AuPathfinderReason,
  type AuPathfinderStudyStage,
  type RankedAuPathway,
} from "@/lib/au-pathfinder"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { track } from "@/lib/analytics"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { IconPicker, type PickerOption } from "@/components/ui/icon-picker"

export function AustraliaPathfinder({ initialProfile }: { initialProfile: AuPathfinderProfile }) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const pathLocale = isKo ? "ko" : "en"
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const ranked = useMemo(() => rankAustralianPathways(profile), [profile])

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
      stage: profile.studyStage,
      ...(profile.category !== "any" ? { category: profile.category } : {}),
    })
    track("comparison_personalized", { country: "AU", goal: profile.goal, category: profile.category, stage: profile.studyStage })
    router.replace(`${localizePath("/au/majors", pathLocale)}?${params}`, { scroll: false })
  }

  const categoryOptions = useMemo<PickerOption[]>(() => [
    { value: "any", label: isKo ? "모든 분야" : "All fields", description: "", icon: "✨", keywords: "any all" },
    ...STUDY_CATEGORIES.map((category) => {
      const visual = getStudyCategoryVisual(category.id)
      return { value: category.id, label: isKo ? category.labelKo : category.label, description: "", icon: "", iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${category.id} ${category.label} ${category.labelKo}` }
    }),
  ], [isKo])

  const goalOptions = useMemo<PickerOption[]>(() => (isKo
    ? [
        { value: "income", label: "높은 소득", description: "", icon: "💰", keywords: "income salary pay" },
        { value: "security", label: "취업 안정성", description: "", icon: "🛡️", keywords: "security job stable" },
        { value: "residency", label: "장기 경로", description: "", icon: "🧭", keywords: "residency pr pathway" },
        { value: "lower-cost", label: "낮은 학비", description: "", icon: "🌱", keywords: "lower cost tuition" },
      ]
    : [
        { value: "income", label: "Higher income", description: "", icon: "💰", keywords: "income salary pay" },
        { value: "security", label: "Job security", description: "", icon: "🛡️", keywords: "security job stable" },
        { value: "residency", label: "Longer-term pathway", description: "", icon: "🧭", keywords: "residency pr pathway" },
        { value: "lower-cost", label: "Lower tuition", description: "", icon: "🌱", keywords: "lower cost tuition" },
      ]), [isKo])

  const stageOptions = useMemo<PickerOption[]>(() => (isKo
    ? [
        { value: "certificate", label: "자격증·디플로마", description: "", icon: "📜", keywords: "certificate diploma vet" },
        { value: "degree", label: "학사·석사", description: "", icon: "🎓", keywords: "bachelor master degree" },
        { value: "related-degree", label: "관련 학위 보유", description: "", icon: "🧩", keywords: "related degree graduate" },
      ]
    : [
        { value: "certificate", label: "Certificate & diploma", description: "", icon: "📜", keywords: "certificate diploma vet" },
        { value: "degree", label: "Bachelor & master", description: "", icon: "🎓", keywords: "bachelor master degree" },
        { value: "related-degree", label: "I have a related degree", description: "", icon: "🧩", keywords: "related degree graduate" },
      ]), [isKo])

  return <main className="min-h-screen bg-slate-50">
    <section className="relative bg-gradient-to-b from-blue-600 to-blue-50">
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Australia Pathfinder</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{isKo ? "내 조건에 맞는 호주 학업 경로" : "Find the best Australia study path"}</h1>

        {/* Goal already includes a lower-tuition intent. Starting point changes
            which routes are realistic, so it stays in the quick search while
            timeline and the duplicate budget weight use safe defaults. */}
        <form onSubmit={submit} className="mt-6 hidden rounded-2xl border border-blue-400/30 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-5 sm:block">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto_auto] lg:items-end">
            <div><IconPicker name="category" label={isKo ? "전공" : "Major"} value={profile.category} options={categoryOptions} onChange={(value) => updateProfile("category", value as AuPathfinderCategory | "any")} searchPlaceholder={isKo ? "전공 검색" : "Search majors"} testId="category" /></div>
            <div><IconPicker name="goal" label={isKo ? "목표" : "Goal"} value={profile.goal} options={goalOptions} onChange={(value) => updateProfile("goal", value as AuPathfinderGoal)} testId="goal" /></div>
            <div><IconPicker name="stage" label={isKo ? "학위" : "Degree"} value={profile.studyStage} options={stageOptions} onChange={(value) => updateProfile("studyStage", value as AuPathfinderStudyStage)} menuAlign="end" testId="stage" /></div>
            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "검색" : "Search"}</button>
            <button type="button" aria-label={isKo ? "검색 조건 초기화" : "Reset search filters"} onClick={() => setProfile(DEFAULT_AU_PATHFINDER_PROFILE)} className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"><RotateCcw className="size-4" /></button>
          </div>
        </form>

        {/* Mobile: Airbnb-style compact pill + step modal */}
        <MobileSearchBar
          profile={profile}
          updateProfile={updateProfile}
          submit={submit}
          isKo={isKo}
          categoryOptions={categoryOptions}
          goalOptions={goalOptions}
          stageOptions={stageOptions}
        />
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section>
        <div className="grid gap-4 lg:grid-cols-2">
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
  return <Link href={link} aria-label={`${isKo ? `${label} 경로 자세히 보기` : `Explore the ${label} pathway`}`} className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
    <article className={`rounded-2xl border bg-white p-5 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-300 group-hover:shadow-[0_14px_32px_rgba(37,99,235,.12)] ${featured ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"}`}>
    <div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" strokeWidth={2.2} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{featured ? (isKo ? "가장 잘 맞는 경로" : "Best current fit") : `${isKo ? "추천" : "Rank"} ${rank}`}</p><h3 className="mt-1 text-lg font-semibold text-slate-950">{label}</h3></div><div className="shrink-0 rounded-xl bg-slate-950 px-2.5 py-1.5 text-right text-white"><p className="text-base font-semibold leading-none">{pathway.score}</p><p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">{isKo ? "적합도" : "fit"}</p></div></div><p className="mt-2 text-sm leading-6 text-slate-600">{pathway.concept.description}</p></div></div>
    <div className="mt-5 flex flex-wrap gap-2">{pathway.reasons.map((reason) => <ReasonBadge key={reason.factor} reason={reason} isKo={isKo} />)}</div>
    <dl className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3"><Metric label={isKo ? "대표 중간임금" : "Mapped median pay"} value={moneyShort(pathway.salaryMedianAud)} /><Metric label={isKo ? "2035 고용전망" : "2035 outlook"} value={percentage(pathway.outlook2035Pct)} /><Metric label={isKo ? "부족 신호" : "Shortage signal"} value={percentage(pathway.shortagePct)} /><Metric label={isKo ? "PR 신호" : "PR signal"} value={pathway.prScore == null ? "—" : `${pathway.prScore}/100`} /><Metric label={isKo ? "연간 학비 기준" : "Annual tuition basis"} value={moneyShort(pathway.annualTuitionAud)} /><Metric label={isKo ? "일반 기간" : "Typical duration"} value={pathway.durationYears == null ? "—" : `${pathway.durationYears} ${isKo ? "년" : pathway.durationYears === 1 ? "year" : "years"}`} /></dl>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><p className="text-xs text-slate-500">{isKo ? `검증 신호 ${pathway.evidenceCount}/6개` : `${pathway.evidenceCount}/6 verified signal types`}</p><span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:text-blue-800">{isKo ? "경로 자세히" : "Explore pathway"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></div>
    </article>
  </Link>
}

function ReasonBadge({ reason, isKo }: { reason: AuPathfinderReason; isKo: boolean }) {
  const value = reason.factor === "salary" || reason.factor === "cost" ? moneyShort(reason.value) : reason.factor === "outlook" || reason.factor === "shortage" ? percentage(reason.value) : reason.factor === "residency" ? `${reason.value}/100` : "✓"
  return <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">{reasonLabel(reason.factor, isKo)} {value}</span>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd></div>
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

const STEP_DEFS = [
  { key: "category", labelKo: "전공", labelEn: "Major", icon: "🎓", tone: "bg-sky-100 text-sky-700" },
  { key: "goal", labelKo: "목표", labelEn: "Goal", icon: "🎯", tone: "bg-violet-100 text-violet-700" },
  { key: "stage", labelKo: "학위", labelEn: "Degree", icon: "📜", tone: "bg-amber-100 text-amber-700" },
] as const

function MobileSearchBar({
  profile, updateProfile, submit, isKo,
  categoryOptions, goalOptions, stageOptions,
}: {
  profile: AuPathfinderProfile
  updateProfile: <Key extends keyof AuPathfinderProfile>(key: Key, value: AuPathfinderProfile[Key]) => void
  submit: (e: React.FormEvent<HTMLFormElement>) => void
  isKo: boolean
  categoryOptions: PickerOption[]
  goalOptions: PickerOption[]
  stageOptions: PickerOption[]
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const allOptions = useMemo(() => ({
    category: categoryOptions,
    goal: goalOptions,
    stage: stageOptions,
  }), [categoryOptions, goalOptions, stageOptions])

  const profileValues = useMemo(() => ({
    category: profile.category,
    goal: profile.goal,
    stage: profile.studyStage,
  }), [profile])

  const getLabel = (key: string, value: string) => {
    const opts = allOptions[key as keyof typeof allOptions]
    const found = opts?.find((o) => o.value === value)
    return found?.label ?? value
  }

  const summary = STEP_DEFS.map((s) => ({
    ...s,
    selected: profileValues[s.key as keyof typeof profileValues],
    selectedLabel: getLabel(s.key, profileValues[s.key as keyof typeof profileValues]),
  }))

  function handleSelect(key: string, value: string) {
    if (key === "category") updateProfile("category", value as AuPathfinderCategory | "any")
    else if (key === "goal") updateProfile("goal", value as AuPathfinderGoal)
    else if (key === "stage") updateProfile("studyStage", value as AuPathfinderStudyStage)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    submit(e)
    setModalOpen(false)
    window.dispatchEvent(new Event("search-modal-close"))
  }

  function openModal() {
    setModalOpen(true)
    setActiveStep(0)
    window.dispatchEvent(new Event("search-modal-open"))
  }

  function closeModal() {
    setModalOpen(false)
    window.dispatchEvent(new Event("search-modal-close"))
  }

  return <>
    <button type="button" onClick={openModal} className="mt-6 flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md sm:hidden">
      <span className="flex items-center gap-1.5">
        {summary.map((step) => <MobileStepIcon key={step.key} step={step} option={allOptions[step.key as keyof typeof allOptions].find((option) => option.value === step.selected)} compact />)}
      </span>
      <div className="min-w-0 flex-1 text-left border-l border-slate-200 pl-3 ml-1">
        <p className="truncate text-sm font-semibold text-slate-900">{summary[0].selectedLabel}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{summary.slice(1).map((s) => s.selectedLabel).join(" · ")}</p>
      </div>
    </button>

    {modalOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:hidden" onClick={closeModal}>
      <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <button type="button" onClick={closeModal} className="text-sm font-semibold text-slate-500 hover:text-slate-900">{isKo ? "닫기" : "Close"}</button>
          <p className="text-sm font-semibold text-slate-900">{isKo ? "조건 선택" : "Set filters"}</p>
          <div className="w-10" />
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {summary.map((step, i) => {
            const isOpen = activeStep === i
            return <div key={step.key} className="mb-3">
              <button type="button" onClick={() => setActiveStep(isOpen ? null : i)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300">
                <MobileStepIcon step={step} option={allOptions[step.key as keyof typeof allOptions].find((option) => option.value === step.selected)} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{isKo ? step.labelKo : step.labelEn}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-slate-800">{step.selectedLabel}</p>
                </div>
                <span className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>
              {isOpen && <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
                {allOptions[step.key as keyof typeof allOptions].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => { handleSelect(step.key, opt.value); setActiveStep(null) }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${opt.value === step.selected ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-white"}`}>
                    <MobileOptionIcon option={opt} fallback={step.icon} tone={step.tone} />
                    <span className="min-w-0 flex-1 text-sm font-medium">{opt.label}</span>
                    {opt.value === step.selected && <Check className="size-4 shrink-0 text-blue-600" />}
                  </button>
                ))}
              </div>}
            </div>
          })}
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <form onSubmit={handleSubmit}>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "검색" : "Search"}</button>
          </form>
        </div>
      </div>
    </div>}
  </>
}

function MobileStepIcon({ step, option, compact = false }: { step: (typeof STEP_DEFS)[number] & { selected?: string; selectedLabel?: string }; option?: PickerOption; compact?: boolean }) {
  return <MobileOptionIcon option={option} fallback={step.icon} tone={step.tone} compact={compact} />
}

function MobileOptionIcon({ option, fallback, tone, compact = false }: { option?: PickerOption; fallback: string; tone: string; compact?: boolean }) {
  const Icon = option?.iconComponent
  const iconTone = option?.iconTone ?? tone
  const size = compact ? "size-8 rounded-full" : "size-9 rounded-xl"
  return <span aria-hidden="true" className={`grid shrink-0 place-items-center ${size} ${iconTone} ${Icon ? "" : "text-base"}`}>{Icon ? <Icon className={compact ? "size-4" : "size-[18px]"} strokeWidth={2.2} /> : option?.icon || fallback}</span>
}
