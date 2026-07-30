import type { AuStateCode } from "@/data/au-route-study-contract"

export { AU_STATE_CODES, parseAuState } from "@/data/au-route-study-contract"
export type { AuStateCode } from "@/data/au-route-study-contract"

export type RouteJobsVacancy = {
  state: AuStateCode
  vacancyCount: number
  period: string
  includedUnitGroups: number
}

export type RouteJobsRegion = {
  state: AuStateCode
  sa4Code: string
  name: string
  employmentTotal: number
  annualChange: number | null
  /** Derived from the included groups' employment totals and annual change. */
  annualChangePct: number | null
  period: string
  includedUnitGroups: number
}

export type RouteJobsSource = {
  name: string
  url: string
  dataAsAt: string | null
  checkedAt: string | null
}

export type RouteJobs = {
  candidateId: string
  state: AuStateCode | null
  /** Exact OSCA titles to try in a live job board, plus the canonical intent. */
  titleSearches: string[]
  historicalUnitGroups: string[]
  vacancy: {
    source: RouteJobsSource
    series: "three_month_average"
    values: RouteJobsVacancy[]
  } | null
  regionalEmployment: {
    source: RouteJobsSource
    values: RouteJobsRegion[]
  } | null
}

export type RawRouteJobsVacancy = {
  state: string | null
  period: string | null
  vacancyCount: number | string | null
  unitGroup: string
}

/**
 * The JSA Internet Vacancy Index is published by ANZSCO unit group. A route
 * can contain several exact OSCA occupations, so values are summed only after
 * retaining the number of included historical unit groups in the response.
 */
export function aggregateLatestRouteVacancies(
  rows: readonly RawRouteJobsVacancy[],
  states: readonly AuStateCode[],
): RouteJobsVacancy[] {
  const validRows = rows.filter((row) =>
    row.period &&
    states.includes(row.state as AuStateCode) &&
    Number.isFinite(Number(row.vacancyCount)) &&
    Number(row.vacancyCount) >= 0,
  )
  const latestPeriod = validRows.reduce<string | null>((latest, row) => !latest || row.period! > latest ? row.period! : latest, null)
  if (!latestPeriod) return []

  const values = new Map<AuStateCode, { vacancyCount: number; groups: Set<string> }>()
  for (const row of validRows) {
    if (row.period !== latestPeriod) continue
    const state = row.state as AuStateCode
    const entry = values.get(state) ?? { vacancyCount: 0, groups: new Set<string>() }
    entry.vacancyCount += Number(row.vacancyCount)
    entry.groups.add(row.unitGroup)
    values.set(state, entry)
  }

  return [...values.entries()]
    .map(([state, value]) => ({
      state,
      vacancyCount: Math.round(value.vacancyCount),
      period: latestPeriod,
      includedUnitGroups: value.groups.size,
    }))
    .sort((a, b) => a.state.localeCompare(b.state))
}
