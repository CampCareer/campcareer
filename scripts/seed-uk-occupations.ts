/**
 * UK SOC 2020 occupation seed script.
 *
 * Downloads ONS ASHE data and outputs JSON + optionally inserts to Supabase.
 *
 * Usage (JSON only — all data in src/data/):
 *   npx tsx scripts/seed-uk-occupations.ts
 *
 * Usage (JSON + Supabase — requires SUPABASE_SERVICE_ROLE_KEY):
 *   npx tsx scripts/seed-uk-occupations.ts --supabase
 *
 * Before Supabase insertion, run these migrations in Supabase Studio SQL Editor:
 *   1. supabase/migrations/20260705000000_occupations_uk.sql
 *   2. supabase/migrations/20260705000001_occupation_state_uk.sql
 */

import AdmZip from "adm-zip"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import https from "https"
import http from "http"
import XLSX from "xlsx"

dotenv.config({ path: path.resolve(".env.local") })

const SHOULD_UPSERT = process.argv.includes("--supabase")

// ── ONS ASHE download URLs ─────────────────────────────────────────────────────

const ASHE14_URL =
  "https://www.ons.gov.uk/file?uri=/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/occupation4digitsoc2010ashetable14/2025provisional/ashetable142025provisional.zip"

const ASHE15_URL =
  "https://www.ons.gov.uk/file?uri=/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/regionbyoccupation4digitsoc2010ashetable15/2025provisional/ashetable152025provisional.zip"

// ── ITL1 region mapping (ONS name → ITL1 code) ────────────────────────────────

const REGION_MAP: Record<string, string> = {
  "North East": "TLC",
  "North West": "TLD",
  "Yorkshire and The Humber": "TLE",
  "East Midlands": "TLF",
  "West Midlands": "TLG",
  East: "TLH",
  London: "TLI",
  "South East": "TLJ",
  "South West": "TLK",
  Wales: "TLL",
  Scotland: "TLM",
}

// ── Home Office Immigration Salary List (ISL) SOC codes ────────────────────────

const ISL_SOC_CODES = new Set([
  "1212", "2111", "2112", "2115", "3111", "3112", "3113", "3114", "3115", "3116",
  "3120", "3131", "3132", "3133", "3212", "3411", "3412", "3414", "3415", "3416",
  "5234", "5235", "5236", "5311", "5312", "5313", "5314", "5315", "5316", "5317",
  "5319", "6129", "6131", "6135", "6136",
])

const TSL_SOC_CODES = new Set([
  "1243", "1258",
  "2111", "2112", "2113", "2114", "2115", "2116", "2117", "2118", "2119",
  "2121", "2122", "2123", "2124", "2127", "2129", "2133", "2134", "2135", "2136",
  "2137", "2139", "2141", "2142", "2150", "2161", "2162",
  "2211", "2212", "2213", "2214", "2215", "2216", "2217", "2218", "2219",
  "2311", "2312", "2313", "2314", "2315", "2316", "2317", "2318", "2319",
  "2411", "2412", "2413", "2414", "2415", "2416", "2417", "2419",
  "2421", "2422", "2423", "2424", "2425", "2426", "2429",
  "2431", "2432", "2433", "2434", "2435", "2436", "2439", "2442", "2443", "2444",
  "2449", "2451", "2452", "2453", "2454", "2455", "2456", "2457", "2459",
  "2461", "2462", "2463", "2469", "2471", "2472", "2473", "2481", "2482", "2483",
  "2484", "2491", "2492", "2493", "2494",
  "3111", "3112", "3113", "3114", "3115", "3116", "3120", "3131", "3132", "3133",
  "3412", "4122", "4129",
])

// ── HTTP download ──────────────────────────────────────────────────────────────

function downloadBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        if (!loc) return reject(new Error(`Redirect without Location header from ${url}`))
        return resolve(downloadBuffer(loc))
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      const chunks: Buffer[] = []
      res.on("data", (c: Buffer) => chunks.push(c))
      res.on("end", () => resolve(Buffer.concat(chunks)))
      res.on("error", reject)
    })
    req.on("error", reject)
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function is4Digit(code: unknown): code is string {
  return typeof code === "string" && /^\d{4}$/.test(code.trim())
}

