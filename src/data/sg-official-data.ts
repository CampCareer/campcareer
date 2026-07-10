import type { PilotOccupation } from "@/lib/pilot-launch-gate"
import { SG_DEMAND_OCCUPATIONS } from "@/data/sg-map-data"

// MOM publishes these demand cards with salary offers and skills. Foreign work
// pass and occupation-specific language evidence stay review-required, so this
// collection is visible in readiness reporting but never becomes pilot SEO.
export const SINGAPORE_OCCUPATION_REVIEW_QUEUE: PilotOccupation[] = SG_DEMAND_OCCUPATIONS.map((occupation) => ({
  country: "SG",
  sourceCode: occupation.sourceCode,
  iscoCode: null,
  nameEn: occupation.nameEn,
  nameKo: occupation.nameKo,
  localName: occupation.nameEn,
  medianSalary: Math.round((occupation.offeredWageLowSgd + occupation.offeredWageHighSgd) / 2),
  shortageScore: occupation.shortageScore,
  salaryScore: null,
  pathwayScore: null,
  languageScore: null,
  netIncomeScore: null,
  stabilityScore: null,
  salaryEvidence: { sourceUrl: occupation.sourceUrl, lastChecked: occupation.lastChecked, reviewStatus: "review-required" },
  shortageEvidence: { sourceUrl: occupation.sourceUrl, lastChecked: occupation.lastChecked, reviewStatus: "review-required" },
  pathwayEvidence: null,
  languageEvidence: null,
  reviewStatus: "review-required",
  details: {
    currency: "SGD",
    geography: occupation.geography,
    statisticPeriod: occupation.statisticPeriod,
    salary: {
      value: occupation.offeredWageLowSgd,
      unit: "SGD/month",
      definition: "MOM Job Vacancies 2025 employer offer range; not a resident wage median.",
      annualizedValue: occupation.offeredWageHighSgd,
      annualizationMethod: "The annualized field stores the upper end of MOM's published monthly offer range for review only.",
    },
    demand: {
      jobOpenings: null,
      applicants: null,
      openingsToApplicantsRatio: null,
      definition: occupation.shortageDefinition,
    },
    foreignWorkerPathway: null,
    languageRequirement: null,
    rentOrCostOfLivingNote: "URA market-segment rental index is available separately; no room-rent average is inferred.",
    jobQualityNote: `Top skills: ${occupation.skills.join(", ")}. Common experience: ${occupation.commonExperience}.`,
    evidence: [
      {
        sourceName: "MOM Job Vacancies 2025",
        sourceUrl: occupation.sourceUrl,
        datasetUrl: occupation.datasetUrl,
        retrievedAt: occupation.retrievedAt,
        lastChecked: occupation.lastChecked,
        confidence: "official",
        method: "official-download",
        reviewStatus: "review-required",
      },
    ],
  },
}))
