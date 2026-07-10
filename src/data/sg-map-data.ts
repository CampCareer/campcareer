import demandRaw from "@/data/sg-demand-occupations.json"
import areasRaw from "@/data/sg-map-areas.json"
import wagesRaw from "@/data/sg-occupation-wages.json"
import pathwaysRaw from "@/data/sg-work-pass-pathways.json"

export type SingaporeDemandOccupation = {
  country: "SG"
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
  geography: string
  statisticPeriod: string
  shortageScore: number
  shortageDefinition: string
  sourceUrl: string
  datasetUrl: string
  retrievedAt: string
  lastChecked: string
  confidence: "official"
  method: "official-download"
  reviewStatus: "approved"
}

export type SingaporeWageOccupation = {
  country: "SG"
  ssocCode: string
  localName: string
  nameEn: string
  nameKo: string | null
  occupationClassification: "SSOC 2024"
  geography: string
  statisticPeriod: string
  medianBasicWageSgd: number
  medianGrossWageSgd: number
  salaryScore: number
  sourceUrl: string
  retrievedAt: string
  lastChecked: string
  confidence: "official"
  method: "official-download"
  reviewStatus: "approved"
}

export type SingaporeMapArea = {
  country: "SG"
  code: string
  nameEn: string
  nameKo: string
  areaType: "macro-region" | "employment-district"
  uraSegment: "CCR" | "RCR" | "OCR"
  rentalIndex: number
  rentalChangePct: number
  focus: string
  rentMetric: string
  statisticPeriod: string
  sourceUrl: string
  datasetUrl: string
  retrievedAt: string
  lastChecked: string
  confidence: "official"
  method: "official-download"
  reviewStatus: "approved"
}

export type SingaporeWorkPassPathway = {
  code: "ep" | "spass" | "student-pass" | "compass-sol"
  name: string
  sourceUrl: string
  note: string
}

const allDemand = demandRaw as SingaporeDemandOccupation[]
const allWages = wagesRaw as SingaporeWageOccupation[]
const allAreas = areasRaw as SingaporeMapArea[]
const allPathways = pathwaysRaw as { country: "SG"; reviewStatus: "review-required"; lastChecked: string; pathways: SingaporeWorkPassPathway[] }

export const SG_DEMAND_OCCUPATIONS = [...allDemand].sort((a, b) => a.category.localeCompare(b.category) || a.rank - b.rank)
export const SG_HIGH_PAY_OCCUPATIONS = [...allWages]
  .sort((a, b) => b.medianGrossWageSgd - a.medianGrossWageSgd)
  .slice(0, 30)
export const SG_MAP_AREAS = [...allAreas]
export const SG_WORK_PASS_PATHWAYS = allPathways

export function getSingaporeDemandOccupation(sourceCode: string) {
  return SG_DEMAND_OCCUPATIONS.find((occupation) => occupation.sourceCode === sourceCode) ?? null
}

export function getSingaporeCareerLinks(occupation: Pick<SingaporeDemandOccupation, "nameEn">) {
  const query = encodeURIComponent(occupation.nameEn)
  return {
    jobSearch: `https://www.mycareersfuture.gov.sg/search?search=${query}`,
    skillsFramework: "https://www.skillsfuture.gov.sg/skills-framework",
    learningPathways: "https://www.skillsfuture.gov.sg/initiatives/individuals",
    careersFinder: "https://careersfinder.mycareersfuture.gov.sg/",
    wageSource: "https://stats.mom.gov.sg/Pages/Occupational-Wages-Data-and-Other-Resources.aspx",
  }
}
