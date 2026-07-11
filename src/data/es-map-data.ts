import citiesRaw from "@/data/es-cities.json"
import communitiesRaw from "@/data/es-communities.json"
import occupationsRaw from "@/data/es-shortage-occupations.json"
import provincesRaw from "@/data/es-provinces.json"
import salariesRaw from "@/data/es-salary-groups.json"
import snapshotsRaw from "@/data/es-source-snapshots.json"
import pathwaysRaw from "@/data/es-study-to-work-pathways.json"
import universitiesRaw from "@/data/es-universities.json"

export type SpainReviewStatus = "approved" | "review-required"
export type SpainOccupation = { code: string; localName: string; nameEn: string | null; nameKo: string | null; provinceCodes: string[]; communityCodes: string[]; studyFields: string[]; salaryGroupCode: string | null; sourceQuarter: string; reviewStatus: SpainReviewStatus }
export type SpainCommunity = { code: string; nameEs: string; nameEn: string; nameKo: string; coOfficialLanguage: string | null; slug: string; rent: { eurM2: number | null; p25EurM2: number | null; p75EurM2: number | null; monthlyEur: number | null; period: string; definition: string; status: "available" | "unavailable" }; topShortage: string[]; lastChecked: string; reviewStatus: SpainReviewStatus }
export type SpainProvince = { code: string; communityCode: string; nameEs: string; nameEn: string; nameKo: string | null; capital: string; slug: string; shortageCodes: string[]; foreignHiringSignal: "sepe-catalog-listed" | "not-listed"; sourceQuarter: string; lastChecked: string; reviewStatus: SpainReviewStatus }
export type SpainCity = { code: string; provinceCode: string; regionCode: string; nameEs: string; nameEn: string; nameKo: string | null; slug: string; lat: number; lng: number; rent: { eurM2: number | null; status: "unavailable" }; lastChecked: string; reviewStatus: SpainReviewStatus }
export type SpainSalaryGroup = { regionCode: string; cnoCode: string; annualGrossEur: number | null; regionalAnnualGrossEur: number | null; regionalWageFactor: number | null; definition: string; period: string; sourceUrl: string; lastChecked: string; reviewStatus: SpainReviewStatus }
export type SpainUniversity = { country: "ES"; ructCode: string; slug: string; nameEs: string; nameEn: string; nameKo: string | null; institutionType: string; officialUrl: string; cityName: string; provinceCode: string | null; regionCode: string; regionName: string; lat: number; lng: number; sourceUrl: string; lastChecked: string; reviewStatus: SpainReviewStatus; relatedFields: string[] }
export type SpainPathway = { code: string; titleEn: string; titleKo: string; summary: string; sourceUrl: string; reviewStatus: SpainReviewStatus }

export const ES_OCCUPATIONS = occupationsRaw as SpainOccupation[]
export const ES_COMMUNITIES = communitiesRaw as SpainCommunity[]
export const ES_PROVINCES = provincesRaw as SpainProvince[]
export const ES_CITIES = citiesRaw as SpainCity[]
export const ES_SALARY_GROUPS = salariesRaw as SpainSalaryGroup[]
export const ES_UNIVERSITIES = universitiesRaw as SpainUniversity[]
export const ES_SOURCE_SNAPSHOTS = snapshotsRaw as Array<{ category: string; sourceName: string; sourceUrl: string; lastChecked: string; reviewStatus: SpainReviewStatus }>
export const ES_STUDY_TO_WORK_PATHWAYS = pathwaysRaw as SpainPathway[]
export const ES_OCCUPATION_BY_CODE = new Map(ES_OCCUPATIONS.map((item) => [item.code, item]))
export const ES_SHORTAGE_BY_PROVINCE = Object.fromEntries(ES_PROVINCES.map((province) => [province.code, province.shortageCodes.map((code) => ES_OCCUPATION_BY_CODE.get(code)).filter(Boolean)])) as Record<string, SpainOccupation[]>
export const ES_SHORTAGE_BY_COMMUNITY = Object.fromEntries(ES_COMMUNITIES.map((community) => [community.code, community.topShortage.map((code) => ES_OCCUPATION_BY_CODE.get(code)).filter(Boolean)])) as Record<string, SpainOccupation[]>
export const ES_HIGH_PAY_BY_COMMUNITY = Object.fromEntries(ES_COMMUNITIES.map((community) => [community.code, ES_SALARY_GROUPS.filter((row) => row.regionCode === community.code).sort((left, right) => (right.regionalAnnualGrossEur ?? right.annualGrossEur ?? 0) - (left.regionalAnnualGrossEur ?? left.annualGrossEur ?? 0))])) as Record<string, SpainSalaryGroup[]>

export function getSpainCommunity(value: string) { return ES_COMMUNITIES.find((item) => item.code === value || item.slug === value) ?? null }
export function getSpainProvince(value: string) { return ES_PROVINCES.find((item) => item.code === value || item.slug === value) ?? null }
export function getSpainOccupation(value: string) { return ES_OCCUPATIONS.find((item) => item.code === value || item.code.replace(/\./g, "-") === value) ?? null }
export function isSpainOccupationIndexable(item: SpainOccupation) { return item.reviewStatus === "approved" && Boolean(item.nameEn && item.nameKo && item.provinceCodes.length > 0) }
export function isSpainCommunityIndexable(item: SpainCommunity) { return item.reviewStatus === "approved" && Boolean(item.rent.eurM2 && item.lastChecked) }
export function isSpainProvinceIndexable(item: SpainProvince) { return item.reviewStatus === "approved" && item.shortageCodes.length > 0 && Boolean(item.lastChecked) }
export function isSpainCityIndexable(item: SpainCity) { return item.reviewStatus === "approved" && Number.isFinite(item.lat) && Number.isFinite(item.lng) }
export function spainJobSearchUrl(occupation: Pick<SpainOccupation, "localName">, province?: SpainProvince | null) { return `https://www.empleate.gob.es/empleo/#/busqueda?search=${encodeURIComponent([occupation.localName, province?.nameEs].filter(Boolean).join(" "))}` }
