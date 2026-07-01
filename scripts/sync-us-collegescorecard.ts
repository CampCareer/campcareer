import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Extracted College Scorecard data
const SCORECARD_DATA: Record<string, {
  median_earnings: number
  tuition: number
  employment_rate: number
  source_url: string
}> = {
  'computer-science':   { median_earnings: 73404, tuition: 34779, employment_rate: 93, source_url: 'https://collegescorecard.ed.gov/search/?cip=11.0701&credential=3' },
  'data-analytics':     { median_earnings: 72111, tuition: 34765, employment_rate: 93, source_url: 'https://collegescorecard.ed.gov/search/?cip=11.0701,27.0501&credential=3' },
  'software-engineering': { median_earnings: 76067, tuition: 34087, employment_rate: 94, source_url: 'https://collegescorecard.ed.gov/search/?cip=11.0701,14.0901,14.1001&credential=3' },
  'nursing':            { median_earnings: 75419, tuition: 26856, employment_rate: 98, source_url: 'https://collegescorecard.ed.gov/search/?cip=51.3801&credential=3' },
  'civil-engineering':  { median_earnings: 69072, tuition: 34006, employment_rate: 97, source_url: 'https://collegescorecard.ed.gov/search/?cip=14.0801&credential=3' },
  'business-management': { median_earnings: 47119, tuition: 27773, employment_rate: 94, source_url: 'https://collegescorecard.ed.gov/search/?cip=52.0101,52.0201&credential=3' },
  'accounting':         { median_earnings: 53755, tuition: 29618, employment_rate: 94, source_url: 'https://collegescorecard.ed.gov/search/?cip=52.0301&credential=3' },
  'ux-design':          { median_earnings: 33413, tuition: 32054, employment_rate: 90, source_url: 'https://collegescorecard.ed.gov/search/?cip=50.0401&credential=3' },
  'psychology':         { median_earnings: 31713, tuition: 32488, employment_rate: 92, source_url: 'https://collegescorecard.ed.gov/search/?cip=42.0101&credential=3' },
  'music':              { median_earnings: 28062, tuition: 34134, employment_rate: 90, source_url: 'https://collegescorecard.ed.gov/search/?cip=50.0901&credential=3' },
}

function computePaybackYears(tuition: number, salary: number): number {
  const totalTuition = tuition * 4
  // Assume ~35% of gross salary is available for tuition savings
  // (after tax ~25% + living costs ~40% of gross for a single graduate)
  const annualSavings = salary * 0.35
  if (annualSavings <= 5000) return 99
  return Math.max(1, Math.round(totalTuition / annualSavings))
}

