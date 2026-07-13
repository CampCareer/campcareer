import occupationsRaw from "@/data/se-occupations.json"
import regionsRaw from "@/data/se-regions.json"
import citiesRaw from "@/data/se-cities.json"
import universitiesRaw from "@/data/se-universities.json"
import snapshotsRaw from "@/data/se-source-snapshots.json"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export type SEReviewStatus = "approved" | "review-required"

export type SEOccupation = {
  ssykCode: string
  nameEn: string
  nameKo: string
  medianSalarySek: number
  employmentThousands: number
  shortageRating: number
  regionCodes: string[]
  relatedField: string
  sourceYear: string
  reviewStatus: SEReviewStatus
}

export type SERegion = {
  code: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: {
    monthlySek: number
    weeklySek: number
    period: string
    definition: string
    status: "available" | "unavailable"
  }
  topShortage: string[]
  lastChecked: string
  reviewStatus: SEReviewStatus
}

export type SECity = {
  code: string
  regionCode: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: { monthlySek: number | null; status: "available" | "unavailable" }
  lastChecked: string
  reviewStatus: SEReviewStatus
}

export type SEUniversity = {
  country: "SE"
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
  reviewStatus: SEReviewStatus
  relatedFields: string[]
}

export const SE_OCCUPATIONS = occupationsRaw as SEOccupation[]
export const SE_REGIONS = regionsRaw as SERegion[]
export const SE_CITIES = citiesRaw as SECity[]
export const SE_UNIVERSITIES = universitiesRaw as SEUniversity[]
export const SE_SOURCE_SNAPSHOTS = snapshotsRaw as Array<{
  category: string
  sourceName: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: SEReviewStatus
}>

export const SE_OCCUPATION_BY_CODE = new Map(SE_OCCUPATIONS.map((item) => [item.ssykCode, item]))

export const SE_SHORTAGE_BY_REGION = Object.fromEntries(
  SE_REGIONS.map((region) => [
    region.code,
    region.topShortage.map((code) => SE_OCCUPATION_BY_CODE.get(code)).filter(Boolean) as SEOccupation[],
  ]),
) as Record<string, SEOccupation[]>

export const SE_HIGH_PAY_BY_REGION = Object.fromEntries(
  SE_REGIONS.map((region) => [
    region.code,
    SE_OCCUPATIONS.filter((occ) => occ.regionCodes.includes(region.code))
      .sort((a, b) => b.medianSalarySek - a.medianSalarySek)
      .slice(0, 10),
  ]),
) as Record<string, SEOccupation[]>

export function getSERegion(value: string): SERegion | null {
  return SE_REGIONS.find((item) => item.code === value || item.slug === value) ?? null
}

export function getSEOccupation(value: string): SEOccupation | null {
  return SE_OCCUPATIONS.find((item) => item.ssykCode === value) ?? null
}

export function isSEOccupationIndexable(item: SEOccupation): boolean {
  return isCountrySearchIndexable("SE") && item.reviewStatus === "approved" && Boolean(item.nameEn && item.nameKo && item.regionCodes.length > 0)
}

export function isSERegionIndexable(item: SERegion): boolean {
  return isCountrySearchIndexable("SE") && item.reviewStatus === "approved" && Boolean(item.rent.monthlySek && item.lastChecked)
}

export function isSECityIndexable(item: SECity): boolean {
  return isCountrySearchIndexable("SE") && item.reviewStatus === "approved" && Number.isFinite(item.lat) && Number.isFinite(item.lng)
}

export function seJobSearchUrl(occupation: Pick<SEOccupation, "nameEn">, region?: SERegion | null): string {
  const params = new URLSearchParams({ q: [occupation.nameEn, region?.nameEn].filter(Boolean).join(" ") })
  return `https://arbetsformedlingen.se/platsbanken/annonser?${params.toString()}`
}
