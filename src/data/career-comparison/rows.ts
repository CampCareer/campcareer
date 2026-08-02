import {
  CAREER_COMPARE_MISSING_VALUE,
  type AustraliaCareerComparison,
  type CareerCompareId,
  type RegistrationValue,
} from "./australia"
import type { DurationValue, MoneyValue, TextValue } from "@/data/country-comparison/contracts"

export type CareerComparisonDisplayValue = {
  primary: string
  secondary?: string
}

export type CareerComparisonRowSection = "Pathway" | "Study cost" | "Career outcome" | "Time" | "Source"

export type CareerComparisonFieldKey =
  | "typicalEducationRoute"
  | "typicalEntryQualification"
  | "studyDuration"
  | "qualificationOutcome"
  | "registrationRequirement"
  | "registrationAuthority"
  | "annualTuition"
  | "estimatedTotalTuition"
  | "mandatoryStudyCosts"
  | "startingIncome"
  | "typicalEarnings"
  | "incomeBasis"
  | "employmentOutlook"
  | "shortageStatus"
  | "geographicScope"
  | "timeToProfessionalEntry"
  | "registrationOrOnboardingTime"
  | "officialSources"
  | "reviewed"

type CareerComparisonValue = MoneyValue | DurationValue | TextValue | RegistrationValue | readonly string[] | string | null

export type CareerComparisonRowDefinition = {
  key: CareerComparisonFieldKey
  section: CareerComparisonRowSection
  label: string
  getValue: (career: AustraliaCareerComparison) => CareerComparisonValue
  format: (value: CareerComparisonValue) => CareerComparisonDisplayValue
}

export type CareerComparisonRow = CareerComparisonRowDefinition & {
  values: readonly (CareerComparisonDisplayValue & { careerId: CareerCompareId })[]
}

function formatMoney(value: MoneyValue): CareerComparisonDisplayValue {
  if (value.amount !== null) return { primary: `${value.currency ?? ""}${value.amount.toLocaleString("en-AU")}`.trim() }
  if (value.min !== null || value.max !== null) {
    const min = value.min === null ? "" : `${value.currency ?? ""}${value.min.toLocaleString("en-AU")}`
    const max = value.max === null ? "" : `${value.currency ?? ""}${value.max.toLocaleString("en-AU")}`
    return { primary: `${min}–${max}` }
  }
  return { primary: CAREER_COMPARE_MISSING_VALUE }
}

function formatDuration(value: DurationValue): CareerComparisonDisplayValue {
  if (value.value !== null) return { primary: `${value.value} ${value.unit ?? ""}`.trim() }
  if (value.min !== null || value.max !== null) return { primary: `${value.min ?? ""}–${value.max ?? ""} ${value.unit ?? ""}`.trim() }
  return { primary: CAREER_COMPARE_MISSING_VALUE }
}

function formatText(value: TextValue | null): CareerComparisonDisplayValue {
  return { primary: value?.value?.trim() || CAREER_COMPARE_MISSING_VALUE }
}

function formatRegistration(value: RegistrationValue): CareerComparisonDisplayValue {
  return { primary: value?.value || CAREER_COMPARE_MISSING_VALUE }
}

function formatValue(value: CareerComparisonValue): CareerComparisonDisplayValue {
  if (value === null) return { primary: CAREER_COMPARE_MISSING_VALUE }
  if (Array.isArray(value)) return { primary: value.length ? value.join(", ") : CAREER_COMPARE_MISSING_VALUE }
  if (typeof value === "string") return { primary: value || CAREER_COMPARE_MISSING_VALUE }
  if ("amount" in value) return formatMoney(value)
  if ("unit" in value) return formatDuration(value)
  if ("valueType" in value) return formatText(value)
  return formatRegistration(value as NonNullable<RegistrationValue>)
}

const row = (
  key: CareerComparisonFieldKey,
  section: CareerComparisonRowSection,
  label: string,
  getValue: (career: AustraliaCareerComparison) => CareerComparisonValue,
): CareerComparisonRowDefinition => ({ key, section, label, getValue, format: formatValue })

export const CAREER_COMPARISON_ROW_DEFINITIONS: readonly CareerComparisonRowDefinition[] = [
  row("typicalEducationRoute", "Pathway", "Typical education route", (career) => career.pathway.typicalEducationRoute),
  row("typicalEntryQualification", "Pathway", "Typical entry qualification", (career) => career.pathway.typicalEntryQualification),
  row("studyDuration", "Pathway", "Study duration", (career) => career.pathway.studyDuration),
  row("qualificationOutcome", "Pathway", "Qualification outcome", (career) => career.pathway.qualificationOutcome),
  row("registrationRequirement", "Pathway", "Professional registration", (career) => career.registration.requirement),
  row("registrationAuthority", "Pathway", "Registration authority", (career) => career.registration.authority),
  row("annualTuition", "Study cost", "Annual international tuition", (career) => career.studyCost.annualTuition),
  row("estimatedTotalTuition", "Study cost", "Estimated total tuition", (career) => career.studyCost.estimatedTotalTuition),
  row("mandatoryStudyCosts", "Study cost", "Mandatory study costs", (career) => career.studyCost.mandatoryStudyCosts),
  row("startingIncome", "Career outcome", "Starting income", (career) => career.outcome.startingIncome),
  row("typicalEarnings", "Career outcome", "Typical earnings", (career) => career.outcome.typicalEarnings),
  row("incomeBasis", "Career outcome", "Income basis", (career) => career.outcome.incomeBasis),
  row("employmentOutlook", "Career outcome", "Employment outlook", (career) => career.outcome.employmentOutlook),
  row("shortageStatus", "Career outcome", "Shortage or demand status", (career) => career.outcome.shortageStatus),
  row("geographicScope", "Career outcome", "Geographic scope", (career) => career.outcome.geographicScope),
  row("timeToProfessionalEntry", "Time", "Time to professional entry", (career) => career.time.timeToProfessionalEntry),
  row("registrationOrOnboardingTime", "Time", "Registration or onboarding time", (career) => career.time.registrationOrOnboardingTime),
  row("officialSources", "Source", "Official sources", (career) => career.sourceIds),
  row("reviewed", "Source", "Reviewed", (career) => career.reviewedAt),
]

export function getCareerComparisonRows(careers: readonly AustraliaCareerComparison[]): readonly CareerComparisonRow[] {
  return CAREER_COMPARISON_ROW_DEFINITIONS.map((definition) => ({
    ...definition,
    values: careers.map((career) => ({
      careerId: career.id,
      ...definition.format(definition.getValue(career)),
    })),
  }))
}

export function getCareerRowsBySection(careers: readonly AustraliaCareerComparison[]) {
  const rows = getCareerComparisonRows(careers)
  return ["Pathway", "Study cost", "Career outcome", "Time", "Source"].map((section) => ({
    section: section as CareerComparisonRowSection,
    rows: rows.filter((row) => row.section === section),
  }))
}
