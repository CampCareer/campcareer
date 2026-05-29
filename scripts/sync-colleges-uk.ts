/**
 * Syncs UK university data into colleges_uk.
 *
 * Data sources:
 *   1. HESA Graduate Outcomes Survey 2021/22
 *      https://www.hesa.ac.uk/data-and-analysis/graduates
 *      Playwright scrapes the institution-level earnings table (Table 2).
 *      Falls back to hardcoded data if scraping fails.
 *   2. avg_net_price: international undergraduate tuition 2024-25 (GBP/year)
 *      from UCAS / individual institution fee schedules
 *   3. graduation_rate: HESA Performance Indicators / Complete University Guide 2024
 *
 * Run: npx ts-node scripts/sync-colleges-uk.ts
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
  region: string
  city: string
  median_earnings: number
  graduation_rate: number
  avg_net_price: number
  school_type: 'public' | 'private'
}

// ── Hardcoded fallback data ───────────────────────────────────────────────────
// median_earnings: GBP, 1 year post-graduation (HESA GO Survey 2021/22 estimates)
// avg_net_price:   GBP/year, international undergraduate tuition (2024-25)
// graduation_rate: HESA Performance Indicators / Complete University Guide 2024

const HARDCODED_COLLEGES: CollegeRecord[] = [
  // ── London ──────────────────────────────────────────────────────────────────
  {
    name: 'Imperial College London',
    region: 'London', city: 'London',
    median_earnings: 42000, graduation_rate: 0.94, avg_net_price: 38000,
    school_type: 'public',
  },
  {
    name: 'London School of Economics and Political Science',
    region: 'London', city: 'London',
    median_earnings: 44000, graduation_rate: 0.92, avg_net_price: 25000,
    school_type: 'public',
  },
  {
    name: 'University College London',
    region: 'London', city: 'London',
    median_earnings: 35000, graduation_rate: 0.92, avg_net_price: 29000,
    school_type: 'public',
  },
  {
    name: "King's College London",
    region: 'London', city: 'London',
    median_earnings: 33000, graduation_rate: 0.88, avg_net_price: 27000,
    school_type: 'public',
  },
  {
    name: 'Queen Mary University of London',
    region: 'London', city: 'London',
    median_earnings: 31000, graduation_rate: 0.84, avg_net_price: 27000,
    school_type: 'public',
  },
  {
    name: 'City, University of London',
    region: 'London', city: 'London',
    median_earnings: 31000, graduation_rate: 0.81, avg_net_price: 25000,
    school_type: 'public',
  },
  {
    name: 'Brunel University London',
    region: 'London', city: 'London',
    median_earnings: 27000, graduation_rate: 0.79, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: "Royal Holloway, University of London",
    region: 'London', city: 'London',
    median_earnings: 27000, graduation_rate: 0.82, avg_net_price: 21000,
    school_type: 'public',
  },
  // ── South East ───────────────────────────────────────────────────────────────
  {
    name: 'University of Oxford',
    region: 'South East', city: 'Oxford',
    median_earnings: 37000, graduation_rate: 0.97, avg_net_price: 39000,
    school_type: 'public',
  },
  {
    name: 'University of Cambridge',
    region: 'South East', city: 'Cambridge',
    median_earnings: 38000, graduation_rate: 0.97, avg_net_price: 37000,
    school_type: 'public',
  },
  {
    name: 'University of Southampton',
    region: 'South East', city: 'Southampton',
    median_earnings: 30000, graduation_rate: 0.88, avg_net_price: 24000,
    school_type: 'public',
  },
  {
    name: 'University of Surrey',
    region: 'South East', city: 'Guildford',
    median_earnings: 28000, graduation_rate: 0.86, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'University of Sussex',
    region: 'South East', city: 'Brighton',
    median_earnings: 27000, graduation_rate: 0.83, avg_net_price: 23000,
    school_type: 'public',
  },
  {
    name: 'University of Reading',
    region: 'South East', city: 'Reading',
    median_earnings: 27000, graduation_rate: 0.82, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'University of Kent',
    region: 'South East', city: 'Canterbury',
    median_earnings: 26000, graduation_rate: 0.80, avg_net_price: 20000,
    school_type: 'public',
  },
  // ── Scotland ─────────────────────────────────────────────────────────────────
  {
    name: 'University of Edinburgh',
    region: 'Scotland', city: 'Edinburgh',
    median_earnings: 31000, graduation_rate: 0.91, avg_net_price: 26000,
    school_type: 'public',
  },
  {
    name: 'University of Glasgow',
    region: 'Scotland', city: 'Glasgow',
    median_earnings: 29000, graduation_rate: 0.88, avg_net_price: 25000,
    school_type: 'public',
  },
  {
    name: 'University of St Andrews',
    region: 'Scotland', city: 'St Andrews',
    median_earnings: 30000, graduation_rate: 0.93, avg_net_price: 28000,
    school_type: 'public',
  },
  {
    name: 'University of Aberdeen',
    region: 'Scotland', city: 'Aberdeen',
    median_earnings: 27000, graduation_rate: 0.85, avg_net_price: 23000,
    school_type: 'public',
  },
  {
    name: 'Heriot-Watt University',
    region: 'Scotland', city: 'Edinburgh',
    median_earnings: 30000, graduation_rate: 0.82, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'University of Strathclyde',
    region: 'Scotland', city: 'Glasgow',
    median_earnings: 28000, graduation_rate: 0.82, avg_net_price: 22000,
    school_type: 'public',
  },
  // ── North West ───────────────────────────────────────────────────────────────
  {
    name: 'University of Manchester',
    region: 'North West', city: 'Manchester',
    median_earnings: 30000, graduation_rate: 0.86, avg_net_price: 25000,
    school_type: 'public',
  },
  {
    name: 'University of Liverpool',
    region: 'North West', city: 'Liverpool',
    median_earnings: 28000, graduation_rate: 0.83, avg_net_price: 23000,
    school_type: 'public',
  },
  {
    name: 'Lancaster University',
    region: 'North West', city: 'Lancaster',
    median_earnings: 28000, graduation_rate: 0.86, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'University of Salford',
    region: 'North West', city: 'Manchester',
    median_earnings: 24000, graduation_rate: 0.74, avg_net_price: 17000,
    school_type: 'public',
  },
  // ── Yorkshire ────────────────────────────────────────────────────────────────
  {
    name: 'University of Leeds',
    region: 'Yorkshire', city: 'Leeds',
    median_earnings: 28000, graduation_rate: 0.85, avg_net_price: 23000,
    school_type: 'public',
  },
  {
    name: 'University of Sheffield',
    region: 'Yorkshire', city: 'Sheffield',
    median_earnings: 28000, graduation_rate: 0.84, avg_net_price: 23000,
    school_type: 'public',
  },
  {
    name: 'University of York',
    region: 'Yorkshire', city: 'York',
    median_earnings: 27000, graduation_rate: 0.87, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'University of Bradford',
    region: 'Yorkshire', city: 'Bradford',
    median_earnings: 24000, graduation_rate: 0.75, avg_net_price: 17000,
    school_type: 'public',
  },
  // ── West Midlands ─────────────────────────────────────────────────────────────
  {
    name: 'University of Birmingham',
    region: 'West Midlands', city: 'Birmingham',
    median_earnings: 29000, graduation_rate: 0.85, avg_net_price: 24000,
    school_type: 'public',
  },
  {
    name: 'University of Warwick',
    region: 'West Midlands', city: 'Coventry',
    median_earnings: 32000, graduation_rate: 0.92, avg_net_price: 27000,
    school_type: 'public',
  },
  {
    name: 'Aston University',
    region: 'West Midlands', city: 'Birmingham',
    median_earnings: 29000, graduation_rate: 0.82, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'Coventry University',
    region: 'West Midlands', city: 'Coventry',
    median_earnings: 25000, graduation_rate: 0.78, avg_net_price: 18000,
    school_type: 'public',
  },
  // ── South West ───────────────────────────────────────────────────────────────
  {
    name: 'University of Bristol',
    region: 'South West', city: 'Bristol',
    median_earnings: 30000, graduation_rate: 0.89, avg_net_price: 26000,
    school_type: 'public',
  },
  {
    name: 'University of Bath',
    region: 'South West', city: 'Bath',
    median_earnings: 31000, graduation_rate: 0.90, avg_net_price: 28000,
    school_type: 'public',
  },
  {
    name: 'University of Exeter',
    region: 'South West', city: 'Exeter',
    median_earnings: 28000, graduation_rate: 0.85, avg_net_price: 25000,
    school_type: 'public',
  },
  {
    name: 'University of Plymouth',
    region: 'South West', city: 'Plymouth',
    median_earnings: 24000, graduation_rate: 0.76, avg_net_price: 18000,
    school_type: 'public',
  },
  // ── East Midlands ─────────────────────────────────────────────────────────────
  {
    name: 'University of Nottingham',
    region: 'East Midlands', city: 'Nottingham',
    median_earnings: 28000, graduation_rate: 0.85, avg_net_price: 24000,
    school_type: 'public',
  },
  {
    name: 'Loughborough University',
    region: 'East Midlands', city: 'Loughborough',
    median_earnings: 30000, graduation_rate: 0.87, avg_net_price: 24000,
    school_type: 'public',
  },
  {
    name: 'University of Leicester',
    region: 'East Midlands', city: 'Leicester',
    median_earnings: 27000, graduation_rate: 0.83, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'Nottingham Trent University',
    region: 'East Midlands', city: 'Nottingham',
    median_earnings: 24000, graduation_rate: 0.78, avg_net_price: 17000,
    school_type: 'public',
  },
  // ── North East ───────────────────────────────────────────────────────────────
  {
    name: 'Durham University',
    region: 'North East', city: 'Durham',
    median_earnings: 30000, graduation_rate: 0.91, avg_net_price: 26000,
    school_type: 'public',
  },
  {
    name: 'Newcastle University',
    region: 'North East', city: 'Newcastle',
    median_earnings: 28000, graduation_rate: 0.84, avg_net_price: 24000,
    school_type: 'public',
  },
  // ── East ─────────────────────────────────────────────────────────────────────
  {
    name: 'University of East Anglia',
    region: 'East', city: 'Norwich',
    median_earnings: 26000, graduation_rate: 0.84, avg_net_price: 21000,
    school_type: 'public',
  },
  {
    name: 'University of Essex',
    region: 'East', city: 'Colchester',
    median_earnings: 26000, graduation_rate: 0.80, avg_net_price: 20000,
    school_type: 'public',
  },
  // ── Wales ─────────────────────────────────────────────────────────────────────
  {
    name: 'Cardiff University',
    region: 'Wales', city: 'Cardiff',
    median_earnings: 27000, graduation_rate: 0.84, avg_net_price: 22000,
    school_type: 'public',
  },
  {
    name: 'Swansea University',
    region: 'Wales', city: 'Swansea',
    median_earnings: 25000, graduation_rate: 0.80, avg_net_price: 20000,
    school_type: 'public',
  },
  // ── Northern Ireland ─────────────────────────────────────────────────────────
  {
    name: "Queen's University Belfast",
    region: 'Northern Ireland', city: 'Belfast',
    median_earnings: 26000, graduation_rate: 0.84, avg_net_price: 21000,
    school_type: 'public',
  },
  {
    name: 'Ulster University',
    region: 'Northern Ireland', city: 'Coleraine',
    median_earnings: 23000, graduation_rate: 0.78, avg_net_price: 17000,
    school_type: 'public',
  },
]

// Slug helper (same as CA/AU scripts)
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── HESA scraping attempt ─────────────────────────────────────────────────────
// Tries to read median earnings from HESA Graduate Outcomes "Table 2"
// Returns a map of { institution_name_lower → median_earnings } or null on failure.

const HESA_TABLE_URL =
  'https://www.hesa.ac.uk/data-and-analysis/graduates/table-2'

async function scrapeHesaEarnings(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`Launching browser → ${HESA_TABLE_URL}`)
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(HESA_TABLE_URL, { waitUntil: 'networkidle', timeout: 30000 })

    // Check for cookie banners and dismiss them
    const acceptBtn = page.locator('button:has-text("Accept"), button:has-text("OK")')
    if (await acceptBtn.count() > 0) await acceptBtn.first().click()

    // Wait for a table to appear
    await page.waitForSelector('table', { timeout: 15000 })

    // Grab all rows: institution name is in the first column,
    // median salary is somewhere in the numeric columns
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
          // Find a cell that looks like a salary (20000–100000)
          let salary: number | null = null
          for (let i = 1; i < cells.length; i++) {
            const raw = cells[i].textContent?.replace(/[£,\s]/g, '') ?? ''
            const n = parseInt(raw, 10)
            if (n >= 15000 && n <= 200000) { salary = n; break }
          }
          if (name) result.push({ name, salary })
        }
      }
      return result
    })

    console.log(`HESA: found ${rows.length} rows`)
    if (rows.length < 5) return null

    const map = new Map<string, number>()
    for (const r of rows) {
      if (r.salary != null) map.set(r.name.toLowerCase(), r.salary)
    }
    return map.size >= 5 ? map : null
  } catch (err) {
    console.warn(`HESA scrape failed: ${(err as Error).message}`)
    return null
  } finally {
    await browser?.close()
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Step 1: attempt live HESA scrape
  console.log('Attempting HESA Graduate Outcomes scrape...')
  const hesaMap = await scrapeHesaEarnings()

  if (hesaMap && hesaMap.size > 0) {
    console.log(`HESA: matched ${hesaMap.size} institutions — merging into hardcoded list`)
    for (const college of HARDCODED_COLLEGES) {
      const key = college.name.toLowerCase()
      const live = hesaMap.get(key)
      if (live) {
        console.log(`  [HESA override] ${college.name}: £${college.median_earnings} → £${live}`)
        college.median_earnings = live
      }
    }
  } else {
    console.log('HESA scrape unavailable — using researched hardcoded data')
  }

  // Step 2: build rows
  const rows = HARDCODED_COLLEGES.map((c) => ({
    institution_id: toSlug(c.name),
    name: c.name,
    region: c.region,
    city: c.city,
    median_earnings: c.median_earnings,
    graduation_rate: c.graduation_rate,
    avg_net_price: c.avg_net_price,
    school_type: c.school_type,
    synced_at: new Date().toISOString(),
  }))

  // Step 3: upsert
  console.log(`\nUpserting ${rows.length} colleges into colleges_uk...`)

  const { error } = await supabase
    .from('colleges_uk')
    .upsert(rows, { onConflict: 'institution_id' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Upserted ${rows.length} rows into colleges_uk.`)
  for (const r of rows) {
    console.log(
      `  ${r.institution_id} | ${r.region} | earnings: £${r.median_earnings} | tuition: £${r.avg_net_price} | grad: ${(r.graduation_rate * 100).toFixed(0)}%`
    )
  }

  // Step 4: refresh materialized view
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('Cannot parse project ref — skipping view refresh.')
    return
  }

  console.log('\nRefreshing materialized view roi_explorer_uk...')
  const refreshRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_uk;' }),
    }
  )

  if (!refreshRes.ok) {
    const body = await refreshRes.text()
    console.warn(`  Warning: Could not refresh view (${refreshRes.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_uk;')
  } else {
    console.log('  roi_explorer_uk refreshed.')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
