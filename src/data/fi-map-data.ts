import occupationsRaw from "@/data/fi-occupations.json"
import regionsRaw from "@/data/fi-regions.json"
import citiesRaw from "@/data/fi-cities.json"
import universitiesRaw from "@/data/fi-universities.json"
import snapshotsRaw from "@/data/fi-source-snapshots.json"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export type FIReviewStatus = "approved" | "review-required"

export type FIOccupation = {
  iscoCode: string
  nameEn: string
  nameKo: string
  medianSalaryEur: number
  employmentThousands: number
  shortageRating: number
  regionCodes: string[]
  relatedField: string
  sourceYear: string
  reviewStatus: FIReviewStatus
}

export type FIRegion = {
  code: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: {
    monthlyEur: number
    weeklyEur: number
    period: string
    definition: string
    status: "available" | "unavailable"
  }
  topShortage: string[]
  lastChecked: string
  reviewStatus: FIReviewStatus
}

export type FICity = {
  code: string
  regionCode: string
  nameEn: string
  nameKo: string
  slug: string
  lat: number
  lng: number
  rent: { monthlyEur: number | null; status: "available" | "unavailable" }
  lastChecked: string
  reviewStatus: FIReviewStatus
}

export type FIUniversity = {
  country: "FI"
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
  reviewStatus: FIReviewStatus
  relatedFields: string[]
}

export const FI_OCCUPATIONS = occupationsRaw as FIOccupation[]
export const FI_REGIONS = regionsRaw as FIRegion[]
export const FI_CITIES = citiesRaw as FICity[]
export const FI_UNIVERSITIES = universitiesRaw as FIUniversity[]
export const FI_SOURCE_SNAPSHOTS = snapshotsRaw as Array<{
  category: string
  sourceName: string
  sourceUrl: string
  lastChecked: string
  reviewStatus: FIReviewStatus
}>

export const FI_OCCUPATION_BY_CODE = new Map(FI_OCCUPATIONS.map((item) => [item.iscoCode, item]))

export const FI_SHORTAGE_BY_REGION = Object.fromEntries(
  FI_REGIONS.map((region) => [
    region.code,
    region.topShortage.map((code) => FI_OCCUPATION_BY_CODE.get(code)).filter(Boolean) as FIOccupation[],
  ]),
) as Record<string, FIOccupation[]>

export const FI_HIGH_PAY_BY_REGION = Object.fromEntries(
  FI_REGIONS.map((region) => [
    region.code,
    FI_OCCUPATIONS.filter((occ) => occ.regionCodes.includes(region.code))
      .sort((a, b) => b.medianSalaryEur - a.medianSalaryEur)
      .slice(0, 10),
  ]),
) as Record<string, FIOccupation[]>

export function getFIRegion(value: string): FIRegion | null {
  return FI_REGIONS.find((item) => item.code === value || item.slug === value) ?? null
}

export function getFIOccupation(value: string): FIOccupation | null {
  return FI_OCCUPATIONS.find((item) => item.iscoCode === value) ?? null
}

export function isFIOccupationIndexable(item: FIOccupation): boolean {
  return isCountrySearchIndexable("FI") && item.reviewStatus === "approved" && Boolean(item.nameEn && item.nameKo && item.regionCodes.length > 0)
}

export function isFIRegionIndexable(item: FIRegion): boolean {
  return isCountrySearchIndexable("FI") && item.reviewStatus === "approved" && Boolean(item.rent.monthlyEur && item.lastChecked)
}

export function isFICityIndexable(item: FICity): boolean {
  return isCountrySearchIndexable("FI") && item.reviewStatus === "approved" && Number.isFinite(item.lat) && Number.isFinite(item.lng)
}

export function fiJobSearchUrl(occupation: Pick<FIOccupation, "nameEn">, region?: FIRegion | null): string {
  const params = new URLSearchParams({ q: [occupation.nameEn, region?.nameEn].filter(Boolean).join(" ") })
  return `https://tyopaikat.oikotie.fi/tyhaku?${params.toString()}`
}
