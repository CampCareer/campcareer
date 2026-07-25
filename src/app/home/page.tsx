"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Loader2, NotebookPen } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { HomeDashboard } from "@/components/planner/home-dashboard"

type GoalProfile = { user_id: string; target_occupation_code: string; target_occupation_title: string; target_study_concept_slug: string; target_study_concept_label: string; target_intake_month: string | null; plan_title: string; strategy: string; setup_completed_at: string | null }
type GoalOption = { id: string; position: number; source_type: "saved_university" | "saved_course"; title: string; provider_name: string; field_name: string }
type Task = { id: string; title: string; notes: string; kind: string; status: "todo" | "done"; due_date: string | null; completed_at: string | null; created_at: string }
type Application = { id: string; goal_option_id: string | null; provider_name: string; programme_name: string; status: "planning" | "preparing" | "submitted" | "offer" | "declined"; deadline_date: string | null; offer_date: string | null; notes: string }
type Note = { id: string; entry_date: string; title: string; content: string; created_at: string }
type Budget = { currency: string; current_savings: number | string; monthly_saving: number | string; target_amount: number | string | null; target_date: string | null }
type LanguageGoal = { exam_name: string; current_score: number | string | null; target_score: number | string | null; weekly_hours: number | string | null; test_date: string | null }
type CompareSchool = { id: string; college_name: string; college_state: string; college_city?: string | null; tuition?: number | null; median_earnings?: number | null; employment_rate?: number | null; roi_score?: number | null }

function numericValue(v: number | string | null) { if (v === null || v === "") return null; const n = Number(String(v).replace(/,/g, "")); return Number.isFinite(n) && n >= 0 ? n : null }
function numberOrNull(v: number | string | null) { return numericValue(v) }

export default function HomePage() {
  const router = useRouter()
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [goalProfile, setGoalProfile] = useState<GoalProfile | null>(null)
  const [goalOptions, setGoalOptions] = useState<GoalOption[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [budget, setBudget] = useState<Budget>({ currency: "AUD", current_savings: 0, monthly_saving: 0, target_amount: null, target_date: null })
  const [language, setLanguage] = useState<LanguageGoal>({ exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })
  const [compareSchools, setCompareSchools] = useState<CompareSchool[]>([])

  useEffect(() => {
    let active = true
    async function load(userId: string) {
      const results = await Promise.all([
        supabase.from("plan_goal_profiles").select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_goal_options").select("id, position, source_type, title, provider_name, field_name").eq("user_id", userId).order("position"),
        supabase.from("plan_tasks").select("id, title, notes, kind, status, due_date, completed_at, created_at").eq("user_id", userId).order("status").order("due_date", { ascending: true, nullsFirst: false }).limit(12),
        supabase.from("plan_application_records").select("id, goal_option_id, provider_name, programme_name, status, deadline_date, offer_date, notes").eq("user_id", userId).order("deadline_date", { ascending: true, nullsFirst: false }),
        supabase.from("plan_notes").select("id, entry_date, title, content, created_at").eq("user_id", userId).order("entry_date", { ascending: false }).order("created_at", { ascending: false }).limit(6),
        supabase.from("plan_budgets").select("currency, current_savings, monthly_saving, target_amount, target_date").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_language_goals").select("exam_name, current_score, target_score, weekly_hours, test_date").eq("user_id", userId).maybeSingle(),
      ])
      if (!active) return
      setGoalProfile((results[0].data as GoalProfile | null) ?? null)
      setGoalOptions((results[1].data as GoalOption[] | null) ?? [])
      setTasks((results[2].data as Task[] | null) ?? [])
      setApplications((results[3].data as Application[] | null) ?? [])
      setNotes((results[4].data as Note[] | null) ?? [])
      setBudget((results[5].data as Budget | null) ?? { currency: "AUD", current_savings: 0, monthly_saving: 0, target_amount: null, target_date: null })
      setLanguage((results[6].data as LanguageGoal | null) ?? { exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })

      // Load wizard compare schools from localStorage
      try {
        const raw = localStorage.getItem("cc_compare_schools")
        if (raw) setCompareSchools(JSON.parse(raw))
      } catch {}
      setLoading(false)
    }
    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const u = data.user ?? null
      setUser(u)
      if (u) await load(u.id)
      else setLoading(false)
    }
    void init()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) { setLoading(true); void load(u.id) } else setLoading(false)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  // Read wizard compare data from localStorage (bridge from planner)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cc_compare_schools")
      if (raw) setCompareSchools(JSON.parse(raw))
    } catch {}
  }, [])

  if (loading) return <main className="min-h-screen bg-slate-50"><div className="flex min-h-screen items-center justify-center"><Loader2 className="size-6 animate-spin text-blue-500" /></div></main>

  if (!user) {
    return (
      <HomeDashboard
        goalProfile={{ plan_title: "", strategy: "", target_occupation_title: "", target_study_concept_label: "", target_intake_month: null }}
        goalOptions={[]}
        tasks={[]}
        applications={[]}
        notes={[]}
        compareSchools={[]}
        currentSavings={null}
        monthlySaving={null}
        targetAmount={null}
        targetDate={null}
        currency="AUD"
        currentEnglishScore={null}
        targetEnglishScore={null}
        englishExam="IELTS"
        onNavigate={(area) => router.push(`/planner/${area === "today" ? "" : area}`)}
      />
    )
  }

  if (!goalProfile?.setup_completed_at) {
    return (
      <HomeDashboard
        goalProfile={{ plan_title: "", strategy: "", target_occupation_title: "", target_study_concept_label: "", target_intake_month: null }}
        goalOptions={[]}
        tasks={[]}
        applications={[]}
        notes={[]}
        compareSchools={[]}
        currentSavings={null}
        monthlySaving={null}
        targetAmount={null}
        targetDate={null}
        currency="AUD"
        currentEnglishScore={null}
        targetEnglishScore={null}
        englishExam="IELTS"
        onNavigate={(area) => router.push(`/planner/${area === "today" ? "" : area}`)}
      />
    )
  }

  return (
    <HomeDashboard
      goalProfile={goalProfile}
      goalOptions={goalOptions}
      tasks={tasks.map(t => ({ ...t, kind: t.kind as "application" | "english" | "money" | "research" | "personal" }))}
      applications={applications.map((a) => ({ id: a.id, title: a.programme_name || a.provider_name || "Application", deadline_date: a.deadline_date, status: a.status }))}
      notes={notes}
      compareSchools={compareSchools}
      currentSavings={numberOrNull(budget.current_savings)}
      monthlySaving={numberOrNull(budget.monthly_saving)}
      targetAmount={numberOrNull(budget.target_amount)}
      targetDate={budget.target_date}
      currency={budget.currency}
      currentEnglishScore={numberOrNull(language.current_score)}
      targetEnglishScore={numberOrNull(language.target_score)}
      englishExam={language.exam_name}
      englishTestDate={language.test_date}
      onNavigate={(area) => router.push(`/planner/${area === "today" ? "" : area}`)}
    />
  )
}
