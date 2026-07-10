import { createHash } from "crypto"
import * as XLSX from "xlsx"

export const SINGAPORE_SOURCE_URLS = {
  occupationalWages: "https://stats.mom.gov.sg/iMAS_Tables1/Wages/Wages_2025/mrsd_2025Wages_table1.xlsx",
  jobVacancies: "https://stats.mom.gov.sg/iMAS_PdfLibrary/mrsd_JV2025.pdf",
  jobVacancyReport: "https://stats.mom.gov.sg/Pages/Job-Vacancies-2025.aspx",
  uraRent: "https://www.ura.gov.sg/-/media/Corporate/Media-Room/2026/Apr/pr26-31a-2.pdf",
  uraRentRelease: "https://www.ura.gov.sg/news/media/pr26-31/",
  compassSol: "https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility/compass-c5-skills-bonus-shortage-occupation-list-sol",
  employmentPass: "https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility",
  sPass: "https://www.mom.gov.sg/passes-and-permits/s-pass/eligibility",
  studentsPass: "https://www.ica.gov.sg/reside/STP/apply?pageid=325&secid=182",
  skillsFramework: "https://www.skillsfuture.gov.sg/skills-framework/skills-frameworks-faq",
  skillsDirectory: "https://www.myskillsfuture.gov.sg/content/portal/en/portal-search/portal-search.html",
  graduateOutcomes: "https://www.moe.gov.sg/news/press-releases",
} as const

export type SingaporeWageRow = {
  ssocCode: string
  nameEn: string
  medianBasicWageSgd: number
  medianGrossWageSgd: number
}

export type SingaporeDemandSeed = {
  sourceCode: string
  category: "PMET" | "Non-PMET"
  rank: number
  nameEn: string
  nameKo: string
  offeredWageLowSgd: number
  offeredWageHighSgd: number
  commonQualification: string
  commonExperience: string
  skills: string[]
  ssocCode: string | null
}

