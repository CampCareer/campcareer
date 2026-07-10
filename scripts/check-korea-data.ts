import { readFile } from "fs/promises"

const ROOT = process.cwd()
const issues: string[] = []

async function load<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(`${ROOT}/src/data/${file}`, "utf8")) as T
}

async function main() {
  const [regions, occupations, universities, snapshots] = await Promise.all([
    load<Array<{ code: string; nameKo: string; rent: { apartmentSizeSqm: string; monthlyDepositKrw: number | null; monthlyRentKrw: number | null; jeonseDepositKrw: number | null; status: string }; sourceCodes: string[]; reviewStatus: string }>>("kr-regions.json"),
    load<Array<{ kscoCode: string; nameKo: string; regionCode: string; monthlyWageKrw: number | null; annualWageKrw: number | null; wageKind: string; wageFormula: string | null; demandKind: string; demandScore: number | null; sourceCodes: string[]; commercialUseAllowed: boolean; reviewStatus: string }>>("kr-occupations.json"),
    load<Array<{ slug: string; regionCode: string; lat: number; lng: number; qsRank2027: number; qsRankSourceUrl: string; officialUrl: string }>>("kr-universities.json"),
    load<Array<{ sourceCode: string; sourceUrl: string; licenseStatus: string; commercialUseAllowed: boolean }>>("kr-source-snapshots.json"),
  ])

  const expectedCodes = ["11", "26", "27", "28", "29", "30", "31", "36", "41", "42", "43", "44", "45", "46", "47", "48", "50"]
  if (regions.length !== 17 || expectedCodes.some((code) => !regions.some((region) => region.code === code))) issues.push("Korea must contain exactly the 17 planned city/province units.")
  if (new Set(regions.map((region) => region.code)).size !== regions.length) issues.push("Korea regions contain duplicate codes.")
  if (regions.some((region) => region.rent.apartmentSizeSqm !== "40-85" || !region.sourceCodes.length)) issues.push("Every Korea region must retain the 40-85 sqm rent contract and source references.")
  if (regions.some((region) => region.rent.monthlyRentKrw != null && region.rent.jeonseDepositKrw != null && region.rent.status === "available" && region.rent.monthlyDepositKrw == null)) issues.push("Monthly-rent records must preserve the deposit instead of converting jeonse into rent.")
  if (new Set(occupations.map((occupation) => `${occupation.kscoCode}:${occupation.regionCode}`)).size !== occupations.length) issues.push("Korea occupations contain duplicate KSCO-region rows.")
  for (const occupation of occupations) {
    if (!expectedCodes.includes(occupation.regionCode) || !occupation.kscoCode || !occupation.nameKo || !occupation.sourceCodes.length) issues.push(`Invalid Korea occupation identity: ${occupation.kscoCode || "missing"}.`)
    if (occupation.monthlyWageKrw != null && occupation.monthlyWageKrw <= 0) issues.push(`Invalid monthly wage: ${occupation.kscoCode}.`)
    if (occupation.annualWageKrw != null && occupation.annualWageKrw <= 0) issues.push(`Invalid annual wage: ${occupation.kscoCode}.`)
    if (occupation.wageKind === "estimated-national-times-regional-factor" && !occupation.wageFormula) issues.push(`Estimated wage requires a reproducible formula: ${occupation.kscoCode}.`)
    if (occupation.demandKind === "official-shortage" && occupation.demandScore == null) issues.push(`Official shortage requires a score and source: ${occupation.kscoCode}.`)
    if (occupation.reviewStatus === "approved" && (!occupation.commercialUseAllowed || occupation.monthlyWageKrw == null || occupation.demandScore == null)) issues.push(`An indexable Korea occupation lacks a licensed wage or demand value: ${occupation.kscoCode}.`)
  }
  if (universities.some((university) => !expectedCodes.includes(university.regionCode) || university.qsRank2027 > 500 || !university.qsRankSourceUrl || !university.officialUrl || !Number.isFinite(university.lat) || !Number.isFinite(university.lng))) issues.push("Korea university pins require a top-500 QS rank, region, coordinates, ranking source and official URL.")
  if (new Set(universities.map((university) => university.slug)).size !== universities.length) issues.push("Korea university slugs must be unique.")
  if (snapshots.some((snapshot) => !snapshot.sourceCode || !snapshot.sourceUrl)) issues.push("Every Korea source snapshot needs an identifier and source URL.")
  if (snapshots.some((snapshot) => snapshot.commercialUseAllowed && snapshot.licenseStatus !== "commercial-allowed")) issues.push("Only explicitly commercial-allowed sources may be used for public Korea scores.")

  if (issues.length > 0) {
    console.error("[kr-data] failed")
    for (const issue of issues) console.error(`- ${issue}`)
    process.exit(1)
  }

  const approved = occupations.filter((occupation) => occupation.reviewStatus === "approved" && occupation.commercialUseAllowed && occupation.monthlyWageKrw != null && occupation.demandScore != null)
  console.log(`[kr-data] ${regions.length} regions, ${occupations.length} occupation rows, ${universities.length} verified QS pins, and ${approved.length} indexable occupations passed validation.`)
}

main().catch((error) => {
  console.error("[kr-data] failed", error)
  process.exit(1)
})
