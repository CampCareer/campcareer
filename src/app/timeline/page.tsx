'use client'

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pencil, Clock, History } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { parseLocalDate, subMonths, currentPhaseId } from "@/lib/timeline-schedule"
import type { User } from "@supabase/supabase-js"

type Task = {
  id: string
  label: string
}

type Phase = {
  id: string
  month: string
  startMonthsBefore: number
  endMonthsBefore: number
  title: string
  color: string
  bg: string
  border: string
  tasks: Task[]
}

const INITIAL_PHASES: Phase[] = [
  {
    id: "p1",
    month: "18–12 months before",
    startMonthsBefore: 18,
    endMonthsBefore: 12,
    title: "Research & Decision",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    tasks: [
      { id: "p1-1", label: "Decide target countries (US / AU / CA / UK / IE)" },
      { id: "p1-2", label: "Research fields of study & career outcomes" },
      { id: "p1-3", label: "Compare ROI across universities" },
      { id: "p1-4", label: "Set budget & funding plan" },
      { id: "p1-5", label: "Check English proficiency requirements (IELTS/TOEFL)" },
    ],
  },
  {
    id: "p2",
    month: "12–9 months before",
    startMonthsBefore: 12,
    endMonthsBefore: 9,
    title: "Test Prep & Shortlisting",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tasks: [
      { id: "p2-1", label: "Register for IELTS / TOEFL" },
      { id: "p2-2", label: "Shortlist 6–10 universities" },
      { id: "p2-3", label: "Research scholarship deadlines" },
      { id: "p2-4", label: "Contact professors (if research degree)" },
      { id: "p2-5", label: "Request academic transcripts" },
    ],
  },
  {
    id: "p3",
    month: "9–6 months before",
    startMonthsBefore: 9,
    endMonthsBefore: 6,
    title: "Application Prep",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    tasks: [
      { id: "p3-1", label: "Write Statement of Purpose (SOP)" },
      { id: "p3-2", label: "Request 2–3 recommendation letters" },
      { id: "p3-3", label: "Prepare CV / Resume" },
      { id: "p3-4", label: "Gather financial documents" },
      { id: "p3-5", label: "Complete English test (IELTS/TOEFL)" },
    ],
  },
  {
    id: "p4",
    month: "6–3 months before",
    startMonthsBefore: 6,
    endMonthsBefore: 3,
    title: "Submit Applications",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    tasks: [
      { id: "p4-1", label: "Submit all university applications" },
      { id: "p4-2", label: "Apply for scholarships" },
      { id: "p4-3", label: "Track application status" },
      { id: "p4-4", label: "Prepare for interviews (if required)" },
      { id: "p4-5", label: "Compare offer letters & scholarships" },
    ],
  },
  {
    id: "p5",
    month: "3–1 months before",
    startMonthsBefore: 3,
    endMonthsBefore: 1,
    title: "Pre-Departure",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tasks: [
      { id: "p5-1", label: "Accept offer & pay deposit" },
      { id: "p5-2", label: "Apply for student visa" },
      { id: "p5-3", label: "Book flights & accommodation" },
      { id: "p5-4", label: "Arrange health insurance" },
      { id: "p5-5", label: "Open international bank account" },
      { id: "p5-6", label: "Attend pre-departure orientation" },
    ],
  },
  {
    id: "p6",
    month: "Arrival",
    startMonthsBefore: 1,
    endMonthsBefore: 0,
    title: "Settle In",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tasks: [
      { id: "p6-1", label: "Register with university & get student ID" },
      { id: "p6-2", label: "Set up local bank account" },
      { id: "p6-3", label: "Get local SIM card" },
      { id: "p6-4", label: "Register with GP / health services" },
      { id: "p6-5", label: "Join student societies & network" },
    ],
  },
]

const COUNTRIES = [
  { value: "IE", label: "🇮🇪 Ireland",        flag: "🇮🇪", name: "Ireland" },
  { value: "AU", label: "🇦🇺 Australia",      flag: "🇦🇺", name: "Australia" },
  { value: "CA", label: "🇨🇦 Canada",         flag: "🇨🇦", name: "Canada" },
  { value: "UK", label: "🇬🇧 United Kingdom",  flag: "🇬🇧", name: "United Kingdom" },
  { value: "US", label: "🇺🇸 United States",   flag: "🇺🇸", name: "United States" },
]

