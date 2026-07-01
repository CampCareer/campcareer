// 프로그래매틱 SEO 페이지(/fields, /rankings)가 다루는 전공 목록.
// query는 fetchRoiData의 field 파라미터로 그대로 전달되며,
// src/lib/field-aliases.ts의 별칭 확장을 통해 검색된다.
export type FieldDef = {
  slug: string
  label: string
  query: string
}

export const FIELDS: FieldDef[] = [
  { slug: "computer-science",        label: "Computer Science",        query: "computer science" },
  { slug: "data-science",            label: "Data Science",            query: "data science" },
  { slug: "artificial-intelligence", label: "Artificial Intelligence", query: "artificial intelligence" },
  { slug: "software-engineering",    label: "Software Engineering",    query: "software engineering" },
  { slug: "information-technology",  label: "Information Technology",  query: "information technology" },
  { slug: "engineering",             label: "Engineering",             query: "engineering" },
  { slug: "business",                label: "Business",                query: "business" },
  { slug: "finance",                 label: "Finance",                 query: "finance" },
  { slug: "accounting",              label: "Accounting",              query: "accounting" },
  { slug: "marketing",               label: "Marketing",               query: "marketing" },
  { slug: "economics",               label: "Economics",               query: "economics" },
  { slug: "nursing",                 label: "Nursing",                 query: "nursing" },
  { slug: "medicine",                label: "Medicine",                query: "medicine" },
  { slug: "pharmacy",                label: "Pharmacy",                query: "pharmacy" },
  { slug: "law",                     label: "Law",                     query: "law" },
  { slug: "psychology",              label: "Psychology",              query: "psychology" },
  { slug: "biology",                 label: "Biology",                 query: "biology" },
  { slug: "mechanical-engineering",  label: "Mechanical Engineering",  query: "mechanical engineering" },
  { slug: "electrical-engineering",  label: "Electrical Engineering",  query: "electrical engineering" },
  { slug: "chemical-engineering",    label: "Chemical Engineering",    query: "chemical engineering" },
  { slug: "mathematics",             label: "Mathematics",             query: "mathematics" },
  { slug: "communications",          label: "Communications",          query: "communications" },
  { slug: "political-science",       label: "Political Science",       query: "political science" },
  { slug: "education",               label: "Education",               query: "education" },
  { slug: "architecture",            label: "Architecture",            query: "architecture" },
]

export function getFieldBySlug(slug: string): FieldDef | null {
  return FIELDS.find((f) => f.slug === slug) ?? null
}

export const COUNTRY_INFO: Record<string, { label: string; flag: string; currency: string }> = {
  us: { label: "United States",  flag: "🇺🇸", currency: "$" },
  uk: { label: "United Kingdom", flag: "🇬🇧", currency: "£" },
  ie: { label: "Ireland",        flag: "🇮🇪", currency: "€" },
  ca: { label: "Canada",         flag: "🇨🇦", currency: "C$" },
  au: { label: "Australia",      flag: "🇦🇺", currency: "A$" },
}

export function formatMoney(country: string, value: number): string {
  const sym = COUNTRY_INFO[country]?.currency ?? "$"
  return `${sym}${Math.round(value).toLocaleString()}`
}
