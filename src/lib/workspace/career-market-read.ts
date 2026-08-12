import "server-only"

import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { supabase } from "@/lib/supabase"
import { getCountryOccupationProfile } from "./country-occupation-read"
import type { CareerMarketDemand, CareerMarketInsight, CareerMarketRecommendation, CareerVisaPathway } from "./career-market-contract"
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
  score_status: "provisional" | "reviewed" | "published"
}

export async function getCareerCountryRecommendations(careerId: string): Promise<CareerMarketRecommendation[]> {
  const profilesResult = await supabase
    .from("country_occupation_profiles")
    .select("profile_key,country_code,official_title,registration_required,publication_status")
    .eq("canonical_career_id", careerId)
    .in("publication_status", ["profile_ready", "decision_ready"])

  if (profilesResult.error) throw profilesResult.error
  const profiles = (profilesResult.data ?? []) as ProfileRow[]
  const profileKeys = profiles.map((profile) => profile.profile_key)
  const latestMetrics = new Map<string, MetricRow>()

  if (profileKeys.length) {
    const metricsResult = await supabase
      .from("country_occupation_metric_snapshots")
      .select("profile_key,as_of_date,opportunity_score,score_status")
      .in("profile_key", profileKeys)
      .order("as_of_date", { ascending: false })
    if (metricsResult.error) throw metricsResult.error
    for (const row of (metricsResult.data ?? []) as MetricRow[]) {
      if (!latestMetrics.has(row.profile_key)) latestMetrics.set(row.profile_key, row)
    }
  }

  const byCountry = new Map<string, CareerMarketRecommendation>()
  for (const profile of profiles) {
    const metric = latestMetrics.get(profile.profile_key)
    byCountry.set(profile.country_code, {
      countryCode: profile.country_code,
      countryName: countryName(profile.country_code),
      officialTitle: profile.official_title,
      opportunityScore: metric?.opportunity_score ?? null,
      scoreStatus: metric?.score_status ?? null,
      registrationRequired: profile.registration_required,
      publicationStatus: profile.publication_status,
      demand: toDemand(careerId, profile.country_code),
    })
  }

  for (const demand of OCCUPATION_DETAILS.find((detail) => detail.id === careerId)?.demand ?? []) {
    if (!byCountry.has(demand.countryCode)) {
      byCountry.set(demand.countryCode, {
        countryCode: demand.countryCode,
        countryName: demand.countryLabel,
        officialTitle: null,
        opportunityScore: null,
        scoreStatus: null,
        registrationRequired: null,
        publicationStatus: null,
        demand: toDemand(careerId, demand.countryCode),
      })
    }
  }

  return [...byCountry.values()]
    .sort((first, second) => (second.opportunityScore ?? -1) - (first.opportunityScore ?? -1) || first.countryName.localeCompare(second.countryName))
    .slice(0, 8)
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
      demand: null,
      recommendations: await getCareerCountryRecommendations(careerId),
      visas: [],
    }
  }

  const [profile, visaResult, recommendations] = await Promise.all([
    getCountryOccupationProfile(country, careerId),
    supabase
      .from("visa_pathways")
      .select("visa_name,kind,note,authority,source_url,source_title,last_verified_on")
      .eq("country_code", country)
      .order("display_order", { ascending: true })
      .limit(4),
    getCareerCountryRecommendations(careerId),
  ])
  if (visaResult.error) throw visaResult.error

  return {
    career: base,
    country: { code: country, name: countryName(country) },
    profile,
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
