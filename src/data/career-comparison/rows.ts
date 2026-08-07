import {
  CAREER_COMPARE_MISSING_VALUE,
  type AustraliaCareerComparison,
  type CareerCompareId,
  type RegistrationValue,
} from "./australia"
import type { TextValue } from "@/data/country-comparison/contracts"

export type CareerComparisonDisplayValue = {
  primary: string
  secondary?: string
}

export type CareerComparisonRowSection = "Key metrics" | "Entry & requirements" | "Outcomes" | "Other details"

export type CareerComparisonFieldKey =
  | "opportunityScore"
  | "annualisedMedianSalary"
  | "medianWeeklyEarnings"
  | "employmentTotal"
  | "vacanciesThreeMonthAvg"
  | "typicalEducationRoute"
  | "registrationRequirement"
  | "registrationAuthority"
  | "registrationProcess"
  | "employmentGrowth5yPct"
  | "employmentGrowth10yPct"
  | "vacancyYoyPct"
  | "shortageStatus"
  | "employmentOutlook"
  | "officialClassification"
  | "publicationStatus"
  | "scoreStatus"
  | "officialSources"
  | "reviewed"

type CareerComparisonValue = TextValue | RegistrationValue | readonly string[] | string | number | null

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

const missing = (): CareerComparisonDisplayValue => ({ primary: CAREER_COMPARE_MISSING_VALUE })

function formatText(value: CareerComparisonValue): CareerComparisonDisplayValue {
  if (value === null) return missing()
  if (Array.isArray(value)) return { primary: value.length ? value.join(", ") : CAREER_COMPARE_MISSING_VALUE }
  if (typeof value === "string") return { primary: value.trim() || CAREER_COMPARE_MISSING_VALUE }
  if (typeof value === "number") return { primary: value.toLocaleString("en-AU") }
  if ("valueType" in value) return { primary: value.value?.trim() || CAREER_COMPARE_MISSING_VALUE }
  const registration = value as NonNullable<RegistrationValue>
  if (!registration.value) return missing()
  const labels = {
    required: "Required",
    "not-required": "Not required",
    conditional: "Conditional",
    unknown: "Unknown",
  } as const
  return { primary: labels[registration.value] }
}

function formatInteger(value: CareerComparisonValue): CareerComparisonDisplayValue {
  return typeof value === "number" && Number.isFinite(value)
    ? { primary: Math.round(value).toLocaleString("en-AU") }
    : missing()
}

function formatAud(value: CareerComparisonValue): CareerComparisonDisplayValue {
  return typeof value === "number" && Number.isFinite(value)
    ? { primary: `AUD ${Math.round(value).toLocaleString("en-AU")}` }
    : missing()
}

function formatPercent(value: CareerComparisonValue): CareerComparisonDisplayValue {
  if (typeof value !== "number" || !Number.isFinite(value)) return missing()
  const sign = value > 0 ? "+" : ""
  return { primary: `${sign}${value.toFixed(1)}%` }
}

function formatScore(value: CareerComparisonValue): CareerComparisonDisplayValue {
  return typeof value === "number" && Number.isFinite(value)
    ? { primary: `${Math.round(value)}/100` }
    : missing()
}

function titleCaseStatus(value: CareerComparisonValue): CareerComparisonDisplayValue {
  if (typeof value !== "string" || !value.trim()) return missing()
  return { primary: value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) }
}

const row = (
  key: CareerComparisonFieldKey,
  section: CareerComparisonRowSection,
  label: string,
  getValue: (career: AustraliaCareerComparison) => CareerComparisonValue,
  format: CareerComparisonRowDefinition["format"] = formatText,
): CareerComparisonRowDefinition => ({ key, section, label, getValue, format })

export const CAREER_COMPARISON_ROW_DEFINITIONS: readonly CareerComparisonRowDefinition[] = [
  row("opportunityScore", "Key metrics", "Opportunity score", (career) => career.snapshot.opportunityScore, formatScore),
  row("annualisedMedianSalary", "Key metrics", "Annualised median earnings", (career) => career.snapshot.annualisedMedianSalary, formatAud),
  row("medianWeeklyEarnings", "Key metrics", "Median weekly earnings", (career) => career.snapshot.medianWeeklyEarnings, formatAud),
  row("employmentTotal", "Key metrics", "Employment", (career) => career.snapshot.employmentTotal, formatInteger),
  row("vacanciesThreeMonthAvg", "Key metrics", "Vacancies · 3-month average", (career) => career.snapshot.vacanciesThreeMonthAvg, formatInteger),

  row("typicalEducationRoute", "Entry & requirements", "Typical entry route", (career) => career.pathway.typicalEducationRoute),
  row("registrationRequirement", "Entry & requirements", "Registration / licence required", (career) => career.registration.requirement),
  row("registrationAuthority", "Entry & requirements", "Registration authority", (career) => career.registration.authority),
  row("registrationProcess", "Entry & requirements", "Registration / licensing", (career) => career.registration.process),

  row("employmentGrowth5yPct", "Outcomes", "Employment growth · 5 years", (career) => career.snapshot.employmentGrowth5yPct, formatPercent),
  row("employmentGrowth10yPct", "Outcomes", "Employment growth · 10 years", (career) => career.snapshot.employmentGrowth10yPct, formatPercent),
  row("vacancyYoyPct", "Outcomes", "Vacancy trend · year on year", (career) => career.snapshot.vacancyYoyPct, formatPercent),
  row("shortageStatus", "Outcomes", "Shortage evidence", (career) => career.outcome.shortageStatus),
  row("employmentOutlook", "Outcomes", "Job market", (career) => career.outcome.employmentOutlook),

  row("officialClassification", "Other details", "Official classification", (career) => {
    const mapping = career.codeMappings[0]
    return mapping ? `${mapping.system} ${mapping.code} · ${mapping.version}` : null
  }),
  row("publicationStatus", "Other details", "Profile status", (career) => career.snapshot.publicationStatus, titleCaseStatus),
  row("scoreStatus", "Other details", "Score status", (career) => career.snapshot.scoreStatus, titleCaseStatus),
  row("officialSources", "Other details", "Official sources", (career) => career.sources.map((source) => source.label)),
  row("reviewed", "Other details", "Reviewed", (career) => career.reviewedAt),
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
  return ["Key metrics", "Entry & requirements", "Outcomes", "Other details"].map((section) => ({
    section: section as CareerComparisonRowSection,
    rows: rows.filter((row) => row.section === section),
  }))
}
