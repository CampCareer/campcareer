"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  CalendarClock,
  Circle,
  CircleCheck,
  Compass,
  FileCheck2,
  GraduationCap,
  Languages,
  Lightbulb,
  Target,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { buildPlanHealth, type PlanHealthSignal } from "@/lib/plan-health"
import { fieldNameToConceptId } from "@/lib/au-major-signals"

/* ── Types ── */

export type HomeGoalProfile = {
  plan_title: string
  strategy: string
  target_occupation_title: string
  target_study_concept_label: string
  target_intake_month: string | null
}

export type HomeGoalOption = {
  id: string
  position: number
  source_type: "saved_university" | "saved_course"
  title: string
  provider_name: string
  field_name: string
}

export type HomeTask = {
  id: string
  title: string
  kind: "application" | "english" | "money" | "research" | "personal"
  status: "todo" | "done"
  due_date: string | null
}

export type HomeApplication = {
  id: string
  title: string
  deadline_date: string | null
  status: "planning" | "preparing" | "submitted" | "offer" | "declined"
}

export type HomeNote = {
  id: string
  entry_date: string
  title: string
  content: string
  created_at: string
}

export type HomeCompareSchool = {
  id: string
  college_name: string
  college_state: string
  college_city?: string | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  score?: number | null
  roi_score?: number | null
}

type HomeDashboardProps = {
  goalProfile: HomeGoalProfile
  goalOptions: HomeGoalOption[]
  tasks: HomeTask[]
  applications: HomeApplication[]
  notes: HomeNote[]
  compareSchools: HomeCompareSchool[]
  currentSavings: number | null
  monthlySaving: number | null
  targetAmount: number | null
  targetDate: string | null
  currency: string
  currentEnglishScore: number | null
  targetEnglishScore: number | null
  englishExam: string
  englishTestDate?: string | null
  evidenceCount: number
  leadingOptionTitle?: string | null
  leadingRationale?: string | null
  onNavigate: (area: string) => void
}

/* ── Daily insight rotation ── */

const DAILY_INSIGHTS: Array<{ en: string; ko: string; source: string }> = [
  {
    en: "International students contribute $40B+ annually to the Australian economy.",
    ko: "유학생들은 매년 호주 경제에 400억 달러 이상 기여하고 있습니다.",
    source: "Australian Government, 2025",
  },
  {
    en: "Australia's unemployment rate remains below 4% — one of the lowest among OECD nations.",
    ko: "호주의 실업률은 OECD 국가 중 가장 낮은 수준인 4% 이하를 유지하고 있습니다.",
    source: "ABS Labour Force, 2025",
  },
  {
    en: "Healthcare and social assistance is Australia's largest employing sector with 1.8M+ workers.",
    ko: "보건 및 사회 복지는 180만 명 이상의 근로자를 보유한 호주 최대 고용 분야입니다.",
    source: "ABS, 2025",
  },
  {
    en: "Skilled migration pathway: 70% of international graduates receive a temporary graduate visa.",
    ko: "스키드 이민 경로: 국제 졸업생의 70%가 졸업생 임시 비자를 받습니다.",
    source: "Department of Home Affairs, 2025",
  },
  {
    en: "Regional study can add 1–2 extra migration points and reduce tuition costs by 15–30%.",
    ko: "지방 학습은 이민 포인트 1–2점 추가와 학비 15–30% 절감을 제공합니다.",
    source: "Department of Home Affairs, 2025",
  },
  {
    en: "The median starting salary for nursing graduates in Australia is AUD $65,000.",
    ko: "호주 간호학과 졸업생의 초임 중위임금은 AUD $65,000입니다.",
    source: "QILT Graduate Outcomes Survey, 2024",
  },
  {
    en: "IT and computing graduates have one of the highest employment rates at 84%.",
    ko: "IT 및 컴퓨팅 졸업생의 취업률은 84%로 가장 높은 수준 중 하나입니다.",
    source: "QILT Graduate Outcomes Survey, 2024",
  },
  {
    en: "Engineering graduates earn a median salary of $78,000 within 6 months of graduation.",
    ko: "공학 졸업생은 졸업 후 6개월 이내 중위임금 $78,000을 받습니다.",
    source: "QILT Graduate Outcomes Survey, 2024",
  },
  {
    en: "Tuition fees for international students in Australia range from AUD $20,000 to $55,000 per year.",
    ko: "호주 국제학생 학비는 연간 AUD $20,000 ~ $55,000 범위입니다.",
    source: "Study Australia, 2025",
  },
  {
    en: "Australia ranks in the top 10 globally for quality of life and education quality.",
    ko: "호주는 삶의 질과 교육의 질에서 전 세계 10위권 내에 랭크됩니다.",
    source: "OECD Better Life Index, 2025",
  },
  {
    en: "Post-study work visa allows 2–4 years of work rights after graduation.",
    ko: "졸업 후 취업 비자는 졸업 후 2~4년의 취업 권한을 허용합니다.",
    source: "Department of Home Affairs, 2025",
  },
  {
    en: "Over 700,000 international students were enrolled in Australia in 2025.",
    ko: "2025년 호주에 70만 명 이상의 국제학생이 등록되어 있습니다.",
    source: "CRICOS, 2025",
  },
]

