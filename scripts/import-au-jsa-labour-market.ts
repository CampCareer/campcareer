/**
 * Imports the official JSA workbooks supplied by the team into the AU
 * occupation data tables. It deliberately keeps ANZSCO, OSCA and SA4 codes
 * separate: these datasets are complementary, not interchangeable.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/import-au-jsa-labour-market.ts
 */
import { createReadStream } from "node:fs"
import { createInterface } from "node:readline"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import XLSX from "xlsx"

const downloads = "/Users/yehunlee/Downloads"
const files = {
  profiles: path.join(downloads, "Occupation profiles data - February 2026.xlsx"),
  pathways: path.join(downloads, "training_occupation_pathways_version_1.0.xlsx"),
  shortageDrivers: path.join(downloads, "2025 OSD downloadable Tables and Figures.xlsx"),
  projections: path.join(downloads, "employment_projections_-_may_2025_to_may_2035.xlsx"),
  vacancies: path.join(downloads, "internet_vacancies_anzsco4_occupations_states_and_territories_-_may_2026.xlsx"),
  regional: path.join(downloads, "2026-06_nero", "2026-06_shiny_df.csv"),
}

const sources = {
  profiles: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupation-profiles",
  pathways: "https://www.jobsandskills.gov.au/data/skills-and-training/training-occupation-pathways",
  shortageDrivers: "https://www.jobsandskills.gov.au/data/skills-shortages-and-labour-market-analysis/occupation-shortage-analysis",
  projections: "https://www.jobsandskills.gov.au/data/employment-projections",
  vacancies: "https://www.jobsandskills.gov.au/data/internet-vacancy-index",
  regional: "https://www.jobsandskills.gov.au/data/skills-shortages-and-labour-market-analysis/nero",
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

type SheetRow = (string | number | boolean | null | undefined)[]
type JsonItem = { name: string; share?: number }

function getRows(file: string, sheet: string): SheetRow[] {
  const workbook = XLSX.readFile(file, { cellDates: false })
  const worksheet = workbook.Sheets[sheet]
  if (!worksheet) throw new Error(`Missing worksheet ${sheet} in ${path.basename(file)}`)
  return XLSX.utils.sheet_to_json<SheetRow>(worksheet, { header: 1, defval: null })
}

function code(value: unknown, expectedLength?: number): string | null {
  const text = String(value ?? "").trim()
  if (!/^[0-9]+$/.test(text)) return null
  if (expectedLength && text.length !== expectedLength) return null
  return text.length === 4 || text.length === 6 ? text : null
}

function numberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const text = String(value ?? "").trim().replace(/,/g, "")
  if (!text || text === "N/A" || text === "..") return null
  const result = Number(text)
  return Number.isFinite(result) ? result : null
}

function percentageOrNull(value: unknown): number | null {
  const result = numberOrNull(value)
  return result == null ? null : Number((result * 100).toFixed(2))
}

function cleanText(value: unknown): string | null {
  const text = String(value ?? "").trim()
  return text ? text : null
}

function normaliseTitle(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

async function upsertInBatches(table: string, rows: Record<string, unknown>[], onConflict: string, batchSize = 500) {
  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = rows.slice(start, start + batchSize)
    const { error } = await supabase.from(table).upsert(batch, { onConflict })
    if (error) throw new Error(`${table} batch ${start}: ${error.message}`)
    if (start > 0 && start % 5_000 === 0) console.log(`[jsa] ${table}: ${start}/${rows.length}`)
  }
  console.log(`[jsa] ${table}: upserted ${rows.length}`)
}

