/**
 * ESDC COPS (Canadian Occupational Projection System) 데이터 다운로드
 *
 * COPS 는 open.canada.ca 에서 CSV로 제공:
 *   - Assessment of Projected Labour Market Conditions (shortage, surplus or balance), 2024-2033
 *   - Summary of the Components (Job Openings and Job Seekers), 2024-2033
 *
 * 사용법: npx tsx scripts/fetch-ca-shortage-cops.ts
 *
 * 성공 시: src/data/ca-shortage-ratings.json 을 COPS 기준으로 갱신
 * 실패 시: 기존 heuristic 데이터 유지
 */

import fs from "fs"
import path from "path"

const OUTPUT_PATH = path.resolve("src/data/ca-shortage-ratings.json")
const WAGES_PATH = path.resolve("src/data/ca-occupation-wages.json")

// COPS dataset — 2024–2033 projections (NOC 2021)
const DATASET_ID = "e80851b8-de68-43bd-a85c-c72e1b3a3890"

// Known direct-download URLs for the CSVs we need
const CSVS = {
  // "Assessment of Projected Labour Market Conditions (shortage, surplus or balance), 2024-2033"
  flmc: "https://open.canada.ca/data/dataset/e80851b8-de68-43bd-a85c-c72e1b3a3890/resource/446fe474-96e7-47cd-a3f9-3bb391b2df60/download/flmc_cfmt_2024_2033_noc2021.csv",
  // "Summary of the Components (Job Openings and Job Seekers), 2024-2033"
  summary: "https://open.canada.ca/data/dataset/e80851b8-de68-43bd-a85c-c72e1b3a3890/resource/7c4767a5-f807-441d-9776-a0074b5870a0/download/summary_sommaire_2024_2033_noc2021.csv",
}

interface FLMCRow {
  code: string
  futureCondition: string | null
}

interface SummaryRow {
  code: string
  employment2023: number | null
  employmentGrowth: number | null
  retirements: number | null
  totalJobOpenings: number | null
  jobSeekers: number | null
  recentCondition: string | null
  futureCondition: string | null
}

function parseCSV(text: string): string[][] {
  const lines = text.split("\n").filter(Boolean)
  return lines.map((l) => {
    const cols: string[] = []
    let current = ""
    let inQuotes = false
    for (const ch of l) {
      if (ch === '"') {
        inQuotes = !inQuotes
      } else if (ch === "," && !inQuotes) {
        cols.push(current.trim())
        current = ""
      } else {
        current += ch
      }
    }
    cols.push(current.trim())
    return cols
  })
}

async function downloadCSV(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.text()
}

function mapOutlookToRating(outlook: string | null): number | null {
  if (!outlook) return null
  const o = outlook.toLowerCase().trim()
  // Shortage
  if (o.includes("shortage") || o.includes("pénurie") || o.includes("pénurie")) {
    if (o.includes("strong") || o.includes("important")) return 5
    if (o.includes("moderate") || o.includes("modéré")) return 4
    return 4
  }
  // Surplus
  if (o.includes("surplus")) {
    if (o.includes("strong") || o.includes("important")) return 1
    if (o.includes("moderate") || o.includes("modéré")) return 2
    return 2
  }
  // Balance
  if (o.includes("balance") || o.includes("équilibre")) return 3
  return null
}

