import {
  BUDGET_OPTIONS,
  COUNTRY_ROI_INSIGHTS,
  FIELD_OPTIONS,
  GOAL_OPTIONS,
  type BudgetKey,
  type CountryRoiInsight,
  type FieldKey,
  type GoalKey,
} from "@/data/country-roi-mvp"

export type RiskToleranceKey = "low" | "medium" | "high"
export type LanguageReadinessKey = "english-only" | "can-learn-local" | "multilingual"

export type CountryRecommendationInput = {
  field: FieldKey
  budget: BudgetKey
  goal: GoalKey
  riskTolerance: RiskToleranceKey
  languageReadiness: LanguageReadinessKey
}

export type ScoreBreakdown = {
  field: number
  goal: number
  budget: number
  risk: number
  language: number
}

export type CountryRecommendation = CountryRoiInsight & {
  matchScore: number
  fitLabel: "Excellent fit" | "Strong fit" | "Good fit" | "Watch carefully"
  detailHref: string
  reasons: string[]
  cautions: string[]
  breakdown: ScoreBreakdown
}

export const RISK_TOLERANCE_OPTIONS: Record<RiskToleranceKey, string> = {
  low: "Low risk",
  medium: "Balanced risk",
  high: "Higher upside",
}

export const LANGUAGE_READINESS_OPTIONS: Record<LanguageReadinessKey, string> = {
  "english-only": "English-only",
  "can-learn-local": "Can learn local language",
  multilingual: "Multilingual",
}

const COUNTRY_RISK_LEVEL: Record<string, number> = {
  AU: 2,
  CA: 2,
  DE: 3,
  UK: 3,
  NL: 2,
}

const COUNTRY_LANGUAGE_FIT: Record<string, Record<LanguageReadinessKey, number>> = {
  AU: { "english-only": 96, "can-learn-local": 94, multilingual: 94 },
  CA: { "english-only": 90, "can-learn-local": 94, multilingual: 97 },
  DE: { "english-only": 58, "can-learn-local": 82, multilingual: 90 },
  UK: { "english-only": 96, "can-learn-local": 94, multilingual: 94 },
  NL: { "english-only": 78, "can-learn-local": 88, multilingual: 92 },
}

const WEIGHTS: ScoreBreakdown = {
  field: 0.38,
  goal: 0.27,
  budget: 0.2,
  risk: 0.1,
  language: 0.05,
}

export const DEFAULT_RECOMMENDATION_INPUT: CountryRecommendationInput = {
  field: "software",
  budget: "balanced",
  goal: "immigration",
  riskTolerance: "medium",
  languageReadiness: "english-only",
}

export function parseRecommendationInput(params: {
  field?: string | null
  budget?: string | null
  goal?: string | null
  risk?: string | null
  language?: string | null
}): CountryRecommendationInput {
  return {
    field: isFieldKey(params.field) ? params.field : DEFAULT_RECOMMENDATION_INPUT.field,
    budget: isBudgetKey(params.budget) ? params.budget : DEFAULT_RECOMMENDATION_INPUT.budget,
    goal: isGoalKey(params.goal) ? params.goal : DEFAULT_RECOMMENDATION_INPUT.goal,
    riskTolerance: isRiskToleranceKey(params.risk) ? params.risk : DEFAULT_RECOMMENDATION_INPUT.riskTolerance,
    languageReadiness: isLanguageReadinessKey(params.language)
      ? params.language
      : DEFAULT_RECOMMENDATION_INPUT.languageReadiness,
  }
}

