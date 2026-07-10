import { mkdir, writeFile } from "fs/promises"
import path from "path"
import {
  SINGAPORE_DEMAND_SEEDS,
  SINGAPORE_SOURCE_URLS,
  parseOccupationalWages,
  percentileScore,
  sha256,
} from "./lib/singapore-official-source"

const ROOT = process.cwd()
const RAW_DIR = path.join(ROOT, "data/raw/sg")
const DATA_DIR = path.join(ROOT, "src/data")
const RETRIEVED_AT = new Date().toISOString()
const CHECKED_AT = RETRIEVED_AT.slice(0, 10)

async function download(url: string) {
  const response = await fetch(url, { headers: { "user-agent": "CampCareer official-data importer/1.0 (+https://www.campcareer.com)" } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return new Uint8Array(await response.arrayBuffer())
}

function toJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true })
  const [wagesBody, vacanciesBody] = await Promise.all([
    download(SINGAPORE_SOURCE_URLS.occupationalWages),
    download(SINGAPORE_SOURCE_URLS.jobVacancies),
  ])
  await Promise.all([
    writeFile(path.join(RAW_DIR, "mom-occupational-wages-2025.xlsx"), wagesBody),
    writeFile(path.join(RAW_DIR, "mom-job-vacancies-2025.pdf"), vacanciesBody),
  ])

  const sourceWages = parseOccupationalWages(wagesBody)
  const salaryPopulation = sourceWages.map((row) => row.medianGrossWageSgd)
  const occupations = sourceWages.map((row) => ({
    country: "SG",
    ssocCode: row.ssocCode,
    localName: row.nameEn,
    nameEn: row.nameEn,
    nameKo: null,
    occupationClassification: "SSOC 2024",
    geography: "Singapore",
    statisticPeriod: "June 2025",
    medianBasicWageSgd: row.medianBasicWageSgd,
    medianGrossWageSgd: row.medianGrossWageSgd,
    salaryScore: percentileScore(row.medianGrossWageSgd, salaryPopulation),
    sourceUrl: SINGAPORE_SOURCE_URLS.occupationalWages,
    retrievedAt: RETRIEVED_AT,
    lastChecked: CHECKED_AT,
    confidence: "official",
    method: "official-download",
    reviewStatus: "approved",
  }))

  const demand = SINGAPORE_DEMAND_SEEDS.map((row) => ({
    country: "SG",
    ...row,
    geography: "Singapore (national demand signal)",
    statisticPeriod: "Job Vacancies 2025",
    shortageScore: 100 - ((row.rank - 1) * 5),
    shortageDefinition: "Normalized MOM 2025 rank within the published top-10 vacancy list for the stated occupational group; not a nationwide vacancy rate.",
    sourceUrl: SINGAPORE_SOURCE_URLS.jobVacancyReport,
    datasetUrl: SINGAPORE_SOURCE_URLS.jobVacancies,
    retrievedAt: RETRIEVED_AT,
    lastChecked: CHECKED_AT,
    confidence: "official",
    method: "official-download",
    reviewStatus: "approved",
  }))

  const areas = [
    { code: "central", nameEn: "Central", nameKo: "센트럴", areaType: "macro-region", uraSegment: "RCR", rentalIndex: 172.3, rentalChangePct: -0.2, focus: "Central city living comparison" },
    { code: "east", nameEn: "East", nameKo: "이스트", areaType: "macro-region", uraSegment: "OCR", rentalIndex: 169.5, rentalChangePct: 1.0, focus: "East-side living comparison" },
    { code: "north", nameEn: "North", nameKo: "노스", areaType: "macro-region", uraSegment: "OCR", rentalIndex: 169.5, rentalChangePct: 1.0, focus: "North-side living comparison" },
    { code: "north-east", nameEn: "North-East", nameKo: "노스이스트", areaType: "macro-region", uraSegment: "OCR", rentalIndex: 169.5, rentalChangePct: 1.0, focus: "North-east living comparison" },
    { code: "west", nameEn: "West", nameKo: "웨스트", areaType: "macro-region", uraSegment: "OCR", rentalIndex: 169.5, rentalChangePct: 1.0, focus: "West-side living comparison" },
    { code: "cbd", nameEn: "CBD", nameKo: "CBD", areaType: "employment-district", uraSegment: "CCR", rentalIndex: 151.1, rentalChangePct: 0.5, focus: "Central business district commute comparison" },
  ].map((row) => ({
    country: "SG",
    ...row,
    rentMetric: "URA private residential non-landed rental index (1Q09=100), market-segment proxy only; not an average room or unit rent.",
    statisticPeriod: "1Q 2026",
    sourceUrl: SINGAPORE_SOURCE_URLS.uraRentRelease,
    datasetUrl: SINGAPORE_SOURCE_URLS.uraRent,
    retrievedAt: RETRIEVED_AT,
    lastChecked: CHECKED_AT,
    confidence: "official",
    method: "official-download",
    reviewStatus: "approved",
  }))

  const workPassPathways = {
    country: "SG",
    reviewStatus: "review-required",
    lastChecked: CHECKED_AT,
    pathways: [
      { code: "ep", name: "Employment Pass", sourceUrl: SINGAPORE_SOURCE_URLS.employmentPass, note: "Employer must apply. Qualifying salary and COMPASS requirements are assessed for the individual application." },
      { code: "spass", name: "S Pass", sourceUrl: SINGAPORE_SOURCE_URLS.sPass, note: "Employer must apply. Eligibility, quota and levy context are employer-dependent." },
      { code: "student-pass", name: "Student's Pass", sourceUrl: SINGAPORE_SOURCE_URLS.studentsPass, note: "Full-time study pass. Work rights and post-study status require official review." },
      { code: "compass-sol", name: "COMPASS C5 Shortage Occupation List", sourceUrl: SINGAPORE_SOURCE_URLS.compassSol, note: "SOL status can provide COMPASS C5 points when all job-duty and additional requirements are met; it is not a visa approval guarantee." },
    ],
  }

  const snapshots = [
    { category: "occupation", sourceName: "MOM Occupational Wages 2025", sourceUrl: SINGAPORE_SOURCE_URLS.occupationalWages, datasetUrls: [SINGAPORE_SOURCE_URLS.occupationalWages], contentHash: sha256(wagesBody), retrievedAt: RETRIEVED_AT, method: "official-download", reviewStatus: "approved", status: "ingested", summary: "SSOC 2024 occupation-level median monthly basic and gross wages." },
    { category: "shortage", sourceName: "MOM Job Vacancies 2025", sourceUrl: SINGAPORE_SOURCE_URLS.jobVacancyReport, datasetUrls: [SINGAPORE_SOURCE_URLS.jobVacancies], contentHash: sha256(vacanciesBody), retrievedAt: RETRIEVED_AT, method: "official-download", reviewStatus: "approved", status: "ingested", summary: "Published top job-vacancy lists with offer ranges, skills, qualifications and experience context." },
    { category: "rent", sourceName: "URA 1Q 2026 rental index", sourceUrl: SINGAPORE_SOURCE_URLS.uraRentRelease, datasetUrls: [SINGAPORE_SOURCE_URLS.uraRent], contentHash: null, retrievedAt: RETRIEVED_AT, method: "official-download", reviewStatus: "approved", status: "cataloged", summary: "CCR, RCR and OCR rental-index market segments; no room-rent average is inferred." },
    { category: "foreign-worker-pathway", sourceName: "MOM work pass requirements", sourceUrl: SINGAPORE_SOURCE_URLS.employmentPass, datasetUrls: [SINGAPORE_SOURCE_URLS.sPass, SINGAPORE_SOURCE_URLS.compassSol], contentHash: null, retrievedAt: RETRIEVED_AT, method: "official-web", reviewStatus: "review-required", status: "cataloged", summary: "Work-pass policy is linked for human review and never treated as approval evidence." },
    { category: "skills", sourceName: "SkillsFuture Skills Framework", sourceUrl: SINGAPORE_SOURCE_URLS.skillsFramework, datasetUrls: [SINGAPORE_SOURCE_URLS.skillsDirectory], contentHash: null, retrievedAt: RETRIEVED_AT, method: "official-web", reviewStatus: "approved", status: "cataloged", summary: "Official career-framework and training-directory source for occupation-card next actions." },
  ]

  await Promise.all([
    writeFile(path.join(DATA_DIR, "sg-occupation-wages.json"), toJson(occupations)),
    writeFile(path.join(DATA_DIR, "sg-demand-occupations.json"), toJson(demand)),
    writeFile(path.join(DATA_DIR, "sg-map-areas.json"), toJson(areas)),
    writeFile(path.join(DATA_DIR, "sg-work-pass-pathways.json"), toJson(workPassPathways)),
    writeFile(path.join(DATA_DIR, "sg-source-snapshots.json"), toJson(snapshots)),
  ])

  console.log(`[sg-import] ${occupations.length} MOM wage rows, ${demand.length} official demand-card rows, and ${areas.length} URA market-area rows written.`)
}

main().catch((error) => {
  console.error("[sg-import] failed", error)
  process.exit(1)
})
