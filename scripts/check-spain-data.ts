import { readFile } from "fs/promises"

const root = process.cwd()
const load = async <T,>(file: string) => JSON.parse(await readFile(`${root}/${file}`, "utf8")) as T

async function main() {
  const [occupations, communities, provinces, cities, salaries, universities, snapshots] = await Promise.all([
    load<Array<{ code: string; localName: string; nameEn: string | null; nameKo: string | null; provinceCodes: string[]; reviewStatus: string }>>("src/data/es-shortage-occupations.json"),
    load<Array<{ code: string; topShortage: string[]; rent: { eurM2: number | null }; reviewStatus: string }>>("src/data/es-communities.json"),
    load<Array<{ code: string; communityCode: string; shortageCodes: string[]; reviewStatus: string }>>("src/data/es-provinces.json"),
    load<Array<{ code: string; provinceCode: string; regionCode: string; lat: number; lng: number }>>("src/data/es-cities.json"),
    load<Array<{ regionCode: string; cnoCode: string; annualGrossEur: number | null; regionalAnnualGrossEur: number | null }>>("src/data/es-salary-groups.json"),
    load<Array<{ slug: string; officialUrl: string; regionCode: string; lat: number; lng: number }>>("src/data/es-universities.json"),
    load<Array<{ category: string; sourceUrl: string; contentHash: string; retrievedAt: string }>>("src/data/es-source-snapshots.json"),
  ])
  const issues: string[] = []
  if (communities.length !== 17 || new Set(communities.map((item) => item.code)).size !== 17) issues.push("Expected 17 autonomous communities.")
  if (provinces.length !== 50 || new Set(provinces.map((item) => item.code)).size !== 50) issues.push("Expected 50 provinces.")
  if (cities.length !== 50 || cities.some((item) => !Number.isFinite(item.lat) || !Number.isFinite(item.lng))) issues.push("Capital-city pins are incomplete.")
  if (occupations.length < 20 || occupations.some((item) => !item.code || !item.localName || item.provinceCodes.length === 0)) issues.push("SEPE shortage occupations are incomplete.")
  if (occupations.filter((item) => item.reviewStatus === "approved" && item.nameEn && item.nameKo).length < 20) issues.push("Approved translated shortage occupations are incomplete.")
  if (salaries.length !== 272 || salaries.some((item) => !item.annualGrossEur || !item.regionCode || !item.cnoCode)) issues.push("INE CNO salary rows are incomplete.")
  if (communities.some((item) => !item.rent.eurM2)) issues.push("Community rent data is missing.")
  if (universities.length < 10 || universities.some((item) => !item.slug || !item.officialUrl || !Number.isFinite(item.lat) || !Number.isFinite(item.lng))) issues.push("RUCT university pins are incomplete.")
  for (const category of ["shortage", "occupation", "rent", "university", "boundary", "study-to-work"]) if (!snapshots.find((item) => item.category === category && item.sourceUrl && item.contentHash && item.retrievedAt)) issues.push(`Source snapshot missing: ${category}.`)
  if (issues.length) { console.error("[es-data] failed"); issues.forEach((issue) => console.error(`- ${issue}`)); process.exit(1) }
  console.log(`[es-data] ${occupations.length} shortage occupations, ${communities.length} communities, ${provinces.length} provinces, ${cities.length} cities, ${salaries.length} salary rows, ${universities.length} universities passed.`)
}

main().catch((error) => { console.error("[es-data] failed", error); process.exit(1) })
