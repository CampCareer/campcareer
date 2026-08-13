import "server-only"

import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { getCareerDataFoundation, getFoundationCountriesForCareer } from "@/lib/career-data-foundation/read"
import { isFoundationRankable } from "@/lib/career-data-foundation/opportunity-score"
import type { CareerDataFoundationResult } from "@/lib/career-data-foundation/types"
import { supabase } from "@/lib/supabase"
import { selectComparableCareerRecommendations } from "./career-market-safety"
import { getCountryOccupationProfile } from "./country-occupation-read"
import type {
  CareerMarketDemand,
  CareerMarketInsight,
  CareerMarketProfile,
  CareerMarketRecommendation,
  CareerVisaPathway,
} from "./career-market-contract"
import { OCCUPATION_DETAILS } from "./occupation-detail"

const countryName = (countryCode: string) =>
  LAUNCH_COUNTRIES.find((country) => country.code === countryCode)?.name ?? countryCode

const toDemand = (careerId: string, countryCode: string): CareerMarketDemand | null => {
  const demand = OCCUPATION_DETAILS.find((detail) => detail.id === careerId)?.demand
    .find((item) => item.countryCode === countryCode)
  if (!demand) return null
  return {
    countryCode,
    countryName: demand.countryLabel,
    rating: demand.rating,
    note: demand.note,
    sourceLabel: demand.sourceLabel,
    sourceUrl: demand.sourceUrl,
  }
}

const toFoundationDemand = (foundation: CareerDataFoundationResult): CareerMarketDemand => {
  const openings = foundation.decisionMetrics.projectedAnnualOpenings
  const growth = foundation.decisionMetrics.projectedGrowthPct
  const source = foundation.sources.find((item) => item.sourceKey === "us-bls-ep-2024-2034")
  const signal = [
    openings == null ? null : `Projection: ${new Intl.NumberFormat("en-US").format(openings)} openings/year`,
    growth == null ? null : `${growth}% growth`,
  ].filter(Boolean).join(" · ")
  return {
    countryCode: foundation.countryCode,
    countryName: countryName(foundation.countryCode),
    rating: signal || null,
    note: "BLS annual openings and employment growth are projection signals, not a live vacancy count, formal shortage finding, personal employment assessment, or visa outcome.",
    sourceLabel: source?.title ?? null,
    sourceUrl: source?.url ?? null,
  }
}

const toFoundationVisas = (foundation: CareerDataFoundationResult): CareerVisaPathway[] => {
  const visaBlocker = foundation.blockers.find((item) => item.blockerType === "visa")
  const sources = new Map(foundation.sources.map((source) => [source.sourceKey, source]))
  return foundation.entryPoints
    .filter((entryPoint) => entryPoint.entryType === "visa")
    .map((entryPoint) => {
      const source = sources.get(entryPoint.sourceKey)
      const h2b = /h-2b/i.test(entryPoint.label)
      return {
        name: entryPoint.label,
        kind: h2b ? "Temporary" as const : "Work" as const,
        note: `${entryPoint.applicabilityScope} ${visaBlocker?.reason ?? entryPoint.notes ?? "Eligibility is case-specific."}`,
        authority: entryPoint.provider,
        sourceUrl: entryPoint.url,
        sourceTitle: source?.title ?? entryPoint.label,
        lastVerifiedOn: entryPoint.lastVerifiedOn,
      }
    })
}

const foundationCareerContext = (foundation: CareerDataFoundationResult) => {
  const metrics = foundation.decisionMetrics
  const employment = metrics.employmentTotal == null
    ? "verified employment data"
    : `${new Intl.NumberFormat("en-US").format(metrics.employmentTotal)} jobs in the BLS 2024 projection base`
  const openings = metrics.projectedAnnualOpenings == null
    ? "projected openings data"
    : `${new Intl.NumberFormat("en-US").format(metrics.projectedAnnualOpenings)} projected annual openings through 2034`
  const growth = metrics.projectedGrowthPct == null
    ? "the published outlook"
    : `${metrics.projectedGrowthPct}% projected employment growth through 2034`
  const blockerSummary = foundation.blockers
    .filter((item) => item.blockerType === "licensing" || item.blockerType === "safety_training")
    .map((item) => item.reason)
    .join(" ")

  return {
    overview: {
      en: `For ${foundation.mapping.officialTitle}, the foundation records ${employment}, ${openings}, and ${growth}. These are market observations and projections, not a personal employment or immigration assessment.`,
      ko: `${foundation.mapping.officialTitle}에 대해 공식 데이터 기반 고용 규모, 연평균 채용 전망, 성장 전망을 제공합니다. 이는 시장 데이터이며 개인의 취업 가능성이나 비자 승인 여부를 판단하는 결과가 아닙니다.`,
    },
    registration: {
      en: blockerSummary || "Licensing, registration and safety requirements must be checked for the intended state, municipality, employer and project.",
      ko: "미국 전체에 단일 Carpenter 개인 면허 요건이 있다고 보지 않습니다. 주, 지방정부, 고용주, 프로젝트별 면허·등록·안전교육 요건을 실제 근무 지역 기준으로 확인해야 합니다.",
    },
    sources: foundation.sources.map((source) => ({ label: source.title, url: source.url })),
  }
}

