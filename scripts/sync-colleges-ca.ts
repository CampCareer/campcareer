/**
 * Syncs Canadian university data into colleges_ca.
 *
 * Data sources (hardcoded, researched 2024-2025):
 *   - median_earnings: Statistics Canada National Graduates Survey (NGS) 2018,
 *     2 years post-graduation median employment income (CAD)
 *   - avg_net_price: international undergraduate tuition 2024-2025 (CAD/year)
 *     from CUDO / individual institution fee schedules
 *   - graduation_rate: Maclean's 2024 university rankings / CAUBO
 *
 * Attempted live source: Statistics Canada NGS query tool
 *   https://www150.statcan.gc.ca/n1/pub/71-607-x/2018011/req-dem-eng.htm
 * Not machine-readable; using hardcoded researched values instead.
 *
 * Run: npx ts-node scripts/sync-colleges-ca.ts
 */

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

interface CollegeRecord {
  name: string
  province: string
  city: string
  median_earnings: number
  graduation_rate: number
  avg_net_price: number
  school_type: 'public' | 'private'
}

// median_earnings: CAD, 2 years post-graduation (Statistics Canada NGS 2018)
// avg_net_price:   CAD/year, international undergraduate tuition (2024-2025)
// graduation_rate: proportion of entering students who graduate (6-year rate)
const COLLEGES: CollegeRecord[] = [
  // ── Ontario ──────────────────────────────────────────────────────────────
  {
    name: 'University of Toronto',
    province: 'ON', city: 'Toronto',
    median_earnings: 72000, graduation_rate: 0.89, avg_net_price: 58000,
    school_type: 'public',
  },
  {
    name: 'University of Waterloo',
    province: 'ON', city: 'Waterloo',
    median_earnings: 75000, graduation_rate: 0.85, avg_net_price: 46000,
    school_type: 'public',
  },
  {
    name: 'McMaster University',
    province: 'ON', city: 'Hamilton',
    median_earnings: 65000, graduation_rate: 0.84, avg_net_price: 38000,
    school_type: 'public',
  },
  {
    name: "Queen's University",
    province: 'ON', city: 'Kingston',
    median_earnings: 66000, graduation_rate: 0.87, avg_net_price: 40000,
    school_type: 'public',
  },
  {
    name: 'Western University',
    province: 'ON', city: 'London',
    median_earnings: 64000, graduation_rate: 0.86, avg_net_price: 36000,
    school_type: 'public',
  },
  {
    name: 'University of Ottawa',
    province: 'ON', city: 'Ottawa',
    median_earnings: 62000, graduation_rate: 0.82, avg_net_price: 33000,
    school_type: 'public',
  },
  {
    name: 'York University',
    province: 'ON', city: 'Toronto',
    median_earnings: 56000, graduation_rate: 0.74, avg_net_price: 30000,
    school_type: 'public',
  },
  {
    name: 'Toronto Metropolitan University',
    province: 'ON', city: 'Toronto',
    median_earnings: 58000, graduation_rate: 0.76, avg_net_price: 31000,
    school_type: 'public',
  },
  {
    name: 'Carleton University',
    province: 'ON', city: 'Ottawa',
    median_earnings: 60000, graduation_rate: 0.79, avg_net_price: 29000,
    school_type: 'public',
  },
  {
    name: 'University of Guelph',
    province: 'ON', city: 'Guelph',
    median_earnings: 58000, graduation_rate: 0.81, avg_net_price: 32000,
    school_type: 'public',
  },
  {
    name: 'Ontario Tech University',
    province: 'ON', city: 'Oshawa',
    median_earnings: 55000, graduation_rate: 0.72, avg_net_price: 27000,
    school_type: 'public',
  },
  {
    name: 'Wilfrid Laurier University',
    province: 'ON', city: 'Waterloo',
    median_earnings: 57000, graduation_rate: 0.78, avg_net_price: 28000,
    school_type: 'public',
  },
  {
    name: 'Brock University',
    province: 'ON', city: 'St. Catharines',
    median_earnings: 52000, graduation_rate: 0.75, avg_net_price: 26000,
    school_type: 'public',
  },
  // ── British Columbia ──────────────────────────────────────────────────────
  {
    name: 'University of British Columbia',
    province: 'BC', city: 'Vancouver',
    median_earnings: 68000, graduation_rate: 0.88, avg_net_price: 48000,
    school_type: 'public',
  },
  {
    name: 'Simon Fraser University',
    province: 'BC', city: 'Burnaby',
    median_earnings: 62000, graduation_rate: 0.79, avg_net_price: 30000,
    school_type: 'public',
  },
  {
    name: 'University of Victoria',
    province: 'BC', city: 'Victoria',
    median_earnings: 58000, graduation_rate: 0.78, avg_net_price: 28000,
    school_type: 'public',
  },
  {
    name: 'University of Northern British Columbia',
    province: 'BC', city: 'Prince George',
    median_earnings: 52000, graduation_rate: 0.68, avg_net_price: 20000,
    school_type: 'public',
  },
  // ── Quebec ────────────────────────────────────────────────────────────────
  {
    name: 'McGill University',
    province: 'QC', city: 'Montreal',
    median_earnings: 68000, graduation_rate: 0.90, avg_net_price: 32000,
    school_type: 'public',
  },
  {
    name: 'Concordia University',
    province: 'QC', city: 'Montreal',
    median_earnings: 56000, graduation_rate: 0.72, avg_net_price: 26000,
    school_type: 'public',
  },
  {
    name: 'Université de Montréal',
    province: 'QC', city: 'Montreal',
    median_earnings: 62000, graduation_rate: 0.82, avg_net_price: 24000,
    school_type: 'public',
  },
  {
    name: 'Université Laval',
    province: 'QC', city: 'Quebec City',
    median_earnings: 58000, graduation_rate: 0.80, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'Université du Québec à Montréal',
    province: 'QC', city: 'Montreal',
    median_earnings: 52000, graduation_rate: 0.68, avg_net_price: 18000,
    school_type: 'public',
  },
  // ── Alberta ───────────────────────────────────────────────────────────────
  {
    name: 'University of Alberta',
    province: 'AB', city: 'Edmonton',
    median_earnings: 63000, graduation_rate: 0.83, avg_net_price: 29000,
    school_type: 'public',
  },
  {
    name: 'University of Calgary',
    province: 'AB', city: 'Calgary',
    median_earnings: 64000, graduation_rate: 0.82, avg_net_price: 30000,
    school_type: 'public',
  },
  {
    name: 'MacEwan University',
    province: 'AB', city: 'Edmonton',
    median_earnings: 50000, graduation_rate: 0.70, avg_net_price: 18000,
    school_type: 'public',
  },
  // ── Other provinces ───────────────────────────────────────────────────────
  {
    name: 'Dalhousie University',
    province: 'NS', city: 'Halifax',
    median_earnings: 58000, graduation_rate: 0.80, avg_net_price: 23000,
    school_type: 'public',
  },
  {
    name: 'University of Manitoba',
    province: 'MB', city: 'Winnipeg',
    median_earnings: 54000, graduation_rate: 0.75, avg_net_price: 18000,
    school_type: 'public',
  },
  {
    name: 'University of Saskatchewan',
    province: 'SK', city: 'Saskatoon',
    median_earnings: 56000, graduation_rate: 0.76, avg_net_price: 20000,
    school_type: 'public',
  },
  {
    name: 'University of New Brunswick',
    province: 'NB', city: 'Fredericton',
    median_earnings: 52000, graduation_rate: 0.74, avg_net_price: 17000,
    school_type: 'public',
  },
  {
    name: 'Memorial University of Newfoundland',
    province: 'NL', city: "St. John's",
    median_earnings: 50000, graduation_rate: 0.72, avg_net_price: 15000,
    school_type: 'public',
  },
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const rows = COLLEGES.map((c) => ({
    institution_id: toSlug(c.name),
    name: c.name,
    province: c.province,
    city: c.city,
    median_earnings: c.median_earnings,
    graduation_rate: c.graduation_rate,
    avg_net_price: c.avg_net_price,
    school_type: c.school_type,
    synced_at: new Date().toISOString(),
  }))

  console.log(`Upserting ${rows.length} colleges into colleges_ca...`)

  const { error } = await supabase
    .from('colleges_ca')
    .upsert(rows, { onConflict: 'institution_id' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into colleges_ca.`)
  for (const r of rows) {
    console.log(
      `  ${r.institution_id} | ${r.province} | earnings: $${r.median_earnings} | tuition: $${r.avg_net_price} | grad: ${(r.graduation_rate * 100).toFixed(0)}%`
    )
  }

  // Refresh materialized view if it exists
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('Cannot parse project ref — skipping view refresh.')
    return
  }

  console.log('\nRefreshing materialized view roi_explorer_ca...')
  const refreshRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_ca;' }),
    }
  )

  if (!refreshRes.ok) {
    const body = await refreshRes.text()
    console.warn(`  Warning: Could not refresh view (${refreshRes.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_ca;')
  } else {
    console.log('  roi_explorer_ca refreshed.')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
