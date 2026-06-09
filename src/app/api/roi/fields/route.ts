import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getFieldSearchTerms } from '@/lib/field-aliases'

function tableForCountry(country: string): string {
  if (country === 'ie') return 'roi_explorer_ie'
  if (country === 'au') return 'roi_explorer_au'
  if (country === 'ca') return 'roi_explorer_ca'
  if (country === 'uk') return 'roi_explorer_uk'
  return 'roi_explorer_by_field_us'
}

export async function GET(req: NextRequest) {
  const q       = req.nextUrl.searchParams.get('q') ?? ''
  const country = req.nextUrl.searchParams.get('country') ?? 'us'

  if (!q.trim()) {
    return NextResponse.json({ fields: [] })
  }

  const tableName = tableForCountry(country)

  // Primary: exact ilike match
  const { data: primary, error } = await supabase
    .from(tableName)
    .select('field_name')
    .ilike('field_name', `%${q}%`)
    .not('field_name', 'is', null)
    .limit(500)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let rawNames = (primary ?? []).map(r => r.field_name as string | null)

  // Alias fallback: if no exact suggestions found, try alias terms
  if (rawNames.length === 0) {
    const aliasTerms = getFieldSearchTerms(q)
    if (aliasTerms.length > 1) {
      const orFilter = aliasTerms
        .map(t => `field_name.ilike.%${t}%`)
        .join(',')

      const { data: aliasData } = await supabase
        .from(tableName)
        .select('field_name')
        .not('field_name', 'is', null)
        .or(orFilter)
        .limit(500)

      rawNames = (aliasData ?? []).map(r => r.field_name as string | null)
    }
  }

  const seen = new Set<string>()
  const unique: string[] = []
  for (const name of rawNames) {
    if (name && !seen.has(name)) {
      seen.add(name)
      unique.push(name)
    }
  }
  unique.sort()
  unique.splice(30)
  return NextResponse.json({ fields: unique })
}
