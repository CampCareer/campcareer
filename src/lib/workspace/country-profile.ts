/**
 * Country profile data for the Countries explorer dashboard.
 *
 * Priority countries (AU, CA, US) carry real, sourced figures derived from the
 * workshop data registry. Other launch countries fall back to a shell profile
 * with placeholder "source pending" cards until their data is imported.
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
    salary: {
      value: 75561,
      currency: "USD",
      unit: "median household income",
      note: "Median of state median household incomes across all 50 states + DC.",
      source: "US Census Bureau ACS",
      url: "https://www.census.gov/acs/www/data/data-tables-and-tools/",
    },
    livingCost: {
      value: 1162,
      currency: "USD",
      unit: "median monthly gross rent",
      note: "Median of state median gross rents across all 50 states + DC.",
      source: "US Census Bureau ACS",
      url: "https://www.census.gov/acs/www/data/data-tables-and-tools/",
    },
    workOpportunities: {
      headline: "Occupations with the strongest shortage signals",
      items: [
        { title: "Software Developers", detail: "High shortage score across states" },
        { title: "Financial Managers", detail: "High shortage score across states" },
        { title: "Medical and Health Services Managers", detail: "High shortage score across states" },
        { title: "Computer and Information Systems Managers", detail: "High shortage score across states" },
        { title: "Nurse Practitioners", detail: "High shortage score across states" },
        { title: "Management Analysts", detail: "High shortage score across states" },
      ],
      source: "BLS shortage score by state",
      url: "https://www.bls.gov",
    },
  },
}

export function getCountryProfile(code: string): CountryProfile | null {
  return COUNTRY_PROFILES[code] ?? null
}
