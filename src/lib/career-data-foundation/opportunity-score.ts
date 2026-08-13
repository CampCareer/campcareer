import {
  FOUNDATION_COMPONENT_MAXIMA,
  FOUNDATION_FORMULA_VERSION,
  type FoundationAvailability,
  type FoundationComponentKey,
  type FoundationDirectness,
  type FoundationEvidenceStatus,
  type FoundationScoreConfidence,
} from "./types"

export type FoundationScoreInput = {
  componentKey: FoundationComponentKey
  normalizedValue: number | null
  availability: FoundationAvailability
  directness: FoundationDirectness
  evidenceStatus?: FoundationEvidenceStatus
  proxyReason?: string | null
  reason?: string | null
  formulaVersion?: string
}

export type ShortageSeverity = "not_shortage" | "pressure" | "shortage" | "severe" | "critical"
export type ShortageScope = "national" | "broad_subnational" | "regional" | "local"
export type VacancyIntensityBand = "no_evidence" | "low" | "moderate" | "high" | "very_high"
export type VacancySourceQuality =
  | "official_comprehensive"
  | "official_partial"
  | "validated_major_source"
  | "government_job_portal"
  | "large_job_board"
  | "limited_or_unknown_coverage"

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value))

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

const SHORTAGE_BASE_POINTS: Record<ShortageSeverity, number> = {
  not_shortage: 0,
  pressure: 5,
  shortage: 12,
  severe: 18,
  critical: 20,
}

const SHORTAGE_SCOPE_MULTIPLIER: Record<ShortageScope, number> = {
  national: 1,
  broad_subnational: 0.75,
  regional: 0.5,
  local: 0.25,
}

const VACANCY_BASE_POINTS: Record<VacancyIntensityBand, number> = {
  no_evidence: 0,
  low: 3,
  moderate: 6,
  high: 9,
  very_high: 12,
}

const VACANCY_SOURCE_CAP: Record<VacancySourceQuality, number> = {
  official_comprehensive: 15,
  official_partial: 12,
  validated_major_source: 12,
  government_job_portal: 9,
  large_job_board: 9,
  limited_or_unknown_coverage: 6,
}

export function scoreShortageSignal(input: {
  severity?: ShortageSeverity | null
  scope?: ShortageScope | null
  evidenceStatus?: "direct" | "confirmed_not_shortage" | "no_evidence_found"
}) {
  if (input.evidenceStatus === "no_evidence_found") return 0
  if (input.evidenceStatus === "confirmed_not_shortage") return 0
  if (!input.severity || !input.scope) return null
  return round2(clamp(SHORTAGE_BASE_POINTS[input.severity] * SHORTAGE_SCOPE_MULTIPLIER[input.scope], 0, 20))
}

export function scoreVacancyIntensity(input: {
  intensity: VacancyIntensityBand
  persistenceBonus: 0 | 1 | 2 | 3
  sourceQuality: VacancySourceQuality
  hasEmploymentDenominator: boolean
}) {
  const effectiveIntensity = !input.hasEmploymentDenominator && input.intensity === "very_high"
    ? "high"
    : input.intensity
  return round2(Math.min(
    VACANCY_BASE_POINTS[effectiveIntensity] + input.persistenceBonus,
    VACANCY_SOURCE_CAP[input.sourceQuality],
  ))
}

export function scoreIndustryDiversity(input: {
  hhi: number | null
  topIndustrySharePct: number | null
  coveragePct: number | null
  comparableBroadSectors: boolean
}): { score: number; evidenceStatus: "derived" | "insufficient_industry_coverage" } {
  if (!input.comparableBroadSectors || input.coveragePct == null || input.coveragePct < 80 || input.hhi == null) {
    return { score: 0, evidenceStatus: "insufficient_industry_coverage" }
  }
  if ((input.topIndustrySharePct ?? 0) >= 75 || input.hhi >= 0.6) return { score: 0, evidenceStatus: "derived" }
  if (input.hhi >= 0.45) return { score: 1, evidenceStatus: "derived" }
  if (input.hhi >= 0.3) return { score: 2, evidenceStatus: "derived" }
  if (input.hhi >= 0.2) return { score: 3, evidenceStatus: "derived" }
  if (input.hhi >= 0.12) return { score: 4, evidenceStatus: "derived" }
  return { score: 5, evidenceStatus: "derived" }
}

export function scoreVisaAccessibility(input: {
  occupationApplicability: number
  employerDependency: number
  eligibilityBurden: number
  longTermPathway: number
}) {
  return round2(
    clamp(input.occupationApplicability, 0, 3)
      + clamp(input.employerDependency, 0, 3)
      + clamp(input.eligibilityBurden, 0, 2)
      + clamp(input.longTermPathway, 0, 2),
  )
}