// These rows are transcribed from MOM Job Vacancies 2025 tables 3 and 4. The
// report publishes them as the only occupation-level demand list with matching
// skills, indicative offer ranges, qualification and experience context.
export const SINGAPORE_DEMAND_SEEDS: SingaporeDemandSeed[] = [
  { sourceCode: "mom-jv-2025-pmet-01", category: "PMET", rank: 1, nameEn: "Teaching & Training Professional", nameKo: "교육 및 훈련 전문가", offeredWageLowSgd: 2661, offeredWageHighSgd: 8580, commonQualification: "Diploma & professional qualification", commonExperience: "Job specific", skills: ["Instructing", "Speaking", "Learning strategies"], ssocCode: null },
  { sourceCode: "mom-jv-2025-pmet-02", category: "PMET", rank: 2, nameEn: "Commercial & Marketing Sales Executive", nameKo: "상업 및 마케팅 영업 임원", offeredWageLowSgd: 3000, offeredWageHighSgd: 4350, commonQualification: "Diploma & professional qualification", commonExperience: "Job specific", skills: ["Persuasion", "Speaking", "Coordination"], ssocCode: null },
  { sourceCode: "mom-jv-2025-pmet-03", category: "PMET", rank: 3, nameEn: "Software, Web, Multimedia & Games Developer & Designer", nameKo: "소프트웨어·웹·멀티미디어·게임 개발자 및 디자이너", offeredWageLowSgd: 7000, offeredWageHighSgd: 10000, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Programming", "Critical thinking", "Complex problem solving"], ssocCode: "25121" },
  { sourceCode: "mom-jv-2025-pmet-04", category: "PMET", rank: 4, nameEn: "Policy & Planning Manager", nameKo: "정책 및 기획 관리자", offeredWageLowSgd: 4800, offeredWageHighSgd: 9700, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Complex problem solving", "Judgment and decision making", "Systems analysis"], ssocCode: "12131" },
  { sourceCode: "mom-jv-2025-pmet-05", category: "PMET", rank: 5, nameEn: "Electronics Engineer", nameKo: "전자 엔지니어", offeredWageLowSgd: 5000, offeredWageHighSgd: 8000, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Complex problem solving", "Operations analysis", "Systems evaluation"], ssocCode: "21521" },
  { sourceCode: "mom-jv-2025-pmet-06", category: "PMET", rank: 6, nameEn: "Civil Engineer", nameKo: "토목 엔지니어", offeredWageLowSgd: 3500, offeredWageHighSgd: 5500, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Complex problem solving", "Critical thinking", "Operations analysis"], ssocCode: "21421" },
  { sourceCode: "mom-jv-2025-pmet-07", category: "PMET", rank: 7, nameEn: "Industrial & Production Engineer", nameKo: "산업 및 생산 엔지니어", offeredWageLowSgd: 4200, offeredWageHighSgd: 6775, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Reading comprehension", "Complex problem solving", "Speaking"], ssocCode: "21412" },
  { sourceCode: "mom-jv-2025-pmet-08", category: "PMET", rank: 8, nameEn: "Accountant", nameKo: "회계사", offeredWageLowSgd: 4550, offeredWageHighSgd: 6700, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Mathematics", "Critical thinking", "Reading comprehension"], ssocCode: "24111" },
  { sourceCode: "mom-jv-2025-pmet-09", category: "PMET", rank: 9, nameEn: "Systems Analyst", nameKo: "시스템 분석가", offeredWageLowSgd: 6000, offeredWageHighSgd: 9700, commonQualification: "Degree", commonExperience: "Job specific", skills: ["Systems analysis", "Systems evaluation", "Complex problem solving"], ssocCode: "25111" },
  { sourceCode: "mom-jv-2025-pmet-10", category: "PMET", rank: 10, nameEn: "Financial & Investment Adviser", nameKo: "금융 및 투자 자문가", offeredWageLowSgd: 7500, offeredWageHighSgd: 12000, commonQualification: "Diploma & professional qualification", commonExperience: "Industry specific", skills: ["Judgment and decision making", "Critical thinking", "Persuasion"], ssocCode: "24121" },
  { sourceCode: "mom-jv-2025-non-pmet-01", category: "Non-PMET", rank: 1, nameEn: "Construction Labourer", nameKo: "건설 노동자", offeredWageLowSgd: 800, offeredWageHighSgd: 1500, commonQualification: "Secondary and below", commonExperience: "Job specific", skills: ["Operations monitoring", "Coordination", "Operation and control"], ssocCode: "93100" },
  { sourceCode: "mom-jv-2025-non-pmet-02", category: "Non-PMET", rank: 2, nameEn: "Waiter", nameKo: "웨이터", offeredWageLowSgd: 2200, offeredWageHighSgd: 2669, commonQualification: "Secondary and below", commonExperience: "No work experience", skills: ["Speaking", "Service orientation", "Social perceptiveness"], ssocCode: "51312" },
  { sourceCode: "mom-jv-2025-non-pmet-03", category: "Non-PMET", rank: 3, nameEn: "Shop Sales Assistant", nameKo: "매장 판매 보조원", offeredWageLowSgd: 2305, offeredWageHighSgd: 2600, commonQualification: "Secondary and below", commonExperience: "No work experience", skills: ["Persuasion", "Speaking", "Service orientation"], ssocCode: "52202" },
  { sourceCode: "mom-jv-2025-non-pmet-04", category: "Non-PMET", rank: 4, nameEn: "Cleaner", nameKo: "청소원", offeredWageLowSgd: 1910, offeredWageHighSgd: 2310, commonQualification: "Secondary and below", commonExperience: "No work experience", skills: ["Speaking"], ssocCode: null },
  { sourceCode: "mom-jv-2025-non-pmet-05", category: "Non-PMET", rank: 5, nameEn: "Receptionist, Customer Service & Information Clerk", nameKo: "접수·고객서비스·안내 사무원", offeredWageLowSgd: 2300, offeredWageHighSgd: 3000, commonQualification: "Secondary and below", commonExperience: "Job specific", skills: ["Reading comprehension", "Speaking", "Service orientation"], ssocCode: null },
  { sourceCode: "mom-jv-2025-non-pmet-06", category: "Non-PMET", rank: 6, nameEn: "Security Guard", nameKo: "보안 요원", offeredWageLowSgd: 2870, offeredWageHighSgd: 3000, commonQualification: "Secondary and below", commonExperience: "No work experience", skills: ["Speaking", "Monitoring", "Coordination"], ssocCode: "54144" },
  { sourceCode: "mom-jv-2025-non-pmet-07", category: "Non-PMET", rank: 7, nameEn: "Heavy Truck & Lorry Driver", nameKo: "대형 트럭 및 화물차 운전기사", offeredWageLowSgd: 2600, offeredWageHighSgd: 3500, commonQualification: "Secondary and below", commonExperience: "Job specific", skills: ["Operation and control", "Operation monitoring", "Monitoring"], ssocCode: "83321" },
  { sourceCode: "mom-jv-2025-non-pmet-08", category: "Non-PMET", rank: 8, nameEn: "Material & Freight Handling Worker", nameKo: "자재 및 화물 취급 작업자", offeredWageLowSgd: 1800, offeredWageHighSgd: 2450, commonQualification: "Secondary and below", commonExperience: "No work experience", skills: ["Coordination"], ssocCode: null },
  { sourceCode: "mom-jv-2025-non-pmet-09", category: "Non-PMET", rank: 9, nameEn: "General Office Clerk", nameKo: "일반 사무원", offeredWageLowSgd: 2000, offeredWageHighSgd: 3000, commonQualification: "Secondary and below", commonExperience: "Job specific", skills: ["Speaking", "Writing", "Reading comprehension"], ssocCode: null },
  { sourceCode: "mom-jv-2025-non-pmet-10", category: "Non-PMET", rank: 10, nameEn: "Kitchen Assistant", nameKo: "주방 보조원", offeredWageLowSgd: 2155, offeredWageHighSgd: 2500, commonQualification: "Secondary and below", commonExperience: "No work experience", skills: ["Service orientation", "Time management"], ssocCode: "94101" },
]

export function sha256(body: Uint8Array | string) {
  return createHash("sha256").update(body).digest("hex")
}

export function percentileScore(value: number, population: number[]) {
  const ordered = [...population].filter(Number.isFinite).sort((a, b) => a - b)
  if (ordered.length === 0) return null
  const lowerOrEqual = ordered.filter((candidate) => candidate <= value).length
  return Math.max(1, Math.min(100, Math.round((lowerOrEqual / ordered.length) * 100)))
}

export function parseOccupationalWages(body: Uint8Array): SingaporeWageRow[] {
  const workbook = XLSX.read(body, { type: "buffer" })
  const sheet = workbook.Sheets.T1
  if (!sheet) throw new Error("Missing T1 sheet in MOM occupational wages workbook.")
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null })
  return rows.flatMap((row) => {
    const ssocCode = row[1]
    const nameEn = row[2]
    const medianBasicWageSgd = row[3]
    const medianGrossWageSgd = row[4]
    if ((typeof ssocCode !== "string" && typeof ssocCode !== "number") || typeof nameEn !== "string" || typeof medianBasicWageSgd !== "number" || typeof medianGrossWageSgd !== "number") return []
    const code = String(ssocCode).trim()
    if (!/^\d{5}$/.test(code) || medianBasicWageSgd <= 0 || medianGrossWageSgd <= 0) return []
    return [{
      ssocCode: code,
      nameEn: nameEn.replace(/\s+/g, " ").trim(),
      medianBasicWageSgd,
      medianGrossWageSgd,
    }]
  })
}
