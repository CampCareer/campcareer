import { getCanonicalCareer } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import type {
  CareerRecommendationResultV4,
  RecommendationInputV4,
} from "@/lib/study-product/types"

export const CAREER_RECOMMENDATION_ENGINE_VERSION = "4.0.0"

/**
 * The only admission point for a public career comparison. This in-memory
 * gate is intentionally empty until the publication pipeline exposes an
 * approved data version. It prevents the former five-major model from
 * silently producing rankings while country packs are rebuilt.
 */
export type PublishedCareerCountryEvidence = {
  canonicalCareerId: string
  countryCode: string
  relation: "exact"
  compensationCurrent: boolean
  shortageCurrent: boolean
  housingCurrent: boolean
  pathwayCurrent: boolean
  dataVersion: string
}

export const PUBLISHED_CAREER_COUNTRY_EVIDENCE: readonly PublishedCareerCountryEvidence[] = []

function isDecisionReady(
  row: PublishedCareerCountryEvidence | undefined,
) {
  return Boolean(
    row && row.relation === "exact" && row.compensationCurrent &&
      row.shortageCurrent && row.housingCurrent && row.pathwayCurrent,
  )
}

export function recommendCareerCountriesV4(
  input: RecommendationInputV4,
): CareerRecommendationResultV4 {
  const career = getCanonicalCareer(input.targetCareerId)
  if (!career) throw new Error("Unknown canonical career")

  const rows = PUBLISHED_CAREER_COUNTRY_EVIDENCE.filter(
    (row) => row.canonicalCareerId === career.id,
  )
  const decisionReadyRows = rows.filter(isDecisionReady)
  const publishedVersion = decisionReadyRows[0]?.dataVersion ?? "career-publication-pending"

  return {
    engineVersion: CAREER_RECOMMENDATION_ENGINE_VERSION,
    dataVersion: publishedVersion,
    generatedAt: new Date().toISOString(),
    input: {
      ...input,
      originCountry: input.originCountry?.toUpperCase(),
      firstYearBudget: input.firstYearBudget && {
        amount: input.firstYearBudget.amount,
        currency: input.firstYearBudget.currency.toUpperCase(),
      },
    },
    career: { id: career.id, categoryId: career.categoryId, label: career.label },
    // No row may enter this list until a server repository supplies the
    // published exact mapping and its source-row-backed observations.
    rankedCountries: [],
    unrankedCountries: LAUNCH_COUNTRIES.map((country) => {
      const partial = rows.some((row) => row.countryCode === country.code)
      return {
        countryCode: country.code,
        countryName: country.name,
        slug: country.slug,
        status: partial ? "RELATED_DATA_ONLY" : "REVIEW_REQUIRED",
        reason: partial
          ? "Related occupation evidence exists, but an exact current career comparison is not published."
          : "An exact official occupation mapping and current source-row evidence are required before comparison.",
      }
    }),
    disclaimer:
      "CampCareer is an information and planning tool, not legal, immigration, admissions, or eligibility advice. Always verify requirements with the official authority and provider.",
  }
}
