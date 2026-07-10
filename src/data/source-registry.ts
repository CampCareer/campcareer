export const CORE_DATA_CATEGORIES = [
  "tuition",
  "graduate-outcomes",
  "occupation",
  "rent",
  "visa-pathway",
  "shortage",
] as const

export type CoreDataCategory = (typeof CORE_DATA_CATEGORIES)[number]
export type RegistryCountryCode = "AU" | "US" | "CA" | "UK" | "IE" | "DE" | "NL" | "BE" | "SG"
export type SourceConfidence = "official" | "market-estimate" | "internal-estimate"
export type SourceMethod = "official-api" | "official-download" | "official-web" | "market-estimate"
export type ReviewStatus = "approved" | "review-required"

export type SourceRecord = {
  country: RegistryCountryCode
  category: CoreDataCategory
  sourceName: string
  sourceUrl: string
  retrievedAt: string
  lastChecked: string
  confidence: SourceConfidence
  method: SourceMethod
  reviewStatus: ReviewStatus
  refreshCadence: "monthly" | "quarterly" | "annual"
}

const CHECKED_AT = "2026-07-10"

type SourceSeed = Omit<SourceRecord, "country" | "category" | "retrievedAt" | "lastChecked" | "confidence" | "reviewStatus">
type CountrySourceSeed = Record<CoreDataCategory, SourceSeed>

