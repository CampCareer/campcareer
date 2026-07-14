import occupationsRaw from "@/data/ch-occupations.json"
import regionsRaw from "@/data/ch-regions.json"
import citiesRaw from "@/data/ch-cities.json"
import universitiesRaw from "@/data/ch-universities.json"
import snapshotsRaw from "@/data/ch-source-snapshots.json"

export type CHReviewStatus = "approved" | "review-required"

export type CHOccupationGroup = {
  chIscoCode: string
  nameEn: string
  nameKo: string
  medianMonthlyChf: number
  scope: "Switzerland-wide"
  sourceRowId: string
  sourceYear: string
  reviewStatus: CHReviewStatus
}

export type CHRegion = {
  code: string
  nameEn: string
  nameLocal: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  officialLanguages: string[]
  rent: {
    monthlyChf: number | null
    period: string | null
    definition: string
    status: "available" | "unavailable"
  }
  topShortage: string[]
  sourceRowId: string
  lastChecked: string
  reviewStatus: CHReviewStatus
}

export type CHCity = {
  code: string
  cantonCode: string
  nameEn: string
  nameLocal: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  sourceRowId: string
  lastChecked: string
  reviewStatus: CHReviewStatus
}

export type CHUniversity = {
  country: "CH"
  slug: string
  nameEn: string
  nameKo: string
  institutionType: "University" | "University of Applied Sciences" | "University of Teacher Education"
  officialUrl: string
  cityName: string
  cantonCode: string
  lat: number
  lng: number
  sourceRowId: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: CHReviewStatus
  internationalStudentAvailability: "Not verified"
}

export const CH_OCCUPATION_GROUPS = occupationsRaw as CHOccupationGroup[]
export const CH_REGIONS = regionsRaw as CHRegion[]
export const CH_CITIES = citiesRaw as CHCity[]
export const CH_UNIVERSITIES = universitiesRaw as CHUniversity[]
export const CH_SOURCE_SNAPSHOTS = snapshotsRaw as Array<{
  category: string
  sourceName: string
  sourceUrl: string
  datasetUrls: string[]
  contentHash: string
  retrievedAt: string
  lastChecked: string
  method: string
  licenseStatus: string
  reviewStatus: CHReviewStatus
  status: string
}>

export const CH_OCCUPATION_BY_CODE = new Map(CH_OCCUPATION_GROUPS.map((row) => [row.chIscoCode, row]))

// The FSO table is Switzerland-wide. Repeating a national result across a
// canton selection would falsely imply a canton salary. The panel uses this
// dedicated national collection and explicitly names its scope.
export const CH_HIGH_PAY_NATIONAL = [...CH_OCCUPATION_GROUPS]
  .sort((a, b) => b.medianMonthlyChf - a.medianMonthlyChf)

export const CH_SHORTAGE_BY_CANTON: Record<string, CHOccupationGroup[]> = Object.fromEntries(
  CH_REGIONS.map((region) => [region.code, []]),
)

export function getCHRegion(value: string): CHRegion | null {
  return CH_REGIONS.find((region) => region.code === value || region.slug === value) ?? null
}
