export type OpportunityScoreBreakdown = {
  shortage: number
  vacancyIntensity: number
  employerDiversity: number
  vacancyTrend: number
  entryLevel: number
  salary: number
  growth: number
  visa: number
  entryBurden: number
}

export type CountryOccupationMetric = {
  asOfDate: string
  employmentTotal: number | null
  medianWeeklyEarnings: number | null
  medianHourlyEarnings: number | null
  annualisedMedianSalary: number | null
  allOccupationsMedianWeekly: number | null
  partTimeSharePct: number | null
  femaleSharePct: number | null
  medianAge: number | null
  averageFullTimeHours: number | null
  vacanciesThreeMonthAvg: number | null
  vacancyPeriod: string | null
  vacancyYoyPct: number | null
  employmentGrowth5yPct: number | null
  employmentGrowth10yPct: number | null
  opportunityScore: number
  scoreMethodologyVersion: string
  scoreStatus: "provisional" | "reviewed" | "published"
  scoreEvidence: Record<string, unknown>
  score: OpportunityScoreBreakdown
  sourceCheckedAt: string | null
}

export type CountryOccupationSpecialisation = {
  officialCode: string
  officialTitle: string
  legacyCodeSystem: string | null
  legacyCodeVersion: string | null
  legacyCode: string | null
  shortageRating: number | null
  visaEligible: boolean | null
  includedInRollup: boolean
}

export type CountryOccupationRegionMetric = {
  regionCode: string
  asOfDate: string
  shortageRating: number | null
  vacancyCount: number | null
  sourceUrl: string | null
}

export type CountryOccupationLinkType =
  | "job_search"
  | "employer"
  | "graduate_program"
  | "source"

export type CountryOccupationLink = {
  linkType: CountryOccupationLinkType
  label: string
  url: string
  providerType: string | null
  regionCode: string | null
}

export type CountryOccupationProgramLink = {
  programRef: string
  relationType: "direct" | "graduate_entry" | "progression" | "related"
}

export type CountryOccupationProfile = {
  profileKey: string
  countryCode: string
  canonicalCareerId: string
  officialTitle: string
  officialCodeSystem: string
  officialCodeVersion: string
  officialUnitGroupCode: string | null
  currency: string
  registrationRequired: boolean
  registrationAuthority: string | null
  registrationUrl: string | null
  publicationStatus: "review_required" | "profile_ready" | "decision_ready"
  sourceCheckedAt: string | null
  metric: CountryOccupationMetric
  specialisations: CountryOccupationSpecialisation[]
  regions: CountryOccupationRegionMetric[]
  links: CountryOccupationLink[]
  programLinks: CountryOccupationProgramLink[]
}

export const OPPORTUNITY_SCORE_MAXIMA: OpportunityScoreBreakdown = {
  shortage: 20,
  vacancyIntensity: 15,
  employerDiversity: 5,
  vacancyTrend: 10,
  entryLevel: 15,
  salary: 10,
  growth: 10,
  visa: 10,
  entryBurden: 5,
}
