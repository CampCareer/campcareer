/**
 * Updates colleges_uk.median_earnings from live official data.
 *
 * Sources (in priority order):
 *   1. HESA Graduate Outcomes 2022/23 (SB272)
 *      https://www.hesa.ac.uk/news/17-07-2025/sb272-higher-education-graduate-outcomes-statistics/salary
 *      Playwright finds "Download source data (zip)" → parses institution-level median salary CSV
 *
 *   2. DfE Longitudinal Education Outcomes 2022-23 (fallback)
 *      https://explore-education-statistics.service.gov.uk/find-statistics/leo-graduate-and-postgraduate-outcomes/2022-23
 *      Playwright finds "Download all data (ZIP)" → parses provider median earnings CSV
 *
 * After patching median_earnings, refreshes the roi_explorer_uk materialized view.
 *
 * Run: npx ts-node scripts/sync-colleges-uk.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import AdmZip from 'adm-zip'
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

// ── URLs ──────────────────────────────────────────────────────────────────────

const HESA_URL =
  'https://www.hesa.ac.uk/news/17-07-2025/sb272-higher-education-graduate-outcomes-statistics/salary'

const LEO_URL =
  'https://explore-education-statistics.service.gov.uk/find-statistics/graduate-outcomes-leo-provider-level-data/2022-23'

// ── HTTP download ─────────────────────────────────────────────────────────────

function downloadBuffer(url: string, depth = 0): Promise<Buffer> {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'))
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        if (!loc) return reject(new Error(`Redirect without Location header from ${url}`))
        return resolve(downloadBuffer(loc, depth + 1))
      }
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
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
    if (c === '"') { inQ = !inQ }
    else if (c === ',' && !inQ) { cells.push(cur); cur = '' }
    else { cur += c }
  }
  cells.push(cur)
  return cells
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = splitCSVRow(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g, ' '))
  return lines.slice(1).map(line => {
    const vals = splitCSVRow(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = (vals[i] ?? '').trim() })
    return row
  })
}

// Strips currency symbols, commas, whitespace; returns NaN on suppressed values ('c', '-', 'N/A')
function parseSalary(raw: string | undefined): number {
  if (!raw) return NaN
  const cleaned = raw.replace(/[£$,\s]/g, '')
  if (/^(c|-|n\/a|x|\*|\.+)$/i.test(cleaned)) return NaN
  return parseFloat(cleaned)
}

// ── Fuzzy name matching ───────────────────────────────────────────────────────

// Meaningful words only — skip words that appear in almost every institution name
// Note: "college" is NOT excluded because "University College X" ≠ "University of X"
const NOISE = new Set(['university', 'the', 'of', 'and', 'in', 'at', 'for',
  'school', 'institute', 'higher', 'education'])

// Manual aliases for institutions whose LEO UKPRN name differs significantly
// from the common name stored in our DB.
const NAME_ALIASES: Record<string, string> = {
  'imperial college london':
    'Imperial College of Science, Technology and Medicine',
  'city, university of london':
    "City St George's, University of London",
  'royal holloway, university of london':
    'Royal Holloway and Bedford New College',
  'newcastle university':
    'University of Newcastle Upon Tyne',
}

function wordTokens(s: string): string[] {
  return Array.from(
    new Set(
      s.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1 && !NOISE.has(w))
    )
  )
}

function overlapScore(a: string, b: string): number {
  const wa = wordTokens(a)
  const wb = new Set(wordTokens(b))
  if (wa.length === 0 || wb.size === 0) return 0
  const n = wa.filter(w => wb.has(w)).length
  return n / Math.max(wa.length, wb.size)
}

// Returns the best-matching earnings value, or null if score < threshold.
// Checks NAME_ALIASES first, then falls back to fuzzy word-overlap scoring.
function findEarnings(
  collegeName: string,
  map: Map<string, number>,
  threshold = 0.55,
): { earnings: number; key: string; score: number } | null {
  // Check manual alias first — direct map lookup, no fuzzy needed
  const alias = NAME_ALIASES[collegeName.toLowerCase()]
  if (alias) {
    const earnings = map.get(alias)
    if (earnings !== undefined) return { earnings, key: alias, score: 1.0 }
  }

  let best: { earnings: number; key: string; score: number } | null = null
  map.forEach((earnings, key) => {
    const s = overlapScore(collegeName, key)
    if (s >= threshold && (!best || s > best.score))
      best = { earnings, key, score: s }
  })
  return best
}

// ── Source 1: HESA SB272 ──────────────────────────────────────────────────────

// Candidate column names (lower-cased, space-normalised)
const HESA_NAME_COLS = [
  'he provider', 'provider name', 'institution name', 'institution', 'provider',
]
const HESA_SALARY_COLS = [
  'annualised salary (median)', 'annual salary (median)', 'median salary',
  'median annual salary', 'annualised median salary', 'median earnings',
  'salary (median)', 'annualised salary median', 'annual salary median',
]

function parseHesaZip(buf: Buffer): Map<string, number> | null {
  const zip = new AdmZip(buf)
  const csvEntries = zip.getEntries()
    .filter(e => !e.isDirectory && e.entryName.toLowerCase().endsWith('.csv'))

  // Prefer files with "salary" or "earnings" in the name
  const sorted = [
    ...csvEntries.filter(e => /salary|earnings/i.test(e.entryName)),
    ...csvEntries.filter(e => !/salary|earnings/i.test(e.entryName)),
  ]

  for (const entry of sorted) {
    const text = entry.getData().toString('utf8').replace(/^﻿/, '') // strip BOM
    const rows = parseCSV(text)
    if (rows.length < 5) continue

    const keys = Object.keys(rows[0])
    const nameCol   = HESA_NAME_COLS.find(c => keys.includes(c))
    const salaryCol = HESA_SALARY_COLS.find(c => keys.includes(c))
    if (!nameCol || !salaryCol) continue

    // If there's a subject column, prefer "All" aggregate rows
    const subjectCol = keys.find(k => /^(subject area|subject|jacs|hecos)/.test(k))
    let targetRows = rows
    if (subjectCol) {
      const allRows = rows.filter(r => /^all(\s|$)/i.test(r[subjectCol] ?? ''))
      if (allRows.length > 0) targetRows = allRows
    }

    const map = new Map<string, number>()
    for (const row of targetRows) {
      const name   = row[nameCol]?.trim()
      const salary = parseSalary(row[salaryCol])
      if (name && !isNaN(salary) && salary >= 15000 && salary <= 300000)
        if (!map.has(name)) map.set(name, salary)
    }

    if (map.size >= 5) {
      console.log(`  [HESA] Parsed ${map.size} providers from ${path.basename(entry.entryName)}`)
      return map
    }
  }

  console.warn('  [HESA] No usable institution-salary CSV found in the ZIP')
  return null
}

async function scrapeHesa(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`\n[HESA] Navigating to: ${HESA_URL}`)
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    // networkidle often times out on HESA — domcontentloaded is sufficient
    await page.goto(HESA_URL, { waitUntil: 'domcontentloaded', timeout: 40000 })

    // Dismiss cookie consent if present
    const consent = page.locator('button').filter({ hasText: /accept|agree/i })
    if (await consent.count() > 0) await consent.first().click().catch(() => {})

    // Wait up to 15s for any download link to appear in the DOM
    await page.waitForSelector('a[href*=".zip"], a[href*="download"]', { timeout: 15000 }).catch(() => {})

    // Find the zip download link — try a few text patterns
    const linkPatterns = [
      /download source data.*zip/i,
      /download.*source.*data/i,
      /source data.*zip/i,
      /download.*zip/i,
    ]
    let href: string | null = null
    for (const pattern of linkPatterns) {
      const loc = page.locator('a').filter({ hasText: pattern })
      if (await loc.count() > 0) {
        href = await loc.first().getAttribute('href')
        if (href) break
      }
    }
    if (!href) throw new Error('No download zip link found on HESA page')

    const downloadUrl = href.startsWith('http') ? href : new URL(href, HESA_URL).toString()
    console.log(`  [HESA] Download URL: ${downloadUrl}`)

    const buf = await downloadBuffer(downloadUrl)
    console.log(`  [HESA] Downloaded ${(buf.length / 1024).toFixed(0)} KB`)
    return parseHesaZip(buf)
  } catch (err) {
    console.warn(`  [HESA] Failed: ${(err as Error).message}`)
    return null
  } finally {
    await browser?.close()
  }
}

// ── Source 2: LEO 2022-23 ─────────────────────────────────────────────────────

/**
 * The LEO provider-level ZIP contains a nested ZIP:
 *   supporting-files/leo_provider_dashboard_underlying_data.zip
 * which in turn contains a large CSV (~750 MB uncompressed):
 *   provider_data_YYYYMMDD.csv
 *
 * Columns of interest:
 *   tax_year, academic_year, YAG, home_region_code, current_region_code,
 *   provider_name, cah2_subject_name, characteristic_value,
 *   earnings_median
 *
 * Filters applied:
 *   YAG = 1 (1 year after graduation)
 *   home_region_code = Total  (no home-region split)
 *   current_region_code = Total
 *   cah2_subject_name = Total  (all subjects)
 *   characteristic_value = All graduates
 *   provider_name ≠ Total  (exclude national aggregate rows)
 *
 * For each provider, keep the row from the most recent tax_year.
 */
