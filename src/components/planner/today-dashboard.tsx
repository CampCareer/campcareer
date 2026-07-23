"use client"

import Link from "next/link"
import { ArrowRight, Banknote, BriefcaseBusiness, CalendarClock, Check, Circle, CircleCheck, Compass, FileCheck2, GraduationCap, Languages, Target, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { buildPlanHealth, type PlanHealthSignal } from "@/lib/plan-health"
import { getRoiReportReadiness, type RoiReportReadiness } from "@/lib/report-plan-bridge"

export type TodayGoalProfile = {
  plan_title: string
  strategy: string
  target_occupation_title: string
  target_study_concept_label: string
  target_intake_month: string | null
}

export type TodayGoalOption = {
  id: string
  position: number
  source_type: "saved_university" | "saved_course"
  title: string
  provider_name: string
  field_name: string
}

export type TodayTask = {
  id: string
  title: string
  kind: "application" | "english" | "money" | "research" | "personal"
  status: "todo" | "done"
  due_date: string | null
}

export type TodayApplication = { id: string; title: string; deadline_date: string | null; status: "planning" | "preparing" | "submitted" | "offer" | "declined" }

type TodayDashboardProps = {
  goalProfile: TodayGoalProfile
  goalOptions: TodayGoalOption[]
  tasks: TodayTask[]
  applications?: TodayApplication[]
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
  onUpdatePlanProfile?: (patch: { plan_title?: string; strategy?: string }) => Promise<boolean>
  onOpenReport?: () => void
}

export function TodayDashboard({
  goalProfile,
  goalOptions,
  tasks,
  applications = [],
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
  onUpdatePlanProfile,
  onOpenReport,
}: TodayDashboardProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const [planTitle, setPlanTitle] = useState(goalProfile.plan_title)
  const [strategy, setStrategy] = useState(goalProfile.strategy)
  const [savingField, setSavingField] = useState<"plan_title" | "strategy" | null>(null)

  useEffect(() => {
    setPlanTitle(goalProfile.plan_title)
    setStrategy(goalProfile.strategy)
  }, [goalProfile.plan_title, goalProfile.strategy])

  async function savePlanField(field: "plan_title" | "strategy", value: string) {
    if (!onUpdatePlanProfile || value === goalProfile[field]) return
    setSavingField(field)
    const saved = await onUpdatePlanProfile({ [field]: value.trim() })
    if (!saved) {
      if (field === "plan_title") setPlanTitle(goalProfile.plan_title)
      else setStrategy(goalProfile.strategy)
    }
    setSavingField(null)
  }
  const isReadyGoal = Boolean(goalProfile.target_occupation_title || goalProfile.target_study_concept_label)
  const hasShortlist = goalOptions.length > 0
  const hasIntake = Boolean(goalProfile.target_intake_month)
  const hasResearch = evidenceCount > 0
  const hasEnglishBaseline = currentEnglishScore != null
  const hasEnglishTarget = targetEnglishScore != null
  const hasFundTarget = targetAmount != null
  const hasSavingPlan = monthlySaving != null && monthlySaving > 0
  const hasApplicationSchedule = tasks.some((task) => task.kind === "application") || applications.some((application) => application.status !== "declined" && application.status !== "offer")
  const readiness = [isReadyGoal, hasShortlist, hasIntake, hasResearch, hasEnglishBaseline, hasEnglishTarget, hasFundTarget, hasSavingPlan, hasApplicationSchedule]
  const readyCount = readiness.filter(Boolean).length
  const scoreGap = currentEnglishScore != null && targetEnglishScore != null ? Math.max(targetEnglishScore - currentEnglishScore, 0) : null
  const remaining = targetAmount == null ? null : Math.max(targetAmount - (currentSavings ?? 0), 0)
  const applicationDeadlineItems = [
    ...tasks.filter((task) => task.kind === "application" && task.status === "todo" && task.due_date).map((task) => ({ title: task.title, due_date: task.due_date! })),
    ...applications.filter((application) => application.status !== "declined" && application.status !== "offer" && application.deadline_date).map((application) => ({ title: application.title, due_date: application.deadline_date! })),
  ].sort((a, b) => a.due_date.localeCompare(b.due_date))
  const nextDeadline = applicationDeadlineItems[0] ?? null
  const planHealth = buildPlanHealth({
    locale: isKo ? "ko" : "en",
    targetIntakeMonth: goalProfile.target_intake_month,
    applicationDeadlines: applicationDeadlineItems.map((deadline) => ({ title: deadline.title, dueDate: deadline.due_date })),
    currentSavings: currentSavings ?? 0,
    monthlySaving: monthlySaving ?? 0,
    targetAmount,
    targetDate,
    englishTargetScore: targetEnglishScore,
    englishTestDate,
    leadingOptionTitle,
    leadingRationale,
  })
  const roiReportReadiness = getRoiReportReadiness({
    targetOccupation: goalProfile.target_occupation_title,
    shortlistCount: goalOptions.length,
    targetAmount,
    currentEnglishScore,
    targetEnglishScore,
  })
  const nextMove = planHealth.nextAction ?? getNextMove({ isKo, hasShortlist, hasEnglishBaseline, hasFundTarget, hasApplicationSchedule, nextDeadline })
  const route = [
    { label: "Choose", complete: isReadyGoal && hasShortlist, detail: isKo ? "목표와 후보" : "Goal & shortlist" },
    { label: "Qualify", complete: hasEnglishBaseline && hasEnglishTarget, detail: isKo ? "입학 조건" : "Entry conditions" },
    { label: "Apply", complete: hasApplicationSchedule, detail: isKo ? "지원 일정" : "Application plan" },
    { label: "Fund", complete: hasFundTarget && hasSavingPlan, detail: isKo ? "자금 계획" : "Funding plan" },
    { label: "Arrive", complete: hasIntake && hasApplicationSchedule && hasFundTarget, detail: isKo ? "출국 준비" : "Arrival plan" },
    { label: "Work", complete: Boolean(goalProfile.target_occupation_title), detail: isKo ? "커리어 목표" : "Career direction" },
  ]

  return <section id="today" aria-labelledby="today-dashboard-title" className="scroll-mt-6 space-y-10 pb-12">
    <header className="px-1 py-3">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[.12em] text-blue-700">MY PLAN · TODAY</p>
          <input id="today-dashboard-title" value={planTitle} onChange={(event) => setPlanTitle(event.target.value.slice(0, 160))} onBlur={() => void savePlanField("plan_title", planTitle)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur() } if (event.key === "Escape") { setPlanTitle(goalProfile.plan_title); event.currentTarget.blur() } }} placeholder={isKo ? "나의 호주 경로" : "My Australia pathway"} aria-label={isKo ? "플랜 제목 수정" : "Edit plan title"} aria-busy={savingField === "plan_title"} className="-mx-1 mt-3 w-[calc(100%+0.5rem)] cursor-text rounded px-1 text-3xl font-semibold tracking-tight text-slate-950 outline-none transition hover:bg-slate-50/70 focus:bg-slate-50/80 sm:text-4xl" />
          <textarea value={strategy} onChange={(event) => setStrategy(event.target.value.slice(0, 500))} onBlur={() => void savePlanField("strategy", strategy)} onKeyDown={(event) => { if (event.key === "Escape") { setStrategy(goalProfile.strategy); event.currentTarget.blur() } if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); event.currentTarget.blur() } }} placeholder={isKo ? "큰 결정보다 다음 한 걸음에 집중해 계획을 현실로 만들어 보세요." : "Focus on the next useful decision, then turn it into a real plan."} aria-label={isKo ? "전략 수정" : "Edit plan strategy"} aria-busy={savingField === "strategy"} rows={2} className="-mx-1 mt-3 w-[calc(100%+0.5rem)] resize-none cursor-text rounded px-1 text-sm leading-6 text-slate-600 outline-none transition hover:bg-slate-50/60 focus:bg-slate-50/70 sm:text-base" />
        </div>
        <div className="min-w-[12rem] border-l border-slate-200 pl-5">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{isKo ? "준비도" : "Readiness"}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{readyCount}<span className="ml-1 text-base font-medium text-slate-400">/ 9</span></p>
          <div className="mt-3 flex gap-1" aria-label={isKo ? `핵심 준비 9개 중 ${readyCount}개 완료` : `${readyCount} of 9 key preparations complete`}>{readiness.map((complete, index) => <span key={index} className={cn("h-1.5 flex-1 rounded-full", complete ? "bg-blue-600" : "bg-slate-200")} />)}</div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{isKo ? "9개 핵심 준비를 채우며 경로의 불확실성을 줄여보세요." : "Complete the nine essentials to reduce uncertainty in your path."}</p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-5 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><BriefcaseBusiness className="size-4 text-blue-600" />{goalProfile.target_occupation_title || (isKo ? "직업 목표를 정해보세요" : "Choose a career direction")}</span><span className="inline-flex items-center gap-2"><GraduationCap className="size-4 text-blue-600" />{goalProfile.target_study_concept_label || (isKo ? "전공 방향을 정해보세요" : "Choose a study direction")}</span><span className="inline-flex items-center gap-2"><CalendarClock className="size-4 text-blue-600" />{goalProfile.target_intake_month ? `${isKo ? "목표 입학" : "Target intake"} · ${formatMonth(goalProfile.target_intake_month, locale)}` : (isKo ? "입학 시기 미정" : "Intake to confirm")}</span></div>
    </header>

    <section className="border-t border-slate-200 pt-8" aria-labelledby="plan-health-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{isKo ? "계획 건강도" : "PLAN HEALTH"}</p><h2 id="plan-health-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{healthStatusCopy(planHealth.status, isKo)}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{isKo ? "입력한 일정·자금·영어·후보 데이터를 바탕으로 다음 우선순위를 먼저 보여드립니다." : "Your saved timeline, funding, English and pathway details shape the priority shown here."}</p></div>
        <div className={cn("flex shrink-0 items-center gap-3", planHealth.status === "on-track" ? "text-emerald-700" : planHealth.status === "attention" ? "text-amber-800" : "text-rose-700")}><span className="text-3xl font-semibold tracking-tight">{planHealth.score}</span><span className="border-l border-current/20 pl-3 text-xs font-semibold uppercase tracking-[.12em]">{healthStatusCopy(planHealth.status, isKo)}</span></div>
      </div>
      <div className="mt-6 grid gap-x-8 gap-y-4 lg:grid-cols-2">{planHealth.signals.map((signal) => <HealthSignalCard key={signal.id} signal={signal} />)}</div>
    </section>

    <div className="grid gap-8 border-t border-slate-200 pt-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)] xl:divide-x xl:divide-slate-200">
      <section className="xl:pr-8" aria-labelledby="next-best-move-title">
        <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,.25)]"><Compass className="size-5" /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">Next best move · 10 min</p><h2 id="next-best-move-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{nextMove.title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{nextMove.description}</p></div></div>
        <Link href={nextMove.href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">{nextMove.cta}<ArrowRight className="size-4" /></Link>
      </section>

      <section id="my-pathway" className="scroll-mt-6 border-t border-slate-200 pt-8 xl:border-t-0 xl:pl-8 xl:pt-0" aria-labelledby="route-title">
        <div className="flex items-center gap-2"><Target className="size-4 text-blue-600" /><h2 id="route-title" className="text-sm font-semibold text-slate-950">{isKo ? "현재 경로" : "Current route"}</h2></div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{goalProfile.target_occupation_title || goalProfile.target_study_concept_label || (isKo ? "목표를 설정하면 경로가 여기에 표시됩니다." : "Set a goal to see your route here.")}</p>
        <div className="mt-4 space-y-1">{goalOptions.length ? goalOptions.slice(0, 3).map((option) => <div key={option.id} className="flex min-w-0 items-center gap-3 border-b border-slate-100 py-2.5 last:border-b-0"><span className="grid size-6 shrink-0 place-items-center rounded-lg bg-blue-100 text-xs font-bold text-blue-800">{option.position}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{option.title}</p><p className="truncate text-xs text-slate-500">{option.field_name || option.provider_name || (isKo ? "저장한 후보" : "Saved option")}</p></div></div>) : <Link href="/au/study" className="flex items-center justify-between border-b border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-700"><span>{isKo ? "첫 후보를 저장해 보세요" : "Save your first option"}</span><ArrowRight className="size-4" /></Link>}</div>
      </section>
    </div>

    <section className="grid gap-5 border-t border-slate-200 pt-8 sm:grid-cols-3 sm:divide-x sm:divide-slate-200 sm:gap-0" aria-label={isKo ? "핵심 준비 현황" : "Key preparation status"}>
      <MetricCard icon={CalendarClock} tone="blue" label={isKo ? "지원 일정" : "Application timing"} value={nextDeadline ? formatShortDate(nextDeadline.due_date!, locale) : (hasApplicationSchedule ? (isKo ? "일정 설정됨" : "Schedule set") : (isKo ? "다음 일정 추가" : "Add your next date"))} detail={nextDeadline ? nextDeadline.title : hasApplicationSchedule ? (isKo ? "지원 준비 작업이 있습니다." : "An application task is in your plan.") : (isKo ? "지원 마감일 하나만 먼저 적어보세요." : "Start by adding one application deadline.")} href="/myplan/applications" />
      <MetricCard icon={Banknote} tone="emerald" label={isKo ? "자금 부족액" : "Funding gap"} value={remaining == null ? (isKo ? "목표 금액 입력" : "Set a target") : formatMoney(remaining, currency, locale)} detail={remaining == null ? (isKo ? "총 필요 자금을 정하면 월별 계획이 보입니다." : "Set the total fund to see a monthly plan.") : targetDate ? `${isKo ? "목표일" : "Target"} · ${formatShortDate(targetDate, locale)}` : monthlySaving ? `${isKo ? "매월" : "Monthly"} · ${formatMoney(monthlySaving, currency, locale)}` : (isKo ? "월 저축 계획을 추가해 보세요." : "Add a monthly saving plan.")} href="/myplan/money" />
      <MetricCard icon={Languages} tone="violet" label={isKo ? "영어 점수 차이" : "English score gap"} value={scoreGap == null ? (isKo ? "점수 입력" : "Add scores") : scoreGap === 0 ? (isKo ? "목표 달성" : "At target") : `+${scoreGap.toFixed(1)}`} detail={scoreGap == null ? (isKo ? `${englishExam || "IELTS"} 현재·목표 점수를 입력해 보세요.` : `Add your current and target ${englishExam || "IELTS"} scores.`) : `${englishExam || "IELTS"} · ${currentEnglishScore?.toFixed(1)} → ${targetEnglishScore?.toFixed(1)}`} href="/myplan/english" />
    </section>

    <RoiReportCard readiness={roiReportReadiness} isKo={isKo} onOpenReport={onOpenReport} />

    <section className="border-t border-slate-200 pt-8" aria-labelledby="journey-title">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Australia decision journey</p><h2 id="journey-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{isKo ? "한 번에 전부가 아니라, 다음 단계만 선명하게" : "Make the next decision, not every decision at once."}</h2></div><p className="text-sm text-slate-500">{isKo ? `${readyCount}/9 준비 완료` : `${readyCount}/9 essentials ready`}</p></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{route.map((stage, index) => <JourneyStep key={stage.label} index={index + 1} label={stage.label} detail={stage.detail} complete={stage.complete} />)}</div>
    </section>
  </section>
}

