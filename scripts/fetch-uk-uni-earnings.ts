/**
 * One-shot script: download HESA graduate earnings data, match with our colleges,
 * and output median_earnings as JSON so we can merge into uk-colleges.json.
 *
 * Usage: npx tsx scripts/fetch-uk-uni-earnings.ts
 */

import AdmZip from "adm-zip"
import fs from "fs"
import path from "path"
import https from "https"
import http from "http"
import { chromium } from "playwright"

// ── Our colleges from uk-colleges.json ────────────────────────────────────────

interface CollegeEntry {
  institution_id: string
  name: string
  city: string
  region: string
  qs_rank: number | null
  t?: number
  website: string | null
}

const COLLEGES: CollegeEntry[] = JSON.parse(
  fs.readFileSync(path.resolve("src/data/uk-colleges.json"), "utf-8"),
)

// ── HTTP download ─────────────────────────────────────────────────────────────

function downloadBuffer(url: string, depth = 0): Promise<Buffer> {
  if (depth > 5) return Promise.reject(new Error("Too many redirects"))
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        if (!loc) return reject(new Error("Redirect without Location"))
        return resolve(downloadBuffer(loc, depth + 1))
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks: Buffer[] = []
      res.on("data", (c: Buffer) => chunks.push(c))
      res.on("end", () => resolve(Buffer.concat(chunks)))
      res.on("error", reject)
    })
    req.on("error", reject)
  })
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function splitCSVRow(line: string): string[] {
  const cells: string[] = []
  let cur = ""
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') inQ = !inQ
    else if (c === "," && !inQ) { cells.push(cur); cur = "" }
    else cur += c
  }
  cells.push(cur)
  return cells
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = splitCSVRow(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g, " "))
  return lines.slice(1).map(line => {
    const vals = splitCSVRow(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = (vals[i] ?? "").trim() })
    return row
  })
}

function parseSalary(raw: string | undefined): number {
  if (!raw) return NaN
  const cleaned = raw.replace(/[£$,\s]/g, "")
  if (/^(c|-|n\/a|x|\*|\.+)$/i.test(cleaned)) return NaN
  return parseFloat(cleaned)
}

// ── Fuzzy matching (same as sync-colleges-uk.ts) ──────────────────────────────

const NOISE = new Set(["university", "the", "of", "and", "in", "at", "for",
  "school", "institute", "higher", "education"])

const NAME_ALIASES: Record<string, string> = {
  "imperial college london": "Imperial College of Science, Technology and Medicine",
  "city, university of london": "City St George's, University of London",
  "royal holloway, university of london": "Royal Holloway and Bedford New College",
  "newcastle university": "University of Newcastle Upon Tyne",
  "ucl": "University College London",
  "soas university of london": "The School of Oriental and African Studies",
  "northumbria university": "University of Northumbria At Newcastle",
}

function wordTokens(s: string): string[] {
  return Array.from(
    new Set(
      s.toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 1 && !NOISE.has(w)),
    ),
  )
}

function overlapScore(a: string, b: string): number {
  const wa = wordTokens(a)
  const wb = new Set(wordTokens(b))
  if (wa.length === 0 || wb.size === 0) return 0
  const n = wa.filter(w => wb.has(w)).length
  return n / Math.max(wa.length, wb.size)
}

