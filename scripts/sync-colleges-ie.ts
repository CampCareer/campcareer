/**
 * Syncs Irish university data into colleges_ie.
 *
 * Data sources:
 *   1. HEA Graduate Outcomes Survey
 *      https://hea.ie/statistics/graduate-outcomes/
 *      Playwright scraping attempted; falls back to hardcoded data on failure.
 *   2. avg_net_price: international undergraduate tuition 2024-25 (EUR/year)
 *      from individual institution fee schedules / IUA
 *   3. graduation_rate: HEA Performance Indicators 2023
 *
 * Run: npx ts-node scripts/sync-colleges-ie.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { chromium } from 'playwright'
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

// ── Types ─────────────────────────────────────────────────────────────────────

interface CollegeRecord {
  name: string
  region: string          // colleges_ie / cities_ie use `region` (stores province name)
  city: string
  lat: number | null
  lng: number | null
  median_earnings: number
  graduation_rate: number
  avg_net_price: number
  school_type: 'public' | 'private'
}

// ── Hardcoded fallback data ───────────────────────────────────────────────────
// median_earnings: EUR, 9 months post-graduation (HEA Graduate Outcomes Survey 2022)
// avg_net_price:   EUR/year, international undergraduate tuition (2024-25)
// graduation_rate: HEA Performance Indicators 2023

const HARDCODED_COLLEGES: CollegeRecord[] = [
  {
    name: 'Trinity College Dublin',
    region: 'Leinster', city: 'Dublin',
    lat: 53.343792, lng: -6.254572,
    median_earnings: 40000, graduation_rate: 0.93, avg_net_price: 26000,
    school_type: 'public',
  },
  {
    name: 'University College Dublin',
    region: 'Leinster', city: 'Dublin',
    lat: 53.308207, lng: -6.226429,
    median_earnings: 38000, graduation_rate: 0.90, avg_net_price: 24000,
    school_type: 'public',
  },
  {
    name: 'University College Cork',
    region: 'Munster', city: 'Cork',
    lat: 51.893497, lng: -8.491872,
    median_earnings: 35000, graduation_rate: 0.88, avg_net_price: 20000,
    school_type: 'public',
  },
  {
    name: 'NUI Galway',
    region: 'Connacht', city: 'Galway',
    lat: 53.277783, lng: -9.061861,
    median_earnings: 34000, graduation_rate: 0.87, avg_net_price: 18000,
    school_type: 'public',
  },
  {
    name: 'University of Limerick',
    region: 'Munster', city: 'Limerick',
    lat: 52.6717, lng: -8.5703,
    median_earnings: 35000, graduation_rate: 0.86, avg_net_price: 18000,
    school_type: 'public',
  },
  {
    name: 'Dublin City University',
    region: 'Leinster', city: 'Dublin',
    lat: 53.384953, lng: -6.256542,
    median_earnings: 36000, graduation_rate: 0.85, avg_net_price: 17000,
    school_type: 'public',
  },
  {
    name: 'Maynooth University',
    region: 'Leinster', city: 'Dublin',
    lat: 53.383500, lng: -6.599600,
    median_earnings: 33000, graduation_rate: 0.84, avg_net_price: 16000,
    school_type: 'public',
  },
  {
    name: 'Technological University Dublin',
    region: 'Leinster', city: 'Dublin',
    lat: null, lng: null,
    median_earnings: 32000, graduation_rate: 0.80, avg_net_price: 14000,
    school_type: 'public',
  },
  {
    name: 'RCSI University of Medicine and Health Sciences',
    region: 'Leinster', city: 'Dublin',
    lat: null, lng: null,
    median_earnings: 58000, graduation_rate: 0.95, avg_net_price: 56000,
    school_type: 'private',
  },
]

// ── Slug helper ───────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── HEA scraping attempt ──────────────────────────────────────────────────────
// Tries to scrape median earnings from HEA Graduate Outcomes data table.
// Returns a map of { institution_name_lower → median_earnings } or null on failure.

const HEA_URL = 'https://hea.ie/statistics/graduate-outcomes/'

async function scrapeHeaEarnings(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`Launching browser → ${HEA_URL}`)
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(HEA_URL, { waitUntil: 'networkidle', timeout: 30000 })

    // Dismiss cookie banner if present
    const acceptBtn = page.locator('button:has-text("Accept"), button:has-text("OK"), button:has-text("Agree")')
    if (await acceptBtn.count() > 0) await acceptBtn.first().click()

    // Look for tables with institution + earnings data
    await page.waitForSelector('table', { timeout: 15000 })

    const rows = await page.evaluate(() => {
      const result: Array<{ name: string; salary: number | null }> = []
      const tables = Array.from(document.querySelectorAll('table'))
      for (const table of tables) {
        const trs = Array.from(table.querySelectorAll('tbody tr'))
        for (const tr of trs) {
          const cells = Array.from(tr.querySelectorAll('td'))
          if (cells.length < 2) continue
          const name = cells[0].textContent?.trim() ?? ''
          if (!name || name.length < 4) continue
          let salary: number | null = null
          for (let i = 1; i < cells.length; i++) {
            const raw = cells[i].textContent?.replace(/[€,\s]/g, '') ?? ''
            const n = parseInt(raw, 10)
            if (n >= 15000 && n <= 200000) { salary = n; break }
          }
          result.push({ name, salary })
        }
      }
      return result
    })

    console.log(`HEA: found ${rows.length} rows`)
    if (rows.length < 3) return null

    const map = new Map<string, number>()
    for (const r of rows) {
      if (r.salary != null) map.set(r.name.toLowerCase(), r.salary)
    }
    return map.size >= 3 ? map : null
  } catch (err) {
    console.warn(`HEA scrape failed: ${(err as Error).message}`)
    return null
  } finally {
    await browser?.close()
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Step 1: attempt live HEA scrape
  console.log('Attempting HEA Graduate Outcomes scrape...')
  const heaMap = await scrapeHeaEarnings()

  if (heaMap && heaMap.size > 0) {
    console.log(`HEA: matched ${heaMap.size} institutions — merging into hardcoded list`)
    for (const college of HARDCODED_COLLEGES) {
      const key = college.name.toLowerCase()
      const live = heaMap.get(key)
      if (live) {
        console.log(`  [HEA override] ${college.name}: €${college.median_earnings} → €${live}`)
        college.median_earnings = live
      }
    }
  } else {
    console.log('HEA scrape unavailable — using researched hardcoded data')
  }

  // Step 2: build rows
  const rows = HARDCODED_COLLEGES.map((c) => ({
    institution_id: toSlug(c.name),
    name: c.name,
    region: c.region,
    city: c.city,
    lat: c.lat,
    lng: c.lng,
    median_earnings: c.median_earnings,
    graduation_rate: c.graduation_rate,
    avg_net_price: c.avg_net_price,
    school_type: c.school_type,
    synced_at: new Date().toISOString(),
  }))

  // Step 3: upsert
  console.log(`\nUpserting ${rows.length} colleges into colleges_ie...`)

  const { error } = await supabase
    .from('colleges_ie')
    .upsert(rows, { onConflict: 'institution_id' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into colleges_ie.`)
  for (const r of rows) {
    console.log(
      `  ${r.institution_id} | ${r.region} | earnings: €${r.median_earnings} | tuition: €${r.avg_net_price} | grad: ${(r.graduation_rate * 100).toFixed(0)}%`
    )
  }

  // Step 4: refresh materialized view
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('Cannot parse project ref — skipping view refresh.')
    return
  }

  console.log('\nRefreshing materialized view roi_explorer_ie...')
  const refreshRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_ie;' }),
    }
  )

  if (!refreshRes.ok) {
    const body = await refreshRes.text()
    console.warn(`  Warning: Could not refresh view (${refreshRes.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_ie;')
  } else {
    console.log('  roi_explorer_ie refreshed.')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