async function main() {
  console.log('Fetching current US majors from Supabase...')
  const { data: current, error } = await supabase
    .from('majors')
    .select('slug, median_starting_salary, avg_annual_tuition_intl, employment_rate, payback_years, data_confidence, last_verified, sources, layer_meta')
    .eq('country', 'US')
    .order('slug')

  if (error) {
    console.error('Failed to fetch majors:', error.message)
    process.exit(1)
  }

  if (!current || current.length === 0) {
    console.error('No US majors found in DB. Run the seed SQL first.')
    process.exit(1)
  }

  console.log(`Found ${current.length} US majors\n`)

  const today = new Date().toISOString().split('T')[0]

  console.log('=== CHANGE LOG ===\n')
  console.log('MAJOR                    CURRENT_SALARY → NEW_SALARY   CURRENT_TUITION → NEW_TUITION   CURRENT_EMP → NEW_EMP   PAYBACK(old→new)\n')

  const updates: Array<{
    slug: string
    median_starting_salary: number
    avg_annual_tuition_intl: number
    employment_rate: number
    employment_score: number
    payback_years: number
    data_confidence: string
    last_verified: string
    sources: unknown
    layer_meta: unknown
  }> = []

  for (const row of current) {
    const slug = row.slug as string
    const cs = SCORECARD_DATA[slug]
    if (!cs) {
      console.log(`  ${slug.padEnd(22)} — NO COLLEGE SCORECARD DATA, skipping`)
      continue
    }

    const newPayback = computePaybackYears(cs.tuition, cs.median_earnings)
    const oldSalary = row.median_starting_salary ?? 0
    const oldTuition = row.avg_annual_tuition_intl ?? 0
    const oldEmp = row.employment_rate ?? 0
    const oldPayback = row.payback_years ?? 0

    const arrow = '→'

    // Build updated sources array
    const currentSources = (row.sources as Array<{ name: string; url: string }>) ?? []
    const csSourceEntry = {
      name: `College Scorecard — ${slug} field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)`,
      url: cs.source_url,
    }
    const hasCsSource = currentSources.some(s => s.name.includes('College Scorecard'))
    const updatedSources = hasCsSource
      ? currentSources.map(s => s.name.includes('College Scorecard') ? csSourceEntry : s)
      : [...currentSources, csSourceEntry]

    // Build updated layer_meta
    const currentMeta = (row.layer_meta as Record<string, { confidence: string; source_name?: string; source_url?: string; last_verified?: string | null; note?: unknown }>) ?? {}
    const updatedMeta = {
      ...currentMeta,
      employment: {
        confidence: 'verified',
        last_verified: today,
        source_name: 'College Scorecard Field of Study Data (06102026)',
        source_url: 'https://collegescorecard.ed.gov/data/',
        note: { en: 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', ko: '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율' },
      },
      roi: {
        confidence: 'verified',
        last_verified: today,
        source_name: 'College Scorecard Field of Study Data (06102026)',
        source_url: 'https://collegescorecard.ed.gov/data/',
        note: { en: 'Salary: median earnings 1 year post-graduation (all institutions). Tuition: out-of-state tuition proxy for international costs.', ko: '급여: 졸업 1년 후 중위 소득(전체 기관). 학비: 국제학생 비용 대용으로 out-of-state 등록금 사용.' },
      },
    }

    updates.push({
      slug,
      median_starting_salary: cs.median_earnings,
      avg_annual_tuition_intl: cs.tuition,
      employment_rate: cs.employment_rate,
      employment_score: cs.employment_rate,
      payback_years: newPayback,
      data_confidence: 'verified',
      last_verified: today,
      sources: updatedSources,
      layer_meta: updatedMeta,
    })

    const salChange = oldSalary !== cs.median_earnings
      ? `${String(oldSalary).padStart(6)} ${arrow} ${String(cs.median_earnings).padStart(6)}`
      : `${String(oldSalary).padStart(6)}       ${String(cs.median_earnings).padStart(6)}`
    const tuitChange = oldTuition !== cs.tuition
      ? `${String(oldTuition).padStart(6)} ${arrow} ${String(cs.tuition).padStart(6)}`
      : `${String(oldTuition).padStart(6)}       ${String(cs.tuition).padStart(6)}`
    const empChange = oldEmp !== cs.employment_rate
      ? `${String(oldEmp).padStart(6)} ${arrow} ${String(cs.employment_rate).padStart(6)}`
      : `${String(oldEmp).padStart(6)}       ${String(cs.employment_rate).padStart(6)}`

    console.log(
      `  ${slug.padEnd(22)} $${salChange}  $${tuitChange}  ${empChange}%  ${oldPayback}→${newPayback}yr`
    )
  }

  console.log('\n=== APPLY UPDATES? ===')
  console.log(`This will update ${updates.length} US majors to data_confidence=verified`)
  console.log('Press Ctrl+C to cancel. Waiting 5 seconds...\n')
  await new Promise(r => setTimeout(r, 5000))

  for (const u of updates) {
    const { error: updateError } = await supabase
      .from('majors')
      .update({
        median_starting_salary: u.median_starting_salary,
        avg_annual_tuition_intl: u.avg_annual_tuition_intl,
        employment_rate: u.employment_rate,
        employment_score: u.employment_score,
        payback_years: u.payback_years,
        data_confidence: u.data_confidence,
        last_verified: u.last_verified,
        sources: u.sources as never,
        layer_meta: u.layer_meta as never,
      })
      .eq('slug', u.slug)
      .eq('country', 'US')

    if (updateError) {
      console.error(`  ✗ ${u.slug}: update failed — ${updateError.message}`)
    } else {
      console.log(`  ✓ ${u.slug}: updated`)
    }
  }

  console.log('\nDone. Verify with: SELECT slug, median_starting_salary, avg_annual_tuition_intl, data_confidence, last_verified FROM public.majors WHERE country = \'US\';')
}

main().catch(console.error)