const toFoundationCompatibilityProfile = (foundation: CareerDataFoundationResult): CareerMarketProfile => {
  const entryLinks: CareerMarketProfile["links"] = foundation.entryPoints
    .filter((entryPoint) => ["job_search", "employer", "apprenticeship", "training"].includes(entryPoint.entryType))
    .map((entryPoint) => ({
      linkType: entryPoint.entryType === "job_search"
        ? "job_search" as const
        : entryPoint.entryType === "employer"
          ? "employer" as const
          : "entry_program" as const,
      label: entryPoint.label,
      url: entryPoint.url,
      providerType: entryPoint.provider,
      regionCode: null,
    }))

  return {
    profileKey: foundation.profileKey,
    countryCode: foundation.countryCode,
    canonicalCareerId: foundation.canonicalOccupationId,
    officialTitle: foundation.mapping.officialTitle,
    officialCodeSystem: foundation.mapping.officialTaxonomy,
    officialCodeVersion: foundation.mapping.officialTaxonomyVersion,
    officialUnitGroupCode: foundation.mapping.officialCode,
    currency: foundation.currency,
    registrationRequired: false,
    registrationAuthority: null,
    registrationUrl: null,
    publicationStatus: "decision_ready",
    sourceCheckedAt: foundation.sourceCheckedOn,
    metric: {
      asOfDate: foundation.sourceCheckedOn,
      employmentTotal: foundation.decisionMetrics.employmentTotal,
      medianWeeklyEarnings: null,
      medianHourlyEarnings: foundation.decisionMetrics.medianHourlyWage,
      annualisedMedianSalary: foundation.decisionMetrics.medianAnnualWage,
      allOccupationsMedianWeekly: null,
      partTimeSharePct: null,
      femaleSharePct: null,
      medianAge: null,
      averageFullTimeHours: null,
      vacanciesThreeMonthAvg: null,
      vacancyPeriod: null,
      vacancyYoyPct: null,
      employmentGrowth5yPct: null,
      employmentGrowth10yPct: foundation.decisionMetrics.projectedGrowthPct,
      opportunityScore: foundation.opportunityScore,
      scoreMethodologyVersion: foundation.readiness.formulaVersion,
      scoreStatus: foundation.readiness.scoreReady ? "foundation_ready" : "not_ready",
      scoreEvidence: {
        source: "career_data_foundation",
        readiness: foundation.readiness,
        components: foundation.scoreComponents.map((component) => ({
          componentKey: component.componentKey,
          availability: component.availability,
          directness: component.directness,
          scoreValue: component.scoreValue,
          reason: component.reason,
          proxyReason: component.proxyReason,
        })),
      },
      score: {
        shortage: null,
        vacancyIntensity: null,
        employerDiversity: null,
        vacancyTrend: null,
        entryLevel: null,
        salary: null,
        growth: null,
        visa: null,
        entryBurden: null,
      },
      sourceCheckedAt: foundation.sourceCheckedOn,
    },
    specialisations: [{
      officialCode: foundation.mapping.officialCode,
      officialTitle: foundation.mapping.officialTitle,
      legacyCodeSystem: null,
      legacyCodeVersion: null,
      legacyCode: null,
      shortageRating: null,
      visaEligible: null,
      includedInRollup: true,
    }],
    regions: [],
    links: entryLinks,
    programLinks: [],
  }
}

type ProfileRow = {
  profile_key: string
  country_code: string
  official_title: string
  registration_required: boolean
  publication_status: "review_required" | "profile_ready" | "decision_ready"
}

type MetricRow = {
  profile_key: string
  as_of_date: string
  opportunity_score: number
  score_methodology_version: string
  score_status: "provisional" | "reviewed" | "published"
}