function parseLeoProviderCSVBuffer(csvBuf: Buffer): Map<string, number> | null {
  // ── find header line ───────────────────────────────────────────────────────
  let headerEnd = 0
  for (let i = 0; i < csvBuf.length; i++) {
    if (csvBuf[i] === 0x0A) { headerEnd = i; break }
  }
  if (!headerEnd) return null

  const headerRaw = csvBuf.slice(0, headerEnd).toString('utf8').replace(/\r$/, '')
  const headers = splitCSVRow(headerRaw).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase())

  const idx = (name: string) => headers.indexOf(name)
  const iProvider  = idx('provider_name')
  const iEarnings  = idx('earnings_median')
  const iTaxYear   = idx('tax_year')
  const iYAG       = idx('yag')
  const iHomeReg   = idx('home_region_code')
  const iCurrReg   = idx('current_region_code')
  const iSubject   = idx('cah2_subject_name')
  const iCharVal   = idx('characteristic_value')

  if (iProvider < 0 || iEarnings < 0) {
    console.warn('  [LEO] provider_name or earnings_median column not found')
    return null
  }

  // ── line-by-line parse (avoids huge string allocation) ────────────────────
  const byProvider = new Map<string, { earnings: number; taxYear: string }>()
  let lineStart = headerEnd + 1

  for (let i = lineStart; i <= csvBuf.length; i++) {
    if (i === csvBuf.length || csvBuf[i] === 0x0A) {
      let end = i
      if (end > lineStart && csvBuf[end - 1] === 0x0D) end--
      if (end > lineStart) {
        const line = csvBuf.slice(lineStart, end).toString('utf8')
        const vals = splitCSVRow(line).map(v => v.replace(/^"|"$/g, '').trim())

        const provider = vals[iProvider] ?? ''
        if (!provider || provider === 'Total') { lineStart = i + 1; continue }

        // Apply filters
        if (iYAG      >= 0 && vals[iYAG]      !== '1')             { lineStart = i + 1; continue }
        if (iHomeReg  >= 0 && vals[iHomeReg]   !== 'Total')         { lineStart = i + 1; continue }
        if (iCurrReg  >= 0 && vals[iCurrReg]   !== 'Total')         { lineStart = i + 1; continue }
        if (iSubject  >= 0 && vals[iSubject]   !== 'Total')         { lineStart = i + 1; continue }
        if (iCharVal  >= 0 && vals[iCharVal]   !== 'All graduates') { lineStart = i + 1; continue }

        const taxYear  = vals[iTaxYear] ?? ''
        const earnings = parseSalary(vals[iEarnings])
        if (isNaN(earnings) || earnings < 10000 || earnings > 300000) { lineStart = i + 1; continue }

        const existing = byProvider.get(provider)
        if (!existing || taxYear > existing.taxYear)
          byProvider.set(provider, { earnings, taxYear })
      }
      lineStart = i + 1
    }
  }

  if (byProvider.size < 5) return null

  const map = new Map<string, number>()
  byProvider.forEach(({ earnings }, name) => map.set(name, earnings))
  console.log(`  [LEO] Parsed ${map.size} providers (most recent year per provider)`)
  return map
}

