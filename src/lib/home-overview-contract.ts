import type { CountryMetrics } from "@/lib/workspace/country-metric-contract"

export type OverviewEmployer = {
  label: string
  url: string | null
  providerType: string | null
}

export type OverviewOccupationMetric = {
  careerId: string
  title: string
  opportunityScore: number | null
  employmentTotal: number | null
  vacanciesThreeMonthAvg: number | null
  employmentGrowthFiveYearPct: number | null
  annualisedMedianSalary: number | null
  registrationRequired: boolean | null
  asOfDate: string | null
  checkedAt: string | null
  scoreStatus: string | null
}

export type CountryExplorerOpportunity = {
  categoryId: string
  categoryLabel: string
  topOccupationTitle: string
  opportunityScore: number
  vacanciesThreeMonthAvg: number | null
}

export type CountryExplorerCity = {
  slug: string
  name: string
  region: string
  linkedInstitutionCount: number
  linkedCampusCount: number
  monthlyLivingCost: {
    low: number
    high: number
    currency: string
  } | null
}

export type CountryExplorerData = {
  opportunities: CountryExplorerOpportunity[]
  cities: CountryExplorerCity[]
}

export type HomeOverviewData = {
  countryMetrics: CountryMetrics
  occupations: OverviewOccupationMetric[]
  expectedOccupationCount: number
  employerFocus: {
    occupationTitle: string
    employers: OverviewEmployer[]
    market: {
      employmentTotal: number | null
      vacanciesThreeMonthAvg: number | null
      employmentGrowthFiveYearPct: number | null
    }
  } | null
  countryExplorer: CountryExplorerData | null
}
