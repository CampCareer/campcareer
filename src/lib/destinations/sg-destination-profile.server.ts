import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"

type DestinationRow = {
  country_code: string
  destination_name: string
  default_currency: string
  scope_kind: string
  study_destination_scope: string
  linked_institution_count: number
  linked_campus_count: number
  linked_program_count: number
  programme_coverage_status: string
}

type InstitutionRow = {
  institution_id: string
  institution_slug: string
  institution_name: string
  uen: string
  website_url: string
  campus_id: string
  campus_name: string
  address_line: string
  postal_code: string
  location_source_url: string
}

type MetricRow = {
  metric_key: string
  value: unknown
  source_name: string
  source_url: string
  data_as_of: string
  confidence: string
  evidence_kind: string
}

export type SingaporeDestinationProfile = {
  countryCode: "SG"
  name: "Singapore"
  currency: "SGD"
  scopeKind: string
  studyDestinationScope: string
  linkedInstitutionCount: number
  linkedCampusCount: number
  linkedProgramCount: number
  programmeCoverage: {
    status: "verification_pending" | "verified_offerings_available"
    label: string
    detail: string
  }
  population: { amount: number; referencePeriod: string | null } | null
  livingCost: { low: number; high: number; currency: string; scenario: string | null } | null
  transport: {
    currency: string
    adultBasicFareLow: number | null
    adultBasicFareHigh: number | null
    adultMonthlyPass: number | null
    universityStudentHybridPass: number | null
    concessionEligibilityRequired: boolean
    note: string | null
  } | null
  workRights: {
    hours: number
    period: string
    schoolTerm: boolean
    eligibleInstitutionsOnly: boolean
    qualifyingIndustrialAttachmentAlternative: boolean
  } | null
  tuition: {
    low: number
    high: number
    currency: string
    studyLevel: string | null
    studentType: string | null
    tuitionGrantObligationApplies: boolean
  } | null
  studentPassApplicationFee: { amount: number; currency: string } | null
  employmentSectors: string[]
  institutions: Array<{
    id: string
    name: string
    slug: string
    uen: string
    websiteUrl: string
    campus: {
      id: string
      name: string
      addressLine: string
      postalCode: string
      sourceUrl: string
    }
  }>
  sources: Array<{ name: string; url: string; dataAsOf: string; confidence: string }>
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

async function loadSingaporeDestinationProfile(): Promise<SingaporeDestinationProfile | null> {
  const [destinationResult, institutionResult, metricResult] = await Promise.all([
    supabaseAdmin
      .from("study_destination_sg_v1")
      .select("country_code,destination_name,default_currency,scope_kind,study_destination_scope,linked_institution_count,linked_campus_count,linked_program_count,programme_coverage_status")
      .eq("country_code", "SG")
      .maybeSingle(),
    supabaseAdmin
      .from("study_destination_institution_sg_v1")
      .select("institution_id,institution_slug,institution_name,uen,website_url,campus_id,campus_name,address_line,postal_code,location_source_url")
      .eq("country_code", "SG")
      .order("institution_name", { ascending: true }),
    supabaseAdmin
      .from("study_destination_metric_sg_v1")
      .select("metric_key,value,source_name,source_url,data_as_of,confidence,evidence_kind")
      .eq("country_code", "SG")
      .order("metric_key", { ascending: true }),
  ])

  if (destinationResult.error) throw new Error(`Unable to load Singapore destination: ${destinationResult.error.message}`)
  if (institutionResult.error) throw new Error(`Unable to load Singapore destination institutions: ${institutionResult.error.message}`)
  if (metricResult.error) throw new Error(`Unable to load Singapore destination metrics: ${metricResult.error.message}`)
  if (!destinationResult.data) return null

  const destination = destinationResult.data as DestinationRow
  const institutionRows = (institutionResult.data ?? []) as InstitutionRow[]
  const metricRows = (metricResult.data ?? []) as MetricRow[]
  const metrics = new Map(metricRows.map((row) => [row.metric_key, row]))

  const populationValue = record(metrics.get("country_population")?.value)
  const populationAmount = numberValue(populationValue.amount)

  const livingValue = record(metrics.get("student_living_cost_monthly_range")?.value)
  const livingLow = numberValue(livingValue.low)
  const livingHigh = numberValue(livingValue.high)

  const transportValue = record(metrics.get("student_transport_reference")?.value)
  const workValue = record(metrics.get("student_work_hours_limit")?.value)
  const workHours = numberValue(workValue.hours)

  const tuitionLowValue = record(metrics.get("tuition_annual_low")?.value)
  const tuitionHighValue = record(metrics.get("tuition_annual_high")?.value)
  const tuitionLow = numberValue(tuitionLowValue.amount)
  const tuitionHigh = numberValue(tuitionHighValue.amount)

  const visaValue = record(metrics.get("visa_application_fee")?.value)
  const visaAmount = numberValue(visaValue.amount)

  const sectorsValue = record(metrics.get("employment_focus_sectors")?.value)
  const programmeStatus = destination.programme_coverage_status === "verified_offerings_available"
    ? "verified_offerings_available"
    : "verification_pending"

  return {
    countryCode: "SG",
    name: "Singapore",
    currency: "SGD",
    scopeKind: destination.scope_kind,
    studyDestinationScope: destination.study_destination_scope,
    linkedInstitutionCount: destination.linked_institution_count,
    linkedCampusCount: destination.linked_campus_count,
    linkedProgramCount: destination.linked_program_count,
    programmeCoverage: {
      status: programmeStatus,
      label: programmeStatus === "verification_pending" ? "Programme delivery verification pending" : "Verified programme offerings available",
      detail: programmeStatus === "verification_pending"
        ? "CampCareer has not yet published a canonical Singapore programme catalogue. Institution or campus presence is never used to infer programme delivery."
        : "Only source-backed programme offerings linked to an explicit campus are counted.",
    },
    population: populationAmount == null ? null : {
      amount: populationAmount,
      referencePeriod: stringValue(populationValue.reference_period),
    },
    livingCost: livingLow == null || livingHigh == null ? null : {
      low: livingLow,
      high: livingHigh,
      currency: stringValue(livingValue.currency) ?? "SGD",
      scenario: stringValue(livingValue.scenario),
    },
    transport: metrics.has("student_transport_reference") ? {
      currency: stringValue(transportValue.currency) ?? "SGD",
      adultBasicFareLow: numberValue(transportValue.adult_basic_card_fare_low),
      adultBasicFareHigh: numberValue(transportValue.adult_basic_card_fare_high),
      adultMonthlyPass: numberValue(transportValue.adult_monthly_travel_pass),
      universityStudentHybridPass: numberValue(transportValue.university_student_hybrid_monthly_pass),
      concessionEligibilityRequired: transportValue.student_concession_eligibility_required === true,
      note: stringValue(transportValue.note),
    } : null,
    workRights: workHours == null ? null : {
      hours: workHours,
      period: stringValue(workValue.period) ?? "week",
      schoolTerm: stringValue(workValue.applies_during) === "school_term",
      eligibleInstitutionsOnly: workValue.eligible_institutions_only === true,
      qualifyingIndustrialAttachmentAlternative: workValue.qualifying_industrial_attachment_alternative === true,
    },
    tuition: tuitionLow == null || tuitionHigh == null ? null : {
      low: tuitionLow,
      high: tuitionHigh,
      currency: stringValue(tuitionLowValue.currency) ?? stringValue(tuitionHighValue.currency) ?? "SGD",
      studyLevel: stringValue(tuitionLowValue.study_level) ?? stringValue(tuitionHighValue.study_level),
      studentType: stringValue(tuitionLowValue.student_type) ?? stringValue(tuitionHighValue.student_type),
      tuitionGrantObligationApplies: tuitionLowValue.three_year_work_obligation === true || tuitionHighValue.three_year_work_obligation === true,
    },
    studentPassApplicationFee: visaAmount == null ? null : {
      amount: visaAmount,
      currency: stringValue(visaValue.currency) ?? "SGD",
    },
    employmentSectors: stringArray(sectorsValue.sectors),
    institutions: institutionRows.map((row) => ({
      id: row.institution_id,
      name: row.institution_name,
      slug: row.institution_slug,
      uen: row.uen,
      websiteUrl: row.website_url,
      campus: {
        id: row.campus_id,
        name: row.campus_name,
        addressLine: row.address_line,
        postalCode: row.postal_code,
        sourceUrl: row.location_source_url,
      },
    })),
    sources: Array.from(new Map(metricRows.map((row) => [row.source_url, {
      name: row.source_name,
      url: row.source_url,
      dataAsOf: row.data_as_of,
      confidence: row.confidence,
    }])).values()),
  }
}

export const getSingaporeDestinationProfile = cache(loadSingaporeDestinationProfile)