function getDailyInsight(today: Date): { en: string; ko: string; source: string } {
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  )
  return DAILY_INSIGHTS[dayOfYear % DAILY_INSIGHTS.length]
}

/* ── Main component ── */

export function HomeDashboard({
  goalProfile,
  goalOptions,
  tasks,
  applications,
  notes,
  compareSchools,
  currentSavings,
  monthlySaving,
  targetAmount,
  targetDate,
  currency,
  currentEnglishScore,
  targetEnglishScore,
  englishExam,
  englishTestDate = null,
  evidenceCount,
  leadingOptionTitle = null,
  leadingRationale = null,
  onNavigate,
}: HomeDashboardProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const today = new Date()
  const insight = getDailyInsight(today)

  /* Occupation signal for selected major */
  const [occSignal, setOccSignal] = useState<{ shortagePct: number | null; medianSalary: number | null; onCsol: boolean; csolCount: number; representativeOccupations: Array<{ label: string; labelKo: string }> } | null>(null)

  useEffect(() => {
    const label = goalProfile.target_study_concept_label
    if (!label) return
    const conceptId = fieldNameToConceptId(label)
    if (!conceptId) return
    let cancelled = false
    fetch("/api/au/concept-occupation-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concepts: [conceptId] }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        const item = json.concepts?.[conceptId]
        if (item) {
          setOccSignal({
            shortagePct: item.nationalShortagePct,
            medianSalary: item.medianSalaryMedian,
            onCsol: item.csolCount > 0,
            csolCount: item.csolCount,
            representativeOccupations: item.representativeOccupations ?? [],
          })
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [goalProfile.target_study_concept_label])

  const greeting = isKo
    ? `${today.getHours() < 12 ? "좋은 아침이에요" : today.getHours() < 18 ? "좋은 오후에요" : "좋은 저녁이에요"}`
    : `${today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening"}`
  const dateStr = today.toLocaleDateString(isKo ? "ko-KR" : "en-AU", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  /* Readiness */
  const isReadyGoal = Boolean(goalProfile.target_occupation_title || goalProfile.target_study_concept_label)
  const hasShortlist = goalOptions.length > 0
  const hasIntake = Boolean(goalProfile.target_intake_month)
  const hasResearch = evidenceCount > 0
  const hasEnglishBaseline = currentEnglishScore != null
  const hasEnglishTarget = targetEnglishScore != null
  const hasFundTarget = targetAmount != null
  const hasSavingPlan = monthlySaving != null && monthlySaving > 0
  const hasApplicationSchedule =
    tasks.some((t) => t.kind === "application") ||
    applications.some((a) => a.status !== "declined" && a.status !== "offer")
  const readiness = [isReadyGoal, hasShortlist, hasIntake, hasResearch, hasEnglishBaseline, hasEnglishTarget, hasFundTarget, hasSavingPlan, hasApplicationSchedule]
  const readyCount = readiness.filter(Boolean).length

  /* Money */
  const remaining = targetAmount == null ? null : Math.max(targetAmount - (currentSavings ?? 0), 0)

  /* English */
  const scoreGap =
    currentEnglishScore != null && targetEnglishScore != null
      ? Math.max(targetEnglishScore - currentEnglishScore, 0)
      : null

  /* Upcoming tasks */
  const upcomingTasks = tasks
    .filter((t) => t.status === "todo" && t.due_date)
    .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
    .slice(0, 3)

  /* Recent notes */
  const recentNotes = [...notes].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 2)

  /* Top schools from compare */
  const topSchools = [...compareSchools]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3)
  const savedSchools = goalOptions
    .filter((option) => option.source_type === "saved_university")
    .map((option) => ({
      id: option.id,
      college_name: option.provider_name || option.title,
      college_state: "",
      college_city: null,
      tuition: null,
      median_earnings: null,
      employment_rate: null,
      score: null,
    }))
    .slice(0, 3)
  const displayedSchools = topSchools.length ? topSchools : savedSchools

  /* ── Plan Health ── */
  const applicationDeadlineItems = [
    ...tasks.filter((t) => t.kind === "application" && t.status === "todo" && t.due_date).map((t) => ({ title: t.title, dueDate: t.due_date! })),
    ...applications.filter((a) => a.status !== "declined" && a.status !== "offer" && a.deadline_date).map((a) => ({ title: a.title, dueDate: a.deadline_date! })),
  ].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const nextDeadline = applicationDeadlineItems[0] ?? null
  const planHealth = buildPlanHealth({
    locale: isKo ? "ko" : "en",
    targetIntakeMonth: goalProfile.target_intake_month,
    applicationDeadlines: applicationDeadlineItems,
    currentSavings: currentSavings ?? 0,
    monthlySaving: monthlySaving ?? 0,
    targetAmount,
    targetDate,
    englishTargetScore: targetEnglishScore,
    englishTestDate,
    leadingOptionTitle,
    leadingRationale,
  })
  const nextMove = planHealth.nextAction ?? getNextMove({ isKo, hasShortlist, hasEnglishBaseline, hasFundTarget, hasApplicationSchedule, nextDeadline })
  const todayKey = today.toISOString().slice(0, 10)
  const fundingSignal = planHealth.signals.find((signal) => signal.id.startsWith("funding"))
  const deadlineIsOverdue = Boolean(nextDeadline && nextDeadline.dueDate < todayKey)
  const deadlineIsSoon = Boolean(nextDeadline && nextDeadline.dueDate >= todayKey && nextDeadline.dueDate <= addDays(todayKey, 30))
  const decisionReady = Boolean(goalProfile.target_occupation_title && hasShortlist && hasFundTarget && hasEnglishBaseline && hasEnglishTarget)
  const dashboardMode = !hasShortlist ? "start" : planHealth.status === "at-risk" ? "risk" : decisionReady ? "ready" : "build"
  const actionSignals = planHealth.signals.filter((signal) => signal.severity !== "positive")
  const checkpoints: HomeCheckpoint[] = [
    {
      id: "applications",
      label: isKo ? "지원 일정" : "Application timing",
      value: deadlineIsOverdue
        ? (isKo ? "마감 확인 필요" : "Deadline overdue")
        : deadlineIsSoon
          ? (isKo ? "30일 이내 마감" : "Due within 30 days")
          : hasApplicationSchedule
            ? (isKo ? "일정 설정됨" : "Schedule set")
            : (isKo ? "일정 추가" : "Add a date"),
      detail: nextDeadline ? `${nextDeadline.title} · ${formatShortDate(nextDeadline.dueDate, locale)}` : (isKo ? "후보 한 곳의 마감일부터 기록하세요." : "Start with one deadline for a shortlisted option."),
      href: "/applications",
      icon: CalendarClock,
      tone: deadlineIsOverdue ? "critical" : deadlineIsSoon ? "attention" : hasApplicationSchedule ? "complete" : "empty",
    },
    {
      id: "english",
      label: isKo ? "영어 조건" : "English requirement",
      value: scoreGap == null
        ? (isKo ? "점수 입력" : "Add scores")
        : scoreGap === 0
          ? (isKo ? "목표 충족" : "Target met")
          : `+${scoreGap.toFixed(1)}`,
      detail: scoreGap == null
        ? (isKo ? "현재와 목표 점수를 기준으로 준비 기간을 잡으세요." : "Record current and target scores to plan your preparation time.")
        : `${englishExam || "IELTS"} ${currentEnglishScore?.toFixed(1)} → ${targetEnglishScore?.toFixed(1)}`,
      href: "/english",
      icon: Languages,
      tone: scoreGap == null ? "empty" : scoreGap === 0 ? "complete" : "attention",
    },
    {
      id: "funding",
      label: isKo ? "자금 계획" : "Funding plan",
      value: targetAmount == null
        ? (isKo ? "목표 금액 입력" : "Set total need")
        : remaining === 0
          ? (isKo ? "목표 충족" : "Target met")
          : formatMoney(remaining ?? 0, currency),
      detail: targetAmount == null
        ? (isKo ? "학비·생활비·초기 비용의 기준을 먼저 잡으세요." : "Start with tuition, living and upfront-cost assumptions.")
        : fundingSignal?.description ?? (monthlySaving && monthlySaving > 0 ? (isKo ? `월 ${formatMoney(monthlySaving, currency)} 저축` : `${formatMoney(monthlySaving, currency)} saved monthly`) : (isKo ? "월 저축 계획을 추가하세요." : "Add a monthly saving pace.")),
      href: "/budget",
      icon: Banknote,
      tone: fundingSignal?.severity === "critical" ? "critical" : fundingSignal ? "attention" : remaining === 0 ? "complete" : "empty",
    },
  ]

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-6 pb-16 pt-8 sm:px-10 sm:pt-12">
      <header className="border-b border-slate-200 pb-7 sm:pb-8">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">MY PLAN</p>
            <h1 className="mt-3 truncate text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{goalProfile.plan_title || (isKo ? "나의 호주 경로" : "My Australia pathway")}</h1>
            <p className="mt-2 text-sm text-slate-500">{goalProfile.strategy || `${greeting} · ${dateStr}`}</p>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{isKo ? "준비도" : "Readiness"}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{readyCount}<span className="ml-1 text-sm font-medium text-slate-400">/9</span></p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <PlanTag icon={GraduationCap} label={goalProfile.target_study_concept_label || (isKo ? "전공 방향 확인" : "Study direction to confirm")} />
          {goalProfile.target_occupation_title && <PlanTag icon={BriefcaseBusiness} label={goalProfile.target_occupation_title} />}
          <PlanTag icon={CalendarClock} label={goalProfile.target_intake_month ? formatMonth(goalProfile.target_intake_month, locale) : (isKo ? "입학 시기 미정" : "Intake to confirm")} />
        </div>
      </header>

      <PrimaryActionCard mode={dashboardMode} nextMove={nextMove} score={planHealth.score} status={planHealth.status} isKo={isKo} locale={locale} onNavigate={onNavigate} />

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{isKo ? "핵심 점검" : "Critical checks"}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{isKo ? "다음 결정 전에 확인하세요" : "Confirm these before your next decision"}</h2>
          </div>
          <p className="hidden text-sm text-slate-400 sm:block">{isKo ? `${readyCount}/9 준비 완료` : `${readyCount}/9 essentials ready`}</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {checkpoints.map((checkpoint) => <CheckpointCard key={checkpoint.id} checkpoint={checkpoint} locale={locale} onNavigate={onNavigate} />)}
        </div>
      </section>

      {actionSignals.length > 0 && (
        <section className="border-t border-slate-200 pt-7">
          <div className="flex items-center gap-2"><Circle className={cn("size-3", planHealth.status === "at-risk" ? "fill-rose-500 text-rose-500" : "fill-amber-500 text-amber-500")} /><h2 className="text-base font-semibold text-slate-950">{isKo ? "지금 확인할 항목" : "Needs your attention"}</h2></div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {actionSignals.map((signal) => <HealthSignalCard key={signal.id} signal={signal} locale={locale} onNavigate={onNavigate} />)}
          </div>
        </section>
      )}

      {/* ── Decision space ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-blue-50">
            <Target className="size-4 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-slate-950">
            {isKo ? "후보와 현재 판단" : "Shortlist and current decision"}
          </h2>
        </div>

        <div className="mt-5">
          {goalOptions.length ? (
            <div className="space-y-2">
              {goalOptions.slice(0, 3).map((option) => <DecisionOptionRow key={option.id} option={option} isLeading={option.title === leadingOptionTitle} isKo={isKo} />)}
              <PlanActionLink href="/compare" locale={locale} onNavigate={onNavigate} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">{isKo ? "후보 비교 계속하기" : "Continue comparing options"}<ArrowRight className="size-4" /></PlanActionLink>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5"><p className="text-sm font-medium text-slate-700">{isKo ? "아직 비교할 후보가 없습니다." : "You do not have a shortlist yet."}</p><p className="mt-1 text-xs leading-5 text-slate-500">{isKo ? "후보 하나를 저장하면 비용·조건·일정을 플랜 기준으로 정리할 수 있어요." : "Save one option to turn cost, requirements and timing into a concrete plan."}</p><PlanActionLink href="/au/study" locale={locale} onNavigate={onNavigate} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">{isKo ? "후보 찾기" : "Find an option"}<ArrowRight className="size-4" /></PlanActionLink></div>
          )}
        </div>
      </section>

      {/* ── Two-column: Schools + Activity ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Comparison snapshot */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-blue-50">
                <GraduationCap className="size-4 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-950">
                {isKo ? "비교 스냅샷" : "Comparison snapshot"}
              </h2>
            </div>
            <PlanActionLink href="/compare" locale={locale} onNavigate={onNavigate} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              {isKo ? "전체 보기" : "View all"} <ArrowRight className="inline size-3" />
            </PlanActionLink>
          </div>

          <div className="mt-5 space-y-3">
            {displayedSchools.length > 0 ? (
              displayedSchools.map((school, i) => (
                <div
                  key={school.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                      i === 0
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {school.college_name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                      {school.college_city || school.college_state || "Australia"}
                      {school.tuition != null && (
                        <>
                          <span className="text-slate-200">·</span>
                          {formatMoney(school.tuition, currency)}/{isKo ? "년" : "yr"}
                        </>
                      )}
                    </p>
                  </div>
                  {school.score != null && (
                    <div className="shrink-0 rounded-lg bg-slate-950 px-2 py-1 text-right text-white">
                      <p className="text-xs font-semibold leading-none">
                        {school.score.toFixed(1)}
                      </p>
                      <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-slate-400">
                        Score
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <GraduationCap className="mx-auto size-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">
                  {isKo ? "후보를 저장하면 비교 지표가 여기에 모입니다" : "Saved options will bring their comparison metrics here"}
                </p>
                <PlanActionLink href="/au/study" locale={locale} onNavigate={onNavigate} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  {isKo ? "학교 둘러보기" : "Browse schools"} <ArrowRight className="size-3" />
                </PlanActionLink>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-blue-50">
              <Compass className="size-4 text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-950">
              {isKo ? "최근 활동" : "Recent Activity"}
            </h2>
          </div>

          <div className="mt-5 space-y-1">
            {/* Upcoming tasks */}
            {upcomingTasks.length > 0 && (
              <>
                {upcomingTasks.map((task) => {
                  const isOverdue =
                    task.due_date && task.due_date < todayKey
                  const daysLeft = task.due_date
                    ? Math.ceil(
                        (new Date(task.due_date).getTime() - today.getTime()) / 86400000,
                      )
                    : null
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                    >
                      <Circle
                        className={cn(
                          "size-3 shrink-0",
                          isOverdue ? "text-rose-400" : "text-slate-300",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {task.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {task.due_date
                            ? isOverdue
                              ? isKo ? "마감 지남" : "Overdue"
                              : daysLeft === 0
                                ? isKo ? "오늘" : "Today"
                                : daysLeft === 1
                                  ? isKo ? "내일" : "Tomorrow"
                                  : isKo ? `${daysLeft}일 후` : `In ${daysLeft} days`
                            : isKo ? "날짜 미정" : "No date"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* Recent notes */}
            {recentNotes.length > 0 && (
              <>
                <div className="my-2 border-t border-slate-100" />
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                  >
                    <FileCheck2 className="size-3 shrink-0 text-slate-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700">
                        {note.title || (isKo ? "제목 없음" : "Untitled")}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatRelativeTime(note.created_at, isKo, today.getTime())}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Empty state */}
            {upcomingTasks.length === 0 && recentNotes.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <Compass className="mx-auto size-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">
                  {isKo ? "최근 활동이 없습니다" : "No recent activity"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isKo ? "태스크나 노트를 추가하면 여기에 표시됩니다" : "Tasks and notes will appear here"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="grid gap-6 border-t border-slate-200 pt-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)]">
        <article className="border-l-2 border-emerald-500/40 py-1 pl-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.14em] text-emerald-700"><BriefcaseBusiness className="size-3.5" />{isKo ? "직업 시장 시그널" : "Labour market signal"}</p>
          {occSignal ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <HomeOccStat label={isKo ? "중위임금" : "Median salary"} value={occSignal.medianSalary != null ? `A$${Math.round(occSignal.medianSalary).toLocaleString()}` : "—"} />
              <HomeOccStat label={isKo ? "인력 부족률" : "Shortage"} value={occSignal.shortagePct != null ? `${occSignal.shortagePct}%` : "—"} highlight={occSignal.shortagePct != null && occSignal.shortagePct >= 50} />
              <HomeOccStat label="CSOL" value={occSignal.onCsol ? `${occSignal.csolCount} ${isKo ? "개 직업" : "occupations"}` : (isKo ? "미포함" : "Not listed")} />
              <HomeOccStat label={isKo ? "대표 직업" : "Key occupations"} value={occSignal.representativeOccupations.length ? occSignal.representativeOccupations.slice(0, 2).map((item) => isKo ? item.labelKo : item.label).join(", ") : "—"} />
            </div>
          ) : <p className="mt-3 text-sm leading-6 text-slate-500">{isKo ? "전공 방향을 정하면 연결된 직업 시장 신호를 보여드려요." : "Choose a study direction to see the related labour-market signals."}</p>}
        </article>
        <article className="border-l-2 border-blue-500/40 py-1 pl-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.14em] text-blue-700"><Lightbulb className="size-3.5" />{isKo ? "오늘의 인사이트" : "Today’s insight"}</p>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{isKo ? insight.ko : insight.en}</p>
          <p className="mt-2 text-xs text-slate-400">{insight.source}</p>
        </article>
      </section>
    </section>
  )
}

/* ── Sub-components ── */

function HomeOccStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-3", highlight ? "border-emerald-200 bg-emerald-100/50" : "border-slate-200 bg-white")}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", highlight ? "text-emerald-700" : "text-slate-950")}>{value}</p>
    </div>
  )
}

type DashboardMode = "start" | "build" | "risk" | "ready"
type HomeCheckpoint = {
  id: string
  label: string
  value: string
  detail: string
  href: string
  icon: LucideIcon
  tone: "critical" | "attention" | "complete" | "empty"
}
type NextMove = { href: string; title: string; description: string; cta: string }

const PLANNER_AREAS: Record<string, string> = {
  "/compare": "compare",
  "/applications": "applications",
  "/budget": "budget",
  "/english": "english",
  "/research": "research",
  "/report": "report",
}

function PlanActionLink({ href, locale, onNavigate, className, children }: { href: string; locale: "en" | "ko"; onNavigate: (area: string) => void; className: string; children: React.ReactNode }) {
  const area = PLANNER_AREAS[href]
  if (area) return <button type="button" onClick={() => onNavigate(area)} className={className}>{children}</button>
  return <Link href={localizePath(href, locale)} className={className}>{children}</Link>
}

function PlanTag({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600"><Icon className="size-3.5 text-slate-400" />{label}</span>
}

function PrimaryActionCard({ mode, nextMove, score, status, isKo, locale, onNavigate }: { mode: DashboardMode; nextMove: NextMove; score: number; status: "on-track" | "attention" | "at-risk"; isKo: boolean; locale: "en" | "ko"; onNavigate: (area: string) => void }) {
  const copy = {
    start: isKo ? "첫 기준점 만들기" : "Create your first reference point",
    build: isKo ? "다음 한 걸음에 집중하세요" : "Focus on the next useful step",
    risk: isKo ? "이 항목을 먼저 정리하세요" : "Resolve this before anything else",
    ready: isKo ? "이제 후보를 판단할 준비가 됐어요" : "You are ready to make a decision",
  }[mode]
  const tone = status === "at-risk" ? "border-rose-400/40" : status === "attention" ? "border-amber-300/50" : "border-blue-400/40"
  return <section className={cn("relative overflow-hidden rounded-3xl border bg-slate-950 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.18)] sm:p-8", tone)}>
    <div className="absolute -right-10 -top-12 size-48 rounded-full bg-blue-500/20 blur-3xl" />
    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-200">{isKo ? "지금 할 일" : "Your next move"}</p><h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{nextMove.title}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{nextMove.description}</p><p className="mt-4 text-xs font-medium text-slate-400">{copy}</p></div>
      <div className="flex shrink-0 items-center gap-4"><div className="text-right"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{isKo ? "플랜 상태" : "Plan status"}</p><p className="mt-1 text-lg font-semibold">{score}<span className="ml-1 text-xs font-medium text-slate-400">{healthStatusCopy(status, isKo)}</span></p></div><PlanActionLink href={nextMove.href} locale={locale} onNavigate={onNavigate} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">{nextMove.cta}<ArrowRight className="size-4" /></PlanActionLink></div>
    </div>
  </section>
}

function CheckpointCard({ checkpoint, locale, onNavigate }: { checkpoint: HomeCheckpoint; locale: "en" | "ko"; onNavigate: (area: string) => void }) {
  const Icon = checkpoint.icon
  const tones = {
    critical: "border-rose-200 bg-rose-50/50 text-rose-700",
    attention: "border-amber-200 bg-amber-50/60 text-amber-700",
    complete: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
    empty: "border-slate-200 bg-white text-slate-600",
  }
  return <PlanActionLink href={checkpoint.href} locale={locale} onNavigate={onNavigate} className={cn("group min-h-36 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm", tones[checkpoint.tone])}><div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/80"><Icon className="size-4" /></span>{checkpoint.tone === "complete" && <CircleCheck className="size-4" />}</div><p className="mt-5 text-xs font-semibold uppercase tracking-[.12em] opacity-70">{checkpoint.label}</p><p className="mt-1 text-sm font-semibold text-slate-900">{checkpoint.value}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{checkpoint.detail}</p></PlanActionLink>
}

function HealthSignalCard({ signal, locale, onNavigate }: { signal: PlanHealthSignal; locale: "en" | "ko"; onNavigate: (area: string) => void }) {
  const critical = signal.severity === "critical"
  return <PlanActionLink href={signal.href} locale={locale} onNavigate={onNavigate} className={cn("group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm", critical ? "border-rose-200 bg-rose-50/50" : "border-amber-200 bg-amber-50/50")}><div className="flex items-start gap-3"><span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", critical ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}><Circle className="size-3 fill-current" /></span><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{signal.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{signal.description}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-700">{signal.cta}<ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></div></div></PlanActionLink>
}

function DecisionOptionRow({ option, isLeading, isKo }: { option: HomeGoalOption; isLeading: boolean; isKo: boolean }) {
  return <article className={cn("flex items-center gap-3 rounded-xl border px-3.5 py-3", isLeading ? "border-blue-200 bg-blue-50/60" : "border-slate-100 bg-slate-50/50")}><span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold", isLeading ? "bg-blue-600 text-white" : "bg-white text-slate-500")}>{option.position}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{option.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{option.field_name || option.provider_name || (isKo ? "저장한 후보" : "Saved option")}</p></div>{isLeading && <span className="shrink-0 text-[11px] font-semibold text-blue-700">{isKo ? "1순위" : "Leading"}</span>}</article>
}

/* ── Helpers ── */

function healthStatusCopy(status: "on-track" | "attention" | "at-risk", isKo: boolean) {
  if (status === "on-track") return isKo ? "모든 준비 완료" : "All set"
  if (status === "attention") return isKo ? "확인 필요" : "Needs attention"
  return isKo ? "우선 조치 필요" : "Action needed"
}

function getNextMove({ isKo, hasShortlist, hasEnglishBaseline, hasFundTarget, hasApplicationSchedule, nextDeadline }: { isKo: boolean; hasShortlist: boolean; hasEnglishBaseline: boolean; hasFundTarget: boolean; hasApplicationSchedule: boolean; nextDeadline: { title: string; dueDate: string } | null }) {
  if (!hasShortlist) return { href: "/au/study", title: isKo ? "후보 하나를 저장하세요" : "Save one study option", description: isKo ? "비교할 대학 또는 과정 하나만 고르면, 이후 비용·조건·지원 일정의 기준점이 생깁니다." : "Choose one university or course. It becomes the reference point for cost, requirements and deadlines.", cta: isKo ? "후보 탐색하기" : "Explore options" }
  if (!hasEnglishBaseline) return { href: "/english", title: isKo ? "현재 영어 점수를 기록하세요" : "Record your current English score", description: isKo ? "정확한 점수가 아니어도 괜찮습니다. 현재 위치를 기록하면 필요한 준비 기간을 가늠할 수 있어요." : "An estimate is enough. Once your starting point is visible, you can judge the preparation time you need.", cta: isKo ? "영어 계획 열기" : "Open English plan" }
  if (!hasFundTarget) return { href: "/budget", title: isKo ? "초기 자금 목표를 입력하세요" : "Set your first funding target", description: isKo ? "완벽한 예산이 아니어도 됩니다. 먼저 목표 금액을 잡으면 부족액과 월별 계획이 보입니다." : "It does not need to be a perfect budget. A first target makes the gap and monthly plan visible.", cta: isKo ? "자금 계획 열기" : "Open money plan" }
  if (!hasApplicationSchedule) return { href: "/applications", title: isKo ? "지원 관련 일정 하나를 추가하세요" : "Add one application date", description: isKo ? "마감일 하나만 잡아도 막연한 계획이 실제 일정으로 바뀝니다." : "One date is enough to turn an abstract plan into a real timeline.", cta: isKo ? "일정 추가하기" : "Add a date" }
  if (nextDeadline) return { href: "/applications", title: isKo ? "다음 지원 일정을 10분 안에 확인하세요" : "Review your next date in ten minutes", description: isKo ? `다음 일정은 "${nextDeadline.title}"입니다. 필요한 문서와 다음 행동을 한 줄로 적어보세요.` : `Your next date is "${nextDeadline.title}". Write down the document you need and the immediate next action.`, cta: isKo ? "일정 보기" : "View schedule" }
  return { href: "/au/study", title: isKo ? "1순위 후보의 입학 조건을 확인하세요" : "Check your first option's entry requirements", description: isKo ? "후보의 영어·학력·지원 시기를 한 번만 확인해도 다음 계획의 정확도가 높아집니다." : "A quick check of English, academic and intake requirements will make your next plan more precise.", cta: isKo ? "후보 비교하기" : "Compare options" }
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "AUD",
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${currency || "AUD"} ${Math.round(value).toLocaleString()}`
  }
}

function formatMonth(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-AU", {
    year: "numeric",
    month: "long",
  }).format(new Date(`${value.slice(0, 7)}-01T00:00:00`))
}

function formatShortDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-AU", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`))
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function formatRelativeTime(dateStr: string, isKo: boolean, now: number) {
  const diff = now - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return isKo ? "방금" : "Just now"
  if (minutes < 60) return isKo ? `${minutes}분 전` : `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return isKo ? `${hours}시간 전` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return isKo ? `${days}일 전` : `${days}d ago`
  return new Intl.DateTimeFormat(isKo ? "ko-KR" : "en-AU", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr))
}
