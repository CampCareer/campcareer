import "server-only"

import {
  AU_STATE_CODES,
  aggregateLatestRouteVacancies,
  parseAuState,
  type AuStateCode,
  type RouteJobs,
  type RouteJobsRegion,
} from "@/data/au-route-jobs-contract"
import { getAustraliaRouteCandidate } from "@/data/route-taxonomy"
import { supabaseAdmin } from "@/lib/supabase-admin"

type OccupationRow = {
  anzsco_v13: string | null
  occupation_en: string | null
}

type VacancyRow = {
  anzsco_unit_group: string
  state: string | null
  period: string | null
  vacancy_count: number | string | null
  source_name: string | null
  source_url: string | null
  retrieved_at: string | null
}

type RegionalEmploymentRow = {
  anzsco_unit_group: string
  state: string | null
  sa4_code: string | null
  sa4_name: string | null
  period: string | null
  employment_total: number | string | null
  annual_change: number | string | null
  annual_change_pct: number | string | null
  source_name: string | null
  source_url: string | null
  retrieved_at: string | null
}

const OSCA_SOURCE_URL = "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0"

/**
 * Joins only exact OSCA occupations in the route taxonomy to their published
 * historical ANZSCO unit-group data. Missing correspondence is a valid result:
 * live job links remain available, while JSA aggregate figures are withheld.
 */
export async function getAuRouteJobs(candidateId: string, state?: string | null): Promise<RouteJobs | null> {
  const candidate = getAustraliaRouteCandidate(candidateId)
  if (!candidate) return null
  const selectedState = parseAuState(state)

  const { data: occupations } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_v13, occupation_en")
    .in("anzsco_code", candidate.oscaCodes)

  const rows = (occupations as OccupationRow[] | null ?? [])
  const historicalUnitGroups = unique(rows.flatMap((row) => typeof row.anzsco_v13 === "string" && /^\d{6}$/.test(row.anzsco_v13) ? [row.anzsco_v13.slice(0, 4)] : []))
  const titleSearches = unique([candidate.label.en, ...rows.flatMap((row) => typeof row.occupation_en === "string" && row.occupation_en.trim() ? [row.occupation_en.trim()] : [])]).slice(0, 6)

  if (!historicalUnitGroups.length) {
    return { candidateId, state: selectedState, titleSearches, historicalUnitGroups, vacancy: null, regionalEmployment: null }
  }

  const [vacancyResult, regionalResult] = await Promise.all([
    supabaseAdmin
      .from("occupation_vacancies_au")
      .select("anzsco_unit_group, state, period, vacancy_count, source_name, source_url, retrieved_at")
      .in("anzsco_unit_group", historicalUnitGroups)
      .eq("series", "three_month_average")
      .order("period", { ascending: false })
      .limit(1000),
    selectedState
      ? supabaseAdmin
          .from("occupation_regional_employment_au")
          .select("anzsco_unit_group, state, sa4_code, sa4_name, period, employment_total, annual_change, annual_change_pct, source_name, source_url, retrieved_at")
          .in("anzsco_unit_group", historicalUnitGroups)
          .eq("state", selectedState)
          .order("period", { ascending: false })
          .limit(1000)
      : Promise.resolve({ data: [], error: null }),
  ])

  const vacancyRows = vacancyResult.error ? [] : (vacancyResult.data as VacancyRow[] | null ?? [])
  const vacancies = aggregateLatestRouteVacancies(
    vacancyRows.map((row) => ({ state: row.state, period: row.period, vacancyCount: row.vacancy_count, unitGroup: row.anzsco_unit_group })),
    AU_STATE_CODES,
  )
  const regionalRows = regionalResult.error ? [] : (regionalResult.data as RegionalEmploymentRow[] | null ?? [])

  return {
    candidateId,
    state: selectedState,
    titleSearches,
    historicalUnitGroups,
    vacancy: vacancies.length ? {
      source: {
        ...sourceFromRows(vacancyRows, "Jobs and Skills Australia Internet Vacancy Index", "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/internet-vacancy-index"),
        dataAsAt: vacancies[0]?.period ?? null,
      },
      series: "three_month_average",
      values: vacancies,
    } : null,
    regionalEmployment: selectedState ? regionalSignalFromRows(regionalRows, selectedState) : null,
  }
}

export { OSCA_SOURCE_URL }

function regionalSignalFromRows(rows: readonly RegionalEmploymentRow[], state: AuStateCode): RouteJobs["regionalEmployment"] {
  const validRows = rows.filter((row) => row.state === state && row.period && row.sa4_code && row.sa4_name && positiveInteger(row.employment_total) != null)
  const latestPeriod = validRows.reduce<string | null>((latest, row) => !latest || row.period! > latest ? row.period! : latest, null)
  if (!latestPeriod) return null

  const regions = new Map<string, { name: string; employmentTotal: number; annualChange: number; annualChangeComplete: boolean; groups: Set<string> }>()
  for (const row of validRows) {
    if (row.period !== latestPeriod || !row.sa4_code || !row.sa4_name) continue
    const entry = regions.get(row.sa4_code) ?? { name: row.sa4_name, employmentTotal: 0, annualChange: 0, annualChangeComplete: true, groups: new Set<string>() }
    entry.employmentTotal += positiveInteger(row.employment_total) ?? 0
    const annualChange = finiteNumber(row.annual_change)
    if (annualChange == null) entry.annualChangeComplete = false
    else entry.annualChange += annualChange
    entry.groups.add(row.anzsco_unit_group)
    regions.set(row.sa4_code, entry)
  }

  const values: RouteJobsRegion[] = [...regions.entries()]
    .map(([sa4Code, region]) => ({
      state,
      sa4Code,
      name: region.name,
      employmentTotal: Math.round(region.employmentTotal),
      annualChange: region.annualChangeComplete ? Math.round(region.annualChange) : null,
      // Percentages cannot be added across occupation groups. Reconstruct the
      // combined prior-year base from total employment and absolute change.
      annualChangePct: region.annualChangeComplete && region.employmentTotal - region.annualChange > 0
        ? Math.round((region.annualChange / (region.employmentTotal - region.annualChange)) * 10_000) / 100
        : null,
      period: latestPeriod,
      includedUnitGroups: region.groups.size,
    }))
    .sort((a, b) => b.employmentTotal - a.employmentTotal || a.name.localeCompare(b.name))
    .slice(0, 5)

  return values.length ? {
    source: {
      ...sourceFromRows(rows, "Jobs and Skills Australia National Employment Region (NERO)", "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/national-employment-region"),
      dataAsAt: latestPeriod,
    },
    values,
  } : null
}

function sourceFromRows(rows: readonly { source_name: string | null; source_url: string | null; retrieved_at: string | null }[], fallbackName: string, fallbackUrl: string) {
  const sourceRow = rows.find((row) => row.source_url) ?? null
  return {
    name: sourceRow?.source_name || fallbackName,
    url: sourceRow?.source_url || fallbackUrl,
    dataAsAt: null,
    checkedAt: latestCheckedAt(rows),
  }
}

function latestCheckedAt(rows: readonly { retrieved_at: string | null }[]) {
  const latest = rows.reduce<string | null>((current, row) => row.retrieved_at && (!current || row.retrieved_at > current) ? row.retrieved_at : current, null)
  return latest?.slice(0, 10) ?? null
}

function unique(values: readonly string[]) {
  return [...new Set(values)]
}

function finiteNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function positiveInteger(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null
}
