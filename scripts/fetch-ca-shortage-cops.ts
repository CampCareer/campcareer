/**
 * ESDC Canadian Occupational Projection System (COPS) 데이터 다운로드
 *
 * COPS는 open.canada.ca 에서 CSV로 제공:
 *   - "Projections of employment in Canada by occupation"
 *   - NOC 2021 4-digit unit group 단위 outlook (Shortage/Balanced/Surplus)
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

// COPS Dataset ID on open.canada.ca
// Latest: "Canadian Occupational Projection System (COPS)
//          - Projections of employment in Canada by occupation"
const COPS_CKAN_ID = "auto-generated-or-manual-entries"
const COPS_DATASET_URL =
  "https://open.canada.ca/data/en/dataset/auto-generated-or-manual-entries"

// Try multiple known dataset IDs
const COPS_IDS = [
  "006a4e29-8d5f-4cfa-82ed-9ebdae126ba6", // ESDC COPS projections dataset
  "ece3ab1b-80c0-4e0b-8543-ae7a0e30efad", // Alternative ID
]

interface COPSRow {
  noc: string
  outlook: "Shortage" | "Balanced" | "Surplus" | "Moderate Shortage" | "Moderate Surplus"
  region: string
  year: string
}

function outlookToRating(outlook: string): number {
  switch (outlook.toLowerCase()) {
    case "shortage":
    case "severe shortage":
      return 5
    case "moderate shortage":
    case "moderate shortage expected":
      return 4
    case "balanced":
    case "expected balance":
      return 3
    case "moderate surplus":
    case "moderate surplus expected":
      return 2
    case "surplus":
    case "significant surplus":
      return 1
    default:
      return 3
  }
}

async function tryFetchCKAN(datasetId: string): Promise<COPSRow[] | null> {
  try {
    // CKAN API: search the dataset
    const res = await fetch(
      `https://open.canada.ca/data/api/3/action/package_show?id=${datasetId}`,
      { signal: AbortSignal.timeout(10000) },
    )
    if (!res.ok) return null
    const body = await res.json()
    if (!body?.result?.resources) return null

    // Find the CSV resource with national-level outlook data
    const resources = body.result.resources as Array<{
      url: string
      format: string
      name: string
    }>

    const csvResource = resources.find(
      (r) =>
        r.format === "CSV" &&
        (r.name.toLowerCase().includes("outlook") ||
          r.name.toLowerCase().includes("projection")),
    )

    if (!csvResource) return null

    // Download and parse the CSV
    const csvRes = await fetch(csvResource.url, {
      signal: AbortSignal.timeout(30000),
    })
    const csvText = await csvRes.text()

    // Parse CSV - COPS format varies by year
    const lines = csvText.split("\n").filter(Boolean)
    if (lines.length < 2) return null

    const header = lines[0].toLowerCase()
    const nocIdx = header.includes("noc") ? lines[0].split(",").findIndex((c) => c.toLowerCase().includes("noc")) : -1
    const outlookIdx = header.includes("outlook")
      ? lines[0].split(",").findIndex((c) => c.toLowerCase().includes("outlook"))
      : -1

    if (nocIdx < 0 || outlookIdx < 0) return null

    const rows: COPSRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",")
      const noc = cols[nocIdx]?.trim().replace(/"/g, "")
      const outlook = cols[outlookIdx]?.trim().replace(/"/g, "")
      if (noc && noc.length >= 4 && outlook) {
        rows.push({
          noc: noc.padEnd(5, "0"),
          outlook: outlook as COPSRow["outlook"],
          region: "CA",
          year: "2024",
        })
      }
    }
    return rows
  } catch {
    return null
  }
}

async function main() {
  console.log("Attempting to fetch COPS data from open.canada.ca...")
  let copsRows: COPSRow[] | null = null

  for (const id of COPS_IDS) {
    console.log(`  trying dataset ${id}...`)
    copsRows = await tryFetchCKAN(id)
    if (copsRows && copsRows.length > 0) {
      console.log(`  found ${copsRows.length} rows from dataset ${id}`)
      break
    }
  }

  if (!copsRows || copsRows.length === 0) {
    console.log(`
Failed to fetch COPS data. This could be because:
1. Network access to open.canada.ca is unavailable
2. The dataset ID has changed

To find the correct dataset:
1. Go to https://open.canada.ca/data/en/dataset
2. Search for "Canadian Occupational Projection System"
3. Look for the dataset with occupation-level outlook data
4. Update the COPS_IDS array in this script with the correct CKAN ID

Falling back to existing heuristic data in src/data/ca-shortage-ratings.json
    `)
    return
  }

  // Map COPS outlook back to our 514 NOC codes
  const wages: Array<{ noc_code: string }> = JSON.parse(
    fs.readFileSync(WAGES_PATH, "utf-8"),
  )
  const copsMap = new Map<string, number>()
  for (const row of copsRows) {
    copsMap.set(row.noc, outlookToRating(row.outlook))
  }

  const results: Array<{
    noc_code: string
    shortage_rating: number
    confidence: string
    rationale: string
  }> = []

  let matched = 0
  for (const w of wages) {
    let rating = copsMap.get(w.noc_code)
    if (rating != null) {
      matched++
    } else {
      rating = 3 // default if not in COPS data
    }
    results.push({
      noc_code: w.noc_code,
      shortage_rating: rating,
      confidence: rating != null ? "high" : "low",
      rationale:
        rating != null
          ? "Canadian Occupational Projection System (COPS)"
          : "No COPS data, defaulted to balanced",
    })
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
  console.log(`Wrote ${results.length} shortage ratings (${matched} from COPS data)`)

  const byRating: Record<number, number> = {}
  for (const r of results) {
    byRating[r.shortage_rating] = (byRating[r.shortage_rating] ?? 0) + 1
  }
  for (let i = 1; i <= 5; i++) {
    console.log(`  rating ${i}: ${byRating[i] ?? 0} occupations`)
  }
}

main().catch(console.error)
