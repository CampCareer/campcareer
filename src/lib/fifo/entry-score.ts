export type EntryScoreComponents = {
  pay: number
  accessibility: number
  demand: number
  trainingBurden: number
}

export const FIFO_ENTRY_SCORE_WEIGHTS = {
  pay: 0.35,
  accessibility: 0.30,
  demand: 0.20,
  trainingBurden: 0.15,
} as const

export type EntryScoreBand = "Excellent" | "Strong" | "Mixed" | "Weak" | "Poor"

export function calculateFifoEntryScore(components: EntryScoreComponents) {
  const entries = Object.entries(components) as [keyof EntryScoreComponents, number][]
  for (const [key, value] of entries) {
    if (!Number.isFinite(value) || value < 0 || value > 10) {
      throw new RangeError(`FIFO Entry Score component ${key} must be between 0 and 10`)
    }
  }

  const weighted =
    components.pay * FIFO_ENTRY_SCORE_WEIGHTS.pay +
    components.accessibility * FIFO_ENTRY_SCORE_WEIGHTS.accessibility +
    components.demand * FIFO_ENTRY_SCORE_WEIGHTS.demand +
    components.trainingBurden * FIFO_ENTRY_SCORE_WEIGHTS.trainingBurden

  return Math.round(weighted * 10)
}

export function fifoEntryScoreBand(score: number): EntryScoreBand {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new RangeError("FIFO Entry Score must be between 0 and 100")
  }
  if (score >= 85) return "Excellent"
  if (score >= 70) return "Strong"
  if (score >= 55) return "Mixed"
  if (score >= 40) return "Weak"
  return "Poor"
}
