import occupationsRaw from "@/data/no-occupations.json"
import regionsRaw from "@/data/no-regions.json"
import citiesRaw from "@/data/no-cities.json"
import universitiesRaw from "@/data/no-universities.json"
import snapshotsRaw from "@/data/no-source-snapshots.json"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export type NOReviewStatus = "approved" | "review-required"

export type NOOccupation = {
  stykrCode: string
  nameEn: string
  nameKo: string
  medianSalaryNok: number
  employmentThousands: number
  shortageRating: number
  regionCodes: string[]
  relatedField: string
  sourceYear: string
  reviewStatus: NOReviewStatus
}

export type NORegion = {
  code: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: {
    monthlyNok: number
    weeklyNok: number
    period: string
    definition: string
    status: "available" | "unavailable"
  }
  topShortage: string[]
  lastChecked: string
  reviewStatus: NOReviewStatus
}

export type NOCity = {
  code: string
  regionCode: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: { monthlyNok: number | null; status: "available" | "unavailable" }
  lastChecked: string
  reviewStatus: NOReviewStatus
}

export type NOUniversity = {
  country: "NO"
  slug: string
  nameEn: string
  nameKo: string
  institutionType: string
  officialUrl: string
  cityName: string
  regionCode: string
  lat: number
  lng: number
  worldRanking: number | null
  sourceUrl: string
  lastChecked: string
  reviewStatus: NOReviewStatus
  relatedFields: string[]
}

export const NO_OCCUPATIONS = occupationsRaw as NOOccupation[]
export const NO_REGIONS = regionsRaw as NORegion[]
export const NO_CITIES = citiesRaw as NOCity[]
export const NO_UNIVERSITIES = universitiesRaw as NOUniversity[]
export const NO_SOURCE_SNAPSHOTS = snapshotsRaw as Array<{
  category: string
  sourceName: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: NOReviewStatus
}>

export const NO_OCCUPATION_BY_CODE = new Map(NO_OCCUPATIONS.map((item) => [item.stykrCode, item]))

export const NO_SHORTAGE_BY_REGION = Object.fromEntries(
  NO_REGIONS.map((region) => [
    region.code,
    region.topShortage.map((code) => NO_OCCUPATION_BY_CODE.get(code)).filter(Boolean) as NOOccupation[],
  ]),
) as Record<string, NOOccupation[]>

export const NO_HIGH_PAY_BY_REGION = Object.fromEntries(
  NO_REGIONS.map((region) => [
    region.code,
    NO_OCCUPATIONS.filter((occ) => occ.regionCodes.includes(region.code))
      .sort((a, b) => b.medianSalaryNok - a.medianSalaryNok)
      .slice(0, 10),
  ]),
) as Record<string, NOOccupation[]>

export function getNORegion(value: string): NORegion | null {
  return NO_REGIONS.find((item) => item.code === value || item.slug === value) ?? null
}

export function getNOOccupation(value: string): NOOccupation | null {
  return NO_OCCUPATIONS.find((item) => item.stykrCode === value) ?? null
}

export function isNOOccupationIndexable(item: NOOccupation): boolean {
  return isCountrySearchIndexable("NO") && item.reviewStatus === "approved" && Boolean(item.nameEn && item.nameKo && item.regionCodes.length > 0)
}

export function isNORegionIndexable(item: NORegion): boolean {
  return isCountrySearchIndexable("NO") && item.reviewStatus === "approved" && Boolean(item.rent.monthlyNok && item.lastChecked)
}

export function isNOCityIndexable(item: NOCity): boolean {
  return isCountrySearchIndexable("NO") && item.reviewStatus === "approved" && Number.isFinite(item.lat) && Number.isFinite(item.lng)
}

export function noJobSearchUrl(occupation: Pick<NOOccupation, "nameEn">, region?: NORegion | null): string {
  const params = new URLSearchParams({ q: [occupation.nameEn, region?.nameEn].filter(Boolean).join(" ") })
  return `https://www.finn.no/job/fulltime/search.html?${params.toString()}`
}