export async function getCareerCountryRecommendations(careerId: string): Promise<CareerMarketRecommendation[]> {
  const [profilesResult, foundationRows] = await Promise.all([
    supabase
      .from("country_occupation_profiles")
      .select("profile_key,country_code,official_title,registration_required,publication_status")
      .eq("canonical_career_id", careerId)
      .eq("publication_status", "decision_ready"),
    getFoundationCountriesForCareer(careerId),
  ])

  if (profilesResult.error) throw profilesResult.error
  const profiles = (profilesResult.data ?? []) as ProfileRow[]
  const foundationCountries = new Set(foundationRows.map((row) => row.countryCode))
  const legacyProfiles = profiles.filter((profile) => !foundationCountries.has(profile.country_code))
  const profileKeys = legacyProfiles.map((profile) => profile.profile_key)
  const latestMetrics = new Map<string, MetricRow>()

  if (profileKeys.length) {
    const metricsResult = await supabase
      .from("country_occupation_metric_snapshots")
      .select("profile_key,as_of_date,opportunity_score,score_methodology_version,score_status")
      .in("profile_key", profileKeys)
      .order("as_of_date", { ascending: false })
    if (metricsResult.error) throw metricsResult.error
    for (const row of (metricsResult.data ?? []) as MetricRow[]) {
      if (!latestMetrics.has(row.profile_key)) latestMetrics.set(row.profile_key, row)
    }
  }

  const byCountry = new Map<string, CareerMarketRecommendation>()

  for (const foundation of foundationRows) {
    if (!isFoundationRankable({
      decisionReady: foundation.decisionReady,
      scoreReady: foundation.scoreReady,
      publishReady: foundation.publishReady,
      opportunityScore: foundation.opportunityScore,
    })) continue
    byCountry.set(foundation.countryCode, {
      countryCode: foundation.countryCode,
      countryName: countryName(foundation.countryCode),
      officialTitle: foundation.officialTitle,
      opportunityScore: foundation.opportunityScore,
      scoreStatus: "foundation_ready",
      scoreMethodologyVersion: foundation.formulaVersion,
      registrationRequired: null,
      publicationStatus: "decision_ready",
      demand: null,
    })
  }

  for (const profile of legacyProfiles) {
    const metric = latestMetrics.get(profile.profile_key)
    byCountry.set(profile.country_code, {
      countryCode: profile.country_code,
      countryName: countryName(profile.country_code),
      officialTitle: profile.official_title,
      opportunityScore: metric?.opportunity_score ?? null,
      scoreStatus: metric?.score_status ?? null,
      scoreMethodologyVersion: metric?.score_methodology_version ?? null,
      registrationRequired: profile.registration_required,
      publicationStatus: profile.publication_status,
      demand: toDemand(careerId, profile.country_code),
    })
  }

  return selectComparableCareerRecommendations([...byCountry.values()])
}

type VisaRow = {
  visa_name: string
  kind: CareerVisaPathway["kind"]
  note: string
  authority: string
  source_url: string
  source_title: string
  last_verified_on: string
}

export async function getCareerMarketInsight({ countryCode, careerId }: { countryCode: string; careerId: string }): Promise<CareerMarketInsight | null> {
  const country = countryCode.trim().toUpperCase()
  const career = CANONICAL_CAREER_BY_ID.get(careerId)
  if (!career || (country !== "NOT-SURE" && !/^[A-Z]{2}$/.test(country))) return null

  const detail = OCCUPATION_DETAILS.find((item) => item.id === careerId)
  const base = {
    id: career.id,
    label: career.label,
    labelKo: career.labelKo,
    overview: detail?.overview ?? null,
    registration: detail?.registration ?? null,
    mainTasks: detail?.mainTasks ?? [],
    sources: detail?.sources ?? [],
  }

  if (country === "NOT-SURE") {
    return {
      career: base,
      country: null,
      profile: null,
      foundation: null,
      readModelSource: "editorial_only",
      demand: null,
      recommendations: await getCareerCountryRecommendations(careerId),
      visas: [],
    }
  }

  const [foundation, recommendations] = await Promise.all([
    getCareerDataFoundation({ countryCode: country, careerId }),
    getCareerCountryRecommendations(careerId),
  ])

  if (foundation?.readiness.decisionReady) {
    const context = foundationCareerContext(foundation)
    return {
      career: {
        ...base,
        overview: context.overview,
        registration: context.registration,
        mainTasks: [],
        sources: context.sources,
      },
      country: { code: country, name: countryName(country) },
      profile: toFoundationCompatibilityProfile(foundation),
      foundation,
      readModelSource: "career_data_foundation",
      demand: toFoundationDemand(foundation),
      recommendations,
      visas: toFoundationVisas(foundation),
    }
  }

  if (foundation) {
    return {
      career: base,
      country: { code: country, name: countryName(country) },
      profile: null,
      foundation,
      readModelSource: "editorial_only",
      demand: null,
      recommendations,
      visas: [],
    }
  }

  const [profile, visaResult] = await Promise.all([
    getCountryOccupationProfile(country, careerId),
    supabase
      .from("visa_pathways")
      .select("visa_name,kind,note,authority,source_url,source_title,last_verified_on")
      .eq("country_code", country)
      .order("display_order", { ascending: true })
      .limit(4),
  ])
  if (visaResult.error) throw visaResult.error

  return {
    career: base,
    country: { code: country, name: countryName(country) },
    profile,
    foundation: null,
    readModelSource: profile ? "legacy_country_occupation" : "editorial_only",
    demand: toDemand(careerId, country),
    recommendations,
    visas: ((visaResult.data ?? []) as VisaRow[]).map((visa) => ({
      name: visa.visa_name,
      kind: visa.kind,
      note: visa.note,
      authority: visa.authority,
      sourceUrl: visa.source_url,
      sourceTitle: visa.source_title,
      lastVerifiedOn: visa.last_verified_on,
    })),
  }
}
