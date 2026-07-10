import { createHash } from "crypto"
import * as XLSX from "xlsx"

export const JAPAN_SOURCE_URLS = {
  wage: "https://www.mhlw.go.jp/content/001692996.xlsx",
  openings: "https://www.mhlw.go.jp/toukei/list/xls/114-1d-04.xlsx",
  applicants: "https://www.mhlw.go.jp/toukei/list/xls/114-1d-05.xlsx",
  rent: "https://www.e-stat.go.jp/stat-search/database?layout=datalist&stat_infid=000040210070&statdisp_id=0004021497",
} as const

export const JAPAN_SOURCE_CATALOG = [
  { category: "tuition", sourceName: "Japan Student Services Organization", sourceUrl: "https://www.jasso.go.jp/en/study_j/sgtj/guide/", datasetUrls: [], method: "official-web" as const, reviewStatus: "approved" as const, summary: "Official study-in-Japan guidance; school-level tuition imports require a separate reviewed adapter." },
  { category: "graduate-outcomes", sourceName: "Ministry of Education, Culture, Sports, Science and Technology", sourceUrl: "https://www.mext.go.jp/en/", datasetUrls: [], method: "official-web" as const, reviewStatus: "approved" as const, summary: "Official higher-education source catalogued; outcome extraction remains a separate review task." },
  { category: "occupation", sourceName: "MHLW Wage Structure Basic Statistical Survey", sourceUrl: JAPAN_SOURCE_URLS.wage, datasetUrls: [JAPAN_SOURCE_URLS.wage], method: "official-download" as const, reviewStatus: "approved" as const, summary: "Occupation-specific hourly baseline wages from the published MHLW workbook." },
  { category: "rent", sourceName: "Statistics Bureau of Japan Housing and Land Survey", sourceUrl: JAPAN_SOURCE_URLS.rent, datasetUrls: [JAPAN_SOURCE_URLS.rent], method: "official-api" as const, reviewStatus: "approved" as const, summary: "2023 official private-rental monthly-rent distribution by prefecture and 21 major cities. CampCareer displays the lower edge of the median rent band, not an inferred mean." },
  { category: "visa-pathway", sourceName: "Immigration Services Agency of Japan", sourceUrl: "https://www.isa.go.jp/en/", datasetUrls: [], method: "official-web" as const, reviewStatus: "review-required" as const, summary: "Official immigration policy source; never auto-publish pathway claims." },
  { category: "shortage", sourceName: "MHLW Employment-related indicators by occupation", sourceUrl: "https://www.mhlw.go.jp/toukei/list/114-1d.html", datasetUrls: [JAPAN_SOURCE_URLS.openings, JAPAN_SOURCE_URLS.applicants], method: "official-download" as const, reviewStatus: "approved" as const, summary: "Annual occupation-group job openings and job seekers from MHLW employment-service statistics." },
  { category: "foreign-worker-pathway", sourceName: "Immigration Services Agency of Japan work status", sourceUrl: "https://www.isa.go.jp/en/applications/procedures/nyuukokukanri07_00059.html", datasetUrls: [], method: "official-web" as const, reviewStatus: "review-required" as const, summary: "Official work-status policy source; occupation mappings require human review." },
  { category: "language-requirement", sourceName: "Japanese-Language Proficiency Test", sourceUrl: "https://www.jlpt.jp/e/", datasetUrls: [], method: "official-web" as const, reviewStatus: "approved" as const, summary: "Official JLPT framework source; it does not prove occupation-specific language requirements." },
  { category: "job-quality", sourceName: "MHLW Labour Statistics Yearbook", sourceUrl: "https://www.mhlw.go.jp/stf/roudouyoran.html", datasetUrls: [], method: "official-download" as const, reviewStatus: "approved" as const, summary: "Official job-quality source catalogued; occupation-level working-condition extraction remains a separate adapter." },
] as const

export type WageRow = {
  occupationCode: string
  localName: string
  hourlyBaseWageYen: number
}

export type DemandRow = {
  shortageGroupCode: string
  localName: string
  value: number
}

export type PrefectureDemandRow = DemandRow & {
  prefectureName: string
}

export function sha256(body: Uint8Array | string) {
  return createHash("sha256").update(body).digest("hex")
}