function profileRows() {
  const overview = getRows(files.profiles, "Table_1").slice(6)
  const hours = getRows(files.profiles, "Table_4").slice(6)
  const industries = getRows(files.profiles, "Table_5").slice(6)
  const states = getRows(files.profiles, "Table_6").slice(6)
  const education = getRows(files.profiles, "Table_8").slice(6)
  const overviewByCode = new Map<string, SheetRow>()
  const hoursByCode = new Map<string, SheetRow>()
  const industriesByCode = new Map<string, JsonItem[]>()
  const statesByCode = new Map<string, JsonItem[]>()
  const educationByCode = new Map<string, JsonItem[]>()

  for (const row of overview) {
    const key = code(row[0])
    if (key) overviewByCode.set(key, row)
  }
  for (const row of hours) {
    const key = code(row[0])
    if (key) hoursByCode.set(key, row)
  }
  for (const row of industries) {
    const key = code(row[0])
    const name = cleanText(row[2])
    if (key && name) industriesByCode.set(key, [...(industriesByCode.get(key) ?? []), { name }])
  }
  const stateNames = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]
  for (const row of states) {
    const key = code(row[0])
    if (!key) continue
    statesByCode.set(key, stateNames.flatMap((name, index) => {
      const share = numberOrNull(row[index + 2])
      return share == null ? [] : [{ name, share }]
    }))
  }
  const educationNames = ["Postgraduate", "Bachelor degree", "Advanced diploma / diploma", "Certificate III / IV", "Year 12", "Year 11", "Year 10 and below"]
  for (const row of education) {
    const key = code(row[0])
    if (!key) continue
    educationByCode.set(key, educationNames.flatMap((name, index) => {
      const share = numberOrNull(row[index + 2])
      return share == null ? [] : [{ name, share }]
    }))
  }

  const rows = [...overviewByCode.entries()].map(([anzsco_v13, row]) => {
    const fullTime = hoursByCode.get(anzsco_v13)
    return {
      anzsco_v13,
      employment_total: numberOrNull(row[2]) == null ? null : Math.round(numberOrNull(row[2])!),
      part_time_share_pct: numberOrNull(row[3]),
      female_share_pct: numberOrNull(row[4]),
      median_age: numberOrNull(row[6]),
      full_time_share_pct: numberOrNull(fullTime?.[2]),
      average_full_time_hours: numberOrNull(fullTime?.[3]),
      median_weekly_earnings_aud: numberOrNull(fullTime?.[4]) == null ? null : Math.round(numberOrNull(fullTime?.[4])!),
      median_hourly_earnings_aud: numberOrNull(fullTime?.[5]),
      state_distribution: statesByCode.get(anzsco_v13) ?? [],
      education_distribution: educationByCode.get(anzsco_v13) ?? [],
      industries: industriesByCode.get(anzsco_v13) ?? [],
      data_as_at: "2026-02-01",
      source_url: sources.profiles,
    }
  })
  const titleToCode = new Map<string, string>()
  for (const [, row] of overviewByCode) {
    const occupationCode = code(row[0])
    if (occupationCode?.length === 4) titleToCode.set(normaliseTitle(row[1]), occupationCode)
  }
  return { rows, titleToCode }
}

function pathwayRows() {
  const rows = getRows(files.pathways, "Table_2").slice(7)
  const pathwayTypes: Record<string, string> = {
    "occupation ready": "occupation_ready",
    "specialised training": "specialised_training",
    "progression pathway": "progression_pathway",
    "pre-vocational": "pre_vocational",
  }
  const pathways = new Map<string, Record<string, unknown>>()
  for (const row of rows) {
    const osca_code = code(row[0], 6)
    const qualification_code = cleanText(row[2])
    const qualification_title = cleanText(row[3])
    if (!osca_code || osca_code.length !== 6 || !qualification_code || !qualification_title) continue
    const pathwayText = cleanText(row[4])?.toLowerCase() ?? ""
    const condition = cleanText(row[6])?.toLowerCase() ?? ""
    pathways.set(`${osca_code}|${qualification_code}`, {
      anzsco_v13: null,
      osca_code,
      qualification_code,
      qualification_title,
      pathway_type: pathwayTypes[pathwayText] ?? "transferable",
      licensing_required: /licen[cs]ing or registration (is )?required/.test(condition),
      licensing_may_be_required: /licen[cs]ing or registration may be required/.test(condition),
      restrictions: condition ? [condition] : [],
      data_as_at: "2026-03-01",
      source_url: sources.pathways,
    })
  }
  return [...pathways.values()]
}

