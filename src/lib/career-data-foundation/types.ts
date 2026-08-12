export const FOUNDATION_FORMULA_VERSION = "career-opportunity-v2-foundation" as const

export const FOUNDATION_COMPONENT_MAXIMA = {
  shortage_signal: 20,
  vacancy_intensity: 15,
  industry_diversity: 5,
  employment_momentum: 10,
  entry_accessibility: 15,
  relative_salary: 10,
  projected_growth: 10,
  visa_accessibility: 10,
  entry_burden: 5,
} as const

export type FoundationComponentKey = keyof typeof FOUNDATION_COMPONENT_MAXIMA
export type FoundationAvailability = "available" | "unavailable"
export type FoundationDirectness = "direct" | "proxy"
export type FoundationMappingQuality = "high" | "medium" | "low" | "not_applicable"
export type FoundationSourceType = "official_primary" | "official_service" | "government_aggregator"
export type FoundationQuality = "high" | "medium" | "low"

export type CareerFoundationSource = {
  sourceKey: string
  authority: string
  title: string
  url: string
  sourceType: FoundationSourceType
  lastVerifiedOn: string
  notes: string | null
}

export type CareerFoundationMapping = {
  mappingKey: string
  canonicalOccupationId: string
  countryCode: string
  officialTaxonomy: string
  officialTaxonomyVersion: string
  officialCode: string
  officialTitle: string
  mappingRelation: "exact" | "broader" | "narrower" | "composite" | "proxy"
  mappingQuality: Exclude<FoundationMappingQuality, "not_applicable">
  rationale: string
  sourceKey: string
  sourceUrl: string
  verifiedOn: string
  isPrimary: boolean
}

export type CareerFoundationRawObservation = {
  observationKey: string
  metricKey: string
  sourceKey: string
  mappingKey: string | null
  referencePeriod: string
  asOfDate: string | null
  rawValue: unknown | null
  unit: string | null
  availability: FoundationAvailability
  reason: string | null
  directness: FoundationDirectness
  mappingQuality: FoundationMappingQuality
  proxyReason: string | null
  sourceType: FoundationSourceType
  quality: FoundationQuality
  confidence: number
  lastVerifiedOn: string
  explanation: string
}

export type CareerFoundationNormalizedMetric = {
  normalizedMetricKey: string
  metricKey: string
  inputObservationRefs: string[]
  normalizedValue: number | null
  normalizedUnit: string | null
  formulaVersion: string
  availability: FoundationAvailability
  reason: string | null
  directness: FoundationDirectness
  mappingQuality: FoundationMappingQuality
  proxyReason: string | null
  sourceType: FoundationSourceType
  calculatedAt: string
  quality: FoundationQuality
  confidence: number
  explanation: string
}

export type CareerFoundationScoreComponent = {
  componentKey: FoundationComponentKey
  rawInputRefs: string[]
  normalizedMetricRefs: string[]
  normalizedValue: number | null
  formulaVersion: string
  scoreValue: number | null
  maxScore: number
  availability: FoundationAvailability
  directness: FoundationDirectness
  mappingQuality: FoundationMappingQuality
  proxyReason: string | null
  sourceType: FoundationSourceType
  calculatedAt: string
  quality: FoundationQuality
  confidence: number
  explanation: string
  reason: string | null
}

export type CareerFoundationBlocker = {
  blockerKey: string
  blockerType: "work_rights" | "visa" | "licensing" | "registration" | "safety_training" | "education_training"
  severity: "hard" | "conditional" | "informational"
  reason: string
  sourceKey: string
  officialSourceUrl: string
  applicabilityScope: string
  lastVerifiedOn: string
}

export type CareerFoundationEntryPoint = {
  entryPointKey: string
  entryType: "job_search" | "employer" | "apprenticeship" | "training" | "visa" | "licensing_check" | "source"
  label: string
  provider: string
  url: string
  sourceKey: string
  applicabilityScope: string
  lastVerifiedOn: string
  notes: string | null
  sortOrder: number
}

export type CareerFoundationDecisionMetrics = {
  employmentTotal: number | null
  employmentReferencePeriod: string | null
  medianAnnualWage: number | null
  medianHourlyWage: number | null
  wageReferencePeriod: string | null
  projectedEmployment2034: number | null
  projectedGrowthPct: number | null
  projectedAnnualOpenings: number | null
  projectionsReferencePeriod: string | null
  vacancyAvailability: FoundationAvailability
  vacancyReason: string | null
  shortageAvailability: FoundationAvailability
  shortageReason: string | null
}

export type CareerDataFoundationResult = {
  profileKey: string
  countryCode: string
  canonicalOccupationId: string
  currency: string
  sourceCheckedOn: string
  mapping: CareerFoundationMapping
  readiness: {
    decisionReady: boolean
    scoreReady: boolean
    publishReady: boolean
    decisionReason: string
    scoredComponents: number
    requiredComponents: number
    scoreCoverageWeight: number
    formulaVersion: string
    calculationTimestamp: string | null
  }
  opportunityScore: number | null
  scoreExplanation: string
  decisionMetrics: CareerFoundationDecisionMetrics
  sources: CareerFoundationSource[]
  rawObservations: CareerFoundationRawObservation[]
  normalizedMetrics: CareerFoundationNormalizedMetric[]
  scoreComponents: CareerFoundationScoreComponent[]
  blockers: CareerFoundationBlocker[]
  entryPoints: CareerFoundationEntryPoint[]
}