const INTAKE_OPTIONS = [
  { value: "2026-spring", label: "2026 Spring", month: 1, day: 15 },
  { value: "2026-fall",   label: "2026 Fall",   month: 9, day: 1 },
  { value: "2027-spring", label: "2027 Spring", month: 1, day: 15 },
  { value: "2027-fall",   label: "2027 Fall",   month: 9, day: 1 },
  { value: "2028-spring", label: "2028 Spring", month: 1, day: 15 },
  { value: "2028-fall",   label: "2028 Fall",   month: 9, day: 1 },
]

type Goal = {
  target_country: string
  target_intake: string
  target_date: string | null
  dream_school: string | null
  dream_field: string | null
}

// intake 프리셋 → 'YYYY-MM-DD' 대표 날짜
function intakeToDate(intakeValue: string): string {
  const opt = INTAKE_OPTIONS.find((o) => o.value === intakeValue)
  if (!opt) return ""
  const year = parseInt(intakeValue.slice(0, 4), 10)
  const mm = String(opt.month).padStart(2, "0")
  const dd = String(opt.day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

// D-day 문자열 (날짜만 비교, 시분초 무시)
function calcDday(targetDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = parseLocalDate(targetDate)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000)
  if (diff > 0) return `D-${diff}`
  if (diff === 0) return "D-Day"
  return `D+${Math.abs(diff)}`
}

function fmtDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

// 날짜 범위 라벨: 같은 해면 "Mar – Sep 2025", 다르면 "Sep 2025 – Mar 2026"
function fmtRange(start: Date, end: Date): string {
  const sM = start.toLocaleDateString("en-US", { month: "short" })
  const eM = end.toLocaleDateString("en-US", { month: "short" })
  const sY = start.getFullYear()
  const eY = end.getFullYear()
  return sY === eY ? `${sM} – ${eM} ${eY}` : `${sM} ${sY} – ${eM} ${eY}`
}

// 오늘로부터 남은 일수 (날짜만 비교)
function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const t = parseLocalDate(dateStr)
  t.setHours(0, 0, 0, 0)
  return Math.ceil((t.getTime() - today.getTime()) / 86400000)
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const WEEKDAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"]

function MiniCalendar({ schedule }: { schedule: Record<string, { deadlineStr: string; status: "past" | "current" | "upcoming" }> }) {
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay()
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate()

  // day → status for all deadlines in the current view month/year (first hit wins)
  const deadlineMap = new Map<number, "past" | "current" | "upcoming">()
  for (const val of Object.values(schedule)) {
    const parts = val.deadlineStr.split("-")
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (y === viewYear && m === viewMonth && !deadlineMap.has(d)) {
      deadlineMap.set(d, val.status)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-slate-100 text-slate-400">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-semibold text-slate-700">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-slate-100 text-slate-400">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mt-2 mb-1">
        {WEEKDAY_NAMES.map(d => (
          <div key={d} className="text-[9px] text-slate-400 text-center">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1
          const isToday = todayYear === viewYear && todayMonth === viewMonth && todayDate === day
          const dotStatus = deadlineMap.get(day)
          return (
            <div key={day} className="relative flex flex-col items-center">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] ${
                isToday ? "bg-indigo-600 text-white font-bold" : "text-slate-600"
              }`}>
                {day}
              </span>
              {dotStatus && (
                <div className={`w-1 h-1 rounded-full ${
                  dotStatus === "current"  ? "bg-indigo-400" :
                  dotStatus === "upcoming" ? "bg-slate-400"  : "bg-slate-300"
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TimelinePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  // 목표(미니 온보딩)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [pastGroupOpen, setPastGroupOpen] = useState(false)

  // 폼 입력용 임시 state
  const [fCountry, setFCountry] = useState("IE")
  const [fIntake, setFIntake] = useState("2026-fall")
  const [fUseExact, setFUseExact] = useState(false)
  const [fExactDate, setFExactDate] = useState("")
  const [fSchool, setFSchool] = useState("")
  const [fField, setFField] = useState("")

  const goalIsSet = !!(goal && goal.target_country && goal.target_intake)

  // 로드/복원 (진행상황 + 목표)
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (!data.user) return
      const { data: row } = await supabase
        .from('user_timeline')
        .select('checked_tasks, target_country, target_intake, target_date, dream_school, dream_field')
        .eq('user_id', data.user.id)
        .maybeSingle()
      if (row?.checked_tasks) {
        setCheckedIds(new Set(row.checked_tasks as string[]))
      }
      if (row?.target_country && row?.target_intake) {
        setGoal({
          target_country: row.target_country,
          target_intake: row.target_intake,
          target_date: row.target_date ?? null,
          dream_school: row.dream_school ?? null,
          dream_field: row.dream_field ?? null,
        })
        // 현재 단계만 펼치고 나머지는 접은 상태로 시작
        if (row.target_date) {
          const cur = currentPhaseId(row.target_date)
          setCollapsed(new Set(INITIAL_PHASES.filter((p) => p.id !== cur).map((p) => p.id)))
          // current가 없으면(모든 단계 past) past 그룹을 기본 펼침
          setPastGroupOpen(cur === null)
        }
      }
    })
  }, [])

  async function handleSaveGoal() {
    if (!user) return
    const target_date = fUseExact && fExactDate ? fExactDate : intakeToDate(fIntake)
    const nextGoal: Goal = {
      target_country: fCountry,
      target_intake: fIntake,
      target_date,
      dream_school: fSchool.trim() || null,
      dream_field: fField.trim() || null,
    }
    // ★ checked_tasks 보존: 현재 state(로드/복원된 최신값)를 함께 upsert해
    //    INSERT(첫 목표 설정)·UPDATE 양쪽에서 진행상황이 절대 날아가지 않게 한다.
    await supabase
      .from('user_timeline')
      .upsert(
        {
          user_id: user.id,
          ...nextGoal,
          checked_tasks: Array.from(checkedIds),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
    setGoal(nextGoal)
    setShowGoalForm(false)
    // 현재 단계만 펼치고 나머지는 접기
    if (target_date) {
      const cur = currentPhaseId(target_date)
      setCollapsed(new Set(INITIAL_PHASES.filter((p) => p.id !== cur).map((p) => p.id)))
      // current가 없으면(모든 단계 past) past 그룹을 기본 펼침
      setPastGroupOpen(cur === null)
    }
  }

  function openGoalForm() {
    if (goal) {
      setFCountry(goal.target_country || "IE")
      setFIntake(goal.target_intake || "2026-fall")
      const intakeDate = intakeToDate(goal.target_intake)
      if (goal.target_date && goal.target_date !== intakeDate) {
        setFUseExact(true)
        setFExactDate(goal.target_date)
      } else {
        setFUseExact(false)
        setFExactDate("")
      }
      setFSchool(goal.dream_school || "")
      setFField(goal.dream_field || "")
    }
    setShowGoalForm(true)
  }

  async function toggleTask(taskId: string) {
    const next = new Set(checkedIds)
    if (next.has(taskId)) next.delete(taskId); else next.add(taskId)
    setCheckedIds(next)
    if (!user) return
    await supabase
      .from('user_timeline')
      .upsert(
        { user_id: user.id, checked_tasks: Array.from(next), updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
  }

  function toggleCollapse(phaseId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(phaseId)) { next.delete(phaseId) } else { next.add(phaseId) }
      return next
    })
  }

  const totalTasks = INITIAL_PHASES.reduce((acc, p) => acc + p.tasks.length, 0)
  const doneTasks  = INITIAL_PHASES.reduce((acc, p) => acc + p.tasks.filter((t) => checkedIds.has(t.id)).length, 0)
  const progress   = Math.round((doneTasks / totalTasks) * 100)

  // ── 날짜 역산 스케줄 (goal.target_date 있을 때만) ──
  const targetDateStr = goal?.target_date || null
  const curId = targetDateStr ? currentPhaseId(targetDateStr) : null

  type Sched = {
    deadline: Date
    deadlineStr: string
    status: "past" | "current" | "upcoming"
    range: string
  }
  const schedule: Record<string, Sched> = {}
  if (targetDateStr) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = parseLocalDate(targetDateStr)
    for (const p of INITIAL_PHASES) {
      const ws = subMonths(target, p.startMonthsBefore); ws.setHours(0, 0, 0, 0)
      const dl = subMonths(target, p.endMonthsBefore);   dl.setHours(0, 0, 0, 0)
      const status: Sched["status"] =
        dl.getTime() < today.getTime() ? "past" : p.id === curId ? "current" : "upcoming"
      schedule[p.id] = { deadline: dl, deadlineStr: toISODate(dl), status, range: fmtRange(ws, dl) }
    }
  }

  // 다가오는 마감: 오늘 이후(past 아님)인 단계만 가까운 순
  const upcoming = targetDateStr
    ? INITIAL_PHASES
        .filter((p) => schedule[p.id]?.status !== "past")
        .sort((a, b) => schedule[a.id].deadline.getTime() - schedule[b.id].deadline.getTime())
    : []

  // 왼쪽 칼럼 재배치용 단계 분류 (INITIAL_PHASES가 이미 시간순이므로 순서 보존)
  const currentPhases  = targetDateStr ? INITIAL_PHASES.filter((p) => schedule[p.id]?.status === "current") : []
  const upcomingPhases = targetDateStr ? INITIAL_PHASES.filter((p) => schedule[p.id]?.status === "upcoming") : []
  const pastPhases     = targetDateStr ? INITIAL_PHASES.filter((p) => schedule[p.id]?.status === "past") : []

  const currentTitle = curId
    ? INITIAL_PHASES.find((p) => p.id === curId)?.title ?? "—"
    : targetDateStr ? "All stages passed" : "—"

  function ddayBadgeClass(dateStr: string): string {
    const d = daysUntil(dateStr)
    if (d <= 14) return "bg-red-50 text-red-600"
    if (d <= 30) return "bg-amber-50 text-amber-600"
    return "bg-slate-100 text-slate-500"
  }

  function renderPhaseCard(phase: Phase, idx: number) {
    const isCollapsed = collapsed.has(phase.id)
    const doneCount = phase.tasks.filter((t) => checkedIds.has(t.id)).length
    const allDone = doneCount === phase.tasks.length
    const sch = schedule[phase.id]
    const status = sch?.status
    const subtitle = sch ? sch.range : phase.month

    const ringCls = status === "current" ? "ring-2 ring-indigo-400" : ""
    const dimCls = status === "past" ? "opacity-60" : allDone ? "opacity-70" : ""

    return (
      <div
        key={phase.id}
        className={`border rounded-2xl overflow-hidden shadow-sm ${phase.border} ${ringCls} ${dimCls}`}
      >
        {/* 페이즈 헤더 */}
        <button
          onClick={() => toggleCollapse(phase.id)}
          className={`w-full flex items-center justify-between px-5 py-4 ${phase.bg} transition-colors`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10 ${
              allDone ? "bg-emerald-500" : status === "current" ? "bg-indigo-500" : "bg-slate-300"
            }`}>
              {allDone ? "✓" : idx + 1}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${phase.color}`}>{phase.title}</p>
                {status === "current" && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                    Current
                  </span>
                )}
                {status === "past" && (
                  allDone ? (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                      Done
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-600">
                      Past due
                    </span>
                  )
                )}
              </div>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{doneCount}/{phase.tasks.length}</span>
            {isCollapsed
              ? <ChevronDown className="w-4 h-4 text-slate-400" />
              : <ChevronUp className="w-4 h-4 text-slate-400" />
            }
          </div>
        </button>

        {/* 태스크 목록 */}
        {!isCollapsed && (
          <ul className="bg-white divide-y divide-slate-100">
            {phase.tasks.map((task) => {
              const isDone = checkedIds.has(task.id)
              return (
                <li key={task.id}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    {isDone
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      : <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                    }
                    <span className={`text-sm ${isDone ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {task.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* 목표 카드 (설정됨) 또는 목표 설정 폼 (미설정/편집) */}
      {goalIsSet && !showGoalForm ? (
        (() => {
          const c = COUNTRIES.find((x) => x.value === goal!.target_country)
          const intakeLabel =
            INTAKE_OPTIONS.find((o) => o.value === goal!.target_intake)?.label ?? goal!.target_intake
          const primary = goal!.dream_school || c?.name || goal!.target_country
          return (
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900 truncate">
                  {c?.flag ? `${c.flag} ` : ""}{primary}
                  {goal!.dream_field ? <span className="text-slate-500"> · {goal!.dream_field}</span> : null}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Target: <span className="font-medium text-slate-700">{intakeLabel}</span>
                  {goal!.target_date && (
                    <span className="text-slate-400"> · {fmtDate(goal!.target_date)}</span>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {goal!.target_date && (
                  <span className="text-xl font-bold text-indigo-600 leading-none">
                    {calcDday(goal!.target_date)}
                  </span>
                )}
                <button
                  onClick={openGoalForm}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          )
        })()
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {goalIsSet ? "Update your goal" : "Set your goal"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">We&apos;ll build your timeline around it.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Destination</label>
              <select
                value={fCountry}
                onChange={(e) => setFCountry(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Target intake */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Target intake</label>
              <select
                value={fIntake}
                onChange={(e) => setFIntake(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                {INTAKE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 정밀 날짜 (선택) */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={fUseExact}
                onChange={(e) => setFUseExact(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-300"
              />
              Know your exact start date?
            </label>
            {fUseExact && (
              <input
                type="date"
                value={fExactDate}
                onChange={(e) => setFExactDate(e.target.value)}
                className="mt-2 w-full sm:w-56 h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            )}
          </div>

          {/* Dream school / field (선택) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Dream school (optional)</label>
              <input
                type="text"
                value={fSchool}
                onChange={(e) => setFSchool(e.target.value)}
                placeholder="Trinity College Dublin"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Dream field (optional)</label>
              <input
                type="text"
                value={fField}
                onChange={(e) => setFField(e.target.value)}
                placeholder="Computer Science"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveGoal}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              {goalIsSet ? "Update goal" : "Set goal"}
            </button>
            {goalIsSet && (
              <button
                onClick={() => setShowGoalForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {goalIsSet ? (
        <>
          {/* 요약 통계 바 */}
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Tasks</p>
              <p className="text-lg font-bold text-slate-900">
                {doneTasks} <span className="text-sm font-medium text-slate-400">/ {totalTasks} completed</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Progress</p>
              <p className="text-lg font-bold text-indigo-600">{progress}%</p>
              <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Now</p>
              <p className="text-lg font-bold text-slate-900 truncate">{currentTitle}</p>
            </div>
          </div>

          {/* 2단 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 단계 카드 (현재 → 미래 → 지난 단계 그룹 순) */}
            <div className="lg:col-span-2 space-y-4 relative">
              <div className="absolute left-[18px] top-8 bottom-8 w-0.5 bg-slate-200 z-0 pointer-events-none" />
              {/* 모든 단계가 past인 경우 안내 */}
              {curId === null && (
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm text-sm text-slate-500">
                  All phases are past — focus on arrival 🎉
                </div>
              )}

              {/* (1) 현재 단계 (펼친 상태, 최상단 강조) */}
              {currentPhases.map((phase) => renderPhaseCard(phase, INITIAL_PHASES.indexOf(phase)))}

              {/* (2) 미래 단계들 (시간순, 접힘 기본) */}
              {upcomingPhases.map((phase) => renderPhaseCard(phase, INITIAL_PHASES.indexOf(phase)))}

              {/* (3) 지난 단계 접이식 그룹 */}
              {pastPhases.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setPastGroupOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-500">
                      <History className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {pastPhases.length} past phase{pastPhases.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    {pastGroupOpen
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />
                    }
                  </button>
                  {pastGroupOpen && (
                    <div className="px-3 pb-3 pt-1 space-y-3">
                      {pastPhases.map((phase) => renderPhaseCard(phase, INITIAL_PHASES.indexOf(phase)))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 오른쪽: 다가오는 마감 */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="mb-4">
                  <MiniCalendar schedule={schedule} />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-900">Upcoming deadlines</h3>
                </div>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-slate-400 leading-relaxed">
                    All deadlines passed — focus on arrival 🎉
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {upcoming.map((p) => {
                      const sch = schedule[p.id]
                      return (
                        <li key={p.id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{p.title}</p>
                            <p className="text-xs text-slate-400">{fmtDate(sch.deadlineStr)}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${ddayBadgeClass(sch.deadlineStr)}`}>
                            {calcDday(sch.deadlineStr)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 목표 미설정: 기존 단일 컬럼 리스트 (month 문자열, 역산 비활성) */
        <div className="space-y-4">
          {INITIAL_PHASES.map((phase, idx) => renderPhaseCard(phase, idx))}
        </div>
      )}

    </div>
  )
}
