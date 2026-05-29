import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const VALID_SORT_FIELDS = ['roi_score', 'payback_years', 'net_salary'] as const
type SortField = typeof VALID_SORT_FIELDS[number]

// payback_years: ascending (fewer years = better), others: descending
const SORT_ASCENDING: Record<SortField, boolean> = {
  roi_score: false,
  net_salary: false,
  payback_years: true,
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const countryParam = searchParams.get('country')
  const country = countryParam === 'au' ? 'au' : countryParam === 'ca' ? 'ca' : 'us'
  const defaultState = country === 'au' ? 'NSW' : country === 'ca' ? 'ON' : 'CA'
  const state = searchParams.get('state') ?? defaultState
  const field = searchParams.get('field') ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)
  const sortParam = searchParams.get('sort') ?? 'roi_score'

  const sort: SortField = VALID_SORT_FIELDS.includes(sortParam as SortField)
    ? (sortParam as SortField)
    : 'roi_score'

  try {
    const query = country === 'au'
      ? supabase
          .from('roi_explorer_au')
          .select('*', { count: 'exact' })
          .eq('college_state', state)
          .gt('roi_score', 0)
          .gt('payback_years', 0)
      : country === 'ca'
      ? supabase
          .from('roi_explorer_ca')
          .select('*', { count: 'exact' })
          .eq('college_state', state)
          .gt('roi_score', 0)
          .gt('payback_years', 0)
      : field
        ? supabase
            .from('roi_explorer_by_field_us')
            .select('*', { count: 'exact' })
            .eq('college_state', state)
            .ilike('field_name', `%${field}%`)
            .gt('roi_score', 0)
            .gt('payback_years', 0)
        : supabase
            .from('roi_explorer_us')
            .select('*', { count: 'exact' })
            .eq('college_state', state)
            .gt('roi_score', 0)
            .gt('payback_years', 0)

    const { data, count, error } = await query
      .order(sort, { ascending: SORT_ASCENDING[sort] })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