function parseLeoZip(outerBuf: Buffer): Map<string, number> | null {
  const outer = new AdmZip(outerBuf)

  // Try the nested dashboard ZIP first
  const innerEntry = outer.getEntry('supporting-files/leo_provider_dashboard_underlying_data.zip')
  if (innerEntry) {
    console.log('  [LEO] Extracting nested ZIP...')
    const inner = new AdmZip(innerEntry.getData())
    const csvEntry = inner.getEntries().find(
      e => !e.isDirectory && /provider_data.*\.csv$/i.test(e.entryName)
    )
    if (csvEntry) {
      console.log(`  [LEO] Parsing ${path.basename(csvEntry.entryName)} (${(csvEntry.header.size / 1024 / 1024).toFixed(0)} MB)...`)
      const result = parseLeoProviderCSVBuffer(csvEntry.getData())
      if (result) return result
    }
  }

  // Fallback: look for a regular CSV with provider_name + earnings_median columns
  const csvEntries = outer.getEntries()
    .filter(e => !e.isDirectory && e.entryName.toLowerCase().endsWith('.csv'))

  for (const entry of csvEntries) {
    const snippet = entry.getData().slice(0, 1024).toString('utf8').replace(/^﻿/, '')
    const headerLine = snippet.split('\n')[0]
    if (!headerLine.includes('provider_name') && !headerLine.includes('provider name')) continue
    if (!headerLine.includes('earnings') && !headerLine.includes('salary')) continue

    const result = parseLeoProviderCSVBuffer(entry.getData())
    if (result) return result
  }

  console.warn('  [LEO] No usable provider-earnings data found in the ZIP')
  return null
}

