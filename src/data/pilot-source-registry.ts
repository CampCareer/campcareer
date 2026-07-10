import type { ReviewStatus, SourceMethod } from "@/data/source-registry"

export const PILOT_DATA_CATEGORIES = [
  "tuition",
  "graduate-outcomes",
  "occupation",
  "rent",
  "visa-pathway",
  "shortage",
  "foreign-worker-pathway",
  "language-requirement",
  "job-quality",
] as const

export type PilotDataCategory = (typeof PILOT_DATA_CATEGORIES)[number]
export type PilotCountryCode = "KR" | "JP" | "SG" | "FR"

export type PilotSourceRecord = {
  country: PilotCountryCode
  category: PilotDataCategory
  sourceName: string
  sourceUrl: string
  method: SourceMethod
  lastChecked: string
  refreshCadence: "monthly" | "quarterly" | "annual"
  reviewStatus: ReviewStatus
}

const CHECKED_AT = "2026-07-10"

type SourceSeed = Omit<PilotSourceRecord, "country" | "category" | "lastChecked" | "reviewStatus">
type CountrySeeds = Record<PilotDataCategory, SourceSeed>

const PILOT_SOURCES: Record<PilotCountryCode, CountrySeeds> = {
  KR: {
    tuition: { sourceName: "Korean Educational Development Institute", sourceUrl: "https://www.kedi.re.kr/eng/khome/main/main.do", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Korean Educational Development Institute higher education statistics", sourceUrl: "https://www.highered.go.kr/", method: "official-web", refreshCadence: "annual" },
    occupation: { sourceName: "Korea Employment Information Service", sourceUrl: "https://www.keis.or.kr/eng/index.do", method: "official-web", refreshCadence: "quarterly" },
    rent: { sourceName: "Ministry of Land, Infrastructure and Transport housing statistics", sourceUrl: "https://stat.molit.go.kr/portal/cate/statView.do", method: "official-web", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Korea Immigration Service", sourceUrl: "https://www.immigration.go.kr/immigration_eng/index.do", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Ministry of Employment and Labor labour market information", sourceUrl: "https://www.moel.go.kr/english/", method: "official-web", refreshCadence: "quarterly" },
    "foreign-worker-pathway": { sourceName: "Korea Immigration Service", sourceUrl: "https://www.immigration.go.kr/immigration_eng/index.do", method: "official-web", refreshCadence: "monthly" },
    "language-requirement": { sourceName: "National Institute for International Education TOPIK", sourceUrl: "https://www.topik.go.kr/", method: "official-web", refreshCadence: "annual" },
    "job-quality": { sourceName: "Ministry of Employment and Labor", sourceUrl: "https://www.moel.go.kr/english/", method: "official-web", refreshCadence: "annual" },
  },
  JP: {
    tuition: { sourceName: "Japan Student Services Organization", sourceUrl: "https://www.jasso.go.jp/en/study_j/sgtj/guide/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "Ministry of Education, Culture, Sports, Science and Technology", sourceUrl: "https://www.mext.go.jp/en/", method: "official-web", refreshCadence: "annual" },
    occupation: { sourceName: "MHLW Wage Structure Basic Statistical Survey", sourceUrl: "https://www.mhlw.go.jp/content/001692996.xlsx", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Statistics Bureau of Japan housing statistics", sourceUrl: "https://www.stat.go.jp/english/data/jyutaku/index.html", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "Immigration Services Agency of Japan", sourceUrl: "https://www.isa.go.jp/en/", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "MHLW Employment-related indicators by occupation", sourceUrl: "https://www.mhlw.go.jp/toukei/list/114-1d.html", method: "official-download", refreshCadence: "annual" },
    "foreign-worker-pathway": { sourceName: "Immigration Services Agency of Japan work status", sourceUrl: "https://www.isa.go.jp/en/applications/procedures/nyuukokukanri07_00059.html", method: "official-web", refreshCadence: "monthly" },
    "language-requirement": { sourceName: "Japanese-Language Proficiency Test", sourceUrl: "https://www.jlpt.jp/e/", method: "official-web", refreshCadence: "annual" },
    "job-quality": { sourceName: "Ministry of Health, Labour and Welfare", sourceUrl: "https://www.mhlw.go.jp/english/", method: "official-download", refreshCadence: "annual" },
  },
  SG: {
    tuition: { sourceName: "Ministry of Education Singapore", sourceUrl: "https://www.moe.gov.sg/", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "MOE Graduate Employment Survey", sourceUrl: "https://www.moe.gov.sg/news/press-releases", method: "official-web", refreshCadence: "annual" },
    occupation: { sourceName: "Ministry of Manpower Job Vacancies", sourceUrl: "https://www.mom.gov.sg/newsroom/press-releases/2026/0320-job-vacancies-report-2025", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "Urban Redevelopment Authority rental statistics", sourceUrl: "https://www.ura.gov.sg/realEstateIIWeb/rental/search.action", method: "official-web", refreshCadence: "quarterly" },
    "visa-pathway": { sourceName: "Immigration and Checkpoints Authority Student's Pass", sourceUrl: "https://www.ica.gov.sg/reside/STP", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "Ministry of Manpower Job Vacancies", sourceUrl: "https://stats.mom.gov.sg/Pages/Job-Vacancies-Report.aspx", method: "official-download", refreshCadence: "annual" },
    "foreign-worker-pathway": { sourceName: "Ministry of Manpower Employment Pass", sourceUrl: "https://www.mom.gov.sg/passes-and-permits/employment-pass", method: "official-web", refreshCadence: "monthly" },
    "language-requirement": { sourceName: "Ministry of Education Singapore", sourceUrl: "https://www.moe.gov.sg/", method: "official-web", refreshCadence: "annual" },
    "job-quality": { sourceName: "Ministry of Manpower labour force statistics", sourceUrl: "https://stats.mom.gov.sg/", method: "official-download", refreshCadence: "annual" },
  },
  FR: {
    tuition: { sourceName: "Campus France", sourceUrl: "https://www.campusfrance.org/en", method: "official-web", refreshCadence: "annual" },
    "graduate-outcomes": { sourceName: "French Ministry of Higher Education", sourceUrl: "https://www.enseignementsup-recherche.gouv.fr/en", method: "official-web", refreshCadence: "annual" },
    occupation: { sourceName: "INSEE employment and earnings", sourceUrl: "https://www.insee.fr/en/statistiques/8376826", method: "official-download", refreshCadence: "annual" },
    rent: { sourceName: "INSEE housing statistics", sourceUrl: "https://www.insee.fr/en/statistiques?debut=0&theme=10", method: "official-download", refreshCadence: "annual" },
    "visa-pathway": { sourceName: "France-Visas", sourceUrl: "https://france-visas.gouv.fr/en", method: "official-web", refreshCadence: "monthly" },
    shortage: { sourceName: "France Travail labour needs", sourceUrl: "https://statistiques.francetravail.org/bmo/?nav=bmo", method: "official-download", refreshCadence: "annual" },
    "foreign-worker-pathway": { sourceName: "French Ministry of the Interior work permits", sourceUrl: "https://www.immigration.interieur.gouv.fr/", method: "official-web", refreshCadence: "monthly" },
    "language-requirement": { sourceName: "France Education International", sourceUrl: "https://www.france-education-international.fr/en", method: "official-web", refreshCadence: "annual" },
    "job-quality": { sourceName: "DARES labour statistics", sourceUrl: "https://dares.travail-emploi.gouv.fr/", method: "official-download", refreshCadence: "annual" },
  },
}

export const PILOT_SOURCE_REGISTRY: PilotSourceRecord[] = (Object.entries(PILOT_SOURCES) as Array<[PilotCountryCode, CountrySeeds]>).flatMap(
  ([country, sources]) => PILOT_DATA_CATEGORIES.map((category) => ({
    country,
    category,
    ...sources[category],
    lastChecked: CHECKED_AT,
    reviewStatus: ["visa-pathway", "foreign-worker-pathway"].includes(category) ? "review-required" as const : "approved" as const,
  })),
)

export function getPilotSources(country: PilotCountryCode): PilotSourceRecord[] {
  return PILOT_SOURCE_REGISTRY.filter((source) => source.country === country)
}
