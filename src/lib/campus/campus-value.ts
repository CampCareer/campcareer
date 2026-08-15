export const CAMPUS_VALUE_WEIGHTS = {
  earnings: 0.45,
  employment: 0.30,
  affordability: 0.25,
} as const

export const CAMPUS_VALUE_MIN_COMPLETE_ROWS = 5
export const CAMPUS_VALUE_MIN_PROVIDERS = 3

export type CampusValueInput = {
  programmeId: string
  institutionId: string
  annualTuition: number | null
  durationMonths: number | null
  medianEarnings: number | null
  employmentRatePct: number | null
}

export type CampusValueBreakdown = {
  earnings: number | null
  employment: number | null
  affordability: number | null
}

export type CampusValueScoredRow<T extends CampusValueInput> = T & {
  totalTuition: number | null
  score: number | null
  scoreBreakdown: CampusValueBreakdown
  completeValueInput: boolean
}

export type CampusValueReadiness = {
  ready: boolean
  completeRows: number
  providers: number
  minimumCompleteRows: number
  minimumProviders: number
  reasons: string[]
}

export type CampusValueCohort<T extends CampusValueInput> = {
  readiness: CampusValueReadiness
  rows: CampusValueScoredRow<T>[]
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function isFinitePositive(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

function isEmploymentRatePct(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
}

function totalTuition(row: CampusValueInput): number | null {
  if (!isFinitePositive(row.annualTuition) || !isFinitePositive(row.durationMonths)) return null
  const total = row.annualTuition * (row.durationMonths / 12)
  return Number.isFinite(total) && total > 0 ? total : null
}

function completeRow(row: CampusValueInput, tuition: number | null): boolean {
  return tuition != null
    && isFinitePositive(row.medianEarnings)
    && isEmploymentRatePct(row.employmentRatePct)
}

function percentileMap(values: readonly number[], higherIsBetter: boolean): Map<number, number> {
  const percentiles = new Map<number, number>()
  if (values.length === 0) return percentiles
  if (values.length === 1) {
    percentiles.set(values[0], 100)
    return percentiles
  }

  const sorted = [...values].sort((left, right) => left - right)
  let start = 0
  while (start < sorted.length) {
    let end = start
    while (end + 1 < sorted.length && sorted[end + 1] === sorted[start]) end += 1

    const averagePosition = (start + end) / 2
    const ascendingPercentile = (averagePosition / (sorted.length - 1)) * 100
    percentiles.set(
      sorted[start],
      higherIsBetter ? ascendingPercentile : 100 - ascendingPercentile,
    )
    start = end + 1
  }

  return percentiles
}

export function assessCampusValueReadiness<T extends CampusValueInput>(rows: readonly T[]): CampusValueReadiness {
  const complete = rows.flatMap((row) => {
    const tuition = totalTuition(row)
    return completeRow(row, tuition) ? [row] : []
  })
  const providers = new Set(complete.map((row) => row.institutionId)).size
  const reasons: string[] = []

  if (complete.length < CAMPUS_VALUE_MIN_COMPLETE_ROWS) {
    reasons.push(`Need at least ${CAMPUS_VALUE_MIN_COMPLETE_ROWS} complete comparable programmes.`)
  }
  if (providers < CAMPUS_VALUE_MIN_PROVIDERS) {
    reasons.push(`Need at least ${CAMPUS_VALUE_MIN_PROVIDERS} providers with complete comparable evidence.`)
  }

  return {
    ready: reasons.length === 0,
    completeRows: complete.length,
    providers,
    minimumCompleteRows: CAMPUS_VALUE_MIN_COMPLETE_ROWS,
    minimumProviders: CAMPUS_VALUE_MIN_PROVIDERS,
    reasons,
  }
}

/**
 * Score one already-comparable Campus cohort.
 *
 * Callers must construct the cohort using exactly one country, field,
 * qualification level and student market before calling this function.
 * Incomplete rows remain visible but never receive a numeric score.
 */
export function scoreCampusValueCohort<T extends CampusValueInput>(rows: readonly T[]): CampusValueCohort<T> {
  const prepared = rows.map((row) => {
    const tuition = totalTuition(row)
    return {
      row,
      totalTuition: tuition,
      complete: completeRow(row, tuition),
    }
  })

  const readiness = assessCampusValueReadiness(rows)
  const complete = prepared.filter((item) => item.complete)

  if (!readiness.ready) {
    return {
      readiness,
      rows: prepared.map(({ row, totalTuition: tuition, complete: isComplete }) => ({
        ...row,
        totalTuition: tuition,
        score: null,
        scoreBreakdown: { earnings: null, employment: null, affordability: null },
        completeValueInput: isComplete,
      })),
    }
  }

  const earningsPercentiles = percentileMap(
    complete.map((item) => item.row.medianEarnings as number),
    true,
  )
  const employmentPercentiles = percentileMap(
    complete.map((item) => item.row.employmentRatePct as number),
    true,
  )
  const affordabilityPercentiles = percentileMap(
    complete.map((item) => item.totalTuition as number),
    false,
  )

  return {
    readiness,
    rows: prepared.map(({ row, totalTuition: tuition, complete: isComplete }) => {
      if (!isComplete || tuition == null || row.medianEarnings == null || row.employmentRatePct == null) {
        return {
          ...row,
          totalTuition: tuition,
          score: null,
          scoreBreakdown: { earnings: null, employment: null, affordability: null },
          completeValueInput: false,
        }
      }

      const earnings = earningsPercentiles.get(row.medianEarnings)!
      const employment = employmentPercentiles.get(row.employmentRatePct)!
      const affordability = affordabilityPercentiles.get(tuition)!
      const score =
        earnings * CAMPUS_VALUE_WEIGHTS.earnings
        + employment * CAMPUS_VALUE_WEIGHTS.employment
        + affordability * CAMPUS_VALUE_WEIGHTS.affordability

      return {
        ...row,
        totalTuition: tuition,
        score: roundToOneDecimal(score),
        scoreBreakdown: {
          earnings: roundToOneDecimal(earnings),
          employment: roundToOneDecimal(employment),
          affordability: roundToOneDecimal(affordability),
        },
        completeValueInput: true,
      }
    }),
  }
}