const COUNTRY_SOURCES: Record<RegistryCountryCode, CountrySourceSeed> = {
  AU: {
    tuition: { sourceName: "Study Australia course search", sourceUrl: "https://www.studyaustralia.gov.au/en/plan-your-move/how-to-apply", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "QILT Graduate Outcomes Survey", sourceUrl: "https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Jobs and Skills Australia", sourceUrl: "https://www.jobsandskills.gov.au/data/occupation-shortages", method: "official-download", refreshCadence: "quarterly" },
    rent: { sourceName: "Australian Bureau of Statistics housing data", sourceUrl: "https://www.abs.gov.au/statistics/people/housing/housing-occupancy-and-costs", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "Department of Home Affairs", sourceUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Jobs and Skills Australia Occupation Shortage List", sourceUrl: "https://www.jobsandskills.gov.au/data/occupation-shortages", method: "official-download", refreshCadence: "quarterly" },
  },
  US: {
    tuition: { sourceName: "College Scorecard", sourceUrl: "https://collegescorecard.ed.gov/data/", method: "official-api", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "College Scorecard", sourceUrl: "https://collegescorecard.ed.gov/data/", method: "official-api", refreshCadence: "annual" },
    occupation: { sourceName: "Bureau of Labor Statistics OEWS", sourceUrl: "https://www.bls.gov/oes/", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "US Census Bureau ACS", sourceUrl: "https://www.census.gov/programs-surveys/acs", method: "official-api", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "USCIS Optional Practical Training", sourceUrl: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Bureau of Labor Statistics Employment Projections", sourceUrl: "https://www.bls.gov/emp/", method: "official-download", refreshCadence: "annual" },
  },
  CA: {
    tuition: { sourceName: "Statistics Canada tuition survey", sourceUrl: "https://www150.statcan.gc.ca/n1/en/subjects/education_training_and_learning/tuition_costs", method: "official-download", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statistics Canada education outcomes", sourceUrl: "https://www.statcan.gc.ca/en/subjects-start/education_training_and_learning", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Government of Canada Job Bank", sourceUrl: "https://www.jobbank.gc.ca/trend-analysis", method: "official-web", refreshCadence: "quarterly" },
    rent: { sourceName: "Canada Mortgage and Housing Corporation", sourceUrl: "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-data", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "IRCC Post-Graduation Work Permit", sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Government of Canada Job Bank outlook", sourceUrl: "https://www.jobbank.gc.ca/trend-analysis", method: "official-web", refreshCadence: "quarterly" },
  },
  UK: {
    tuition: { sourceName: "Discover Uni", sourceUrl: "https://discoveruni.gov.uk/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "HESA Graduate Outcomes", sourceUrl: "https://www.hesa.ac.uk/data-and-analysis/graduates", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Office for National Statistics ASHE", sourceUrl: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Office for National Statistics private rental prices", sourceUrl: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentalpricesuk", method: "official-download", refreshCadence: "monthly" },
    "visa-pathway": { sourceName: "GOV.UK Graduate visa", sourceUrl: "https://www.gov.uk/graduate-visa", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Office for National Statistics labour market data", sourceUrl: "https://www.ons.gov.uk/employmentandlabourmarket", method: "official-download", refreshCadence: "quarterly" },
  },
  IE: {
    tuition: { sourceName: "Higher Education Authority", sourceUrl: "https://hea.ie/statistics/", method: "official-download", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "CSO Higher Education Outcomes", sourceUrl: "https://www.cso.ie/en/releasesandpublications/ep/p-heo/highereducationoutcomes/", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Central Statistics Office earnings data", sourceUrl: "https://www.cso.ie/en/statistics/earnings/", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Residential Tenancies Board rent index", sourceUrl: "https://www.rtb.ie/research-and-policy/rent-index", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Irish Immigration Service Third Level Graduate Programme", sourceUrl: "https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "DETE Critical Skills Occupations List", sourceUrl: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/", method: "official-web", refreshCadence: "quarterly" },
  },
  DE: {
    tuition: { sourceName: "DAAD Study in Germany", sourceUrl: "https://www.daad.de/en/studying-in-germany/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Destatis education statistics", sourceUrl: "https://www.destatis.de/EN/Themes/Society-Environment/Education-Research-Culture/_node.html", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Federal Employment Agency Entgeltatlas", sourceUrl: "https://web.arbeitsagentur.de/entgeltatlas/", method: "official-web", refreshCadence: "quarterly" },
    rent: { sourceName: "Destatis housing data", sourceUrl: "https://www.destatis.de/EN/Themes/Society-Environment/Housing/_node.html", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "Make it in Germany", sourceUrl: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Federal Employment Agency skilled labour shortage analysis", sourceUrl: "https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Fachkraeftebedarf/Engpassanalyse/Engpassanalyse-Nav.html", method: "official-download", refreshCadence: "annual" },
  },
  NL: {
    tuition: { sourceName: "Study in NL", sourceUrl: "https://www.studyinnl.org/finances", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statistics Netherlands education data", sourceUrl: "https://www.cbs.nl/en-gb/dossier/education", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "UWV labour market information", sourceUrl: "https://www.uwv.nl/en/labour-market-information", method: "official-web", refreshCadence: "quarterly" },
    rent: { sourceName: "Statistics Netherlands housing data", sourceUrl: "https://www.cbs.nl/en-gb/dossier/housing", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "IND orientation year", sourceUrl: "https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "UWV labour market information", sourceUrl: "https://www.uwv.nl/en/labour-market-information", method: "official-web", refreshCadence: "quarterly" },
  },
  BE: {
    tuition: { sourceName: "Study in Flanders", sourceUrl: "https://www.studyinflanders.be/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statbel labour market statistics", sourceUrl: "https://statbel.fgov.be/en/themes/work-training/labour-market", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Statbel wages and salaries", sourceUrl: "https://statbel.fgov.be/en/themes/work-training/wages-and-labourcost/overview-belgian-wages-and-salaries", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Statbel housing statistics", sourceUrl: "https://statbel.fgov.be/en/themes/housing", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "IBZ search year after higher studies", sourceUrl: "https://dofi.ibz.be/en/themes/third-country-nationals/study/search-year-after-higher-studies", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "VDAB shortage occupations", sourceUrl: "https://www.vdab.be/trends-en-cijfers/knelpuntberoepenlijst", method: "official-web", refreshCadence: "quarterly" },
  },
  SG: {
    tuition: { sourceName: "Ministry of Education Singapore", sourceUrl: "https://www.moe.gov.sg/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "MOE Graduate Employment Survey", sourceUrl: "https://www.moe.gov.sg/news/press-releases", method: "official-web", refreshCadence: "annual" },
    occupation: { sourceName: "MOM Occupational Wages 2025", sourceUrl: "https://stats.mom.gov.sg/Pages/Occupational-Wages-Tables2025.aspx", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Urban Redevelopment Authority rental statistics", sourceUrl: "https://www.ura.gov.sg/news/media/pr26-31/", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Immigration and Checkpoints Authority Student's Pass", sourceUrl: "https://www.ica.gov.sg/reside/STP/apply?pageid=325&secid=182", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "MOM Job Vacancies 2025", sourceUrl: "https://stats.mom.gov.sg/Pages/Job-Vacancies-2025.aspx", method: "official-download", refreshCadence: "annual" },
  },
}

export const SOURCE_REGISTRY: SourceRecord[] = (Object.entries(COUNTRY_SOURCES) as Array<[RegistryCountryCode, CountrySourceSeed]>).flatMap(
  ([country, sources]) => CORE_DATA_CATEGORIES.map((category) => ({
    country,
    category,
    ...sources[category],
    retrievedAt: CHECKED_AT,
    lastChecked: CHECKED_AT,
    confidence: "official" as const,
    reviewStatus: category === "visa-pathway" ? "review-required" as const : "approved" as const,
  })),
)

export function getCountrySource(country: RegistryCountryCode, category: CoreDataCategory): SourceRecord {
  const source = SOURCE_REGISTRY.find((item) => item.country === country && item.category === category)
  if (!source) throw new Error(`Missing ${category} source for ${country}`)
  return source
}

export function getSourceRegistryCoverageIssues(records = SOURCE_REGISTRY): string[] {
  return (Object.keys(COUNTRY_SOURCES) as RegistryCountryCode[]).flatMap((country) =>
    CORE_DATA_CATEGORIES
      .filter((category) => !records.some((record) => record.country === country && record.category === category))
      .map((category) => `${country}:${category}`),
  )
}
