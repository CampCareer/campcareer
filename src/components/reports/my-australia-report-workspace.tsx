"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, ArrowRight, Check, CircleAlert, FileCheck2, Loader2, LockKeyhole, MapPin, ShieldCheck, Sparkles, Target, UserRound, WalletCards, X } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { recordReportEvent } from "@/lib/analytics"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
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
import { ReportList } from "@/components/planner/report-list"

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
type PlanGoalProfile = { target_occupation_title: string }
type PlanGoalOption = { position: number; source_type: "saved_university" | "saved_course"; source_reference: string; title: string; provider_name: string; field_name: string }
type PlanBudget = { target_amount: number | string | null }
type PlanMoneyScenario = { scholarship_amount: number | string | null }
type PlanLanguageGoal = { exam_name: string }

const personalReport = REPORT_PRODUCTS.find((product) => product.id === "my-australia-roi-decision-report")

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

export function MyAustraliaReportWorkspace() {
  const supabase = useMemo(() => createClient(), [])
  const routeLocale = useRouteLocale()
  const isKo = routeLocale === "ko"
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [step, setStep] = useState(0)
  const [intake, setIntake] = useState<ReportIntakeDraft>({ ...EMPTY_REPORT_INTAKE, reportLanguage: isKo ? "ko" : "en" })
  const [options, setOptions] = useState<DecisionOptionDraft[]>([emptyDecisionOption(1), emptyDecisionOption(2), emptyDecisionOption(3)])
  const [savedUniversities, setSavedUniversities] = useState<SavedUniversity[]>([])
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [importedFromPlan, setImportedFromPlan] = useState(false)
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    recordReportEvent("report_workspace_open", { surface: "report_workspace", country: "AU", locale: routeLocale })
  }, [routeLocale])

  const copy = isKo ? {
    eyebrow: "MY PLAN · DECISION REPORT",
    title: "내 조건으로 ROI 리포트 준비하기",
    description: "한 번에 하나씩만 답하세요. 저장한 후보와 플랜 데이터를 먼저 가져와, 나중에 바로 분석 가능한 리포트 브리프로 완성합니다.",
    imported: "My Plan에서 저장한 정보가 먼저 채워졌어요.",
    progress: "진행",
    back: "이전",
    next: "다음",
    skip: "나중에 입력",
    direction: "어떤 결과를 만들고 싶나요?",
    directionDetail: "리포트가 어떤 직업과 커리어 결과를 우선해야 하는지 정합니다.",
    budget: "비용의 기준선을 정해볼게요.",
    budgetDetail: "완벽한 숫자일 필요는 없어요. 현재 가능한 범위를 알려주면 ROI 해석이 현실적이 됩니다.",
    background: "현재 위치를 알려주세요.",
    backgroundDetail: "학력, 경력, 영어와 가족 조건은 입학 가능성과 비용 시나리오에 영향을 줍니다.",
    preferences: "호주에서의 생활 조건은요?",
    preferencesDetail: "도시와 생활 방식의 선호를 반영해, 국가 평균이 아닌 내 조건으로 계산합니다.",
    shortlist: "비교할 선택지를 하나씩 넣어주세요.",
    shortlistDetail: "후보가 아직 하나여도 괜찮아요. 다음 후보가 생기면 이곳에서 언제든 추가할 수 있습니다.",
    review: "리포트 브리프를 저장할 준비가 됐어요.",
    reviewDetail: "저장하면 리포트 제작과 구매가 열렸을 때 바로 내 조건을 불러올 수 있습니다.",
    occupation: "목표 직업", occupationPlaceholder: "예: Registered Nurse, Software Engineer",
    goal: "학업 후 목표", english: "현재 영어 수준", budgetLabel: "최대 예산 (AUD)", scholarship: "예상 장학금 (AUD)", payback: "희망 투자회수기간 (년)", risk: "위험 감수 수준",
    age: "현재 나이", education: "학력·경력", educationHint: "예: 간호학 학사, 병원 경력 3년", family: "가족 동반", location: "대도시·지역도시 선호", cities: "선호 도시", citiesHint: "쉼표로 구분 · 예: Sydney, Adelaide", language: "리포트 언어",
    option: "선택지", optionName: "과정 또는 선택지 이름", provider: "대학·교육기관", field: "분야", city: "도시", state: "주/준주", level: "학위·과정 단계", optionNotes: "메모 (선택)", clear: "비우기",
    savedChoices: "저장한 후보 가져오기", noSaved: "아직 저장한 대학·과정이 없어요. 비교 화면에서 저장하거나 직접 입력할 수 있습니다.",
    consent: "CampCareer가 개인화 리포트 준비를 위해 내 조건과 선택지를 최대 12개월 보관하는 것에 동의합니다.",
    consentHint: "비자·입학·취업 결과를 자동으로 결정하거나 보장하지 않습니다. 삭제 요청은 계정 관리 또는 지원 경로로 할 수 있습니다.",
    save: "내 리포트 브리프 저장", saving: "저장 중…", saved: "리포트 브리프가 저장되었습니다.",
    price: "개인화 ROI 리포트", upgrade: "ROI Index 구매자는 A$30 업그레이드", notOpen: "아직 결제와 리포트 전달은 열지 않았습니다.", notOpenDetail: "근거 데이터와 리포트가 준비되는 대로, 저장한 이 브리프를 불러와 구매와 제작을 바로 이어갈 수 있습니다.",
    includes: "완성된 리포트에는", contents: ["내 조건 기준 1순위와 근거", "기본·낙관·보수 ROI 시나리오", "선택지별 리스크와 확인 항목", "90일 실행 계획과 데이터 출처"],
    needConsent: "저장하려면 개인정보 보관 동의가 필요합니다.", invalid: "해당 단계의 숫자 입력을 다시 확인해 주세요.", summary: "저장될 내용", emptyOption: "아직 후보를 정하지 않았어요", savedReady: "저장 완료 · 주문 준비 중",
  } : {
    eyebrow: "MY PLAN · DECISION REPORT",
    title: "Prepare your personalised ROI report",
    description: "Answer one focused question at a time. We start with your saved options and plan data, then build a report brief ready for analysis.",
    imported: "We prefilled this from the information saved in My Plan.",
    progress: "Progress",
    back: "Back",
    next: "Continue",
    skip: "Add later",
    direction: "What outcome are you working towards?",
    directionDetail: "This tells the report which career result to prioritise.",
    budget: "Set your financial boundary.",
    budgetDetail: "It does not need to be exact. A realistic range makes the ROI analysis useful.",
    background: "Tell us where you are starting from.",
    backgroundDetail: "Your education, work, English and family situation affect admission and cost scenarios.",
    preferences: "What should life in Australia look like?",
    preferencesDetail: "We use your city and lifestyle preference rather than a single national average.",
    shortlist: "Add the options you want to compare.",
    shortlistDetail: "One option is enough to begin. Return any time to add another candidate.",
    review: "Your report brief is ready to save.",
    reviewDetail: "Once saved, we can bring these conditions straight into purchase and report production when they open.",
    occupation: "Target occupation", occupationPlaceholder: "For example: Registered Nurse, Software Engineer",
    goal: "Goal after study", english: "Current English level", budgetLabel: "Maximum budget (AUD)", scholarship: "Expected scholarship (AUD)", payback: "Preferred payback period (years)", risk: "Risk tolerance",
    age: "Current age", education: "Education and work history", educationHint: "For example: Nursing bachelor’s, 3 years in a hospital", family: "Family accompaniment", location: "Metro or regional preference", cities: "Preferred cities", citiesHint: "Separate cities with commas · for example: Sydney, Adelaide", language: "Report language",
    option: "Option", optionName: "Programme or option name", provider: "University or provider", field: "Field", city: "City", state: "State or territory", level: "Qualification level", optionNotes: "Notes (optional)", clear: "Clear",
    savedChoices: "Use a saved option", noSaved: "You have not saved a university or course yet. Save one while comparing, or enter an option manually.",
    consent: "I agree that CampCareer may retain these conditions and options for up to 12 months to prepare my personalised report.",
    consentHint: "This does not determine or guarantee visa, admission, employment, or financial outcomes. You can request deletion through account management or support.",
    save: "Save my report brief", saving: "Saving…", saved: "Your report brief has been saved.",
    price: "Personalised ROI decision report", upgrade: "A$30 upgrade for ROI Index customers", notOpen: "Checkout and report delivery are not open yet.", notOpenDetail: "When the evidence and report are ready, we can load this saved brief straight into purchase and production.",
    includes: "Your finished report will include", contents: ["A first-ranked option and why", "Base, optimistic and conservative ROI scenarios", "Option risks and verification items", "A 90-day action plan with sources"],
    needConsent: "Please agree to the retention notice before saving.", invalid: "Please check the number entered on this step.", summary: "What will be saved", emptyOption: "No option chosen yet", savedReady: "Saved · waiting for ordering to open",
  }

  const steps = [
    { key: "direction", title: copy.direction, detail: copy.directionDetail, icon: Target },
    { key: "budget", title: copy.budget, detail: copy.budgetDetail, icon: WalletCards },
    { key: "background", title: copy.background, detail: copy.backgroundDetail, icon: UserRound },
    { key: "preferences", title: copy.preferences, detail: copy.preferencesDetail, icon: MapPin },
    { key: "shortlist", title: copy.shortlist, detail: copy.shortlistDetail, icon: FileCheck2 },
    { key: "review", title: copy.review, detail: copy.reviewDetail, icon: Sparkles },
  ] as const

  const loadWorkspace = useCallback(async (userId: string) => {
    const results = await Promise.all([
      supabase.from("report_intakes").select("id, age, education_work_history, english_level, maximum_budget_aud, expected_scholarship_aud, family_accompaniment, preferred_cities, location_preference, target_occupation, post_study_goal, risk_tolerance, desired_payback_years, report_language, privacy_consent_at").eq("user_id", userId).eq("country", "AU").maybeSingle(),
      supabase.from("saved_universities").select("id, univ_slug, univ_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(6),
      supabase.from("saved_courses").select("id, course_name, college_name, field_name").eq("user_id", userId).order("created_at", { ascending: false }).limit(6),
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
      setSaved(true)
    } else {
      const imported = createReportDraftFromMyPlan({
        profile: results[3].data as PlanGoalProfile | null,
        options: (results[4].data as PlanGoalOption[] | null) ?? [],
        budget: results[5].data as PlanBudget | null,
        moneyScenario: results[6].data as PlanMoneyScenario | null,
        language: results[7].data as PlanLanguageGoal | null,
        reportLanguage: isKo ? "ko" : "en",
      })
      setIntake(imported.intake)
      setOptions(imported.options)
      setImportedFromPlan(imported.hasImportedData)
    }
    setSavedUniversities((results[1].data as SavedUniversity[] | null) ?? [])
    setSavedCourses((results[2].data as SavedCourse[] | null) ?? [])
    setLoading(false)
  }, [isKo, supabase])

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
    setSaved(false)
    setNotice(null)
  }

  function updateOption<K extends keyof DecisionOptionDraft>(position: 1 | 2 | 3, key: K, value: DecisionOptionDraft[K]) {
    setOptions((current) => current.map((option) => option.position === position ? { ...option, [key]: value } : option))
    setSaved(false)
    setNotice(null)
  }

  function clearOption(position: 1 | 2 | 3) {
    setOptions((current) => current.map((option) => option.position === position ? emptyDecisionOption(position) : option))
    setSaved(false)
  }

  function insertSavedChoice(choice: SavedUniversity | SavedCourse, kind: "saved_university" | "saved_course", position: 1 | 2 | 3) {
    const next = kind === "saved_university"
      ? { ...emptyDecisionOption(position), sourceType: kind, sourceReference: (choice as SavedUniversity).univ_slug, title: (choice as SavedUniversity).univ_name, providerName: (choice as SavedUniversity).univ_name }
      : { ...emptyDecisionOption(position), sourceType: kind, sourceReference: String((choice as SavedCourse).id), title: (choice as SavedCourse).course_name, providerName: (choice as SavedCourse).college_name, fieldName: (choice as SavedCourse).field_name }
    setOptions((current) => current.map((option) => option.position === position ? next : option))
    setSaved(false)
    setNotice(null)
  }

  function stepHasInvalidNumber(currentStep: number) {
    const issues = validateReportIntake({ ...intake, hasPrivacyConsent: true })
    if (currentStep === 1) return issues.some((issue) => issue === "maximumBudgetAud" || issue === "expectedScholarshipAud" || issue === "desiredPaybackYears")
    if (currentStep === 2) return issues.includes("age")
    return false
  }

  function goForward() {
    if (stepHasInvalidNumber(step)) {
      setNotice({ type: "error", text: copy.invalid })
      return
    }
    setNotice(null)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  async function saveWorkspace() {
    if (!user) return
    const issues = validateReportIntake(intake)
    if (issues.length) {
      setNotice({ type: "error", text: issues.includes("privacyConsent") ? copy.needConsent : copy.invalid })
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
    setSaved(true)
    setNotice({ type: "success", text: copy.saved })
  }

  const completeOptionCount = options.filter(isDecisionOptionComplete).length
  const activeStep = steps[step]
  const ActiveIcon = activeStep.icon

  if (loading) return <section className="mx-auto max-w-4xl px-6 py-10 sm:px-10"><div className="animate-pulse"><div className="h-3 w-36 rounded bg-slate-200" /><div className="mt-5 h-10 max-w-lg rounded bg-slate-200" /><div className="mt-12 h-48 max-w-2xl rounded bg-slate-100" /></div></section>
  if (!user) return <section className="mx-auto max-w-2xl px-6 py-12 sm:px-10"><div className="rounded-3xl border border-slate-200 bg-white p-7"><LockKeyhole className="size-6 text-blue-700" /><h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{isKo ? "리포트 브리프를 저장하려면 로그인하세요" : "Sign in to save your report brief"}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{isKo ? "후보, 예산, 영어 목표를 계정에 연결한 뒤 개인화 ROI 리포트 브리프를 준비할 수 있어요." : "Connect your shortlist, budget and English goal to your account, then prepare a personalised ROI report brief."}</p><Link href={`${localizePath("/login", routeLocale)}?next=${encodeURIComponent(localizePath("/report", routeLocale))}`} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800">{isKo ? "로그인하고 계속하기" : "Sign in to continue"}</Link></div></section>

  return <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-10 sm:pt-10" data-report-wizard>
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">{copy.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{copy.description}</p>
      {importedFromPlan && <p className="mt-5 border-l-2 border-violet-300 pl-3 text-sm leading-6 text-violet-900"><Sparkles className="mr-1.5 inline size-4 text-violet-600" />{copy.imported}</p>}
    </header>

    <div className="mt-10 max-w-2xl">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[.12em] text-slate-500"><span>{copy.progress}</span><span>{step + 1} / {steps.length}</span></div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
    </div>

    <section className="mt-10 max-w-2xl" aria-live="polite">
      <div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700"><ActiveIcon className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{copy.progress} {step + 1}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{activeStep.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{activeStep.detail}</p></div></div>

      <div key={activeStep.key} className="tl-stage mt-10">
        {step === 0 && <DirectionStep intake={intake} copy={copy} isKo={isKo} onUpdate={updateIntake} />}
        {step === 1 && <BudgetStep intake={intake} copy={copy} isKo={isKo} onUpdate={updateIntake} />}
        {step === 2 && <BackgroundStep intake={intake} copy={copy} isKo={isKo} onUpdate={updateIntake} />}
        {step === 3 && <PreferencesStep intake={intake} copy={copy} isKo={isKo} onUpdate={updateIntake} />}
        {step === 4 && <ShortlistStep options={options} savedUniversities={savedUniversities} savedCourses={savedCourses} copy={copy} isKo={isKo} onUpdate={updateOption} onClear={clearOption} onUseSaved={insertSavedChoice} />}
        {step === 5 && <ReviewStep intake={intake} options={options} copy={copy} onUpdate={updateIntake} />}
      </div>
    </section>

    <footer className="mt-12 flex max-w-2xl flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
      <button type="button" onClick={() => { setNotice(null); setStep((current) => Math.max(current - 1, 0)) }} disabled={step === 0 || saving} className="inline-flex min-h-10 items-center gap-2 px-1 text-sm font-semibold text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-0"><ArrowLeft className="size-4" />{copy.back}</button>
      {step < steps.length - 1 ? <button type="button" onClick={goForward} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">{copy.next}<ArrowRight className="size-4" /></button> : <button type="button" onClick={() => void saveWorkspace()} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70">{saving ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}{saving ? copy.saving : copy.save}</button>}
    </footer>
    {notice && <p role="status" className={cn("mt-4 flex max-w-2xl items-center gap-2 text-sm", notice.type === "success" ? "text-emerald-700" : "text-rose-700")}>{notice.type === "success" ? <Check className="size-4" /> : <CircleAlert className="size-4" />}{notice.text}</p>}

    <aside className="mt-14 max-w-2xl border-t border-slate-200 pt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">{copy.price}</p><p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{personalReport ? formatAud(personalReport.amountAudCents) : "A$59"}</p></div>{personalReport?.upgrade && <p className="text-xs font-medium text-violet-700">{copy.upgrade}</p>}</div>
      <p className="mt-5 flex gap-2 text-sm leading-6 text-slate-700"><LockKeyhole className="mt-1 size-4 shrink-0 text-amber-700" /><span><strong>{saved ? copy.savedReady : copy.notOpen}</strong><span className="mt-1 block text-slate-500">{copy.notOpenDetail}</span></span></p>
      <div className="mt-7 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-[minmax(0,1fr)_auto]"><div><p className="text-sm font-semibold text-slate-950">{copy.includes}</p><ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600">{copy.contents.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></div><p className="text-right text-xs text-slate-400">{completeOptionCount}/3 {isKo ? "후보 선택" : "options selected"}</p></div>
    </aside>

    <div className="max-w-2xl">
      <ReportList />
    </div>
  </section>
}

type Copy = Record<string, string | string[]>
type IntakeUpdater = <K extends keyof ReportIntakeDraft>(key: K, value: ReportIntakeDraft[K]) => void

function DirectionStep({ intake, copy, isKo, onUpdate }: { intake: ReportIntakeDraft; copy: Copy; isKo: boolean; onUpdate: IntakeUpdater }) {
  return <div className="space-y-7"><Field label={text(copy, "occupation")}><input value={intake.targetOccupation} onChange={(event) => onUpdate("targetOccupation", event.target.value)} placeholder={text(copy, "occupationPlaceholder")} className={inputClass} /></Field><Field label={text(copy, "goal")}><select value={intake.postStudyGoal} onChange={(event) => onUpdate("postStudyGoal", event.target.value as ReportIntakeDraft["postStudyGoal"])} className={inputClass}><option value="not_sure">{isKo ? "아직 모르겠어요" : "Not sure yet"}</option><option value="australian_employment">{isKo ? "호주 취업" : "Work in Australia"}</option><option value="return_home">{isKo ? "학업 후 귀국" : "Return home after study"}</option><option value="open_to_both">{isKo ? "둘 다 열어두기" : "Open to both"}</option></select></Field><Field label={text(copy, "english")}><select value={intake.englishLevel} onChange={(event) => onUpdate("englishLevel", event.target.value as ReportIntakeDraft["englishLevel"])} className={inputClass}><option value="not_sure">{isKo ? "아직 모르겠어요" : "Not sure yet"}</option><option value="beginner">{isKo ? "초급" : "Beginner"}</option><option value="intermediate">{isKo ? "중급" : "Intermediate"}</option><option value="upper_intermediate">{isKo ? "중상급" : "Upper intermediate"}</option><option value="advanced">{isKo ? "고급" : "Advanced"}</option><option value="ielts">IELTS</option><option value="pte">PTE</option><option value="toefl">TOEFL</option></select></Field></div>
}

function BudgetStep({ intake, copy, isKo, onUpdate }: { intake: ReportIntakeDraft; copy: Copy; isKo: boolean; onUpdate: IntakeUpdater }) {
  return <div className="grid gap-7 sm:grid-cols-2"><Field label={text(copy, "budgetLabel")}><input inputMode="decimal" value={intake.maximumBudgetAud} onChange={(event) => onUpdate("maximumBudgetAud", event.target.value)} placeholder="85000" className={inputClass} /></Field><Field label={text(copy, "scholarship")}><input inputMode="decimal" value={intake.expectedScholarshipAud} onChange={(event) => onUpdate("expectedScholarshipAud", event.target.value)} placeholder="5000" className={inputClass} /></Field><Field label={text(copy, "payback")}><input inputMode="numeric" value={intake.desiredPaybackYears} onChange={(event) => onUpdate("desiredPaybackYears", event.target.value)} placeholder="5" className={inputClass} /></Field><Field label={text(copy, "risk")}><select value={intake.riskTolerance} onChange={(event) => onUpdate("riskTolerance", event.target.value as ReportIntakeDraft["riskTolerance"])} className={inputClass}><option value="low">{isKo ? "낮음" : "Low"}</option><option value="balanced">{isKo ? "균형" : "Balanced"}</option><option value="high">{isKo ? "높음" : "High"}</option></select></Field></div>
}

function BackgroundStep({ intake, copy, isKo, onUpdate }: { intake: ReportIntakeDraft; copy: Copy; isKo: boolean; onUpdate: IntakeUpdater }) {
  return <div className="space-y-7"><Field label={text(copy, "age")}><input inputMode="numeric" value={intake.age} onChange={(event) => onUpdate("age", event.target.value)} placeholder="28" className={inputClass} /></Field><Field label={text(copy, "education")} hint={text(copy, "educationHint")}><textarea value={intake.educationWorkHistory} onChange={(event) => onUpdate("educationWorkHistory", event.target.value)} rows={4} className={inputClass} /></Field><Field label={text(copy, "family")}><select value={intake.familyAccompaniment} onChange={(event) => onUpdate("familyAccompaniment", event.target.value as ReportIntakeDraft["familyAccompaniment"])} className={inputClass}><option value="not_sure">{isKo ? "아직 모르겠어요" : "Not sure yet"}</option><option value="no">{isKo ? "동반 없음" : "No accompanying family"}</option><option value="partner">{isKo ? "배우자" : "Partner"}</option><option value="children">{isKo ? "자녀" : "Children"}</option><option value="partner_and_children">{isKo ? "배우자와 자녀" : "Partner and children"}</option></select></Field></div>
}

function PreferencesStep({ intake, copy, isKo, onUpdate }: { intake: ReportIntakeDraft; copy: Copy; isKo: boolean; onUpdate: IntakeUpdater }) {
  return <div className="space-y-7"><Field label={text(copy, "location")}><select value={intake.locationPreference} onChange={(event) => onUpdate("locationPreference", event.target.value as ReportIntakeDraft["locationPreference"])} className={inputClass}><option value="open">{isKo ? "모두 열어두기" : "Open to both"}</option><option value="metro">{isKo ? "대도시" : "Metro"}</option><option value="regional">{isKo ? "지역도시" : "Regional"}</option></select></Field><Field label={text(copy, "cities")} hint={text(copy, "citiesHint")}><input value={intake.preferredCities} onChange={(event) => onUpdate("preferredCities", event.target.value)} className={inputClass} /></Field><Field label={text(copy, "language")}><select value={intake.reportLanguage} onChange={(event) => onUpdate("reportLanguage", event.target.value as ReportIntakeDraft["reportLanguage"])} className={inputClass}><option value="ko">한국어</option><option value="en">English</option></select></Field></div>
}

function ShortlistStep({ options, savedUniversities, savedCourses, copy, isKo, onUpdate, onClear, onUseSaved }: { options: DecisionOptionDraft[]; savedUniversities: SavedUniversity[]; savedCourses: SavedCourse[]; copy: Copy; isKo: boolean; onUpdate: <K extends keyof DecisionOptionDraft>(position: 1 | 2 | 3, key: K, value: DecisionOptionDraft[K]) => void; onClear: (position: 1 | 2 | 3) => void; onUseSaved: (choice: SavedUniversity | SavedCourse, kind: "saved_university" | "saved_course", position: 1 | 2 | 3) => void }) {
  const [activePosition, setActivePosition] = useState<1 | 2 | 3>(1)
  const activeOption = options.find((option) => option.position === activePosition) ?? emptyDecisionOption(activePosition)
  const choices = [...savedUniversities.map((item) => ({ item, kind: "saved_university" as const, label: item.univ_name })), ...savedCourses.map((item) => ({ item, kind: "saved_course" as const, label: item.course_name }))]
  return <div><div className="flex gap-2" role="tablist" aria-label={text(copy, "option")}>
    {options.map((option) => <button key={option.position} type="button" role="tab" aria-selected={activePosition === option.position} onClick={() => setActivePosition(option.position)} className={cn("min-w-12 border-b-2 px-1 pb-2 text-sm font-semibold transition", activePosition === option.position ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400 hover:text-slate-700")}>{text(copy, "option")} {String.fromCharCode(64 + option.position)}{isDecisionOptionComplete(option) && <Check className="ml-1 inline size-3.5" />}</button>)}
  </div><div className="mt-7 border-l-2 border-slate-200 pl-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-950">{text(copy, "option")} {String.fromCharCode(64 + activePosition)}</p>{isDecisionOptionComplete(activeOption) && <button type="button" onClick={() => onClear(activePosition)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-rose-700"><X className="size-3.5" />{text(copy, "clear")}</button>}</div>{choices.length > 0 ? <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{text(copy, "savedChoices")}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{choices.map(({ item, kind, label }) => <button key={`${kind}-${item.id}`} type="button" onClick={() => onUseSaved(item, kind, activePosition)} className="max-w-full border-b border-blue-200 pb-0.5 text-left text-xs font-semibold text-blue-700 transition hover:border-blue-500 hover:text-blue-900">{label}</button>)}</div></div> : <p className="mt-5 text-xs leading-5 text-slate-500">{text(copy, "noSaved")}</p>}<div className="mt-7 grid gap-6 sm:grid-cols-2"><Field label={text(copy, "optionName")} className="sm:col-span-2"><input value={activeOption.title} onChange={(event) => onUpdate(activePosition, "title", event.target.value)} className={inputClass} /></Field><Field label={text(copy, "provider")}><input value={activeOption.providerName} onChange={(event) => onUpdate(activePosition, "providerName", event.target.value)} className={inputClass} /></Field><Field label={text(copy, "field")}><input value={activeOption.fieldName} onChange={(event) => onUpdate(activePosition, "fieldName", event.target.value)} className={inputClass} /></Field><Field label={text(copy, "city")}><input value={activeOption.city} onChange={(event) => onUpdate(activePosition, "city", event.target.value)} className={inputClass} /></Field><Field label={text(copy, "state")}><input value={activeOption.stateOrTerritory} onChange={(event) => onUpdate(activePosition, "stateOrTerritory", event.target.value)} className={inputClass} /></Field><Field label={text(copy, "level")}><input value={activeOption.studyLevel} onChange={(event) => onUpdate(activePosition, "studyLevel", event.target.value)} placeholder={isKo ? "예: Bachelor, Master, VET" : "For example: Bachelor, Master, VET"} className={inputClass} /></Field><Field label={text(copy, "optionNotes")} className="sm:col-span-2"><textarea value={activeOption.notes} onChange={(event) => onUpdate(activePosition, "notes", event.target.value)} rows={3} className={inputClass} /></Field></div></div></div>
}

function ReviewStep({ intake, options, copy, onUpdate }: { intake: ReportIntakeDraft; options: DecisionOptionDraft[]; copy: Copy; onUpdate: IntakeUpdater }) {
  const summary = [
    intake.targetOccupation || "—",
    intake.maximumBudgetAud ? `A$${Number(intake.maximumBudgetAud).toLocaleString()}` : "—",
    intake.preferredCities || "—",
  ]
  return <div><div className="border-l-2 border-blue-200 pl-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{text(copy, "summary")}</p><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">{summary.map((value, index) => <div key={index}><dt className="text-slate-400">{[text(copy, "occupation"), text(copy, "budgetLabel"), text(copy, "cities")][index]}</dt><dd className="mt-1 font-semibold text-slate-900">{value}</dd></div>)}</dl><div className="mt-6 border-t border-slate-100 pt-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{text(copy, "option")}</p><ul className="mt-3 space-y-2 text-sm text-slate-700">{options.map((option) => <li key={option.position} className="flex gap-2"><span className="font-semibold text-blue-700">{String.fromCharCode(64 + option.position)}</span><span>{option.title || text(copy, "emptyOption")}</span></li>)}</ul></div></div><label className="mt-10 flex cursor-pointer items-start gap-3 border-l-2 border-slate-200 pl-5 text-sm leading-6 text-slate-700"><input type="checkbox" checked={intake.hasPrivacyConsent} onChange={(event) => onUpdate("hasPrivacyConsent", event.target.checked)} className="mt-1 size-4 shrink-0 accent-blue-600" /><span><span className="font-medium text-slate-950">{text(copy, "consent")}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{text(copy, "consentHint")}</span></span></label></div>
}

const inputClass = "min-h-11 w-full border-b border-slate-300 bg-transparent px-0 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600"

function text(copy: Copy, key: string) {
  const value = copy[key]
  return typeof value === "string" ? value : ""
}

function Field({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return <label className={className}><span className="block text-sm font-semibold text-slate-800">{label}</span>{hint && <span className="mt-1 block text-xs leading-5 text-slate-500">{hint}</span>}<span className="mt-2 block">{children}</span></label>
}
