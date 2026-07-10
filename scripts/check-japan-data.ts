import occupations from "../src/data/jp-official-occupations.json"
import shortageGroups from "../src/data/jp-official-shortage-groups.json"
import snapshots from "../src/data/jp-source-snapshots.json"
import prefectureShortage from "../src/data/jp-prefecture-shortage-groups.json"
import rentAreas from "../src/data/jp-rent-by-area.json"
import { JAPAN_SOURCE_URLS, parseOccupationApplicants, parseOccupationOpenings, parseWageWorkbook } from "./lib/japan-official-source"

const issues: string[] = []
const records = occupations as Array<{
  occupationCode: string
  localName: string
  hourlyBaseWageYen: number
  annualizedBaseSalaryYen: number
  reviewStatus: string
}>
const shortageRecords = shortageGroups as Array<{
  shortageGroupCode: string
  localName: string
  jobOpenings: number
  applicants: number
  openingsToApplicantsRatio: number
  reviewStatus: string
}>
const prefectureRecords = prefectureShortage as Array<{
  prefectureCode: string
  shortageGroupCode: string
  jobOpenings: number
  applicants: number
  openingsToApplicantsRatio: number
}>
const rentRecords = rentAreas as Array<{
  areaCode: string
  kind: "prefecture" | "city"
  prefectureCode: string
  medianRentBandLowerJpy: number
  rentalHouseholds: number
}>

if (records.length < 50) issues.push(`Expected at least 50 Japan occupation records, found ${records.length}.`)
if (records.some((row) => !/^\d{4}$/.test(row.occupationCode) || !row.localName || row.hourlyBaseWageYen <= 0)) issues.push("Japan occupation code, local name, or wage is invalid.")
if (records.some((row) => row.annualizedBaseSalaryYen !== row.hourlyBaseWageYen * 160 * 12)) issues.push("Annualized Japan salary is not reproducible from the declared method.")
if (records.some((row) => row.reviewStatus !== "review-required")) issues.push("Imported Japan rows must remain review-required.")
if (shortageRecords.length < 50) issues.push(`Expected at least 50 Japan shortage groups, found ${shortageRecords.length}.`)
if (shortageRecords.some((row) => !/^\d{2}$/.test(row.shortageGroupCode) || row.applicants <= 0 || row.openingsToApplicantsRatio !== Number((row.jobOpenings / row.applicants).toFixed(4)))) issues.push("Japan shortage group metrics are invalid.")
if ((snapshots as Array<{ category: string; contentHash: string | null }>).length !== 9) issues.push("Japan source manifest must cover all 9 categories.")
if (!(snapshots as Array<{ category: string; contentHash: string | null }>).find((row) => row.category === "occupation")?.contentHash) issues.push("Japan occupation source snapshot is missing its hash.")
if (!(snapshots as Array<{ category: string; contentHash: string | null }>).find((row) => row.category === "shortage")?.contentHash) issues.push("Japan shortage source snapshot is missing its hash.")
if (new Set(prefectureRecords.map((row) => row.prefectureCode)).size !== 47) issues.push("Japan prefecture shortage data must cover all 47 prefectures.")
if (prefectureRecords.some((row) => !/^\d{2}$/.test(row.prefectureCode) || row.applicants <= 0 || row.openingsToApplicantsRatio !== Number((row.jobOpenings / row.applicants).toFixed(4)))) issues.push("Japan prefecture shortage metrics are invalid.")
if (rentRecords.filter((row) => row.kind === "prefecture").length !== 47) issues.push("Japan rent data must cover all 47 prefectures.")
if (rentRecords.filter((row) => row.kind === "city").length !== 21) issues.push("Japan rent data must cover all 21 major cities.")
if (rentRecords.some((row) => row.medianRentBandLowerJpy < 0 || row.rentalHouseholds <= 0)) issues.push("Japan rent-band data is invalid.")

async function verifySourceSample() {
  const fetchBody = async (url: string) => {
    const response = await fetch(url, { headers: { "user-agent": "CampCareer official-data verifier/1.0 (+https://www.campcareer.com)" } })
    if (!response.ok) throw new Error(`${response.status} ${url}`)
    return new Uint8Array(await response.arrayBuffer())
  }
  const [wageBody, openingsBody, applicantsBody] = await Promise.all([
    fetchBody(JAPAN_SOURCE_URLS.wage), fetchBody(JAPAN_SOURCE_URLS.openings), fetchBody(JAPAN_SOURCE_URLS.applicants),
  ])
  const sourceWages = new Map(parseWageWorkbook(wageBody).map((row) => [row.occupationCode, row]))
  const sourceOpenings = new Map(parseOccupationOpenings(openingsBody).map((row) => [row.shortageGroupCode, row.value]))
  const sourceApplicants = new Map(parseOccupationApplicants(applicantsBody).map((row) => [row.shortageGroupCode, row.value]))
  for (const row of records.slice(0, 50)) {
    const sourceWage = sourceWages.get(row.occupationCode)
    if (!sourceWage || sourceWage.localName !== row.localName || sourceWage.hourlyBaseWageYen !== row.hourlyBaseWageYen) {
      issues.push(`Wage source mismatch for ${row.occupationCode}.`)
      continue
    }
  }
  for (const row of shortageRecords.slice(0, 50)) {
    if (row.jobOpenings !== sourceOpenings.get(row.shortageGroupCode)) issues.push(`Openings source mismatch for shortage group ${row.shortageGroupCode}.`)
    if (row.applicants !== sourceApplicants.get(row.shortageGroupCode)) issues.push(`Applicants source mismatch for shortage group ${row.shortageGroupCode}.`)
  }
}

verifySourceSample().then(() => {
  if (issues.length > 0) {
    console.error("[jp-data] failed")
    for (const issue of issues) console.error(`- ${issue}`)
    process.exit(1)
  }
  console.log(`[jp-data] ${records.length} wage rows, ${shortageRecords.length} national shortage groups, ${prefectureRecords.length} prefecture shortage rows, and ${rentRecords.length} rent areas passed validation; 50 live MHLW samples match.`)
}).catch((error) => {
  console.error("[jp-data] live source verification failed", error)
  process.exit(1)
})
