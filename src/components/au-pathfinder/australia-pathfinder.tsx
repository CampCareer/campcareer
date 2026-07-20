"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronRight, RotateCcw, MapPin, BookOpen, Target, BarChart3 } from "lucide-react"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import {
  DEFAULT_AU_PATHFINDER_PROFILE,
  rankAustralianPathways,
  rankAllPathways,
  type AuPathfinderBudget,
  type AuPathfinderCategory,
  type AuPathfinderGoal,
  type AuPathfinderProfile,
  type AuPathfinderReason,
  type AuPathfinderVisa,
  type RankedAuPathway,
} from "@/lib/au-pathfinder"
import { localizePath } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/locale-provider"
import { track } from "@/lib/analytics"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"

const WIZARD_STEPS = ["visa", "goal", "category", "results"] as const
type WizardStep = (typeof WIZARD_STEPS)[number]

const VISA_OPTIONS: Array<{ value: AuPathfinderVisa; koLabel: string; koDesc: string; enLabel: string; enDesc: string; icon: string; tag?: string }> = [
  { value: "whv", koLabel: "워킹홀리데이 비자", koDesc: "최대 12개월, 학업 4개월 제한, 취업 가능", enLabel: "Working Holiday Visa", enDesc: "Up to 12 months, study max 4 months, work allowed", icon: "🎒", tag: "WHV" },
  { value: "student", koLabel: "학생 비자", koDesc: "정규 학업, 시간제 취업 가능", enLabel: "Student Visa", enDesc: "Full-time study, part-time work allowed", icon: "📚", tag: "500" },
  { value: "skilled", koLabel: "스킬 이민", koDesc: "포인트 기반, 영주권 경로", enLabel: "Skilled Migration", enDesc: "Points-based, PR pathway", icon: "💼", tag: "189/190" },
]

const GOAL_OPTIONS: Array<{ value: AuPathfinderGoal; koLabel: string; koDesc: string; enLabel: string; enDesc: string; icon: string }> = [
  { value: "income", koLabel: "높은 소득", koDesc: "임금 신호를 가장 크게 반영", enLabel: "Higher income", enDesc: "Prioritise pay signals", icon: "💰" },
  { value: "security", koLabel: "취업 안정성", koDesc: "부족·고용전망을 더 반영", enLabel: "Job security", enDesc: "Prioritise shortage and outlook", icon: "🛡️" },
  { value: "residency", koLabel: "장기 경로", koDesc: "PR 관련 신호를 더 반영", enLabel: "Long-term pathway", enDesc: "Prioritise PR-related signals", icon: "🧭" },
  { value: "lower-cost", koLabel: "낮은 학비", koDesc: "학비·기간을 더 반영", enLabel: "Lower tuition", enDesc: "Prioritise cost and duration", icon: "🌱" },
]

