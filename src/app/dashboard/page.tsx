"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import type { User } from "@supabase/supabase-js"
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Circle,
  CircleCheck,
  DollarSign,
  FileCheck2,
  GraduationCap,
  Languages,
  Loader2,
  NotebookPen,
  Plus,
  Target,
  Trash2,
  UserRound,
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { majorLabel, resolveView } from "@/lib/degree-risk"
import { cn } from "@/lib/utils"

type Preferences = { field: string | null; goal: string | null; recommended_country: string | null }
type SavedOccupation = { id: number; occ_code: string; occ_title: string; country: string }
type SavedUniversity = { id: number; univ_slug: string; univ_name: string }
type SavedCourse = { id: number; course_name: string; college_name: string; field_name: string }
type Assessment = { id: string; major_pref: string; country_pref: string; primary_goal: string; created_at: string }
type PlanNote = { id: string; entry_date: string; title: string; content: string; created_at: string }
type PlanTask = { id: string; title: string; notes: string; kind: TaskKind; status: "todo" | "done"; due_date: string | null; completed_at: string | null; created_at: string }
type PlanBudget = { currency: string; current_savings: number | string; monthly_saving: number | string; target_amount: number | string | null; target_date: string | null }
type LanguageGoal = { exam_name: string; current_score: number | string | null; target_score: number | string | null; weekly_hours: number | string | null; test_date: string | null }
type TaskKind = "application" | "english" | "money" | "research" | "personal"

