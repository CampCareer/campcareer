// Degree Risk Checker — shared types, question definitions, and display helpers.
// Single source of truth for the form (client) and result pages (server).
import type { Locale } from "@/lib/i18n/config"

export type RiskLevel = "low" | "medium" | "high"
export type CountryCode = "US" | "CA" | "UK" | "AU" | "IE"
export type ResultView = CountryCode | "all"

// Display order everywhere multiple countries are shown.
export const ALL_COUNTRIES: CountryCode[] = ["US", "CA", "UK", "AU", "IE"]

export interface MajorSource {
  name: string
  url: string
}

// The five scored layers, in display order.
export const LAYERS = ["employment", "visa", "demand", "ai_exposure", "roi"] as const
export type LayerKey = (typeof LAYERS)[number]

// A layer note may be a plain string (legacy) or a per-locale object.
export type LayerNote = string | { en: string; ko: string } | null

// Per-layer confidence/source/as-of metadata (majors.layer_meta JSONB).
export interface LayerMeta {
  confidence: "estimate" | "verified"
  last_verified: string | null
  source_name: string | null
  source_url: string | null
  note: LayerNote
}

// Resolve a (possibly bilingual) layer note to a string for the active locale.
export function layerNoteText(meta: LayerMeta, locale: Locale): string | null {
  const n = meta.note
  if (!n) return null
  if (typeof n === "string") return n
  return n[locale] ?? n.en ?? null
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
  avg_annual_tuition_intl: number
  median_starting_salary: number
  payback_years: number
  alternatives: string[] | null
  sources: MajorSource[] | null
  layer_meta: Record<LayerKey, LayerMeta> | null
  // DEPRECATED: superseded by layer_meta.<layer>.{confidence,last_verified}
  data_confidence?: string | null
  last_verified?: string | null
}

// NOTE: layer_meta is intentionally NOT listed here. It is read via select("*")
// on the result page so the query stays resilient before the layer_meta
// migration is applied (selecting a not-yet-existing column errors the whole
// query). After migration it is picked up automatically.
export const MAJOR_COLUMNS =
  "slug, country, overall_risk, risk_summary, employment_rate, occupation_list_match, post_study_work_years, market_demand_score, ai_exposure_band, ai_note, avg_annual_tuition_intl, median_starting_salary, payback_years, alternatives, sources, data_confidence, last_verified"

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

