import { PILOT_DATA_CATEGORIES, type PilotCountryCode, type PilotDataCategory, type PilotSourceRecord } from "@/data/pilot-source-registry"
import { scoreHiddenRoiPath, type ImmigrationViableRoiInput } from "@/lib/hidden-roi"

export type PilotOccupation = ImmigrationViableRoiInput & {
  country: PilotCountryCode
  sourceCode: string
  iscoCode: string | null
  nameEn: string
  nameKo: string | null
  localName: string | null
  medianSalary: number | null
  shortageScore: number | null
  reviewStatus: "approved" | "review-required"
}

export type PilotLaunchGate = {
  ready: boolean
  sourceCoverage: number
  occupationCount: number
  salaryAndDemandCoverage: number
  indexableOccupationCount: number
  blockers: string[]
}

export function isPilotOccupationIndexable(occupation: PilotOccupation): boolean {
  const hiddenRoi = scoreHiddenRoiPath(occupation)
  return Boolean(
    occupation.reviewStatus === "approved" &&
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
  const salaryAndDemandCount = countryOccupations.filter(
    (occupation) => occupation.medianSalary !== null && occupation.shortageScore !== null,
  ).length
  const sourceCoverage = coveredCategories.size / PILOT_DATA_CATEGORIES.length
  const salaryAndDemandCoverage = countryOccupations.length === 0 ? 0 : salaryAndDemandCount / countryOccupations.length
  const blockers: string[] = []

  const missingCategories = PILOT_DATA_CATEGORIES.filter((category) => !coveredCategories.has(category))
  if (missingCategories.length > 0) blockers.push(`Missing source categories: ${missingCategories.join(", ")}.`)
  if (countryOccupations.length < 50) blockers.push(`Only ${countryOccupations.length}/50 reviewed occupations are available.`)
  if (salaryAndDemandCoverage < 0.8) blockers.push("Fewer than 80% of occupations have both salary and demand evidence.")
  if (countryOccupations.filter(isPilotOccupationIndexable).length < 50) blockers.push("Not every launch occupation meets the hidden high-ROI evidence gate.")

  return {
    ready: blockers.length === 0,
    sourceCoverage,
    occupationCount: countryOccupations.length,
    salaryAndDemandCoverage,
    indexableOccupationCount: countryOccupations.filter(isPilotOccupationIndexable).length,
    blockers,
  }
}

export function missingPilotSourceCategories(sources: PilotSourceRecord[], country: PilotCountryCode): PilotDataCategory[] {
  const coverage = new Set(sources.filter((source) => source.country === country).map((source) => source.category))
  return PILOT_DATA_CATEGORIES.filter((category) => !coverage.has(category))
}
