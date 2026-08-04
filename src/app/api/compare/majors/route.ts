import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { toProductCountryCode } from '@/lib/data-foundation/entity-aliases'

const COUNTRY_MAP: Record<string, string> = {
  us: 'US',
  au: 'AU',
  ca: 'CA',
  gb: 'UK',
  ie: 'IE',
}

export async function GET(request: NextRequest) {
  const rawCountry = request.nextUrl.searchParams.get('country') || 'us'
  const country = toProductCountryCode(rawCountry) ?? rawCountry.toLowerCase()
  const slug = request.nextUrl.searchParams.get('slug')
  const dbCountry = COUNTRY_MAP[country]

  if (!dbCountry) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }

  if (slug) {
    const { data } = await supabase
      .from('majors')
      .select('*')
      .eq('slug', slug)
      .eq('country', dbCountry)
      .limit(1)

    return NextResponse.json(
      { data: (data ?? [])[0] ?? null },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  }

  const { data } = await supabase
    .from('majors')
    .select('slug, name')
    .eq('country', dbCountry)
    .order('name')

  return NextResponse.json(
    { data: data ?? [] },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
