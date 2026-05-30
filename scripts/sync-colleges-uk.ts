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
  'https://explore-education-statistics.service.gov.uk/find-statistics/leo-graduate-and-postgraduate-outcomes/2022-23'

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
const NOISE = new Set(['university', 'the', 'of', 'and', 'in', 'at', 'for',
  'college', 'school', 'institute', 'higher', 'education'])

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

// Returns the best-matching earnings value, or null if score < threshold
function findEarnings(
  collegeName: string,
  map: Map<string, number>,
  threshold = 0.55,
): { earnings: number; key: string; score: number } | null {
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
    await page.goto(HESA_URL, { waitUntil: 'networkidle', timeout: 40000 })

    // Dismiss cookie consent if present
    const consent = page.locator('button').filter({ hasText: /accept|agree/i })
    if (await consent.count() > 0) await consent.first().click().catch(() => {})

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

const LEO_NAME_COLS = [
  'provider_name', 'provider name', 'institution_name', 'institution name',
  'he provider', 'ukprn_name',
]
const LEO_EARNINGS_COLS = [
  'p50_earnings', 'earnings_p50', 'median_earnings', 'median earnings',
  'salary_p50', 'p50', 'annualised_salary_p50',
]

function parseLeoZip(buf: Buffer): Map<string, number> | null {
  const zip = new AdmZip(buf)
  const csvEntries = zip.getEntries()
    .filter(e => !e.isDirectory && e.entryName.toLowerCase().endsWith('.csv'))

  // Prefer files with "provider" or "institution" in the name
  const sorted = [
    ...csvEntries.filter(e => /provider|institution/i.test(e.entryName)),
    ...csvEntries.filter(e => !/provider|institution/i.test(e.entryName)),
  ]

  for (const entry of sorted) {
    const text = entry.getData().toString('utf8').replace(/^﻿/, '')
    const rows = parseCSV(text)
    if (rows.length < 5) continue

    const keys = Object.keys(rows[0])
    const nameCol     = LEO_NAME_COLS.find(c => keys.includes(c))
    const earningsCol = LEO_EARNINGS_COLS.find(c => keys.includes(c))
    if (!nameCol || !earningsCol) continue

    // Filter for 1-year-after-graduation if there's a year column
    const yearCol = keys.find(k =>
      /year.*graduation|grad.*year|year_after|years_after|tax_year/i.test(k))
    let targetRows = rows
    if (yearCol) {
      const oneYear = rows.filter(r => /^1$|^1 year|year 1/i.test(r[yearCol] ?? ''))
      if (oneYear.length > 0) targetRows = oneYear
    }

    // Aggregate: mean-of-medians per provider (handles subject breakdowns)
    const totals = new Map<string, { sum: number; n: number }>()
    for (const row of targetRows) {
      const name     = row[nameCol]?.trim()
      const earnings = parseSalary(row[earningsCol])
      if (name && !isNaN(earnings) && earnings >= 10000 && earnings <= 300000) {
        const prev = totals.get(name) ?? { sum: 0, n: 0 }
        totals.set(name, { sum: prev.sum + earnings, n: prev.n + 1 })
      }
    }

    const map = new Map<string, number>()
    totals.forEach(({ sum, n }, name) => map.set(name, Math.round(sum / n)))

    if (map.size >= 5) {
      console.log(`  [LEO] Parsed ${map.size} providers from ${path.basename(entry.entryName)}`)
      return map
    }
  }

  console.warn('  [LEO] No usable provider-earnings CSV found in the ZIP')
  return null
}

async function scrapeLeo(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`\n[LEO] Navigating to: ${LEO_URL}`)
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(LEO_URL, { waitUntil: 'networkidle', timeout: 40000 })

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

  // Upsert only median_earnings + synced_at for matched rows
  const { error: upsertErr } = await supabase
    .from('colleges_uk')
    .upsert(patches, { onConflict: 'institution_id' })

  if (upsertErr) { console.error('Upsert error:', upsertErr.message); process.exit(1) }

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
