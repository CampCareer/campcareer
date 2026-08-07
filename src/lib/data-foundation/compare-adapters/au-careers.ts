import "server-only"

import { getOccupationEditorial } from "@/data/occupation-editorial"
import {
  AU_CAREER_COMPARISON_CATALOG,
  CAREER_COMPARE_COUNTRY,
  CAREER_COMPARE_IDS,
  type AustraliaCareerComparison,
  type CareerCompareId,
} from "@/data/career-comparison/australia"
import type { DurationValue, MoneyValue, SourceReference, TextValue } from "@/data/country-comparison/contracts"
import type { CountryOccupationProfile } from "@/lib/workspace/country-occupation-contract"
import { getCountryOccupationProfile } from "@/lib/workspace/country-occupation-read"

const EMPTY_DURATION: DurationValue = {
  value: null,
  min: null,
  max: null,
  unit: null,
  valueType: "unavailable",
  sourceIds: [],
}

const emptyMoney = (): MoneyValue => ({
  currency: null,
  amount: null,
  min: null,
  max: null,
  period: null,
  effectiveYear: null,
  valueType: "unavailable",
  sourceIds: [],
})

function yearOf(date: string | null | undefined) {
  const year = date ? Number(date.slice(0, 4)) : NaN
  return Number.isFinite(year) ? year : null
}

function text(value: string | null | undefined, sourceIds: readonly string[] = []): TextValue | null {
  const normalized = value?.trim()
  if (!normalized) return null
  return {
    value: normalized,
    valueType: "verified",
    effectiveYear: null,
    sourceIds,
  }
}

function money(
  amount: number | null,
  currency: string,
  period: MoneyValue["period"],
  effectiveYear: number | null,
  sourceIds: readonly string[],
  valueType: MoneyValue["valueType"] = "official",
): MoneyValue {
  return {
    currency,
    amount,
    min: null,
    max: null,
    period,
    effectiveYear,
    valueType: amount === null ? "unavailable" : valueType,
    sourceIds: amount === null ? [] : sourceIds,
  }
}

function buildSources(profile: CountryOccupationProfile): SourceReference[] {
  const verificationStatus = profile.publicationStatus === "decision_ready" ? "verified" : "needs-review"
  return profile.links
    .filter((link) => link.linkType === "source")
    .map((link, index) => ({
      id: `${profile.profileKey}:source:${index + 1}`,
      label: link.label,
      url: link.url,
      sourceType: link.providerType ?? "official",
      reviewedAt: profile.sourceCheckedAt,
      effectiveYear: yearOf(profile.metric.asOfDate),
      verificationStatus,
    }))
}

function shortageSummary(profile: CountryOccupationProfile) {
  const included = profile.specialisations.filter((item) => item.includedInRollup)
  const rated = included.filter((item) => item.shortageRating !== null)
  if (!included.length || !rated.length) return null
  const shortage = rated.filter((item) => (item.shortageRating ?? 0) > 0).length
  return `${shortage} of ${included.length} mapped occupations have a recorded shortage rating`
}

function mapProfile(profile: CountryOccupationProfile): AustraliaCareerComparison {
  const id = profile.canonicalCareerId as CareerCompareId
  const editorial = getOccupationEditorial(id)?.countries.AU
  const sources = buildSources(profile)
  const sourceIds = sources.map((source) => source.id)
  const metricYear = yearOf(profile.metric.asOfDate)

  return {
    id,
    label: profile.officialTitle,
    countryCode: CAREER_COMPARE_COUNTRY,
    codeMappings: profile.officialUnitGroupCode
      ? [{
          system: profile.officialCodeSystem,
          version: profile.officialCodeVersion,
          code: profile.officialUnitGroupCode,
          relation: "broader",
        }]
      : [],
    pathway: {
      typicalEducationRoute: text(editorial?.entryPathway, sourceIds),
      typicalEntryQualification: null,
      studyDuration: EMPTY_DURATION,
      qualificationOutcome: null,
    },
    registration: {
      requirement: {
        value: profile.registrationRequired ? "required" : "not-required",
        sourceIds,
      },
      authority: text(profile.registrationAuthority, sourceIds),
      process: text(editorial?.registration, sourceIds),
      scope: text(profile.registrationRequired ? "State, territory or national regulator requirements apply as described." : "No single national occupational registration requirement is recorded for this profile.", sourceIds),
    },
    studyCost: {
      annualTuition: emptyMoney(),
      estimatedTotalTuition: emptyMoney(),
      mandatoryStudyCosts: emptyMoney(),
    },
    outcome: {
      startingIncome: emptyMoney(),
      typicalEarnings: money(
        profile.metric.annualisedMedianSalary,
        profile.currency,
        "year",
        metricYear,
        sourceIds,
        "derived",
      ),
      incomeBasis: text(
        profile.metric.medianWeeklyEarnings === null
          ? null
          : `Median weekly earnings of ${profile.currency} ${profile.metric.medianWeeklyEarnings.toLocaleString("en-AU")} annualised for comparison.`,
        sourceIds,
      ),
      employmentOutlook: text(editorial?.jobMarketNote, sourceIds),
      shortageStatus: text(shortageSummary(profile), sourceIds),
      geographicScope: text("Australia · National occupation snapshot", sourceIds),
    },
    time: {
      timeToProfessionalEntry: EMPTY_DURATION,
      registrationOrOnboardingTime: EMPTY_DURATION,
    },
    snapshot: {
      asOfDate: profile.metric.asOfDate,
      employmentTotal: profile.metric.employmentTotal,
      medianWeeklyEarnings: profile.metric.medianWeeklyEarnings,
      annualisedMedianSalary: profile.metric.annualisedMedianSalary,
      vacanciesThreeMonthAvg: profile.metric.vacanciesThreeMonthAvg,
      vacancyYoyPct: profile.metric.vacancyYoyPct,
      employmentGrowth5yPct: profile.metric.employmentGrowth5yPct,
      employmentGrowth10yPct: profile.metric.employmentGrowth10yPct,
      opportunityScore: profile.metric.opportunityScore,
      scoreStatus: profile.metric.scoreStatus,
      publicationStatus: profile.publicationStatus,
    },
    sources,
    sourceIds,
    programRefs: profile.programLinks.map((program) => program.programRef),
    reviewedAt: profile.metric.sourceCheckedAt ?? profile.sourceCheckedAt,
  }
}

export async function getAustraliaCareerComparisonCatalog(): Promise<readonly AustraliaCareerComparison[]> {
  const profiles = await Promise.all(
    CAREER_COMPARE_IDS.map((id) => getCountryOccupationProfile(CAREER_COMPARE_COUNTRY, id)),
  )

  const hydrated = new Map<CareerCompareId, AustraliaCareerComparison>()
  profiles.forEach((profile) => {
    if (!profile) return
    const id = profile.canonicalCareerId as CareerCompareId
    if (!(CAREER_COMPARE_IDS as readonly string[]).includes(id)) return
    hydrated.set(id, mapProfile(profile))
  })

  return AU_CAREER_COMPARISON_CATALOG.map((fallback) => hydrated.get(fallback.id) ?? fallback)
}