function HealthSignalCard({ signal }: { signal: PlanHealthSignal }) {
  const isPositive = signal.severity === "positive"
  const isCritical = signal.severity === "critical"
  return <Link href={signal.href} className={cn("group border-l-2 py-1 pl-4 transition", isPositive ? "border-emerald-400" : isCritical ? "border-rose-400" : "border-amber-400")}><div className="flex items-start gap-3"><span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl", isPositive ? "bg-emerald-100 text-emerald-700" : isCritical ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800")}>{isPositive ? <CircleCheck className="size-4" /> : <Circle className="size-4 fill-current" />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{signal.title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{signal.description}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition group-hover:gap-1.5">{signal.cta}<ArrowRight className="size-3.5" /></span></div></div></Link>
}

function healthStatusCopy(status: "on-track" | "attention" | "at-risk", isKo: boolean) {
  if (status === "on-track") return isKo ? "순항 중" : "On track"
  if (status === "attention") return isKo ? "주의 필요" : "Needs attention"
  return isKo ? "우선 조치 필요" : "Action needed"
}

function RoiReportCard({ readiness, isKo, onOpenReport }: { readiness: RoiReportReadiness; isKo: boolean; onOpenReport?: () => void }) {
  const labels = isKo
    ? { career: "목표 직업", shortlist: "비교 후보", budget: "총 필요 자금", english: "영어 현재·목표 점수" }
    : { career: "Target career", shortlist: "Shortlist", budget: "Total funding need", english: "Current and target English score" }
  const missing = readiness.checks.find((check) => !check.complete)
  const readyTitle = isKo ? "이제 내 조건으로 ROI Decision Report를 준비할 수 있습니다." : "Your conditions are ready to begin an ROI Decision Report."
  const preparingTitle = isKo ? `ROI Decision Report 준비도 ${readiness.completedCount}/${readiness.totalCount}` : `ROI Decision Report readiness ${readiness.completedCount}/${readiness.totalCount}`

  return <section className="border-t border-slate-200 pt-8" aria-labelledby="roi-report-title">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl"><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-violet-700"><FileCheck2 className="size-4" />MY AUSTRALIA ROI DECISION REPORT</p><h2 id="roi-report-title" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{readiness.ready ? readyTitle : preparingTitle}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{readiness.ready ? (isKo ? "My Plan의 후보, 자금, 영어 목표와 직업 방향을 리포트 초안으로 가져옵니다. 동의를 검토한 뒤에만 저장됩니다." : "Your shortlist, funding, English goals and career direction will be brought into a report draft. Nothing is saved until you review consent.") : (isKo ? `후보·자금·영어·직업의 네 가지 기준을 채우면 개인화 ROI 분석을 바로 준비할 수 있어요.${missing ? ` 다음은 ${labels[missing.id]}입니다.` : ""}` : "Complete the four decision inputs to begin a personalised ROI analysis.")}</p></div>
      {readiness.ready && onOpenReport ? <button type="button" onClick={onOpenReport} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white transition hover:bg-violet-800"><FileCheck2 className="size-4" />{isKo ? "리포트 초안 준비" : "Prepare report draft"}<ArrowRight className="size-4" /></button> : <Link href={readiness.ready ? "/myplan/report" : readiness.nextHref} className={cn("inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition", readiness.ready ? "bg-violet-700 text-white hover:bg-violet-800" : "bg-slate-950 text-white hover:bg-slate-800")}><FileCheck2 className="size-4" />{readiness.ready ? (isKo ? "리포트 초안 준비" : "Prepare report draft") : (isKo ? "다음 조건 채우기" : "Complete next input")}<ArrowRight className="size-4" /></Link>}
    </div>
    <div className="mt-5 grid gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">{readiness.checks.map((check) => <Link key={check.id} href={check.href} className={cn("flex min-h-8 items-center gap-2 text-xs font-semibold transition", check.complete ? "text-emerald-800" : "text-slate-500 hover:text-blue-700")}><span className={cn("grid size-5 shrink-0 place-items-center rounded-full", check.complete ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400")}>{check.complete ? <Check className="size-3" /> : <Circle className="size-3" />}</span>{labels[check.id]}</Link>)}</div>
  </section>
}

function getNextMove({ isKo, hasShortlist, hasEnglishBaseline, hasFundTarget, hasApplicationSchedule, nextDeadline }: { isKo: boolean; hasShortlist: boolean; hasEnglishBaseline: boolean; hasFundTarget: boolean; hasApplicationSchedule: boolean; nextDeadline: { title: string; due_date: string } | null }) {
  if (!hasShortlist) return { href: "/au/study", title: isKo ? "후보 하나를 저장하세요" : "Save one study option", description: isKo ? "비교할 대학 또는 과정 하나만 고르면, 이후 비용·조건·지원 일정의 기준점이 생깁니다." : "Choose one university or course. It becomes the reference point for cost, requirements and deadlines.", cta: isKo ? "후보 탐색하기" : "Explore options" }
  if (!hasEnglishBaseline) return { href: "/myplan/english", title: isKo ? "현재 영어 점수를 기록하세요" : "Record your current English score", description: isKo ? "정확한 점수가 아니어도 괜찮습니다. 현재 위치를 기록하면 필요한 준비 기간을 가늠할 수 있어요." : "An estimate is enough. Once your starting point is visible, you can judge the preparation time you need.", cta: isKo ? "영어 계획 열기" : "Open English plan" }
  if (!hasFundTarget) return { href: "/myplan/money", title: isKo ? "초기 자금 목표를 입력하세요" : "Set your first funding target", description: isKo ? "완벽한 예산이 아니어도 됩니다. 먼저 목표 금액을 잡으면 부족액과 월별 계획이 보입니다." : "It does not need to be a perfect budget. A first target makes the gap and monthly plan visible.", cta: isKo ? "자금 계획 열기" : "Open money plan" }
  if (!hasApplicationSchedule) return { href: "/myplan/applications", title: isKo ? "지원 관련 일정 하나를 추가하세요" : "Add one application date", description: isKo ? "마감일 하나만 잡아도 막연한 계획이 실제 일정으로 바뀝니다." : "One date is enough to turn an abstract plan into a real timeline.", cta: isKo ? "일정 추가하기" : "Add a date" }
  if (nextDeadline) return { href: "/myplan/applications", title: isKo ? "다음 지원 일정을 10분 안에 확인하세요" : "Review your next date in ten minutes", description: isKo ? `다음 일정은 “${nextDeadline.title}”입니다. 필요한 문서와 다음 행동을 한 줄로 적어보세요.` : `Your next date is “${nextDeadline.title}”. Write down the document you need and the immediate next action.`, cta: isKo ? "일정 보기" : "View schedule" }
  return { href: "/au/study", title: isKo ? "1순위 후보의 입학 조건을 확인하세요" : "Check your first option's entry requirements", description: isKo ? "후보의 영어·학력·지원 시기를 한 번만 확인해도 다음 계획의 정확도가 높아집니다." : "A quick check of English, academic and intake requirements will make your next plan more precise.", cta: isKo ? "후보 비교하기" : "Compare options" }
}

function MetricCard({ icon: Icon, tone, label, value, detail, href }: { icon: LucideIcon; tone: "blue" | "emerald" | "violet"; label: string; value: string; detail: string; href: string }) {
  const tones = { blue: "bg-blue-50 text-blue-700", emerald: "bg-emerald-50 text-emerald-700", violet: "bg-violet-50 text-violet-700" }
  return <Link href={href} className="group px-1 py-2 transition hover:text-blue-700 sm:px-5 sm:first:pl-0"><span className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}><Icon className="size-4" /></span><p className="mt-4 text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{label}</p><p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p></Link>
}

function JourneyStep({ index, label, detail, complete }: { index: number; label: string; detail: string; complete: boolean }) {
  return <div className="relative min-h-24 border-l border-slate-200 pl-4 first:border-l-0 first:pl-0"><div className="flex items-center justify-between gap-2"><span className={cn("grid size-6 place-items-center rounded-full text-xs font-bold", complete ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400")}>{complete ? <Check className="size-3.5" /> : index}</span>{complete ? <CircleCheck className="size-4 text-blue-600" /> : <Circle className="size-4 text-slate-300" />}</div><p className={cn("mt-4 text-sm font-semibold", complete ? "text-blue-950" : "text-slate-700")}>{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>
}

function formatMonth(value: string, locale: string) { return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-AU", { year: "numeric", month: "long" }).format(new Date(`${value.slice(0, 7)}-01T00:00:00`)) }
function formatShortDate(value: string, locale: string) { return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-AU", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`)) }
function formatMoney(value: number, currency: string, locale: string) { try { return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-AU", { style: "currency", currency: currency || "AUD", maximumFractionDigits: 0 }).format(value) } catch { return `${currency || "AUD"} ${Math.round(value).toLocaleString()}` } }