function findEarnings(
  collegeName: string,
  map: Map<string, number>,
  threshold = 0.55,
): { earnings: number; key: string; score: number } | null {
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

// ── Parse HESA ZIP ────────────────────────────────────────────────────────────

const HESA_NAME_COLS = [
  "he provider", "provider name", "institution name", "institution", "provider",
]
const HESA_SALARY_COLS = [
  "annualised salary (median)", "annual salary (median)", "median salary",
  "median annual salary", "annualised median salary", "median earnings",
  "salary (median)", "annualised salary median", "annual salary median",
]

function parseHesaZip(buf: Buffer): Map<string, number> | null {
  const zip = new AdmZip(buf)
  const csvEntries = zip.getEntries()
    .filter(e => !e.isDirectory && e.entryName.toLowerCase().endsWith(".csv"))

  const sorted = [
    ...csvEntries.filter(e => /salary|earnings/i.test(e.entryName)),
    ...csvEntries.filter(e => !/salary|earnings/i.test(e.entryName)),
  ]

  for (const entry of sorted) {
    const text = entry.getData().toString("utf8").replace(/^\uFEFF/, "")
    const rows = parseCSV(text)
    if (rows.length < 5) continue

    const keys = Object.keys(rows[0])
    const nameCol   = HESA_NAME_COLS.find(c => keys.includes(c))
    const salaryCol = HESA_SALARY_COLS.find(c => keys.includes(c))
    if (!nameCol || !salaryCol) continue

    const subjectCol = keys.find(k => /^(subject area|subject|jacs|hecos)/.test(k))
    let targetRows = rows
    if (subjectCol) {
      const allRows = rows.filter(r => /^all(\s|$)/i.test(r[subjectCol] ?? ""))
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
  return null
}

// ── Parse LEO ZIP ─────────────────────────────────────────────────────────────

function parseLeoProviderCSVBuffer(csvBuf: Buffer): Map<string, number> | null {
  let headerEnd = 0
  for (let i = 0; i < csvBuf.length; i++) {
    if (csvBuf[i] === 0x0A) { headerEnd = i; break }
  }
  if (!headerEnd) return null

  const headerRaw = csvBuf.slice(0, headerEnd).toString("utf8").replace(/\r$/, "")
  const headers = splitCSVRow(headerRaw).map(h => h.replace(/^"|"$/g, "").trim().toLowerCase())

  const idx = (name: string) => headers.indexOf(name)
  const iProvider  = idx("provider_name")
  const iEarnings  = idx("earnings_median")
  const iTaxYear   = idx("tax_year")
  const iYAG       = idx("yag")
  const iHomeReg   = idx("home_region_code")
  const iCurrReg   = idx("current_region_code")
  const iSubject   = idx("cah2_subject_name")
  const iCharVal   = idx("characteristic_value")

  if (iProvider < 0 || iEarnings < 0) return null

  const byProvider = new Map<string, { earnings: number; taxYear: string }>()
  let lineStart = headerEnd + 1

  for (let i = lineStart; i <= csvBuf.length; i++) {
    if (i === csvBuf.length || csvBuf[i] === 0x0A) {
      let end = i
      if (end > lineStart && csvBuf[end - 1] === 0x0D) end--
      if (end > lineStart) {
        const line = csvBuf.slice(lineStart, end).toString("utf8")
        const vals = splitCSVRow(line).map(v => v.replace(/^"|"$/g, "").trim())

        const provider = vals[iProvider] ?? ""
        if (!provider || provider === "Total") { lineStart = i + 1; continue }

        if (iYAG      >= 0 && vals[iYAG]      !== "1")             { lineStart = i + 1; continue }
        if (iHomeReg  >= 0 && vals[iHomeReg]   !== "Total")        { lineStart = i + 1; continue }
        if (iCurrReg  >= 0 && vals[iCurrReg]   !== "Total")        { lineStart = i + 1; continue }
        if (iSubject  >= 0 && vals[iSubject]   !== "Total")        { lineStart = i + 1; continue }
        if (iCharVal  >= 0 && vals[iCharVal]   !== "All graduates"){ lineStart = i + 1; continue }

        const taxYear  = vals[iTaxYear] ?? ""
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
  console.log(`  [LEO] Parsed ${map.size} providers`)
  return map
}

function parseLeoZip(outerBuf: Buffer): Map<string, number> | null {
  const outer = new AdmZip(outerBuf)
  const innerEntry = outer.getEntry("supporting-files/leo_provider_dashboard_underlying_data.zip")
  if (innerEntry) {
    console.log("  [LEO] Extracting nested ZIP...")
    const inner = new AdmZip(innerEntry.getData())
    const csvEntry = inner.getEntries().find(
      e => !e.isDirectory && /provider_data.*\.csv$/i.test(e.entryName),
    )
    if (csvEntry) {
      console.log(`  [LEO] Parsing ${path.basename(csvEntry.entryName)} (${(csvEntry.header.size / 1024 / 1024).toFixed(0)} MB)...`)
      const result = parseLeoProviderCSVBuffer(csvEntry.getData())
      if (result) return result
    }
  }

  const csvEntries = outer.getEntries()
    .filter(e => !e.isDirectory && e.entryName.toLowerCase().endsWith(".csv"))

  for (const entry of csvEntries) {
    const snippet = entry.getData().slice(0, 1024).toString("utf8").replace(/^\uFEFF/, "")
    const headerLine = snippet.split("\n")[0]
    if (!headerLine.includes("provider_name") && !headerLine.includes("provider name")) continue
    if (!headerLine.includes("earnings") && !headerLine.includes("salary")) continue

    const result = parseLeoProviderCSVBuffer(entry.getData())
    if (result) return result
  }
  return null
}

// ── Scrape HESA page ──────────────────────────────────────────────────────────

const HESA_URL =
  "https://www.hesa.ac.uk/news/17-07-2025/sb272-higher-education-graduate-outcomes-statistics/salary"

async function scrapeHesa(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`\n[HESA] Navigating...`)
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] })
    const page = await browser.newPage()
    await page.goto(HESA_URL, { waitUntil: "domcontentloaded", timeout: 40000 })

    const consent = page.locator("button").filter({ hasText: /accept|agree/i })
    if (await consent.count() > 0) await consent.first().click().catch(() => {})

    await page.waitForSelector('a[href*=".zip"], a[href*="download"]', { timeout: 15000 }).catch(() => {})

    const linkPatterns = [
      /download source data.*zip/i,
      /download.*source.*data/i,
      /source data.*zip/i,
      /download.*zip/i,
    ]
    let href: string | null = null
    for (const pattern of linkPatterns) {
      const loc = page.locator("a").filter({ hasText: pattern })
      if (await loc.count() > 0) {
        href = await loc.first().getAttribute("href")
        if (href) break
      }
    }
    if (!href) throw new Error("No download zip link found on HESA page")

    const downloadUrl = href.startsWith("http") ? href : new URL(href, HESA_URL).toString()
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

// ── Scrape LEO page ───────────────────────────────────────────────────────────

const LEO_URL =
  "https://explore-education-statistics.service.gov.uk/find-statistics/graduate-outcomes-leo-provider-level-data/2022-23"

async function scrapeLeo(): Promise<Map<string, number> | null> {
  let browser
  try {
    console.log(`\n[LEO] Navigating...`)
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] })
    const page = await browser.newPage()
    await page.goto(LEO_URL, { waitUntil: "domcontentloaded", timeout: 40000 })

    const consent = page.locator("button").filter({ hasText: /accept|agree/i })
    if (await consent.count() > 0) await consent.first().click().catch(() => {})

    const linkPatterns = [
      /download all data.*zip/i,
      /download all data/i,
      /download.*all.*zip/i,
    ]
    let href: string | null = null
    for (const pattern of linkPatterns) {
      const loc = page.locator("a").filter({ hasText: pattern })
      if (await loc.count() > 0) {
        href = await loc.first().getAttribute("href")
        if (href) break
      }
    }

    if (!href) {
      console.log("  [LEO] No direct href — trying click-based download...")
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 30000 }),
        page.locator("a, button").filter({ hasText: /download all data/i }).first().click(),
      ])
      const downloadPath = await download.path()
      if (!downloadPath) throw new Error("Playwright download produced no file")
      const { readFileSync, unlinkSync } = await import("fs")
      const buf = readFileSync(downloadPath)
      unlinkSync(downloadPath)
      console.log(`  [LEO] Downloaded ${(buf.length / 1024).toFixed(0)} KB (via click)`)
      return parseLeoZip(buf)
    }

    const downloadUrl = href.startsWith("http") ? href : new URL(href, LEO_URL).toString()
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

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  let earningsMap = await scrapeHesa()
  let source = "HESA SB272 2022/23"

  if (!earningsMap || earningsMap.size < 5) {
    console.log("\nHESA failed — trying LEO...")
    earningsMap = await scrapeLeo()
    source = "LEO 2022-23"
  }

  if (!earningsMap || earningsMap.size === 0) {
    console.error("Both sources failed.")
    process.exit(1)
  }

  console.log(`\nSource: ${source} (${earningsMap.size} institutions)`)

  // Match against our colleges
  const result: Record<string, number | null> = {}
  let matched = 0
  for (const c of COLLEGES) {
    const match = findEarnings(c.name, earningsMap)
    if (match) {
      result[c.institution_id] = match.earnings
      matched++
      console.log(`  ✓ ${c.name}: £${match.earnings.toLocaleString()}`)
    } else {
      result[c.institution_id] = null
      console.log(`  ✗ ${c.name}: no match`)
    }
  }

  console.log(`\nMatched: ${matched}/${COLLEGES.length}`)

  // Write output
  const outPath = path.resolve("scripts/uk-earnings-output.json")
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2))
  console.log(`\nOutput written to ${outPath}`)
}

main().catch(err => {
  console.error("Fatal:", err)
  process.exit(1)
})
