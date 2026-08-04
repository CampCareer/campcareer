export type CareerStage = 1 | 3 | 5

export const CAREER_STAGE_OPTIONS: CareerStage[] = [1, 3, 5]

export const COUNTRY_BASELINE_YEARS: Record<string, number> = {
  us: 6,
  uk: 1,
  gb: 1,
  ca: 2,
  au: 3,
  ie: 1,
}

const TO_CAREER_STAGE: Record<string, Record<number, number>> = {
  us: { 1: 0.59, 3: 0.76, 5: 0.94 },
  uk: { 1: 1.00, 3: 1.17, 5: 1.35 },
  gb: { 1: 1.00, 3: 1.17, 5: 1.35 },
  ca: { 1: 0.85, 3: 1.10, 5: 1.35 },
  au: { 1: 0.85, 3: 1.00, 5: 1.18 },
  ie: { 1: 1.00, 3: 1.17, 5: 1.32 },
}

// Multiplier from stored baseline → target career year.
// Derived from official sources:
//   UK: HMRC LEO (5yr computing ~£42k, baseline 1yr ~£30k)
//   CA: StatCan Job Bank (5yr CS ~C$88k, baseline 2yr ~C$60k)
//   AU: QILT GOS-L (3yr ~A$83.5k, 5yr ~A$88k)
//   IE: CSO Revenue data (5yr ICT ~€50k, baseline 1yr ~€38k)
//   US: College Scorecard (6yr ~$85k)
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
