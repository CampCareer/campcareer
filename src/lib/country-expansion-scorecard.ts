export type CountryExpansionEvidence = {
  koreanSearchDemand: number | null
  pathwayClarity: number | null
  officialDataAccess: number | null
  affiliateFit: number | null
  seoDifficulty: number | null
  evidenceUrls: string[]
}

export type CountryExpansionScore = CountryExpansionEvidence & {
  country: string
  total: number | null
  qualifies: boolean
  reason: string
}

const MAX = {
  koreanSearchDemand: 35,
  pathwayClarity: 25,
  officialDataAccess: 20,
  affiliateFit: 10,
  seoDifficulty: 10,
} as const

export function scoreCountryExpansion(country: string, evidence: CountryExpansionEvidence): CountryExpansionScore {
  const values = Object.entries(MAX).map(([key, max]) => ({
    key: key as keyof typeof MAX,
    value: evidence[key as keyof typeof MAX],
    max,
  }))
  const missing = values.filter(({ value }) => value === null)
  if (missing.length > 0) {
    return {
      country,
      ...evidence,
      total: null,
      qualifies: false,
      reason: `Evidence missing for ${missing.map(({ key }) => key).join(", ")}.`,
    }
  }

  const invalid = values.find(({ value, max }) => value! < 0 || value! > max)
  if (invalid) {
    return { country, ...evidence, total: null, qualifies: false, reason: `${invalid.key} must be between 0 and ${invalid.max}.` }
  }

  const total = values.reduce((sum, { value }) => sum + (value ?? 0), 0)
  const qualifies = total >= 70 && (evidence.officialDataAccess ?? 0) >= 16 && evidence.evidenceUrls.length > 0
  return {
    country,
    ...evidence,
    total,
    qualifies,
    reason: qualifies
      ? "Eligible for the 50-page country pilot."
      : "Does not meet the 70-point total, official-data, or evidence threshold.",
  }
}

export const NEXT_COUNTRY_SCORECARD_TEMPLATE = [
  scoreCountryExpansion("New Zealand", {
    koreanSearchDemand: null,
    pathwayClarity: null,
    officialDataAccess: null,
    affiliateFit: null,
    seoDifficulty: null,
    evidenceUrls: [],
  }),
  scoreCountryExpansion("France", {
    koreanSearchDemand: null,
    pathwayClarity: null,
    officialDataAccess: null,
    affiliateFit: null,
    seoDifficulty: null,
    evidenceUrls: [],
  }),
] as const
