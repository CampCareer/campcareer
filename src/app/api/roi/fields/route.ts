import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''

  if (!q.trim()) {
    return NextResponse.json({ fields: [] })
  }

  const { data, error } = await supabase
    .from('programs')
    .select('field_name')
    .ilike('field_name', `%${q}%`)
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const seen = new Set<string>()
  const unique: string[] = []
  for (const r of data) {
    if (!seen.has(r.field_name)) {
      seen.add(r.field_name)
      unique.push(r.field_name)
    }
  }
  unique.sort()
  unique.splice(30)
  return NextResponse.json({ fields: unique })
}
