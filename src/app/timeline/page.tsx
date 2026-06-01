'use client'

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

type Task = {
  id: string
  label: string
}

type Phase = {
  id: string
  month: string
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

export default function TimelinePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  // 로드/복원
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (!data.user) return
      const { data: row } = await supabase
        .from('user_timeline')
        .select('checked_tasks')
        .eq('user_id', data.user.id)
        .maybeSingle()
      if (row?.checked_tasks) {
        setCheckedIds(new Set(row.checked_tasks as string[]))
      }
    })
  }, [])

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Study Abroad Timeline</h1>
        <p className="text-slate-500 text-sm mt-2">Your 12–18 month preparation plan</p>
      </div>

      {/* 진행률 */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
          <span className="text-sm font-bold text-indigo-600">{doneTasks} / {totalTasks} tasks</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{progress}% complete</p>
      </div>

      {/* 타임라인 */}
      <div className="space-y-4">
        {INITIAL_PHASES.map((phase, idx) => {
          const isCollapsed = collapsed.has(phase.id)
          const doneCount = phase.tasks.filter((t) => checkedIds.has(t.id)).length
          const allDone = doneCount === phase.tasks.length

          return (
            <div
              key={phase.id}
              className={`border rounded-2xl overflow-hidden shadow-sm ${phase.border} ${allDone ? "opacity-70" : ""}`}
            >
              {/* 페이즈 헤더 */}
              <button
                onClick={() => toggleCollapse(phase.id)}
                className={`w-full flex items-center justify-between px-5 py-4 ${phase.bg} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    allDone ? "bg-emerald-500" : "bg-slate-300"
                  }`}>
                    {allDone ? "✓" : idx + 1}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${phase.color}`}>{phase.title}</p>
                    <p className="text-xs text-slate-400">{phase.month}</p>
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
        })}
      </div>

    </div>
  )
}
