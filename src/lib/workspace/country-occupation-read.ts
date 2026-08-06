import "server-only"

import { supabase } from "@/lib/supabase"
import type {
  CountryOccupationLink,
  CountryOccupationMetric,
  CountryOccupationProfile,
  CountryOccupationProgramLink,
  CountryOccupationRegionMetric,
  CountryOccupationSpecialisation,
} from "@/lib/workspace/country-occupation-contract"

const numeric = (value: unknown): number | null => {
  if (value == null || value === "") return null
  const result = Number(value)
  return Number.isFinite(result) ? result : null
}

export async function getCountryOccupationProfile(
  countryCode: string,
  canonicalCareerId: string
): Promise<CountryOccupationProfile | null> {
  const country = countryCode.trim().toUpperCase()
  const career = canonicalCareerId.trim()
  if (!/^[A-Z]{2}$/.test(country) || !career) return null

  const profileResult = await supabase
    .from("country_occupation_profiles")
    .select("profile_key, country_code, canonical_career_id, official_title, official_code_system, official_code_version, official_unit_group_code, currency, registration_required, registration_authority, registration_url, publication_status, source_checked_at")
    .eq("country_code", country)
    .eq("canonical_career_id", career)
    .maybeSingle()

  if (profileResult.error) throw profileResult.error
  const profile = profileResult.data
  if (!profile) return null

  const metricResult = await supabase
    .from("country_occupation_metric_snapshots")
    .select("as_of_date, employment_total, median_weekly_earnings, median_hourly_earnings, annualised_median_salary, all_occupations_median_weekly, part_time_share_pct, female_share_pct, median_age, average_full_time_hours, vacancies_three_month_avg, vacancy_period, vacancy_yoy_pct, employment_growth_5y_pct, employment_growth_10y_pct, shortage_component, vacancy_intensity_component, employer_diversity_component, vacancy_trend_component, entry_level_component, salary_component, growth_component, visa_component, entry_burden_component, opportunity_score, score_methodology_version, score_status, score_evidence, source_checked_at")
    .eq("profile_key", profile.profile_key)
    .order("as_of_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (metricResult.error) throw metricResult.error
  const metricRow = metricResult.data
  if (!metricRow) return null

  const [specialisationsResult, regionsResult, linksResult, programsResult] = await Promise.all([
    supabase
      .from("country_occupation_specialisations")
      .select("official_code, official_title, legacy_code_system, legacy_code_version, legacy_code, shortage_rating, visa_eligible, included_in_rollup")
      .eq("profile_key", profile.profile_key)
      .order("sort_order", { ascending: true }),
    supabase
      .from("country_occupation_region_metrics")
      .select("region_code, as_of_date, shortage_rating, vacancy_count, source_url")
      .eq("profile_key", profile.profile_key)
      .eq("as_of_date", metricRow.as_of_date)
      .order("vacancy_count", { ascending: false, nullsFirst: false }),
    supabase
      .from("country_occupation_links")
      .select("link_type, label, url, provider_type, region_code")
      .eq("profile_key", profile.profile_key)
      .order("link_type", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("country_occupation_program_links")
      .select("program_ref, relation_type")
      .eq("profile_key", profile.profile_key)
      .order("program_ref", { ascending: true }),
  ])

  for (const result of [specialisationsResult, regionsResult, linksResult, programsResult]) {
    if (result.error) throw result.error
  }

  const metric: CountryOccupationMetric = {
    asOfDate: metricRow.as_of_date,
    employmentTotal: numeric(metricRow.employment_total),
    medianWeeklyEarnings: numeric(metricRow.median_weekly_earnings),
    medianHourlyEarnings: numeric(metricRow.median_hourly_earnings),
    annualisedMedianSalary: numeric(metricRow.annualised_median_salary),
    allOccupationsMedianWeekly: numeric(metricRow.all_occupations_median_weekly),
    partTimeSharePct: numeric(metricRow.part_time_share_pct),
    femaleSharePct: numeric(metricRow.female_share_pct),
    medianAge: numeric(metricRow.median_age),
    averageFullTimeHours: numeric(metricRow.average_full_time_hours),
    vacanciesThreeMonthAvg: numeric(metricRow.vacancies_three_month_avg),
    vacancyPeriod: metricRow.vacancy_period,
    vacancyYoyPct: numeric(metricRow.vacancy_yoy_pct),
    employmentGrowth5yPct: numeric(metricRow.employment_growth_5y_pct),
    employmentGrowth10yPct: numeric(metricRow.employment_growth_10y_pct),
    opportunityScore: Number(metricRow.opportunity_score),
    scoreMethodologyVersion: metricRow.score_methodology_version,
    scoreStatus: metricRow.score_status,
    scoreEvidence: (metricRow.score_evidence ?? {}) as Record<string, unknown>,
    score: {
      shortage: Number(metricRow.shortage_component),
      vacancyIntensity: Number(metricRow.vacancy_intensity_component),
      employerDiversity: Number(metricRow.employer_diversity_component),
      vacancyTrend: Number(metricRow.vacancy_trend_component),
      entryLevel: Number(metricRow.entry_level_component),
      salary: Number(metricRow.salary_component),
      growth: Number(metricRow.growth_component),
      visa: Number(metricRow.visa_component),
      entryBurden: Number(metricRow.entry_burden_component),
    },
    sourceCheckedAt: metricRow.source_checked_at,
  }

  const specialisations: CountryOccupationSpecialisation[] = (specialisationsResult.data ?? []).map((row) => ({
    officialCode: row.official_code,
    officialTitle: row.official_title,
    legacyCodeSystem: row.legacy_code_system,
    legacyCodeVersion: row.legacy_code_version,
    legacyCode: row.legacy_code,
    shortageRating: numeric(row.shortage_rating),
    visaEligible: row.visa_eligible,
    includedInRollup: row.included_in_rollup,
  }))

  const regions: CountryOccupationRegionMetric[] = (regionsResult.data ?? []).map((row) => ({
    regionCode: row.region_code,
    asOfDate: row.as_of_date,
    shortageRating: numeric(row.shortage_rating),
    vacancyCount: numeric(row.vacancy_count),
    sourceUrl: row.source_url,
  }))

  const links: CountryOccupationLink[] = (linksResult.data ?? []).map((row) => ({
    linkType: row.link_type,
    label: row.label,
    url: row.url,
    providerType: row.provider_type,
    regionCode: row.region_code,
  }))

  const programLinks: CountryOccupationProgramLink[] = (programsResult.data ?? []).map((row) => ({
    programRef: row.program_ref,
    relationType: row.relation_type,
  }))

  return {
    profileKey: profile.profile_key,
    countryCode: profile.country_code,
    canonicalCareerId: profile.canonical_career_id,
    officialTitle: profile.official_title,
    officialCodeSystem: profile.official_code_system,
    officialCodeVersion: profile.official_code_version,
    officialUnitGroupCode: profile.official_unit_group_code,
    currency: profile.currency,
    registrationRequired: profile.registration_required,
    registrationAuthority: profile.registration_authority,
    registrationUrl: profile.registration_url,
    publicationStatus: profile.publication_status,
    sourceCheckedAt: profile.source_checked_at,
    metric,
    specialisations,
    regions,
    links,
    programLinks,
  }
}
