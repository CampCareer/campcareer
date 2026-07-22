import type { AuMajorSignal } from "@/lib/au-major-signals"

/**
 * A paid report needs a stricter evidence standard than a discovery card.
 * `last_verified` on an aggregate is useful, but it does not reveal the
 * publication date or confidence of every input. These types make that gap
 * explicit before an item can enter the report catalogue.
 */
export type ReportReadiness = "ready" | "conditional" | "blocked"
export type ReportConfidence = "high" | "medium" | "low"
export type EvidenceKind = "observed" | "calculated" | "estimated" | "user-provided"

export type EvidenceSource = {
  sourceName: string
  sourceUrl: string
  /** Date of the underlying dataset or policy, not the date CampCareer viewed it. */
  dataAsOf: string | null
  /** Date the CampCareer reviewer verified the source and mapping. */
  lastVerified: string | null
  confidence: ReportConfidence
  kind: EvidenceKind
}

export type ReadinessAssessment = {
  status: ReportReadiness
  confidence: ReportConfidence
  blockers: string[]
  cautions: string[]
}

export type FieldReportEvidence = {
  signal: Pick<
    AuMajorSignal,
    | "concept_id"
    | "salary_median_aud"
    | "cost_bachelor_median_aud"
    | "cost_diploma_median_aud"
    | "shortage_national_pct"
    | "outlook_2035_change_pct"
    | "data_sources"
    | "last_verified"
  >
  sources: {
    tuition: EvidenceSource | null
    salary: EvidenceSource | null
    labourMarket: EvidenceSource | null
  }
}

export type CityReportEvidence = {
  city: string
  annualLivingCostAud: number | null
  housingAssumption: string | null
  providerCount: number | null
  livingCostSource: EvidenceSource | null
}

export type UniversityReportEvidence = {
  institutionId: string
  activeCricosRecord: boolean
  verifiedCoursePage: boolean
  annualTuitionAud: number | null
  providerMedianEarningsAud: number | null
  providerEmploymentRate: number | null
  providerCompletionRate: number | null
  courseSource: EvidenceSource | null
  outcomeSource: EvidenceSource | null
}

export type RoiIndexEvidence = {
  bachelorRankingReady: boolean
  masterRankingReady: boolean
  vetRankingReady: boolean
  providerComparisonReady: boolean
  graduateOutcomesReady: boolean
  cityLivingCostReady: boolean
  paybackMethodologyReady: boolean
  labourMarketReady: boolean
  aiExposureMethodologyReady: boolean
  policyReviewReady: boolean
  methodologyAndSourcesReady: boolean
}

const MAX_SOURCE_AGE_DAYS = 550
const MAX_REVIEW_AGE_DAYS = 120

function dateAgeInDays(value: string | null, referenceDate: Date): number | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return null
  return Math.floor((referenceDate.getTime() - date.getTime()) / 86_400_000)
}

function hasPositiveNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
}

function hasNonNegativeNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function isUsableUrl(value: string | null | undefined) {
  return typeof value === "string" && /^https:\/\//.test(value)
}

function lowerConfidence(left: ReportConfidence, right: ReportConfidence): ReportConfidence {
  const levels: Record<ReportConfidence, number> = { low: 0, medium: 1, high: 2 }
  return levels[left] <= levels[right] ? left : right
}

function assessSources(
  sources: ReadonlyArray<{ label: string; source: EvidenceSource | null }>,
  referenceDate: Date,
) {
  const blockers: string[] = []
  const cautions: string[] = []
  let confidence: ReportConfidence = "high"
  let hasConditionalSource = false

  for (const { label, source } of sources) {
    if (!source) {
      blockers.push(`${label} source is missing.`)
      continue
    }
    if (!source.sourceName || !isUsableUrl(source.sourceUrl)) {
      blockers.push(`${label} source needs a name and an https URL.`)
    }

    const dataAge = dateAgeInDays(source.dataAsOf, referenceDate)
    if (dataAge == null) blockers.push(`${label} source is missing a valid data-as-of date.`)
    else if (dataAge < 0 || dataAge > MAX_SOURCE_AGE_DAYS) blockers.push(`${label} source data is stale or dated in the future.`)

    const reviewAge = dateAgeInDays(source.lastVerified, referenceDate)
    if (reviewAge == null) blockers.push(`${label} source is missing a valid review date.`)
    else if (reviewAge < 0 || reviewAge > MAX_REVIEW_AGE_DAYS) blockers.push(`${label} source review is stale or dated in the future.`)

    confidence = lowerConfidence(confidence, source.confidence)
    if (source.kind !== "observed" || source.confidence === "low") {
      hasConditionalSource = true
      cautions.push(`${label} is ${source.kind} with ${source.confidence} confidence.`)
    }
  }

  return { blockers, cautions, confidence, hasConditionalSource }
}

function assessmentFrom(
  blockers: string[],
  cautions: string[],
  confidence: ReportConfidence,
  hasConditionalSource = false,
): ReadinessAssessment {
  if (blockers.length > 0) return { status: "blocked", confidence, blockers, cautions }
  if (hasConditionalSource || confidence !== "high") return { status: "conditional", confidence, blockers, cautions }
  return { status: "ready", confidence, blockers, cautions }
}

