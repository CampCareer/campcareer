import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const q       = req.nextUrl.searchParams.get('q') ?? ''
  const country = req.nextUrl.searchParams.get('country') ?? 'us'

  if (!q.trim()) {
    return NextResponse.json({ fields: [] })
  }

  let rawNames: (string | null)[]

  if (country === 'ie') {
    // IE: field_name from the IE ROI view
    const { data, error } = await supabase
      .from('roi_explorer_ie')
      .select('field_name')
      .ilike('field_name', `%${q}%`)
      .not('field_name', 'is', null)
      .limit(500)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    rawNames = data.map((r) => r.field_name as string | null)
  } else if (country === 'au') {
    // AU: field_name from the AU ROI view
    const { data, error } = await supabase
      .from('roi_explorer_au')
      .select('field_name')
      .ilike('field_name', `%${q}%`)
      .not('field_name', 'is', null)
      .limit(500)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    rawNames = data.map((r) => r.field_name as string | null)
  } else {
    // US (default): field_name from the field-level ROI view
    const { data, error } = await supabase
      .from('roi_explorer_by_field_us')
      .select('field_name')
      .ilike('field_name', `%${q}%`)
      .not('field_name', 'is', null)
      .limit(500)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    rawNames = data.map((r) => r.field_name as string | null)
  }

  const seen = new Set<string>()
  const unique: string[] = []
  for (const name of rawNames) {
    const clean = name ? (country === 'us' ? name : name) : null
    if (clean && !seen.has(clean)) {
      seen.add(clean)
      unique.push(clean)
    }
  }
  unique.sort()
  unique.splice(30)
  return NextResponse.json({ fields: unique })
}