async function scrapeLeo(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`\n[LEO] Navigating to: ${LEO_URL}`)
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(LEO_URL, { waitUntil: 'domcontentloaded', timeout: 40000 })

    const consent = page.locator('button').filter({ hasText: /accept|agree/i })
    if (await consent.count() > 0) await consent.first().click().catch(() => {})

    // Find "Download all data (ZIP)" link
    const linkPatterns = [
      /download all data.*zip/i,
      /download all data/i,
      /download.*all.*zip/i,
    ]
    let href: string | null = null
    for (const pattern of linkPatterns) {
      const loc = page.locator('a').filter({ hasText: pattern })
      if (await loc.count() > 0) {
        href = await loc.first().getAttribute('href')
        if (href) break
      }
    }

    // Fallback: intercept via Playwright download event
    if (!href) {
      console.log('  [LEO] No direct href found — trying click-based download...')
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 30000 }),
        page.locator('a, button').filter({ hasText: /download all data/i }).first().click(),
      ])
      const downloadPath = await download.path()
      if (!downloadPath) throw new Error('Playwright download produced no file')
      const { readFileSync, unlinkSync } = await import('fs')
      const buf = readFileSync(downloadPath)
      unlinkSync(downloadPath)
      console.log(`  [LEO] Downloaded ${(buf.length / 1024).toFixed(0)} KB (via click)`)
      return parseLeoZip(buf)
    }

    const downloadUrl = href.startsWith('http') ? href : new URL(href, LEO_URL).toString()
    console.log(`  [LEO] Download URL: ${downloadUrl}`)
    const buf = await downloadBuffer(downloadUrl)
    console.log(`  [LEO] Downloaded ${(buf.length / 1024).toFixed(0)} KB`)
    return parseLeoZip(buf)
  } catch (err) {
    console.warn(`  [LEO] Failed: ${(err as Error).message}`)
    return null
  } finally {
    await browser?.close()
  }
}

