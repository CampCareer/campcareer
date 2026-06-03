import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const FIELD_ALIASES: Record<string, string> = {
  'computational': 'computer',
  'computational science': 'computer science',
  'information technology': 'computer',
  'software engineering': 'software',
  'data science': 'computer and information',
  'artificial intelligence': 'computer and information',
  'nursing.': 'registered nursing',
  'nursing': 'registered nursing',
  'biochemistry': 'biology',
  'biophysics': 'biology',
  'molecular biology': 'biology',
  'cell biology': 'biology',
  'microbiology': 'biology',
  'neuroscience': 'biology',
  'ecology': 'biology',
  'genetics': 'biology',
  'zoology': 'biology',
  'botany': 'biology',
  'pharmacy': 'pharmacology',
  'economics': 'business',
  'finance': 'business',
  'accounting': 'business',
  'marketing': 'business',
  'management': 'business',
  'mechanical engineering': 'engineering',
  'electrical engineering': 'engineering',
  'civil engineering': 'engineering',
  'chemical engineering': 'engineering',
}

const COUNTRIES = ['us', 'au', 'ca', 'uk', 'ie'] as const
type Country = typeof COUNTRIES[number]

const NON_US_TABLE: Record<Exclude<Country, 'us'>, string> = {
  au: 'roi_explorer_au',
  ca: 'roi_explorer_ca',
  uk: 'roi_explorer_uk',
  ie: 'roi_explorer_ie',
}

function summarise(data: { college_id: string; college_name: string; roi_score: number; net_salary: number; payback_years: number }[]) {
  const avg_roi     = data.reduce((s, r) => s + r.roi_score,     0) / data.length
  const avg_salary  = data.reduce((s, r) => s + r.net_salary,    0) / data.length
  const avg_payback = data.reduce((s, r) => s + r.payback_years, 0) / data.length

  const byCollege = new Map<string, typeof data[0]>()
  for (const row of data) {
    const prev = byCollege.get(row.college_id)
    if (!prev || row.roi_score > prev.roi_score) byCollege.set(row.college_id, row)
  }
  const top3 = Array.from(byCollege.values())
    .sort((a, b) => b.roi_score - a.roi_score)
    .slice(0, 3)
    .map(r => ({ college_id: r.college_id, college_name: r.college_name, roi_score: r.roi_score }))

  return {
    avg_roi:     Math.round(avg_roi * 10) / 10,
    avg_salary:  Math.round(avg_salary),
    avg_payback: Math.round(avg_payback * 10) / 10,
    top3,
    count: data.length,
  }
}

export async function GET(req: NextRequest) {
  const field = req.nextUrl.searchParams.get('field') ?? ''
  if (!field.trim()) {
    return NextResponse.json({ error: 'field is required' }, { status: 400 })
  }

  try {
    const results = await Promise.all(
      COUNTRIES.map(async (country) => {
        const EMPTY = { avg_roi: 0, avg_salary: 0, avg_payback: 0, top3: [], count: 0, field_data_available: country === 'us' }

        if (country === 'us') {
          const { data } = await supabase
            .from('roi_explorer_by_field_us')
            .select('college_id, college_name, roi_score, net_salary, payback_years')
            .ilike('field_name', `%${field}%`)
            .gt('roi_score', 0)
            .gt('payback_years', 0)
            .order('roi_score', { ascending: false })
            .limit(100)

          if (!data || data.length === 0) return [country, EMPTY]
          return [country, { ...summarise(data), field_data_available: true }]
        }

        // AU / CA / UK / IE — filter by field_name if provided
        let query = supabase
          .from(NON_US_TABLE[country])
          .select('college_id, college_name, roi_score, net_salary, payback_years')
          .gt('roi_score', 0)
          .gt('payback_years', 0)
          .order('roi_score', { ascending: false })
          .limit(100)

        const hasField = field.trim().length > 0
        if (hasField) {
          query = query.ilike('field_name', `%${field}%`)
        }

        const { data } = await query

        // fallback: 결과 없으면 첫 키워드로 재검색
        if ((!data || data.length === 0) && hasField) {
          const lowerField = field.toLowerCase().replace(/\.$/, '')
          const aliasKeyword = FIELD_ALIASES[lowerField]
            ?? FIELD_ALIASES[Object.keys(FIELD_ALIASES).find(k => lowerField.includes(k)) ?? '']

          const keyword = aliasKeyword
            ?? field.split(/[\s,]+/).find(w =>
                w.length > 3 &&
                !['and','the','of','for','in','other','general','sciences','studies'].includes(w.toLowerCase())
              )
            ?? field

          const { data: fallbackData } = await supabase
            .from(NON_US_TABLE[country])
            .select('college_id, college_name, roi_score, net_salary, payback_years')
            .gt('roi_score', 0)
            .gt('payback_years', 0)
            .ilike('field_name', `%${keyword}%`)
            .order('roi_score', { ascending: false })
            .limit(100)

          if (fallbackData && fallbackData.length > 0) {
            return [country, { ...summarise(fallbackData), field_data_available: true }]
          }
        }

        if (!data || data.length === 0) return [country, EMPTY]
        return [country, { ...summarise(data), field_data_available: hasField }]
      })
    )

    return NextResponse.json(Object.fromEntries(results))
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
