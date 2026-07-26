"use client"

import Link from "next/link"
import {
  ArrowRight,
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  Circle,
  CircleCheck,
  ClipboardCheck,
  Compass,
  FileCheck2,
  GraduationCap,
  Languages,
  Lightbulb,
  Map,
  Newspaper,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { buildPlanHealth, type PlanHealthSignal } from "@/lib/plan-health"

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

function getDailyInsight(): { en: string; ko: string; source: string } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
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
  const insight = getDailyInsight()

  const today = new Date()
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

  /* Applications */
  const submittedCount = applications.filter((a) => a.status === "submitted" || a.status === "offer").length
  const totalApps = applications.length

  /* Upcoming tasks */
  const upcomingTasks = tasks
    .filter((t) => t.status === "todo" && t.due_date)
    .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
    .slice(0, 3)

  /* Recent notes */
  const recentNotes = [...notes].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 2)

  /* Top schools from compare */
  const topSchools = [...compareSchools]
    .sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
    .slice(0, 3)

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

  /* ── Journey ── */
  const route = [
    { label: "Choose", complete: isReadyGoal && hasShortlist, detail: isKo ? "목표와 후보" : "Goal & shortlist" },
    { label: "Qualify", complete: hasEnglishBaseline && hasEnglishTarget, detail: isKo ? "입학 조건" : "Entry conditions" },
    { label: "Apply", complete: hasApplicationSchedule, detail: isKo ? "지원 일정" : "Application plan" },
    { label: "Fund", complete: hasFundTarget && hasSavingPlan, detail: isKo ? "자금 계획" : "Funding plan" },
    { label: "Arrive", complete: hasIntake && hasApplicationSchedule && hasFundTarget, detail: isKo ? "출국 준비" : "Arrival plan" },
    { label: "Work", complete: Boolean(goalProfile.target_occupation_title), detail: isKo ? "커리어 목표" : "Career direction" },
  ]

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-6 pb-16 pt-8 sm:px-10 sm:pt-12">
      {/* ── Header ── */}
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
              {isKo ? "홈" : "HOME"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {greeting}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{dateStr}</p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">
              {isKo ? "준비도" : "Readiness"}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {readyCount}<span className="ml-1 text-sm font-medium text-slate-400">/9</span>
            </p>
            <div className="mt-2 flex gap-1">
              {readiness.map((complete, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 w-5 rounded-full", complete ? "bg-blue-500" : "bg-slate-100")}
                />
              ))}
            </div>
          </div>
        </div>
        {goalProfile.plan_title && (
          <p className="truncate text-sm font-medium text-slate-600">
            {goalProfile.plan_title}
          </p>
        )}
      </header>

      {/* ── Today's Insight ── */}
      <article className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8">
        <div className="absolute right-4 top-4 text-blue-100">
          <Lightbulb className="size-16 sm:size-20" />
        </div>
        <div className="relative max-w-xl">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
            <Newspaper className="size-3.5" />
            {isKo ? "오늘의 인사이트" : "TODAY'S INSIGHT"}
          </p>
          <h2 className="mt-3 text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
            {isKo ? insight.ko : insight.en}
          </h2>
          <p className="mt-3 text-xs text-slate-400">Source: {insight.source}</p>
        </div>
      </article>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction
          icon={Scale}
          label={isKo ? "비교" : "Compare"}
          href="/home/compare"
          onNavigate={onNavigate}
          area="compare"
        />
        <QuickAction
          icon={CalendarClock}
          label={isKo ? "지원 관리" : "Applications"}
          href="/home/applications"
          onNavigate={onNavigate}
          area="applications"
        />
        <QuickAction
          icon={Banknote}
          label={isKo ? "예산" : "Budget"}
          href="/home/budget"
          onNavigate={onNavigate}
          area="budget"
        />
        <QuickAction
          icon={Languages}
          label={isKo ? "영어 학습" : "English"}
          href="/home/english"
          onNavigate={onNavigate}
          area="english"
        />
      </div>

      {/* ── Plan Health ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
              {isKo ? "다음 단계" : "NEXT STEPS"}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {healthStatusCopy(planHealth.status, isKo)}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {isKo
                ? "지금 가장 먼저 해야 할 일을 알려드립니다."
                : "We surface the next priority you should address first."}
            </p>
          </div>
          <div className={cn(
            "flex shrink-0 items-center gap-3",
            planHealth.status === "on-track" ? "text-emerald-600"
              : planHealth.status === "attention" ? "text-amber-600"
                : "text-rose-600"
          )}>
            <span className="text-3xl font-semibold tracking-tight">{planHealth.score}</span>
            <span className="border-l border-current/20 pl-3 text-xs font-semibold uppercase tracking-[.12em]">
              {healthStatusCopy(planHealth.status, isKo)}
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-x-8 gap-y-4 lg:grid-cols-2">
          {planHealth.signals.map((signal) => (
            <HealthSignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>

      {/* ── Next Best Move ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_10px_20px_rgba(59,130,246,.3)]">
            <Compass className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-600">
              {isKo ? "다음 행동 · 10분" : "Next best move · 10 min"}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {nextMove.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {nextMove.description}
            </p>
          </div>
        </div>
        <Link
          href={nextMove.href}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {nextMove.cta}
          <ArrowRight className="size-4" />
        </Link>
      </section>

      {/* ── Goal Progress ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-blue-50">
            <Target className="size-4 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-slate-950">
            {isKo ? "목표 진행 현황" : "Goal Progress"}
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          {/* Applications */}
          <ProgressRow
            icon={CalendarClock}
            label={isKo ? "지원" : "Applications"}
            value={
              totalApps > 0
                ? `${submittedCount}/${totalApps} ${isKo ? "제출됨" : "submitted"}`
                : isKo ? "아직 지원 없음" : "No applications yet"
            }
            percentage={totalApps > 0 ? (submittedCount / totalApps) * 100 : 0}
            tone="blue"
          />

          {/* Funding */}
          <ProgressRow
            icon={Banknote}
            label={isKo ? "자금" : "Funding"}
            value={
              remaining != null
                ? `${formatMoney(currentSavings ?? 0, currency)} / ${formatMoney(targetAmount!, currency)}`
                : isKo ? "목표 금액 미정" : "No target set"
            }
            percentage={
              targetAmount != null && targetAmount > 0
                ? Math.min(((currentSavings ?? 0) / targetAmount) * 100, 100)
                : 0
            }
            tone="emerald"
          />

          {/* English */}
          <ProgressRow
            icon={Languages}
            label={isKo ? "영어" : "English"}
            value={
              scoreGap != null
                ? `${englishExam || "IELTS"} ${currentEnglishScore?.toFixed(1)} → ${targetEnglishScore?.toFixed(1)}`
                : isKo ? "점수 미입력" : "No scores entered"
            }
            percentage={
              scoreGap != null && currentEnglishScore != null && targetEnglishScore != null
                ? Math.min((currentEnglishScore / targetEnglishScore) * 100, 100)
                : 0
            }
            tone="violet"
          />

          {/* Research */}
          <ProgressRow
            icon={BookOpen}
            label={isKo ? "리서치" : "Research"}
            value={
              hasShortlist
                ? `${goalOptions.length} ${isKo ? "개 후보 저장됨" : "options saved"}`
                : isKo ? "후보 미저장" : "No options saved"
            }
            percentage={hasShortlist ? Math.min((goalOptions.length / 3) * 100, 100) : 0}
            tone="amber"
          />
        </div>
      </section>

      {/* ── Decision Journey ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">
              {isKo ? "호주 결정 여정" : "Australia decision journey"}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isKo ? "한 번에 전부가 아니라, 다음 단계만 선명하게" : "Make the next decision, not every decision at once."}
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {isKo ? `${readyCount}/9 준비 완료` : `${readyCount}/9 essentials ready`}
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {route.map((stage, index) => (
            <JourneyStep key={stage.label} index={index + 1} label={stage.label} detail={stage.detail} complete={stage.complete} />
          ))}
        </div>
      </section>

      {/* ── Two-column: Schools + Activity ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended Schools */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-blue-50">
                <GraduationCap className="size-4 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-950">
                {isKo ? "추천 학교" : "Recommended Schools"}
              </h2>
            </div>
            <Link
              href="/home/compare"
              onClick={(e) => { e.preventDefault(); onNavigate("compare") }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {isKo ? "전체 보기" : "View all"} <ArrowRight className="inline size-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {topSchools.length > 0 ? (
              topSchools.map((school, i) => (
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
                  {school.roi_score != null && (
                    <div className="shrink-0 rounded-lg bg-slate-950 px-2 py-1 text-right text-white">
                      <p className="text-xs font-semibold leading-none">
                        {school.roi_score.toFixed(1)}
                      </p>
                      <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-slate-400">
                        ROI
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <GraduationCap className="mx-auto size-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">
                  {isKo ? "비교에 학교를 추가해 보세요" : "Add schools to compare"}
                </p>
                <Link
                  href="/au/study"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {isKo ? "학교 둘러보기" : "Browse schools"} <ArrowRight className="size-3" />
                </Link>
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
                    task.due_date && task.due_date < new Date().toISOString().slice(0, 10)
                  const daysLeft = task.due_date
                    ? Math.ceil(
                        (new Date(task.due_date).getTime() - Date.now()) / 86400000,
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
                        {formatRelativeTime(note.created_at, isKo)}
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

      {/* ── Current Route ── */}
      {(goalProfile.target_occupation_title || goalProfile.target_study_concept_label) && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-blue-50">
              <Map className="size-4 text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-950">
              {isKo ? "현재 경로" : "Current Route"}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {goalProfile.target_occupation_title && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-700">
                <BriefcaseBusiness className="size-3.5" />
                {goalProfile.target_occupation_title}
              </span>
            )}
            {goalProfile.target_study_concept_label && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-sm text-violet-700">
                <GraduationCap className="size-3.5" />
                {goalProfile.target_study_concept_label}
              </span>
            )}
            {goalProfile.target_intake_month && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
                <CalendarClock className="size-3.5" />
                {formatMonth(goalProfile.target_intake_month, locale)}
              </span>
            )}
          </div>

          {goalOptions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {goalOptions.slice(0, 3).map((opt) => (
                <span
                  key={opt.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  <span className="grid size-4 place-items-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                    {opt.position}
                  </span>
                  {opt.title}
                </span>
              ))}
            </div>
          )}

          <Link
            href="/home/compare"
            onClick={(e) => { e.preventDefault(); onNavigate("compare") }}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {isKo ? "비교 상세 보기" : "View comparison"} <ArrowRight className="size-4" />
          </Link>
        </section>
      )}
    </section>
  )
}

/* ── Sub-components ── */

function QuickAction({
  icon: Icon,
  label,
  href,
  onNavigate,
  area,
}: {
  icon: LucideIcon
  label: string
  href: string
  onNavigate: (area: string) => void
  area: string
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(area)}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
    >
      <div className="grid size-10 place-items-center rounded-xl bg-slate-50 transition group-hover:bg-blue-100">
        <Icon className="size-5 text-slate-500 transition group-hover:text-blue-600" />
      </div>
      <span className="text-xs font-semibold text-slate-600 transition group-hover:text-blue-700">
        {label}
      </span>
    </button>
  )
}

function ProgressRow({
  icon: Icon,
  label,
  value,
  percentage,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  percentage: number
  tone: "blue" | "emerald" | "violet" | "amber"
}) {
  const barColors = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
  }
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-400">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-xs text-slate-500">{value}</p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColors[tone])}
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function HealthSignalCard({ signal }: { signal: PlanHealthSignal }) {
  const isPositive = signal.severity === "positive"
  const isCritical = signal.severity === "critical"
  return (
    <Link
      href={signal.href}
      className={cn(
        "group border-l-2 py-1 pl-4 transition",
        isPositive ? "border-emerald-500/60"
          : isCritical ? "border-rose-500/60"
            : "border-amber-500/60"
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn(
          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl",
          isPositive ? "bg-emerald-50 text-emerald-600"
            : isCritical ? "bg-rose-50 text-rose-600"
              : "bg-amber-50 text-amber-600"
        )}>
          {isPositive ? <CircleCheck className="size-4" /> : <Circle className="size-4 fill-current" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-700">{signal.title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{signal.description}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition group-hover:gap-1.5">
            {signal.cta}<ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function JourneyStep({ index, label, detail, complete }: { index: number; label: string; detail: string; complete: boolean }) {
  return (
    <div className="relative min-h-24 border-l border-slate-200 pl-4 first:border-l-0 first:pl-0">
      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          "grid size-6 place-items-center rounded-full text-xs font-bold",
          complete ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
        )}>
          {complete ? <Check className="size-3.5" /> : index}
        </span>
        {complete ? <CircleCheck className="size-4 text-blue-500" /> : <Circle className="size-4 text-slate-200" />}
      </div>
      <p className={cn("mt-4 text-sm font-semibold", complete ? "text-blue-700" : "text-slate-600")}>{label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
    </div>
  )
}

/* ── Helpers ── */

function healthStatusCopy(status: "on-track" | "attention" | "at-risk", isKo: boolean) {
  if (status === "on-track") return isKo ? "모든 준비 완료" : "All set"
  if (status === "attention") return isKo ? "확인 필요" : "Needs attention"
  return isKo ? "우선 조치 필요" : "Action needed"
}

function getNextMove({ isKo, hasShortlist, hasEnglishBaseline, hasFundTarget, hasApplicationSchedule, nextDeadline }: { isKo: boolean; hasShortlist: boolean; hasEnglishBaseline: boolean; hasFundTarget: boolean; hasApplicationSchedule: boolean; nextDeadline: { title: string; dueDate: string } | null }) {
  if (!hasShortlist) return { href: "/au/study", title: isKo ? "후보 하나를 저장하세요" : "Save one study option", description: isKo ? "비교할 대학 또는 과정 하나만 고르면, 이후 비용·조건·지원 일정의 기준점이 생깁니다." : "Choose one university or course. It becomes the reference point for cost, requirements and deadlines.", cta: isKo ? "후보 탐색하기" : "Explore options" }
  if (!hasEnglishBaseline) return { href: "/home/english", title: isKo ? "현재 영어 점수를 기록하세요" : "Record your current English score", description: isKo ? "정확한 점수가 아니어도 괜찮습니다. 현재 위치를 기록하면 필요한 준비 기간을 가늠할 수 있어요." : "An estimate is enough. Once your starting point is visible, you can judge the preparation time you need.", cta: isKo ? "영어 계획 열기" : "Open English plan" }
  if (!hasFundTarget) return { href: "/home/budget", title: isKo ? "초기 자금 목표를 입력하세요" : "Set your first funding target", description: isKo ? "완벽한 예산이 아니어도 됩니다. 먼저 목표 금액을 잡으면 부족액과 월별 계획이 보입니다." : "It does not need to be a perfect budget. A first target makes the gap and monthly plan visible.", cta: isKo ? "자금 계획 열기" : "Open money plan" }
  if (!hasApplicationSchedule) return { href: "/home/applications", title: isKo ? "지원 관련 일정 하나를 추가하세요" : "Add one application date", description: isKo ? "마감일 하나만 잡아도 막연한 계획이 실제 일정으로 바뀝니다." : "One date is enough to turn an abstract plan into a real timeline.", cta: isKo ? "일정 추가하기" : "Add a date" }
  if (nextDeadline) return { href: "/home/applications", title: isKo ? "다음 지원 일정을 10분 안에 확인하세요" : "Review your next date in ten minutes", description: isKo ? `다음 일정은 "${nextDeadline.title}"입니다. 필요한 문서와 다음 행동을 한 줄로 적어보세요.` : `Your next date is "${nextDeadline.title}". Write down the document you need and the immediate next action.`, cta: isKo ? "일정 보기" : "View schedule" }
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

function formatRelativeTime(dateStr: string, isKo: boolean) {
  const diff = Date.now() - new Date(dateStr).getTime()
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