// ── Materialized view refresh ─────────────────────────────────────────────────

async function refreshView() {
  const projectRef = SUPABASE_URL!.match(/https?:\/\/([^.]+)/)?.[1]
  if (!projectRef) {
    console.warn('  Cannot parse project ref — skipping view refresh.')
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_uk;')
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
      body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_uk;' }),
    }
  )
  if (res.ok) {
    console.log('  roi_explorer_uk refreshed.')
  } else {
    const body = await res.text()
    console.warn(`  Refresh failed (${res.status}): ${body}`)
    console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_uk;')
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // ── Step 1: fetch earnings data ───────────────────────────────────────────

  console.log('=== Step 1: Fetching earnings data ===')
  let earningsMap = await scrapeHesa()
  let source = 'HESA SB272 2022/23'

  if (!earningsMap || earningsMap.size < 5) {
    console.log('\nHESA source insufficient — trying LEO fallback...')
    earningsMap = await scrapeLeo()
    source = 'LEO 2022-23'
  }

  if (!earningsMap || earningsMap.size === 0) {
    console.error('\nBoth HESA and LEO sources failed. Aborting.')
    process.exit(1)
  }

  console.log(`\nSource: ${source} (${earningsMap.size} institutions loaded)`)

  // ── Step 2: fetch existing colleges_uk rows ───────────────────────────────

  console.log('\n=== Step 2: Loading colleges_uk ===')
  const { data: colleges, error: fetchErr } = await supabase
    .from('colleges_uk')
    .select('institution_id, name, median_earnings')

  if (fetchErr) { console.error('Fetch error:', fetchErr.message); process.exit(1) }
  if (!colleges?.length) { console.error('No rows in colleges_uk.'); process.exit(1) }
  console.log(`Loaded ${colleges.length} colleges`)

  // ── Step 3: match & patch median_earnings ────────────────────────────────

  console.log('\n=== Step 3: Matching & updating ===')
  const patches: Array<{ institution_id: string; median_earnings: number; synced_at: string }> = []
  const unmatched: string[] = []
  const now = new Date().toISOString()

  for (const college of colleges) {
    const match = findEarnings(college.name, earningsMap)
    if (match) {
      patches.push({ institution_id: college.institution_id, median_earnings: match.earnings, synced_at: now })
      console.log(
        `  ✓ ${college.name}\n` +
        `      matched "${match.key}" (score ${match.score.toFixed(2)})\n` +
        `      £${college.median_earnings?.toLocaleString() ?? '—'} → £${match.earnings.toLocaleString()}`
      )
    } else {
      unmatched.push(college.name)
    }
  }

  if (unmatched.length)
    console.log(`\n  No match for: ${unmatched.join(', ')}`)

  if (patches.length === 0) {
    console.error('\nNo matches — aborting update.')
    process.exit(1)
  }

  // Update only median_earnings + synced_at — use individual updates to avoid
  // upsert's implicit INSERT which fails the NOT NULL constraint on other columns.
  const updateResults = await Promise.all(
    patches.map(p =>
      supabase
        .from('colleges_uk')
        .update({ median_earnings: p.median_earnings, synced_at: p.synced_at })
        .eq('institution_id', p.institution_id)
    )
  )
  const updateErr = updateResults.find(r => r.error)?.error
  if (updateErr) { console.error('Update error:', updateErr.message); process.exit(1) }

  // ── Step 4: refresh materialized view ────────────────────────────────────

  console.log('\n=== Step 4: Refreshing roi_explorer_uk ===')
  await refreshView()

  // ── Step 5: results ───────────────────────────────────────────────────────

  const { data: sample } = await supabase
    .from('colleges_uk')
    .select('name, median_earnings')
    .order('median_earnings', { ascending: false })
    .limit(3)

  console.log(`\n=== Done: ${patches.length} colleges updated ===`)
  console.log('\nTop 3 by median earnings (after update):')
  sample?.forEach((r, i) =>
    console.log(`  ${i + 1}. ${r.name}: £${r.median_earnings?.toLocaleString()}`)
  )
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
