export type StudyLocale = "en" | "ko-KR"

export type StudyConceptKind = "STUDY_FIELD" | "QUALIFICATION" | "TRADE_PATHWAY"

export type ConceptCountryCoverage =
  | "CATALOG"
  | "PROFILE_READY"
  | "PATHWAY_READY"
  | "DECISION_READY"

export type RecommendationPriority =
  | "CAREER_OUTCOME"
  | "LOWER_COST"
  | "POST_STUDY_OPTIONS"

export type FitBand =
  | "STRONG_MATCH"
  | "WORTH_CONSIDERING"
  | "IMPORTANT_TRADE_OFFS"
  | "INSUFFICIENT_DATA"

export type OfficialCode = {
  country: string
  system: string
  version: string
  code: string
}

export type StudyConcept = {
  id: string
  slug: string
  kind: StudyConceptKind
  category: string
  label: string
  labelKo: string
  aliases: string[]
  aliasesKo: string[]
  description: string
  roiSearchTerm: string
  legacyField?: "software" | "data" | "nursing" | "engineering" | "business"
  officialCodes?: OfficialCode[]
  coverageByCountry: Record<string, ConceptCountryCoverage>
}

export type TaxonomySearchResult = {
  conceptId: string
  slug: string
  kind: StudyConceptKind
  label: string
  secondaryLabel: string
  matchedAlias?: string
  officialCodes: OfficialCode[]
  coverageByCountry: Record<string, ConceptCountryCoverage>
  recommendable: boolean
  exploreHref?: string
}

export type RecommendationInputV2 = {
  locale: StudyLocale
  originCountry: string
  targetConceptId: string
  firstYearBudget: {
    amount: number
    currency: string
  }
  priority: RecommendationPriority
}

export type MetricEvidence = {
  key: "FIRST_YEAR_COST" | "TOTAL_COST" | "SALARY" | "PATHWAY" | "QUALIFICATION"
  label: string
  value: string
  sourceId: string
  sourceName: string
  sourceUrl?: string
  sourceType: "OFFICIAL" | "MARKET" | "INTERNAL"
  asOf: string
  lastVerifiedAt: string
  reviewStatus: "APPROVED" | "STALE" | "REVIEW_REQUIRED"
}

export type FactorBreakdown = {
  careerOutcome: "STRONG" | "MIXED" | "WEAK"
  affordability: "STRONG" | "MIXED" | "WEAK"
  postStudyOptions: "STRONG" | "MIXED" | "WEAK"
  pathwayFeasibility: "STRONG" | "MIXED" | "WEAK"
}

export type CountryRecommendation = {
  countryCode: string
  countryName: string
  slug: string
  fitBand: FitBand
  factorBreakdown: FactorBreakdown
  why: string
  caution: string
  qualification: string
  duration: string
  linkedCareer: string
  policy: string
  metrics: MetricEvidence[]
  detailHref: string
  shortlistHref: string
}

export type CountryEvidenceSummary = {
  countryCode: string
  countryName: string
  slug: string
  coverage: ConceptCountryCoverage
  availableEvidence: string[]
  exploreHref: string
}

export type RecommendationResultV2 = {
  engineVersion: string
  dataVersion: string
  generatedAt: string
  input: RecommendationInputV2
  concept: {
    id: string
    slug: string
    label: string
    kind: StudyConceptKind
  }
  rankedCountries: CountryRecommendation[]
  unrankedCountries: CountryEvidenceSummary[]
  disclaimer: string
}

export type CourseOffering = {
  id: string
  countryCode: string
  providerId: string
  providerName: string
  title: string
  courseCode?: string
  qualificationLevel?: string
  tuitionAmount?: number
  tuitionCurrency?: string
  durationMonths?: number
  campus?: string
  intake?: string
  internationalEligible: boolean
  registrationStatus: "CURRENT" | "UNKNOWN"
  officialUrl: string
  sourceName: string
  lastVerifiedAt: string
}
