import { degreeYears } from "./degree-years"

export type SchoolScoreInput = {
  country: string
  tuition: number | null | undefined
  duration_years?: number | null | undefined
  median_earnings: number | null | undefined
  employment_rate: number | null | undefined
}

export type SchoolScoreBreakdown = {
  earnings: number | null
  employment: number | null
  affordability: number | null
}

export type ScoredSchool<T extends SchoolScoreInput> = T & {
  score: number | null
  total_tuition: number | null
  score_breakdown: SchoolScoreBreakdown
}

const EARNINGS_WEIGHT = 0.45
const EMPLOYMENT_WEIGHT = 0.3
const AFFORDABILITY_WEIGHT = 0.25

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function isNonNegativeFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function isEmploymentRate(value: number | null | undefined): value is number {
  return isNonNegativeFiniteNumber(value) && value <= 100
}

function percentilesByValue(values: readonly number[], higherIsBetter: boolean): Map<number, number> {
  const percentiles = new Map<number, number>()
  if (values.length === 1) {
    percentiles.set(values[0], 100)
    return percentiles
  }

  const sorted = [...values].sort((left, right) => left - right)
  let start = 0
  while (start < sorted.length) {
    let end = start
    while (end + 1 < sorted.length && sorted[end + 1] === sorted[start]) end += 1

    // Average ranks give every tied value the same position in the cohort.
    const position = (start + end) / 2
    const ascendingPercentile = (position / (sorted.length - 1)) * 100
    percentiles.set(sorted[start], higherIsBetter ? ascendingPercentile : 100 - ascendingPercentile)
    start = end + 1
  }

  return percentiles
}

/**
 * Scores schools relative to this complete-metric cohort on a 100-point scale.
 * This is not an ROI calculation: it compares observed earnings, employment,
 * and total tuition only, and its values change when the peer cohort changes.
 */
export function scoreSchools<T extends SchoolScoreInput>(rows: readonly T[]): ScoredSchool<T>[] {
  const rowsWithTuition = rows.map((row) => {
    const total_tuition = isNonNegativeFiniteNumber(row.tuition)
      ? row.tuition * degreeYears(row.country, row.duration_years)
      : null

    return {
      row,
      total_tuition: total_tuition != null && Number.isFinite(total_tuition) ? total_tuition : null,
    }
  })

  const validRows = rowsWithTuition.flatMap(({ row, total_tuition }) => {
    if (
      total_tuition == null ||
      !isNonNegativeFiniteNumber(row.median_earnings) ||
      !isEmploymentRate(row.employment_rate)
    ) return []

    return [{ earnings: row.median_earnings, employment: row.employment_rate, total_tuition }]
  })
  const earningsPercentiles = percentilesByValue(
    validRows.map((item) => item.earnings),
    true,
  )
  const employmentPercentiles = percentilesByValue(
    validRows.map((item) => item.employment),
    true,
  )
  const affordabilityPercentiles = percentilesByValue(
    validRows.map((item) => item.total_tuition),
    false,
  )

  return rowsWithTuition.map(({ row, total_tuition }) => {
    if (
      total_tuition == null ||
      !isNonNegativeFiniteNumber(row.median_earnings) ||
      !isEmploymentRate(row.employment_rate)
    ) {
      return {
        ...row,
        score: null,
        total_tuition,
        score_breakdown: { earnings: null, employment: null, affordability: null },
      }
    }

    const earnings = earningsPercentiles.get(row.median_earnings)!
    const employment = employmentPercentiles.get(row.employment_rate)!
    const affordability = affordabilityPercentiles.get(total_tuition)!

    return {
      ...row,
      score: roundToOneDecimal(
        (earnings * EARNINGS_WEIGHT) +
        (employment * EMPLOYMENT_WEIGHT) +
        (affordability * AFFORDABILITY_WEIGHT),
      ),
      total_tuition,
      score_breakdown: {
        earnings: roundToOneDecimal(earnings),
        employment: roundToOneDecimal(employment),
        affordability: roundToOneDecimal(affordability),
      },
    }
  })
}
