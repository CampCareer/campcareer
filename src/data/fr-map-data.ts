import citiesRaw from "@/data/fr-cities.json"
import demandRaw from "@/data/fr-demand-occupations.json"
import regionsRaw from "@/data/fr-regions.json"
import salaryRaw from "@/data/fr-salary-groups.json"
import snapshotsRaw from "@/data/fr-source-snapshots.json"
import universitiesRaw from "@/data/fr-universities.json"

export type FranceReviewStatus = "approved" | "review-required"

export type FranceDemandOccupation = {
  localName: string
  nameEn: string | null
  nameKo: string | null
  bmoCode: string
  recruitmentProjects: number
  recruitmentDifficultyPct: number | null
  seasonalPct: number | null
  demandScore: number
  reviewStatus: FranceReviewStatus
}

export type FranceDemandRef = { code: string; recruitmentProjects: number }

export type FranceRegion = {
  code: string
  nameFr: string
  nameEn: string
  nameKo: string | null
  slug: string
  geometrySource: string
  lastChecked: string
  reviewStatus: FranceReviewStatus
  topDemand: FranceDemandRef[]
  rent: {
    advertisedRentEurM2: number | null
    cityCoverage: number
    sourceCityCount: number
    status: "internal-estimate" | "unavailable"
  }
}

export type FranceCity = {
  code: string
  nameFr: string
  nameEn: string
  nameKo: string | null
  slug: string
  regionCode: string
  population: number
  studentCount: number | null
  basinName: string
  topDemand: FranceDemandRef[]
  rent: {
    advertisedRentEurM2: number | null
    observationCount: number | null
    r2Adjusted: number | null
    lowerEurM2: number | null
    upperEurM2: number | null
    predictionType: string | null
    statisticPeriod: string
    status: "available" | "quality-warning" | "unavailable"
  }
  lastChecked: string
  reviewStatus: FranceReviewStatus
}

export type FranceSalaryGroup = {
  regionCode: string
  pcsCode: "1T3" | "4" | "5" | "6"
  monthlyNetEur: number
  definition: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: FranceReviewStatus
}

export type FranceUniversity = {
  country: "FR"
  slug: string
  nameFr: string
  nameEn: string
  institutionType: string
  officialUrl: string
  cityName: string
  communeCode: string
  regionCode: string
  regionName: string
  lat: number
  lng: number
  studentCount: number | null
  sourceUrl: string
  lastChecked: string
  reviewStatus: FranceReviewStatus
  qsRank2027?: number
  qsRankSourceUrl?: string
}

export type FranceSourceSnapshot = {
  category: string
  sourceName: string
  sourceUrl: string
  datasetUrls: string[]
  contentHash: string
  retrievedAt: string
  lastChecked: string
  method: string
  licenseStatus: string
  reviewStatus: FranceReviewStatus
  status: string
}

export const FR_PCS_LABELS: Record<FranceSalaryGroup["pcsCode"], { nameFr: string; nameEn: string; nameKo: string }> = {
  "1T3": { nameFr: "Cadres et professions intellectuelles supérieures", nameEn: "Managers and higher intellectual professions", nameKo: "관리자 및 고등 전문직" },
  "4": { nameFr: "Professions intermédiaires", nameEn: "Associate professionals", nameKo: "중간 전문직" },
  "5": { nameFr: "Employés", nameEn: "Employees", nameKo: "사무·서비스 직원" },
  "6": { nameFr: "Ouvriers", nameEn: "Manual workers", nameKo: "생산·현장 노동자" },
}

export const FR_DEMAND_OCCUPATIONS = demandRaw as FranceDemandOccupation[]
export const FR_REGIONS = regionsRaw as FranceRegion[]
export const FR_CITIES = citiesRaw as FranceCity[]
export const FR_SALARY_GROUPS = salaryRaw as FranceSalaryGroup[]
// QS is kept as a small, cited overlay rather than copied from the full ranking
// dataset. Only institutions that can be matched unambiguously to the public
// MESR institution record are annotated.
const FR_QS_RANK_2027: Record<string, { rank: number; sourceUrl: string }> = {
  "universite-paris-cite-5czyu": { rank: 303, sourceUrl: "https://www.topuniversities.com/universities/universite-paris-cite" },
  "universite-paris-saclay-g2qa7": { rank: 76, sourceUrl: "https://www.topuniversities.com/universities/universite-paris-saclay" },
  "institut-polytechnique-de-paris-kyr50": { rank: 43, sourceUrl: "https://www.topuniversities.com/universities/institut-polytechnique-de-paris" },
}

export const FR_UNIVERSITIES = (universitiesRaw as FranceUniversity[]).map((university) => {
  const ranking = FR_QS_RANK_2027[university.slug]
  return ranking ? { ...university, qsRank2027: ranking.rank, qsRankSourceUrl: ranking.sourceUrl } : university
})
export const FR_SOURCE_SNAPSHOTS = snapshotsRaw as FranceSourceSnapshot[]

export const FR_DEMAND_BY_CODE = new Map(FR_DEMAND_OCCUPATIONS.map((occupation) => [occupation.bmoCode, occupation]))
export const FR_DEMAND_BY_REGION = Object.fromEntries(FR_REGIONS.map((region) => [
  region.code,
  region.topDemand.map((reference) => ({ ...FR_DEMAND_BY_CODE.get(reference.code)!, regionalProjects: reference.recruitmentProjects })).filter(Boolean),
])) as Record<string, Array<FranceDemandOccupation & { regionalProjects: number }>>
export const FR_SALARY_BY_REGION = Object.fromEntries(FR_REGIONS.map((region) => [
  region.code,
  FR_SALARY_GROUPS.filter((salary) => salary.regionCode === region.code).sort((left, right) => right.monthlyNetEur - left.monthlyNetEur),
])) as Record<string, FranceSalaryGroup[]>

export function getFranceRegion(code: string) { return FR_REGIONS.find((region) => region.code === code) ?? null }
export function getFranceCity(codeOrSlug: string) { return FR_CITIES.find((city) => city.code === codeOrSlug || city.slug === codeOrSlug) ?? null }
export function getFranceDemandOccupation(codeOrSlug: string) {
  return FR_DEMAND_OCCUPATIONS.find((occupation) => occupation.bmoCode === codeOrSlug || occupation.bmoCode.replace(/^FAP2021-/, "") === codeOrSlug) ?? null
}
export function isFranceDemandOccupationIndexable(occupation: FranceDemandOccupation) {
  return occupation.reviewStatus === "approved" && Boolean(occupation.nameEn && occupation.nameKo && occupation.localName && occupation.recruitmentProjects > 0)
}
export function isFranceRegionIndexable(region: FranceRegion) {
  return region.reviewStatus === "approved" && region.topDemand.length >= 3 && Boolean(region.lastChecked)
}
export function isFranceCityIndexable(city: FranceCity) {
  return city.reviewStatus === "approved" && city.topDemand.length >= 3 && Boolean(city.basinName && city.lastChecked)
}

export function franceJobSearchUrl(occupation: Pick<FranceDemandOccupation, "localName">, city?: FranceCity | null) {
  const query = encodeURIComponent([occupation.localName, city?.nameFr].filter(Boolean).join(" "))
  return `https://www.francetravail.fr/recherche/offres/criteres?motsCles=${query}`
}