const taskLabels: Record<TaskKind, string> = { application: "Application", english: "English", money: "Money", research: "Research", personal: "Personal" }
const goalLabels: Record<string, string> = { study: "Study quality", visa: "Post-study work", pr: "Long-term pathway" }
const countryLabels: Record<string, string> = { AU: "Australia", CA: "Canada", IE: "Ireland", UK: "United Kingdom", US: "United States" }

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [occupations, setOccupations] = useState<SavedOccupation[]>([])
  const [universities, setUniversities] = useState<SavedUniversity[]>([])
  const [courses, setCourses] = useState<SavedCourse[]>([])
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [evidenceCount, setEvidenceCount] = useState(0)
  const [notes, setNotes] = useState<PlanNote[]>([])
  const [tasks, setTasks] = useState<PlanTask[]>([])
  const [budget, setBudget] = useState<PlanBudget>({ currency: "AUD", current_savings: 0, monthly_saving: 0, target_amount: null, target_date: null })
  const [language, setLanguage] = useState<LanguageGoal>({ exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })
  const [noteDraft, setNoteDraft] = useState("")
  const [taskDraft, setTaskDraft] = useState("")
  const [taskDate, setTaskDate] = useState("")
  const [taskKind, setTaskKind] = useState<TaskKind>("application")
  const [saving, setSaving] = useState<"note" | "task" | "budget" | "language" | null>(null)

  useEffect(() => {
    let active = true
    async function loadWorkspace(userId: string) {
      const results = await Promise.all([
        supabase.from("user_preferences").select("field, goal, recommended_country").eq("id", userId).maybeSingle(),
        supabase.from("saved_occupations").select("id, occ_code, occ_title, country").eq("user_id", userId).order("created_at", { ascending: false }).limit(4),
        supabase.from("saved_universities").select("id, univ_slug, univ_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(4),
        supabase.from("saved_courses").select("id, course_name, college_name, field_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(4),
        supabase.from("assessments").select("id, major_pref, country_pref, primary_goal, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("programme_evidence").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("plan_notes").select("id, entry_date, title, content, created_at").eq("user_id", userId).order("entry_date", { ascending: false }).order("created_at", { ascending: false }).limit(6),
        supabase.from("plan_tasks").select("id, title, notes, kind, status, due_date, completed_at, created_at").eq("user_id", userId).order("status").order("due_date", { ascending: true, nullsFirst: false }).limit(12),
        supabase.from("plan_budgets").select("currency, current_savings, monthly_saving, target_amount, target_date").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_language_goals").select("exam_name, current_score, target_score, weekly_hours, test_date").eq("user_id", userId).maybeSingle(),
      ])
      if (!active) return
      setPreferences((results[0].data as Preferences | null) ?? null)
      setOccupations((results[1].data as SavedOccupation[] | null) ?? [])
      setUniversities((results[2].data as SavedUniversity[] | null) ?? [])
      setCourses((results[3].data as SavedCourse[] | null) ?? [])
      setAssessment((results[4].data as Assessment | null) ?? null)
      setEvidenceCount(results[5].count ?? 0)
      setNotes((results[6].data as PlanNote[] | null) ?? [])
      setTasks((results[7].data as PlanTask[] | null) ?? [])
      setBudget((results[8].data as PlanBudget | null) ?? { currency: "AUD", current_savings: 0, monthly_saving: 0, target_amount: null, target_date: null })
      setLanguage((results[9].data as LanguageGoal | null) ?? { exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })
      setLoading(false)
    }
    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) await loadWorkspace(currentUser.id)
      else setLoading(false)
    }
    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) { setLoading(true); void loadWorkspace(currentUser.id) }
      else setLoading(false)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  async function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !noteDraft.trim()) return
    setSaving("note")
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase.from("plan_notes").insert({ user_id: user.id, entry_date: today, title: "", content: noteDraft.trim() }).select("id, entry_date, title, content, created_at").single()
    if (data) { setNotes((current) => [data as PlanNote, ...current].slice(0, 6)); setNoteDraft("") }
    setSaving(null)
  }

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !taskDraft.trim()) return
    setSaving("task")
    const { data } = await supabase.from("plan_tasks").insert({ user_id: user.id, title: taskDraft.trim(), kind: taskKind, due_date: taskDate || null }).select("id, title, notes, kind, status, due_date, completed_at, created_at").single()
    if (data) { setTasks((current) => [...current, data as PlanTask].sort(sortTasks)); setTaskDraft(""); setTaskDate("") }
    setSaving(null)
  }

  async function toggleTask(task: PlanTask) {
    const done = task.status !== "done"
    const { data } = await supabase.from("plan_tasks").update({ status: done ? "done" : "todo", completed_at: done ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", task.id).select("id, title, notes, kind, status, due_date, completed_at, created_at").single()
    if (data) setTasks((current) => current.map((item) => item.id === task.id ? data as PlanTask : item).sort(sortTasks))
  }

  async function removeTask(taskId: string) {
    const { error } = await supabase.from("plan_tasks").delete().eq("id", taskId)
    if (!error) setTasks((current) => current.filter((task) => task.id !== taskId))
  }

  async function saveBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user) return; setSaving("budget")
    const next = { user_id: user.id, currency: budget.currency.toUpperCase().slice(0, 3) || "AUD", current_savings: numericValue(budget.current_savings) ?? 0, monthly_saving: numericValue(budget.monthly_saving) ?? 0, target_amount: numericValue(budget.target_amount), target_date: budget.target_date || null, updated_at: new Date().toISOString() }
    const { data } = await supabase.from("plan_budgets").upsert(next).select("currency, current_savings, monthly_saving, target_amount, target_date").single()
    if (data) setBudget(data as PlanBudget); setSaving(null)
  }

  async function saveLanguage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user) return; setSaving("language")
    const next = { user_id: user.id, exam_name: language.exam_name.trim().slice(0, 80) || "IELTS", current_score: numericValue(language.current_score), target_score: numericValue(language.target_score), weekly_hours: numericValue(language.weekly_hours), test_date: language.test_date || null, updated_at: new Date().toISOString() }
    const { data } = await supabase.from("plan_language_goals").upsert(next).select("exam_name, current_score, target_score, weekly_hours, test_date").single()
    if (data) setLanguage(data as LanguageGoal); setSaving(null)
  }

  if (loading) return <DashboardSkeleton />
  if (!user) return <GuestPlan />

  const name = (user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "My"
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const savings = numericValue(budget.current_savings) ?? 0
  const monthlySaving = numericValue(budget.monthly_saving) ?? 0
  const targetAmount = numericValue(budget.target_amount)
  const remaining = targetAmount == null ? null : Math.max(targetAmount - savings, 0)
  const monthsToTarget = remaining != null && monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : null
  const requiredMonthly = remaining != null && budget.target_date ? requiredMonthlySaving(remaining, budget.target_date) : null
  const scoreGap = numberOrNull(language.target_score) != null && numberOrNull(language.current_score) != null ? Math.max(numberOrNull(language.target_score)! - numberOrNull(language.current_score)!, 0) : null
  const assessmentHref = assessment ? `/degree-risk/result?${new URLSearchParams({ major: assessment.major_pref, view: resolveView(assessment.country_pref), goal: assessment.primary_goal, aid: assessment.id })}` : "/degree-risk"

  return <main className="min-h-screen bg-[#f7f9fc]">
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <div><h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{name}&apos;s Plan</h1><p className="mt-1 text-sm text-slate-500">{formatLongDate(new Date())}</p></div>
        <div className="flex items-center gap-2"><a href="#today" className="hidden rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700 sm:inline-flex">New note</a><Link href="/profile" aria-label="Open profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">{avatarUrl ? <img src={avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" /> : <UserRound className="h-4 w-4" />}<span className="hidden sm:inline">Profile</span></Link></div>
      </div>
    </header>

    <section className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-9">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(350px,.7fr)]">
        <section id="today" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-2"><NotebookPen className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Today&apos;s page</h2></div>
          <form onSubmit={saveNote} className="mt-5"><textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={5} maxLength={12000} placeholder="Write down what you found, what worries you, or what changed today…" className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" /><div className="mt-3 flex justify-end"><button disabled={!noteDraft.trim() || saving === "note"} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{saving === "note" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Save note</button></div></form>
          {notes.length > 0 && <div className="mt-7 border-t border-slate-100 pt-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">Recent pages</p><div className="mt-3 space-y-3">{notes.slice(0, 3).map((note) => <article key={note.id} className="rounded-2xl bg-slate-50 px-4 py-3"><p className="text-xs font-medium text-slate-400">{formatShortDate(note.entry_date)}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.content}</p></article>)}</div></div>}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Dates to hold</h2></div>
          <form onSubmit={addTask} className="mt-5 space-y-3"><input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} maxLength={240} placeholder="e.g. Confirm September intake deadline" className={inputClass} /><div className="grid grid-cols-[1fr_auto] gap-2"><input type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} className={inputClass} /><select value={taskKind} onChange={(event) => setTaskKind(event.target.value as TaskKind)} className={inputClass}>{(Object.keys(taskLabels) as TaskKind[]).map((kind) => <option key={kind} value={kind}>{taskLabels[kind]}</option>)}</select></div><button disabled={!taskDraft.trim() || saving === "task"} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50">{saving === "task" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add date</button></form>
          <div className="mt-5 space-y-2">{tasks.slice(0, 5).map((task) => <div key={task.id} className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"><button onClick={() => void toggleTask(task)} className="shrink-0 text-slate-400 hover:text-emerald-600" aria-label={task.status === "done" ? "Mark task incomplete" : "Mark task complete"}>{task.status === "done" ? <CircleCheck className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5" />}</button><div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-medium", task.status === "done" ? "text-slate-400 line-through" : "text-slate-800")}>{task.title}</p><p className="mt-0.5 text-xs text-slate-400">{task.due_date ? formatShortDate(task.due_date) : "No date"} · {taskLabels[task.kind]}</p></div><button onClick={() => void removeTask(task.id)} className="opacity-0 transition group-hover:opacity-100 text-slate-300 hover:text-red-600" aria-label="Remove task"><Trash2 className="h-4 w-4" /></button></div>)}{tasks.length === 0 && <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">Keep only the dates that would change your plan.</p>}</div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold text-slate-950">Money plan</h2></div><form onSubmit={saveBudget} className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Currency"><input value={budget.currency} onChange={(event) => setBudget({ ...budget, currency: event.target.value.toUpperCase() })} maxLength={3} className={inputClass} /></Field><Field label="Saved now"><input inputMode="decimal" value={budget.current_savings ?? ""} onChange={(event) => setBudget({ ...budget, current_savings: event.target.value })} placeholder="0" className={inputClass} /></Field><Field label="Monthly saving"><input inputMode="decimal" value={budget.monthly_saving ?? ""} onChange={(event) => setBudget({ ...budget, monthly_saving: event.target.value })} placeholder="0" className={inputClass} /></Field><Field label="Target fund"><input inputMode="decimal" value={budget.target_amount ?? ""} onChange={(event) => setBudget({ ...budget, target_amount: event.target.value })} placeholder="e.g. 45000" className={inputClass} /></Field><Field label="Target date"><input type="date" value={budget.target_date ?? ""} onChange={(event) => setBudget({ ...budget, target_date: event.target.value })} className={inputClass} /></Field><div className="flex items-end"><button disabled={saving === "budget"} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving === "budget" && <Loader2 className="h-4 w-4 animate-spin" />}Save money plan</button></div></form><div className="mt-5 grid gap-3 sm:grid-cols-3"><Insight label="Still to save" value={remaining == null ? "Set a target" : money(remaining, budget.currency)} /><Insight label="At this pace" value={monthsToTarget == null ? "Add monthly saving" : monthsToTarget === 0 ? "Ready" : `${monthsToTarget} months`} /><Insight label="Needed each month" value={requiredMonthly == null ? "Add a target date" : money(requiredMonthly, budget.currency)} /></div></section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-2"><Languages className="h-5 w-5 text-violet-600" /><h2 className="text-lg font-semibold text-slate-950">English plan</h2></div><form onSubmit={saveLanguage} className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Exam"><input value={language.exam_name} onChange={(event) => setLanguage({ ...language, exam_name: event.target.value })} maxLength={80} className={inputClass} /></Field><Field label="Current score"><input inputMode="decimal" value={language.current_score ?? ""} onChange={(event) => setLanguage({ ...language, current_score: event.target.value })} placeholder="e.g. 6.0" className={inputClass} /></Field><Field label="Target score"><input inputMode="decimal" value={language.target_score ?? ""} onChange={(event) => setLanguage({ ...language, target_score: event.target.value })} placeholder="e.g. 7.0" className={inputClass} /></Field><Field label="Study hours / week"><input inputMode="decimal" value={language.weekly_hours ?? ""} onChange={(event) => setLanguage({ ...language, weekly_hours: event.target.value })} placeholder="e.g. 8" className={inputClass} /></Field><Field label="Test date"><input type="date" value={language.test_date ?? ""} onChange={(event) => setLanguage({ ...language, test_date: event.target.value })} className={inputClass} /></Field><div className="flex items-end"><button disabled={saving === "language"} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{saving === "language" && <Loader2 className="h-4 w-4 animate-spin" />}Save English plan</button></div></form><div className="mt-5 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-950">{scoreGap == null ? "Add a current and target score to see the gap you are closing." : scoreGap === 0 ? "Your current score meets the target you entered." : `${language.exam_name || "Your exam"}: ${scoreGap.toFixed(1)} band to close.`}{language.test_date && ` Test date: ${formatShortDate(language.test_date)}.`}</div></section>
      </div>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Research library</h2></div><p className="mt-1 text-sm text-slate-500">Saved choices and official evidence, kept beside your own notes.</p></div><Link href="/profile/evidence" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">Official links <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><ResearchCard icon={BriefcaseBusiness} title="Careers" items={occupations.map((item) => item.occ_title || item.occ_code)} href="/au/jobs" empty="No careers saved" /><ResearchCard icon={GraduationCap} title="Schools" items={universities.map((item) => item.univ_name || item.univ_slug)} href="/au/study" empty="No schools saved" /><ResearchCard icon={Target} title="Courses" items={courses.map((item) => item.course_name || item.field_name || item.college_name)} href="/au/study" empty="No courses saved" /><ResearchCard icon={FileCheck2} title="Checks" items={[assessment ? `Degree risk · ${majorLabel(assessment.major_pref)}` : "No degree-risk result", evidenceCount ? `${evidenceCount} official links saved` : "No official links saved"]} href={assessment ? assessmentHref : "/degree-risk"} empty="" /></div>{preferences && <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Current direction: <strong className="text-slate-800">{countryLabels[preferences.recommended_country ?? ""] ?? "Comparing countries"}</strong>{preferences.field && ` · ${preferences.field}`}{preferences.goal && ` · ${goalLabels[preferences.goal] ?? preferences.goal}`}</div>}</section>
    </section>
  </main>
}