// Escape hatch for majors we don't score yet — routed to the ROI Explorer
// field search instead of a dead-end.
export const OTHER_MAJOR = "other"

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
      { value: "United States", label: "United States" },
      { value: "Canada", label: "Canada" },
      { value: "UK", label: "UK" },
      { value: "Australia", label: "Australia" },
      { value: "Ireland", label: "Ireland" },
      { value: "Not sure", label: "Not sure" },
    ],
  },
  {
    key: "major_pref",
    title: "Which major are you considering?",
    options: [
      ...MAJOR_OPTIONS.map((m) => ({ value: m.slug, label: m.label })),
      { value: OTHER_MAJOR, label: "Other / Not listed" },
    ],
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
// All five countries are scored; "Not sure" compares them side by side.

const COUNTRY_PREF_TO_CODE: Record<string, CountryCode> = {
  "United States": "US",
  "Canada": "CA",
  "UK": "UK",
  "Australia": "AU",
  "Ireland": "IE",
}

export function resolveView(countryPref: string): ResultView {
  return COUNTRY_PREF_TO_CODE[countryPref] ?? "all"
}

export function viewCountries(view: ResultView): CountryCode[] {
  return view === "all" ? ALL_COUNTRIES : [view]
}

// Accepts the legacy "both" value from old shared result URLs.
export function normalizeView(v: string | undefined): ResultView {
  if (v === "both") return "all"
  if (v === "all" || (ALL_COUNTRIES as string[]).includes(v ?? "")) return v as ResultView
  return "all"
}

// ── Display helpers ─────────────────────────────────────────────────────────

export const COUNTRY_META: Record<CountryCode, { name: string; flag: string; currency: string }> = {
  US: { name: "United States", flag: "🇺🇸", currency: "$" },
  CA: { name: "Canada", flag: "🇨🇦", currency: "C$" },
  UK: { name: "United Kingdom", flag: "🇬🇧", currency: "£" },
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

// Read a layer's metadata with a safe fallback (handles rows not yet
// backfilled with layer_meta).
export function layerMeta(row: MajorRow, layer: LayerKey): LayerMeta {
  return (
    row.layer_meta?.[layer] ?? {
      confidence: "estimate",
      last_verified: null,
      source_name: null,
      source_url: null,
      note: null,
    }
  )
}

// ── Goal-aware result framing ───────────────────────────────────────────────
// The "What matters most to you?" answer decides which layers get visually
// emphasized on the result card.

export const GOAL_PRIORITY_LAYERS: Record<string, string[]> = {
  "Job": ["employment", "demand"],
  "PR–Immigration": ["visa"],
  "Salary": ["roi"],
}

export function goalToLayers(goal: string | undefined): string[] {
  return GOAL_PRIORITY_LAYERS[goal ?? ""] ?? []
}

export function isKnownGoal(goal: string | undefined): boolean {
  const q = QUESTIONS.find((x) => x.key === "primary_goal")
  return !!goal && !!q?.options.some((o) => o.value === goal)
}

// ── Major → ROI Explorer field mapping ──────────────────────────────────────
// Used by the "Where to study this major" section on the result page to query
// the roi_explorer views (field terms align with src/lib/field-aliases.ts).

export const MAJOR_ROI_FIELD: Record<string, string> = {
  "computer-science": "computer science",
  "data-analytics": "data science",
  "software-engineering": "software engineering",
  "nursing": "nursing",
  "civil-engineering": "civil engineering",
  "business-management": "business",
  "accounting": "accounting",
  "ux-design": "design",
  "psychology": "psychology",
  "music": "music",
}

export function toRoiCountry(country: CountryCode): string {
  return country.toLowerCase()
}

// Reverse of MAJOR_ROI_FIELD: map a free-text compare field to a scored major
// slug (for the per-country immigration timeline). Returns null when the field
// isn't one we score — callers fall back to a country-level timeline.
// Longest phrases first so "civil engineering" wins over "engineering".
const FIELD_TO_SLUG: [string, string][] = [
  ["software engineering", "software-engineering"],
  ["computer science", "computer-science"],
  ["data analytics", "data-analytics"],
  ["data science", "data-analytics"],
  ["civil engineering", "civil-engineering"],
  ["business management", "business-management"],
  ["ux design", "ux-design"],
  ["accounting", "accounting"],
  ["psychology", "psychology"],
  ["nursing", "nursing"],
  ["engineering", "civil-engineering"], // generic engineering → STEM representative
  ["business", "business-management"],
  ["management", "business-management"],
  ["design", "ux-design"],
  ["music", "music"],
]

// Verified PR-pathway row (public.country_pr_pathways). route/years/caveat are
// per-locale; nationality_variants is only set for countries where the wait
// depends on country of birth (US). years_* are range/condition labels, never a
// single fixed number.
export interface PrPathway {
  country: CountryCode
  route_en: string
  route_ko: string
  years_en: string
  years_ko: string
  caveat_en: string
  caveat_ko: string
  nationality_variants:
    | Record<"india" | "china" | "other", { en: string; ko: string }>
    | null
  confidence: "estimate" | "verified"
  last_verified: string | null
  source_name: string | null
  source_url: string | null
}

// Per-country payload for the /compare immigration-timeline grid
// (returned by /api/degree-risk/timeline).
export interface TimelineCountry {
  country: CountryCode
  postStudyYears: number
  stemBranch: boolean
  visa: LayerMeta
  pr: PrPathway | null
}

export function fieldToMajorSlug(field: string): string | null {
  const f = field.trim().toLowerCase().replace(/\.$/, "")
  if (!f) return null
  for (const [phrase, slug] of FIELD_TO_SLUG) {
    if (f === phrase || f.includes(phrase)) return slug
  }
  return null
}
