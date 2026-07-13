import { COUNTRY_ROI_DATA_META, COUNTRY_ROI_INSIGHTS } from "@/data/country-roi-mvp"
import { getLocalizedConceptLabel, getStudyConcept } from "@/data/study-concepts"
import type {
  ConceptCountryCoverage,
  CountryEvidenceSummary,
  CountryRecommendation,
  FactorBreakdown,
  FitBand,
  RecommendationInputV3,
  RecommendationPriority,
  RecommendationResultV2,
  StudyConcept,
} from "@/lib/study-product/types"

export const RECOMMENDATION_ENGINE_VERSION = "2.0.0"

export const ORIGIN_PROFILES = {
  GLOBAL: { label: "Global", currency: "USD", currencyLabel: "US dollar" },
  IN: { label: "India", currency: "INR", currencyLabel: "Indian rupee" },
  PH: { label: "Philippines", currency: "PHP", currencyLabel: "Philippine peso" },
  KR: { label: "South Korea", currency: "KRW", currencyLabel: "Korean won" },
  NG: { label: "Nigeria", currency: "USD", currencyLabel: "US dollar" },
  NP: { label: "Nepal", currency: "USD", currencyLabel: "US dollar" },
  PK: { label: "Pakistan", currency: "USD", currencyLabel: "US dollar" },
  BD: { label: "Bangladesh", currency: "USD", currencyLabel: "US dollar" },
  LK: { label: "Sri Lanka", currency: "USD", currencyLabel: "US dollar" },
} as const

export type OriginProfileCode = keyof typeof ORIGIN_PROFILES

const FX_AS_OF = "2026-07-10"
// ECB reference rates: units of currency per EUR. USD conversion is performed
// through EUR so the source and date are explicit in every result.
const ECB_PER_EUR: Record<string, number> = {
  EUR: 1,
  USD: 1.143,
  GBP: 0.85155,
  AUD: 1.6447,
  CAD: 1.6177,
  INR: 108.9665,
  KRW: 1720.12,
  PHP: 70.378,
  SGD: 1.4757,
}

const PRIORITY_WEIGHTS: Record<RecommendationPriority, {
  career: number
  cost: number
  postStudy: number
  pathway: number
}> = {
  CAREER_OUTCOME: { career: 0.5, cost: 0.15, postStudy: 0.2, pathway: 0.15 },
  LOWER_COST: { career: 0.2, cost: 0.5, postStudy: 0.15, pathway: 0.15 },
  POST_STUDY_OPTIONS: { career: 0.2, cost: 0.15, postStudy: 0.45, pathway: 0.2 },
}

export function normalizeOriginCountry(value: string): OriginProfileCode {
  const normalized = value.toUpperCase()
  return normalized in ORIGIN_PROFILES ? normalized as OriginProfileCode : "GLOBAL"
}

