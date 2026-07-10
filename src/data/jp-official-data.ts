import type { PilotOccupation } from "@/lib/pilot-launch-gate"
import occupations from "@/data/jp-official-occupations.json"
import snapshots from "@/data/jp-source-snapshots.json"

export type JapanOfficialOccupation = {
  country: "JP"
  occupationCode: string
  localName: string
  occupationClassification: "MHLW occupation code"
  iscoCode: null
  geography: "Japan"
  statisticPeriod: string
  hourlyBaseWageYen: number
  annualizedBaseSalaryYen: number
  annualizationMethod: "official hourly baseline x 160 hours/month x 12 months"
  salaryScore: number
  salarySourceUrl: string
  retrievedAt: string
  lastChecked: string
  reviewStatus: "review-required"
}

export type JapanShortageGroup = {
  country: "JP"
  shortageGroupCode: string
  localName: string
  geography: "Japan"
  statisticPeriod: string
  jobOpenings: number
  applicants: number
  openingsToApplicantsRatio: number
  shortageScore: number
  sourceUrl: string
  retrievedAt: string
  lastChecked: string
  reviewStatus: "review-required"
}

export type JapanSourceSnapshot = {
  countryCode: "JP"
  category: string
  sourceName: string
  sourceUrl: string
  datasetUrls: string[]
  contentHash: string | null
  retrievedAt: string | null
  method: "official-api" | "official-download" | "official-web"
  reviewStatus: "approved" | "review-required"
  status: "ingested" | "cataloged" | "failed"
  summary: string
}

export const JAPAN_OFFICIAL_OCCUPATIONS = occupations as JapanOfficialOccupation[]
export const JAPAN_SOURCE_SNAPSHOTS = snapshots as JapanSourceSnapshot[]

// These rows intentionally have no translated title, language evidence, or
// visa eligibility claim. They count as collected review work, never public SEO.
export const JAPAN_OCCUPATION_REVIEW_QUEUE: PilotOccupation[] = JAPAN_OFFICIAL_OCCUPATIONS.map((occupation) => ({
  country: "JP",
  sourceCode: `mhlw-${occupation.occupationCode}`,
  iscoCode: occupation.iscoCode,
  nameEn: null,
  nameKo: null,
  localName: occupation.localName,
  medianSalary: occupation.annualizedBaseSalaryYen,
  shortageScore: null,
  salaryScore: occupation.salaryScore,
  pathwayScore: null,
  languageScore: null,
  netIncomeScore: null,
  stabilityScore: null,
  salaryEvidence: {
    sourceUrl: occupation.salarySourceUrl,
    lastChecked: occupation.lastChecked,
    reviewStatus: "review-required",
  },
  shortageEvidence: null,
  pathwayEvidence: null,
  languageEvidence: null,
  reviewStatus: "review-required",
  details: {
    currency: "JPY",
    geography: occupation.geography,
    statisticPeriod: occupation.statisticPeriod,
    salary: {
      value: occupation.hourlyBaseWageYen,
      unit: "JPY/hour",
      definition: "MHLW occupation-specific hourly baseline for zero years of experience.",
      annualizedValue: occupation.annualizedBaseSalaryYen,
      annualizationMethod: occupation.annualizationMethod,
    },
    foreignWorkerPathway: null,
    languageRequirement: null,
    evidence: [
      {
        sourceName: "MHLW Wage Structure Basic Statistical Survey",
        sourceUrl: occupation.salarySourceUrl,
        retrievedAt: occupation.retrievedAt,
        lastChecked: occupation.lastChecked,
        confidence: "official",
        method: "official-download",
        reviewStatus: "review-required",
      },
    ],
  },
}))
