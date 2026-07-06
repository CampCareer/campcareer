// Shared ROI Explorer query logic — used by both /api/roi (client filter changes)
// and the server-rendered /roi-explorer page. Keep all scoring adjustments
// (tax, medicine override, career stage, dedupe, re-sort) in here so the two
// paths can never drift apart.
import { supabase } from '@/lib/supabase'
import { getFieldSearchTerms } from '@/lib/field-aliases'
import { MEDICINE_FIRST_YEAR_SALARY, isMedicineField } from '@/lib/medicine-constants'
import { applyCareerStageEarnings, type CareerStage } from '@/lib/career-stage'
import { calcTax } from '@/lib/tax'
import { buildIlikeOrFilter } from '@/lib/postgrest-filter'
import { degreeYears } from '@/lib/degree-years'

export const VALID_SORT_FIELDS = ['roi_score', 'payback_years', 'net_salary', 'avg_cao_points'] as const
export type SortField = typeof VALID_SORT_FIELDS[number]

const SORT_ASCENDING: Record<SortField, boolean> = {
  roi_score: false,
  net_salary: false,
  payback_years: true,
  avg_cao_points: false,
}

export const VALID_COUNTRIES = ['us', 'au', 'ca', 'uk', 'ie', 'de'] as const
export type RoiCountry = typeof VALID_COUNTRIES[number]

export const DEFAULT_STATE: Record<RoiCountry, string> = {
  us: 'CA',
  au: 'NSW',
  ca: 'ON',
  uk: 'ALL_STATES',
  ie: 'Leinster',
  de: 'ALL_STATES',
}

function getTableName(country: string): string {
  if (country === 'au') return 'roi_explorer_au'
  if (country === 'ca') return 'roi_explorer_ca'
  if (country === 'uk') return 'roi_explorer_uk'
  if (country === 'ie') return 'roi_explorer_ie'
  if (country === 'de') return 'roi_explorer_de'
  return 'roi_explorer_us'
}

// Note: roi_explorer_us, roi_explorer_au, etc. are Supabase views (not base
// tables) built from the underlying datasets.  information_schema.columns may
// not return rows for them in some Postgres configurations — use pg_views or
// direct count queries to inspect them.
//
// roi_explorer_us   — institution-level US data; field_name is NULL (no field data)
// roi_explorer_by_field_us — field-level US data (56 k+ rows); has field_name,
//                            college_state, roi_score, net_salary, payback_years
// For US field searches we must use roi_explorer_by_field_us.

// ── 중복 제거 헬퍼 ───────────────────────────────────────────────────────────

function normalizeKeyPart(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/\.$/, '')
    .replace(/\s+/g, ' ')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBetterRow(candidate: any, current: any): boolean {
  const cRoi = candidate.roi_score ?? 0
  const kRoi = current.roi_score ?? 0
  if (cRoi !== kRoi) return cRoi > kRoi

  const cNet = candidate.net_salary ?? 0
  const kNet = current.net_salary ?? 0
  if (cNet !== kNet) return cNet > kNet

  const cTuition = candidate.tuition ?? Number.POSITIVE_INFINITY
  const kTuition = current.tuition ?? Number.POSITIVE_INFINITY
  return cTuition < kTuition
}

// ── Medicine earnings override ──────────────────────────────────────────────
// When searching for medicine, use attending/consultant first-year salary
// instead of the stored earnings (which use inconsistent career timepoints).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyMedicineOverride(row: any, country: string): any {
  const targetEarnings = MEDICINE_FIRST_YEAR_SALARY[country]
  if (!targetEarnings) return row

  const annualRent = (row.rent_median ?? row.city_rent_median ?? 0) * 12
  const livingCost = annualRent * 0.4
  const tuition = row.tuition ?? row.avg_net_price ?? 0
  const gradRate = row.graduation_rate ?? 1

  const netSalary = Math.max(0, targetEarnings - annualRent - livingCost)
  const totalTuition = tuition * degreeYears(country, row.duration_years)

  const roiScore = totalTuition > 0 && netSalary > 0
    ? Math.round(((netSalary * gradRate) / totalTuition) * 10000) / 100
    : 0

  const paybackYears = netSalary > 0
    ? Math.round(totalTuition / netSalary)
    : 0

  const state = row.college_state ?? ''
  const taxAmount = calcTax(targetEarnings, country, state)

  return {
    ...row,
    median_earnings: Math.round(targetEarnings),
    net_salary: Math.round(netSalary),
    roi_score: roiScore,
    payback_years: paybackYears,
    gross_salary: Math.round(targetEarnings),
    tax_amount: taxAmount,
    net_salary_after_tax: Math.round(targetEarnings - taxAmount),
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export type RoiQueryParams = {
  country?: string | null
  state?: string | null
  field?: string | null
  collegeId?: string | null
  nfqLevel?: string | null
  limit?: number | null
  sort?: string | null
  careerStage?: string | null
}

export type RoiQueryResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  count: number
  rawCount: number | null
  fieldQuery?: { requested: string; matchedTerms: string[]; fallbackApplied: true }
  regionQuery?: { requested: string; applied: string }
}