export function recommendStudyCountries(input: RecommendationInputV3): RecommendationResultV2 {
  const concept = getStudyConcept(input.targetConceptId)
  if (!concept) throw new Error("Unknown study concept")

  const normalizedInput: RecommendationInputV3 = {
    ...input,
    originCountry: input.originCountry?.toUpperCase(),
    firstYearBudget: input.firstYearBudget
      ? { amount: input.firstYearBudget.amount, currency: input.firstYearBudget.currency.toUpperCase() }
      : undefined,
  }

  const rankedCountries: Array<CountryRecommendation & { _score: number }> = []
  const unrankedCountries: CountryEvidenceSummary[] = []

  for (const country of COUNTRY_ROI_INSIGHTS) {
    const coverage = concept.coverageByCountry[country.code] ?? "CATALOG"
    // V2/V3 used broad five-field scores. They are retained only for existing
    // saved-plan readability and must never rank a live country comparison.
    // V4 requires an exact canonical-career crosswalk plus current source rows.
    const canRank = false

    if (!canRank) {
      unrankedCountries.push(buildEvidenceSummary(concept, country, coverage))
      continue
    }

    const factors = buildFactors(concept, country, normalizedInput)
    const weights = PRIORITY_WEIGHTS[normalizedInput.priority]
    const score =
      factors.career * weights.career +
      factors.cost * weights.cost +
      factors.postStudy * weights.postStudy +
      factors.pathway * weights.pathway

    rankedCountries.push({
      ...buildCountryRecommendation(concept, country, normalizedInput, factors, score),
      _score: score,
    })
  }

  rankedCountries.sort((a, b) => b._score - a._score || a.countryCode.localeCompare(b.countryCode))

  return {
    engineVersion: RECOMMENDATION_ENGINE_VERSION,
    dataVersion: COUNTRY_ROI_DATA_META.version,
    generatedAt: new Date().toISOString(),
    input: normalizedInput,
    concept: {
      id: concept.id,
      slug: concept.slug,
      label: getLocalizedConceptLabel(concept, input.locale),
      kind: concept.kind,
    },
    rankedCountries: rankedCountries.map(({ _score, ...country }) => {
      void _score
      return country
    }),
    unrankedCountries,
    disclaimer:
      "CampCareer is an information and planning tool, not legal, immigration, admissions, or eligibility advice. Always verify requirements with the official authority and provider.",
  }
}

function buildFactors(
  concept: StudyConcept,
  country: (typeof COUNTRY_ROI_INSIGHTS)[number],
  input: RecommendationInputV3,
) {
  const range = parseUsdRange(country.initialBudget)

  return {
    career: country.score[concept.legacyField!],
    cost: input.firstYearBudget
      ? budgetFitScore(convertCurrency(input.firstYearBudget.amount, input.firstYearBudget.currency, "USD"), range)
      : relativeCostScore(range),
    postStudy: country.goalFit.immigration,
    pathway: 88,
  }
}

