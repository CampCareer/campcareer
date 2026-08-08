export const AU_PROGRAMMATIC_CITIES = [
  { slug: "sydney", label: "Sydney", regionCode: "NSW" },
  { slug: "melbourne", label: "Melbourne", regionCode: "VIC" },
  { slug: "brisbane", label: "Brisbane", regionCode: "QLD" },
  { slug: "perth", label: "Perth", regionCode: "WA" },
  { slug: "adelaide", label: "Adelaide", regionCode: "SA" },
] as const

export const AU_PROGRAMMATIC_FIELDS = [
  {
    slug: "natural-sciences",
    label: "Natural & Physical Sciences",
    broadField: "01 - Natural and Physical Sciences",
    intro:
      "Explore science programs spanning biological, chemical, mathematical and physical disciplines, with city-specific CRICOS delivery locations.",
  },
  {
    slug: "information-technology",
    label: "Information Technology",
    broadField: "02 - Information Technology",
    intro:
      "Compare information technology programs across software, computing, cybersecurity, data and related digital disciplines.",
  },
  {
    slug: "engineering",
    label: "Engineering & Technology",
    broadField: "03 - Engineering and Related Technologies",
    intro:
      "Compare engineering programs with verified delivery locations, including civil, mechanical, electrical and related technology pathways.",
  },
  {
    slug: "architecture-building",
    label: "Architecture & Building",
    broadField: "04 - Architecture and Building",
    intro:
      "Explore architecture, construction and built-environment programs delivered at registered campuses in the city.",
  },
  {
    slug: "agriculture-environment",
    label: "Agriculture & Environment",
    broadField: "05 - Agriculture, Environmental and Related Studies",
    intro:
      "Explore agriculture, environmental and sustainability-related programs with verified Australian study locations.",
  },
  {
    slug: "health",
    label: "Health",
    broadField: "06 - Health",
    intro:
      "Compare health programs across nursing, allied health, public health and related disciplines using active CRICOS course data.",
  },
  {
    slug: "education",
    label: "Education",
    broadField: "07 - Education",
    intro:
      "Explore teacher education and related education programs delivered through registered city campuses.",
  },
  {
    slug: "business-commerce",
    label: "Business & Commerce",
    broadField: "08 - Management and Commerce",
    intro:
      "Compare business, commerce, management, accounting and related programs with verified city delivery locations.",
  },
  {
    slug: "creative-arts",
    label: "Creative Arts",
    broadField: "10 - Creative Arts",
    intro:
      "Explore creative arts programs across design, media, visual arts and related disciplines in the city.",
  },
] as const

export type AuProgrammaticCitySlug = (typeof AU_PROGRAMMATIC_CITIES)[number]["slug"]
export type AuProgrammaticFieldSlug = (typeof AU_PROGRAMMATIC_FIELDS)[number]["slug"]

export const AU_PROGRAMMATIC_MIN_PROGRAMS = 25
export const AU_PROGRAMMATIC_MIN_INSTITUTIONS = 5

const AU_PROGRAMMATIC_EXCLUDED_ROUTE_KEYS = new Set([
  "brisbane:agriculture-environment",
  "perth:architecture-building",
  "adelaide:agriculture-environment",
])

export function auProgrammaticStudyPath(citySlug: string, fieldSlug: string) {
  return `/study/au/${citySlug.toLowerCase()}/${fieldSlug.toLowerCase()}`
}

export const AU_PROGRAMMATIC_STUDY_PAGES = Object.freeze(
  AU_PROGRAMMATIC_CITIES.flatMap((city) =>
    AU_PROGRAMMATIC_FIELDS.filter(
      (field) => !AU_PROGRAMMATIC_EXCLUDED_ROUTE_KEYS.has(`${city.slug}:${field.slug}`),
    ).map((field) => ({
      city,
      field,
      path: auProgrammaticStudyPath(city.slug, field.slug),
    })),
  ),
)

export function getAuProgrammaticStudyPage(citySlug: string, fieldSlug: string) {
  const city = citySlug.trim().toLowerCase()
  const field = fieldSlug.trim().toLowerCase()
  return AU_PROGRAMMATIC_STUDY_PAGES.find(
    (page) => page.city.slug === city && page.field.slug === field,
  ) ?? null
}

export function getAuProgrammaticStudyPagesForCity(citySlug: string) {
  const city = citySlug.trim().toLowerCase()
  return AU_PROGRAMMATIC_STUDY_PAGES.filter((page) => page.city.slug === city)
}

export function getRelatedAuProgrammaticStudyPages(citySlug: string, fieldSlug: string) {
  const city = citySlug.trim().toLowerCase()
  const field = fieldSlug.trim().toLowerCase()
  return AU_PROGRAMMATIC_STUDY_PAGES.filter(
    (page) => page.city.slug === city && page.field.slug !== field,
  )
}
