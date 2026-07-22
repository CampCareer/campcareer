/** Shared, non-sensitive validation for the Australia decision-report intake. */

export type ReportLanguage = "en" | "ko"
export type DecisionOptionSource = "manual" | "saved_university" | "saved_course"

export type ReportIntakeDraft = {
  age: string
  educationWorkHistory: string
  englishLevel: "not_sure" | "beginner" | "intermediate" | "upper_intermediate" | "advanced" | "ielts" | "pte" | "toefl"
  maximumBudgetAud: string
  expectedScholarshipAud: string
  familyAccompaniment: "no" | "partner" | "children" | "partner_and_children" | "not_sure"
  preferredCities: string
  locationPreference: "metro" | "regional" | "open"
  targetOccupation: string
  postStudyGoal: "return_home" | "australian_employment" | "open_to_both" | "not_sure"
  riskTolerance: "low" | "balanced" | "high"
  desiredPaybackYears: string
  reportLanguage: ReportLanguage
  hasPrivacyConsent: boolean
}

export type DecisionOptionDraft = {
  position: 1 | 2 | 3
  sourceType: DecisionOptionSource
  sourceReference: string
  title: string
  providerName: string
  city: string
  stateOrTerritory: string
  fieldName: string
  studyLevel: string
  notes: string
}

export const EMPTY_REPORT_INTAKE: ReportIntakeDraft = {
  age: "",
  educationWorkHistory: "",
  englishLevel: "not_sure",
  maximumBudgetAud: "",
  expectedScholarshipAud: "",
  familyAccompaniment: "not_sure",
  preferredCities: "",
  locationPreference: "open",
  targetOccupation: "",
  postStudyGoal: "not_sure",
  riskTolerance: "balanced",
  desiredPaybackYears: "",
  reportLanguage: "en",
  hasPrivacyConsent: false,
}

export function emptyDecisionOption(position: 1 | 2 | 3): DecisionOptionDraft {
  return {
    position,
    sourceType: "manual",
    sourceReference: "",
    title: "",
    providerName: "",
    city: "",
    stateOrTerritory: "",
    fieldName: "",
    studyLevel: "",
    notes: "",
  }
}

function boundedText(value: string, max: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, max)
}

function optionalMoney(value: string) {
  if (value.includes("-")) return null
  const cleaned = value.replace(/[^0-9.]/g, "")
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) / 100 : null
}

function optionalInteger(value: string) {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

export function preferredCitiesFromText(value: string) {
  return [...new Set(value.split(",").map((city) => boundedText(city, 100)).filter(Boolean))].slice(0, 6)
}

function preferredCityCount(value: string) {
  return new Set(value.split(",").map((city) => boundedText(city, 100)).filter(Boolean)).size
}

export function validateReportIntake(draft: ReportIntakeDraft): string[] {
  const issues: string[] = []
  const age = optionalInteger(draft.age)
  const payback = optionalInteger(draft.desiredPaybackYears)
  const budget = optionalMoney(draft.maximumBudgetAud)
  const scholarship = optionalMoney(draft.expectedScholarshipAud)

  if (draft.age.trim() && (age === null || age < 13 || age > 99)) issues.push("age")
  if (draft.desiredPaybackYears.trim() && (payback === null || payback < 1 || payback > 25)) issues.push("desiredPaybackYears")
  if (draft.maximumBudgetAud.trim() && budget === null) issues.push("maximumBudgetAud")
  if (draft.expectedScholarshipAud.trim() && scholarship === null) issues.push("expectedScholarshipAud")
  if (boundedText(draft.educationWorkHistory, 4001).length > 4000) issues.push("educationWorkHistory")
  if (boundedText(draft.targetOccupation, 161).length > 160) issues.push("targetOccupation")
  if (preferredCityCount(draft.preferredCities) > 6) issues.push("preferredCities")
  if (!draft.hasPrivacyConsent) issues.push("privacyConsent")
  return issues
}

export function toReportIntakeRow(draft: ReportIntakeDraft, userId: string) {
  const age = optionalInteger(draft.age)
  const desiredPaybackYears = optionalInteger(draft.desiredPaybackYears)

  return {
    user_id: userId,
    country: "AU",
    age,
    education_work_history: boundedText(draft.educationWorkHistory, 4000),
    english_level: draft.englishLevel,
    maximum_budget_aud: optionalMoney(draft.maximumBudgetAud),
    expected_scholarship_aud: optionalMoney(draft.expectedScholarshipAud) ?? 0,
    family_accompaniment: draft.familyAccompaniment,
    preferred_cities: preferredCitiesFromText(draft.preferredCities),
    location_preference: draft.locationPreference,
    target_occupation: boundedText(draft.targetOccupation, 160),
    post_study_goal: draft.postStudyGoal,
    risk_tolerance: draft.riskTolerance,
    desired_payback_years: desiredPaybackYears,
    report_language: draft.reportLanguage,
    privacy_consent_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function normaliseDecisionOption(option: DecisionOptionDraft): DecisionOptionDraft {
  return {
    position: option.position,
    sourceType: option.sourceType,
    sourceReference: boundedText(option.sourceReference, 180),
    title: boundedText(option.title, 160),
    providerName: boundedText(option.providerName, 160),
    city: boundedText(option.city, 100),
    stateOrTerritory: boundedText(option.stateOrTerritory, 80),
    fieldName: boundedText(option.fieldName, 160),
    studyLevel: boundedText(option.studyLevel, 100),
    notes: boundedText(option.notes, 1500),
  }
}

export function isDecisionOptionComplete(option: DecisionOptionDraft) {
  return normaliseDecisionOption(option).title.length > 0
}