function buildCountryRecommendation(
  concept: StudyConcept,
  country: (typeof COUNTRY_ROI_INSIGHTS)[number],
  input: RecommendationInputV3,
  factors: ReturnType<typeof buildFactors>,
  score: number,
): CountryRecommendation {
  const fitBand = fitBandFromScore(score)
  const factorBreakdown: FactorBreakdown = {
    careerOutcome: factorBand(factors.career),
    affordability: factorBand(factors.cost),
    postStudyOptions: factorBand(factors.postStudy),
    pathwayFeasibility: factorBand(factors.pathway),
  }
  return {
    countryCode: country.code,
    countryName: country.name,
    slug: country.slug,
    fitBand,
    factorBreakdown,
    why: buildWhy(country.name, input.priority, factorBreakdown, Boolean(input.firstYearBudget)),
    caution: country.detail.watchouts[0],
    qualification: qualificationLabel(concept),
    duration: "Varies by verified course and qualification level",
    linkedCareer: concept.label,
    policy: country.policy,
    metrics: [
      {
        key: "FIRST_YEAR_COST",
        label: "Estimated first-year runway",
        value: input.firstYearBudget
          ? `${country.initialBudget} · ${formatRangeInCurrency(country.initialBudget, input.firstYearBudget.currency)}`
          : country.initialBudget,
        sourceId: `${country.code.toLowerCase()}-budget-${COUNTRY_ROI_DATA_META.version}`,
        sourceName: country.sources.budget.sourceName,
        sourceUrl: country.sources.budget.sourceUrl,
        sourceType: sourceType(country.sources.budget.confidence),
        asOf: country.sources.budget.retrievedAt,
        lastVerifiedAt: country.sources.budget.lastChecked,
        reviewStatus: reviewStatus(country.sources.budget.reviewStatus),
      },
      {
        key: "SALARY",
        label: "Indicative year-three salary",
        value: country.salaries.year3,
        sourceId: `${country.code.toLowerCase()}-salary-${COUNTRY_ROI_DATA_META.version}`,
        sourceName: country.sources.salary.sourceName,
        sourceUrl: country.sources.salary.sourceUrl,
        sourceType: sourceType(country.sources.salary.confidence),
        asOf: country.sources.salary.retrievedAt,
        lastVerifiedAt: country.sources.salary.lastChecked,
        reviewStatus: reviewStatus(country.sources.salary.reviewStatus),
      },
      {
        key: "MONTHLY_HOUSING",
        label: "Representative monthly housing proxy",
        value: country.rent,
        sourceId: `${country.code.toLowerCase()}-housing-${COUNTRY_ROI_DATA_META.version}`,
        sourceName: country.sources.rent.sourceName,
        sourceUrl: country.sources.rent.sourceUrl,
        sourceType: sourceType(country.sources.rent.confidence),
        asOf: country.sources.rent.retrievedAt,
        lastVerifiedAt: country.sources.rent.lastChecked,
        reviewStatus: reviewStatus(country.sources.rent.reviewStatus),
      },
      {
        key: "HOUSING_ADJUSTED",
        label: "Salary after housing proxy (before tax)",
        value: housingAdjustedSalary(country.salaries.year3, country.rent),
        sourceId: `${country.code.toLowerCase()}-housing-adjusted-${COUNTRY_ROI_DATA_META.version}`,
        sourceName: "CampCareer calculation from salary and housing sources",
        sourceType: "INTERNAL",
        asOf: COUNTRY_ROI_DATA_META.lastUpdated,
        lastVerifiedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        reviewStatus: "APPROVED",
      },
      {
        key: "PATHWAY",
        label: "Post-study option",
        value: country.policy,
        sourceId: `${country.code.toLowerCase()}-policy-${COUNTRY_ROI_DATA_META.version}`,
        sourceName: country.sources.policy.sourceName,
        sourceUrl: country.sources.policy.sourceUrl,
        sourceType: "OFFICIAL",
        asOf: country.sources.policy.retrievedAt,
        lastVerifiedAt: country.sources.policy.lastChecked,
        reviewStatus: reviewStatus(country.sources.policy.reviewStatus),
      },
    ],
    detailHref: country.href,
    shortlistHref: `/study-options/${concept.slug}/${country.code.toLowerCase()}`,
    originComparison: buildOriginComparison(input.originCountry, country.code),
  }
}

function buildEvidenceSummary(
  concept: StudyConcept,
  country: (typeof COUNTRY_ROI_INSIGHTS)[number],
  coverage: ConceptCountryCoverage,
): CountryEvidenceSummary {
  const availableEvidence = [
    country.sources.salary.reviewStatus === "approved" ? "Career and salary signals" : null,
    country.sources.policy.reviewStatus === "approved" ? "Official post-study source" : null,
    coverage === "PATHWAY_READY" || coverage === "DECISION_READY" ? "Study pathway overview" : null,
  ].filter((value): value is string => Boolean(value))

  return {
    countryCode: country.code,
    countryName: country.name,
    slug: country.slug,
    coverage,
    availableEvidence,
    exploreHref: `/maps/${country.code.toLowerCase()}?q=${encodeURIComponent(concept.label)}`,
  }
}

function buildWhy(
  countryName: string,
  priority: RecommendationPriority,
  factors: FactorBreakdown,
  hasBudget: boolean,
) {
  if (priority === "LOWER_COST" && factors.affordability === "STRONG") {
    return hasBudget
      ? `${countryName} fits your first-year budget comparatively well while preserving a verified study-to-career route.`
      : `${countryName} has a comparatively lower reviewed first-year runway while preserving a verified study-to-career route.`
  }
  if (priority === "POST_STUDY_OPTIONS" && factors.postStudyOptions === "STRONG") {
    return `${countryName} has a comparatively strong official post-study option for this reviewed pathway.`
  }
  return `${countryName} combines a strong career-outcome signal with a reviewed study and post-study pathway.`
}

