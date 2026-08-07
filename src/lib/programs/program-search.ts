export const PROGRAM_LEVELS = [
  { value: "all", label: "All", labelKo: "전체" },
  { value: "bachelor", label: "Bachelor's", labelKo: "학사" },
  { value: "master", label: "Master's", labelKo: "석사" },
  { value: "doctorate", label: "Doctorate", labelKo: "박사" },
  { value: "diploma", label: "Diploma", labelKo: "디플로마" },
  { value: "certificate", label: "Certificate", labelKo: "수료증" },
  { value: "associate", label: "Associate", labelKo: "준학사" },
] as const

export type ProgramLevel = (typeof PROGRAM_LEVELS)[number]["value"]

export const PROGRAM_FIELDS = [
  { value: "01 - Natural and Physical Sciences", label: "Natural & Physical Sciences", labelKo: "자연·물리과학" },
  { value: "02 - Information Technology", label: "Information Technology", labelKo: "정보기술" },
  { value: "03 - Engineering and Related Technologies", label: "Engineering & Technology", labelKo: "공학·기술" },
  { value: "04 - Architecture and Building", label: "Architecture & Building", labelKo: "건축·건설" },
  { value: "05 - Agriculture, Environmental and Related Studies", label: "Agriculture & Environment", labelKo: "농업·환경" },
  { value: "06 - Health", label: "Health", labelKo: "보건·의료" },
  { value: "07 - Education", label: "Education", labelKo: "교육" },
  { value: "08 - Management and Commerce", label: "Business & Commerce", labelKo: "경영·상업" },
  { value: "09 - Society and Culture", label: "Society & Culture", labelKo: "사회·문화" },
  { value: "10 - Creative Arts", label: "Creative Arts", labelKo: "창작예술" },
  { value: "11 - Food, Hospitality and Personal Services", label: "Hospitality & Personal Services", labelKo: "호텔·개인서비스" },
  { value: "12 - Mixed Field Programmes", label: "Mixed Field Programmes", labelKo: "복합 전공" },
] as const

export type ProgramField = "all" | (typeof PROGRAM_FIELDS)[number]["value"]

export const AU_PROGRAM_CITIES = [
  { value: "sydney", label: "Sydney", labelKo: "시드니", state: "NSW" },
  { value: "melbourne", label: "Melbourne", labelKo: "멜버른", state: "VIC" },
  { value: "brisbane", label: "Brisbane", labelKo: "브리즈번", state: "QLD" },
] as const

export type ProgramCity = "all" | (typeof AU_PROGRAM_CITIES)[number]["value"]

export const AU_PROGRAM_STATES = [
  { value: "NSW", label: "New South Wales", labelKo: "뉴사우스웨일스" },
  { value: "VIC", label: "Victoria", labelKo: "빅토리아" },
  { value: "QLD", label: "Queensland", labelKo: "퀸즐랜드" },
  { value: "WA", label: "Western Australia", labelKo: "웨스턴오스트레일리아" },
  { value: "SA", label: "South Australia", labelKo: "사우스오스트레일리아" },
  { value: "ACT", label: "Australian Capital Territory", labelKo: "호주 수도 특별구" },
  { value: "TAS", label: "Tasmania", labelKo: "태즈메이니아" },
  { value: "NT", label: "Northern Territory", labelKo: "노던 준주" },
] as const

export type ProgramState = "all" | (typeof AU_PROGRAM_STATES)[number]["value"]

export const PROGRAM_DURATIONS = [
  { value: "all", label: "Any duration", labelKo: "전체 기간" },
  { value: "under-1", label: "Up to 1 year", labelKo: "1년 이하" },
  { value: "1-2", label: "1–2 years", labelKo: "1–2년" },
  { value: "2-3", label: "2–3 years", labelKo: "2–3년" },
  { value: "3-plus", label: "More than 3 years", labelKo: "3년 초과" },
] as const

export type ProgramDuration = (typeof PROGRAM_DURATIONS)[number]["value"]

export const PROGRAM_FEES = [
  { value: "all", label: "Any tuition", labelKo: "전체 학비" },
  { value: "under-30000", label: "Under A$30,000", labelKo: "A$30,000 미만" },
  { value: "30000-40000", label: "A$30,000–40,000", labelKo: "A$30,000–40,000" },
  { value: "40000-50000", label: "A$40,000–50,000", labelKo: "A$40,000–50,000" },
  { value: "50000-plus", label: "A$50,000+", labelKo: "A$50,000 이상" },
] as const

export type ProgramFee = (typeof PROGRAM_FEES)[number]["value"]

export const PROGRAM_SOURCES = [
  { value: "all", label: "Active CRICOS courses", labelKo: "활성 CRICOS 과정" },
  { value: "verified", label: "Verified official page", labelKo: "공식 페이지 검증 완료" },
] as const

export type ProgramSource = (typeof PROGRAM_SOURCES)[number]["value"]

