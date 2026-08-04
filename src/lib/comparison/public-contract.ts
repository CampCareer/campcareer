import { CANONICAL_CAREERS, getCanonicalCareer, type CanonicalCareer } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES, type LaunchCountry } from "@/data/launch-countries"

export const DECISION_CAREER_IDS = [
  "registered-nurse",
  "software-developer",
  "accountant",
  "civil-engineer",
  "mechanical-engineer",
  "early-childhood-teacher",
  "carpenter",
  "electrician",
  "plumber",
  "welder",
  "chef",
  "automotive-service-technician",
] as const

export type DecisionCareerId = (typeof DECISION_CAREER_IDS)[number]
export type ComparisonReadiness = "decision_ready" | "discovery" | "review_required"
export type EvidenceStatus = "verified" | "needs_review" | "unavailable"
export type MigrationStatus = "eligible" | "conditional" | "not_eligible" | "unknown"

export type EvidenceReference = {
  sourceName: string
  sourceUrl: string
  asOf: string
  lastVerifiedAt: string
  status: EvidenceStatus
}

export type MoneyMetric = {
  amount: number
  currency: string
  basis: string
}

export type FinancialOutcome = {
  status: EvidenceStatus
  grossAnnual?: MoneyMetric
  incomeTaxAndContributions?: MoneyMetric
  takeHomeAnnual?: MoneyMetric
  monthlyRent?: MoneyMetric
  monthlyEssentials?: MoneyMetric
  annualDisposable?: MoneyMetric
  firstYearBudget?: MoneyMetric
  totalStudyCost?: MoneyMetric
  paybackYears?: number
  assumptions: string[]
  reason?: string
}

export type ImmigrationOutcome = {
  status: MigrationStatus
  reason: string
  postStudyWork?: string
  occupationMatch?: "exact" | "related" | "unavailable"
  salaryThreshold?: string
  licenceOrLanguage?: string
  policyAsOf?: string
}

export type StudentHousing = "shared" | "studio" | "one_bedroom"
export type GraduateHousing = "shared" | "outer_one_bedroom" | "city_one_bedroom"

/**
 * Inputs that materially change a future calculation. They are serialized in
 * the share URL now, even when a country-career evidence bundle is not yet
 * publishable, so an unavailable result can never silently fall back to a
 * different user's assumptions.
 */
export type ComparisonScenario = {
  degreeYears: number
  annualTuition?: MoneyMetric
  studentHousing: StudentHousing
  graduateHousing: GraduateHousing
  taxHousehold: "single_no_dependants"
}

export type ComparisonIntent = {
  budgetBand?: "under-30000" | "30000-50000" | "50000-75000" | "75000-100000" | "100000-plus"
  goal?: "career-outcomes" | "lower-first-year-cost" | "work-and-immigration"
}

export type PublicCountryComparison = {
  country: Pick<LaunchCountry, "code" | "slug" | "name" | "currency" | "mapReady">
  readiness: ComparisonReadiness
  financial: FinancialOutcome
  immigration: ImmigrationOutcome
  evidence: EvidenceReference[]
}

export type PublicComparisonData = {
  career: Pick<CanonicalCareer, "id" | "label" | "labelKo" | "categoryId">
  origin?: string
  city?: string
  displayCurrency: string
  scenario: ComparisonScenario
  intent?: ComparisonIntent
  comparisons: PublicCountryComparison[]
}

export type PublicComparisonResponse = {
  /** Stable v1 response body; all product data lives here. */
  data: PublicComparisonData
  /** Evidence shared by the requested comparison, separate from per-country cells. */
  evidence: EvidenceReference[]
  readiness: ComparisonReadiness
  dataVersion: string
  methodologyVersion: string
  generatedAt: string
}

const MAJOR_TO_CAREER: Record<string, DecisionCareerId> = {
  "computer-science": "software-developer",
  nursing: "registered-nurse",
  accounting: "accountant",
  "civil-engineering": "civil-engineer",
  "mechanical-engineering": "mechanical-engineer",
  "early-childhood-education": "early-childhood-teacher",
  carpentry: "carpenter",
  "electrical-trade": "electrician",
  plumbing: "plumber",
  welding: "welder",
  "hospitality-management": "chef",
  "automotive-technology": "automotive-service-technician",
}

export function getDecisionCareers(): CanonicalCareer[] {
  return DECISION_CAREER_IDS.map((id) => getCanonicalCareer(id)).filter((career): career is CanonicalCareer => Boolean(career))
}

export function resolveDecisionCareer(value: string | null, major: string | null): CanonicalCareer | null {
  const fromCareer = value ? getCanonicalCareer(value) : null
  if (fromCareer && DECISION_CAREER_IDS.includes(fromCareer.id as DecisionCareerId)) return fromCareer
  const mappedId = major ? MAJOR_TO_CAREER[major] : undefined
  return mappedId ? getCanonicalCareer(mappedId) : null
}

/** A direct comparison may be opened for any canonical career. Decision-ready
 * publication is evaluated per country later; never replace an unsupported
 * visitor choice with a different default career. */
export function resolvePublicCareer(value: string | null, major: string | null): CanonicalCareer | null {
  const fromCareer = value ? getCanonicalCareer(value) : null
  if (fromCareer) return fromCareer
  const mappedId = major ? MAJOR_TO_CAREER[major] : undefined
  return mappedId ? getCanonicalCareer(mappedId) : null
}

import { toProductCountryCode } from "@/lib/data-foundation/entity-aliases"

export function resolveLaunchCountries(values: string[]): LaunchCountry[] {
  const requested = new Set(values
    .map((value) => toProductCountryCode(value.trim()) ?? value.trim().toUpperCase())
    .filter(Boolean),
  )
  return LAUNCH_COUNTRIES.filter((country) => requested.has(country.code)).slice(0, 4) as LaunchCountry[]
}

export function defaultDecisionCareer(): CanonicalCareer {
  return getDecisionCareers()[0] ?? CANONICAL_CAREERS[0]
}

export function parseComparisonScenario(input: {
  degreeYears: string | null
  annualTuition: string | null
  currency: string
  studentHousing: string | null
  graduateHousing: string | null
}): ComparisonScenario {
  const parsedYears = Number(input.degreeYears)
  const degreeYears = Number.isFinite(parsedYears) && parsedYears >= 1 && parsedYears <= 8
    ? Math.round(parsedYears * 10) / 10
    : 2
  const parsedTuition = Number(input.annualTuition)
  const annualTuition = Number.isFinite(parsedTuition) && parsedTuition > 0 && parsedTuition <= 1_000_000
    ? { amount: Math.round(parsedTuition), currency: input.currency, basis: "annual tuition entered by visitor" }
    : undefined
  const studentHousing: StudentHousing = input.studentHousing === "studio" || input.studentHousing === "one_bedroom"
    ? input.studentHousing
    : "shared"
  const graduateHousing: GraduateHousing = input.graduateHousing === "shared" || input.graduateHousing === "city_one_bedroom"
    ? input.graduateHousing
    : "outer_one_bedroom"

  return {
    degreeYears,
    ...(annualTuition ? { annualTuition } : {}),
    studentHousing,
    graduateHousing,
    taxHousehold: "single_no_dependants",
  }
}
