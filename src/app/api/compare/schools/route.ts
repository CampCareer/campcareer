import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const ROI_TABLES: Record<string, string> = {
  us: 'roi_explorer_us',
  au: 'roi_explorer_au',
  ca: 'roi_explorer_ca',
  uk: 'roi_explorer_uk',
  ie: 'roi_explorer_ie',
}

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get('country') || 'us'
  const collegeId = request.nextUrl.searchParams.get('collegeId')
  const table = ROI_TABLES[country]

  if (!table) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }

  if (collegeId) {
    const { data } = await supabase
      .from(table)
      .select('*')
      .eq('college_id', collegeId)
      .gt('roi_score', 0)
      .gt('payback_years', 0)
      .order('roi_score', { ascending: false })
      .limit(5)

    return NextResponse.json(
      { data: data ?? [] },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  }

  const { data } = await supabase
    .from(table)
    .select('college_id, college_name, college_state')
    .gt('roi_score', 0)
    .gt('payback_years', 0)

  const seen = new Set<string>()
  const distinct = (data ?? [])
    .filter(row => {
      if (seen.has(row.college_id)) return false
      seen.add(row.college_id)
      return true
    })
    .sort((a, b) => a.college_name.localeCompare(b.college_name))

  return NextResponse.json(
    { data: distinct },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}


