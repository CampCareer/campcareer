export type CareerStage = 1 | 3 | 5

export const CAREER_STAGE_OPTIONS: CareerStage[] = [1, 3, 5]

export const COUNTRY_BASELINE_YEARS: Record<string, number> = {
  us: 6,
  uk: 1,
  ca: 2,
  au: 3,
  ie: 1,
}

const TO_CAREER_STAGE: Record<string, Record<number, number>> = {
  us: { 1: 0.55, 3: 0.78, 5: 0.95 },
  uk: { 1: 1.00, 3: 1.30, 5: 1.55 },
  ca: { 1: 0.88, 3: 1.09, 5: 1.25 },
  au: { 1: 0.78, 3: 1.00, 5: 1.10 },
  ie: { 1: 1.00, 3: 1.30, 5: 1.50 },
}

export function applyCareerStageEarnings(
  country: string,
  baselineEarnings: number,
  targetStage: CareerStage,
): number {
  const multipliers = TO_CAREER_STAGE[country]
  if (!multipliers) return baselineEarnings
  const mult = multipliers[targetStage]
  if (!mult) return baselineEarnings
  return Math.round(baselineEarnings * mult)
}
