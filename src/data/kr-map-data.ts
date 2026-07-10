import occupationsRaw from "@/data/kr-occupations.json"
import regionsRaw from "@/data/kr-regions.json"
import sourceSnapshotsRaw from "@/data/kr-source-snapshots.json"
import universitiesRaw from "@/data/kr-universities.json"

export type KoreaReviewStatus = "approved" | "review-required" | "blocked"

export type KoreaSourceSnapshot = {
  sourceCode: string
  sourceName: string
  sourceUrl: string
  datasetUrl: string | null
  retrievedAt: string | null
  lastChecked: string
  contentHash: string | null
  method: "official-api" | "official-download" | "official-web"
  licenseStatus: "commercial-allowed" | "pending-verification" | "restricted"
  commercialUseAllowed: boolean
  reviewStatus: KoreaReviewStatus
  status: "cataloged" | "ingested" | "blocked"
  note: string
}

export type KoreaRent = {
  apartmentSizeSqm: "40-85"
  period: string | null
  sampleCount: number | null
  monthlyDepositKrw: number | null
  monthlyRentKrw: number | null
  jeonseDepositKrw: number | null
  sourceCode: string
  status: "available" | "insufficient-sample" | "pending"
}

export type KoreaPromisingIndustry = {
  nameKo: string
  nameEn: string | null
  employmentGrowthPct: number | null
  vacancySignal: number | null
  specializationSignal: number | null
  sourceCodes: string[]
}

export type KoreaRegion = {
  country: "KR"
  code: string
  nameKo: string
  nameEn: string
  level: "sido"
  rent: KoreaRent
  promisingIndustries: KoreaPromisingIndustry[]
  sourceCodes: string[]
  retrievedAt: string | null
  lastChecked: string
  confidence: "official" | "estimated"
  method: "official-api" | "official-download" | "official-web"
  reviewStatus: KoreaReviewStatus
}

export type KoreaOccupation = {
  country: "KR"
  kscoCode: string
  localName: string
  nameKo: string
  nameEn: string | null
  englishReviewStatus: "human-reviewed" | "machine-draft" | "unknown"
  regionCode: string
  demandKind: "official-shortage" | "hiring-demand"
  demandScore: number | null
  demandDefinition: string
  monthlyWageKrw: number | null
  annualWageKrw: number | null
  wageKind: "official-regional-wage" | "estimated-national-times-regional-factor"
  wageFormula: string | null
  relatedMajors: string[]
  careerNetStatus: "available" | "official-connection-unavailable" | "pending-api"
  coreSkills: string[]
  sourceCodes: string[]
  retrievedAt: string | null
  lastChecked: string
  confidence: "official" | "estimated"
  method: "official-api" | "official-download"
  reviewStatus: KoreaReviewStatus
  commercialUseAllowed: boolean
}

export type KoreaUniversity = {
  country: "KR"
  slug: string
  nameKo: string
  nameEn: string
  regionCode: string
  cityName: string
  lat: number
  lng: number
  qsRank2027: number
  qsRankSourceUrl: string
  officialUrl: string
  averageTuitionKrw: number | null
  tuitionSourceUrl: string | null
  graduateOutcomeUrl: string | null
  coordinateStatus: "review-required" | "approved"
  reviewStatus: KoreaReviewStatus
}

const occupations = occupationsRaw as KoreaOccupation[]
const regions = regionsRaw as KoreaRegion[]
const sourceSnapshots = sourceSnapshotsRaw as KoreaSourceSnapshot[]
const universities = universitiesRaw as KoreaUniversity[]

export const KR_OCCUPATIONS = occupations
export const KR_REGIONS = regions
export const KR_SOURCE_SNAPSHOTS = sourceSnapshots
export const KR_UNIVERSITIES = universities

export const KR_OCCUPATIONS_BY_REGION = Object.fromEntries(
  regions.map((region) => [
    region.code,
    occupations
      .filter((occupation) => occupation.regionCode === region.code)
      .sort((a, b) => (b.demandScore ?? 0) - (a.demandScore ?? 0)),
  ]),
) as Record<string, KoreaOccupation[]>

export const KR_HIGH_PAY_BY_REGION = Object.fromEntries(
  regions.map((region) => [
    region.code,
    occupations
      .filter((occupation) => occupation.regionCode === region.code && occupation.monthlyWageKrw != null)
      .sort((a, b) => (b.monthlyWageKrw ?? 0) - (a.monthlyWageKrw ?? 0)),
  ]),
) as Record<string, KoreaOccupation[]>

export function getKoreaRegion(code: string) {
  return KR_REGIONS.find((region) => region.code === code) ?? null
}

export function getKoreaOccupation(code: string) {
  return KR_OCCUPATIONS.find((occupation) => occupation.kscoCode === code) ?? null
}

export function isKoreaOccupationIndexable(occupation: KoreaOccupation) {
  return occupation.reviewStatus === "approved"
    && occupation.commercialUseAllowed
    && Boolean(occupation.kscoCode && occupation.nameKo && occupation.regionCode)
    && occupation.monthlyWageKrw != null
    && occupation.demandScore != null
    && occupation.sourceCodes.length > 0
    && Boolean(occupation.lastChecked)
}

export function isKoreaRegionIndexable(region: KoreaRegion) {
  const rentReady = region.rent.status === "available"
    ? region.rent.monthlyDepositKrw != null && region.rent.monthlyRentKrw != null && region.rent.jeonseDepositKrw != null
    : region.rent.status === "insufficient-sample"
  return region.reviewStatus === "approved" && rentReady && region.sourceCodes.length > 0
}

export function koreaJobSearchLinks(occupation: Pick<KoreaOccupation, "nameKo" | "regionCode">) {
  const region = getKoreaRegion(occupation.regionCode)
  const query = encodeURIComponent(`${occupation.nameKo} ${region?.nameKo ?? ""}`.trim())
  return {
    jobKorea: `https://www.jobkorea.co.kr/Search/?stext=${query}`,
    // Work24 does not grant CampCareer permission to store or rank its listings.
    // Keep this as a user-initiated external search only.
    work24: `https://www.work24.go.kr/cm/main.do?query=${query}`,
  }
}
