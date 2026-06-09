import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getFieldSearchTerms } from '@/lib/field-aliases'

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

        const aliasTerms = getFieldSearchTerms(field)
        const orFilter = aliasTerms.map(t => `field_name.ilike.%${t}%`).join(',')

        if (country === 'us') {
          // Primary: exact ilike match
          const { data } = await supabase
            .from('roi_explorer_by_field_us')
            .select('college_id, college_name, roi_score, net_salary, payback_years')
            .ilike('field_name', `%${field}%`)
            .gt('roi_score', 0)
            .gt('payback_years', 0)
            .order('roi_score', { ascending: false })
            .limit(100)

          if (data && data.length > 0) {
            return [country, { ...summarise(data), field_data_available: true }]
          }

          // Alias fallback for US
          if (aliasTerms.length > 1) {
            const { data: fbData } = await supabase
              .from('roi_explorer_by_field_us')
              .select('college_id, college_name, roi_score, net_salary, payback_years')
              .gt('roi_score', 0)
              .gt('payback_years', 0)
              .or(orFilter)
              .order('roi_score', { ascending: false })
              .limit(100)

            if (fbData && fbData.length > 0) {
              return [country, { ...summarise(fbData), field_data_available: true }]
            }
          }

          return [country, EMPTY]
        }

        // AU / CA / UK / IE — primary ilike, then alias OR fallback
        const hasField = field.trim().length > 0
        const { data } = await supabase
          .from(NON_US_TABLE[country])
          .select('college_id, college_name, roi_score, net_salary, payback_years')
          .gt('roi_score', 0)
          .gt('payback_years', 0)
          .ilike('field_name', `%${field}%`)
          .order('roi_score', { ascending: false })
          .limit(100)

        if (data && data.length > 0) {
          return [country, { ...summarise(data), field_data_available: hasField }]
        }

        // Alias fallback for non-US
        if (hasField && aliasTerms.length > 1) {
          const { data: fallbackData } = await supabase
            .from(NON_US_TABLE[country])
            .select('college_id, college_name, roi_score, net_salary, payback_years')
            .gt('roi_score', 0)
            .gt('payback_years', 0)
            .or(orFilter)
            .order('roi_score', { ascending: false })
            .limit(100)

          if (fallbackData && fallbackData.length > 0) {
            return [country, { ...summarise(fallbackData), field_data_available: true }]
          }
        }

        return [country, EMPTY]
      })
    )

    return NextResponse.json(Object.fromEntries(results))
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