function shortageDriverRows(titleToCode: Map<string, string>) {
  const rows = getRows(files.shortageDrivers, "Figure C1").slice(7)
  const labels: Record<string, string> = {
    "Long training gap": "long_training_gap",
    "Short training gap": "short_training_gap",
    "Suitability gap": "suitability_gap",
    "Retention gap": "retention_gap",
    "Uncertain": "uncertain",
  }
  const unmatched: string[] = []
  const result = rows.flatMap((row) => {
    const anzsco_unit_group = titleToCode.get(normaliseTitle(row[0]))
    const shortage_driver = labels[cleanText(row[3]) ?? ""]
    if (!anzsco_unit_group || !shortage_driver) {
      if (cleanText(row[0])) unmatched.push(String(row[0]))
      return []
    }
    return [{ anzsco_unit_group, shortage_driver, source_url: sources.shortageDrivers, data_year: 2025 }]
  })
  console.log(`[jsa] shortage drivers: matched ${result.length}; unmatched titles: ${unmatched.length}${unmatched.length ? ` (${unmatched.slice(0, 5).join("; ")})` : ""}`)
  return result
}

function projectionRows() {
  const rows = getRows(files.projections, "Table_6 Occupation Unit Group").slice(9)
  return rows.flatMap((row) => {
    const anzsco_unit_group = code(row[2], 4)
    if (!anzsco_unit_group || anzsco_unit_group.length !== 4 || String(row[0]).trim() !== "4" || String(row[1]).trim() !== "N") return []
    const baseline = numberOrNull(row[5])
    const to2030 = numberOrNull(row[6])
    const to2035 = numberOrNull(row[7])
    const change2030 = numberOrNull(row[8])
    const change2030Pct = percentageOrNull(row[9])
    const change2035 = numberOrNull(row[10])
    const change2035Pct = percentageOrNull(row[11])
    if (baseline == null) return []
    const toEmployment = (value: number | null) => value == null ? null : Math.round(value * 1000)
    return [
      {
        anzsco_unit_group,
        geography: "AU",
        period_start: "2025-05-01",
        period_end: "2030-05-01",
        employment_start: toEmployment(baseline),
        employment_end: toEmployment(to2030),
        employment_change: toEmployment(change2030),
        employment_change_pct: change2030Pct,
        source_url: sources.projections,
      },
      {
        anzsco_unit_group,
        geography: "AU",
        period_start: "2025-05-01",
        period_end: "2035-05-01",
        employment_start: toEmployment(baseline),
        employment_end: toEmployment(to2035),
        employment_change: toEmployment(change2035),
        employment_change_pct: change2035Pct,
        source_url: sources.projections,
      },
    ]
  })
}

function parseMonthHeader(value: unknown): string | null {
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value)
    if (!date) return null
    return `${date.y}-${String(date.m).padStart(2, "0")}-01`
  }
  const match = String(value ?? "").trim().match(/^([A-Z][a-z]{2})-(\d{2})$/)
  if (!match) return null
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[1]) + 1
  if (!month) return null
  const year = 2000 + Number(match[2])
  return `${year}-${String(month).padStart(2, "0")}-01`
}

function vacancyRows() {
  const rows = getRows(files.vacancies, "4 digit 3 month average")
  const header = rows[0]
  const periods = header.map(parseMonthHeader)
  return rows.slice(1).flatMap((row) => {
    const anzsco_unit_group = code(row[0], 4)
    const state = cleanText(row[2])
    if (!anzsco_unit_group || anzsco_unit_group.length !== 4 || !state) return []
    return periods.flatMap((period, index) => {
      const vacancy_count = numberOrNull(row[index])
      if (!period || period < "2024-06-01" || vacancy_count == null) return []
      return [{ anzsco_unit_group, state, period, series: "three_month_average", vacancy_count, index_value: null, source_url: sources.vacancies }]
    })
  })
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let value = ""
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1 } else quoted = !quoted
    } else if (character === "," && !quoted) { cells.push(value); value = "" } else value += character
  }
  cells.push(value)
  return cells
}