export function scoreEntryBurden(input: {
  geographicScopeBurden: number
  legalRequirementBurden: number
  acquisitionDifficultyBurden: number
}) {
  return round2(clamp(
    5
      - clamp(input.geographicScopeBurden, 0, 2)
      - clamp(input.legalRequirementBurden, 0, 1.5)
      - clamp(input.acquisitionDifficultyBurden, 0, 1.5),
    0,
    5,
  ))
}

export function scoreEntryAccessibility(input: {
  educationPoints: number
  relatedExperiencePoints: number
  trainingPoints: number
}) {
  return round2(
    clamp(input.educationPoints, 0, 7)
      + clamp(input.relatedExperiencePoints, 0, 3)
      + clamp(input.trainingPoints, 0, 5),
  )
}

export function scoreFoundationComponent(input: FoundationScoreInput): number | null {
  const formulaVersion = input.formulaVersion ?? FOUNDATION_FORMULA_VERSION
  if (input.availability !== "available" || input.normalizedValue == null) return null
  if (formulaVersion !== FOUNDATION_FORMULA_VERSION) return null

  switch (input.componentKey) {
    case "relative_salary":
      return round2(clamp(5 + (input.normalizedValue - 1) * 10, 0, 10))
    case "projected_growth":
    case "employment_momentum":
      return round2(clamp(5 + input.normalizedValue * 2.5, 0, 10))
    default:
      return round2(clamp(input.normalizedValue, 0, FOUNDATION_COMPONENT_MAXIMA[input.componentKey]))
  }
}

export function validateFoundationScoreInput(input: FoundationScoreInput): string[] {
  const errors: string[] = []
  if (input.availability === "unavailable" && input.normalizedValue != null) {
    errors.push("unavailable components must have normalizedValue=null")
  }
  if (input.availability === "unavailable" && !input.reason?.trim()) {
    errors.push("unavailable components require a reason")
  }
  if (input.directness === "proxy" && !input.proxyReason?.trim()) {
    errors.push("proxy components require proxyReason")
  }
  if (["fallback", "no_evidence_found", "insufficient_industry_coverage"].includes(input.evidenceStatus ?? "") && !input.reason?.trim()) {
    errors.push("fallback and conservative zero components require a reason")
  }
  return errors
}

export function calculateFoundationOpportunityScore(inputs: FoundationScoreInput[]): number | null {
  const requiredKeys = Object.keys(FOUNDATION_COMPONENT_MAXIMA) as FoundationComponentKey[]
  const byKey = new Map(inputs.map((input) => [input.componentKey, input]))
  if (byKey.size !== requiredKeys.length || requiredKeys.some((key) => !byKey.has(key))) return null

  let total = 0
  for (const key of requiredKeys) {
    const input = byKey.get(key)
    if (!input || validateFoundationScoreInput(input).length) return null
    const score = scoreFoundationComponent(input)
    if (score == null) return null
    total += score
  }
  return round2(total)
}

export function foundationScoreConfidence(input: {
  scoreReady: boolean
  components: Array<{
    directness: FoundationDirectness
    evidenceStatus: FoundationEvidenceStatus
    mappingQuality: "high" | "medium" | "low" | "not_applicable"
    confidence: number
  }>
}): FoundationScoreConfidence {
  if (!input.scoreReady || input.components.some((component) => component.mappingQuality === "low" || component.confidence < 0.5)) {
    return "limited_evidence"
  }
  if (input.components.every((component) =>
    component.directness === "direct"
      && (component.evidenceStatus === "direct_verified" || component.evidenceStatus === "derived"))) {
    return "verified"
  }
  return "estimated"
}

export function isFoundationRankable(readiness: {
  decisionReady: boolean
  scoreReady: boolean
  publishReady: boolean
  opportunityScore: number | null
}) {
  return readiness.decisionReady && readiness.scoreReady && readiness.publishReady && readiness.opportunityScore != null
}

export function chooseCareerReadModelSource(input: {
  foundationExists: boolean
  foundationDecisionReady: boolean
  legacyAvailable: boolean
}): "career_data_foundation" | "legacy_country_occupation" | "editorial_only" {
  if (input.foundationExists && input.foundationDecisionReady) return "career_data_foundation"
  if (input.foundationExists) return "editorial_only"
  if (input.legacyAvailable) return "legacy_country_occupation"
  return "editorial_only"
}
