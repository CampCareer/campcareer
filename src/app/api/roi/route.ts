import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const VALID_SORT_FIELDS = ['roi_score', 'payback_years', 'net_salary', 'avg_cao_points'] as const
type SortField = typeof VALID_SORT_FIELDS[number]

// payback_years: ascending (fewer years = better), others: descending
const SORT_ASCENDING: Record<SortField, boolean> = {
  roi_score: false,
  net_salary: false,
  payback_years: true,
  avg_cao_points: false,
}

function getTableName(country: string, field: string, byCollegeId: boolean): string {
  if (country === 'au') return 'roi_explorer_au'
  if (country === 'ca') return 'roi_explorer_ca'
  if (country === 'uk') return 'roi_explorer_uk'
  if (country === 'ie') return 'roi_explorer_ie'
  // US: field view only for field searches without college_id filter
  if (field && !byCollegeId) return 'roi_explorer_by_field_us'
  return 'roi_explorer_us'
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const countryParam = searchParams.get('country')
  const country = countryParam === 'au' ? 'au'
    : countryParam === 'ca' ? 'ca'
    : countryParam === 'uk' ? 'uk'
    : countryParam === 'ie' ? 'ie'
    : 'us'
  const defaultState = country === 'au' ? 'NSW'
    : country === 'ca' ? 'ON'
    : country === 'uk' ? 'London'
    : country === 'ie' ? 'Leinster'
    : 'CA'
  const stateParam = searchParams.get('state') ?? ''
  const state = (stateParam === 'ALL_STATES' || !stateParam) ? defaultState : stateParam
  const field = searchParams.get('field') ?? ''
  const collegeId = searchParams.get('college_id') ?? ''
  const nfqLevelParam = searchParams.get('nfq_level')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 500)
  const sortParam = searchParams.get('sort') ?? 'roi_score'
  const careerStage = searchParams.get('career_stage') ?? 'early' // early | mid | senior

  const sort: SortField = VALID_SORT_FIELDS.includes(sortParam as SortField)
    ? (sortParam as SortField)
    : 'roi_score'

  // US only: map career stage to the corresponding roi_score column
  const effectiveSort: string = (country === 'us' && sort === 'roi_score')
    ? (careerStage === 'mid' ? 'roi_score_mid' : careerStage === 'senior' ? 'roi_score_senior' : 'roi_score')
    : sort

  const tableName = getTableName(country, field, !!collegeId)

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .gt('roi_score', 0)
      .gt('payback_years', 0)

    // For US mid/senior stages, also exclude rows where the target column is null/zero
    if (country === 'us' && effectiveSort !== 'roi_score') {
      query = query.gt(effectiveSort, 0)
    }

    if (collegeId) {
      // college detail: return all city combinations for this college
      query = query.eq('college_id', collegeId)
    } else {
      query = query.eq('college_state', state)
      if (field) {
        query = query.ilike('field_name', `%${field}%`)
      }
      if (country === 'ie' && nfqLevelParam) {
        query = query.eq('nfq_level', parseInt(nfqLevelParam, 10))
      }
    }

    const { data, count, error } = await query
      .order(effectiveSort, { ascending: SORT_ASCENDING[sort], nullsFirst: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
