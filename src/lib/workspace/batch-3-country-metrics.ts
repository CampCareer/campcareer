import "server-only"
import { supabaseAdmin } from "@/lib/supabase-admin"
import {
  buildCountryMetrics,
  COUNTRY_METRIC_KEYS,
  type CountryMetricRecord,
  type CountryMetrics,
  type CountryMetricSnapshotRecord,
  type CountryMetricSourceRecord,
} from "./country-metric-contract"

type PublishedMetricRow = {
  id: string
  metric_key: string
  value: unknown
  source_name: string
  source_url: string
  data_as_of: string | null
  last_verified_at: string | null
  confidence: string
}

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  NO: "NOK",
  SE: "SEK",
  DK: "DKK",
  FI: "EUR",
  CH: "CHF",
  AE: "AED",
}

function metricUnit(countryCode: string, metricKey: string) {
  const currency = CURRENCY_BY_COUNTRY[countryCode]
  if (!currency) return null
  if (["full_time_annual_earnings_range", "average_annual_salary", "tuition_annual_low", "tuition_annual_high"].includes(metricKey)) return `${currency}/year`
  if (metricKey === "national_minimum_hourly_wage") return `${currency}/hour`
  if (metricKey === "student_living_cost_monthly_range") return `${currency}/month`
  if (metricKey === "visa_application_fee") return currency
  if (metricKey === "student_work_hours_limit") return "hours/week"
  return null
}

function sourceOrganisation(row: PublishedMetricRow) {
  const url = row.source_url
  if (url.includes("ssb.no")) return "Statistics Norway"
  if (url.includes("studyinnorway.no")) return "Study in Norway"
  if (url.includes("ntnu.edu")) return "Norwegian University of Science and Technology"
  if (url.includes("uib.no")) return "University of Bergen"
  if (url.includes("arbeidstilsynet.no")) return "Norwegian Labour Inspection Authority"
  if (url.includes("udi.no")) return "Norwegian Directorate of Immigration"
  if (url.includes("nav.no")) return "Norwegian Labour and Welfare Administration"
  if (url.includes("scb.se")) return "Statistics Sweden"
  if (url.includes("migrationsverket.se")) return "Swedish Migration Agency"
  if (url.includes("av.se")) return "Swedish Work Environment Authority"
  if (url.includes("kth.se")) return "KTH Royal Institute of Technology"
  if (url.includes("su.se")) return "Stockholm University"
  if (url.includes("universityadmissions.se")) return "University Admissions in Sweden"
  if (url.includes("arbetsformedlingen.se")) return "Swedish Public Employment Service"
  if (url.includes("dst.dk") || url.includes("statbank.dk")) return "Statistics Denmark"
  if (url.includes("studyindenmark.dk")) return "Study in Denmark"
  if (url.includes("nyidanmark.dk")) return "Danish Agency for International Recruitment and Integration"
  if (url.includes("lifeindenmark.borger.dk")) return "Life in Denmark"
  if (url.includes("aau.dk")) return "Aalborg University"
  if (url.includes("workindenmark.dk")) return "Work in Denmark"
  if (url.includes("ku.dk")) return "University of Copenhagen"
  if (url.includes("stat.fi") || url.includes("pxweb2.stat.fi") || url.includes("pxdata.stat.fi")) return "Statistics Finland"
  if (url.includes("studyinfinland.fi")) return "Study in Finland"
  if (url.includes("migri.fi")) return "Finnish Immigration Service"
  if (url.includes("infofinland.fi")) return "InfoFinland"
  if (url.includes("tuni.fi")) return "Tampere University"
  if (url.includes("aalto.fi")) return "Aalto University"
  if (url.includes("tyomarkkinatori.fi")) return "Job Market Finland"
  if (url.includes("helsinki.fi")) return "University of Helsinki"
  if (url.includes("bfs.admin.ch") || url.includes("dam-api.bfs.admin.ch") || url.includes("edi.admin.ch")) return "Swiss Federal Statistical Office"
  if (url.includes("seco.admin.ch")) return "State Secretariat for Economic Affairs"
  if (url.includes("sem.admin.ch")) return "State Secretariat for Migration"
  if (url.includes("eda.admin.ch") || url.includes("schweiz-")) return "Federal Department of Foreign Affairs"
  if (url.includes("swissuniversities.ch")) return "swissuniversities"
  if (url.includes("unige.ch")) return "University of Geneva"
  if (url.includes("usi.ch")) return "Università della Svizzera italiana"
  if (url.includes("epfl.ch")) return "EPFL"
  if (url.includes("webapps.ilo.org") || url.includes("ilo.org")) return "International Labour Organization"
  if (url.includes("u.ae")) return "UAE Government"
  if (url.includes("mohre.gov.ae")) return "Ministry of Human Resources and Emiratisation"
  if (url.includes("icp.gov.ae")) return "Federal Authority for Identity, Citizenship, Customs and Port Security"
  if (url.includes("ku.ac.ae")) return "Khalifa University"
  if (url.includes("aus.edu")) return "American University of Sharjah"
  return row.source_name
}

export async function getBatch3CountryMetrics(countryCode: string): Promise<CountryMetrics> {
  const code = countryCode.trim().toUpperCase()
  if (!CURRENCY_BY_COUNTRY[code]) return { sources: [] }

  const { data, error } = await supabaseAdmin
    .from("report_metric_evidence_country")
    .select("id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence")
    .eq("scope_type", "country")
    .eq("scope_id", code)
    .eq("review_status", "verified")
    .in("metric_key", [...COUNTRY_METRIC_KEYS])
    .order("last_verified_at", { ascending: false, nullsFirst: false })

  if (error) {
    console.error(`[batch-3-country-metrics] ${code} query failed:`, error)
    return { sources: [] }
  }

  const rows = (data ?? []) as PublishedMetricRow[]
  const metrics: CountryMetricRecord[] = rows.map((row) => ({
    sourceSnapshotId: row.id,
    metricKey: row.metric_key,
    value: row.value,
    unit: metricUnit(code, row.metric_key),
    confidence: row.confidence,
    verifiedAt: row.last_verified_at,
    effectiveFrom: row.data_as_of,
  }))
  const snapshots: CountryMetricSnapshotRecord[] = rows.map((row) => ({
    id: row.id,
    sourceId: row.id,
    sourceUrl: row.source_url,
    dataAsOf: row.data_as_of,
  }))
  const sources: CountryMetricSourceRecord[] = rows.map((row) => ({
    id: row.id,
    organisationName: sourceOrganisation(row),
    sourceName: row.source_name,
  }))

  return buildCountryMetrics(metrics, snapshots, sources)
}
