// Degree Risk Checker — shared types, question definitions, and display helpers.
// Single source of truth for the form (client) and result pages (server).

export type RiskLevel = "low" | "medium" | "high"
export type CountryCode = "AU" | "IE"
export type ResultView = CountryCode | "both"

export interface MajorSource {
  name: string
  url: string
}

export interface MajorRow {
  slug: string
  country: CountryCode
  overall_risk: RiskLevel
  risk_summary: string
  employment_rate: number
  occupation_list_match: boolean
  post_study_work_years: number
  market_demand_score: number
  ai_exposure_band: string
  ai_note: string
  tuition: number
  median_starting_salary: number
  payback_years: number
  alternatives: string[] | null
  sources: MajorSource[] | null
  data_confidence?: string | null
  last_verified?: string | null
}

export const MAJOR_COLUMNS =
  "slug, country, overall_risk, risk_summary, employment_rate, occupation_list_match, post_study_work_years, market_demand_score, ai_exposure_band, ai_note, tuition, median_starting_salary, payback_years, alternatives, sources, data_confidence, last_verified"

// ── Form answers (keys mirror the assessments table columns) ────────────────

export interface Answers {
  country_pref: string
  major_pref: string
  budget: string
  primary_goal: string
  background: string
  english_level: string
}

export type AnswerKey = keyof Answers

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  key: AnswerKey
  title: string
  options: QuestionOption[]
}

export const MAJOR_OPTIONS = [
  { slug: "computer-science", label: "Computer Science" },
  { slug: "data-analytics", label: "Data Analytics" },
  { slug: "software-engineering", label: "Software Engineering" },
  { slug: "nursing", label: "Nursing" },
  { slug: "civil-engineering", label: "Civil Engineering" },
  { slug: "business-management", label: "Business" },
  { slug: "accounting", label: "Accounting" },
  { slug: "ux-design", label: "UX Design" },
  { slug: "psychology", label: "Psychology" },
  { slug: "music", label: "Music" },
] as const

export function majorLabel(slug: string): string {
  return MAJOR_OPTIONS.find((m) => m.slug === slug)?.label ?? slug
}

export function isMajorSlug(slug: string): boolean {
  return MAJOR_OPTIONS.some((m) => m.slug === slug)
}

export const QUESTIONS: Question[] = [
  {
    key: "country_pref",
    title: "Where are you thinking of studying?",
    options: [
      { value: "Australia", label: "Australia" },
      { value: "Ireland", label: "Ireland" },
      { value: "UK", label: "UK" },
      { value: "Canada", label: "Canada" },
      { value: "Not sure", label: "Not sure" },
    ],
  },
  {
    key: "major_pref",
    title: "Which major are you considering?",
    options: MAJOR_OPTIONS.map((m) => ({ value: m.slug, label: m.label })),
  },
  {
    key: "budget",
    title: "What is your yearly budget?",
    options: [
      { value: "Under $20k", label: "Under $20k" },
      { value: "$20k–50k", label: "$20k–50k" },
      { value: "$50k+", label: "$50k+" },
    ],
  },
  {
    key: "primary_goal",
    title: "What matters most to you?",
    options: [
      { value: "Job", label: "Job" },
      { value: "PR–Immigration", label: "PR–Immigration" },
      { value: "Brand-name school", label: "Brand-name school" },
      { value: "Passion", label: "Passion" },
      { value: "Salary", label: "Salary" },
    ],
  },
  {
    key: "background",
    title: "Where are you right now?",
    options: [
      { value: "High school", label: "High school" },
      { value: "Bachelor student", label: "Bachelor student" },
      { value: "Graduate", label: "Graduate" },
      { value: "Career changer", label: "Career changer" },
    ],
  },
  {
    key: "english_level",
    title: "What is your English level?",
    options: [
      { value: "No test yet", label: "No test yet" },
      { value: "IELTS under 6.0", label: "IELTS under 6.0" },
      { value: "IELTS 6.0–6.5", label: "IELTS 6.0–6.5" },
      { value: "IELTS 7.0+", label: "IELTS 7.0+" },
    ],
  },
]

// ── Result view resolution ──────────────────────────────────────────────────
// We only score AU and IE; UK / Canada / Not sure get a side-by-side compare.

export function resolveView(countryPref: string): ResultView {
  if (countryPref === "Australia") return "AU"
  if (countryPref === "Ireland") return "IE"
  return "both"
}

export function viewCountries(view: ResultView): CountryCode[] {
  return view === "both" ? ["AU", "IE"] : [view]
}

export function isResultView(v: string | undefined): v is ResultView {
  return v === "AU" || v === "IE" || v === "both"
}

// ── Display helpers ─────────────────────────────────────────────────────────

export const COUNTRY_META: Record<CountryCode, { name: string; flag: string; currency: string }> = {
  AU: { name: "Australia", flag: "🇦🇺", currency: "A$" },
  IE: { name: "Ireland", flag: "🇮🇪", currency: "€" },
}

export const RISK_BADGE: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: "Low risk", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium risk", className: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "High risk", className: "bg-red-50 text-red-700 border-red-200" },
}

export function formatMoney(amount: number, country: CountryCode): string {
  return `${COUNTRY_META[country].currency}${Math.round(amount).toLocaleString("en-US")}`
}

// Best-effort match of a layer to one of the row's sources by keyword;
// layers without a match simply render no source link.
export function findSource(sources: MajorSource[] | null, keywords: string[]): MajorSource | null {
  if (!sources?.length) return null
  const found = sources.find((s) =>
    keywords.some((k) => s.name.toLowerCase().includes(k))
  )
  return found ?? null
}

export const LAYER_SOURCE_KEYWORDS: Record<string, string[]> = {
  employment: ["qilt", "hea", "graduate outcome", "employment"],
  visa: ["occupation", "visa", "immigration", "skills list", "stamp", "csol", "critical skills", "home affairs"],
  demand: ["demand", "jobs and skills", "vacanc", "labour", "labor", "lmi", "egfsn"],
  ai: ["ai", "oecd", "felten", "exposure", "automation"],
  roi: ["tuition", "salary", "cso", "earnings", "fees", "cricos"],
}