export const PROGRAM_SORTS = [
  { value: "recommended", label: "Recommended", labelKo: "추천순" },
  { value: "fee-low", label: "Lowest tuition", labelKo: "학비 낮은순" },
  { value: "fee-high", label: "Highest tuition", labelKo: "학비 높은순" },
  { value: "duration-short", label: "Shortest duration", labelKo: "기간 짧은순" },
  { value: "title", label: "Program name", labelKo: "과정명순" },
] as const

export type ProgramSort = (typeof PROGRAM_SORTS)[number]["value"]

export type ProgramSearchFilters = {
  country: string
  q: string
  level: ProgramLevel
  field: ProgramField
  city: ProgramCity
  state: ProgramState
  duration: ProgramDuration
  fee: ProgramFee
  source: ProgramSource
  sort: ProgramSort
  page: number
}

const LEVEL_TYPES: Record<Exclude<ProgramLevel, "all">, readonly string[]> = {
  bachelor: ["Bachelor Degree", "Bachelor Honours Degree"],
  master: ["Masters Degree (Coursework)", "Masters Degree (Research)"],
  doctorate: ["Doctoral Degree"],
  diploma: ["Diploma", "Advanced Diploma", "Graduate Diploma"],
  certificate: ["Certificate III", "Certificate IV", "Graduate Certificate"],
  associate: ["Associate Degree"],
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function allowedValue<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return value && allowed.includes(value as T) ? (value as T) : fallback
}

const levelValues = PROGRAM_LEVELS.map((item) => item.value)
const fieldValues = ["all", ...PROGRAM_FIELDS.map((item) => item.value)] as const
const cityValues = ["all", ...AU_PROGRAM_CITIES.map((item) => item.value)] as const
const stateValues = ["all", ...AU_PROGRAM_STATES.map((item) => item.value)] as const
const durationValues = PROGRAM_DURATIONS.map((item) => item.value)
const feeValues = PROGRAM_FEES.map((item) => item.value)
const sourceValues = PROGRAM_SOURCES.map((item) => item.value)
const sortValues = PROGRAM_SORTS.map((item) => item.value)

export function parseProgramSearchParams(
  params: Record<string, string | string[] | undefined>,
): ProgramSearchFilters {
  const rawPage = Number.parseInt(firstValue(params.page) ?? "1", 10)
  const country = (firstValue(params.country) ?? "AU").toUpperCase().slice(0, 2)
  const q = (firstValue(params.q) ?? "").trim().slice(0, 80)
  const city = allowedValue(firstValue(params.city), cityValues, "all")

  return {
    country: /^[A-Z]{2}$/.test(country) ? country : "AU",
    q,
    level: allowedValue(firstValue(params.level), levelValues, "all"),
    field: allowedValue(firstValue(params.field), fieldValues, "all"),
    city,
    state: city === "all" ? allowedValue(firstValue(params.state), stateValues, "all") : "all",
    duration: allowedValue(firstValue(params.duration), durationValues, "all"),
    fee: allowedValue(firstValue(params.fee), feeValues, "all"),
    source: allowedValue(firstValue(params.source), sourceValues, "all"),
    sort: allowedValue(firstValue(params.sort), sortValues, "recommended"),
    page: Number.isFinite(rawPage) && rawPage > 0 ? Math.min(rawPage, 500) : 1,
  }
}

export function programLevelTypes(level: ProgramLevel): readonly string[] | null {
  return level === "all" ? null : LEVEL_TYPES[level]
}

export function hasProgramFilters(filters: ProgramSearchFilters) {
  return Boolean(
    filters.q ||
      filters.level !== "all" ||
      filters.field !== "all" ||
      filters.city !== "all" ||
      filters.state !== "all" ||
      filters.duration !== "all" ||
      filters.fee !== "all" ||
      filters.source !== "all" ||
      filters.sort !== "recommended" ||
      filters.page > 1,
  )
}

export function buildProgramsUrl(
  filters: ProgramSearchFilters,
  overrides: Partial<ProgramSearchFilters> = {},
) {
  const next = { ...filters, ...overrides }
  const params = new URLSearchParams()
  params.set("country", next.country)

  if (next.q) params.set("q", next.q)
  if (next.level !== "all") params.set("level", next.level)
  if (next.field !== "all") params.set("field", next.field)
  if (next.city !== "all") params.set("city", next.city)
  if (next.city === "all" && next.state !== "all") params.set("state", next.state)
  if (next.duration !== "all") params.set("duration", next.duration)
  if (next.fee !== "all") params.set("fee", next.fee)
  if (next.source !== "all") params.set("source", next.source)
  if (next.sort !== "recommended") params.set("sort", next.sort)
  if (next.page > 1) params.set("page", String(next.page))

  return `/programs?${params.toString()}`
}

export function slugifyProgramTitle(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)

  return slug || "program"
}

export function programDetailPath(id: number, title: string) {
  return `/programs/au/${id}-${slugifyProgramTitle(title)}`
}

export function parseProgramId(segment: string) {
  const match = segment.match(/^(\d+)(?:-|$)/)
  if (!match) return null
  const id = Number.parseInt(match[1], 10)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
