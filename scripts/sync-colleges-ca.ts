/**
 * Syncs Canadian university data into colleges_ca.
 *
 * Live data sources (in priority order):
 *   1. Statistics Canada Table 37-10-0280-01 (ZIP download)
 *      https://www150.statcan.gc.ca/t1/tbl1/en/dtbl/downloadTbl?pid=3710028001
 *      Extracts province-level median employment income (2 years post-graduation).
 *
 *   2. Open Canada CKAN fallback
 *      https://open.canada.ca/data/en/dataset/a794ba22-d081-4d72-9a97-11dfc61ac654
 *      Uses CKAN API to discover CSV resource URLs, then parses the same way.
 *
 * If both live sources fail, uses hardcoded research values (NGS 2018 estimates).
 *
 * Run: npx ts-node scripts/sync-colleges-ca.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import AdmZip from 'adm-zip'
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

// ── Province name → abbreviation ──────────────────────────────────────────────

const PROVINCE_MAP: Record<string, string> = {
  'Ontario': 'ON',
  'British Columbia': 'BC',
  'Quebec': 'QC',
  'Québec': 'QC',
  'Alberta': 'AB',
  'Manitoba': 'MB',
  'Nova Scotia': 'NS',
  'New Brunswick': 'NB',
  'Saskatchewan': 'SK',
  'Newfoundland and Labrador': 'NL',
  'Prince Edward Island': 'PE',
  'Northwest Territories': 'NT',
  'Yukon': 'YT',
  'Nunavut': 'NU',
}

// ── Hardcoded fallback data ───────────────────────────────────────────────────
// median_earnings: CAD, 2 years post-graduation (Statistics Canada NGS 2018 estimates)
// avg_net_price:   CAD/year, international undergraduate tuition 2024-2025
// graduation_rate: 6-year rate (Maclean's 2024 / CAUBO)

interface CollegeRecord {
  name: string
  province: string
  city: string
  median_earnings: number
  graduation_rate: number
  avg_net_price: number
  school_type: 'public' | 'private'
}

const COLLEGES: CollegeRecord[] = [
  // ── Ontario ──────────────────────────────────────────────────────────────
  { name: 'University of Toronto',       province: 'ON', city: 'Toronto',       median_earnings: 72000, graduation_rate: 0.89, avg_net_price: 58000, school_type: 'public' },
  { name: 'University of Waterloo',      province: 'ON', city: 'Waterloo',      median_earnings: 75000, graduation_rate: 0.85, avg_net_price: 46000, school_type: 'public' },
  { name: 'McMaster University',         province: 'ON', city: 'Hamilton',      median_earnings: 65000, graduation_rate: 0.84, avg_net_price: 38000, school_type: 'public' },
  { name: "Queen's University",          province: 'ON', city: 'Kingston',      median_earnings: 66000, graduation_rate: 0.87, avg_net_price: 40000, school_type: 'public' },
  { name: 'Western University',          province: 'ON', city: 'London',        median_earnings: 64000, graduation_rate: 0.86, avg_net_price: 36000, school_type: 'public' },
  { name: 'University of Ottawa',        province: 'ON', city: 'Ottawa',        median_earnings: 62000, graduation_rate: 0.82, avg_net_price: 33000, school_type: 'public' },
  { name: 'York University',             province: 'ON', city: 'Toronto',       median_earnings: 56000, graduation_rate: 0.74, avg_net_price: 30000, school_type: 'public' },
  { name: 'Toronto Metropolitan University', province: 'ON', city: 'Toronto',   median_earnings: 58000, graduation_rate: 0.76, avg_net_price: 31000, school_type: 'public' },
  { name: 'Carleton University',         province: 'ON', city: 'Ottawa',        median_earnings: 60000, graduation_rate: 0.79, avg_net_price: 29000, school_type: 'public' },
  { name: 'University of Guelph',        province: 'ON', city: 'Guelph',        median_earnings: 58000, graduation_rate: 0.81, avg_net_price: 32000, school_type: 'public' },
  { name: 'Ontario Tech University',     province: 'ON', city: 'Oshawa',        median_earnings: 55000, graduation_rate: 0.72, avg_net_price: 27000, school_type: 'public' },
  { name: 'Wilfrid Laurier University',  province: 'ON', city: 'Waterloo',      median_earnings: 57000, graduation_rate: 0.78, avg_net_price: 28000, school_type: 'public' },
  { name: 'Brock University',            province: 'ON', city: 'St. Catharines', median_earnings: 52000, graduation_rate: 0.75, avg_net_price: 26000, school_type: 'public' },
  // ── British Columbia ──────────────────────────────────────────────────────
  { name: 'University of British Columbia',       province: 'BC', city: 'Vancouver',    median_earnings: 68000, graduation_rate: 0.88, avg_net_price: 48000, school_type: 'public' },
  { name: 'Simon Fraser University',              province: 'BC', city: 'Burnaby',       median_earnings: 62000, graduation_rate: 0.79, avg_net_price: 30000, school_type: 'public' },
  { name: 'University of Victoria',               province: 'BC', city: 'Victoria',      median_earnings: 58000, graduation_rate: 0.78, avg_net_price: 28000, school_type: 'public' },
  { name: 'University of Northern British Columbia', province: 'BC', city: 'Prince George', median_earnings: 52000, graduation_rate: 0.68, avg_net_price: 20000, school_type: 'public' },
  // ── Quebec ────────────────────────────────────────────────────────────────
  { name: 'McGill University',              province: 'QC', city: 'Montreal',     median_earnings: 68000, graduation_rate: 0.90, avg_net_price: 32000, school_type: 'public' },
  { name: 'Concordia University',           province: 'QC', city: 'Montreal',     median_earnings: 56000, graduation_rate: 0.72, avg_net_price: 26000, school_type: 'public' },
  { name: 'Université de Montréal',         province: 'QC', city: 'Montreal',     median_earnings: 62000, graduation_rate: 0.82, avg_net_price: 24000, school_type: 'public' },
  { name: 'Université Laval',               province: 'QC', city: 'Quebec City',  median_earnings: 58000, graduation_rate: 0.80, avg_net_price: 22000, school_type: 'public' },
  { name: 'Université du Québec à Montréal', province: 'QC', city: 'Montreal',   median_earnings: 52000, graduation_rate: 0.68, avg_net_price: 18000, school_type: 'public' },
  // ── Alberta ───────────────────────────────────────────────────────────────
  { name: 'University of Alberta', province: 'AB', city: 'Edmonton', median_earnings: 63000, graduation_rate: 0.83, avg_net_price: 29000, school_type: 'public' },
  { name: 'University of Calgary', province: 'AB', city: 'Calgary',  median_earnings: 64000, graduation_rate: 0.82, avg_net_price: 30000, school_type: 'public' },
  { name: 'MacEwan University',    province: 'AB', city: 'Edmonton', median_earnings: 50000, graduation_rate: 0.70, avg_net_price: 18000, school_type: 'public' },
  // ── Other provinces ───────────────────────────────────────────────────────
  { name: 'Dalhousie University',              province: 'NS', city: 'Halifax',    median_earnings: 58000, graduation_rate: 0.80, avg_net_price: 23000, school_type: 'public' },
  { name: 'University of Manitoba',            province: 'MB', city: 'Winnipeg',   median_earnings: 54000, graduation_rate: 0.75, avg_net_price: 18000, school_type: 'public' },
  { name: 'University of Saskatchewan',        province: 'SK', city: 'Saskatoon',  median_earnings: 56000, graduation_rate: 0.76, avg_net_price: 20000, school_type: 'public' },
  { name: 'University of New Brunswick',       province: 'NB', city: 'Fredericton', median_earnings: 52000, graduation_rate: 0.74, avg_net_price: 17000, school_type: 'public' },
  { name: 'Memorial University of Newfoundland', province: 'NL', city: "St. John's", median_earnings: 50000, graduation_rate: 0.72, avg_net_price: 15000, school_type: 'public' },
]

// ── HTTP download helper ──────────────────────────────────────────────────────

function downloadBuffer(url: string, depth = 0): Promise<Buffer> {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'))
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 CampCareer-data-sync/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        const loc = res.headers.location
        if (!loc) return reject(new Error(`Redirect without Location header from ${url}`))
        const next = loc.startsWith('http') ? loc : new URL(loc, url).toString()
        return resolve(downloadBuffer(next, depth + 1))
      }
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      const ct = (res.headers['content-type'] ?? '').toLowerCase()
      if (ct.includes('text/html'))
        return reject(new Error(`Got HTML response instead of binary data from ${url}`))
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    })
    req.on('error', reject)
  })
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function splitCSVRow(line: string): string[] {
  const cells: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (c === ',' && !inQ) {
      cells.push(cur.trim())
      cur = ''
    } else {
      cur += c
    }
  }
  cells.push(cur.trim())
  return cells
}

/**
 * Parses a Stats Canada–style CSV and extracts province → median income.
 *
 * Expects standard Stats Canada format:
 *   REF_DATE, GEO, [other dims...], VALUE, STATUS, SYMBOL, TERMINATED, DECIMALS
 *
 * Income sanity range: CAD 20,000–200,000 (rejects graduate counts, percentages etc.)
 */
