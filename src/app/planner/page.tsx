"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import {
  BriefcaseBusiness,
  CalendarDays,
  FileCheck2,
  GraduationCap,
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { majorLabel, resolveView } from "@/lib/degree-risk"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { PlannerToolbar, PlannerToolbarControls } from "@/components/planner/planner-toolbar"
import { PlannerSidebar, type PlannerArea } from "@/components/planner/planner-sidebar"
import { GoalSetup, type GoalSetupData } from "@/components/planner/goal-setup"
import { HomeDashboard } from "@/components/planner/home-dashboard"
import { MyAustraliaReportWorkspace } from "@/components/reports/my-australia-report-workspace"
import { buildPlanHealth } from "@/lib/plan-health"
import { getRoiReportReadiness } from "@/lib/report-plan-bridge"
import {
  ApplicationsSpace,
  MoneyRunwaySpace,
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
import { CompareSpace, type CompareSchool } from "@/components/planner/compare-space"
import { EnglishTargetSpace } from "@/components/planner/execution-spaces"
import { ProfilePanel } from "@/components/planner/profile-panel"
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
type PlanGoalOption = { id: string; position: number; source_type: "saved_university" | "saved_course"; source_reference: string; title: string; provider_name: string; field_name: string }
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
type WizardHandoffSchool = {
  college_id: string
  college_name: string
  college_state: string
  college_city?: string | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  score?: number | null
  roi_score?: number | null
  payback_years?: number | null
}
type WizardHandoff = {
  conceptSlug: string
  conceptLabel: string
  conceptLabelKo: string
  school: string | null
  schoolData: WizardHandoffSchool | null
}

const plannerAreaPaths: Record<PlannerArea, string> = {
  home: "/home",
  compare: "/compare",
  applications: "/applications",
  budget: "/budget",
  english: "/english",
  research: "/research",
  report: "/report",
}

function plannerAreaFromPath(pathname: string): PlannerArea | null {
  if (pathname === "/home") return "home"
  if (pathname === "/compare") return "compare"
  if (pathname === "/applications") return "applications"
  if (pathname === "/budget") return "budget"
  if (pathname === "/english") return "english"
  if (pathname === "/research") return "research"
  if (pathname === "/report") return "report"
  const match = Object.entries(plannerAreaPaths).find(([, path]) => path.split("?")[0] === pathname)
  return (match?.[0] as PlannerArea | undefined) ?? null
}

const LS_LANGUAGE_KEY = "cc-english-language"
function loadLanguageLS(): LanguageGoal | null { try { const raw = localStorage.getItem(LS_LANGUAGE_KEY); return raw ? JSON.parse(raw) : null } catch { return null } }
function saveLanguageLS(data: LanguageGoal) { try { localStorage.setItem(LS_LANGUAGE_KEY, JSON.stringify(data)) } catch {} }

const taskLabels: Record<TaskKind, string> = { application: "Application", english: "English", money: "Money", research: "Research", personal: "Personal" }
const goalLabels: Record<string, string> = { study: "Study quality", visa: "Post-study work", pr: "Long-term pathway" }
const countryLabels: Record<string, string> = { AU: "Australia", CA: "Canada", IE: "Ireland", UK: "United Kingdom", US: "United States" }
const defaultWidgetOrder: WidgetId[] = ["today", "dates", "money", "english", "research"]
const defaultWidgetSizes: Record<WidgetId, WidgetSize> = { today: "wide", dates: "narrow", money: "half", english: "half", research: "wide" }
export default function PlannerPage({ initialArea = "home" }: { initialArea?: PlannerArea }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const locale = useRouteLocale()
  const isKo = locale === "ko"
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
  const [profilePanelOpen, setProfilePanelOpen] = useState(false)

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
  const [language, setLanguage] = useState<LanguageGoal>(() => loadLanguageLS() ?? { exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })
  const [compareSchools, setCompareSchools] = useState<CompareSchool[]>([])
  const [noteDraft, setNoteDraft] = useState("")
  const [taskDraft, setTaskDraft] = useState("")
  const [taskDate, setTaskDate] = useState("")
  const [taskKind, setTaskKind] = useState<TaskKind>("application")
  const [saving, setSaving] = useState<"note" | "task" | "budget" | "language" | null>(null)
  const [plannerTheme, setPlannerTheme] = useState<PlannerTheme>("mist")
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(defaultWidgetOrder)
  const [widgetSizes, setWidgetSizes] = useState<Record<WidgetId, WidgetSize>>(defaultWidgetSizes)
  const [pendingWizardHandoff, setPendingWizardHandoff] = useState<WizardHandoff | null>(null)
  const [wizardHandoffAction, setWizardHandoffAction] = useState<"add" | "replace" | null>(null)

  useEffect(() => {
    // Routing restructured: /planner is now the primary route
  }, [pathname, router])

  useEffect(() => setActiveArea(initialArea), [initialArea])

  useEffect(() => { if (language.current_score != null || language.target_score != null || language.test_date) saveLanguageLS(language) }, [language])

  // Keep the workspace mounted while changing My Plan areas. This preserves
  // the toolbar/sidebar and avoids the skeleton flash caused by a full route
  // remount on every internal navigation.
  useEffect(() => {
    function handlePopState() {
      const nextArea = plannerAreaFromPath(withoutLocalePrefix(window.location.pathname))
      if (nextArea) setActiveArea(nextArea)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

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
        supabase.from("plan_goal_options").select("id, position, source_type, source_reference, title, provider_name, field_name").eq("user_id", userId).order("position", { ascending: true }),
        supabase.from("plan_application_records").select("id, goal_option_id, provider_name, programme_name, status, deadline_date, offer_date, notes").eq("user_id", userId).order("deadline_date", { ascending: true, nullsFirst: false }),
        supabase.from("plan_application_documents").select("id, application_id, label, status").eq("user_id", userId).order("created_at", { ascending: true }),
        supabase.from("plan_money_scenarios").select("scholarship_amount, conservative_cost_lift").eq("user_id", userId).maybeSingle(),
        supabase.from("plan_english_study_blocks").select("id, day_of_week, focus, minutes").eq("user_id", userId).order("day_of_week", { ascending: true }),
        supabase.from("plan_research_items").select("id, source_type, source_reference, title, provider_name, field_name, status").eq("user_id", userId).order("updated_at", { ascending: false }),
        supabase.from("plan_pathway_decisions").select("leading_option_id, rationale").eq("user_id", userId).maybeSingle(),
      ])
      const storedProfile = (results[12].data as PlanGoalProfile | null) ?? null
      const storedOptions = (results[13].data as PlanGoalOption[] | null) ?? []
      const handoff = loadWizardHandoff()
      let importedProfile = storedProfile
      let importedOptions = storedOptions

      if (handoff) {
        const imported = await saveWizardHandoff(userId, handoff, storedProfile, storedOptions)
        if (imported) {
          importedProfile = imported.profile
          importedOptions = imported.options
          if (imported.consumed) clearWizardHandoff()
          else setPendingWizardHandoff(handoff)
        }
      }

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
      setLanguage((results[10].data as LanguageGoal | null) ?? loadLanguageLS() ?? { exam_name: "IELTS", current_score: null, target_score: null, weekly_hours: null, test_date: null })
      const savedPlanner = results[11].data as PlannerPreferences | null
      setGoalProfile(importedProfile)
      setGoalOptions(importedOptions)
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
        setPlannerTheme(savedPlanner.theme || "mist")
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
        const handoff = loadWizardHandoff()
        /* Guest mode can preview the result, but keeps the handoff until sign-in. */
        setGoalProfile(handoff ? profileFromWizardHandoff(handoff, "") : { user_id: "", target_occupation_code: "", target_occupation_title: "", target_study_concept_slug: "", target_study_concept_label: "", target_intake_month: null, plan_title: "", strategy: "", setup_completed_at: new Date().toISOString() })
        setGoalOptions(handoff?.schoolData ? [optionFromWizardSchool(handoff.schoolData, handoff.conceptLabel)] : [])
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

  async function saveWizardHandoff(
    userId: string,
    handoff: WizardHandoff,
    existingProfile: PlanGoalProfile | null,
    existingOptions: PlanGoalOption[],
    allowDifferentConcept = false,
  ): Promise<{ profile: PlanGoalProfile; options: PlanGoalOption[]; consumed: boolean } | null> {
    let profile = existingProfile
    const options = existingOptions

    if (!profile) {
      const { data, error } = await supabase
        .from("plan_goal_profiles")
        .upsert({
          user_id: userId,
          country: "AU",
          target_occupation_code: "",
          target_occupation_title: "",
          target_study_concept_slug: handoff.conceptSlug,
          target_study_concept_label: handoff.conceptLabelKo || handoff.conceptLabel,
          target_intake_month: null,
          plan_title: handoff.conceptLabelKo || handoff.conceptLabel || "My Australia pathway",
          strategy: "",
          setup_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at")
        .single()
      if (error || !data) return null
      profile = data as PlanGoalProfile
    }

    const school = handoff.schoolData
    if (!school) return { profile, options, consumed: !existingProfile }

    const alreadyAdded = options.some((option) => option.source_type === "saved_university" && option.source_reference === school.college_id)
    if (alreadyAdded) return { profile, options, consumed: true }

    // Do not overwrite an established plan with a second Pathfinder result.
    if (existingProfile && existingProfile.target_study_concept_slug !== handoff.conceptSlug && !allowDifferentConcept) {
      return { profile, options, consumed: false }
    }
    if (options.length >= 3) return { profile, options, consumed: false }

    const position = options.length + 1
    const { data, error } = await supabase
      .from("plan_goal_options")
      .upsert({
        user_id: userId,
        position,
        source_type: "saved_university",
        source_reference: school.college_id,
        title: school.college_name,
        provider_name: school.college_name,
        field_name: handoff.conceptLabel,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,source_type,source_reference" })
      .select("id, position, source_type, source_reference, title, provider_name, field_name")
      .single()
    if (error || !data) return { profile, options, consumed: false }

    return { profile, options: [...options, data as PlanGoalOption], consumed: true }
  }

  async function addPendingWizardHandoff() {
    if (!user || !goalProfile || !pendingWizardHandoff?.schoolData || goalOptions.length >= 3) return
    setWizardHandoffAction("add")
    const imported = await saveWizardHandoff(user.id, pendingWizardHandoff, goalProfile, goalOptions, true)
    if (imported?.consumed) {
      setGoalProfile(imported.profile)
      setGoalOptions(imported.options)
      clearWizardHandoff()
      setPendingWizardHandoff(null)
    }
    setWizardHandoffAction(null)
  }

  async function replaceWithPendingWizardHandoff() {
    if (!user || !goalProfile || !pendingWizardHandoff) return
    setWizardHandoffAction("replace")
    const now = new Date().toISOString()
    const label = pendingWizardHandoff.conceptLabelKo || pendingWizardHandoff.conceptLabel || "My Australia pathway"
    const { data: profile, error: profileError } = await supabase
      .from("plan_goal_profiles")
      .update({
        target_study_concept_slug: pendingWizardHandoff.conceptSlug,
        target_study_concept_label: label,
        plan_title: label,
        updated_at: now,
      })
      .eq("user_id", user.id)
      .select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at")
      .single()
    if (profileError || !profile) {
      setWizardHandoffAction(null)
      return
    }

    const { error: deleteError } = await supabase.from("plan_goal_options").delete().eq("user_id", user.id)
    if (deleteError) {
      setWizardHandoffAction(null)
      return
    }

    let options: PlanGoalOption[] = []
    if (pendingWizardHandoff.schoolData) {
      const school = pendingWizardHandoff.schoolData
      const { data, error } = await supabase
        .from("plan_goal_options")
        .insert({
          user_id: user.id,
          position: 1,
          source_type: "saved_university",
          source_reference: school.college_id,
          title: school.college_name,
          provider_name: school.college_name,
          field_name: pendingWizardHandoff.conceptLabel,
          updated_at: now,
        })
        .select("id, position, source_type, source_reference, title, provider_name, field_name")
        .single()
      if (error || !data) {
        setWizardHandoffAction(null)
        return
      }
      options = [data as PlanGoalOption]
    }

    setGoalProfile(profile as PlanGoalProfile)
    setGoalOptions(options)
    setApplicationRecords((current) => current.map((record) => ({ ...record, goal_option_id: null })))
    clearWizardHandoff()
    setPendingWizardHandoff(null)
    setWizardHandoffAction(null)
  }

  function keepCurrentPlan() {
    clearWizardHandoff()
    setPendingWizardHandoff(null)
  }

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
    let nextGoalOptions: PlanGoalOption[] = []
    if (data.options.length) {
      const { data: savedOptions, error: optionsError } = await supabase
        .from("plan_goal_options")
        .insert(data.options.map((option, index) => ({ user_id: user.id, position: index + 1, source_type: option.sourceType, source_reference: option.sourceReference, title: option.title, provider_name: option.providerName, field_name: option.fieldName, updated_at: now })))
        .select("id, position, source_type, source_reference, title, provider_name, field_name")
      if (optionsError) return false
      nextGoalOptions = (savedOptions as PlanGoalOption[] | null) ?? []
    }

    const { data: completedProfile, error: completeError } = await supabase
      .from("plan_goal_profiles")
      .update({ setup_completed_at: now, updated_at: now })
      .eq("user_id", user.id)
      .select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at")
      .single()
    if (completeError || !completedProfile) return false
    setGoalProfile(completedProfile as PlanGoalProfile)
    setGoalOptions(nextGoalOptions)
    return true
  }

  async function updatePlanProfile(patch: { plan_title?: string; strategy?: string }) {
    if (!user || !goalProfile) return false
    const next = { ...patch, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from("plan_goal_profiles")
      .update(next)
      .eq("user_id", user.id)
      .select("user_id, target_occupation_code, target_occupation_title, target_study_concept_slug, target_study_concept_label, target_intake_month, plan_title, strategy, setup_completed_at")
      .single()
    if (error || !data) return false
    setGoalProfile(data as PlanGoalProfile)
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
    saveLanguageLS(next as LanguageGoal)
    if (!user) {
      setLanguage(next as LanguageGoal)
      return true
    }
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
    if (!user) {
      const localBlock = { id: `local-${next.day_of_week}-${Date.now()}`, ...next }
      setEnglishBlocks((current) => [...current.filter((item) => item.day_of_week !== localBlock.day_of_week), localBlock as PlanEnglishStudyBlock].sort((a, b) => a.day_of_week - b.day_of_week))
      return true
    }
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

  if (loading) return <PlannerSkeleton />
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
  const plannerLocale = isKo ? "ko" : "en"
  function navigatePlannerArea(area: PlannerArea) {
    setActiveArea(area)
    const nextPath = localizePath(plannerAreaPaths[area], plannerLocale)
    if (window.location.pathname !== nextPath) window.history.pushState({}, "", nextPath)
  }

  function openPlannerPath(path: string) {
    const [cleanPath, search = ""] = path.split("?")
    const nextArea = plannerAreaFromPath(withoutLocalePrefix(cleanPath))
    const localizedPath = `${localizePath(cleanPath, plannerLocale)}${search ? `?${search}` : ""}`
    if (nextArea) {
      setActiveArea(nextArea)
      if (window.location.pathname !== localizedPath) window.history.pushState({}, "", localizedPath)
      return
    }
    router.push(localizedPath)
  }

  const guestLoginHref = `${localizePath("/login", isKo ? "ko" : "en")}?next=${encodeURIComponent(pathname)}`

  return (
    <div className={cn("flex h-screen overflow-hidden transition-colors duration-300", plannerThemeClasses[plannerTheme])}>
      {/* ── Mobile backdrop ── */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar rail + workspace ── */}
      <div aria-hidden={!sidebarOpen} inert={!sidebarOpen} className={cn("flex h-full shrink-0 flex-col overflow-hidden transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] max-sm:fixed max-sm:inset-y-0 max-sm:left-0 max-sm:z-50 max-sm:bg-white", sidebarOpen ? "w-72 translate-x-0 opacity-100" : "pointer-events-none w-0 -translate-x-3 opacity-0")}>
        <div className="hidden sm:flex h-12 shrink-0 items-center border-r border-slate-200 bg-slate-50 pl-2.5 pr-1">
          <div className="flex-1"><PlannerToolbarControls sidebarOpen={sidebarOpen} canGoBack={historyCursor > 0} canGoForward={historyCursor < historyLength - 1} onToggleSidebar={() => setSidebarOpen((o) => !o)} onBack={goBack} onForward={goForward} isKo={isKo} onNavigate={navigatePlannerArea} onOpenPath={openPlannerPath} /></div>
        </div>
        <div className="min-h-0 flex-1">
          <PlannerSidebar
            activeArea={activeArea}
            readinessCount={readinessCount}
            shortlistCount={goalOptions.length}
            deadlinesSoon={deadlinesSoon}
            overdueDeadlines={overdueDeadlines}
            budgetGap={remaining}
            currency={budget.currency}
            englishExam={language.exam_name}
            englishGap={scoreGap}
            researchToCheck={researchToCheck}
            healthAttentionCount={planHealth.attentionCount}
            reportReadinessCount={roiReportReadiness.completedCount}
            reportReady={roiReportReadiness.ready}
            onNavigate={navigatePlannerArea}
            onOpenPath={openPlannerPath}
          />
        </div>

      </div>

      <div className="flex min-w-0 min-h-0 flex-1 flex-col">
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
          showControls={!sidebarOpen}
          onAvatarClick={() => setProfilePanelOpen(true)}
        />

        {/* ── Content ── */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {!user && <GuestPlannerNotice isKo={isKo} loginHref={guestLoginHref} />}
          <div key={activeArea} className="tl-stage">
          {activeArea === "home" && <HomeDashboard goalProfile={goalProfile!} goalOptions={goalOptions} tasks={tasks} applications={applicationRecords.map((record) => ({ id: record.id, title: record.programme_name || record.provider_name || "Application", deadline_date: record.deadline_date, status: record.status }))} notes={notes} compareSchools={compareSchools} currentSavings={savings} monthlySaving={monthlySaving} targetAmount={targetAmount} targetDate={budget.target_date} currency={budget.currency} currentEnglishScore={numberOrNull(language.current_score)} targetEnglishScore={numberOrNull(language.target_score)} englishExam={language.exam_name} englishTestDate={language.test_date} evidenceCount={evidenceCount} leadingOptionTitle={leadingOption?.title ?? null} leadingRationale={pathwayDecision.rationale} onNavigate={(area) => navigatePlannerArea(area as PlannerArea)} />}
          {activeArea === "compare" && <CompareSpace schools={compareSchools} isKo={isKo} onRemove={(id) => setCompareSchools((prev) => prev.filter((s) => s.id !== id))} goalTitle={goalProfile!.target_occupation_title} studyTitle={goalProfile!.target_study_concept_label} goalOptions={goalOptions as ExecutionGoalOption[]} decision={pathwayDecision} evidenceCount={evidenceCount} onSaveDecision={savePathwayDecision} />}
          {activeArea === "applications" && <ApplicationsSpace applications={applicationRecords} documents={applicationDocuments} legacyDeadlines={tasks.filter((task) => task.kind === "application").map((task) => ({ id: task.id, title: task.title, due_date: task.due_date, status: task.status }))} goalOptions={goalOptions as ExecutionGoalOption[]} onCreateApplication={createApplication} onUpdateApplication={updateApplication} onCreateDocument={createApplicationDocument} onUpdateDocument={updateApplicationDocument} onDeleteDocument={deleteApplicationDocument} />}
          {activeArea === "budget" && <MoneyRunwaySpace budget={{ currency: budget.currency, current_savings: savings, monthly_saving: monthlySaving, target_amount: targetAmount, target_date: budget.target_date }} scenario={moneyScenario} onSaveBudget={saveBudgetSpace} onSaveScenario={saveMoneyScenario} />}
          {activeArea === "english" && <EnglishTargetSpace language={{ exam_name: language.exam_name, current_score: language.current_score == null ? null : Number(language.current_score) || null, target_score: language.target_score == null ? null : Number(language.target_score) || null, weekly_hours: language.weekly_hours == null ? null : Number(language.weekly_hours) || null, test_date: language.test_date }} blocks={englishBlocks} onSaveLanguage={saveLanguageSpace} onSaveBlock={saveEnglishBlock} onDeleteBlock={deleteEnglishBlock} />}
          {activeArea === "research" && <ResearchDeskSpace sources={researchSources} researchItems={researchItems} onSetStatus={saveResearchStatus} />}
          {activeArea === "report" && <MyAustraliaReportWorkspace />}
          </div>
        </main>
      </div>

      <ProfilePanel open={profilePanelOpen} onClose={() => setProfilePanelOpen(false)} />
      {pendingWizardHandoff && <WizardHandoffPrompt handoff={pendingWizardHandoff} isKo={isKo} action={wizardHandoffAction} canAdd={Boolean(pendingWizardHandoff.schoolData) && goalOptions.length < 3} onAdd={addPendingWizardHandoff} onReplace={replaceWithPendingWizardHandoff} onKeepCurrent={keepCurrentPlan} />}
    </div>
  )
}

/* ── Sub-components ── */

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-semibold text-slate-400">{label}{children}</label> }
function Insight({ label, value }: { label: string; value: string }) { return <div className="border-l-2 border-emerald-500 pl-3.5"><p className="text-xs font-medium text-emerald-600">{label}</p><p className="mt-1 text-sm font-semibold text-emerald-700">{value}</p></div> }
function GuestPlannerNotice({ isKo, loginHref }: { isKo: boolean; loginHref: string }) {
  return <section className="mx-auto max-w-5xl px-6 pt-6 sm:px-10"><div className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-blue-950">{isKo ? "지금은 플랜을 미리 볼 수 있어요. 로그인하면 Pathfinder 결과와 이후 입력을 안전하게 저장합니다." : "You can preview your plan now. Sign in to keep your Pathfinder result and every update."}</p><a href={loginHref} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500">{isKo ? "로그인하고 저장" : "Sign in to save"}</a></div></section>
}
function WizardHandoffPrompt({ handoff, isKo, action, canAdd, onAdd, onReplace, onKeepCurrent }: { handoff: WizardHandoff; isKo: boolean; action: "add" | "replace" | null; canAdd: boolean; onAdd: () => void; onReplace: () => void; onKeepCurrent: () => void }) {
  const label = handoff.conceptLabelKo || handoff.conceptLabel
  const school = handoff.schoolData?.college_name
  const busy = action !== null
  return (
    <div className="fixed inset-0 z-[3100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="wizard-handoff-title" className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{isKo ? "새 Pathfinder 결과" : "New Pathfinder result"}</p>
        <h2 id="wizard-handoff-title" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{isKo ? "현재 플랜에 어떻게 반영할까요?" : "How should this update your plan?"}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{isKo ? <><strong className="font-semibold text-slate-900">{label}</strong>{school ? ` · ${school}` : ""} 결과를 저장했습니다. 현재 플랜은 선택하기 전까지 바뀌지 않습니다.</> : <><strong className="font-semibold text-slate-900">{label}</strong>{school ? ` · ${school}` : ""} is ready. Your current plan will stay unchanged until you choose.</>}</p>
        {!canAdd && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">{isKo ? "현재 플랜에는 후보를 최대 3개까지 저장할 수 있습니다." : "Your current plan already has the maximum of three shortlist options."}</p>}
        <div className="mt-6 grid gap-2.5">
          {canAdd && <button type="button" disabled={busy} onClick={onAdd} className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{action === "add" ? (isKo ? "후보 추가 중..." : "Adding to shortlist...") : (isKo ? "현재 플랜의 후보로 추가" : "Add to current shortlist")}</button>}
          <button type="button" disabled={busy} onClick={onReplace} className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">{action === "replace" ? (isKo ? "플랜 교체 중..." : "Replacing plan...") : (isKo ? "이 결과로 플랜 교체" : "Replace with this plan")}</button>
          <button type="button" disabled={busy} onClick={onKeepCurrent} className="min-h-11 px-4 text-sm font-semibold text-slate-500 transition hover:text-slate-800 disabled:cursor-wait disabled:opacity-60">{isKo ? "현재 플랜 유지 및 새 결과 삭제" : "Keep current plan and discard this result"}</button>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">{isKo ? "플랜을 교체하면 기존 후보는 제거되고, 연결된 지원 기록은 유지되지만 후보 연결은 해제됩니다." : "Replacing removes existing shortlist options. Application records stay, but their shortlist links are cleared."}</p>
      </section>
    </div>
  )
}
function PlannerSkeleton() { return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-6"><div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" /><div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="h-96 animate-pulse rounded-3xl bg-slate-100" /><div className="h-96 animate-pulse rounded-3xl bg-slate-100" /></div></div></main> }

const inputClass = "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
const plannerThemeClasses: Record<PlannerTheme, string> = {
  mist: "bg-[radial-gradient(circle_at_top_left,_#e0eeff,_transparent_35%),#f7f9fc]",
  lavender: "bg-[radial-gradient(circle_at_top_left,_#eee5ff,_transparent_35%),#faf8ff]",
  sage: "bg-[radial-gradient(circle_at_top_left,_#def7e7,_transparent_35%),#f7fbf8]",
  peach: "bg-[radial-gradient(circle_at_top_left,_#ffe8d8,_transparent_35%),#fffaf7]",
  midnight: "bg-[#0f0f12]",
}
function loadWizardHandoff(): WizardHandoff | null {
  try {
    const raw = localStorage.getItem("cc_wizard_data")
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<WizardHandoff>
    if (typeof value.conceptSlug !== "string" || !value.conceptSlug) return null
    const school = value.schoolData
    const schoolData = school && typeof school.college_id === "string" && typeof school.college_name === "string" && typeof school.college_state === "string"
      ? school
      : null
    return {
      conceptSlug: value.conceptSlug,
      conceptLabel: typeof value.conceptLabel === "string" ? value.conceptLabel : "",
      conceptLabelKo: typeof value.conceptLabelKo === "string" ? value.conceptLabelKo : "",
      school: typeof value.school === "string" ? value.school : null,
      schoolData,
    }
  } catch {
    return null
  }
}
function clearWizardHandoff() {
  try { localStorage.removeItem("cc_wizard_data") } catch {}
}
function profileFromWizardHandoff(handoff: WizardHandoff, userId: string): PlanGoalProfile {
  const label = handoff.conceptLabelKo || handoff.conceptLabel || "My Australia pathway"
  return {
    user_id: userId,
    target_occupation_code: "",
    target_occupation_title: "",
    target_study_concept_slug: handoff.conceptSlug,
    target_study_concept_label: label,
    target_intake_month: null,
    plan_title: label,
    strategy: "",
    setup_completed_at: new Date().toISOString(),
  }
}
function optionFromWizardSchool(school: WizardHandoffSchool, fieldName: string): PlanGoalOption {
  return {
    id: `pathfinder-${school.college_id}`,
    position: 1,
    source_type: "saved_university",
    source_reference: school.college_id,
    title: school.college_name,
    provider_name: school.college_name,
    field_name: fieldName,
  }
}
function numericValue(value: number | string | null) { if (value === null || value === "") return null; const number = Number(String(value).replace(/,/g, "")); return Number.isFinite(number) && number >= 0 ? number : null }
function numberOrNull(value: number | string | null) { return numericValue(value) }
function sortTasks(a: PlanTask, b: PlanTask) { if (a.status !== b.status) return a.status === "todo" ? -1 : 1; if (!a.due_date) return 1; if (!b.due_date) return -1; return a.due_date.localeCompare(b.due_date) }
function sortApplicationRecords(a: PlanApplicationRecord, b: PlanApplicationRecord) { if (!a.deadline_date) return 1; if (!b.deadline_date) return -1; return a.deadline_date.localeCompare(b.deadline_date) }
function addDaysToDate(value: string, days: number) { const date = new Date(`${value}T00:00:00`); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10) }
function requiredMonthlySaving(remaining: number, targetDate: string) { const months = Math.ceil((new Date(`${targetDate}T00:00:00`).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)); return months > 0 ? remaining / months : null }
function money(value: number, currency: string) { try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "AUD", maximumFractionDigits: 0 }).format(value) } catch { return `${currency || "AUD"} ${Math.round(value).toLocaleString()}` } }
function formatShortDate(value: string) { return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`)) }
