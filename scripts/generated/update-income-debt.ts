import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve('/Users/yehunlee/campcareer/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const today = '2026-06-30'

const DATA: Record<string, { p25: number; p75: number; debt: number }> = {
  'computer-science':      { p25: 74830, p75: 152038, debt: 31017 },
  'data-analytics':        { p25: 74169, p75: 150326, debt: 31221 },
  'software-engineering':  { p25: 79895, p75: 141943, debt: 32226 },
  'nursing':               { p25: 67807, p75: 114393, debt: 20864 },
  'civil-engineering':     { p25: 73883, p75: 101174, debt: 35101 },
  'business-management':   { p25: 47762, p75: 93825,  debt: 21551 },
  'accounting':            { p25: 56205, p75: 97191,  debt: 29108 },
  'ux-design':             { p25: 32910, p75: 70406,  debt: 51747 },
  'psychology':            { p25: 35740, p75: 67229,  debt: 30834 },
  'music':                 { p25: 26048, p75: 58755,  debt: 47181 },
  'mechanical-engineering':{ p25: 77665, p75: 109050, debt: 36460 },
  'electrical-engineering':{ p25: 84635, p75: 122440, debt: 31266 },
  'biology':               { p25: 38929, p75: 79199,  debt: 34468 },
  'finance':               { p25: 60801, p75: 111527, debt: 38133 },
  'marketing':             { p25: 49693, p75: 93086,  debt: 36445 },
  'economics':             { p25: 57773, p75: 115095, debt: 40939 },
  'mathematics':           { p25: 49058, p75: 97414,  debt: 31804 },
  'chemical-engineering':  { p25: 80300, p75: 117974, debt: 34420 },
  'communications':        { p25: 39504, p75: 75978,  debt: 32358 },
  'political-science':     { p25: 44731, p75: 85350,  debt: 39028 },
}

async function main() {
  for (const [slug, d] of Object.entries(DATA)) {
    const { data: current } = await supabase
      .from('majors')
      .select('layer_meta')
      .eq('slug', slug)
      .eq('country', 'US')
      .single()

    const currentMeta = (current?.layer_meta as Record<string, unknown>) ?? {}
    const updatedMeta = {
      ...currentMeta,
      debt: {
        confidence: 'verified',
        last_verified: today,
        source_name: 'College Scorecard Field of Study Data (06102026)',
        source_url: 'https://collegescorecard.ed.gov/data/',
        note: {
          en: 'Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.',
          ko: '졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k.',
        },
      },
    }

    const { error } = await supabase
      .from('majors')
      .update({
        earnings_p25: d.p25,
        earnings_p75: d.p75,
        median_debt: d.debt,
        layer_meta: updatedMeta as never,
      })
      .eq('slug', slug)
      .eq('country', 'US')

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${slug}: p25=$${d.p25}  p75=$${d.p75}  debt=$${d.debt}`)
    }
  }

  const { data: verify } = await supabase
    .from('majors')
    .select('slug, earnings_p25, earnings_p75, median_debt')
    .eq('country', 'US')
    .order('slug')

  console.table(verify ?? [])
}

main().catch(console.error)