async function regionalRows() {
  const periods = new Set(["2021-06-15", "2025-06-15", "2026-06-15"])
  const snapshots = new Map<string, { state: string; sa4_code: string; sa4_name: string; anzsco_unit_group: string; values: Map<string, number> }>()
  const input = createInterface({ input: createReadStream(files.regional), crlfDelay: Infinity })
  let fields: string[] | null = null
  let lines = 0
  for await (const line of input) {
    lines += 1
    const cells = parseCsvLine(line)
    if (!fields) { fields = cells; continue }
    const row = Object.fromEntries(fields.map((field, index) => [field, cells[index] ?? ""]))
    if (!periods.has(row.date)) continue
    const anzsco_unit_group = code(row.anzsco4_code, 4)
    const sa4_code = cleanText(row.sa4_code)
    const employment = numberOrNull(row.nsc_emp)
    if (!anzsco_unit_group || anzsco_unit_group.length !== 4 || !sa4_code || employment == null) continue
    const key = `${anzsco_unit_group}|${sa4_code}`
    const snapshot = snapshots.get(key) ?? {
      state: cleanText(row.state_name) ?? "Unknown",
      sa4_code,
      sa4_name: cleanText(row.sa4_name) ?? sa4_code,
      anzsco_unit_group,
      values: new Map<string, number>(),
    }
    snapshot.values.set(row.date, employment)
    snapshots.set(key, snapshot)
    if (lines % 1_000_000 === 0) console.log(`[jsa] NERO scanned ${Math.round(lines / 1_000_000)}m rows`)
  }
  const percentChange = (current: number, previous?: number) => previous && previous !== 0 ? Number((((current - previous) / previous) * 100).toFixed(2)) : null
  const rows = [...snapshots.values()].flatMap((snapshot) => {
    const employment_total = snapshot.values.get("2026-06-15")
    if (employment_total == null) return []
    const annual = snapshot.values.get("2025-06-15")
    const fiveYear = snapshot.values.get("2021-06-15")
    return [{
      anzsco_unit_group: snapshot.anzsco_unit_group,
      state: snapshot.state,
      sa4_code: snapshot.sa4_code,
      sa4_name: snapshot.sa4_name,
      period: "2026-06-15",
      employment_total: Math.round(employment_total),
      annual_change: annual == null ? null : Math.round(employment_total - annual),
      annual_change_pct: percentChange(employment_total, annual),
      five_year_change: fiveYear == null ? null : Math.round(employment_total - fiveYear),
      five_year_change_pct: percentChange(employment_total, fiveYear),
      source_url: sources.regional,
    }]
  })
  console.log(`[jsa] NERO kept ${rows.length} SA4 occupation observations from ${lines.toLocaleString()} source rows`)
  return rows
}

async function main() {
  const { rows: profiles, titleToCode } = profileRows()
  await upsertInBatches("occupation_profiles_au", profiles, "anzsco_v13")
  await upsertInBatches("occupation_pathways_au", pathwayRows(), "osca_code,qualification_code")
  await upsertInBatches("occupation_shortage_drivers_au", shortageDriverRows(titleToCode), "anzsco_unit_group")
  await upsertInBatches("occupation_outlook_au", projectionRows(), "anzsco_unit_group,geography,period_start,period_end")
  await upsertInBatches("occupation_vacancies_au", vacancyRows(), "anzsco_unit_group,state,period,series")
  await upsertInBatches("occupation_regional_employment_au", await regionalRows(), "anzsco_unit_group,sa4_code,period")
}

void main().catch((error) => {
  console.error("[jsa] import failed:", error)
  process.exitCode = 1
})
