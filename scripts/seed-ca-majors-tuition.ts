/**
 * Seeds per-major Canadian international tuition into public.majors.
 *
 * Uses the institution-level avg_net_price from colleges_ca (30 universities)
 * combined with a crosswalk of which universities are known to offer each major.
 *
 * Run: npx ts-node scripts/seed-ca-majors-tuition.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Crosswalk: major slug → university names known to offer the program ─────
// "all" = every institution in the data set (reasonable for general programs).
// Otherwise, list the specific names matching the sync-colleges-ca.ts entries.

const MAJOR_UNIVERSITIES: Record<string, string[] | 'all'> = {
  'computer-science': 'all',
  'data-analytics': 'all',              // Most offer data science/analytics programs
  'software-engineering': 'all',
  'nursing': [
    'University of Toronto',
    'University of British Columbia',
    'McGill University',
    'Université de Montréal',
    'McMaster University',
    'University of Alberta',
    'University of Calgary',
    'University of Ottawa',
    'Western University',
    'Queen\'s University',
    'York University',
    'Toronto Metropolitan University',
    'Dalhousie University',
    'University of Manitoba',
    'University of Saskatchewan',
    'University of New Brunswick',
    'Memorial University of Newfoundland',
    'Université Laval',
  ],
  'civil-engineering': [
    'University of Toronto',
    'University of British Columbia',
    'University of Waterloo',
    'McGill University',
    'McMaster University',
    'Queen\'s University',
    'University of Alberta',
    'University of Calgary',
    'Western University',
    'University of Ottawa',
    'Carleton University',
    'Dalhousie University',
    'University of Manitoba',
    'University of Saskatchewan',
    'University of New Brunswick',
    'Memorial University of Newfoundland',
    'Concordia University',
    'Université de Montréal',
    'Université Laval',
    'Simon Fraser University',
    'University of Victoria',
  ],
  'business-management': 'all',           // Most have business/commerce programs
  'accounting': 'all',                     // Most have accounting streams
  'ux-design': [
    'University of British Columbia',
    'Simon Fraser University',
    'Toronto Metropolitan University',
    'York University',
    'Concordia University',
    'University of Ottawa',
    'Carleton University',
    'OCAD University',    // not in our list but closest proxy via TMU/York
    'University of Toronto',
  ],
  'psychology': 'all',
  'music': [
    'University of Toronto',
    'University of British Columbia',
    'McGill University',
    'Université de Montréal',
    'Université Laval',
    'University of Alberta',
    'University of Calgary',
    'Western University',
    'University of Ottawa',
    'York University',
    'Queen\'s University',
    'Memorial University of Newfoundland',
  ],
}

async function main() {
  // Fetch all CA universities with their tuition
  const { data: colleges, error: colErr } = await supabase
    .from('colleges_ca')
    .select('name, avg_net_price, province')
    .order('name')

  if (colErr || !colleges) {
    console.error('Error fetching colleges_ca:', colErr?.message ?? 'no data')
    process.exit(1)
  }

  console.log(`Loaded ${colleges.length} universities`)

  // Build a name → price lookup
  const priceMap = new Map<string, number>()
  const allColleges: string[] = []
  for (const c of colleges) {
    priceMap.set(c.name, c.avg_net_price)
    allColleges.push(c.name)
  }

  // Compute per-major average tuition
  const updates: { slug: string; count: number; avgTuition: number }[] = []

  for (const [slug, unis] of Object.entries(MAJOR_UNIVERSITIES)) {
    const names = unis === 'all' ? allColleges : unis.filter((n) => priceMap.has(n))
    const missing = unis !== 'all' ? unis.filter((n) => !priceMap.has(n)) : []

    const prices = names.map((n) => priceMap.get(n)!).filter((p) => p > 0)
    const avg =
      prices.length > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : 0

    updates.push({ slug, count: prices.length, avgTuition: avg })

    console.log(
      `  ${slug}: avg C$${avg.toLocaleString()} across ${prices.length} universities` +
        (missing.length > 0 ? ` (skipped ${missing.join(', ')})` : '')
    )
  }

  // ── Apply to DB ──────────────────────────────────────────────────────────
  console.log('\nUpdating public.majors...')

  for (const u of updates) {
    const { error: updErr } = await supabase
      .from('majors')
      .update({ avg_annual_tuition_intl: u.avgTuition })
      .eq('slug', u.slug)
      .eq('country', 'CA')

    if (updErr) {
      console.error(`  ✗ ${u.slug}: ${updErr.message}`)
    } else {
      console.log(`  ✓ ${u.slug}: C$${u.avgTuition.toLocaleString()}`)
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\nDone. Summary:')
  for (const u of updates) {
    console.log(`  ${u.slug}: C$${u.avgTuition.toLocaleString()} (${u.count} institutions)`)
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