function ResearchCard({ icon: Icon, title, items, href, empty }: { icon: typeof BookOpen; title: string; items: string[]; href: string; empty: string }) { return <article className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Icon className="h-4 w-4 text-blue-600" />{title}</div><div className="mt-3 min-h-16 space-y-1.5">{items.slice(0, 2).map((item) => <p key={item} className="truncate text-sm text-slate-600" title={item}>{item}</p>)}{items.length === 0 && empty && <p className="text-sm text-slate-400">{empty}</p>}</div><Link href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">Open <ArrowRight className="h-3.5 w-3.5" /></Link></article> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs font-semibold text-slate-500">{label}{children}</label> }
function Insight({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-emerald-50 px-3.5 py-3"><p className="text-xs font-medium text-emerald-800">{label}</p><p className="mt-1 text-sm font-semibold text-emerald-950">{value}</p></div> }
function GuestPlan() { return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><NotebookPen className="mx-auto h-7 w-7 text-blue-600" /><h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Keep your plan in one place.</h1><p className="mt-2 text-sm leading-6 text-slate-600">Write notes, set dates, work through your budget and keep the research you save in CampCareer together.</p><Link href="/login?next=/dashboard" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Sign in to start</Link></section></main> }
function DashboardSkeleton() { return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-6"><div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" /><div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="h-96 animate-pulse rounded-3xl bg-slate-200" /><div className="h-96 animate-pulse rounded-3xl bg-slate-200" /></div></div></main> }

const inputClass = "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
function numericValue(value: number | string | null) { if (value === null || value === "") return null; const number = Number(String(value).replace(/,/g, "")); return Number.isFinite(number) && number >= 0 ? number : null }
function numberOrNull(value: number | string | null) { return numericValue(value) }
function sortTasks(a: PlanTask, b: PlanTask) { if (a.status !== b.status) return a.status === "todo" ? -1 : 1; if (!a.due_date) return 1; if (!b.due_date) return -1; return a.due_date.localeCompare(b.due_date) }
function requiredMonthlySaving(remaining: number, targetDate: string) { const months = Math.ceil((new Date(`${targetDate}T00:00:00`).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)); return months > 0 ? remaining / months : null }
function money(value: number, currency: string) { try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "AUD", maximumFractionDigits: 0 }).format(value) } catch { return `${currency || "AUD"} ${Math.round(value).toLocaleString()}` } }
function formatShortDate(value: string) { return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`)) }
function formatLongDate(value: Date) { return new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(value) }
