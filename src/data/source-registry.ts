import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"

export const CORE_DATA_CATEGORIES = [
  "tuition",
  "graduate-outcomes",
  "occupation",
  "rent",
  "visa-pathway",
  "shortage",
] as const

export type CoreDataCategory = (typeof CORE_DATA_CATEGORIES)[number]
export type RegistryCountryCode = "AU" | "US" | "CA" | "UK" | "IE" | "DE" | "NL" | "BE" | "SG" | "KR" | "FR" | "ES" | "NZ" | "NO" | "SE" | "DK" | "FI"
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
  KR: {
    tuition: { sourceName: "대학알리미", sourceUrl: "https://m.academyinfo.go.kr/intro/intro0300/intro.do", method: "official-download", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "대학알리미 졸업 후 상황 공시", sourceUrl: "https://www.academyinfo.go.kr/", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "고용노동부 사업체노동력조사", sourceUrl: "https://laborstat.moel.go.kr/", method: "official-download", refreshCadence: "quarterly" },
    rent: { sourceName: "국토교통부 전월세 실거래가", sourceUrl: "https://rt.molit.go.kr/", method: "official-api", refreshCadence: "monthly" },
    "visa-pathway": { sourceName: "Korea Visa Portal", sourceUrl: "https://www.visa.go.kr/", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "고용노동부 사업체노동력조사", sourceUrl: "https://laborstat.moel.go.kr/", method: "official-download", refreshCadence: "quarterly" },
  },
  FR: {
    tuition: { sourceName: "Campus France", sourceUrl: "https://www.campusfrance.org/en", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "French Ministry of Higher Education", sourceUrl: "https://www.enseignementsup-recherche.gouv.fr/en", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "INSEE private-sector salaries by PCS", sourceUrl: "https://www.insee.fr/fr/statistiques/2021266", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Carte des loyers", sourceUrl: "https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "France-Visas", sourceUrl: "https://france-visas.gouv.fr/en", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "France Travail BMO 2026", sourceUrl: "https://statistiques.francetravail.org/bmo/", method: "official-download", refreshCadence: "annual" },
  },
  ES: {
    tuition: { sourceName: "RUCT", sourceUrl: "https://www.educacion.gob.es/ruct/home", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Spanish university statistics", sourceUrl: "https://estadisticas.universidades.gob.es/", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "INE Annual Wage Structure Survey 2024", sourceUrl: "https://ine.es/dyngs/Prensa/EAES2024.htm", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "SERPAVI 2026", sourceUrl: "https://serpavi.mivau.gob.es/", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "Spain Migration information sheets", sourceUrl: "https://www.inclusion.gob.es/web/migraciones/estudiar", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "SEPE Catálogo de Ocupaciones de Difícil Cobertura", sourceUrl: "https://www.sepe.es/HomeSepe/empresas/informacion-para-empresas/profesiones-de-dificil-cobertura/profesiones-mas-demandadas", method: "official-download", refreshCadence: "quarterly" },
  },
  NZ: {
    tuition: { sourceName: "Education New Zealand — Study with New Zealand", sourceUrl: "https://www.studywithnz.govt.nz/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Stats NZ Income Survey", sourceUrl: "https://www.stats.govt.nz/information-releases/income-statistics-year-ended-june-2025/", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Hīkina te Mahi — Skill Shortage Lists", sourceUrl: "https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-nz/skill-shortage-lists", method: "official-web", refreshCadence: "quarterly" },
    rent: { sourceName: "Tenancy Services NZ Bond Data", sourceUrl: "https://www.tenancy.govt.nz/rent-bond/rent-bond-statistics/", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Immigration New Zealand — Study to Work pathway", sourceUrl: "https://www.immigration.govt.nz/new-zealand-visas/applying-for-a-visa/visa-factsheet/going-from-study-to-work", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Immigration New Zealand Green List", sourceUrl: "https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/green-list", method: "official-web", refreshCadence: "monthly" },
  },
  NO: {
    tuition: { sourceName: "Study in Norway", sourceUrl: "https://www.studyinnorway.no/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statistics Norway (SSB) Earnings Statistics", sourceUrl: "https://www.ssb.no/en/arbeid-og-lonn/lonn-og-arbeidskraftskostnader", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "NAV Occupation Information", sourceUrl: "https://www.nav.no/en/home/work-and-attendance/work-in-norway", method: "official-web", refreshCadence: "quarterly" },
    rent: { sourceName: "Statistics Norway (SSB) Housing Statistics", sourceUrl: "https://www.ssb.no/en/boliger-og-eiendommer/utleie-og-bosituasjoner", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Norwegian Directorate of Immigration (UDI)", sourceUrl: "https://www.udi.no/en/want-to-apply/work-immigration/", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "NAV Labour Market Shortage Statistics", sourceUrl: "https://www.nav.no/en/home/work-and-attendance/work-in-norway/shortage-occupations", method: "official-download", refreshCadence: "quarterly" },
  },
  SE: {
    tuition: { sourceName: "Universityadmissions.se", sourceUrl: "https://www.universityadmissions.se/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statistics Sweden (SCB) Education Outcomes", sourceUrl: "https://www.scb.se/en/statistics/education/", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Swedish Public Employment Service (Arbetsförmedlingen)", sourceUrl: "https://arbetsformedlingen.se/for-arbetssokande/yrken-och-framtid/yrkesprognoser", method: "official-download", refreshCadence: "quarterly" },
    rent: { sourceName: "Statistics Sweden (SCB) Housing Statistics", sourceUrl: "https://www.scb.se/en/statistics/housing-and-construction/", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Swedish Migration Agency (Migrationsverket)", sourceUrl: "https://www.migrationsverket.se/English/Private-individuals/Working-in-Sweden/", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Swedish Public Employment Service Shortage Analysis", sourceUrl: "https://arbetsformedlingen.se/for-arbetssokande/yrken-och-framtid/yrkesprognoser", method: "official-download", refreshCadence: "quarterly" },
  },
  DK: {
    tuition: { sourceName: "Study in Denmark", sourceUrl: "https://studyindenmark.dk/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statistics Denmark (DST) Education Outcomes", sourceUrl: "https://www.dst.dk/en/statistik/emner/uddannelse-og-viden", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Danish Agency for Labour Market and Recruitment (STAR)", sourceUrl: "https://starservice.mim.dk/starservice/occupations/list", method: "official-download", refreshCadence: "quarterly" },
    rent: { sourceName: "Statistics Denmark (DST) Housing Statistics", sourceUrl: "https://www.dst.dk/en/statistik/emner/boliger-og-ejendomme", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Danish Agency for International Recruitment (SIRI)", sourceUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/US/Establishment-Card/", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "STAR Shortage Occupation List", sourceUrl: "https://starservice.mim.dk/starservice/occupations/list", method: "official-download", refreshCadence: "quarterly" },
  },
  FI: {
    tuition: { sourceName: "Study in Finland", sourceUrl: "https://www.studyinfinland.fi/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Statistics Finland Education Outcomes", sourceUrl: "https://stat.fi/en/statistics/education", method: "official-download", refreshCadence: "annual" },
    occupation: { sourceName: "Finnish Ministry of Economic Affairs and Employment", sourceUrl: "https://tyo-ja-elinkeinoministeri.fi/en/employment-and-enterprises/employers/recruiting-foreign-workers/shortage-occupations", method: "official-download", refreshCadence: "quarterly" },
    rent: { sourceName: "Statistics Finland Housing Statistics", sourceUrl: "https://stat.fi/en/statistics/housing", method: "official-download", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Finnish Immigration Service (Migri)", sourceUrl: "https://migri.fi/en/work-in-finland", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Finnish Ministry of Economic Affairs and Employment Shortage Occupation List", sourceUrl: "https://tyo-ja-elinkeinoministeri.fi/en/employment-and-enterprises/employers/recruiting-foreign-workers/shortage-occupations", method: "official-download", refreshCadence: "quarterly" },
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
    reviewStatus:
      category === "visa-pathway" || !isCountrySearchIndexable(country)
        ? "review-required" as const
        : "approved" as const,
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
