import { NO_CITIES, NO_REGIONS, NO_UNIVERSITIES } from "@/data/no-map-data"

export const NO_MAP_V2_VERSION = "no-map-v2-2026-07-13"

const SOURCE = {
  boundary: "https://www.kartverket.no/",
  institutions: "https://www.studyinnorway.no/",
  rent: "https://www.ssb.no/en/boliger-og-eiendommer/utleie-og-bosituasjoner",
  earnings: "https://www.ssb.no/en/arbeid-og-lonn/lonn-og-arbeidskraftskostnader",
  shortage: "https://www.nav.no/en/home/work-and-attendance/work-in-norway/shortage-occupations",
  occupation: "https://www.ssb.no/en/klass/klassifikasjoner/7",
} as const

/** Public map-discovery bundle. It deliberately excludes unreviewed numeric seeds. */
export function getNOMapV2Bundle() {
  return {
    version: NO_MAP_V2_VERSION,
    country: "NO" as const,
    boundaryUrl: "/no-regions.geojson",
    regions: NO_REGIONS.map(({ code, nameEn, nameKo, slug, lat, lng }) => ({
      code, nameEn, nameKo, slug, lat, lng,
      rent: { status: "REVIEW_REQUIRED" as const, sourceUrl: SOURCE.rent },
      shortage: { status: "REVIEW_REQUIRED" as const, sourceUrl: SOURCE.shortage },
      earnings: { status: "REVIEW_REQUIRED" as const, sourceUrl: SOURCE.earnings },
    })),
    cities: NO_CITIES.map(({ code, regionCode, nameEn, nameKo, slug, lat, lng }) => ({
      code, regionCode, nameEn, nameKo, slug, lat, lng,
    })),
    institutions: NO_UNIVERSITIES.map((institution) => ({
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
      institutions: "Institution markers are being reconciled against official Norwegian provider records before shortlist eligibility is shown.",
      rent: "SSB rental source rows are being normalized by region and dwelling type. No rent figure is shown until review is complete.",
      shortage: "NAV shortage evidence and STYRK-08 mappings are being reviewed. No regional shortage claim is shown until an exact source row is approved.",
      earnings: "SSB earnings observations are being mapped to exact STYRK-08 occupations. No high-income ranking is shown until review is complete.",
    },
  }
}