function parseEarningsFromCSV(csvText: string): Map<string, number> {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) throw new Error('CSV has fewer than 2 lines')

  const headers = splitCSVRow(lines[0]).map(h => h.toLowerCase())
  const geoIdx   = headers.findIndex(h => h === 'geo' || h.includes('geography') || h.includes('province'))
  const valueIdx = headers.findIndex(h => h === 'value')
  const dateIdx  = headers.findIndex(h => h === 'ref_date' || h === 'date' || h.includes('year'))

  if (geoIdx === -1 || valueIdx === -1) {
    throw new Error(`Could not find GEO/VALUE columns. Headers: ${headers.join(', ')}`)
  }

  // Use only the most recent year if date column exists
  let maxYear: string | null = null
  if (dateIdx !== -1) {
    const years = new Set<string>()
    for (let i = 1; i < lines.length; i++) {
      const row = splitCSVRow(lines[i])
      if (row[dateIdx]) years.add(row[dateIdx])
    }
    if (years.size > 0) maxYear = Array.from(years).sort().pop() ?? null
  }

  // Collect income values per province (skip male/female-only rows to avoid double-counting)
  const collected = new Map<string, number[]>()

  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVRow(lines[i])
    const geo      = row[geoIdx]?.trim()
    const rawValue = row[valueIdx]?.trim()

    if (!geo || !rawValue) continue
    if (geo.toLowerCase() === 'canada') continue  // skip national aggregate
    if (maxYear && dateIdx !== -1 && row[dateIdx] !== maxYear) continue

    // Skip male-only / female-only rows
    const rowText = row.map(c => c.toLowerCase()).join('|')
    if (rowText.includes('|males|') || rowText.includes('|females|') ||
        rowText.includes('|male|') || rowText.includes('|female|')) continue

    const value = parseFloat(rawValue.replace(/,/g, ''))
    // Income sanity check: CAD 20k–200k
    if (isNaN(value) || value < 20000 || value > 200000) continue

    const abbr = PROVINCE_MAP[geo]
    if (!abbr) continue

    const arr = collected.get(abbr) ?? []
    arr.push(value)
    collected.set(abbr, arr)
  }

  if (collected.size === 0) {
    throw new Error('No income-range values (CAD 20k–200k) found — table may not contain earnings data')
  }

  // Median of collected values per province
  const result = new Map<string, number>()
  for (const [abbr, vals] of Array.from(collected.entries())) {
    vals.sort((a: number, b: number) => a - b)
    const mid = Math.floor(vals.length / 2)
    const median = vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid]
    result.set(abbr, Math.round(median))
  }
  return result
}

