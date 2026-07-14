import { CANONICAL_CAREERS, getCanonicalCareer, type CanonicalCareer } from "@/data/career-comparison-catalog"
import { getLaunchCountry, LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { recommendCareerCountriesV4 } from "@/lib/study-product/career-recommendation-v4"
import type { MigrationStatus } from "@/lib/comparison/public-contract"

export const BUDGET_BANDS = [
  { id: "under-30000", label: "Under US$30k", min: 0, max: 29_999 },
  { id: "30000-50000", label: "US$30k–50k", min: 30_000, max: 50_000 },
  { id: "50000-75000", label: "US$50k–75k", min: 50_000, max: 75_000 },
  { id: "75000-100000", label: "US$75k–100k", min: 75_000, max: 100_000 },
  { id: "100000-plus", label: "US$100k+", min: 100_000, max: null },
] as const

export const SEARCH_GOALS = [
  { id: "career-outcomes", label: "Career outcomes", priority: "CAREER_OUTCOME" },
  { id: "lower-first-year-cost", label: "Lower first-year cost", priority: "LOWER_COST" },
  { id: "work-and-immigration", label: "Work & immigration pathway", priority: "POST_STUDY_OPTIONS" },
] as const

export type BudgetBandId = (typeof BUDGET_BANDS)[number]["id"]
export type SearchGoalId = (typeof SEARCH_GOALS)[number]["id"]

export type SearchIntent = {
  career: CanonicalCareer
  budget: (typeof BUDGET_BANDS)[number]
  goal: (typeof SEARCH_GOALS)[number]
  currency: string
}

export type DiscoveryEnvelope<T> = {
  data: T
  evidence: Array<{ sourceName: string; sourceUrl: string; asOf: string; status: "verified" | "needs_review" | "unavailable" }>
  readiness: "decision_ready" | "discovery" | "review_required"
  methodologyVersion: "discovery-v1"
  generatedAt: string
}

export type CountryRanking = {
  rank: number
  country: { code: string; slug: string; name: string; currency: string }
  score: number
  why: string
  financial: {
    firstYearCash: string
    grossSalary: string
    takeHome: string
    livingCost: string
  }
  immigration: MigrationStatus
  asOf: string
}

export type CountryRankingsData = {
  intent: SearchIntent
  ranked: CountryRanking[]
  explorers: Array<{ code: string; slug: string; name: string; reason: string }>
  minimumRankingCountries: number
  rankingAvailable: boolean
}

export type MajorRecommendationsData = {
  country: { code: string; slug: string; name: string }
  state?: string
  goal: SearchGoalId
  budget?: BudgetBandId
  recommendations: Array<{ rank: number; career: CanonicalCareer; why: string; evidenceStatus: "verified" }>
  discoveryCareers: CanonicalCareer[]
}

export type UniversityMatchesData = {
  country: { code: string; slug: string; name: string }
  city?: string
  career: CanonicalCareer
  budget: (typeof BUDGET_BANDS)[number]
  matches: Array<{
    rank: number
    name: string
    city: string
    firstYearCost: string
    requirements: string[]
    officialUrl: string
  }>
  reason: string
}

export function parseSearchIntent(input: {
  career: string | null
  budget: string | null
  goal: string | null
  currency: string | null
}): SearchIntent | null {
  const career = getCanonicalCareer(input.career ?? "")
  const budget = BUDGET_BANDS.find((item) => item.id === input.budget)
  const goal = SEARCH_GOALS.find((item) => item.id === input.goal)
  const currency = (input.currency ?? "USD").toUpperCase()
  if (!career || !budget || !goal || !/^[A-Z]{3}$/.test(currency)) return null
  return { career, budget, goal, currency }
}

export function budgetAmount(budget: (typeof BUDGET_BANDS)[number]) {
  return budget.max ? Math.round((budget.min + budget.max) / 2) : budget.min
}

export function buildCountryRankings(intent: SearchIntent): DiscoveryEnvelope<CountryRankingsData> {
  const careerResult = recommendCareerCountriesV4({
    locale: "en",
    targetCareerId: intent.career.id,
    priority: intent.goal.priority,
    firstYearBudget: { amount: budgetAmount(intent.budget), currency: "USD" },
  })
  // V4 only exposes a country when its exact occupation mapping and current
  // evidence bundle have passed review. The current publication set can be
  // empty without turning a broad-major estimate into a public ranking.
  const ranked = careerResult.rankedCountries.map((item, index) => {
    const country = getLaunchCountry(item.countryCode)!
    return {
      rank: index + 1,
      country,
      score: 0,
      why: item.why,
      financial: { firstYearCash: "—", grossSalary: "—", takeHome: "—", livingCost: "—" },
      immigration: "unknown" as const,
      asOf: careerResult.generatedAt.slice(0, 10),
    }
  })
  const rankingAvailable = ranked.length >= 3
  return {
    data: {
      intent,
      ranked: rankingAvailable ? ranked : [],
      explorers: careerResult.unrankedCountries.map((item) => ({
        code: item.countryCode,
        slug: item.slug,
        name: item.countryName,
        reason: item.reason,
      })),
      minimumRankingCountries: 3,
      rankingAvailable,
    },
    evidence: [],
    readiness: rankingAvailable ? "decision_ready" : "review_required",
    methodologyVersion: "discovery-v1",
    generatedAt: careerResult.generatedAt,
  }
}

export function buildMajorRecommendations(input: {
  countryCode: string
  state?: string
  goal: SearchGoalId
  budget?: BudgetBandId
}): DiscoveryEnvelope<MajorRecommendationsData> | null {
  const country = getLaunchCountry(input.countryCode)
  if (!country) return null
  return {
    data: {
      country,
      ...(input.state ? { state: input.state } : {}),
      goal: input.goal,
      ...(input.budget ? { budget: input.budget } : {}),
      recommendations: [],
      discoveryCareers: CANONICAL_CAREERS.filter((career) => career.categoryId === "technology" || career.categoryId === "health"),
    },
    evidence: [],
    readiness: "review_required",
    methodologyVersion: "discovery-v1",
    generatedAt: new Date().toISOString(),
  }
}

export function buildUniversityMatches(input: {
  countryCode: string
  career: string
  budget: BudgetBandId
  city?: string
}): DiscoveryEnvelope<UniversityMatchesData> | null {
  const country = getLaunchCountry(input.countryCode)
  const career = getCanonicalCareer(input.career)
  const budget = BUDGET_BANDS.find((item) => item.id === input.budget)
  if (!country || !career || !budget) return null
  return {
    data: {
      country,
      ...(input.city ? { city: input.city } : {}),
      career,
      budget,
      matches: [],
      reason: "A university can be ranked only after its programme, first-year cost, entry requirements, and outcome evidence have all passed review.",
    },
    evidence: [],
    readiness: "review_required",
    methodologyVersion: "discovery-v1",
    generatedAt: new Date().toISOString(),
  }
}

export const discoveryCountries = LAUNCH_COUNTRIES
