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
import { PlannerSidebar, type PlannerArea } from "@/components/planner/planner-sidebar"
import { GoalSetup, type GoalSetupData } from "@/components/planner/goal-setup"
import { TodayDashboard, type TodayGoalOption } from "@/components/planner/today-dashboard"
import { buildPlanHealth } from "@/lib/plan-health"
import { getRoiReportReadiness } from "@/lib/report-plan-bridge"
import {
  ApplicationsSpace,
  EnglishTargetSpace,
  MoneyRunwaySpace,
  MyPathwaySpace,
  ResearchDeskSpace,
  type ExecutionApplication,
  type ExecutionBudget,
  type ExecutionDocument,
  type ExecutionEnglishBlock,
  type ExecutionGoalOption,
  type ExecutionLanguage,
  type ExecutionMoneyScenario,
  type ExecutionPathwayDecision,
  type ExecutionResearchItem,
  type ExecutionResearchSource,
} from "@/components/planner/execution-spaces"
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
type SavedStudyConcept = { id: number; concept_slug: string; concept_label: string; concept_label_ko: string }
type PlanGoalProfile = { user_id: string; target_occupation_code: string; target_occupation_title: string; target_study_concept_slug: string; target_study_concept_label: string; target_intake_month: string | null; plan_title: string; strategy: string; setup_completed_at: string | null }
type PlanGoalOption = TodayGoalOption
type PlanApplicationRecord = ExecutionApplication
type PlanApplicationDocument = ExecutionDocument
type PlanMoneyScenario = ExecutionMoneyScenario
type PlanEnglishStudyBlock = ExecutionEnglishBlock
type PlanResearchItem = ExecutionResearchItem
type PlanPathwayDecision = ExecutionPathwayDecision
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
export default function PlannerPage({ initialArea = "today" }: { initialArea?: PlannerArea }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /* ── Tab / sidebar state ── */
  const [tabs, setTabs] = useState<PlannerTab[]>([])
  const [activeTabId, setActiveTabIdState] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeArea, setActiveArea] = useState<PlannerArea>(initialArea)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const [historyCursor, setHistoryCursor] = useState(0)
  const [historyLength, setHistoryLength] = useState(0)

  /* ── Workspace data ── */
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [occupations, setOccupations] = useState<SavedOccupation[]>([])
  const [universities, setUniversities] = useState<SavedUniversity[]>([])
  const [courses, setCourses] = useState<SavedCourse[]>([])
  const [studyConcepts, setStudyConcepts] = useState<SavedStudyConcept[]>([])
  const [goalProfile, setGoalProfile] = useState<PlanGoalProfile | null>(null)
  const [goalOptions, setGoalOptions] = useState<PlanGoalOption[]>([])
  const [applicationRecords, setApplicationRecords] = useState<PlanApplicationRecord[]>([])
  const [applicationDocuments, setApplicationDocuments] = useState<PlanApplicationDocument[]>([])
  const [moneyScenario, setMoneyScenario] = useState<PlanMoneyScenario>({ scholarship_amount: 0, conservative_cost_lift: 15 })
  const [englishBlocks, setEnglishBlocks] = useState<PlanEnglishStudyBlock[]>([])
  const [researchItems, setResearchItems] = useState<PlanResearchItem[]>([])
  const [pathwayDecision, setPathwayDecision] = useState<PlanPathwayDecision>({ leading_option_id: null, rationale: "" })
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

  useEffect(() => setActiveArea(initialArea), [initialArea])

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
        supabase.from("saved_study_concepts").select("id, concept_slug, concept_label, concept_label_ko").eq("user_id", userId).eq("country", "AU").order("created_at", { ascending: false }).limit(4),
        supabase.from("assessments").select("id, major_pref, country_pref, primary_goal, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("programme_evidence").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("plan_notes").select("id, entry_date, title, content, created_at").eq("user_id", userId).order("entry_date", { ascending: false }).order("created_at", { ascending: false }).limit(6),
        supabase.from("plan_tasks").select("id, title, notes, kind, status, due_date, completed_at, created_at").eq("user_id", userId).order("status").order("due_date", { ascending: true, nullsFirst: false }).limit(12),
        supabase.from("plan_budgets").select("currency, current_savings, monthly_saving, target_amount, target_date").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_language_goals").select("exam_name, current_score, target_score, weekly_hours, test_date").eq("user_id", userId).maybeSingle(),
        supabase.from("planner_preferences").select("theme, widget_order, widget_sizes").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_goal_profiles").select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_goal_options").select("id, position, source_type, title, provider_name, field_name").eq("user_id", userId).order("position", { ascending: true }),
        supabase.from("plan_application_records").select("id, goal_option_id, provider_name, programme_name, status, deadline_date, offer_date, notes").eq("user_id", userId).order("deadline_date", { ascending: true, nullsFirst: false }),
        supabase.from("plan_application_documents").select("id, application_id, label, status").eq("user_id", userId).order("created_at", { ascending: true }),
        supabase.from("plan_money_scenarios").select("scholarship_amount, conservative_cost_lift").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_english_study_blocks").select("id, day_of_week, focus, minutes").eq("user_id", userId).order("day_of_week", { ascending: true }),
        supabase.from("plan_research_items").select("id, source_type, source_reference, title, provider_name, field_name, status").eq("user_id", userId).order("updated_at", { ascending: false }),
        supabase.from("plan_pathway_decisions").select("leading_option_id, rationale").eq("user_id", userId).maybeSingle(),
      ])
      if (!active) return
      setPreferences((results[0].data as Preferences | null) ?? null)
      setOccupations((results[1].data as SavedOccupation[] | null) ?? [])
      setUniversities((results[2].data as SavedUniversity[] | null) ?? [])
      setCourses((results[3].data as SavedCourse[] | null) ?? [])
      setStudyConcepts((results[4].data as SavedStudyConcept[] | null) ?? [])
      setAssessment((results[5].data as Assessment | null) ?? null)
      setEvidenceCount(results[6].count ?? 0)
      setNotes((results[7].data as PlanNote[] | null) ?? [])
      setTasks((results[8].data as PlanTask[] | null) ?? [])
      setBudget((results[9].data as PlanBudget | null) ?? { currency: "AUD", current_savings: 0, monthly_saving: 0, target_amount: null, target_date: null })
      setLanguage((results[10].data as LanguageGoal | null) ?? { exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })
      const savedPlanner = results[11].data as PlannerPreferences | null
      setGoalProfile((results[12].data as PlanGoalProfile | null) ?? null)
      setGoalOptions((results[13].data as PlanGoalOption[] | null) ?? [])
      setApplicationRecords((results[14].data as PlanApplicationRecord[] | null) ?? [])
      setApplicationDocuments((results[15].data as PlanApplicationDocument[] | null) ?? [])
      setMoneyScenario((results[16].data as PlanMoneyScenario | null) ?? { scholarship_amount: 0, conservative_cost_lift: 15 })
      setEnglishBlocks((results[17].data as PlanEnglishStudyBlock[] | null) ?? [])
      setResearchItems((results[18].data as PlanResearchItem[] | null) ?? [])
      setPathwayDecision((results[19].data as PlanPathwayDecision | null) ?? { leading_option_id: null, rationale: "" })
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

  async function completeGoalSetup(data: GoalSetupData) {
    if (!user) return false
    const now = new Date().toISOString()
    const profile = {
      user_id: user.id,
      country: "AU",
      target_occupation_code: data.occupation?.occ_code ?? "",
      target_occupation_title: data.occupation?.occ_title ?? "",
      target_study_concept_slug: data.studyConcept?.concept_slug ?? "",
      target_study_concept_label: data.studyConcept?.concept_label || data.studyConcept?.concept_label_ko || "",
      target_intake_month: data.intakeMonth,
      plan_title: data.planTitle,
      strategy: data.strategy,
      setup_completed_at: null,
      updated_at: now,
    }
    const { error: profileError } = await supabase.from("plan_goal_profiles").upsert(profile)
    if (profileError) return false

    const { error: removeOptionsError } = await supabase.from("plan_goal_options").delete().eq("user_id", user.id)
    if (removeOptionsError) return false
    if (data.options.length) {
      const { error: optionsError } = await supabase.from("plan_goal_options").insert(data.options.map((option, index) => ({ user_id: user.id, position: index + 1, source_type: option.sourceType, source_reference: option.sourceReference, title: option.title, provider_name: option.providerName, field_name: option.fieldName, updated_at: now })))
      if (optionsError) return false
    }

    const { data: completedProfile, error: completeError } = await supabase
      .from("plan_goal_profiles")
      .update({ setup_completed_at: now, updated_at: now })
      .eq("user_id", user.id)
      .select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at")
      .single()
    if (completeError || !completedProfile) return false
    setGoalProfile(completedProfile as PlanGoalProfile)
    return true
  }

  async function createApplication(input: Omit<PlanApplicationRecord, "id">) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_application_records")
      .insert({ user_id: user.id, ...input, updated_at: new Date().toISOString() })
      .select("id, goal_option_id, provider_name, programme_name, status, deadline_date, offer_date, notes")
      .single()
    if (error || !data) return false
    setApplicationRecords((current) => [...current, data as PlanApplicationRecord].sort(sortApplicationRecords))
    return true
  }

  async function updateApplication(id: string, patch: Partial<PlanApplicationRecord>) {
    const { data } = await supabase
      .from("plan_application_records")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, goal_option_id, provider_name, programme_name, status, deadline_date, offer_date, notes")
      .single()
    if (data) setApplicationRecords((current) => current.map((item) => item.id === id ? data as PlanApplicationRecord : item).sort(sortApplicationRecords))
  }

  async function createApplicationDocument(input: Omit<PlanApplicationDocument, "id">) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_application_documents")
      .insert({ user_id: user.id, ...input, updated_at: new Date().toISOString() })
      .select("id, application_id, label, status")
      .single()
    if (error || !data) return false
    setApplicationDocuments((current) => [...current, data as PlanApplicationDocument])
    return true
  }

  async function updateApplicationDocument(id: string, patch: Partial<PlanApplicationDocument>) {
    const { data } = await supabase
      .from("plan_application_documents")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, application_id, label, status")
      .single()
    if (data) setApplicationDocuments((current) => current.map((item) => item.id === id ? data as PlanApplicationDocument : item))
  }

  async function deleteApplicationDocument(id: string) {
    const { error } = await supabase.from("plan_application_documents").delete().eq("id", id)
    if (!error) setApplicationDocuments((current) => current.filter((item) => item.id !== id))
  }

  async function saveBudgetSpace(next: ExecutionBudget) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_budgets")
      .upsert({ user_id: user.id, currency: next.currency.toUpperCase().slice(0, 3) || "AUD", current_savings: next.current_savings, monthly_saving: next.monthly_saving, target_amount: next.target_amount, target_date: next.target_date, updated_at: new Date().toISOString() })
      .select("currency, current_savings, monthly_saving, target_amount, target_date")
      .single()
    if (error || !data) return false
    setBudget(data as PlanBudget)
    return true
  }

  async function saveMoneyScenario(next: PlanMoneyScenario) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_money_scenarios")
      .upsert({ user_id: user.id, scholarship_amount: next.scholarship_amount, conservative_cost_lift: next.conservative_cost_lift, updated_at: new Date().toISOString() })
      .select("scholarship_amount, conservative_cost_lift")
      .single()
    if (error || !data) return false
    setMoneyScenario(data as PlanMoneyScenario)
    return true
  }

  async function saveLanguageSpace(next: ExecutionLanguage) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_language_goals")
      .upsert({ user_id: user.id, exam_name: next.exam_name.trim().slice(0, 80) || "IELTS", current_score: next.current_score, target_score: next.target_score, weekly_hours: next.weekly_hours, test_date: next.test_date, updated_at: new Date().toISOString() })
      .select("exam_name, current_score, target_score, weekly_hours, test_date")
      .single()
    if (error || !data) return false
    setLanguage(data as LanguageGoal)
    return true
  }

  async function saveEnglishBlock(next: Omit<PlanEnglishStudyBlock, "id">) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_english_study_blocks")
      .upsert({ user_id: user.id, ...next, updated_at: new Date().toISOString() }, { onConflict: "user_id,day_of_week" })
      .select("id, day_of_week, focus, minutes")
      .single()
    if (error || !data) return false
    setEnglishBlocks((current) => [...current.filter((item) => item.day_of_week !== data.day_of_week), data as PlanEnglishStudyBlock].sort((a, b) => a.day_of_week - b.day_of_week))
    return true
  }

  async function deleteEnglishBlock(id: string) {
    const { error } = await supabase.from("plan_english_study_blocks").delete().eq("id", id)
    if (!error) setEnglishBlocks((current) => current.filter((item) => item.id !== id))
  }

  async function saveResearchStatus(source: ExecutionResearchSource, status: PlanResearchItem["status"]) {
    if (!user) return
    const { data } = await supabase
      .from("plan_research_items")
      .upsert({ user_id: user.id, ...source, status, updated_at: new Date().toISOString() }, { onConflict: "user_id,source_type,source_reference" })
      .select("id, source_type, source_reference, title, provider_name, field_name, status")
      .single()
    if (data) setResearchItems((current) => [...current.filter((item) => !(item.source_type === data.source_type && item.source_reference === data.source_reference)), data as PlanResearchItem])
  }

  async function savePathwayDecision(next: PlanPathwayDecision) {
    if (!user) return false
    const { data, error } = await supabase
      .from("plan_pathway_decisions")
      .upsert({ user_id: user.id, ...next, updated_at: new Date().toISOString() })
      .select("leading_option_id, rationale")
      .single()
    if (error || !data) return false
    setPathwayDecision(data as PlanPathwayDecision)
    return true
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
  if (!goalProfile?.setup_completed_at) return <GoalSetup occupations={occupations} studyConcepts={studyConcepts} universities={universities} courses={courses} onComplete={completeGoalSetup} />

  const savings = numericValue(budget.current_savings) ?? 0
  const monthlySaving = numericValue(budget.monthly_saving) ?? 0
  const targetAmount = numericValue(budget.target_amount)
  const remaining = targetAmount == null ? null : Math.max(targetAmount - savings, 0)
  const monthsToTarget = remaining != null && monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : null
  const requiredMonthly = remaining != null && budget.target_date ? requiredMonthlySaving(remaining, budget.target_date) : null
  const scoreGap = numberOrNull(language.target_score) != null && numberOrNull(language.current_score) != null ? Math.max(numberOrNull(language.target_score)! - numberOrNull(language.current_score)!, 0) : null
  const roiReportReadiness = getRoiReportReadiness({ targetOccupation: goalProfile.target_occupation_title, shortlistCount: goalOptions.length, targetAmount, currentEnglishScore: numberOrNull(language.current_score), targetEnglishScore: numberOrNull(language.target_score) })
  const assessmentHref = assessment ? `/degree-risk/result?${new URLSearchParams({ major: assessment.major_pref, view: resolveView(assessment.country_pref), goal: assessment.primary_goal, aid: assessment.id })}` : "/degree-risk"
  const duplicateActivePage = () => { if (activeTab) duplicateTab(activeTab.id) }
  const moveActivePageToTrash = () => { if (activeTab) moveTabToTrash(activeTab.id) }
  const readinessCount = [
    Boolean(goalProfile.target_occupation_title || goalProfile.target_study_concept_label),
    goalOptions.length > 0,
    Boolean(goalProfile.target_intake_month),
    evidenceCount > 0,
    numberOrNull(language.current_score) != null,
    numberOrNull(language.target_score) != null,
    targetAmount != null,
    monthlySaving > 0,
    tasks.some((task) => task.kind === "application") || applicationRecords.length > 0,
  ].filter(Boolean).length
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysFromNow = addDaysToDate(today, 30)
  const applicationDeadlines = [
    ...tasks.filter((task) => task.status === "todo" && task.kind === "application" && task.due_date).map((task) => task.due_date!),
    ...applicationRecords.filter((record) => record.status !== "declined" && record.status !== "offer" && record.deadline_date).map((record) => record.deadline_date!),
  ]
  const overdueDeadlines = applicationDeadlines.filter((date) => date < today).length
  const deadlinesSoon = applicationDeadlines.filter((date) => date >= today && date <= thirtyDaysFromNow).length
  const leadingOption = pathwayDecision.leading_option_id ? goalOptions.find((option) => option.id === pathwayDecision.leading_option_id) ?? null : null
  const planHealth = buildPlanHealth({
    locale: "en",
    targetIntakeMonth: goalProfile.target_intake_month,
    applicationDeadlines: [
      ...tasks.filter((task) => task.status === "todo" && task.kind === "application" && task.due_date).map((task) => ({ title: task.title, dueDate: task.due_date! })),
      ...applicationRecords.filter((record) => record.status !== "declined" && record.status !== "offer" && record.deadline_date).map((record) => ({ title: record.programme_name || record.provider_name || "Application", dueDate: record.deadline_date! })),
    ],
    currentSavings: savings,
    monthlySaving,
    targetAmount,
    targetDate: budget.target_date,
    englishTargetScore: numberOrNull(language.target_score),
    englishTestDate: language.test_date,
    leadingOptionTitle: leadingOption?.title ?? null,
    leadingRationale: pathwayDecision.rationale,
  })
  const researchToCheck = Math.max(0, 4 - evidenceCount)
  const researchSourceMap = new Map<string, ExecutionResearchSource>()
  const addResearchSource = (source: ExecutionResearchSource) => researchSourceMap.set(`${source.source_type}:${source.source_reference}`, source)
  goalOptions.forEach((option) => addResearchSource({ source_type: option.source_type === "saved_university" ? "university" : "course", source_reference: option.id, title: option.title, provider_name: option.provider_name, field_name: option.field_name }))
  universities.forEach((university) => addResearchSource({ source_type: "university", source_reference: university.univ_slug, title: university.univ_name || university.univ_slug, provider_name: university.univ_name || university.univ_slug, field_name: "" }))
  courses.forEach((course) => addResearchSource({ source_type: "course", source_reference: String(course.id), title: course.course_name || course.field_name || course.college_name, provider_name: course.college_name, field_name: course.field_name }))
  studyConcepts.forEach((concept) => addResearchSource({ source_type: "field", source_reference: concept.concept_slug, title: concept.concept_label || concept.concept_label_ko || concept.concept_slug, provider_name: "", field_name: concept.concept_label || concept.concept_label_ko || concept.concept_slug }))
  const researchSources = [...researchSourceMap.values()]
  function navigatePlannerArea(area: PlannerArea) {
    setActiveArea(area)
    if (area === "report") { router.push("/reports/my-australia?from=myplan"); return }
    const areaPath: Record<Exclude<PlannerArea, "report">, string> = { today: "/myplan", pathway: "/myplan/pathway", applications: "/myplan/applications", money: "/myplan/money", english: "/myplan/english", research: "/myplan/research", notes: "/myplan/notes" }
    router.push(areaPath[area])
  }

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
        onCloseTab={moveTabToTrash}
      />

      {/* ── Body: sidebar + content ── */}
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && (
          <PlannerSidebar
            activeArea={activeArea}
            readinessCount={readinessCount}
            shortlistCount={goalOptions.length}
            deadlinesSoon={deadlinesSoon}
            overdueDeadlines={overdueDeadlines}
            moneyGap={remaining}
            currency={budget.currency}
            englishExam={language.exam_name}
            englishGap={scoreGap}
            researchToCheck={researchToCheck}
            noteCount={notes.length}
            healthAttentionCount={planHealth.attentionCount}
            reportReadinessCount={roiReportReadiness.completedCount}
            reportReady={roiReportReadiness.ready}
            onNavigate={navigatePlannerArea}
          />
        )}

        {/* ── Content ── */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {activeArea === "today" && <section className="mx-auto max-w-6xl px-6 pt-7 sm:px-10 sm:pt-10"><TodayDashboard goalProfile={goalProfile!} goalOptions={goalOptions} tasks={tasks} applications={applicationRecords.map((record) => ({ id: record.id, title: record.programme_name || record.provider_name || "Application", deadline_date: record.deadline_date, status: record.status }))} currentSavings={savings} monthlySaving={monthlySaving} targetAmount={targetAmount} targetDate={budget.target_date} currency={budget.currency} currentEnglishScore={numberOrNull(language.current_score)} targetEnglishScore={numberOrNull(language.target_score)} englishExam={language.exam_name} englishTestDate={language.test_date} evidenceCount={evidenceCount} leadingOptionTitle={leadingOption?.title ?? null} leadingRationale={pathwayDecision.rationale} /></section>}
          {activeArea === "pathway" && <MyPathwaySpace goalTitle={goalProfile!.target_occupation_title} studyTitle={goalProfile!.target_study_concept_label} options={goalOptions as ExecutionGoalOption[]} decision={pathwayDecision} evidenceCount={evidenceCount} onSaveDecision={savePathwayDecision} />}
          {activeArea === "applications" && <ApplicationsSpace applications={applicationRecords} documents={applicationDocuments} legacyDeadlines={tasks.filter((task) => task.kind === "application").map((task) => ({ id: task.id, title: task.title, due_date: task.due_date, status: task.status }))} goalOptions={goalOptions as ExecutionGoalOption[]} onCreateApplication={createApplication} onUpdateApplication={updateApplication} onCreateDocument={createApplicationDocument} onUpdateDocument={updateApplicationDocument} onDeleteDocument={deleteApplicationDocument} />}
          {activeArea === "money" && <MoneyRunwaySpace budget={{ currency: budget.currency, current_savings: savings, monthly_saving: monthlySaving, target_amount: targetAmount, target_date: budget.target_date }} scenario={moneyScenario} onSaveBudget={saveBudgetSpace} onSaveScenario={saveMoneyScenario} />}
          {activeArea === "english" && <EnglishTargetSpace language={{ exam_name: language.exam_name, current_score: numberOrNull(language.current_score), target_score: numberOrNull(language.target_score), weekly_hours: numberOrNull(language.weekly_hours), test_date: language.test_date }} blocks={englishBlocks} onSaveLanguage={saveLanguageSpace} onSaveBlock={saveEnglishBlock} onDeleteBlock={deleteEnglishBlock} />}
          {activeArea === "research" && <ResearchDeskSpace sources={researchSources} researchItems={researchItems} onSetStatus={saveResearchStatus} />}
          {activeArea === "notes" && <section className="mx-auto max-w-4xl px-6 pb-12 pt-12 sm:px-10 sm:pt-16"><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">NOTES</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Your decision notes</h1><p className="mt-2 text-sm leading-6 text-slate-600">Keep the thinking behind your Australia pathway beside the actions you take.</p>{activeTab && <div className="mt-10"><input value={activeTab.title} onChange={(event) => renameTab(activeTab.id, event.target.value)} placeholder="Untitled" maxLength={160} aria-label="Page title" className="w-full bg-transparent text-4xl font-semibold tracking-tight text-slate-950 outline-none placeholder:text-slate-300 sm:text-5xl" /><textarea value={activeTab.content} onChange={(event) => updateTabContent(activeTab.id, event.target.value)} placeholder="Start writing…" maxLength={12000} rows={10} aria-label="Page body" className="mt-5 w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base leading-8 text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100" /><p className="mt-3 text-xs text-slate-400">Saved on this device</p></div>}</section>}
          {/* Legacy stacked widgets intentionally retired in favour of independent execution spaces.
          <section className="mx-auto max-w-6xl px-6 pt-7 sm:px-10 sm:pt-10">
            <TodayDashboard
              goalProfile={goalProfile}
              goalOptions={goalOptions}
              tasks={tasks}
              currentSavings={savings}
              monthlySaving={monthlySaving}
              targetAmount={targetAmount}
              targetDate={budget.target_date}
              currency={budget.currency}
              currentEnglishScore={numberOrNull(language.current_score)}
              targetEnglishScore={numberOrNull(language.target_score)}
              englishExam={language.exam_name}
              evidenceCount={evidenceCount}
            />
          </section>
          {activeTab && <section id="notes" className="mx-auto max-w-4xl scroll-mt-6 px-6 pb-8 pt-12 sm:px-10 sm:pt-16">
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
                    <section id="dates" className="relative py-2">
                      <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Dates to hold</h2></div>
                      <form onSubmit={addTask} className="mt-5 space-y-3"><input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} maxLength={240} placeholder="e.g. Confirm September intake deadline" className={inputClass} /><div className="grid grid-cols-[1fr_auto] gap-2"><input type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} className={inputClass} /><select value={taskKind} onChange={(event) => setTaskKind(event.target.value as TaskKind)} className={inputClass}>{(Object.keys(taskLabels) as TaskKind[]).map((kind) => <option key={kind} value={kind}>{taskLabels[kind]}</option>)}</select></div><button disabled={!taskDraft.trim() || saving === "task"} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50">{saving === "task" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add date</button></form>
                      <div className="mt-5 space-y-2">{tasks.slice(0, 5).map((task) => <div key={task.id} className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"><button onClick={() => void toggleTask(task)} className="shrink-0 text-slate-400 hover:text-emerald-600" aria-label={task.status === "done" ? "Mark task incomplete" : "Mark task complete"}>{task.status === "done" ? <CircleCheck className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5" />}</button><div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-medium", task.status === "done" ? "text-slate-400 line-through" : "text-slate-800")}>{task.title}</p><p className="mt-0.5 text-xs text-slate-400">{task.due_date ? formatShortDate(task.due_date) : "No date"} · {taskLabels[task.kind]}</p></div><button onClick={() => void removeTask(task.id)} className="opacity-0 transition group-hover:opacity-100 text-slate-300 hover:text-red-600" aria-label="Remove task"><Trash2 className="h-4 w-4" /></button></div>)}{tasks.length === 0 && <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">Keep only the dates that would change your plan.</p>}</div>
                    </section>
                  </PlannerWidget>

                  <PlannerWidget id="money" order={widgetOrder.indexOf("money")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                    <section id="money" className="relative py-2">
                      <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold text-slate-950">Money plan</h2></div>
                      <form onSubmit={saveBudget} className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Currency"><input value={budget.currency} onChange={(event) => setBudget({ ...budget, currency: event.target.value.toUpperCase() })} maxLength={3} className={inputClass} /></Field><Field label="Saved now"><input inputMode="decimal" value={budget.current_savings ?? ""} onChange={(event) => setBudget({ ...budget, current_savings: event.target.value })} placeholder="0" className={inputClass} /></Field><Field label="Monthly saving"><input inputMode="decimal" value={budget.monthly_saving ?? ""} onChange={(event) => setBudget({ ...budget, monthly_saving: event.target.value })} placeholder="0" className={inputClass} /></Field><Field label="Target fund"><input inputMode="decimal" value={budget.target_amount ?? ""} onChange={(event) => setBudget({ ...budget, target_amount: event.target.value })} placeholder="e.g. 45000" className={inputClass} /></Field><Field label="Target date"><input type="date" value={budget.target_date ?? ""} onChange={(event) => setBudget({ ...budget, target_date: event.target.value })} className={inputClass} /></Field><div className="flex items-end"><button disabled={saving === "budget"} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving === "budget" && <Loader2 className="h-4 w-4 animate-spin" />}Save money plan</button></div></form>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Insight label="Still to save" value={remaining == null ? "Set a target" : money(remaining, budget.currency)} /><Insight label="Months left" value={monthsToTarget == null ? "—" : `${monthsToTarget} months`} /><Insight label="Required / month" value={requiredMonthly == null ? "—" : money(requiredMonthly, budget.currency)} /></div>
                    </section>
                  </PlannerWidget>

                  <PlannerWidget id="english" order={widgetOrder.indexOf("english")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                    <section id="english" className="relative py-2">
                      <div className="flex items-center gap-2"><Languages className="h-5 w-5 text-violet-600" /><h2 className="text-lg font-semibold text-slate-950">English plan</h2></div>
                      <form onSubmit={saveLanguage} className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Exam"><input value={language.exam_name} onChange={(event) => setLanguage({ ...language, exam_name: event.target.value })} maxLength={80} className={inputClass} /></Field><Field label="Current score"><input inputMode="decimal" value={language.current_score ?? ""} onChange={(event) => setLanguage({ ...language, current_score: event.target.value })} placeholder="e.g. 6.0" className={inputClass} /></Field><Field label="Target score"><input inputMode="decimal" value={language.target_score ?? ""} onChange={(event) => setLanguage({ ...language, target_score: event.target.value })} placeholder="e.g. 7.0" className={inputClass} /></Field><Field label="Study hours / week"><input inputMode="decimal" value={language.weekly_hours ?? ""} onChange={(event) => setLanguage({ ...language, weekly_hours: event.target.value })} placeholder="e.g. 8" className={inputClass} /></Field><Field label="Test date"><input type="date" value={language.test_date ?? ""} onChange={(event) => setLanguage({ ...language, test_date: event.target.value })} className={inputClass} /></Field><div className="flex items-end"><button disabled={saving === "language"} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{saving === "language" && <Loader2 className="h-4 w-4 animate-spin" />}Save English plan</button></div></form>
                      <div className="mt-5 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-950">{scoreGap == null ? "Add your current and target scores to see the gap." : scoreGap === 0 ? "You are at your target — well done!" : `You need +${scoreGap.toFixed(1)} points to reach your target.`}</div>
                    </section>
                  </PlannerWidget>

                <PlannerWidget id="research" order={widgetOrder.indexOf("research")} onMoveToTop={moveWidgetToTop} onDuplicatePage={duplicateActivePage} onMovePageToTrash={moveActivePageToTrash}>
                  <section id="research" className="relative scroll-mt-6 py-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-slate-950">Research library</h2></div><p className="mt-1 text-sm text-slate-500">Saved choices and official evidence, kept beside your own notes.</p></div>
                      <Link href="/profile/evidence" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">Official links <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <ResearchCard icon={Target} title="Fields" items={studyConcepts.map((item) => item.concept_label || item.concept_label_ko || item.concept_slug)} href="/au/majors" empty="No fields saved" />
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
          */}
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
function sortApplicationRecords(a: PlanApplicationRecord, b: PlanApplicationRecord) { if (!a.deadline_date) return 1; if (!b.deadline_date) return -1; return a.deadline_date.localeCompare(b.deadline_date) }
function addDaysToDate(value: string, days: number) { const date = new Date(`${value}T00:00:00`); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10) }
function requiredMonthlySaving(remaining: number, targetDate: string) { const months = Math.ceil((new Date(`${targetDate}T00:00:00`).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)); return months > 0 ? remaining / months : null }
function money(value: number, currency: string) { try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "AUD", maximumFractionDigits: 0 }).format(value) } catch { return `${currency || "AUD"} ${Math.round(value).toLocaleString()}` } }
function formatShortDate(value: string) { return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`)) }
