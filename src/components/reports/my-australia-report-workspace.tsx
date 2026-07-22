"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { Check, CircleAlert, FileCheck2, Loader2, LockKeyhole, Plus, ShieldCheck, Sparkles, X } from "lucide-react"
import { AustraliaJourneyNav } from "@/components/australia/australia-journey-nav"
import { createClient } from "@/lib/supabase-client"
import { recordReportEvent } from "@/lib/analytics"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath } from "@/lib/i18n/config"
import {
  EMPTY_REPORT_INTAKE,
  emptyDecisionOption,
  isDecisionOptionComplete,
  normaliseDecisionOption,
  toReportIntakeRow,
  validateReportIntake,
  type DecisionOptionDraft,
  type ReportIntakeDraft,
} from "@/lib/report-intake"
import { REPORT_PRODUCTS, formatAud } from "@/lib/report-catalog"
import { createReportDraftFromMyPlan } from "@/lib/report-plan-bridge"
import { cn } from "@/lib/utils"

type IntakeRow = {
  id: string
  age: number | null
  education_work_history: string
  english_level: ReportIntakeDraft["englishLevel"]
  maximum_budget_aud: number | string | null
  expected_scholarship_aud: number | string | null
  family_accompaniment: ReportIntakeDraft["familyAccompaniment"]
  preferred_cities: string[]
  location_preference: ReportIntakeDraft["locationPreference"]
  target_occupation: string
  post_study_goal: ReportIntakeDraft["postStudyGoal"]
  risk_tolerance: ReportIntakeDraft["riskTolerance"]
  desired_payback_years: number | null
  report_language: ReportIntakeDraft["reportLanguage"]
  privacy_consent_at: string | null
}

type OptionRow = {
  position: 1 | 2 | 3
  source_type: DecisionOptionDraft["sourceType"]
  source_reference: string | null
  title: string
  provider_name: string
  city: string
  state_or_territory: string
  field_name: string
  study_level: string
  notes: string
}

type SavedUniversity = { id: number; univ_slug: string; univ_name: string }
type SavedCourse = { id: number; course_name: string; college_name: string; field_name: string }
type Order = { id: string; product_id: string; status: string; created_at: string }
type PlanGoalProfile = { target_occupation_title: string }
type PlanGoalOption = { position: number; source_type: "saved_university" | "saved_course"; source_reference: string; title: string; provider_name: string; field_name: string }
type PlanBudget = { target_amount: number | string | null }
type PlanMoneyScenario = { scholarship_amount: number | string | null }
type PlanLanguageGoal = { exam_name: string }

function draftFromRow(row: IntakeRow): ReportIntakeDraft {
  return {
    age: row.age == null ? "" : String(row.age),
    educationWorkHistory: row.education_work_history ?? "",
    englishLevel: row.english_level ?? "not_sure",
    maximumBudgetAud: row.maximum_budget_aud == null ? "" : String(row.maximum_budget_aud),
    expectedScholarshipAud: row.expected_scholarship_aud == null ? "" : String(row.expected_scholarship_aud),
    familyAccompaniment: row.family_accompaniment ?? "not_sure",
    preferredCities: (row.preferred_cities ?? []).join(", "),
    locationPreference: row.location_preference ?? "open",
    targetOccupation: row.target_occupation ?? "",
    postStudyGoal: row.post_study_goal ?? "not_sure",
    riskTolerance: row.risk_tolerance ?? "balanced",
    desiredPaybackYears: row.desired_payback_years == null ? "" : String(row.desired_payback_years),
    reportLanguage: row.report_language ?? "en",
    hasPrivacyConsent: Boolean(row.privacy_consent_at),
  }
}

function optionFromRow(row: OptionRow): DecisionOptionDraft {
  return {
    position: row.position,
    sourceType: row.source_type,
    sourceReference: row.source_reference ?? "",
    title: row.title,
    providerName: row.provider_name,
    city: row.city,
    stateOrTerritory: row.state_or_territory,
    fieldName: row.field_name,
    studyLevel: row.study_level,
    notes: row.notes,
  }
}

