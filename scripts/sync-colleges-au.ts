/**
 * Syncs colleges_au.median_earnings and graduation_rate from live QILT data.
 *
 * Sources:
 *   1. QILT 2024 GOS National Report Tables (ZIP → Excel)
 *      Sheet LF_UG_UNI_1Y_INST_CI — domestic undergraduate, 1-year outcomes
 *      Provides: median annual full-time salary (AUD), overall employment rate
 *
 *   2. QILT 2024 GOS International Report Tables (ZIP → Excel)
 *      Sheet LF_UG_UNI_3YP_INST_CI — international undergraduate, 2-4 year outcomes
 *      Provides: median annual full-time salary (AUD), overall employment rate
 *
 * Both ZIPs are discovered dynamically via Playwright from the QILT GOS page.
 * International salary is preferred; domestic salary is used where international is "n/a".
 *
 * After updating colleges_au, refreshes the roi_explorer_au materialized view.
 *
 * Run: npx ts-node scripts/sync-colleges-au.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import AdmZip from 'adm-zip'
import * as XLSX from 'xlsx'
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const QILT_GOS_URL = 'https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)'
const QILT_BASE    = 'https://www.qilt.edu.au'

// ── Hardcoded international tuition fees (AUD/year, 2024-25) ─────────────────
// Used only for avg_net_price; never overwrites earnings from live data.
const HARDCODED_TUITION: Record<string, number> = {
  'the-university-of-melbourne':         42000,
  'the-university-of-sydney':            44000,
  'the-australian-national-university':  41000,
  'the-university-of-queensland':        38000,
  'university-of-new-south-wales':       43000,
  'monash-university':                   38000,
  'the-university-of-western-australia': 36000,
  'the-university-of-adelaide':          35000,
  'university-of-technology-sydney':     36000,
  'rmit-university':                     33000,
  'queensland-university-of-technology': 32000,
  'university-of-wollongong':            30000,
  'macquarie-university':                37000,
  'deakin-university':                   30000,
  'griffith-university':                 29000,
  'la-trobe-university':                 28000,
  'university-of-newcastle':             28000,
  'curtin-university':                   30000,
}
const DEFAULT_TUITION = 27000

// ── State mapping ─────────────────────────────────────────────────────────────
const INSTITUTION_STATE: Record<string, string> = {
  'Australian Catholic University': 'NSW',
  'Avondale University': 'NSW',
  'Bond University': 'QLD',
  'Central Queensland University': 'QLD',
  'Charles Darwin University': 'NT',
  'Charles Sturt University': 'NSW',
  'Curtin University': 'WA',
  'Deakin University': 'VIC',
  'Edith Cowan University': 'WA',
  'Federation University Australia': 'VIC',
  'Flinders University': 'SA',
  'Griffith University': 'QLD',
  'James Cook University': 'QLD',
  'La Trobe University': 'VIC',
  'Macquarie University': 'NSW',
  'Monash University': 'VIC',
  'Murdoch University': 'WA',
  'Queensland University of Technology': 'QLD',
  'RMIT University': 'VIC',
  'Southern Cross University': 'NSW',
  'Swinburne University of Technology': 'VIC',
  'The Australian National University': 'ACT',
  'The University of Adelaide': 'SA',
  'The University of Melbourne': 'VIC',
  'The University of Notre Dame Australia': 'WA',
  'The University of Queensland': 'QLD',
  'The University of South Australia': 'SA',
  'The University of Sydney': 'NSW',
  'The University of Western Australia': 'WA',
  'Torrens University': 'SA',
  'University of Canberra': 'ACT',
  'University of Divinity': 'VIC',
  'University of New England': 'NSW',
  'University of New South Wales': 'NSW',
  'University of Newcastle': 'NSW',
  'University of Southern Queensland': 'QLD',
  'University of Tasmania': 'TAS',
  'University of Technology Sydney': 'NSW',
  'University of the Sunshine Coast': 'QLD',
  'University of Wollongong': 'NSW',
  'Victoria University': 'VIC',
  'Western Sydney University': 'NSW',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// "75,000 (73,900, 76,100)" → 75000   |  "79.4 (77.4, 81.3)" → 79.4
function parseLeading(raw: string | null | undefined): number | null {
  if (!raw || typeof raw !== 'string') return null
  const n = parseFloat(raw.replace(/,/g, '').match(/^([\d.]+)/)?.[1] ?? '')
  return isNaN(n) ? null : n
}

function downloadFile(url: string, depth = 0): Promise<Buffer> {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'))
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        if (!loc) return reject(new Error('Redirect without Location'))
        return resolve(downloadFile(loc as string, depth + 1))
      }
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// ── Playwright: discover download URLs from QILT GOS page ────────────────────

type QiltUrls = { nationalZip: string; intlZip: string }

async function discoverQiltUrls(): Promise<QiltUrls> {
  let browser
  try {
    console.log(`[Playwright] Navigating to ${QILT_GOS_URL}`)
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(QILT_GOS_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })

    const links = await page.locator('a').all()
    let nationalZip = ''
    let intlZip = ''

    for (const link of links) {
      const href = (await link.getAttribute('href').catch(() => '')) ?? ''
      if (!href.endsWith('.zip') && !href.includes('.zip?')) continue
      const text = ((await link.textContent().catch(() => '')) ?? '').toLowerCase()

      if (!intlZip && text.includes('international') && text.includes('table'))
        intlZip = href.startsWith('http') ? href : QILT_BASE + href
      else if (!nationalZip && text.includes('national') && text.includes('table'))
        nationalZip = href.startsWith('http') ? href : QILT_BASE + href
    }

    if (!nationalZip) throw new Error('Could not find National Report Tables ZIP link on QILT page')
    if (!intlZip)     throw new Error('Could not find International Report Tables ZIP link on QILT page')

    console.log(`  National ZIP: ${nationalZip.slice(0, 80)}`)
    console.log(`  Intl ZIP:     ${intlZip.slice(0, 80)}`)
    return { nationalZip, intlZip }
  } finally {
    await browser?.close()
  }
}

// ── Parse QILT LF institution sheet ──────────────────────────────────────────
// Sheet structure (0-indexed rows):
//   row 0: title
//   row 1: "Back to INDEX"
//   row 2: blank
//   row 3: headers [blank, blank, FTE, OE, LF, Salary]
//   row 4+: data   [blank, name, fte_ci, oe_ci, lf_ci, sal_ci]

type InstRecord = { salary: number | null; oe: number | null }

function parseInstSheet(wb: XLSX.WorkBook, sheetName: string): Map<string, InstRecord> {
  const ws = wb.Sheets[sheetName]
  if (!ws) { console.warn(`  Sheet "${sheetName}" not found`); return new Map() }

  const rows = XLSX.utils.sheet_to_json<(string | null)[]>(ws, {
    header: 1, defval: null,
  }) as (string | null)[][]

  const map = new Map<string, InstRecord>()
  const SKIP = new Set(['', 'All universities', 'Standard deviation'])

  for (const row of rows.slice(4)) {
    const name = row[1]?.toString().trim()
    if (!name || SKIP.has(name)) continue

    // col 3 = Overall employment rate, col 5 = Median annual full-time salary
    const oe     = parseLeading(row[3])
    const salary = parseLeading(row[5])

    map.set(name, {
      salary,
      oe: oe != null ? oe / 100 : null,   // convert % → 0-1
    })
  }
  return map
}

// ── Materialized view refresh ─────────────────────────────────────────────────

async function refreshView() {
  const projectRef = SUPABASE_URL!.match(/https?:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('  Cannot parse project ref — run manually: REFRESH MATERIALIZED VIEW roi_explorer_au;')
    return
  }
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN ?? ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_au;' }),
    }
  )
  if (res.ok) {
    console.log('  roi_explorer_au refreshed.')
  } else {
    const body = await res.text()
    console.warn(`  Refresh failed (${res.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_au;')
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // ── Step 1: discover download URLs ───────────────────────────────────────
  console.log('=== Step 1: Discovering QILT download URLs ===')
  const { nationalZip, intlZip } = await discoverQiltUrls()

  // ── Step 2: download and parse national Excel ─────────────────────────────
  console.log('\n=== Step 2: Downloading National Report Tables ZIP ===')
  const natBuf = await downloadFile(nationalZip)
  console.log(`  Downloaded ${(natBuf.length / 1024).toFixed(0)} KB`)

  const natZip  = new AdmZip(natBuf)
  const natXlsx = natZip.getEntries().find(e => e.entryName.toLowerCase().endsWith('.xlsx'))
  if (!natXlsx) throw new Error('No .xlsx in national ZIP')
  const natWb   = XLSX.read(natXlsx.getData(), { type: 'buffer' })

  const domestic = parseInstSheet(natWb, 'LF_UG_UNI_1Y_INST_CI')
  console.log(`  Parsed ${domestic.size} institutions (domestic, 1-year)`)

  // ── Step 3: download and parse international Excel ────────────────────────
  console.log('\n=== Step 3: Downloading International Report Tables ZIP ===')
  const intBuf = await downloadFile(intlZip)
  console.log(`  Downloaded ${(intBuf.length / 1024).toFixed(0)} KB`)

  const intZip  = new AdmZip(intBuf)
  const intXlsx = intZip.getEntries().find(e => e.entryName.toLowerCase().endsWith('.xlsx'))
  if (!intXlsx) throw new Error('No .xlsx in international ZIP')
  const intWb   = XLSX.read(intXlsx.getData(), { type: 'buffer' })

  const international = parseInstSheet(intWb, 'LF_UG_UNI_3YP_INST_CI')
  console.log(`  Parsed ${international.size} institutions (international, 2-4 year)`)

  // ── Step 4: merge and build records ──────────────────────────────────────
  console.log('\n=== Step 4: Merging domestic + international data ===')

  // Union of all institution names from both sources
  const allNames = new Set([...Array.from(domestic.keys()), ...Array.from(international.keys())])
  const now = new Date().toISOString()

  const records: {
    institution_id: string
    name: string
    state: string | null
    city: string
    median_earnings: number | null
    graduation_rate: number | null
    avg_net_price: number
    synced_at: string
  }[] = []

  for (const name of Array.from(allNames)) {
    const dom  = domestic.get(name)
    const intl = international.get(name)

    // Prefer international salary; fall back to domestic
    const salary = intl?.salary ?? dom?.salary ?? null
    // Use domestic OE% as graduation_rate (1-year outcomes, more reliable sample)
    const oe     = dom?.oe ?? intl?.oe ?? null

    const slug = toSlug(name)

    if (salary !== null) {
      console.log(
        `  ${name.padEnd(45)} intl=${intl?.salary?.toLocaleString() ?? 'n/a'} ` +
        `dom=${dom?.salary?.toLocaleString() ?? 'n/a'} → using ${salary.toLocaleString()} OE=${oe != null ? (oe * 100).toFixed(1) + '%' : 'n/a'}`
      )
    }

    records.push({
      institution_id: slug,
      name,
      state:            INSTITUTION_STATE[name] ?? null,
      city:             '',
      median_earnings:  salary,
      graduation_rate:  oe,
      avg_net_price:    HARDCODED_TUITION[slug] ?? DEFAULT_TUITION,
      synced_at:        now,
    })
  }

  console.log(`\n  Total: ${records.length} institutions, ${records.filter(r => r.median_earnings).length} with salary data`)

  // ── Step 5: upsert to colleges_au ────────────────────────────────────────
  console.log('\n=== Step 5: Upserting to colleges_au ===')
  const { error: upsertErr } = await supabase
    .from('colleges_au')
    .upsert(records, { onConflict: 'institution_id' })

  if (upsertErr) { console.error('Upsert error:', upsertErr.message); process.exit(1) }
  console.log(`  Upserted ${records.length} rows`)

  // ── Step 6: refresh materialized view ────────────────────────────────────
  console.log('\n=== Step 6: Refreshing roi_explorer_au ===')
  await refreshView()

  // ── Step 7: results ───────────────────────────────────────────────────────
  const { data: sample } = await supabase
    .from('colleges_au')
    .select('name, median_earnings, graduation_rate')
    .not('median_earnings', 'is', null)
    .order('median_earnings', { ascending: false })
    .limit(3)

  console.log(`\n=== Done: ${records.filter(r => r.median_earnings).length} colleges updated ===`)
  console.log('\nTop 3 by median earnings:')
  sample?.forEach((r, i) =>
    console.log(`  ${i + 1}. ${r.name}: A$${r.median_earnings?.toLocaleString()} (OE: ${r.graduation_rate != null ? (r.graduation_rate * 100).toFixed(1) + '%' : 'n/a'})`)
  )
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