export function AustraliaPathfinder({ initialProfile }: { initialProfile: AuPathfinderProfile }) {
  const locale = useLocale()
  const isKo = locale === "ko"
  const pathLocale = isKo ? "ko" : "en"
  const [profile, setProfile] = useState(initialProfile)
  const [step, setStep] = useState<WizardStep>("visa")
  const stepIndex = WIZARD_STEPS.indexOf(step)

  const ranked = useMemo(() => rankAustralianPathways(profile), [profile])
  const allRanked = useMemo(() => {
    if (profile.visa === "whv") return rankAllPathways(profile)
    return []
  }, [profile])

  useEffect(() => {
    setProfile(initialProfile)
  }, [initialProfile])

  const updateProfile = <Key extends keyof AuPathfinderProfile>(key: Key, value: AuPathfinderProfile[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  function goNext() {
    const idx = WIZARD_STEPS.indexOf(step)
    if (idx < WIZARD_STEPS.length - 1) {
      setStep(WIZARD_STEPS[idx + 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function goBack() {
    const idx = WIZARD_STEPS.indexOf(step)
    if (idx > 0) {
      setStep(WIZARD_STEPS[idx - 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function reset() {
    setProfile(DEFAULT_AU_PATHFINDER_PROFILE)
    setStep("visa")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const upgradePaths = useMemo(() => {
    if (profile.visa !== "whv") return []
    return allRanked.filter((p) => !p.whvEligible).slice(0, 3)
  }, [allRanked, profile.visa])

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-blue-600 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Australia Pathfinder</p>
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white transition"><RotateCcw className="size-3" /> {isKo ? "처음부터" : "Start over"}</button>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {isKo ? "내 조건에 맞는 호주 학업 경로" : "Find the best Australia study path"}
          </h1>

          {/* Step Indicator */}
          <div className="mt-6 flex items-center gap-2">
            {WIZARD_STEPS.filter((s) => s !== "results").map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => { setStep(s); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                    WIZARD_STEPS.indexOf(step) > i ? "bg-white text-blue-600" :
                    step === s ? "bg-white text-blue-700 ring-2 ring-white/50" :
                    "bg-white/20 text-white/60 hover:bg-white/30"
                  }`}
                >
                  {WIZARD_STEPS.indexOf(step) > i ? "✓" : i + 1}
                </button>
                {i < 2 && <div className={`h-0.5 w-8 sm:w-12 ${WIZARD_STEPS.indexOf(step) > i ? "bg-white" : "bg-white/20"}`} />}
              </div>
            ))}
            <div className="ml-1 text-xs font-medium text-white/50">
              {step === "results" ? (isKo ? "결과" : "Results") : `${stepIndex + 1} / 3`}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {step === "visa" && (
          <StepCard title={isKo ? "비자 유형을 선택하세요" : "Select your visa type"} subtitle={isKo ? "어떤 비자로 호주에 가시나요?" : "Which visa are you considering for Australia?"}>
            <div className="grid gap-3 sm:grid-cols-3">
              {VISA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { updateProfile("visa", opt.value); goNext() }}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition ${
                    profile.visa === opt.value
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  {opt.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{opt.tag}</span>
                  )}
                  <span className="text-4xl">{opt.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{isKo ? opt.koLabel : opt.enLabel}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{isKo ? opt.koDesc : opt.enDesc}</p>
                  </div>
                  <ChevronRight className="size-4 text-slate-300 transition group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === "goal" && (
          <StepCard title={isKo ? "가장 중요한 목표는?" : "What matters most to you?"} subtitle={isKo ? "순위 알고리즘에 반영됩니다" : "This adjusts the ranking algorithm"}>
            <div className="grid gap-3 sm:grid-cols-2">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { updateProfile("goal", opt.value); goNext() }}
                  className={`group flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition ${
                    profile.goal === opt.value
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-950">{isKo ? opt.koLabel : opt.enLabel}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{isKo ? opt.koDesc : opt.enDesc}</p>
                  </div>
                  <ChevronRight className="mt-1 size-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === "category" && (
          <StepCard title={isKo ? "관심 분야를 선택하세요" : "Pick your field of interest"} subtitle={isKo ? "특정 분야에 집중하거나 모든 분야를 탐색하세요" : "Focus on a specific field or explore everything"}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryButton
                id="any"
                label={isKo ? "모든 분야" : "All fields"}
                description={isKo ? "전체 경로에서 순위 보기" : "Rank across all study paths"}
                emoji="✨"
                selected={profile.category === "any"}
                onClick={() => { updateProfile("category", "any"); goNext() }}
              />
              {STUDY_CATEGORIES.map((cat) => {
                const visual = getStudyCategoryVisual(cat.id)
                return (
                  <CategoryButton
                    key={cat.id}
                    id={cat.id}
                    label={isKo ? cat.labelKo : cat.label}
                    description={isKo ? `${cat.labelKo} 분야` : `${cat.label} field`}
                    emoji=""
                    iconComponent={visual.Icon}
                    iconTone={visual.tone}
                    selected={profile.category === cat.id}
                    onClick={() => { updateProfile("category", cat.id as AuPathfinderCategory); goNext() }}
                  />
                )
              })}
            </div>
          </StepCard>
        )}

        {step === "results" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-600">{isKo ? "추천 경로" : "Recommended paths"}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">{isKo ? "이런 경로가 있습니다" : "Here are your best options"}</h2>
              </div>
              <button onClick={goBack} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <ArrowLeft className="size-4" /> {isKo ? "수정" : "Adjust"}
              </button>
            </div>

            <div className="space-y-4">
              {ranked.slice(0, 6).map((pathway, index) => (
                <PathwayCard key={pathway.concept.id} pathway={pathway} rank={index + 1} locale={pathLocale} isKo={isKo} featured={index === 0} />
              ))}
            </div>

            {profile.visa === "whv" && upgradePaths.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    {isKo ? "💡 학생 비자로 전환하면?" : "💡 If you switch to a Student Visa?"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    {isKo
                      ? "WHV로는 학업 4개월 제한이 있습니다. 학생 비자로 전환하면 더 긴 과정을 이수하고 취업 경로를 넓힐 수 있습니다."
                      : "WHV limits study to4 months. Switching to a Student Visa lets you pursue longer programs and expand career options."}
                  </p>
                </div>
                <div className="space-y-4">
                  {upgradePaths.map((pathway, index) => (
                    <PathwayCard key={pathway.concept.id} pathway={pathway} rank={index + 1} locale={pathLocale} isKo={isKo} featured={false} upgrade />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm">
              <p className="text-slate-600">{isKo ? "예산 계산이 필요하다면?" : "Need to calculate your budget?"}</p>
              <div className="flex items-center gap-4">
                <Link href={localizePath("/au/budget", pathLocale)} className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800">
                  {isKo ? "예산 플래너" : "Budget Planner"}<ArrowRight className="size-4" />
                </Link>
                <Link href={localizePath("/au/majors?mode=explore", pathLocale)} className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-blue-700">
                  {isKo ? "전체 전공 탐색" : "Browse all majors"}
                </Link>
              </div>
            </div>
          </>
        )}

        {step !== "results" && stepIndex < WIZARD_STEPS.length - 2 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="size-4" /> {isKo ? "이전" : "Back"}
            </button>
            <button
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {isKo ? "건너뛰기" : "Skip"} <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function CategoryButton({ id, label, description, emoji, iconComponent: Icon, iconTone, selected, onClick }: {
  id: string; label: string; description: string; emoji: string; iconComponent?: React.ComponentType<{ className?: string; strokeWidth?: number }>; iconTone?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
        selected ? "border-blue-600 bg-blue-50 shadow-md" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
      }`}
    >
      {emoji ? (
        <span className="text-2xl">{emoji}</span>
      ) : Icon && iconTone ? (
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconTone}`}><Icon className="size-5" strokeWidth={2.2} /></span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-950 truncate">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500 truncate">{description}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
    </button>
  )
}

function PathwayCard({ pathway, rank, locale, isKo, featured, upgrade }: {
  pathway: RankedAuPathway; rank: number; locale: "en" | "ko"; isKo: boolean; featured: boolean; upgrade?: boolean
}) {
  const { Icon, tone } = getStudyCategoryVisual(pathway.concept.category)
  const label = isKo ? pathway.concept.labelKo : pathway.concept.label
  const link = localizePath(`/au/majors/${pathway.concept.slug}`, locale)
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${upgrade ? "border-amber-200 bg-amber-50/30" : featured ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"}`}>
      {upgrade && (
        <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
          <span>🎓</span> {isKo ? "학생 비자 경로" : "Student Visa path"}
        </div>
      )}
      <div className="flex items-start gap-4">
        <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">
                {featured ? (isKo ? "가장 잘 맞는 경로" : "Best fit") : `${isKo ? "추천" : "Rank"} ${rank}`}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">{label}</h3>
            </div>
            <div className="shrink-0 rounded-xl bg-slate-950 px-2.5 py-1.5 text-right text-white">
              <p className="text-base font-semibold leading-none">{pathway.score}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">{isKo ? "적합도" : "fit"}</p>
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{pathway.concept.description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pathway.reasons.map((reason) => (
          <ReasonBadge key={reason.factor} reason={reason} isKo={isKo} />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <Metric label={isKo ? "중간임금" : "Median pay"} value={moneyShort(pathway.salaryMedianAud)} />
        <Metric label={isKo ? "2035 전망" : "2035 outlook"} value={percentage(pathway.outlook2035Pct)} />
        <Metric label={isKo ? "부족 신호" : "Shortage"} value={percentage(pathway.shortagePct)} />
        <Metric label={isKo ? "PR 신호" : "PR signal"} value={pathway.prScore == null ? "—" : `${pathway.prScore}/100`} />
        <Metric label={isKo ? "연간 학비" : "Annual tuition"} value={moneyShort(pathway.annualTuitionAud)} />
        <Metric label={isKo ? "기간" : "Duration"} value={pathway.durationYears == null ? "—" : `${pathway.durationYears}${isKo ? "년" : "y"}`} />
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <p className="text-[11px] text-slate-400">{isKo ? `검증 신호 ${pathway.evidenceCount}/6` : `${pathway.evidenceCount}/6 signals`}</p>
        <Link href={link} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">
          {isKo ? "자세히" : "Explore"} <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}

function ReasonBadge({ reason, isKo }: { reason: AuPathfinderReason; isKo: boolean }) {
  const value = reason.factor === "salary" || reason.factor === "cost" ? moneyShort(reason.value) :
    reason.factor === "outlook" || reason.factor === "shortage" ? percentage(reason.value) :
    reason.factor === "residency" ? `${reason.value}/100` : "✓"
  return (
    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
      {reasonLabel(reason.factor, isKo)} {value}
    </span>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  )
}

function reasonLabel(factor: string, isKo: boolean) {
  const labels: Record<string, [string, string]> = {
    salary: ["Pay signal", "임금 신호"], outlook: ["2035 outlook", "2035 전망"], shortage: ["Shortage", "부족 신호"],
    residency: ["PR signal", "PR 신호"], cost: ["Lower tuition", "낮은 학비"], duration: ["Study time", "학업 기간"],
    studyFit: ["Route available", "경로 있음"],
  }
  return labels[factor]?.[isKo ? 1 : 0] ?? factor
}

function moneyShort(value: number | null) {
  return value == null ? "—" : `A$${Math.round(value / 1000)}K`
}

function percentage(value: number | null) {
  return value == null ? "—" : `${value > 0 ? "+" : ""}${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
}
