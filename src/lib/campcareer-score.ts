export const CAMPCAREER_SCORE_VERSION = "campcareer-score-v1" as const

export type CampCareerVerdict = "excellent" | "strong" | "mixed" | "challenging" | "tough"

export type CampCareerScore = {
  version: typeof CAMPCAREER_SCORE_VERSION
  total: number
  demand: number
  pay: number
  entry: number
  verdict: CampCareerVerdict
}

export type CampCareerScoreComponent = {
  score: number | null
  max: number
}

export type CampCareerScoreInput = {
  shortage: CampCareerScoreComponent
  vacancyIntensity: CampCareerScoreComponent
  employerDiversity: CampCareerScoreComponent
  demandTrend: CampCareerScoreComponent
  growth: CampCareerScoreComponent
  pay: CampCareerScoreComponent
  entryAccess: CampCareerScoreComponent
  entryBurden: CampCareerScoreComponent
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value))

const componentReady = (component: CampCareerScoreComponent) =>
  component.score != null && Number.isFinite(component.score) && component.max > 0

const normalizedTen = (component: CampCareerScoreComponent) =>
  clamp((Number(component.score) / component.max) * 10, 0, 10)

export function campCareerVerdict(total: number): CampCareerVerdict {
  if (total >= 80) return "excellent"
  if (total >= 65) return "strong"
  if (total >= 50) return "mixed"
  if (total >= 35) return "challenging"
  return "tough"
}

export function calculateCampCareerScore(input: CampCareerScoreInput): CampCareerScore | null {
  const demandComponents = [
    input.shortage,
    input.vacancyIntensity,
    input.employerDiversity,
    input.demandTrend,
    input.growth,
  ]

  if (
    demandComponents.some((component) => !componentReady(component))
    || !componentReady(input.pay)
    || !componentReady(input.entryAccess)
    || !componentReady(input.entryBurden)
  ) {
    return null
  }

  const demandEarned = demandComponents.reduce((sum, component) => sum + Number(component.score), 0)
  const demandMax = demandComponents.reduce((sum, component) => sum + component.max, 0)
  const demand = Math.round(clamp((demandEarned / demandMax) * 10, 0, 10))
  const pay = Math.round(normalizedTen(input.pay))

  // Entry is intentionally balanced between access to a realistic newcomer route
  // and the burden of becoming job-ready. This prevents a structured but long
  // apprenticeship or licensed profession from looking artificially easy.
  const entry = Math.round((normalizedTen(input.entryAccess) + normalizedTen(input.entryBurden)) / 2)

  // The displayed component scores reconstruct the public score exactly.
  const total = demand * 4 + pay * 3 + entry * 3

  return {
    version: CAMPCAREER_SCORE_VERSION,
    total,
    demand,
    pay,
    entry,
    verdict: campCareerVerdict(total),
  }
}

export function campCareerScoreFromLegacyBreakdown(input: {
  shortage: number | null
  vacancyIntensity: number | null
  employerDiversity: number | null
  vacancyTrend: number | null
  entryLevel: number | null
  salary: number | null
  growth: number | null
  entryBurden: number | null
}) {
  return calculateCampCareerScore({
    shortage: { score: input.shortage, max: 20 },
    vacancyIntensity: { score: input.vacancyIntensity, max: 15 },
    employerDiversity: { score: input.employerDiversity, max: 5 },
    demandTrend: { score: input.vacancyTrend, max: 10 },
    growth: { score: input.growth, max: 10 },
    pay: { score: input.salary, max: 10 },
    entryAccess: { score: input.entryLevel, max: 15 },
    entryBurden: { score: input.entryBurden, max: 5 },
  })
}

export function campCareerScoreFromFoundationComponents(components: Array<{
  componentKey: string
  scoreValue: number | null
  maxScore: number
  availability?: "available" | "unavailable"
}>): CampCareerScore | null {
  const byKey = new Map(components.map((component) => [component.componentKey, component]))
  const component = (key: string): CampCareerScoreComponent => {
    const value = byKey.get(key)
    if (!value || value.availability === "unavailable") return { score: null, max: 1 }
    return { score: value.scoreValue, max: value.maxScore }
  }

  return calculateCampCareerScore({
    shortage: component("shortage_signal"),
    vacancyIntensity: component("vacancy_intensity"),
    employerDiversity: component("industry_diversity"),
    demandTrend: component("employment_momentum"),
    growth: component("projected_growth"),
    pay: component("relative_salary"),
    entryAccess: component("entry_accessibility"),
    entryBurden: component("entry_burden"),
  })
}
