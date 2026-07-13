import { NZ_CITIES, NZ_REGIONS, NZ_UNIVERSITIES } from "@/data/nz-map-data"

export const NZ_MAP_V2_VERSION = "nz-map-v2-2026-07-13"

const SOURCE = {
  boundary: "https://datafinder.stats.govt.nz/layer/120946-regional-council-2025/",
  providers: "https://www.educationcounts.govt.nz/directories/list-of-tertiary-providers",
  rent: "https://www.tenancy.govt.nz/about-tenancy-services/data-and-statistics/",
  occupations: "https://datainfoplus.stats.govt.nz/item/nz.govt.stats/8996cd76-1d52-4fb8-8bb4-5ad2d9c76f10",
  pathways: "https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/green-list",
} as const

/** A public, safe-to-render bundle. Numeric seed data is intentionally absent. */
export function getNZMapV2Bundle() {
  return {
    version: NZ_MAP_V2_VERSION,
    country: "NZ" as const,
    boundaryUrl: "/nz-regions.geojson",
    regions: NZ_REGIONS.map(({ code, nameEn, nameKo, slug, lat, lng }) => ({
      code, nameEn, nameKo, slug, lat, lng,
      rent: { status: "REVIEW_REQUIRED" as const, sourceUrl: SOURCE.rent },
      occupations: { status: "REVIEW_REQUIRED" as const, sourceUrl: SOURCE.occupations },
    })),
    cities: NZ_CITIES.map(({ code, regionCode, nameEn, nameKo, slug, lat, lng }) => ({
      code, regionCode, nameEn, nameKo, slug, lat, lng,
    })),
    institutions: NZ_UNIVERSITIES.map((institution) => ({
      slug: institution.slug,
      name: institution.nameEn,
      nameKo: institution.nameKo,
      type: institution.institutionType,
      cityName: institution.cityName,
      regionCode: institution.regionCode,
      lat: institution.lat,
      lng: institution.lng,
      officialUrl: institution.officialUrl,
      internationalEligibility: "NOT_VERIFIED" as const,
      verification: "REVIEW_REQUIRED" as const,
    })),
    sources: SOURCE,
    notices: {
      institutions: "Institution markers are being reconciled against the Ministry of Education tertiary-provider directory before shortlist eligibility is shown.",
      rent: "Official Tenancy Services bond data is being normalized by region and dwelling type. No rent figure is shown until its source row is verified.",
      occupations: "Official ANZSCO, Green List and wage source rows are being matched. No shortage or high-income claim is shown until an exact mapping is approved.",
    },
  }
}
