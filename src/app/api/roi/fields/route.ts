import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''

  if (!q.trim()) {
    return NextResponse.json({ fields: [] })
  }

  // programs table does not exist — query distinct field_name from the US ROI view
  const { data, error } = await supabase
    .from('roi_explorer_by_field_us')
    .select('field_name')
    .ilike('field_name', `%${q}%`)
    .not('field_name', 'is', null)
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const seen = new Set<string>()
  const unique: string[] = []
  for (const r of data) {
    const name = r.field_name as string | null
    if (name && !seen.has(name)) {
      seen.add(name)
      unique.push(name)
    }
  }
  unique.sort()
  unique.splice(30)
  return NextResponse.json({ fields: unique })
}