function qualificationLabel(concept: StudyConcept) {
  if (concept.kind === "TRADE_PATHWAY") return "Trade certificate, diploma or apprenticeship pathway"
  if (concept.kind === "QUALIFICATION") return "Certificate, diploma or degree pathway"
  return "Degree, diploma or related qualification"
}

function factorBand(value: number): "STRONG" | "MIXED" | "WEAK" {
  if (value >= 82) return "STRONG"
  if (value >= 65) return "MIXED"
  return "WEAK"
}

function fitBandFromScore(value: number): FitBand {
  if (value >= 82) return "STRONG_MATCH"
  if (value >= 72) return "WORTH_CONSIDERING"
  return "IMPORTANT_TRADE_OFFS"
}

function parseUsdRange(value: string): { low: number; high: number } {
  const matches = value.match(/([\d.]+)k-([\d.]+)k/i)
  if (!matches) return { low: 40_000, high: 70_000 }
  return { low: Number(matches[1]) * 1_000, high: Number(matches[2]) * 1_000 }
}

function budgetFitScore(budgetUsd: number, range: { low: number; high: number }) {
  const midpoint = (range.low + range.high) / 2
  if (budgetUsd >= range.high) return 100
  if (budgetUsd >= midpoint) return 82
  if (budgetUsd >= range.low) return 64
  if (budgetUsd >= range.low * 0.85) return 45
  return 20
}

function relativeCostScore(range: { low: number; high: number }) {
  // A visitor who has not supplied a budget still deserves a cost-aware ranking.
  // This ranks the reviewed first-year runway relative to other destinations,
  // without pretending it is personally affordable.
  const midpoint = (range.low + range.high) / 2
  return Math.max(20, Math.min(95, 110 - midpoint / 1_000))
}

function housingAdjustedSalary(salary: string, rent: string) {
  const annualSalary = parseUsdAmount(salary)
  const monthlyRent = parseUsdAmount(rent)
  if (annualSalary === null || monthlyRent === null) return "Unavailable"
  return `US$${Math.round((annualSalary - monthlyRent * 12) / 1_000)}k/year`
}

function parseUsdAmount(value: string) {
  const match = value.match(/US\$([\d,.]+)(k)?/i)
  if (!match) return null
  const amount = Number(match[1].replaceAll(",", ""))
  return match[2] ? amount * 1_000 : amount
}

function buildOriginComparison(originCountry: string | undefined, destinationCountry: string) {
  if (!originCountry) {
    return { status: "NOT_SELECTED" as const, destinationCountry }
  }

  // No exact canonical career compensation pairs have been editorially
  // approved yet. Keeping this explicit prevents broad field scores from being
  // misrepresented as same-occupation salary differences.
  return {
    status: "UNAVAILABLE" as const,
    originCountry,
    destinationCountry,
    reason: "An exact occupation, wage and housing comparison has not passed verification for this country pair yet.",
  }
}

function convertCurrency(amount: number, from: string, to: string) {
  const fromRate = ECB_PER_EUR[from] ?? ECB_PER_EUR.USD
  const toRate = ECB_PER_EUR[to] ?? ECB_PER_EUR.USD
  return (amount / fromRate) * toRate
}

function formatRangeInCurrency(usdRange: string, currency: string) {
  const range = parseUsdRange(usdRange)
  const low = convertCurrency(range.low, "USD", currency)
  const high = convertCurrency(range.high, "USD", currency)
  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    notation: currency === "KRW" || currency === "INR" ? "compact" : "standard",
    maximumFractionDigits: 0,
  })
  return `${formatter.format(low)}–${formatter.format(high)} (ECB ${FX_AS_OF})`
}

function sourceType(confidence: string): "OFFICIAL" | "MARKET" | "INTERNAL" {
  if (confidence === "official") return "OFFICIAL"
  if (confidence === "market-estimate") return "MARKET"
  return "INTERNAL"
}

function reviewStatus(status: string): "APPROVED" | "STALE" | "REVIEW_REQUIRED" {
  return status === "approved" ? "APPROVED" : "REVIEW_REQUIRED"
}
