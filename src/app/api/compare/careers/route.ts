import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

interface RawUSOcc {
  occ_code: string
  occ_title: string
  tot_emp: number
  median_wage: number
  pct_change: number
  annual_openings: number
  shortage_score: number
}

type RawData = {
  shortageByState: Record<string, RawUSOcc[]>
  highPayByState: Record<string, RawUSOcc[]>
}

const COUNTRY_MAP: Record<string, string> = {
  us: 'US',
  au: 'AU',
  ca: 'CA',
  uk: 'UK',
  ie: 'IE',
}

type CareerOption = { code: string; name: string }

type RegionEntry = { state: string; occ: RawUSOcc }

function loadUSOccs(): Map<string, { regions: RegionEntry[]; score: number }> {
  const raw = JSON.parse(readFileSync(join(process.cwd(), 'src/data/us-occupation-state.json'), 'utf-8')) as RawData
  const byCode = new Map<string, { regions: RegionEntry[]; score: number }>()
  for (const [state, occs] of Object.entries(raw.shortageByState)) {
    for (const occ of occs) {
      if (!byCode.has(occ.occ_code)) {
        byCode.set(occ.occ_code, { regions: [], score: occ.shortage_score })
      }
      byCode.get(occ.occ_code)!.regions.push({ state, occ })
    }
  }
  return byCode
}

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get('country') || 'us'
  const code = request.nextUrl.searchParams.get('code')
  const dbCountry = COUNTRY_MAP[country]

  if (!dbCountry) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }

  // US — from JSON file
  if (country === 'us') {
    const byCode = loadUSOccs()
    if (code) {
      const entry = byCode.get(code)
      if (!entry) {
        return NextResponse.json({ data: null })
      }
      const s = entry.regions[0].occ
      return NextResponse.json({
        data: {
          code: s.occ_code,
          name: s.occ_title,
          category: null,
          median_salary: s.median_wage,
          salary_currency: 'USD',
          shortage_score: entry.score,
          employment: s.tot_emp,
          growth_pct: s.pct_change,
          annual_openings: s.annual_openings,
          on_shortage_list: true,
          confidence: 'verified',
          source_name: 'BLS + Lightcast',
          regions: entry.regions.map(r => ({ name: r.state, score: r.occ.shortage_score })),
        },
      }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
    }
    const list: CareerOption[] = []
    const seen = new Set<string>()
    for (const occs of Object.values(byCode)) {
      for (const occ of occs) {
        if (!seen.has(occ.occ_code)) {
          seen.add(occ.occ_code)
          list.push({ code: occ.occ_code, name: occ.occ_title })
        }
      }
    }
    list.sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ data: list }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
  }

  // AU — from occupations_au table
  if (country === 'au') {
    if (code) {
      const { data } = await supabase
        .from('occupations_au')
        .select('*')
        .eq('anzsco_code', code)
        .limit(1)
      const row = (data ?? [])[0] as Record<string, unknown> | null
      if (!row) {
        return NextResponse.json({ data: null })
      }
      return NextResponse.json({
        data: {
          code: row.anzsco_code,
          name: row.occupation_en,
          category: row.related_broad_field ?? null,
          median_salary: row.median_salary_aud ?? null,
          salary_currency: 'AUD',
          shortage_score: row.shortage_rating != null ? (row.shortage_rating as number) * 20 : null,
          employment: null,
          growth_pct: null,
          annual_openings: null,
          on_shortage_list: row.on_csol ?? false,
          confidence: row.confidence ?? null,
          source_name: row.source_name ?? null,
          regions: null,
        },
      }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
    }
    const { data } = await supabase
      .from('occupations_au')
      .select('anzsco_code, occupation_en')
      .order('occupation_en')
    return NextResponse.json({
      data: ((data ?? []) as { anzsco_code: string; occupation_en: string }[])
        .filter(r => r.anzsco_code)
        .map(r => ({ code: r.anzsco_code!, name: r.occupation_en })),
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
  }

  // IE — from shortage_occupations_ie table
  if (country === 'ie') {
    if (code) {
      const { data } = await supabase
        .from('shortage_occupations_ie')
        .select('*')
        .eq('soc_code', code)
        .limit(1)
      const row = (data ?? [])[0] as Record<string, unknown> | null
      if (!row) {
        return NextResponse.json({ data: null })
      }
      return NextResponse.json({
        data: {
          code: row.soc_code,
          name: row.category,
          category: null,
          median_salary: null,
          salary_currency: 'EUR',
          shortage_score: 80,
          employment: null,
          growth_pct: null,
          annual_openings: null,
          on_shortage_list: true,
          confidence: 'verified',
          source_name: 'DETE Critical Skills List',
          regions: null,
        },
      }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
    }
    const { data } = await supabase
      .from('shortage_occupations_ie')
      .select('soc_code, category')
      .order('category')
    const seen = new Set<string>()
    const list: CareerOption[] = []
    for (const r of (data ?? []) as { soc_code: string; category: string }[]) {
      const key = `${r.soc_code}|${r.category}`
      if (!seen.has(key)) {
        seen.add(key)
        list.push({ code: r.soc_code, name: r.category })
      }
    }
    return NextResponse.json({ data: list }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
  }

  // CA / UK — no occupation table yet
  return NextResponse.json({
    data: [],
    note: `Occupation data for ${dbCountry} is not available yet.`,
  })
}