export function recommendCountries(
  input: CountryRecommendationInput,
  countries: CountryRoiInsight[] = COUNTRY_ROI_INSIGHTS,
): CountryRecommendation[] {
  return countries
    .map((country) => {
      const breakdown = buildBreakdown(country, input)
      const matchScore = Math.round(
        breakdown.field * WEIGHTS.field +
          breakdown.goal * WEIGHTS.goal +
          breakdown.budget * WEIGHTS.budget +
          breakdown.risk * WEIGHTS.risk +
          breakdown.language * WEIGHTS.language,
      )

      return {
        ...country,
        matchScore,
        fitLabel: getFitLabel(matchScore),
        detailHref: buildDetailHref(country.href, input),
        reasons: buildReasons(country, input, breakdown),
        cautions: buildCautions(country, input, breakdown),
        breakdown,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function getRecommendationLabels(input: CountryRecommendationInput) {
  return {
    field: FIELD_OPTIONS[input.field],
    budget: BUDGET_OPTIONS[input.budget],
    goal: GOAL_OPTIONS[input.goal],
    risk: RISK_TOLERANCE_OPTIONS[input.riskTolerance],
    language: LANGUAGE_READINESS_OPTIONS[input.languageReadiness],
  }
}

function buildBreakdown(country: CountryRoiInsight, input: CountryRecommendationInput): ScoreBreakdown {
  return {
    field: country.score[input.field],
    goal: country.goalFit[input.goal],
    budget: country.budgetFit[input.budget],
    risk: getRiskFit(country, input.riskTolerance),
    language: COUNTRY_LANGUAGE_FIT[country.code]?.[input.languageReadiness] ?? 80,
  }
}

function getRiskFit(country: CountryRoiInsight, riskTolerance: RiskToleranceKey) {
  const countryRisk = COUNTRY_RISK_LEVEL[country.code] ?? 2
  if (riskTolerance === "low") return countryRisk === 1 ? 96 : countryRisk === 2 ? 86 : 62
  if (riskTolerance === "high") return countryRisk === 3 ? 94 : countryRisk === 2 ? 86 : 74
  return countryRisk === 2 ? 92 : 82
}

function buildReasons(
  country: CountryRoiInsight,
  input: CountryRecommendationInput,
  breakdown: ScoreBreakdown,
) {
  const labels = getRecommendationLabels(input)
  const reasons = [
    `${labels.field} fit scores ${breakdown.field}/100 based on current major-to-country signals.`,
    `${labels.goal} fit scores ${breakdown.goal}/100 for this country's policy and labour-market profile.`,
  ]

  if (breakdown.budget >= 82) {
    reasons.push(`${labels.budget} matches the expected ${country.initialBudget} initial budget range.`)
  } else if (breakdown.budget < 65) {
    reasons.push(`${country.name} is still possible, but the ${country.initialBudget} initial budget may stretch your profile.`)
  }

  if (breakdown.language >= 88) {
    reasons.push(`${labels.language} is compatible with the typical study and early-career path.`)
  }

  return reasons.slice(0, 3)
}

function buildCautions(
  country: CountryRoiInsight,
  input: CountryRecommendationInput,
  breakdown: ScoreBreakdown,
) {
  const cautions: string[] = []

  if (breakdown.budget < 70) {
    cautions.push(`Budget pressure: validate tuition, deposit, rent setup, and first 90 days before applying.`)
  }

  if (breakdown.language < 80) {
    cautions.push(`Language risk: ${country.name} may require local-language ability for stronger job outcomes.`)
  }

  if (input.riskTolerance === "low" && breakdown.risk < 75) {
    cautions.push(`Policy risk: this route may need more fallback planning than your low-risk preference.`)
  }

  return (cautions.length > 0 ? cautions : country.detail.watchouts.slice(0, 1)).slice(0, 2)
}

function buildDetailHref(path: string, input: CountryRecommendationInput) {
  const params = new URLSearchParams({
    field: input.field,
    budget: input.budget,
    goal: input.goal,
    risk: input.riskTolerance,
    language: input.languageReadiness,
  })

  return `${path}?${params.toString()}`
}

function getFitLabel(score: number): CountryRecommendation["fitLabel"] {
  if (score >= 88) return "Excellent fit"
  if (score >= 80) return "Strong fit"
  if (score >= 70) return "Good fit"
  return "Watch carefully"
}

function isFieldKey(value: string | null | undefined): value is FieldKey {
  return typeof value === "string" && value in FIELD_OPTIONS
}

function isBudgetKey(value: string | null | undefined): value is BudgetKey {
  return typeof value === "string" && value in BUDGET_OPTIONS
}

function isGoalKey(value: string | null | undefined): value is GoalKey {
  return typeof value === "string" && value in GOAL_OPTIONS
}

function isRiskToleranceKey(value: string | null | undefined): value is RiskToleranceKey {
  return typeof value === "string" && value in RISK_TOLERANCE_OPTIONS
}

function isLanguageReadinessKey(value: string | null | undefined): value is LanguageReadinessKey {
  return typeof value === "string" && value in LANGUAGE_READINESS_OPTIONS
}
