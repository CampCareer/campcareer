/**
 * Downloads the ABS OSCA 2024 v1.0 category-description workbook and creates
 * the checked-in occupation-content snapshot consumed by /au/jobs pages.
 *
 * Source: https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/data-downloads
 * Usage: npx tsx scripts/import-au-osca-content.ts
 */
import { createHash } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import * as XLSX from "xlsx"

const SOURCE_URL = "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/data-downloads/OSCA%20Category%20Descriptions.xlsx"
const SOURCE_PAGE = "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/data-downloads"
const OUTPUT_PATH = path.resolve("src/data/au-osca-occupation-profiles.json")

type Cell = string | number | null
type SheetRow = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

export type AuOscaOccupationProfile = {
  code: string
  title: string
  alternativeTitles: string[]
  leadStatement: string
  registrationOrLicensing: string | null
  inclusionAndExclusion: string | null
  skillAttributes: string | null
  skillLevel: number | null
  mainTasks: string[]
  specialisations: string[]
  occupationInNecCategory: string | null
  officialUrl: string
}

type Snapshot = {
  source: {
    name: string
    pageUrl: string
    datasetUrl: string
    classification: string
    released: string
    retrievedAt: string
    contentHash: string
  }
  occupations: AuOscaOccupationProfile[]
}

function asText(value: Cell): string | null {
  const text = String(value ?? "").replace(/\s+/g, " ").trim()
  return text || null
}

function splitList(value: Cell): string[] {
  return (asText(value) ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
}

function occupationUrl(code: string): string {
  return `https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/${code[0]}/${code.slice(0, 2)}/${code.slice(0, 3)}/${code.slice(0, 4)}/${code}`
}

function parseProfiles(bytes: Buffer): AuOscaOccupationProfile[] {
  const workbook = XLSX.read(bytes, { type: "buffer" })
  const sheet = workbook.Sheets["Table 1"]
  if (!sheet) throw new Error("OSCA workbook does not contain Table 1")

  const rows = XLSX.utils.sheet_to_json<SheetRow>(sheet, { header: 1, defval: null })
  const header = rows[4]?.map((cell) => asText(cell))
  const expected = ["Identifier", "Principal Title", "Alternative Title", "Lead Statement", "Registration or Licensing", "Inclusion and Exclusion Statements", "Skill Attributes", "Skill Level", "Main Tasks", "Specialisations", "Occupation in NEC category"]
  if (JSON.stringify(header) !== JSON.stringify(expected)) throw new Error(`Unexpected OSCA Table 1 header: ${JSON.stringify(header)}`)

  const profiles = rows.slice(5)
    .map((row) => {
      const code = asText(row[0])?.padStart(6, "0") ?? ""
      const title = asText(row[1])
      if (!/^\d{6}$/.test(code) || !title) return null
      const skillLevel = typeof row[7] === "number" ? row[7] : Number(asText(row[7]))
      return {
        code,
        title,
        alternativeTitles: splitList(row[2]),
        leadStatement: asText(row[3]) ?? "",
        registrationOrLicensing: asText(row[4]),
        inclusionAndExclusion: asText(row[5]),
        skillAttributes: asText(row[6]),
        skillLevel: Number.isFinite(skillLevel) ? skillLevel : null,
        mainTasks: splitList(row[8]),
        specialisations: splitList(row[9]),
        occupationInNecCategory: asText(row[10]),
        officialUrl: occupationUrl(code),
      } satisfies AuOscaOccupationProfile
    })
    .filter((profile): profile is AuOscaOccupationProfile => profile !== null)
    .sort((a, b) => a.code.localeCompare(b.code))

  if (profiles.length < 1000) throw new Error(`Expected 1,000+ OSCA occupation profiles, received ${profiles.length}`)
  return profiles
}

async function main() {
  const response = await fetch(SOURCE_URL)
  if (!response.ok) throw new Error(`ABS download failed: ${response.status} ${response.statusText}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  const snapshot: Snapshot = {
    source: {
      name: "Australian Bureau of Statistics — OSCA Category Descriptions",
      pageUrl: SOURCE_PAGE,
      datasetUrl: SOURCE_URL,
      classification: "OSCA 2024 Version 1.0",
      released: "2024-12-06",
      retrievedAt: new Date().toISOString(),
      contentHash: createHash("sha256").update(bytes).digest("hex"),
    },
    occupations: parseProfiles(bytes),
  }

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`[au-osca] wrote ${snapshot.occupations.length} official profiles to ${OUTPUT_PATH}`)
  console.log(`[au-osca] source hash ${snapshot.source.contentHash}`)
}

void main()
