import { readFile } from "fs/promises"
import { SINGAPORE_DEMAND_SEEDS, SINGAPORE_SOURCE_URLS, parseOccupationalWages } from "./lib/singapore-official-source"

const ROOT = process.cwd()
const issues: string[] = []

async function load<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(`${ROOT}/${path}`, "utf8")) as T
}

async function main() {
  const [wages, demand, areas, snapshots] = await Promise.all([
    load<Array<{ ssocCode: string; nameEn: string; medianBasicWageSgd: number; medianGrossWageSgd: number; reviewStatus: string }>>("src/data/sg-occupation-wages.json"),
    load<Array<{ sourceCode: string; nameEn: string; nameKo: string; rank: number; category: string; offeredWageLowSgd: number; offeredWageHighSgd: number; skills: string[]; shortageScore: number }>>("src/data/sg-demand-occupations.json"),
    load<Array<{ code: string; uraSegment: string; rentalIndex: number; statisticPeriod: string }>>("src/data/sg-map-areas.json"),
    load<Array<{ category: string; contentHash: string | null; sourceUrl: string }>>("src/data/sg-source-snapshots.json"),
  ])
  if (wages.length < 500) issues.push(`Expected at least 500 MOM wage rows, found ${wages.length}.`)
  if (wages.some((row) => !/^\d{5}$/.test(row.ssocCode) || !row.nameEn || row.medianBasicWageSgd <= 0 || row.medianGrossWageSgd <= 0 || row.reviewStatus !== "approved")) issues.push("Singapore wage rows contain invalid SSOC codes, wage values, or review state.")
  if (new Set(wages.map((row) => row.ssocCode)).size !== wages.length) issues.push("Singapore wage rows contain duplicate SSOC codes.")
  if (demand.length !== SINGAPORE_DEMAND_SEEDS.length) issues.push("Singapore demand-card count does not match the published MOM top-vacancy tables.")
  if (demand.some((row) => !row.sourceCode || !row.nameEn || !row.nameKo || row.offeredWageLowSgd <= 0 || row.offeredWageHighSgd < row.offeredWageLowSgd || row.skills.length === 0 || row.shortageScore < 55 || row.shortageScore > 100)) issues.push("Singapore demand-card data is incomplete or invalid.")
  if (areas.length !== 6 || areas.some((row) => !["CCR", "RCR", "OCR"].includes(row.uraSegment) || row.rentalIndex <= 0 || row.statisticPeriod !== "1Q 2026")) issues.push("Singapore URA area data must include six valid market-proxy areas.")
  const occupationSnapshot = snapshots.find((row) => row.category === "occupation")
  const shortageSnapshot = snapshots.find((row) => row.category === "shortage")
  if (!occupationSnapshot?.contentHash || occupationSnapshot.sourceUrl !== SINGAPORE_SOURCE_URLS.occupationalWages) issues.push("Singapore occupational-wage source snapshot is incomplete.")
  if (!shortageSnapshot?.contentHash || shortageSnapshot.sourceUrl !== SINGAPORE_SOURCE_URLS.jobVacancyReport) issues.push("Singapore job-vacancy source snapshot is incomplete.")

  const response = await fetch(SINGAPORE_SOURCE_URLS.occupationalWages, { headers: { "user-agent": "CampCareer official-data verifier/1.0 (+https://www.campcareer.com)" } })
  if (!response.ok) throw new Error(`Unable to fetch live MOM wage workbook: ${response.status}`)
  const source = new Map(parseOccupationalWages(new Uint8Array(await response.arrayBuffer())).map((row) => [row.ssocCode, row]))
  for (const row of wages.slice(0, 50)) {
    const sourceRow = source.get(row.ssocCode)
    if (!sourceRow || sourceRow.nameEn !== row.nameEn || sourceRow.medianBasicWageSgd !== row.medianBasicWageSgd || sourceRow.medianGrossWageSgd !== row.medianGrossWageSgd) issues.push(`MOM wage source mismatch for SSOC ${row.ssocCode}.`)
  }

  if (issues.length > 0) {
    console.error("[sg-data] failed")
    for (const issue of issues) console.error(`- ${issue}`)
    process.exit(1)
  }
  console.log(`[sg-data] ${wages.length} wage rows, ${demand.length} MOM demand cards, ${areas.length} URA market proxies, and 50 live MOM wage samples passed validation.`)
}

main().catch((error) => {
  console.error("[sg-data] live source verification failed", error)
  process.exit(1)
})
