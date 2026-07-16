/**
 * Imports the official JSA Data on Occupation Mobility (DOM) workbooks
 * supplied by the team. DOM is published against ANZSCO v1.3, so it is kept
 * separate from OSCA and joined in the product through occupations_au.anzsco_v13.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/import-au-jsa-mobility.ts
 */
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import XLSX from "xlsx"

const downloads = "/Users/yehunlee/Downloads"
const files = {
  flows: path.join(downloads, "occupation_flows.xlsx"),
  stocks: path.join(downloads, "occupation_stock_flows.xlsx"),
}

const sourceUrl = "https://www.jobsandskills.gov.au/publications/data-occupation-mobility-unpacking-workers-movements"
const sourceName = "Jobs and Skills Australia Data on Occupation Mobility"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

type SheetRow = Record<string, unknown>

function rows(file: string, sheet: string): SheetRow[] {
  const workbook = XLSX.readFile(file, { cellDates: false })
  const worksheet = workbook.Sheets[sheet]
  if (!worksheet) throw new Error(`Missing worksheet ${sheet} in ${path.basename(file)}`)
  return XLSX.utils.sheet_to_json<SheetRow>(worksheet, { defval: null })
}

function sixDigitCode(value: unknown): string | null {
  const valueAsText = String(value ?? "").trim()
  return /^\d{6}$/.test(valueAsText) ? valueAsText : null
}

function financialYear(value: unknown): string | null {
  const valueAsText = String(value ?? "").trim()
  return /^\d{4}_\d{4}$/.test(valueAsText) ? valueAsText : null
}

function integer(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value)
  const valueAsText = String(value ?? "").trim().replace(/,/g, "")
  if (!valueAsText) return null
  const result = Number(valueAsText)
  return Number.isFinite(result) ? Math.round(result) : null
}

function text(value: unknown): string | null {
  const valueAsText = String(value ?? "").trim()
  return valueAsText && valueAsText.toLowerCase() !== "null" ? valueAsText : null
}

async function upsertInBatches(table: string, data: Record<string, unknown>[], onConflict: string, batchSize = 1_000) {
  for (let start = 0; start < data.length; start += batchSize) {
    const batch = data.slice(start, start + batchSize)
    const { error } = await supabase.from(table).upsert(batch, { onConflict })
    if (error) throw new Error(`${table} batch ${start}: ${error.message}`)
    if (start === 0 || (start + batch.length) % 20_000 === 0 || start + batch.length === data.length) {
      console.log(`[mobility] ${table}: ${Math.min(start + batch.length, data.length)}/${data.length}`)
    }
  }
}

function flowRows() {
  const rejected = { unknownCode: 0, selfTransition: 0, suppressed: 0 }
  const data = rows(files.flows, "Occupation Flows").flatMap((row) => {
    const financial_year = financialYear(row["Financial year"])
    const previous_anzsco_v13 = sixDigitCode(row["Previous year occupation"])
    const recent_anzsco_v13 = sixDigitCode(row["Recent year occupation"])
    const worker_count = integer(row.Count)
    if (!financial_year || !previous_anzsco_v13 || !recent_anzsco_v13) {
      rejected.unknownCode += 1
      return []
    }
    if (previous_anzsco_v13 === recent_anzsco_v13) {
      rejected.selfTransition += 1
      return []
    }
    if (worker_count == null || worker_count < 10) {
      rejected.suppressed += 1
      return []
    }
    return [{
      financial_year,
      previous_anzsco_v13,
      recent_anzsco_v13,
      worker_count,
      previous_occupation_title: text(row["Previous year occupation title"]),
      recent_occupation_title: text(row["Recent year occupation title"]),
      source_name: sourceName,
      source_url: sourceUrl,
    }]
  })
  console.log(`[mobility] flows retained ${data.length}; excluded self transitions ${rejected.selfTransition}, unavailable/non-6-digit classifications ${rejected.unknownCode}, suppressed ${rejected.suppressed}`)
  return data
}

function stockRows() {
  const rejected = { unknownCode: 0, invalidStock: 0 }
  const data = rows(files.stocks, "Occupation stock flows").flatMap((row) => {
    const financial_year = financialYear(row["Financial year"])
    const anzsco_v13 = sixDigitCode(row.Occupation)
    const worker_stock = integer(row.Stock)
    if (!financial_year || !anzsco_v13) {
      rejected.unknownCode += 1
      return []
    }
    if (worker_stock == null || worker_stock < 0) {
      rejected.invalidStock += 1
      return []
    }
    return [{
      financial_year,
      anzsco_v13,
      worker_stock,
      previous_financial_year_stock: integer(row["Previous financial year stock"]),
      stock_delta: integer(row["Stock delta from previous financial year"]),
      inflow: integer(row["In flow from previous financial year"]),
      outflow: integer(row["Out flow from previous financial year"]),
      epsilon: integer(row.Epsilon),
      occupation_title: text(row["Occupation title"]),
      source_name: sourceName,
      source_url: sourceUrl,
    }]
  })
  console.log(`[mobility] stocks retained ${data.length}; excluded non-6-digit classifications ${rejected.unknownCode}, invalid stocks ${rejected.invalidStock}`)
  return data
}

async function main() {
  const flows = flowRows()
  const stocks = stockRows()
  await upsertInBatches("occupation_mobility_flows_au", flows, "financial_year,previous_anzsco_v13,recent_anzsco_v13")
  await upsertInBatches("occupation_mobility_stocks_au", stocks, "financial_year,anzsco_v13")
  console.log("[mobility] import complete")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