function parseNumeric(val: string | null): number | null {
  if (!val) return null
  const cleaned = val.replace(/[",\s]/g, "")
  const n = Number(cleaned)
  return isNaN(n) ? null : n
}

async function main() {
  console.log("Downloading COPS data from open.canada.ca...")

  let flmcRows: FLMCRow[] = []
  let summaryRows: SummaryRow[] = []

  // ── 1. Future Labour Market Conditions CSV ──────────────────────────────
  try {
    console.log(`  fetching FLMC...`)
    const flmcText = await downloadCSV(CSVS.flmc)
    const flmcParsed = parseCSV(flmcText)
    const flmcHeader = flmcParsed[0]
    const codeIdx = flmcHeader.findIndex((c) => c.toLowerCase().includes("code"))
    const conditionIdx = flmcHeader.findIndex((c) =>
      c.toLowerCase().includes("future") && c.toLowerCase().includes("condition")
    )
    if (codeIdx >= 0 && conditionIdx >= 0) {
      for (let i = 1; i < flmcParsed.length; i++) {
        const code = flmcParsed[i][codeIdx]?.trim()
        if (!code || code.length < 4) continue
        flmcRows.push({
          code: code.padEnd(5, "0"),
          futureCondition: mapOutlookToRating(flmcParsed[i][conditionIdx]) != null
            ? flmcParsed[i][conditionIdx]
            : null,
        })
      }
      console.log(`    → ${flmcRows.length} rows (code only)`)
    }
  } catch (err) {
    console.error(`  FLMC download failed:`, (err as Error).message)
  }

  // ── 2. Summary CSV (has job openings, job seekers, and both recent/future conditions) ─
  try {
    console.log(`  fetching Summary...`)
    const summaryText = await downloadCSV(CSVS.summary)
    const summaryParsed = parseCSV(summaryText)
    const summaryHeader = summaryParsed[0]

    const sCodeIdx = summaryHeader.findIndex((c) => c.toLowerCase().includes("code"))
    const sEmpIdx = summaryHeader.findIndex((c) =>
      c.toLowerCase().includes("employment") && c.toLowerCase().includes("2023")
    )
    const sGrowthIdx = summaryHeader.findIndex((c) =>
      c.toLowerCase().includes("growth")
    )
    const sRetireIdx = summaryHeader.findIndex((c) => c.toLowerCase().includes("retire"))
    const sOpeningsIdx = summaryHeader.findIndex((c) =>
      c.toLowerCase().includes("total") && c.toLowerCase().includes("openings")
    )
    const sSeekersIdx = summaryHeader.findIndex((c) =>
      c.toLowerCase().includes("seekers")
    )
    const sRecentIdx = summaryHeader.findIndex((c) =>
      c.toLowerCase().includes("recent") && c.toLowerCase().includes("condition")
    )
    const sFutureIdx = summaryHeader.findIndex((c) =>
      c.toLowerCase().includes("future") && c.toLowerCase().includes("condition")
    )

    if (sCodeIdx >= 0) {
      for (let i = 1; i < summaryParsed.length; i++) {
        const code = summaryParsed[i][sCodeIdx]?.trim()
        if (!code || code.length < 4) continue
        summaryRows.push({
          code: code.padEnd(5, "0"),
          employment2023: parseNumeric(summaryParsed[i][sEmpIdx]),
          employmentGrowth: parseNumeric(summaryParsed[i][sGrowthIdx]),
          retirements: parseNumeric(summaryParsed[i][sRetireIdx]),
          totalJobOpenings: parseNumeric(summaryParsed[i][sOpeningsIdx]),
          jobSeekers: parseNumeric(summaryParsed[i][sSeekersIdx]),
          recentCondition: sRecentIdx >= 0 ? summaryParsed[i][sRecentIdx] : null,
          futureCondition: sFutureIdx >= 0 ? summaryParsed[i][sFutureIdx] : null,
        })
      }
      console.log(`    → ${summaryRows.length} rows (full data)`)
    }
  } catch (err) {
    console.error(`  Summary download failed:`, (err as Error).message)
  }

  if (summaryRows.length === 0 && flmcRows.length === 0) {
    console.log(`
Failed to fetch COPS data. This could be because:
1. Network access to open.canada.ca is unavailable
2. The dataset ID or resource URLs have changed
3. open.canada.ca is temporarily down

Falling back to existing heuristic data.
    `)
    return
  }

  // Build a lookup from summary (preferred) + FLMC fallback
  const futureByCode = new Map<string, { futureCondition: string | null; recentCondition: string | null; jobOpenings: number | null; jobSeekers: number | null; employmentGrowth: number | null }>()
  for (const r of summaryRows) {
    futureByCode.set(r.code, {
      futureCondition: r.futureCondition || null,
      recentCondition: r.recentCondition || null,
      jobOpenings: r.totalJobOpenings,
      jobSeekers: r.jobSeekers,
      employmentGrowth: r.employmentGrowth,
    })
  }

  // Read wages to get the full list of 514 NOC codes
  const wages: Array<{ noc_code: string }> = JSON.parse(
    fs.readFileSync(WAGES_PATH, "utf-8"),
  )

  interface ShortageEntry {
    noc_code: string
    shortage_rating: number
    confidence: "high" | "medium" | "low"
    rationale: string
    cops_future_outlook: string | null
    cops_recent_outlook: string | null
    projected_job_openings: number | null
    projected_job_seekers: number | null
    employment_growth: number | null
  }

  const results: ShortageEntry[] = []

  let matchedFuture = 0
  let matchedRecent = 0

  for (const w of wages) {
    const cops = futureByCode.get(w.noc_code)
    const futureOutlook = cops?.futureCondition ?? null
    const recentOutlook = cops?.recentCondition ?? null

    if (futureOutlook) matchedFuture++
    if (recentOutlook) matchedRecent++

    // Derive rating from COPS future outlook
    let rating = mapOutlookToRating(futureOutlook)
    let rationale = ""
    let confidence: "high" | "medium" | "low" = "low"

    if (rating != null) {
      rationale = `COPS 2024-2033: ${futureOutlook}`
      confidence = "high"
    } else if (recentOutlook) {
      rating = mapOutlookToRating(recentOutlook)
      if (rating != null) {
        rationale = `COPS 2021-2023 (recent): ${recentOutlook}`
        confidence = "medium"
      }
    }

    // Fallback to heuristic if no COPS data
    if (rating == null) {
      const cat = w.noc_code[0]
      const baseRatings: Record<string, number> = {
        "0": 3, "1": 2, "2": 3, "3": 4, "4": 2,
        "5": 1, "6": 1, "7": 3, "8": 2, "9": 2,
      }
      rating = baseRatings[cat] ?? 2
      rationale = `No COPS data, category ${cat} base`
      confidence = "low"
    }

    results.push({
      noc_code: w.noc_code,
      shortage_rating: Math.max(1, Math.min(5, Math.round(rating))),
      confidence,
      rationale,
      cops_future_outlook: futureOutlook,
      cops_recent_outlook: recentOutlook,
      projected_job_openings: cops?.jobOpenings ?? null,
      projected_job_seekers: cops?.jobSeekers ?? null,
      employment_growth: cops?.employmentGrowth ?? null,
    })
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
  console.log(`\nWrote ${results.length} shortage ratings to ${OUTPUT_PATH}`)
  console.log(`  COPS future outlook matched: ${matchedFuture} / ${wages.length}`)
  console.log(`  COPS recent outlook matched: ${matchedRecent} / ${wages.length}`)
  console.log(`  COPS job openings data: ${results.filter((r) => r.projected_job_openings != null).length} / ${wages.length}`)

  const byRating: Record<number, number> = {}
  for (const r of results) {
    byRating[r.shortage_rating] = (byRating[r.shortage_rating] ?? 0) + 1
  }
  console.log(`\nUpdated shortage rating distribution:`)
  for (let i = 1; i <= 5; i++) {
    console.log(`  rating ${i}: ${byRating[i] ?? 0} occupations (${confidenceBreakdown(results, i)})`)
  }
}

function confidenceBreakdown(results: Array<{ shortage_rating: number; confidence: string }>, rating: number): string {
  const filtered = results.filter((r) => r.shortage_rating === rating)
  const high = filtered.filter((r) => r.confidence === "high").length
  const med = filtered.filter((r) => r.confidence === "medium").length
  return `high=${high}, med=${med}, low=${filtered.length - high - med}`
}

main().catch(console.error)