function optionRows(options: OptionRow[]) {
  return ([1, 2, 3] as const).map((position) => optionFromRow(options.find((option) => option.position === position) ?? {
    position,
    source_type: "manual",
    source_reference: "",
    title: "",
    provider_name: "",
    city: "",
    state_or_territory: "",
    field_name: "",
    study_level: "",
    notes: "",
  }))
}

function orderStatusLabel(status: string, isKo: boolean) {
  const labels: Record<string, [string, string]> = {
    draft: ["Draft", "초안"],
    awaiting_payment: ["Awaiting payment", "결제 대기"],
    paid: ["Paid", "결제 완료"],
    generating: ["Preparing report", "리포트 제작 중"],
    ready: ["Ready", "전달 완료"],
    failed: ["Needs support", "확인 필요"],
    refunded: ["Refunded", "환불됨"],
    cancelled: ["Cancelled", "취소됨"],
  }
  return (labels[status] ?? [status, status])[isKo ? 1 : 0]
}

export function MyAustraliaReportWorkspace() {
  const supabase = useMemo(() => createClient(), [])
  const routeLocale = useRouteLocale()
  const isKo = routeLocale === "ko"
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [intake, setIntake] = useState<ReportIntakeDraft>({ ...EMPTY_REPORT_INTAKE, reportLanguage: isKo ? "ko" : "en" })
  const [options, setOptions] = useState<DecisionOptionDraft[]>([emptyDecisionOption(1), emptyDecisionOption(2), emptyDecisionOption(3)])
  const [savedUniversities, setSavedUniversities] = useState<SavedUniversity[]>([])
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [importedFromPlan, setImportedFromPlan] = useState(false)
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    recordReportEvent("report_workspace_open", { surface: "report_workspace", country: "AU", locale: routeLocale })
  }, [routeLocale])

  const copy = isKo ? {
    eyebrow: "개인화 리포트 준비",
    title: "나의 호주 ROI 의사결정 리포트",
    description: "조건과 후보를 저장해 두면, 판매 준비가 완료된 뒤 개인화 분석의 기준으로 사용합니다.",
    gate: "아직 판매를 시작하지 않았습니다",
    gateDescription: "현재는 근거 데이터와 리포트 전달 절차를 검증하는 단계입니다. 결제나 자동 추천은 열지 않습니다.",
    profile: "1. 내 조건",
    profileDescription: "리포트에 필요한 조건만 입력하세요. 나중에 언제든 수정할 수 있습니다.",
    options: "2. 비교할 선택지",
    optionsDescription: "최대 세 가지 선택지를 저장하세요. 아직 확정하지 않았다면 빈칸으로 두어도 됩니다.",
    ready: "3. 리포트 준비 상태",
    readyDescription: "조건과 선택지는 저장되지만, 근거 검증이 끝날 때까지 리포트 주문은 열리지 않습니다.",
    age: "현재 나이", education: "학력·경력", educationHint: "예: 간호학 학사, 3년 병원 경력", english: "영어 수준",
    budget: "최대 예산 (AUD)", scholarship: "예상 장학금 (AUD)", family: "가족 동반", cities: "선호 도시", citiesHint: "쉼표로 구분 (예: Sydney, Adelaide)",
    location: "대도시·지역도시 선호", occupation: "목표 직업", goal: "학업 후 목표", risk: "위험 감수 수준", payback: "희망 투자회수기간 (년)", language: "리포트 언어",
    consent: "내 조건과 선택지를 개인화 리포트 준비 목적으로 최대 12개월 보관하는 것에 동의합니다.",
    consentHint: "비자·입학·취업 결과를 자동으로 결정하거나 보장하지 않습니다. 삭제 요청은 계정 관리 또는 지원 경로로 할 수 있습니다.",
    option: "Option", titleLabel: "과정 또는 선택지 이름", provider: "대학·교육기관", city: "도시", state: "주/준주", field: "분야", level: "학위·과정 단계", notes: "메모 (선택)",
    clear: "비우기", save: "조건과 선택지 저장", saving: "저장 중…", saved: "저장되었습니다. 이 정보는 리포트 준비용으로만 사용됩니다.",
    savedChoices: "저장한 후보에서 가져오기", noSaved: "저장한 대학·과정이 아직 없습니다. 비교 화면에서 후보를 저장하거나 직접 입력하세요.", useNext: "다음 빈칸에 넣기",
    planImported: "My Plan에서 리포트 초안을 가져왔습니다", planImportedDescription: "후보, 목표 직업, 총 필요 자금, 장학금과 영어 시험 정보를 반영했습니다. 개인정보 보관 동의 전에는 아무것도 저장되지 않습니다.",
    reportNotOpen: "주문 준비 중", reportNotOpenDescription: "근거 데이터, 결제, 전달·환불 정책이 모두 준비된 뒤에만 주문을 열 예정입니다.",
    orderHistory: "내 리포트 상태", noOrders: "아직 주문한 리포트가 없습니다.", needsConsent: "저장하려면 개인정보 보관 동의가 필요합니다.", invalid: "입력값을 다시 확인해 주세요.",
    savedCount: "선택지 {count}/3개 저장", profileSaved: "조건 저장 준비 완료", reportContents: "완성 시 제공되는 내용", contentList: ["1순위와 근거", "기본·낙관·보수 ROI 시나리오", "선택지별 위험과 확인할 정보", "90일 실행계획", "출처·기준일·신뢰도"],
    backToStudy: "학업 비교로 돌아가기", manual: "직접 입력", optionNote: "각 선택지는 추후 총비용·생활비·초봉·투자회수기간과 함께 비교됩니다.",
  } : {
    eyebrow: "Personal report preparation",
    title: "My Australia ROI Decision Report",
    description: "Save your conditions and shortlist now. They will become the basis for a personalised analysis once sales are ready.",
    gate: "Report sales are not open yet",
    gateDescription: "We are validating evidence and delivery operations. Payments and automated recommendations remain unavailable.",
    profile: "1. Your conditions",
    profileDescription: "Share only the decision details needed for the report. You can revise them at any time.",
    options: "2. Options to compare",
    optionsDescription: "Save up to three options. Leave any position blank if your shortlist is still forming.",
    ready: "3. Report readiness",
    readyDescription: "Your conditions and options can be saved, but a report cannot be ordered until evidence checks are complete.",
    age: "Current age", education: "Education and work history", educationHint: "For example: Nursing bachelor’s, 3 years in a hospital", english: "English level",
    budget: "Maximum budget (AUD)", scholarship: "Expected scholarship (AUD)", family: "Family accompaniment", cities: "Preferred cities", citiesHint: "Separate cities with commas (for example: Sydney, Adelaide)",
    location: "Metro or regional preference", occupation: "Target occupation", goal: "Goal after study", risk: "Risk tolerance", payback: "Preferred payback period (years)", language: "Report language",
    consent: "I agree that CampCareer may retain these conditions and options for up to 12 months to prepare my personalised report.",
    consentHint: "This does not determine or guarantee visa, admission, employment, or financial outcomes. You can request deletion through account management or support.",
    option: "Option", titleLabel: "Programme or option name", provider: "University or provider", city: "City", state: "State or territory", field: "Field", level: "Qualification level", notes: "Notes (optional)",
    clear: "Clear", save: "Save conditions and options", saving: "Saving…", saved: "Saved. This information is used only to prepare your report.",
    savedChoices: "Use a saved choice", noSaved: "You have not saved a university or course yet. Save one while comparing, or enter an option manually.", useNext: "Use next open option",
    planImported: "Your My Plan draft has been imported", planImportedDescription: "We brought in your shortlist, career direction, total funding need, scholarship and English exam. Nothing is saved until you review the retention consent.",
    reportNotOpen: "Ordering is being prepared", reportNotOpenDescription: "Orders will open only after evidence, payment, delivery, and refund policies are complete.",
    orderHistory: "My report status", noOrders: "You have not ordered a report yet.", needsConsent: "Please agree to the retention notice before saving.", invalid: "Please review the highlighted input values.",
    savedCount: "{count}/3 options saved", profileSaved: "Profile ready to save", reportContents: "What the finished report will include", contentList: ["A first-ranked option and why", "Base, optimistic and conservative ROI scenarios", "Option risks and items to verify", "A 90-day action plan", "Sources, as-of dates and confidence"],
    backToStudy: "Back to study comparison", manual: "Manual entry", optionNote: "Each option will later be compared on total cost, living costs, starting pay, and payback period.",
  }

  const loadWorkspace = useCallback(async (userId: string) => {
    const importFromMyPlan = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("from") === "myplan"
    const results = await Promise.all([
      supabase.from("report_intakes").select("id, age, education_work_history, english_level, maximum_budget_aud, expected_scholarship_aud, family_accompaniment, preferred_cities, location_preference, target_occupation, post_study_goal, risk_tolerance, desired_payback_years, report_language, privacy_consent_at").eq("user_id", userId).eq("country", "AU").maybeSingle(),
      supabase.from("saved_universities").select("id, univ_slug, univ_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(6),
      supabase.from("saved_courses").select("id, course_name, college_name, field_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(6),
      supabase.from("report_orders").select("id, product_id, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(6),
      supabase.from("plan_goal_profiles").select("target_occupation_title").eq("user_id", userId).maybeSingle(),
      supabase.from("plan_goal_options").select("position, source_type, source_reference, title, provider_name, field_name").eq("user_id", userId).order("position", { ascending: true }),
      supabase.from("plan_budgets").select("target_amount").eq("user_id", userId).maybeSingle(),
      supabase.from("plan_money_scenarios").select("scholarship_amount").eq("user_id", userId).maybeSingle(),
      supabase.from("plan_language_goals").select("exam_name").eq("user_id", userId).maybeSingle(),
    ])
    const intakeRow = results[0].data as IntakeRow | null
    if (intakeRow) {
      const optionResult = await supabase.from("report_decision_options").select("position, source_type, source_reference, title, provider_name, city, state_or_territory, field_name, study_level, notes").eq("intake_id", intakeRow.id).order("position")
      setIntake(draftFromRow(intakeRow))
      setOptions(optionRows((optionResult.data as OptionRow[] | null) ?? []))
      setImportedFromPlan(false)
    } else {
      const emptyIntake = { ...EMPTY_REPORT_INTAKE, reportLanguage: routeLocale === "ko" ? "ko" : "en" } as ReportIntakeDraft
      setIntake(emptyIntake)
      setOptions([emptyDecisionOption(1), emptyDecisionOption(2), emptyDecisionOption(3)])
      setImportedFromPlan(false)
      if (importFromMyPlan) {
        const imported = createReportDraftFromMyPlan({
          profile: results[4].data as PlanGoalProfile | null,
          options: (results[5].data as PlanGoalOption[] | null) ?? [],
          budget: results[6].data as PlanBudget | null,
          moneyScenario: results[7].data as PlanMoneyScenario | null,
          language: results[8].data as PlanLanguageGoal | null,
          reportLanguage: routeLocale === "ko" ? "ko" : "en",
        })
        if (imported.hasImportedData) {
          setIntake(imported.intake)
          setOptions(imported.options)
          setImportedFromPlan(true)
        }
      }
    }
    setSavedUniversities((results[1].data as SavedUniversity[] | null) ?? [])
    setSavedCourses((results[2].data as SavedCourse[] | null) ?? [])
    setOrders((results[3].data as Order[] | null) ?? [])
    setLoading(false)
  }, [routeLocale, supabase])

  useEffect(() => {
    let active = true
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
  }, [loadWorkspace, supabase])

  function updateIntake<K extends keyof ReportIntakeDraft>(key: K, value: ReportIntakeDraft[K]) {
    setIntake((current) => ({ ...current, [key]: value }))
  }

  function updateOption<K extends keyof DecisionOptionDraft>(position: 1 | 2 | 3, key: K, value: DecisionOptionDraft[K]) {
    setOptions((current) => current.map((option) => option.position === position ? { ...option, [key]: value } : option))
  }

  function clearOption(position: 1 | 2 | 3) {
    setOptions((current) => current.map((option) => option.position === position ? emptyDecisionOption(position) : option))
  }

  function insertSavedChoice(choice: SavedUniversity | SavedCourse, kind: "saved_university" | "saved_course") {
    const target = options.find((option) => !isDecisionOptionComplete(option)) ?? options[2]
    const next = kind === "saved_university"
      ? { ...emptyDecisionOption(target.position), sourceType: kind, sourceReference: (choice as SavedUniversity).univ_slug, title: (choice as SavedUniversity).univ_name, providerName: (choice as SavedUniversity).univ_name }
      : { ...emptyDecisionOption(target.position), sourceType: kind, sourceReference: String((choice as SavedCourse).id), title: (choice as SavedCourse).course_name, providerName: (choice as SavedCourse).college_name, fieldName: (choice as SavedCourse).field_name }
    setOptions((current) => current.map((option) => option.position === target.position ? next : option))
    setNotice(null)
  }

  async function saveWorkspace() {
    if (!user) return
    const issues = validateReportIntake(intake)
    if (issues.length) {
      setNotice({ type: "error", text: issues.includes("privacyConsent") ? copy.needsConsent : copy.invalid })
      return
    }

    setSaving(true)
    setNotice(null)
    const { data: savedIntake, error: intakeError } = await supabase
      .from("report_intakes")
      .upsert(toReportIntakeRow(intake, user.id), { onConflict: "user_id,country" })
      .select("id")
      .single()

    if (intakeError || !savedIntake) {
      setSaving(false)
      setNotice({ type: "error", text: copy.invalid })
      return
    }

    const complete = options.filter(isDecisionOptionComplete).map(normaliseDecisionOption)
    const optionPayload = complete.map((option) => ({
      intake_id: savedIntake.id,
      position: option.position,
      source_type: option.sourceType,
      source_reference: option.sourceReference || null,
      title: option.title,
      provider_name: option.providerName,
      city: option.city,
      state_or_territory: option.stateOrTerritory,
      field_name: option.fieldName,
      study_level: option.studyLevel,
      notes: option.notes,
      updated_at: new Date().toISOString(),
    }))
    const missingPositions = ([1, 2, 3] as const).filter((position) => !complete.some((option) => option.position === position))
    const [upsertResult, deleteResult] = await Promise.all([
      optionPayload.length ? supabase.from("report_decision_options").upsert(optionPayload, { onConflict: "intake_id,position" }) : Promise.resolve({ error: null }),
      missingPositions.length ? supabase.from("report_decision_options").delete().eq("intake_id", savedIntake.id).in("position", missingPositions) : Promise.resolve({ error: null }),
    ])
    setSaving(false)
    if (upsertResult.error || deleteResult.error) {
      setNotice({ type: "error", text: copy.invalid })
      return
    }
    setNotice({ type: "success", text: copy.saved })
  }

  const completeOptionCount = options.filter(isDecisionOptionComplete).length
  const pathLocale = localeFromPathname(typeof window === "undefined" ? "/" : window.location.pathname) ?? routeLocale

  if (loading) return <main className="min-h-screen bg-slate-50 px-5 py-10"><div className="mx-auto max-w-6xl animate-pulse rounded-3xl border border-slate-200 bg-white p-8"><div className="h-6 w-48 rounded bg-slate-200" /><div className="mt-5 h-36 rounded-2xl bg-slate-100" /></div></main>
  if (!user) return null

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_44%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <AustraliaJourneyNav />
        <section className="mt-6 overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-[0_20px_55px_rgba(30,64,175,.10)]">
          <div className="border-b border-blue-100 bg-[linear-gradient(125deg,#eff6ff_0%,#ffffff_70%)] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-blue-700">{copy.eyebrow}</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{copy.title}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{copy.description}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:max-w-xs">
                <span className="flex items-center gap-2 font-semibold"><LockKeyhole className="size-4" />{copy.gate}</span>
                <p className="mt-1 text-xs leading-5 text-amber-800">{copy.gateDescription}</p>
              </div>
            </div>
            {importedFromPlan && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950"><Sparkles className="mt-0.5 size-4 shrink-0 text-violet-700" /><span><strong>{copy.planImported}</strong><span className="mt-1 block text-xs leading-5 text-violet-800">{copy.planImportedDescription}</span></span></div>}
            <ol className="mt-7 grid gap-2 sm:grid-cols-3" aria-label={isKo ? "리포트 준비 단계" : "Report preparation steps"}>
              {[copy.profile, copy.options, copy.ready].map((label, index) => <li key={label} className={cn("rounded-2xl border px-3 py-3 text-sm font-semibold", index === 0 ? "border-blue-200 bg-white text-blue-800" : "border-slate-200 bg-white/70 text-slate-600")}><span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-slate-100 text-[11px] text-slate-700">{index + 1}</span>{label.replace(/^\d\.\s*/, "")}</li>)}
            </ol>
          </div>

          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0 space-y-8">
              <section aria-labelledby="report-profile-title">
                <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700"><Sparkles className="size-4" /></span><div><h2 id="report-profile-title" className="font-semibold text-slate-950">{copy.profile}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{copy.profileDescription}</p></div></div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label={copy.age}><input inputMode="numeric" value={intake.age} onChange={(event) => updateIntake("age", event.target.value)} placeholder="28" className={inputClass} /></Field>
                  <Field label={copy.english}><select value={intake.englishLevel} onChange={(event) => updateIntake("englishLevel", event.target.value as ReportIntakeDraft["englishLevel"])} className={inputClass}><option value="not_sure">{isKo ? "아직 모르겠어요" : "Not sure yet"}</option><option value="beginner">{isKo ? "초급" : "Beginner"}</option><option value="intermediate">{isKo ? "중급" : "Intermediate"}</option><option value="upper_intermediate">{isKo ? "중상급" : "Upper intermediate"}</option><option value="advanced">{isKo ? "고급" : "Advanced"}</option><option value="ielts">IELTS</option><option value="pte">PTE</option><option value="toefl">TOEFL</option></select></Field>
                  <Field label={copy.education} hint={copy.educationHint} className="sm:col-span-2"><textarea value={intake.educationWorkHistory} onChange={(event) => updateIntake("educationWorkHistory", event.target.value)} rows={3} className={inputClass} /></Field>
                  <Field label={copy.budget}><input inputMode="decimal" value={intake.maximumBudgetAud} onChange={(event) => updateIntake("maximumBudgetAud", event.target.value)} placeholder="85000" className={inputClass} /></Field>
                  <Field label={copy.scholarship}><input inputMode="decimal" value={intake.expectedScholarshipAud} onChange={(event) => updateIntake("expectedScholarshipAud", event.target.value)} placeholder="5000" className={inputClass} /></Field>
                  <Field label={copy.family}><select value={intake.familyAccompaniment} onChange={(event) => updateIntake("familyAccompaniment", event.target.value as ReportIntakeDraft["familyAccompaniment"])} className={inputClass}><option value="not_sure">{isKo ? "아직 모르겠어요" : "Not sure yet"}</option><option value="no">{isKo ? "동반 없음" : "No accompanying family"}</option><option value="partner">{isKo ? "배우자" : "Partner"}</option><option value="children">{isKo ? "자녀" : "Children"}</option><option value="partner_and_children">{isKo ? "배우자와 자녀" : "Partner and children"}</option></select></Field>
                  <Field label={copy.location}><select value={intake.locationPreference} onChange={(event) => updateIntake("locationPreference", event.target.value as ReportIntakeDraft["locationPreference"])} className={inputClass}><option value="open">{isKo ? "모두 열어두기" : "Open to both"}</option><option value="metro">{isKo ? "대도시" : "Metro"}</option><option value="regional">{isKo ? "지역도시" : "Regional"}</option></select></Field>
                  <Field label={copy.cities} hint={copy.citiesHint} className="sm:col-span-2"><input value={intake.preferredCities} onChange={(event) => updateIntake("preferredCities", event.target.value)} className={inputClass} /></Field>
                  <Field label={copy.occupation}><input value={intake.targetOccupation} onChange={(event) => updateIntake("targetOccupation", event.target.value)} placeholder={isKo ? "예: Registered Nurse" : "For example: Registered Nurse"} className={inputClass} /></Field>
                  <Field label={copy.goal}><select value={intake.postStudyGoal} onChange={(event) => updateIntake("postStudyGoal", event.target.value as ReportIntakeDraft["postStudyGoal"])} className={inputClass}><option value="not_sure">{isKo ? "아직 모르겠어요" : "Not sure yet"}</option><option value="return_home">{isKo ? "학업 후 귀국" : "Return home after study"}</option><option value="australian_employment">{isKo ? "호주 취업" : "Work in Australia"}</option><option value="open_to_both">{isKo ? "둘 다 열어두기" : "Open to both"}</option></select></Field>
                  <Field label={copy.risk}><select value={intake.riskTolerance} onChange={(event) => updateIntake("riskTolerance", event.target.value as ReportIntakeDraft["riskTolerance"])} className={inputClass}><option value="low">{isKo ? "낮음" : "Low"}</option><option value="balanced">{isKo ? "균형" : "Balanced"}</option><option value="high">{isKo ? "높음" : "High"}</option></select></Field>
                  <Field label={copy.payback}><input inputMode="numeric" value={intake.desiredPaybackYears} onChange={(event) => updateIntake("desiredPaybackYears", event.target.value)} placeholder="5" className={inputClass} /></Field>
                  <Field label={copy.language}><select value={intake.reportLanguage} onChange={(event) => updateIntake("reportLanguage", event.target.value as ReportIntakeDraft["reportLanguage"])} className={inputClass}><option value="ko">한국어</option><option value="en">English</option></select></Field>
                </div>
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-5 text-slate-700"><input type="checkbox" checked={intake.hasPrivacyConsent} onChange={(event) => updateIntake("hasPrivacyConsent", event.target.checked)} className="mt-0.5 size-4 accent-blue-600" /><span><span className="font-medium text-slate-900">{copy.consent}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{copy.consentHint}</span></span></label>
              </section>

              <section className="border-t border-slate-200 pt-8" aria-labelledby="report-options-title">
                <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700"><FileCheck2 className="size-4" /></span><div><h2 id="report-options-title" className="font-semibold text-slate-950">{copy.options}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{copy.optionsDescription}</p></div></div>
                <div className="mt-5 space-y-4">
                  {options.map((option) => <OptionCard key={option.position} option={option} copy={copy} isKo={isKo} onUpdate={updateOption} onClear={clearOption} />)}
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/45 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Plus className="size-4 text-blue-700" />{copy.savedChoices}</p><div className="mt-3 flex flex-wrap gap-2">{[...savedUniversities.map((item) => ({ item, kind: "saved_university" as const, label: item.univ_name })), ...savedCourses.map((item) => ({ item, kind: "saved_course" as const, label: item.course_name }))].map(({ item, kind, label }) => <button key={`${kind}-${item.id}`} type="button" onClick={() => insertSavedChoice(item, kind)} className="max-w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-left text-xs font-medium text-blue-800 transition hover:border-blue-400 hover:bg-blue-50"><span className="block truncate">{label}</span><span className="mt-0.5 block text-[10px] text-blue-600">{copy.useNext}</span></button>)}</div>{savedUniversities.length + savedCourses.length === 0 && <p className="mt-2 text-xs leading-5 text-slate-600">{copy.noSaved}</p>}</div>
                <p className="mt-3 text-xs leading-5 text-slate-500">{copy.optionNote}</p>
              </section>

              <div className="border-t border-slate-200 pt-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">{notice ? <p role="status" className={cn("flex items-center gap-2 text-sm", notice.type === "success" ? "text-emerald-700" : "text-rose-700")}>{notice.type === "success" ? <Check className="size-4" /> : <CircleAlert className="size-4" />}{notice.text}</p> : <p className="text-sm text-slate-500">{copy.savedCount.replace("{count}", String(completeOptionCount))}</p>}<button type="button" onClick={() => void saveWorkspace()} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70">{saving ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}{saving ? copy.saving : copy.save}</button></div></div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">{copy.ready}</p><h2 className="mt-2 font-semibold text-slate-950">{copy.reportNotOpen}</h2><p className="mt-2 text-sm leading-5 text-slate-600">{copy.reportNotOpenDescription}</p><div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs font-medium text-slate-500">{copy.reportContents}</p><ul className="mt-2 space-y-2 text-sm leading-5 text-slate-700">{copy.contentList.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></div></section>
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="flex items-center gap-2 text-sm font-semibold text-amber-950"><LockKeyhole className="size-4" />{copy.orderHistory}</p><div className="mt-3 space-y-2">{orders.length ? orders.map((order) => <div key={order.id} className="rounded-xl border border-amber-200/70 bg-white px-3 py-2 text-xs"><p className="font-medium text-slate-800">{REPORT_PRODUCTS.find((product) => product.id === order.product_id)?.[isKo ? "titleKo" : "title"] ?? order.product_id}</p><p className="mt-1 text-amber-800">{orderStatusLabel(order.status, isKo)}</p></div>) : <p className="text-sm leading-5 text-amber-900">{copy.noOrders}</p>}</div></section>
              <Link href={localizePath("/au/study", pathLocale)} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">{copy.backToStudy} <span aria-hidden>→</span></Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

const inputClass = "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

function Field({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return <label className={className}><span className="block text-sm font-medium text-slate-800">{label}</span>{hint && <span className="mt-1 block text-xs leading-4 text-slate-500">{hint}</span>}<span className="mt-1.5 block">{children}</span></label>
}

function OptionCard({ option, copy, isKo, onUpdate, onClear }: { option: DecisionOptionDraft; copy: Record<string, unknown>; isKo: boolean; onUpdate: <K extends keyof DecisionOptionDraft>(position: 1 | 2 | 3, key: K, value: DecisionOptionDraft[K]) => void; onClear: (position: 1 | 2 | 3) => void }) {
  const text = copy as Record<string, string>
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-slate-950">{text.option} {String.fromCharCode(64 + option.position)}</h3><button type="button" onClick={() => onClear(option.position)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-700"><X className="size-3.5" />{text.clear}</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Field label={text.titleLabel} className="sm:col-span-2"><input value={option.title} onChange={(event) => onUpdate(option.position, "title", event.target.value)} className={inputClass} /></Field><Field label={text.provider}><input value={option.providerName} onChange={(event) => onUpdate(option.position, "providerName", event.target.value)} className={inputClass} /></Field><Field label={text.field}><input value={option.fieldName} onChange={(event) => onUpdate(option.position, "fieldName", event.target.value)} className={inputClass} /></Field><Field label={text.city}><input value={option.city} onChange={(event) => onUpdate(option.position, "city", event.target.value)} className={inputClass} /></Field><Field label={text.state}><input value={option.stateOrTerritory} onChange={(event) => onUpdate(option.position, "stateOrTerritory", event.target.value)} className={inputClass} /></Field><Field label={text.level}><input value={option.studyLevel} onChange={(event) => onUpdate(option.position, "studyLevel", event.target.value)} placeholder={isKo ? "예: Bachelor, Master, VET" : "For example: Bachelor, Master, VET"} className={inputClass} /></Field><Field label={text.notes} className="sm:col-span-2"><textarea value={option.notes} onChange={(event) => onUpdate(option.position, "notes", event.target.value)} rows={2} className={inputClass} /></Field></div></article>
}
