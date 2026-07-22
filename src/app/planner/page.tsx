"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import { DndContext, PointerSensor, type DragEndEvent, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
  GripVertical,
  MoreHorizontal,
  ArrowUpToLine,
  Trash2,
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { majorLabel, resolveView } from "@/lib/degree-risk"
import { cn } from "@/lib/utils"
import { PlannerToolbar } from "@/components/planner/planner-toolbar"
import { PlannerSidebar } from "@/components/planner/planner-sidebar"
import {
  type PlannerTab,
  loadTabs,
  saveTabs,
  loadActiveTabId,
  saveActiveTabId,
  createTab,
  plannerTabTitle,
} from "@/components/planner/planner-types"

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
type WidgetId = "today" | "dates" | "money" | "english" | "research"
type WidgetSize = "wide" | "half" | "narrow"
type PlannerPreferences = { theme: PlannerTheme; widget_order: WidgetId[]; widget_sizes: Partial<Record<WidgetId, WidgetSize>> }
type PlannerTheme = "mist" | "lavender" | "sage" | "peach" | "midnight"

const taskLabels: Record<TaskKind, string> = { application: "Application", english: "English", money: "Money", research: "Research", personal: "Personal" }
const goalLabels: Record<string, string> = { study: "Study quality", visa: "Post-study work", pr: "Long-term pathway" }
const countryLabels: Record<string, string> = { AU: "Australia", CA: "Canada", IE: "Ireland", UK: "United Kingdom", US: "United States" }
const defaultWidgetOrder: WidgetId[] = ["today", "dates", "money", "english", "research"]
const defaultWidgetSizes: Record<WidgetId, WidgetSize> = { today: "wide", dates: "narrow", money: "half", english: "half", research: "wide" }
export default function PlannerPage() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /* ── Tab / sidebar state ── */
  const [tabs, setTabs] = useState<PlannerTab[]>([])
  const [activeTabId, setActiveTabIdState] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const [historyCursor, setHistoryCursor] = useState(0)
  const [historyLength, setHistoryLength] = useState(0)

  /* ── Workspace data ── */
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
  const [plannerTheme, setPlannerTheme] = useState<PlannerTheme>("mist")
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(defaultWidgetOrder)
  const [widgetSizes, setWidgetSizes] = useState<Record<WidgetId, WidgetSize>>(defaultWidgetSizes)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  useEffect(() => {
    if (pathname === "/planner") router.replace("/myplan")
  }, [pathname, router])

  /* ── Tab helpers ── */
  const activeTab = useMemo(() => tabs.find((tab) => tab.id === activeTabId && !tab.trashedAt) ?? null, [tabs, activeTabId])

  const navigateToTab = useCallback((id: string) => {
    const h = historyRef.current
    const idx = historyIndexRef.current
    const next = h.slice(0, idx + 1)
    next.push(id)
    historyRef.current = next
    historyIndexRef.current = next.length - 1
    setActiveTabIdState(id)
    saveActiveTabId(id)
    setHistoryCursor(next.length - 1)
    setHistoryLength(next.length)
  }, [])

  const goBack = useCallback(() => {
    const idx = historyIndexRef.current
    if (idx <= 0) return
    const prevId = historyRef.current[idx - 1]
    historyIndexRef.current = idx - 1
    setActiveTabIdState(prevId)
    saveActiveTabId(prevId)
    setHistoryCursor(idx - 1)
  }, [])

  const goForward = useCallback(() => {
    const idx = historyIndexRef.current
    const h = historyRef.current
    if (idx >= h.length - 1) return
    const nextId = h[idx + 1]
    historyIndexRef.current = idx + 1
    setActiveTabIdState(nextId)
    saveActiveTabId(nextId)
    setHistoryCursor(idx + 1)
  }, [])

  function addTab() {
    const tab = createTab()
    const next = [...tabs, tab]
    setTabs(next)
    saveTabs(next)
    navigateToTab(tab.id)
  }

  function renameTab(id: string, title: string) {
    setTabs((prev) => {
      const next = prev.map((tab) => tab.id === id ? { ...tab, title: title.slice(0, 160), updatedAt: new Date().toISOString() } : tab)
      saveTabs(next)
      return next
    })
  }

  function updateTabContent(id: string, content: string) {
    setTabs((prev) => {
      const next = prev.map((tab) => tab.id === id ? { ...tab, content: content.slice(0, 12000), updatedAt: new Date().toISOString() } : tab)
      saveTabs(next)
      return next
    })
  }

  function duplicateTab(id: string) {
    const source = tabs.find((tab) => tab.id === id)
    if (!source) return
    const now = new Date().toISOString()
    const copy: PlannerTab = { ...source, id: crypto.randomUUID(), title: `${plannerTabTitle(source)} copy`.slice(0, 160), createdAt: now, updatedAt: now, trashedAt: null }
    const next = [...tabs, copy]
    setTabs(next)
    saveTabs(next)
    navigateToTab(copy.id)
  }

  function moveTabToTrash(id: string) {
    const now = new Date().toISOString()
    setTabs((prev) => {
      const next = prev.map((tab) => tab.id === id ? { ...tab, trashedAt: now, updatedAt: now } : tab)
      saveTabs(next)
      if (activeTabId === id) {
        const nextActive = next.find((tab) => !tab.trashedAt)
        if (nextActive) navigateToTab(nextActive.id)
        else {
          const fresh = createTab()
          const withFresh = [...next, fresh]
          saveTabs(withFresh)
          navigateToTab(fresh.id)
          return withFresh
        }
      }
      return next
    })
  }

  function restoreTab(id: string) {
    setTabs((prev) => {
      const next = prev.map((tab) => tab.id === id ? { ...tab, trashedAt: null, updatedAt: new Date().toISOString() } : tab)
      saveTabs(next)
      return next
    })
  }

  function deleteTabPermanently(id: string) {
    setTabs((prev) => {
      const next = prev.filter((tab) => tab.id !== id)
      if (next.length === 0) {
        const fresh = createTab()
        saveTabs([fresh])
        navigateToTab(fresh.id)
        return [fresh]
      }
      saveTabs(next)
      return next
    })
  }

  /* ── Data loading ── */
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
        supabase.from("planner_preferences").select("theme, widget_order, widget_sizes").eq("user_id", userId).maybeSingle(),
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
      const savedPlanner = results[10].data as PlannerPreferences | null
      if (savedPlanner) {
        const validOrder = savedPlanner.widget_order?.filter((widget): widget is WidgetId => defaultWidgetOrder.includes(widget)) ?? []
        setWidgetOrder([...validOrder, ...defaultWidgetOrder.filter((widget) => !validOrder.includes(widget))])
        setWidgetSizes({ ...defaultWidgetSizes, ...(savedPlanner.widget_sizes ?? {}) })
        // My Plan is intentionally a single, quiet canvas. Keep older saved
        // palette preferences from bringing card-style colours back into it.
        setPlannerTheme("mist")
      }
      setLoading(false)
    }
    async function initialise() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const currentUser = data.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await loadWorkspace(currentUser.id)
        const savedTabs = loadTabs()
        const availableTabs = savedTabs.filter((tab) => !tab.trashedAt)
        if (availableTabs.length === 0) {
          const first = createTab()
          const next = [...savedTabs, first]
          saveTabs(next)
          setTabs(next)
          navigateToTab(first.id)
        } else {
          setTabs(savedTabs)
          const lastActive = loadActiveTabId()
          const id = lastActive && availableTabs.some((tab) => tab.id === lastActive) ? lastActive : availableTabs[0].id
          navigateToTab(id)
        }
      } else {
        setLoading(false)
      }
    }
    void initialise()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) { setLoading(true); void loadWorkspace(currentUser.id) }
      else setLoading(false)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase, navigateToTab])

  /* ── Mutations ── */
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

  async function savePlannerPreferences(nextTheme: PlannerTheme, nextOrder: WidgetId[], nextSizes: Record<WidgetId, WidgetSize>) {
    if (!user) return
    await supabase.from("planner_preferences").upsert({ user_id: user.id, theme: nextTheme, widget_order: nextOrder, widget_sizes: nextSizes, updated_at: new Date().toISOString() })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = widgetOrder.indexOf(active.id as WidgetId)
    const newIndex = widgetOrder.indexOf(over.id as WidgetId)
    if (oldIndex < 0 || newIndex < 0) return
    const nextOrder = arrayMove(widgetOrder, oldIndex, newIndex)
    setWidgetOrder(nextOrder)
    void savePlannerPreferences(plannerTheme, nextOrder, widgetSizes)
  }

  function moveWidgetToTop(widget: WidgetId) {
    const index = widgetOrder.indexOf(widget)
    if (index <= 0) return
    const nextOrder = arrayMove(widgetOrder, index, 0)
    setWidgetOrder(nextOrder)
    void savePlannerPreferences(plannerTheme, nextOrder, widgetSizes)
  }

  if (loading) return <PlannerSkeleton />
  if (!user) return <GuestPlan />

  const savings = numericValue(budget.current_savings) ?? 0
  const monthlySaving = numericValue(budget.monthly_saving) ?? 0
  const targetAmount = numericValue(budget.target_amount)
  const remaining = targetAmount == null ? null : Math.max(targetAmount - savings, 0)
  const monthsToTarget = remaining != null && monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : null
  const requiredMonthly = remaining != null && budget.target_date ? requiredMonthlySaving(remaining, budget.target_date) : null
  const scoreGap = numberOrNull(language.target_score) != null && numberOrNull(language.current_score) != null ? Math.max(numberOrNull(language.target_score)! - numberOrNull(language.current_score)!, 0) : null
  const assessmentHref = assessment ? `/degree-risk/result?${new URLSearchParams({ major: assessment.major_pref, view: resolveView(assessment.country_pref), goal: assessment.primary_goal, aid: assessment.id })}` : "/degree-risk"
  const duplicateActivePage = () => { if (activeTab) duplicateTab(activeTab.id) }
  const moveActivePageToTrash = () => { if (activeTab) moveTabToTrash(activeTab.id) }

  return (
    <div className={cn("flex h-screen flex-col overflow-hidden transition-colors duration-300", plannerThemeClasses[plannerTheme])}>
      {/* ── Toolbar ── */}
      <PlannerToolbar
        tabs={tabs.filter((tab) => !tab.trashedAt)}
        activeTabId={activeTabId}
        sidebarOpen={sidebarOpen}
        canGoBack={historyCursor > 0}
        canGoForward={historyCursor < historyLength - 1}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onBack={goBack}
        onForward={goForward}
        onNewTab={addTab}
        onSelectTab={navigateToTab}
      />

      {/* ── Body: sidebar + content ── */}
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && (
          <PlannerSidebar
            tabs={tabs}
            activeTabId={activeTabId}
            onSelect={navigateToTab}
            onAdd={addTab}
            onRename={renameTab}
            onDuplicate={duplicateTab}
            onMoveToTrash={moveTabToTrash}
            onRestore={restoreTab}
            onDeletePermanently={deleteTabPermanently}
          />
        )}

        {/* ── Content ── */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {activeTab && <section className="mx-auto max-w-4xl px-6 pb-8 pt-12 sm:px-10 sm:pt-16">
            <input value={activeTab.title} onChange={(event) => renameTab(activeTab.id, event.target.value)} placeholder="Untitled" maxLength={160} aria-label="Page title" className="w-full bg-transparent text-4xl font-semibold tracking-tight text-slate-950 outline-none placeholder:text-slate-300 sm:text-5xl" />
            <textarea value={activeTab.content} onChange={(event) => updateTabContent(activeTab.id, event.target.value)} placeholder="Start writing…" maxLength={12000} rows={7} aria-label="Page body" className="mt-5 w-full resize-y bg-transparent text-base leading-8 text-slate-700 outline-none placeholder:text-slate-400" />
            <p className="mt-3 text-xs text-slate-400">Saved on this device</p>
          </section>}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
              <section className="mx-auto max-w-4xl space-y-12 px-6 pb-16 sm:px-10">
                  <PlannerWidget id="today" order={widgetOrder.indexOf("today")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                    <section id="today" className="relative py-2">
                      <div className="flex items-center gap-2"><NotebookPen className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Today&apos;s page</h2></div>
                      <form onSubmit={saveNote} className="mt-5"><textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={5} maxLength={12000} placeholder="Write down what you found, what worries you, or what changed today…" className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" /><div className="mt-3 flex justify-end"><button disabled={!noteDraft.trim() || saving === "note"} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{saving === "note" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Save note</button></div></form>
                      {notes.length > 0 && <div className="mt-7 border-t border-slate-100 pt-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">Recent pages</p><div className="mt-3 space-y-3">{notes.slice(0, 3).map((note) => <article key={note.id} className="rounded-2xl bg-slate-50 px-4 py-3"><p className="text-xs font-medium text-slate-400">{formatShortDate(note.entry_date)}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.content}</p></article>)}</div></div>}
                    </section>
                  </PlannerWidget>

                  <PlannerWidget id="dates" order={widgetOrder.indexOf("dates")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                    <section className="relative py-2">
                      <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Dates to hold</h2></div>
                      <form onSubmit={addTask} className="mt-5 space-y-3"><input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} maxLength={240} placeholder="e.g. Confirm September intake deadline" className={inputClass} /><div className="grid grid-cols-[1fr_auto] gap-2"><input type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} className={inputClass} /><select value={taskKind} onChange={(event) => setTaskKind(event.target.value as TaskKind)} className={inputClass}>{(Object.keys(taskLabels) as TaskKind[]).map((kind) => <option key={kind} value={kind}>{taskLabels[kind]}</option>)}</select></div><button disabled={!taskDraft.trim() || saving === "task"} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50">{saving === "task" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add date</button></form>
                      <div className="mt-5 space-y-2">{tasks.slice(0, 5).map((task) => <div key={task.id} className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"><button onClick={() => void toggleTask(task)} className="shrink-0 text-slate-400 hover:text-emerald-600" aria-label={task.status === "done" ? "Mark task incomplete" : "Mark task complete"}>{task.status === "done" ? <CircleCheck className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5" />}</button><div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-medium", task.status === "done" ? "text-slate-400 line-through" : "text-slate-800")}>{task.title}</p><p className="mt-0.5 text-xs text-slate-400">{task.due_date ? formatShortDate(task.due_date) : "No date"} · {taskLabels[task.kind]}</p></div><button onClick={() => void removeTask(task.id)} className="opacity-0 transition group-hover:opacity-100 text-slate-300 hover:text-red-600" aria-label="Remove task"><Trash2 className="h-4 w-4" /></button></div>)}{tasks.length === 0 && <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">Keep only the dates that would change your plan.</p>}</div>
                    </section>
                  </PlannerWidget>

                  <PlannerWidget id="money" order={widgetOrder.indexOf("money")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                    <section className="relative py-2">
                      <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold text-slate-950">Money plan</h2></div>
                      <form onSubmit={saveBudget} className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Currency"><input value={budget.currency} onChange={(event) => setBudget({ ...budget, currency: event.target.value.toUpperCase() })} maxLength={3} className={inputClass} /></Field><Field label="Saved now"><input inputMode="decimal" value={budget.current_savings ?? ""} onChange={(event) => setBudget({ ...budget, current_savings: event.target.value })} placeholder="0" className={inputClass} /></Field><Field label="Monthly saving"><input inputMode="decimal" value={budget.monthly_saving ?? ""} onChange={(event) => setBudget({ ...budget, monthly_saving: event.target.value })} placeholder="0" className={inputClass} /></Field><Field label="Target fund"><input inputMode="decimal" value={budget.target_amount ?? ""} onChange={(event) => setBudget({ ...budget, target_amount: event.target.value })} placeholder="e.g. 45000" className={inputClass} /></Field><Field label="Target date"><input type="date" value={budget.target_date ?? ""} onChange={(event) => setBudget({ ...budget, target_date: event.target.value })} className={inputClass} /></Field><div className="flex items-end"><button disabled={saving === "budget"} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving === "budget" && <Loader2 className="h-4 w-4 animate-spin" />}Save money plan</button></div></form>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Insight label="Still to save" value={remaining == null ? "Set a target" : money(remaining, budget.currency)} /><Insight label="Months left" value={monthsToTarget == null ? "—" : `${monthsToTarget} months`} /><Insight label="Required / month" value={requiredMonthly == null ? "—" : money(requiredMonthly, budget.currency)} /></div>
                    </section>
                  </PlannerWidget>

                  <PlannerWidget id="english" order={widgetOrder.indexOf("english")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                    <section className="relative py-2">
                      <div className="flex items-center gap-2"><Languages className="h-5 w-5 text-violet-600" /><h2 className="text-lg font-semibold text-slate-950">English plan</h2></div>
                      <form onSubmit={saveLanguage} className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Exam"><input value={language.exam_name} onChange={(event) => setLanguage({ ...language, exam_name: event.target.value })} maxLength={80} className={inputClass} /></Field><Field label="Current score"><input inputMode="decimal" value={language.current_score ?? ""} onChange={(event) => setLanguage({ ...language, current_score: event.target.value })} placeholder="e.g. 6.0" className={inputClass} /></Field><Field label="Target score"><input inputMode="decimal" value={language.target_score ?? ""} onChange={(event) => setLanguage({ ...language, target_score: event.target.value })} placeholder="e.g. 7.0" className={inputClass} /></Field><Field label="Study hours / week"><input inputMode="decimal" value={language.weekly_hours ?? ""} onChange={(event) => setLanguage({ ...language, weekly_hours: event.target.value })} placeholder="e.g. 8" className={inputClass} /></Field><Field label="Test date"><input type="date" value={language.test_date ?? ""} onChange={(event) => setLanguage({ ...language, test_date: event.target.value })} className={inputClass} /></Field><div className="flex items-end"><button disabled={saving === "language"} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{saving === "language" && <Loader2 className="h-4 w-4 animate-spin" />}Save English plan</button></div></form>
                      <div className="mt-5 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-950">{scoreGap == null ? "Add your current and target scores to see the gap." : scoreGap === 0 ? "You are at your target — well done!" : `You need +${scoreGap.toFixed(1)} points to reach your target.`}</div>
                    </section>
                  </PlannerWidget>

                <PlannerWidget id="research" order={widgetOrder.indexOf("research")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                  <section className="relative py-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Research library</h2></div><p className="mt-1 text-sm text-slate-500">Saved choices and official evidence, kept beside your own notes.</p></div>
                      <Link href="/profile/evidence" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">Official links <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <ResearchCard icon={BriefcaseBusiness} title="Careers" items={occupations.map((item) => item.occ_title || item.occ_code)} href="/au/jobs" empty="No careers saved" />
                      <ResearchCard icon={GraduationCap} title="Schools" items={universities.map((item) => item.univ_name || item.univ_slug)} href="/au/study" empty="No schools saved" />
                      <ResearchCard icon={Target} title="Courses" items={courses.map((item) => item.course_name || item.field_name || item.college_name)} href="/au/study" empty="No courses saved" />
                      <ResearchCard icon={FileCheck2} title="Checks" items={[assessment ? `Degree risk · ${majorLabel(assessment.major_pref)}` : "No degree-risk result", evidenceCount ? `${evidenceCount} official links saved` : "No official links saved"]} href={assessment ? assessmentHref : "/degree-risk"} empty="" />
                    </div>
                    {preferences && <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Current direction: <strong className="text-slate-800">{countryLabels[preferences.recommended_country ?? ""] ?? "Comparing countries"}</strong>{preferences.field && ` · ${preferences.field}`}{preferences.goal && ` · ${goalLabels[preferences.goal] ?? preferences.goal}`}</div>}
                  </section>
                </PlannerWidget>
              </section>
            </SortableContext>
          </DndContext>
        </main>
      </div>
    </div>
  )
}

/* ── Sub-components ── */
function ResearchCard({ icon: Icon, title, items, href, empty }: { icon: typeof BookOpen; title: string; items: string[]; href: string; empty: string }) { return <article className="border-l border-slate-200 pl-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Icon className="h-4 w-4 text-blue-600" />{title}</div><div className="mt-3 min-h-16 space-y-1.5">{items.slice(0, 2).map((item) => <p key={item} className="truncate text-sm text-slate-600" title={item}>{item}</p>)}{items.length === 0 && empty && <p className="text-sm text-slate-400">{empty}</p>}</div><Link href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">Open <ArrowRight className="h-3.5 w-3.5" /></Link></article> }

function PlannerWidget({ id, order, onMoveToTop, onDuplicatePage, onMovePageToTrash, children }: { id: WidgetId; order: number; onMoveToTop: (id: WidgetId) => void; onDuplicatePage: () => void; onMovePageToTrash: () => void; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const [menuOpen, setMenuOpen] = useState(false)
  return <div ref={setNodeRef} style={{ order, transform: CSS.Transform.toString(transform), transition }} className={cn("group relative min-w-0 border-t border-slate-200/80 pt-7 first:border-t-0 first:pt-2", isDragging && "z-20 opacity-60")}>
    <div className="absolute right-0 top-4 z-20">
      <button type="button" onClick={() => setMenuOpen((open) => !open)} className={cn("grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700", menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100")} aria-label={`Arrange ${id} section`} aria-expanded={menuOpen}><MoreHorizontal className="size-4" /></button>
      {menuOpen && <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-[0_14px_32px_rgba(15,23,42,.15)]">
        <button type="button" {...attributes} {...listeners} className="flex w-full cursor-grab items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-50 active:cursor-grabbing"><GripVertical className="size-3.5" />Drag to arrange</button>
        <button type="button" role="menuitem" onClick={() => { onMoveToTop(id); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-50"><ArrowUpToLine className="size-3.5" />Move section to top</button>
        <div className="my-1 border-t border-slate-100" />
        <button type="button" role="menuitem" onClick={() => { onDuplicatePage(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-50"><Plus className="size-3.5" />Duplicate page</button>
        <button type="button" role="menuitem" onClick={() => { onMovePageToTrash(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-red-600 hover:bg-red-50"><Trash2 className="size-3.5" />Move page to Trash</button>
      </div>}
    </div>
    {children}
  </div>
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-semibold text-slate-500">{label}{children}</label> }
function Insight({ label, value }: { label: string; value: string }) { return <div className="border-l-2 border-emerald-200 pl-3.5"><p className="text-xs font-medium text-emerald-800">{label}</p><p className="mt-1 text-sm font-semibold text-emerald-950">{value}</p></div> }
function GuestPlan() { return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><NotebookPen className="mx-auto h-7 w-7 text-blue-600" /><h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Your private My Plan.</h1><p className="mt-2 text-sm leading-6 text-slate-600">A flexible place for daily notes, deadlines, budget, English goals and the research you save in CampCareer.</p><Link href="/login?next=/myplan" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Sign in to start</Link></section></main> }
function PlannerSkeleton() { return <main className="min-h-screen bg-[#f7f9fc]"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-6"><div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" /><div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="h-96 animate-pulse rounded-3xl bg-slate-200" /><div className="h-96 animate-pulse rounded-3xl bg-slate-200" /></div></div></main> }

const inputClass = "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
const plannerThemeClasses: Record<PlannerTheme, string> = {
  mist: "bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_35%),#f7f9fc]",
  lavender: "bg-[radial-gradient(circle_at_top_left,_#eee5ff,_transparent_35%),#faf8ff]",
  sage: "bg-[radial-gradient(circle_at_top_left,_#def7e7,_transparent_35%),#f7fbf8]",
  peach: "bg-[radial-gradient(circle_at_top_left,_#ffe8d8,_transparent_35%),#fffaf7]",
  midnight: "bg-[radial-gradient(circle_at_top_left,_#334155,_transparent_35%),#0f172a]",
}
function numericValue(value: number | string | null) { if (value === null || value === "") return null; const number = Number(String(value).replace(/,/g, "")); return Number.isFinite(number) && number >= 0 ? number : null }
function numberOrNull(value: number | string | null) { return numericValue(value) }
function sortTasks(a: PlanTask, b: PlanTask) { if (a.status !== b.status) return a.status === "todo" ? -1 : 1; if (!a.due_date) return 1; if (!b.due_date) return -1; return a.due_date.localeCompare(b.due_date) }
function requiredMonthlySaving(remaining: number, targetDate: string) { const months = Math.ceil((new Date(`${targetDate}T00:00:00`).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)); return months > 0 ? remaining / months : null }
function money(value: number, currency: string) { try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "AUD", maximumFractionDigits: 0 }).format(value) } catch { return `${currency || "AUD"} ${Math.round(value).toLocaleString()}` } }
function formatShortDate(value: string) { return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`)) }