function cleanMedian(val: unknown): number | null {
  if (val == null) return null
  if (typeof val === "number") return Math.round(val)
  const s = String(val).replace(/[£,\s]/g, "")
  if (/^(c|-|n\/a|x|\*|\.+|\.\.|:)$/i.test(s)) return null
  const n = parseFloat(s)
  return isNaN(n) ? null : Math.round(n)
}

// ── Parse national ASHE Table 14 ──────────────────────────────────────────────

interface NatOcc {
  soc_code: string
  occupation_en: string
  median_salary_gbp: number | null
}

function parseTable14(wb: XLSX.WorkBook): NatOcc[] {
  const ws = wb.Sheets["All"]
  if (!ws) throw new Error("Table 14: 'All' sheet not found")
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
  const results: NatOcc[] = []

  for (let i = 5; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length < 4) continue
    const code = String(row[1] ?? "").trim()
    const desc = String(row[0] ?? "").trim()
    const median = cleanMedian(row[3])

    if (is4Digit(code) && desc) {
      results.push({ soc_code: code, occupation_en: desc, median_salary_gbp: median })
    }
  }
  return results
}

// ── Parse regional ASHE Table 15(4) ───────────────────────────────────────────

interface RegOcc {
  soc_code: string
  region: string
  median_salary_gbp: number | null
}

