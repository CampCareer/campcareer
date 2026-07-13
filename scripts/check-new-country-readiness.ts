import { readFileSync } from "node:fs"
import { join } from "node:path"
import {
  NEW_COUNTRY_CODES,
  getNewCountryReleaseGate,
} from "../src/lib/new-country-release-gate"

type JsonRecord = Record<string, unknown>

const root = process.cwd()
const codeField = {
  NZ: "anzscoCode",
  NO: "stykrCode",
  SE: "ssykCode",
  DK: "dosCode",
  FI: "iscoCode",
} as const

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(root, "src", "data", filename), "utf8")) as T
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

const blockers: string[] = []

function assertOfficialCodeFixture(
  countryCode: "NZ" | "FI",
  rows: JsonRecord[],
  field: string,
  code: string,
  nameEn: string,
) {
  const row = rows.find((item) => String(item[field] ?? "") === code)
  if (!row || row.nameEn !== nameEn) {
    blockers.push(`${countryCode}: official-code regression ${code} must be ${nameEn}`)
  }
}

for (const countryCode of NEW_COUNTRY_CODES) {
  const prefix = countryCode.toLowerCase()
  const occupations = readJson<JsonRecord[]>(prefix + "-occupations.json")
  const regions = readJson<JsonRecord[]>(prefix + "-regions.json")
  const cities = readJson<JsonRecord[]>(prefix + "-cities.json")
  const universities = readJson<JsonRecord[]>(prefix + "-universities.json")
  const snapshots = readJson<JsonRecord[]>(prefix + "-source-snapshots.json")
  const field = codeField[countryCode]
  const codes = occupations.map((row) => String(row[field] ?? "")).filter(Boolean)
  const duplicateCodes = [...new Set(codes.filter((code, index) => codes.indexOf(code) !== index))]
  const regionCodes = new Set(regions.map((row) => String(row.code ?? "")))
  const invalidRegionReferences = [...cities, ...universities]
    .filter((row) => !regionCodes.has(String(row.regionCode ?? "")))
    .map((row) => String(row.nameEn ?? row.slug ?? "unnamed"))
  const placeholderSnapshots = snapshots.filter((row) =>
    String(row.contentHash ?? "").startsWith("placeholder-") ||
    strings(row.datasetUrls).length === 0,
  )
  const gate = getNewCountryReleaseGate(countryCode)
  const countryIssues = [
    ...duplicateCodes.map((code) => countryCode + ": duplicate official code " + code),
    ...invalidRegionReferences.map((name) => countryCode + ": invalid region reference for " + name),
    ...placeholderSnapshots.map((row) => countryCode + ": incomplete source snapshot " + String(row.category ?? "unknown")),
  ]

  if (countryCode === "NZ") {
    assertOfficialCodeFixture("NZ", occupations, field, "2544", "Registered Nurses")
    assertOfficialCodeFixture("NZ", occupations, field, "254111", "Midwife")
    assertOfficialCodeFixture("NZ", occupations, field, "254412", "Registered Nurse (Aged Care)")
  }
  if (countryCode === "FI") {
    assertOfficialCodeFixture("FI", occupations, field, "7126", "Plumbers and pipe fitters")
    const painters = occupations.find((row) => row.nameEn === "Plumbers" && String(row[field] ?? "") === "7131")
    if (painters) blockers.push("FI: 7131 is painters, not plumbers")
  }

  if (gate?.indexable && countryIssues.length > 0) blockers.push(...countryIssues)

  console.log(
    "[country-readiness] " +
      countryCode +
      " stage=" +
      gate?.stage +
      " indexable=" +
      gate?.indexable +
      " structural-issues=" +
      countryIssues.length,
  )
}

if (blockers.length > 0) {
  console.error("[country-readiness] release blocked")
  for (const blocker of blockers) console.error("- " + blocker)
  process.exit(1)
}

console.log("[country-readiness] release gates match the current evidence state.")
