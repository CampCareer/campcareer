import { EMPTY_REPORT_INTAKE, emptyDecisionOption, type DecisionOptionDraft, type ReportIntakeDraft } from "@/lib/report-intake"

export type RoiReportReadiness = {
  completedCount: number
  totalCount: 4
  ready: boolean
  nextHref: "/compare" | "/budget" | "/english"
  checks: Array<{
    id: "career" | "shortlist" | "budget" | "english"
    complete: boolean
    href: "/compare" | "/budget" | "/english"
  }>
}

type RoiReportReadinessInput = {
  targetOccupation: string | null
  shortlistCount: number
  targetAmount: number | null
  currentEnglishScore: number | null
  targetEnglishScore: number | null
}

export function getRoiReportReadiness(input: RoiReportReadinessInput): RoiReportReadiness {
  const checks: RoiReportReadiness["checks"] = [
    { id: "career", complete: Boolean(input.targetOccupation?.trim()), href: "/compare" },
    { id: "shortlist", complete: input.shortlistCount > 0, href: "/compare" },
    { id: "budget", complete: input.targetAmount != null, href: "/budget" },
    { id: "english", complete: input.currentEnglishScore != null && input.targetEnglishScore != null, href: "/english" },
  ]
  const completedCount = checks.filter((check) => check.complete).length
  const firstMissing = checks.find((check) => !check.complete)
  return {
    completedCount,
    totalCount: 4,
    ready: completedCount === checks.length,
    nextHref: firstMissing?.href ?? "/compare",
    checks,
  }
}

type PlanGoalProfileForReport = { target_occupation_title: string }
type PlanGoalOptionForReport = {
  position: number
  source_type: "saved_university" | "saved_course"
  source_reference: string
  title: string
  provider_name: string
  field_name: string
}
type PlanBudgetForReport = { target_amount: number | string | null }
type PlanMoneyScenarioForReport = { scholarship_amount: number | string | null }
type PlanLanguageForReport = { exam_name: string }

export type MyPlanReportDraftInput = {
  profile: PlanGoalProfileForReport | null
  options: PlanGoalOptionForReport[]
  budget: PlanBudgetForReport | null
  moneyScenario: PlanMoneyScenarioForReport | null
  language: PlanLanguageForReport | null
  reportLanguage: ReportIntakeDraft["reportLanguage"]
}

export function createReportDraftFromMyPlan(input: MyPlanReportDraftInput): { intake: ReportIntakeDraft; options: DecisionOptionDraft[]; hasImportedData: boolean } {
  const maximumBudget = numericText(input.budget?.target_amount)
  const scholarship = numericText(input.moneyScenario?.scholarship_amount)
  const targetOccupation = input.profile?.target_occupation_title?.trim() ?? ""
  const reportOptions = [1, 2, 3].map((position) => {
    const source = input.options.find((option) => option.position === position)
    if (!source) return emptyDecisionOption(position as 1 | 2 | 3)
    return {
      position: position as 1 | 2 | 3,
      sourceType: source.source_type,
      sourceReference: source.source_reference,
      title: source.title,
      providerName: source.provider_name,
      city: "",
      stateOrTerritory: "",
      fieldName: source.field_name,
      studyLevel: "",
      notes: "",
    }
  })
  const intake: ReportIntakeDraft = {
    ...EMPTY_REPORT_INTAKE,
    reportLanguage: input.reportLanguage,
    targetOccupation,
    maximumBudgetAud: maximumBudget,
    expectedScholarshipAud: scholarship,
    englishLevel: reportEnglishLevel(input.language?.exam_name ?? ""),
  }
  const hasImportedData = Boolean(targetOccupation || maximumBudget || scholarship || reportOptions.some((option) => option.title))
  return { intake, options: reportOptions, hasImportedData }
}

function numericText(value: number | string | null | undefined) {
  if (value == null || value === "") return ""
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? String(numeric) : ""
}

function reportEnglishLevel(examName: string): ReportIntakeDraft["englishLevel"] {
  const name = examName.trim().toLowerCase()
  if (name.includes("ielts")) return "ielts"
  if (name.includes("pte")) return "pte"
  if (name.includes("toefl")) return "toefl"
  return "not_sure"
}