// ── Stats Canada primary source ───────────────────────────────────────────────

async function fetchStatsCanadaEarnings(): Promise<Map<string, number>> {
  const ZIP_URL = 'https://www150.statcan.gc.ca/t1/tbl1/en/dtbl/downloadTbl?pid=3710028001'
  console.log(`  Downloading ${ZIP_URL}`)
  const buf = await downloadBuffer(ZIP_URL)

  const zip = new AdmZip(buf)
  const entries = zip.getEntries()

  // Find main data CSV (not metadata)
  const dataEntry =
    entries.find(e => e.name.endsWith('.csv') && !e.name.toLowerCase().includes('meta')) ??
    entries.find(e => e.name.endsWith('.csv'))

  if (!dataEntry) throw new Error(`No CSV in ZIP (entries: ${entries.map(e => e.name).join(', ')})`)
  console.log(`  Parsing ${dataEntry.name} (${entries.length} entries in ZIP)`)

  const csvText = dataEntry.getData().toString('utf-8')
  return parseEarningsFromCSV(csvText)
}

// ── Open Canada CKAN fallback ─────────────────────────────────────────────────

async function fetchFromOpenCanada(): Promise<Map<string, number>> {
  const DATASET_ID = 'a794ba22-d081-4d72-9a97-11dfc61ac654'
  const apiUrl = `https://open.canada.ca/data/en/api/3/action/package_show?id=${DATASET_ID}`
  console.log(`  Fetching CKAN metadata: ${apiUrl}`)

  const buf = await downloadBuffer(apiUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = JSON.parse(buf.toString('utf-8')) as any
  if (!json.success) throw new Error('CKAN API returned success=false')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resources: any[] = json.result?.resources ?? []
  const csvResources = resources.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) =>
      (r.format ?? '').toUpperCase() === 'CSV' ||
      (r.url ?? '').toLowerCase().endsWith('.csv') ||
      (r.url ?? '').toLowerCase().endsWith('.zip')
  )

  if (csvResources.length === 0) {
    throw new Error(`No CSV/ZIP resources in CKAN dataset. Resources: ${resources.map((r: any) => r.format).join(', ')}`)
  }

  for (const resource of csvResources) {
    const resourceUrl: string = resource.url
    console.log(`  Trying CKAN resource: ${resourceUrl}`)
    try {
      const resBuf = await downloadBuffer(resourceUrl)
      let csvText: string

      if (resourceUrl.toLowerCase().endsWith('.zip') || resBuf[0] === 0x50 && resBuf[1] === 0x4b) {
        // ZIP magic bytes PK
        const zip = new AdmZip(resBuf)
        const entry = zip.getEntries().find(e => e.name.endsWith('.csv'))
        if (!entry) throw new Error('No CSV in ZIP')
        csvText = entry.getData().toString('utf-8')
      } else {
        csvText = resBuf.toString('utf-8')
      }

      return parseEarningsFromCSV(csvText)
    } catch (err) {
      console.warn(`    Resource failed: ${(err as Error).message}`)
    }
  }

  throw new Error('All CKAN resources failed to yield income data')
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Phase 1: Try live data sources
  let liveEarnings: Map<string, number> | null = null

  console.log('Fetching live earnings data from Statistics Canada...')
  try {
    liveEarnings = await fetchStatsCanadaEarnings()
    console.log(`  ✓ Got province earnings from Stats Canada (${liveEarnings.size} provinces):`)
    for (const [p, v] of Array.from(liveEarnings.entries())) console.log(`    ${p}: CAD $${v.toLocaleString()}`)
  } catch (err) {
    console.warn(`  ✗ Stats Canada failed: ${(err as Error).message}`)

    console.log('  Trying fallback: open.canada.ca...')
    try {
      liveEarnings = await fetchFromOpenCanada()
      console.log(`  ✓ Got province earnings from open.canada.ca (${liveEarnings.size} provinces):`)
      for (const [p, v] of Array.from(liveEarnings.entries())) console.log(`    ${p}: CAD $${v.toLocaleString()}`)
    } catch (err2) {
      console.warn(`  ✗ Open Canada fallback failed: ${(err2 as Error).message}`)
      console.warn('  Using hardcoded NGS 2018 research values.')
    }
  }

  // Phase 2: Build rows (live province data overrides hardcoded median_earnings)
  const rows = COLLEGES.map((c) => {
    const liveEarning = liveEarnings?.get(c.province)
    if (liveEarning) {
      console.log(`  ${c.name} (${c.province}): using live CAD $${liveEarning.toLocaleString()} (was $${c.median_earnings.toLocaleString()})`)
    }
    return {
      institution_id: toSlug(c.name),
      name: c.name,
      province: c.province,
      city: c.city,
      median_earnings: liveEarning ?? c.median_earnings,
      graduation_rate: c.graduation_rate,
      avg_net_price: c.avg_net_price,
      school_type: c.school_type,
      synced_at: new Date().toISOString(),
    }
  })

  // Phase 3: Upsert
  console.log(`\nUpserting ${rows.length} colleges into colleges_ca...`)
  const { error } = await supabase
    .from('colleges_ca')
    .upsert(rows, { onConflict: 'institution_id' })

  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }
  console.log(`Done. Upserted ${rows.length} rows.`)

  // Phase 4: Refresh materialized view
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('Cannot parse project ref — run manually: REFRESH MATERIALIZED VIEW roi_explorer_ca;')
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