/**
 * A field deep-dive may be sold only when each core metric is present and has
 * its own source date/review record. Aggregate snapshot freshness alone is
 * deliberately insufficient.
 */
export function assessFieldReportReadiness(
  evidence: FieldReportEvidence,
  referenceDate = new Date(),
): ReadinessAssessment {
  const blockers: string[] = []
  if (!hasPositiveNumber(evidence.signal.salary_median_aud)) blockers.push("Median salary is missing.")
  if (!hasPositiveNumber(evidence.signal.cost_bachelor_median_aud) && !hasPositiveNumber(evidence.signal.cost_diploma_median_aud)) {
    blockers.push("Bachelor or diploma tuition is missing.")
  }
  if (!hasNonNegativeNumber(evidence.signal.shortage_national_pct) && !hasNonNegativeNumber(evidence.signal.outlook_2035_change_pct)) {
    blockers.push("A shortage or employment-outlook signal is missing.")
  }
  if (!evidence.signal.data_sources?.length) blockers.push("Aggregate source list is missing.")
  if (!evidence.signal.last_verified) blockers.push("Aggregate last-verified date is missing.")

  const sourceAssessment = assessSources([
    { label: "Tuition", source: evidence.sources.tuition },
    { label: "Salary", source: evidence.sources.salary },
    { label: "Labour-market", source: evidence.sources.labourMarket },
  ], referenceDate)

  return assessmentFrom(
    [...blockers, ...sourceAssessment.blockers],
    sourceAssessment.cautions,
    sourceAssessment.confidence,
    sourceAssessment.hasConditionalSource,
  )
}

/** A source-backed static signal can be used for discovery, but not yet sold. */
export function hasFieldResearchCoverage(signal: FieldReportEvidence["signal"]): boolean {
  return hasPositiveNumber(signal.salary_median_aud)
    && (hasPositiveNumber(signal.cost_bachelor_median_aud) || hasPositiveNumber(signal.cost_diploma_median_aud))
    && (hasNonNegativeNumber(signal.shortage_national_pct) || hasNonNegativeNumber(signal.outlook_2035_change_pct))
    && Boolean(signal.data_sources?.length)
    && Boolean(signal.last_verified)
}

export function assessCityReportReadiness(
  evidence: CityReportEvidence,
  referenceDate = new Date(),
): ReadinessAssessment {
  const blockers: string[] = []
  if (!evidence.city.trim()) blockers.push("City is missing.")
  if (!hasPositiveNumber(evidence.annualLivingCostAud)) blockers.push("City-specific annual living cost is missing.")
  if (!evidence.housingAssumption?.trim()) blockers.push("Living-cost housing assumption is missing.")
  if (!hasPositiveNumber(evidence.providerCount)) blockers.push("City provider coverage is missing.")

  const sourceAssessment = assessSources([{ label: "City living-cost", source: evidence.livingCostSource }], referenceDate)
  return assessmentFrom(
    [...blockers, ...sourceAssessment.blockers],
    sourceAssessment.cautions,
    sourceAssessment.confidence,
    sourceAssessment.hasConditionalSource,
  )
}

export function assessUniversityReportReadiness(
  evidence: UniversityReportEvidence,
  referenceDate = new Date(),
): ReadinessAssessment {
  const blockers: string[] = []
  if (!evidence.institutionId.trim()) blockers.push("Institution is missing.")
  if (!evidence.activeCricosRecord) blockers.push("Active CRICOS course record is missing.")
  if (!evidence.verifiedCoursePage) blockers.push("Verified official course page is missing.")
  if (!hasPositiveNumber(evidence.annualTuitionAud)) blockers.push("Course annual tuition is missing.")
  if (!hasPositiveNumber(evidence.providerMedianEarningsAud)) blockers.push("Provider graduate earnings are missing.")
  if (!hasNonNegativeNumber(evidence.providerEmploymentRate)) blockers.push("Provider employment rate is missing.")

  const sourceAssessment = assessSources([
    { label: "Course", source: evidence.courseSource },
    { label: "Graduate-outcomes", source: evidence.outcomeSource },
  ], referenceDate)
  const cautions = [...sourceAssessment.cautions]
  if (!hasNonNegativeNumber(evidence.providerCompletionRate)) {
    cautions.push("Provider completion rate is unavailable and must be labelled as unavailable.")
  }
  return assessmentFrom(
    [...blockers, ...sourceAssessment.blockers],
    cautions,
    sourceAssessment.confidence,
    sourceAssessment.hasConditionalSource,
  )
}

const ROI_INDEX_REQUIREMENTS: ReadonlyArray<keyof RoiIndexEvidence> = [
  "bachelorRankingReady",
  "masterRankingReady",
  "vetRankingReady",
  "providerComparisonReady",
  "graduateOutcomesReady",
  "cityLivingCostReady",
  "paybackMethodologyReady",
  "labourMarketReady",
  "aiExposureMethodologyReady",
  "policyReviewReady",
  "methodologyAndSourcesReady",
]

export function assessRoiIndexReadiness(evidence: RoiIndexEvidence): ReadinessAssessment {
  const blockers = ROI_INDEX_REQUIREMENTS
    .filter((requirement) => !evidence[requirement])
    .map((requirement) => `${requirement} is incomplete.`)
  return assessmentFrom(blockers, [], "high")
}