function parseTable15(wb: XLSX.WorkBook): RegOcc[] {
  const ws = wb.Sheets["All"]
  if (!ws) throw new Error("Table 15: 'All' sheet not found")
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })
  const results: RegOcc[] = []

  for (let i = 5; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length < 4) continue

    const desc = String(row[0] ?? "").trim()
    const code = String(row[1] ?? "").trim()
    const median = cleanMedian(row[3])

    if (!is4Digit(code)) continue

    const commaIdx = desc.indexOf(",")
    if (commaIdx === -1) continue
    const regionName = desc.slice(0, commaIdx).trim()
    const itl1Code = REGION_MAP[regionName]
    if (!itl1Code) continue

    results.push({ soc_code: code, region: itl1Code, median_salary_gbp: median })
  }
  return results
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  // ── Download & parse ASHE Table 14 ──────────────────────────────────────────

  console.log("Step 1: ONS ASHE Table 14 (national)...")
  const buf14 = await downloadBuffer(ASHE14_URL)
  console.log(`  Downloaded ${(buf14.length / 1024 / 1024).toFixed(1)} MB`)
  const zip14 = new AdmZip(buf14)
  const xlsx14Entry = zip14.getEntries().find(
    (e) => e.entryName.endsWith(".xlsx") && e.entryName.includes("14.7a"),
  )
  if (!xlsx14Entry) throw new Error("Table 14: annual pay xlsx not found in ZIP")
  const wb14 = XLSX.read(xlsx14Entry.getData())
  const natOccs = parseTable14(wb14)
  console.log(`  Parsed ${natOccs.length} 4-digit SOC occupations`)

  // ── Download & parse ASHE Table 15 ──────────────────────────────────────────

  console.log("\nStep 2: ONS ASHE Table 15 (region × occupation)...")
  const buf15 = await downloadBuffer(ASHE15_URL)
  console.log(`  Downloaded ${(buf15.length / 1024 / 1024).toFixed(1)} MB`)
  const zip15 = new AdmZip(buf15)
  const xlsx15Entry = zip15.getEntries().find(
    (e) => e.entryName.endsWith(".xlsx") && e.entryName.includes("15 (4).7a"),
  )
  if (!xlsx15Entry) throw new Error("Table 15: annual pay xlsx not found in ZIP")
  const wb15 = XLSX.read(xlsx15Entry.getData())
  const regOccs = parseTable15(wb15)
  console.log(`  Parsed ${regOccs.length} region-occupation rows`)

  // ── Build output data ──────────────────────────────────────────────────────

  const salaried = natOccs.filter((r) => r.median_salary_gbp != null)
  const onISL = natOccs.filter((r) => ISL_SOC_CODES.has(r.soc_code))
  const onTSL = natOccs.filter((r) => TSL_SOC_CODES.has(r.soc_code))
  const both = natOccs.filter((r) => ISL_SOC_CODES.has(r.soc_code) && TSL_SOC_CODES.has(r.soc_code))

  const max = salaried.length > 0
    ? salaried.reduce((a, b) => (a.median_salary_gbp! > b.median_salary_gbp! ? a : b))
    : null

  console.log(`\n  Occupations with salary: ${salaried.length}/${natOccs.length}`)
  console.log(`  Region-occupation rows: ${regOccs.length}`)
  console.log(`  ISL: ${onISL.length}, TSL: ${onTSL.length}, Both: ${both.length}`)
  if (max) console.log(`  Highest-paid: ${max.occupation_en} (£${max.median_salary_gbp!.toLocaleString()})`)

  // ── Write JSON data files for map-data.ts fallback ────────────────────────

  const DATA_DIR = path.resolve("src/data")

  const occupationsJson: Record<string, {
    soc_code: string
    occupation_en: string
    median_salary_gbp: number | null
    on_sol: boolean
    on_isl: boolean
    source_name: string
  }> = {}
  for (const o of natOccs) {
    occupationsJson[o.soc_code] = {
      soc_code: o.soc_code,
      occupation_en: o.occupation_en,
      median_salary_gbp: o.median_salary_gbp,
      on_sol: TSL_SOC_CODES.has(o.soc_code) || ISL_SOC_CODES.has(o.soc_code),
      on_isl: ISL_SOC_CODES.has(o.soc_code),
      source_name: "ONS ASHE 2025 provisional",
    }
  }

  const regionOccJson: Record<string, Array<{
    soc_code: string
    median_salary_gbp: number | null
  }>> = {}
  for (const r of regOccs) {
    const arr = regionOccJson[r.region] ?? []
    arr.push({ soc_code: r.soc_code, median_salary_gbp: r.median_salary_gbp })
    regionOccJson[r.region] = arr
  }

  const OCC_PATH = path.join(DATA_DIR, "uk-occupations.json")
  const REG_PATH = path.join(DATA_DIR, "uk-region-occupations.json")

  fs.writeFileSync(OCC_PATH, JSON.stringify(occupationsJson, null, 2))
  fs.writeFileSync(REG_PATH, JSON.stringify(regionOccJson, null, 2))

  console.log(`\n✓ Wrote ${OCC_PATH}`)
  console.log(`✓ Wrote ${REG_PATH}`)

  // ── Supabase upsert (optional) ──────────────────────────────────────────────

  if (!SHOULD_UPSERT) {
    console.log("\nTo also insert into Supabase, run with --supabase flag:")
    console.log("  npx tsx scripts/seed-uk-occupations.ts --supabase")
    console.log("\n(First run the migrations in Supabase Studio SQL Editor)")
    return
  }

  console.log("\nStep 3: Upserting to Supabase...")
  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const BATCH = 20
  let ok = 0
  let fail = 0

  const occRows = natOccs.map((r) => ({
    soc_code: r.soc_code,
    occupation_en: r.occupation_en,
    median_salary_gbp: r.median_salary_gbp,
    on_sol: TSL_SOC_CODES.has(r.soc_code) || ISL_SOC_CODES.has(r.soc_code),
    on_isl: ISL_SOC_CODES.has(r.soc_code),
    source_name: "ONS ASHE 2025 provisional · Home Office ISL/TSL 2025",
    source_url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2025",
    last_verified: new Date().toISOString(),
  }))

  for (let i = 0; i < occRows.length; i += BATCH) {
    const { error } = await supabase
      .from("occupations_uk")
      .upsert(occRows.slice(i, i + BATCH), { onConflict: "soc_code" })
    if (error) { console.error(`  occ batch ${i / BATCH}: ${error.message}`); fail += BATCH }
    else ok += BATCH
  }
  console.log(`  occupations_uk: ${ok} upserted, ${fail} failed`)

  ok = 0; fail = 0
  const regRows = regOccs.map((r) => ({
    soc_code: r.soc_code,
    region: r.region,
    median_salary_gbp: r.median_salary_gbp,
    data_source: "ONS ASHE 2025 provisional (Table 15)",
  }))

  for (let i = 0; i < regRows.length; i += BATCH) {
    const { error } = await supabase
      .from("occupation_state_uk")
      .upsert(regRows.slice(i, i + BATCH), { onConflict: "soc_code,region" })
    if (error) { console.error(`  reg batch ${i / BATCH}: ${error.message}`); fail += BATCH }
    else ok += BATCH
  }
  console.log(`  occupation_state_uk: ${ok} upserted, ${fail} failed`)

  console.log("\n=== Done ===")
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
