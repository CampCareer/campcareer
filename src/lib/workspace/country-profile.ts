/**
 * Workforce opportunity summaries used by the standard country dashboards.
 * Numeric salary and living-cost evidence is read from Supabase through the
 * country metric publication layer instead of being duplicated here.
 */

export type CountryStat = {
  value: number
  currency: string
  unit: string
  note: string
  source: string
  url: string
}

export type WorkOpportunity = {
  title: string
  detail: string
}

export type CountryProfile = {
  code: string
  salary?: CountryStat
  livingCost?: CountryStat
  workOpportunities: {
    headline: string
    items: WorkOpportunity[]
    source: string
    url: string
  } | null
}

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  AU: {
    code: "AU",
    workOpportunities: {
      headline: "Occupations in national shortage",
      items: [
        { title: "Construction Project Manager", detail: "National shortage" },
        { title: "Taxation Accountant", detail: "National shortage" },
        { title: "External Auditor", detail: "National shortage" },
        { title: "Actuary", detail: "National shortage" },
        { title: "Engineering Surveyor", detail: "National shortage" },
        { title: "Registered Nurse", detail: "National shortage" },
      ],
      source: "Jobs and Skills Australia — 2025 Occupation Shortage List",
      url: "https://www.jobsandskills.gov.au",
    },
  },

  CA: {
    code: "CA",
    salary: {
      value: 63000,
      currency: "CAD",
      unit: "median annual wage across occupations",
      note: "Median of median wages across 514 NOC occupations.",
      source: "Statistics Canada / Job Bank",
      url: "https://www.jobbank.gc.ca/trend-analysis/wages",
    },
    workOpportunities: {
      headline: "Occupations in high demand",
      items: [
        { title: "Registered nurses and registered psychiatric nurses", detail: "Strong shortage risk" },
        { title: "Nurse aides, orderlies and patient service associates", detail: "Strong shortage risk" },
        { title: "Early childhood educators and assistants", detail: "Strong shortage risk" },
        { title: "Social and community service workers", detail: "Strong shortage risk" },
        { title: "General practitioners and family physicians", detail: "Strong shortage risk" },
        { title: "Carpenters", detail: "Strong shortage risk" },
      ],
      source: "ESDC COPS shortage ratings",
      url: "https://www.jobbank.gc.ca/trend-analysis",
    },
  },

  US: {
    code: "US",
    workOpportunities: {
      headline: "Occupations with strong projected growth",
      items: [
        { title: "Software Developers", detail: "267,700 projected new jobs, 2024–34" },
        { title: "Registered Nurses", detail: "166,100 projected new jobs, 2024–34" },
        { title: "Nurse Practitioners", detail: "40.1% projected growth, 2024–34" },
        { title: "Data Scientists", detail: "33.5% projected growth, 2024–34" },
        { title: "Information Security Analysts", detail: "28.5% projected growth, 2024–34" },
        { title: "Medical and Health Services Managers", detail: "23.2% projected growth, 2024–34" },
      ],
      source: "U.S. Bureau of Labor Statistics — 2024–34 Employment Projections",
      url: "https://www.bls.gov/emp/",
    },
  },
}

export function getCountryProfile(code: string): CountryProfile | null {
  return COUNTRY_PROFILES[code] ?? null
}
