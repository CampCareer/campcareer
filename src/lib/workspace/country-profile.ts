export type CountryStat = { value: number; currency: string; unit: string; note: string; source: string; url: string }
export type WorkOpportunity = { title: string; detail: string }
export type CountryProfile = {
  code: string
  salary?: CountryStat
  livingCost?: CountryStat
  workOpportunities: { headline: string; items: WorkOpportunity[]; source: string; url: string } | null
}

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  AU: { code: "AU", workOpportunities: { headline: "Occupations in national shortage", items: [
    { title: "Construction Project Manager", detail: "National shortage" }, { title: "Taxation Accountant", detail: "National shortage" }, { title: "External Auditor", detail: "National shortage" }, { title: "Actuary", detail: "National shortage" }, { title: "Engineering Surveyor", detail: "National shortage" }, { title: "Registered Nurse", detail: "National shortage" },
  ], source: "Jobs and Skills Australia — 2025 Occupation Shortage List", url: "https://www.jobsandskills.gov.au" } },
  CA: { code: "CA", salary: { value: 63000, currency: "CAD", unit: "median annual wage across occupations", note: "Median of median wages across 514 NOC occupations.", source: "Statistics Canada / Job Bank", url: "https://www.jobbank.gc.ca/trend-analysis/wages" }, workOpportunities: { headline: "Occupations in high demand", items: [
    { title: "Registered nurses and registered psychiatric nurses", detail: "Strong shortage risk" }, { title: "Nurse aides, orderlies and patient service associates", detail: "Strong shortage risk" }, { title: "Early childhood educators and assistants", detail: "Strong shortage risk" }, { title: "Social and community service workers", detail: "Strong shortage risk" }, { title: "General practitioners and family physicians", detail: "Strong shortage risk" }, { title: "Carpenters", detail: "Strong shortage risk" },
  ], source: "ESDC COPS shortage ratings", url: "https://www.jobbank.gc.ca/trend-analysis" } },
  US: { code: "US", workOpportunities: { headline: "Occupations with strong projected growth", items: [
    { title: "Software Developers", detail: "267,700 projected new jobs, 2024–34" }, { title: "Registered Nurses", detail: "166,100 projected new jobs, 2024–34" }, { title: "Nurse Practitioners", detail: "40.1% projected growth, 2024–34" }, { title: "Data Scientists", detail: "33.5% projected growth, 2024–34" }, { title: "Information Security Analysts", detail: "28.5% projected growth, 2024–34" }, { title: "Medical and Health Services Managers", detail: "23.2% projected growth, 2024–34" },
  ], source: "U.S. Bureau of Labor Statistics — 2024–34 Employment Projections", url: "https://www.bls.gov/emp/" } },
  UK: { code: "UK", workOpportunities: { headline: "Occupations in critical or elevated demand", items: [
    { title: "Specialist medical practitioners", detail: "Critical demand" }, { title: "IT business analysts, architects and systems designers", detail: "Critical demand" }, { title: "Senior care workers", detail: "Critical demand" }, { title: "Medical radiographers", detail: "Critical demand" }, { title: "Programmers and software development professionals", detail: "Elevated demand" }, { title: "Secondary education teaching professionals", detail: "Elevated demand" },
  ], source: "Skills England — Occupations in demand 2025", url: "https://www.gov.uk/government/publications/occupations-in-demand-2025" } },
  IE: { code: "IE", workOpportunities: { headline: "Critical Skills occupations", items: [
    { title: "Software developers and ICT specialists", detail: "Critical Skills pathway" }, { title: "Registered nurses", detail: "Critical Skills pathway" }, { title: "Medical practitioners", detail: "Critical Skills pathway" }, { title: "Engineers", detail: "Critical Skills pathway" }, { title: "Medical laboratory scientists", detail: "Critical Skills pathway" }, { title: "Biological scientists and biochemists", detail: "Critical Skills pathway" },
  ], source: "Department of Enterprise — Critical Skills Occupations List", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/" } },
  DE: { code: "DE", workOpportunities: { headline: "Professions in demand", items: [
    { title: "IT specialists", detail: "Skilled-worker demand" }, { title: "Engineers", detail: "Skilled-worker demand" }, { title: "Nursing professionals", detail: "Skilled-worker demand" }, { title: "Physicians", detail: "Skilled-worker demand" }, { title: "Scientists", detail: "Skilled-worker demand" }, { title: "Green jobs and technical trades", detail: "Skilled-worker demand" },
  ], source: "Make it in Germany — Professions in demand", url: "https://www.make-it-in-germany.com/en/working-in-germany/professions-in-demand" } },
  NL: { code: "NL", workOpportunities: { headline: "Promising higher-education occupations", items: [
    { title: "Software and data specialists", detail: "Promising occupation" }, { title: "Cybersecurity specialists", detail: "Promising occupation" }, { title: "Healthcare professionals", detail: "Promising occupation" }, { title: "Engineers and technical specialists", detail: "Promising occupation" }, { title: "Construction professionals", detail: "Promising occupation" }, { title: "Teachers", detail: "Promising occupation" },
  ], source: "UWV — Promising occupations for higher education graduates", url: "https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo" } },
  BE: { code: "BE", workOpportunities: { headline: "Regional shortage occupations", items: [
    { title: "Nurses and care professionals", detail: "Regional shortage" }, { title: "Industrial electromechanics technicians", detail: "Regional shortage" }, { title: "Construction professionals", detail: "Regional shortage" }, { title: "Accountants", detail: "Regional shortage" }, { title: "ICT specialists", detail: "Regional shortage" }, { title: "Teachers", detail: "Regional shortage" },
  ], source: "VDAB and Le Forem shortage lists", url: "https://www.vdab.be/trends-en-cijfers/knelpuntberoepenlijst" } },
  FR: { code: "FR", workOpportunities: { headline: "Fields with high or difficult recruitment", items: [
    { title: "Health and social-care professionals", detail: "High planned hiring" }, { title: "IT and telecommunications specialists", detail: "Difficult recruitment" }, { title: "Construction and civil-engineering roles", detail: "Difficult recruitment" }, { title: "Industrial maintenance technicians", detail: "Difficult recruitment" }, { title: "Hospitality and food-service roles", detail: "High planned hiring" }, { title: "Education and training roles", detail: "Broad national demand" },
  ], source: "France Travail — Besoins en Main-d'Œuvre 2026", url: "https://statistiques.francetravail.org/bmo/bmopub?year=2026" } },
}

export function getCountryProfile(code: string): CountryProfile | null { return COUNTRY_PROFILES[code] ?? null }
