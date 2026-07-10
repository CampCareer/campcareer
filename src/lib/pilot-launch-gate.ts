import { PILOT_DATA_CATEGORIES, type PilotCountryCode, type PilotDataCategory, type PilotSourceRecord } from "@/data/pilot-source-registry"
import { scoreHiddenRoiPath, type ImmigrationViableRoiInput } from "@/lib/hidden-roi"

export type PilotOccupation = ImmigrationViableRoiInput & {
  country: PilotCountryCode
  sourceCode: string
  iscoCode: string | null
  nameEn: string | null
  nameKo: string | null
  localName: string | null
  medianSalary: number | null
  shortageScore: number | null
  reviewStatus: "approved" | "review-required"
  details?: PilotOccupationDetails
}

export type PilotEvidenceDetail = {
  sourceName: string
  sourceUrl: string
  datasetUrl?: string
  retrievedAt: string
  lastChecked: string
  confidence: "official" | "market-estimate" | "internal-estimate"
  method: "official-api" | "official-download" | "official-web" | "market-estimate"
  reviewStatus: "approved" | "review-required"
}

export type PilotOccupationDetails = {
  currency?: string
  geography?: string
  statisticPeriod?: string
  salary?: {
    value: number
    unit: string
    definition: string
    annualizedValue?: number
    annualizationMethod?: string
  }
  demand?: {
    jobOpenings: number | null
    applicants: number | null
    openingsToApplicantsRatio: number | null
    definition: string
  }
  foreignWorkerPathway?: string | null
  languageRequirement?: string | null
  rentOrCostOfLivingNote?: string | null
  jobQualityNote?: string | null
  evidence?: PilotEvidenceDetail[]
}

export type PilotLaunchGate = {
  ready: boolean
  sourceCoverage: number
  rawOccupationCount: number
  occupationCount: number
  salaryAndDemandCoverage: number
  indexableOccupationCount: number
  blockers: string[]
}

export function isPilotOccupationIndexable(occupation: PilotOccupation): boolean {
  const hiddenRoi = scoreHiddenRoiPath(occupation)
  return Boolean(
    occupation.reviewStatus === "approved" &&
      occupation.nameEn &&
      occupation.nameKo &&
      occupation.localName &&
      occupation.medianSalary !== null &&
      occupation.shortageScore !== null &&
      hiddenRoi.eligible,
  )
}

export function evaluatePilotLaunch(
  country: PilotCountryCode,
  sources: PilotSourceRecord[],
  occupations: PilotOccupation[],
): PilotLaunchGate {
  const countrySources = sources.filter((source) => source.country === country)
  const coveredCategories = new Set(countrySources.map((source) => source.category))
  const countryOccupations = occupations.filter((occupation) => occupation.country === country)
  const reviewedOccupations = countryOccupations.filter((occupation) => occupation.reviewStatus === "approved")
  const salaryAndDemandCount = reviewedOccupations.filter(
    (occupation) => occupation.medianSalary !== null && occupation.shortageScore !== null,
  ).length
  const sourceCoverage = coveredCategories.size / PILOT_DATA_CATEGORIES.length
  const salaryAndDemandCoverage = reviewedOccupations.length === 0 ? 0 : salaryAndDemandCount / reviewedOccupations.length
  const indexableOccupationCount = reviewedOccupations.filter(isPilotOccupationIndexable).length
  const blockers: string[] = []

  const missingCategories = PILOT_DATA_CATEGORIES.filter((category) => !coveredCategories.has(category))
  if (missingCategories.length > 0) blockers.push(`Missing source categories: ${missingCategories.join(", ")}.`)
  if (reviewedOccupations.length < 50) blockers.push(`Only ${reviewedOccupations.length}/50 approved occupations are available.`)
  if (salaryAndDemandCoverage < 0.8) blockers.push("Fewer than 80% of occupations have both salary and demand evidence.")
  if (indexableOccupationCount < 50) blockers.push(`Only ${indexableOccupationCount}/50 approved occupations meet the hidden high-ROI evidence gate.`)

  return {
    ready: blockers.length === 0,
    sourceCoverage,
    rawOccupationCount: countryOccupations.length,
    occupationCount: reviewedOccupations.length,
    salaryAndDemandCoverage,
    indexableOccupationCount,
    blockers,
  }
}

export function missingPilotSourceCategories(sources: PilotSourceRecord[], country: PilotCountryCode): PilotDataCategory[] {
  const coverage = new Set(sources.filter((source) => source.country === country).map((source) => source.category))
  return PILOT_DATA_CATEGORIES.filter((category) => !coverage.has(category))
}