export function normalizeRoiCountry(countryParam: string | null | undefined): RoiCountry {
  return (VALID_COUNTRIES as readonly string[]).includes(countryParam ?? '')
    ? (countryParam as RoiCountry)
    : 'us'
}

export async function fetchRoiData(params: RoiQueryParams): Promise<RoiQueryResult> {
  const country = normalizeRoiCountry(params.country)
  const defaultState = DEFAULT_STATE[country]

  const stateParam = params.state ?? ''
  const rawState = stateParam || defaultState
  // 'London' is not a valid college_state in roi_explorer_uk; normalise to ALL_STATES
  // so legacy bookmarks / old UI code never returns zero rows.
  const state = (country === 'uk' && rawState === 'London') ? 'ALL_STATES' : rawState
  const regionNormalised = state !== rawState
  const field = params.field ?? ''
  const collegeId = params.collegeId ?? ''
  const nfqLevelParam = params.nfqLevel ?? null
  const requestedLimit = params.limit
  const limit = Math.min(
    typeof requestedLimit === 'number' && Number.isFinite(requestedLimit) && requestedLimit > 0
      ? requestedLimit
      : 50,
    500
  )
  const sortParam = params.sort ?? 'roi_score'
  const careerStage = params.careerStage ?? 'early'

  let sort: SortField = VALID_SORT_FIELDS.includes(sortParam as SortField)
    ? (sortParam as SortField)
    : 'roi_score'
  // avg_cao_points exists only on the IE table — sorting other tables by it errors out.
  if (sort === 'avg_cao_points' && country !== 'ie') sort = 'roi_score'

  // When searching US + field: route to roi_explorer_by_field_us (field_name data lives there).
  // roi_explorer_us has field_name = NULL for all rows; field searches against it return nothing.
  // collegeId lookups always use the institution-level table (roi_explorer_us) regardless.
  const useUsFieldTable = country === 'us' && field.trim().length > 0 && !collegeId

  const tableName = useUsFieldTable ? 'roi_explorer_by_field_us' : getTableName(country)

  // roi_explorer_by_field_us likely does not have roi_score_mid / roi_score_senior columns
  // (those exist only on the institution-level roi_explorer_us view).  Fall back to roi_score.
  const effectiveSort: string = (country === 'us' && !useUsFieldTable && sort === 'roi_score')
    ? (careerStage === 'mid' ? 'roi_score_mid' : careerStage === 'senior' ? 'roi_score_senior' : 'roi_score')
    : sort

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from(tableName)
    .select('*', { count: 'exact' })
    .gt('roi_score', 0)
    .gt('payback_years', 0)

  // Only guard mid/senior sort columns for the institution-level US table
  if (country === 'us' && !useUsFieldTable && effectiveSort !== 'roi_score') {
    query = query.gt(effectiveSort, 0)
  }

  if (collegeId) {
    query = query.eq('college_id', collegeId)
  } else {
    if (state !== 'ALL_STATES') {
      query = query.eq('college_state', state)
    }

    if (field) query = query.ilike('field_name', `%${field}%`)
    if (country === 'ie' && nfqLevelParam) {
      query = query.eq('nfq_level', parseInt(nfqLevelParam, 10))
    }
  }

  const { data, count, error } = await query
    .order(effectiveSort, { ascending: SORT_ASCENDING[sort], nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('[roi-query] primary query failed:', error)
    throw new Error(error.message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enrichRow = (row: any) => {
    const gross = row.median_earnings ?? row.net_salary ?? 0
    const taxAmount = calcTax(gross, country, state)
    return {
      ...row,
      gross_salary: Math.round(gross),
      tax_amount: taxAmount,
      net_salary_after_tax: Math.round(gross - taxAmount),
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enriched: any[] = (data ?? []).map(enrichRow)

  // Alias fallback: when a field search returns zero rows, retry with broader terms.
  // Only for list requests (no college_id) to avoid affecting the detail page.
  let fallbackApplied = false
  if (field && enriched.length === 0 && !collegeId) {
    const aliasTerms = getFieldSearchTerms(field)
    const orFilter = buildIlikeOrFilter('field_name', aliasTerms)
    if (aliasTerms.length > 1 && orFilter) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fbQuery: any = supabase
        .from(tableName)
        .select('*')
        .gt('roi_score', 0)
        .gt('payback_years', 0)
        .or(orFilter)

      if (country === 'us' && !useUsFieldTable && effectiveSort !== 'roi_score') {
        fbQuery = fbQuery.gt(effectiveSort, 0)
      }
      if (state !== 'ALL_STATES') {
        fbQuery = fbQuery.eq('college_state', state)
      }
      if (country === 'ie' && nfqLevelParam) {
        fbQuery = fbQuery.eq('nfq_level', parseInt(nfqLevelParam, 10))
      }

      const { data: fbData, error: fbError } = await fbQuery
        .order(effectiveSort, { ascending: SORT_ASCENDING[sort], nullsFirst: false })
        .limit(limit)

      if (fbError) console.error('[roi-query] alias fallback query failed:', fbError)

      if (fbData && fbData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enriched = (fbData as any[]).map(enrichRow)
        fallbackApplied = true
      }
    }
  }

  // Medicine earnings: override with attending/consultant salary for realistic cross-country comparison.
  if (isMedicineField(field)) {
    enriched = enriched.map(row => applyMedicineOverride(row, country))
  }

  // Career stage: adjust earnings to target career year, recalculating net_salary
  // additively (net_salary = earnings − rent, and rent is fixed across stages).
  // Skipped for medicine because it already uses a fixed attending/consultant salary.
  const stageNum: CareerStage | null = careerStage === 'early' ? 1 : careerStage === 'mid' ? 3 : careerStage === 'senior' ? 5 : null
  if (stageNum && !isMedicineField(field)) {
    enriched = enriched.map(row => {
      const oldEarnings = row.median_earnings ?? 0
      if (oldEarnings <= 0) return row
      const newEarnings = applyCareerStageEarnings(country, oldEarnings, stageNum)
      const earningsDelta = newEarnings - oldEarnings
      const oldNetSalary = row.net_salary ?? 0
      const newNetSalary = Math.max(0, oldNetSalary + earningsDelta)
      const updated = {
        ...row,
        median_earnings: Math.round(newEarnings),
        net_salary: Math.round(newNetSalary),
        roi_score: oldNetSalary > 0
          ? Math.round(row.roi_score * (newNetSalary / oldNetSalary) * 10) / 10
          : row.roi_score,
        payback_years: newNetSalary > 0 && oldNetSalary > 0
          ? Math.max(1, Math.round(row.payback_years * (oldNetSalary / newNetSalary)))
          : row.payback_years,
      }
      return enrichRow(updated)
    })
  }

  // Deduplicate list views: one row per college + field + state.
  // Skipped for college_id requests so the detail page still receives all field rows.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finalData: any[] = enriched
  if (!collegeId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bestByKey = new Map<string, any>()
    for (const row of enriched) {
      const key = [
        country,
        row.college_id || normalizeKeyPart(row.college_name),
        normalizeKeyPart(row.field_name),
        normalizeKeyPart(row.college_state),
      ].join('|')
      const current = bestByKey.get(key)
      if (!current || isBetterRow(row, current)) {
        bestByKey.set(key, row)
      }
    }
    finalData = Array.from(bestByKey.values())
  }

  // Medicine / career-stage overrides scale each row by a different ratio
  // (rent varies per city), so the DB ordering may no longer hold — re-sort.
  const resortKey = effectiveSort
  const ascending = SORT_ASCENDING[sort]
  finalData = finalData.slice().sort((a, b) => {
    const av = a[resortKey] ?? (ascending ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
    const bv = b[resortKey] ?? (ascending ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
    return ascending ? av - bv : bv - av
  })

  return {
    data: finalData,
    count: finalData.length,
    rawCount: count,
    ...(fallbackApplied && {
      fieldQuery: {
        requested: field,
        matchedTerms: getFieldSearchTerms(field),
        fallbackApplied: true as const,
      },
    }),
    ...(regionNormalised && {
      regionQuery: { requested: stateParam, applied: state },
    }),
  }
}