export function parseWageWorkbook(body: Uint8Array): WageRow[] {
  const workbook = XLSX.read(body, { type: "buffer" })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null })
  return rows.flatMap((row) => {
    const code = row[1]
    const localName = row[2]
    const hourlyBaseWageYen = row[3]
    if ((typeof code !== "number" && typeof code !== "string") || typeof localName !== "string" || typeof hourlyBaseWageYen !== "number") return []
    const occupationCode = String(code).trim()
    if (!/^\d{4}$/.test(occupationCode) || hourlyBaseWageYen <= 0) return []
    return [{ occupationCode, localName: localName.replace(/\s+/g, " ").trim(), hourlyBaseWageYen }]
  })
}

function parseNationalEmploymentSheet(body: Uint8Array, prefix: "第4表－１" | "第5表－１", valueColumn: number): DemandRow[] {
  const workbook = XLSX.read(body, { type: "buffer" })
  const sheetName = workbook.SheetNames.find((name) => name.startsWith(prefix) && name.includes("2023年度"))
  if (!sheetName) throw new Error(`Missing current ${prefix} worksheet.`)
  const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], { header: 1, defval: null })
  let withinNationalTotal = false
  const output: DemandRow[] = []
  for (const row of rows) {
    if (row[0] === "全国計") withinNationalTotal = true
    else if (withinNationalTotal && typeof row[0] === "string" && row[0].trim()) withinNationalTotal = false
    if (!withinNationalTotal) continue
    const nameCell = prefix === "第4表－１" ? row[1] : row[2]
    const value = row[valueColumn]
    if (typeof nameCell !== "string" || typeof value !== "number") continue
    const match = nameCell.match(/^\s*(\d{2})\s*(.+)$/)
    if (!match) continue
    output.push({ shortageGroupCode: match[1], localName: match[2].trim(), value })
  }
  return output
}

export function parseOccupationOpenings(body: Uint8Array) {
  return parseNationalEmploymentSheet(body, "第4表－１", 4)
}

export function parseOccupationApplicants(body: Uint8Array) {
  return parseNationalEmploymentSheet(body, "第5表－１", 9)
}

function parsePrefectureEmploymentSheet(
  body: Uint8Array,
  prefix: "第4表－１" | "第5表－１",
  valueColumn: number,
): PrefectureDemandRow[] {
  const workbook = XLSX.read(body, { type: "buffer" })
  const sheetName = workbook.SheetNames.find((name) => name.startsWith(prefix) && name.includes("2023年度"))
  if (!sheetName) throw new Error(`Missing current ${prefix} worksheet.`)

  const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], { header: 1, defval: null })
  const output: PrefectureDemandRow[] = []
  let prefectureName: string | null = null
  let withinAgeTotal = prefix === "第4表－１"

  for (const row of rows) {
    if (typeof row[0] === "string" && row[0].trim()) {
      prefectureName = row[0].trim()
      // The applicants table repeats every occupation for several age bands.
      // Only the "all ages" block is comparable with the openings table.
      withinAgeTotal = prefix === "第4表－１" || row[1] === "年齢計"
    } else if (prefix === "第5表－１" && typeof row[1] === "string" && row[1].trim()) {
      withinAgeTotal = row[1] === "年齢計"
    }

    if (!prefectureName || prefectureName === "全国計" || !withinAgeTotal) continue
    const nameCell = prefix === "第4表－１" ? row[1] : row[2]
    const value = row[valueColumn]
    if (typeof nameCell !== "string" || typeof value !== "number") continue
    const match = nameCell.match(/^\s*(\d{2})\s*(.+)$/)
    if (!match) continue
    output.push({
      prefectureName,
      shortageGroupCode: match[1],
      localName: match[2].trim(),
      value,
    })
  }
  return output
}

export function parsePrefectureOccupationOpenings(body: Uint8Array) {
  return parsePrefectureEmploymentSheet(body, "第4表－１", 4)
}

export function parsePrefectureOccupationApplicants(body: Uint8Array) {
  return parsePrefectureEmploymentSheet(body, "第5表－１", 9)
}

export function percentileScore(value: number, population: number[]) {
  const ordered = [...population].filter(Number.isFinite).sort((a, b) => a - b)
  if (ordered.length === 0) return null
  const lowerOrEqual = ordered.filter((candidate) => candidate <= value).length
  return Math.max(1, Math.min(100, Math.round((lowerOrEqual / ordered.length) * 100)))
}
