import { readFile } from "fs/promises"
import { FRANCE_SOURCE_URLS, parseFrenchNumber, parseSemicolonCsv } from "./lib/france-official-source"

const ROOT = process.cwd()
const issues: string[] = []

async function load<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(`${ROOT}/${file}`, "utf8")) as T
}

async function main() {
  const [occupations, regions, cities, salaries, universities, snapshots] = await Promise.all([
    load<Array<{ bmoCode: string; localName: string; nameEn: string | null; nameKo: string | null; recruitmentProjects: number; recruitmentDifficultyPct: number | null; reviewStatus: string }>>("src/data/fr-demand-occupations.json"),
    load<Array<{ code: string; topDemand: Array<{ code: string; recruitmentProjects: number }>; rent: { advertisedRentEurM2: number | null; cityCoverage: number; sourceCityCount: number } }>>("src/data/fr-regions.json"),
    load<Array<{ code: string; regionCode: string; basinName: string; topDemand: Array<{ code: string; recruitmentProjects: number }>; rent: { advertisedRentEurM2: number | null; observationCount: number | null; r2Adjusted: number | null; predictionType: string | null; status: string } }>>("src/data/fr-cities.json"),
    load<Array<{ regionCode: string; pcsCode: string; monthlyNetEur: number; reviewStatus: string }>>("src/data/fr-salary-groups.json"),
    load<Array<{ slug: string; nameFr: string; regionCode: string; officialUrl: string; lat: number; lng: number; reviewStatus: string }>>("src/data/fr-universities.json"),
    load<Array<{ category: string; contentHash: string; sourceUrl: string; retrievedAt: string; licenseStatus: string }>>("src/data/fr-source-snapshots.json"),
  ])
  if (occupations.length < 100) issues.push(`Expected 100+ BMO occupations, found ${occupations.length}.`)
  const approved = occupations.filter((occupation) => occupation.reviewStatus === "approved" && occupation.nameEn && occupation.nameKo)
  if (approved.length < 50) issues.push(`Expected 50 approved translated BMO occupations, found ${approved.length}.`)
  if (new Set(occupations.map((occupation) => occupation.bmoCode)).size !== occupations.length) issues.push("BMO occupations contain duplicate source codes.")
  if (occupations.some((occupation) => !occupation.localName || occupation.recruitmentProjects <= 0 || occupation.recruitmentDifficultyPct == null)) issues.push("BMO occupations have missing demand or recruitment-difficulty values.")
  if (regions.length !== 13 || new Set(regions.map((region) => region.code)).size !== 13) issues.push("France requires exactly 13 metropolitan region rows.")
  if (cities.length !== 50 || new Set(cities.map((city) => city.code)).size !== 50) issues.push("France requires exactly 50 unique release cities.")
  if (new Set(cities.map((city) => city.regionCode)).size !== 13) issues.push("Release cities do not cover every metropolitan region.")
  const codes = new Set(occupations.map((occupation) => occupation.bmoCode))
  if (regions.some((region) => region.topDemand.length < 3 || region.topDemand.some((row) => !codes.has(row.code) || row.recruitmentProjects <= 0))) issues.push("Region BMO demand rows are incomplete or reference unknown occupations.")
  if (cities.some((city) => !city.basinName || city.topDemand.length < 3 || city.topDemand.some((row) => !codes.has(row.code) || row.recruitmentProjects <= 0))) issues.push("City BMO basin demand rows are incomplete or reference unknown occupations.")
  if (cities.some((city) => city.rent.status === "available" && (!(city.rent.advertisedRentEurM2 && city.rent.advertisedRentEurM2 > 0) || (city.rent.observationCount ?? 0) < 30 || (city.rent.r2Adjusted ?? 0) < 0.5 || city.rent.predictionType !== "commune"))) issues.push("Published city rent fails the observation, R², or direct-commune quality gate.")
  if (regions.some((region) => region.rent.advertisedRentEurM2 != null && (region.rent.cityCoverage <= 0 || region.rent.sourceCityCount < region.rent.cityCoverage))) issues.push("Region rent aggregation has invalid city coverage.")
  if (salaries.length < 52 || salaries.some((salary) => !["1T3", "4", "5", "6"].includes(salary.pcsCode) || salary.monthlyNetEur <= 0 || salary.reviewStatus !== "approved")) issues.push("INSEE salary groups are incomplete or invalid.")
  if (universities.length < 100 || universities.some((university) => !university.slug || !university.nameFr || !university.officialUrl || !Number.isFinite(university.lat) || !Number.isFinite(university.lng) || university.reviewStatus !== "approved")) issues.push("MESR university records are incomplete.")
  for (const category of ["shortage", "rent", "occupation", "university", "boundary"]) {
    const snapshot = snapshots.find((item) => item.category === category)
    if (!snapshot?.contentHash || !snapshot.retrievedAt || !snapshot.sourceUrl || !snapshot.licenseStatus) issues.push(`Source snapshot is incomplete: ${category}.`)
  }

  const response = await fetch(FRANCE_SOURCE_URLS.bmoNational, { headers: { "user-agent": "CampCareer official-data verifier/1.0 (+https://www.campcareer.com)" } })
  if (!response.ok) throw new Error(`Unable to fetch live France Travail BMO export: ${response.status}`)
  const liveRows = parseSemicolonCsv((await response.text()).replace(/^\uFEFF/, ""))
  const header = liveRows.findIndex((row) => row[0] === "Métier")
  const live = new Map(liveRows.slice(header + 1).map((row) => [row[0], parseFrenchNumber(row[1])]))
  for (const occupation of occupations.slice(0, 50)) {
    if (live.get(occupation.localName) !== occupation.recruitmentProjects) issues.push(`Live BMO mismatch: ${occupation.localName}.`)
  }

  if (issues.length > 0) {
    console.error("[fr-data] failed")
    for (const issue of issues) console.error(`- ${issue}`)
    process.exit(1)
  }
  console.log(`[fr-data] ${occupations.length} BMO occupations (${approved.length} approved), ${regions.length} regions, ${cities.length} cities, ${salaries.length} PCS salary rows, ${universities.length} institutions, and 50 live BMO samples passed.`)
}

main().catch((error) => { console.error("[fr-data] live source verification failed", error); process.exit(1) })
