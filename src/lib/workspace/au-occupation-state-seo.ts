export const AU_OCCUPATION_STATES = [
  { code: "NSW", slug: "new-south-wales", label: "New South Wales", citySlug: "sydney", cityLabel: "Sydney" },
  { code: "VIC", slug: "victoria", label: "Victoria", citySlug: "melbourne", cityLabel: "Melbourne" },
  { code: "QLD", slug: "queensland", label: "Queensland", citySlug: "brisbane", cityLabel: "Brisbane" },
  { code: "WA", slug: "western-australia", label: "Western Australia", citySlug: "perth", cityLabel: "Perth" },
  { code: "SA", slug: "south-australia", label: "South Australia", citySlug: "adelaide", cityLabel: "Adelaide" },
  { code: "ACT", slug: "australian-capital-territory", label: "Australian Capital Territory", citySlug: null, cityLabel: null },
  { code: "TAS", slug: "tasmania", label: "Tasmania", citySlug: null, cityLabel: null },
  { code: "NT", slug: "northern-territory", label: "Northern Territory", citySlug: null, cityLabel: null },
] as const

export const AU_OCCUPATION_STATE_CAREERS = [
  { slug: "carpenter", label: "Carpenter" },
  { slug: "electrician", label: "Electrician" },
  { slug: "midwife", label: "Midwife" },
  { slug: "physiotherapist", label: "Physiotherapist" },
  { slug: "registered-nurse", label: "Registered Nurse" },
] as const

export type AuOccupationStateCode = (typeof AU_OCCUPATION_STATES)[number]["code"]
export type AuOccupationStateSlug = (typeof AU_OCCUPATION_STATES)[number]["slug"]
export type AuOccupationStateCareerSlug = (typeof AU_OCCUPATION_STATE_CAREERS)[number]["slug"]

export function auOccupationStatePath(stateSlug: string, careerSlug: string) {
  return `/occupation/au/${stateSlug.trim().toLowerCase()}/${careerSlug.trim().toLowerCase()}`
}

export const AU_OCCUPATION_STATE_PAGES = Object.freeze(
  AU_OCCUPATION_STATES.flatMap((state) =>
    AU_OCCUPATION_STATE_CAREERS.map((career) => ({
      state,
      career,
      path: auOccupationStatePath(state.slug, career.slug),
    })),
  ),
)

export function getAuOccupationStatePage(stateSlug: string, careerSlug: string) {
  const state = stateSlug.trim().toLowerCase()
  const career = careerSlug.trim().toLowerCase()
  return AU_OCCUPATION_STATE_PAGES.find(
    (page) => page.state.slug === state && page.career.slug === career,
  ) ?? null
}

export function getAuOccupationStatePageByRegionCode(regionCode: string, careerSlug: string) {
  const state = AU_OCCUPATION_STATES.find(
    (item) => item.code === regionCode.trim().toUpperCase(),
  )
  if (!state) return null
  return getAuOccupationStatePage(state.slug, careerSlug)
}

export function getAuOccupationStatePagesForCareer(careerSlug: string) {
  const career = careerSlug.trim().toLowerCase()
  return AU_OCCUPATION_STATE_PAGES.filter((page) => page.career.slug === career)
}

export function getAuOccupationStatePagesForState(stateSlug: string) {
  const state = stateSlug.trim().toLowerCase()
  return AU_OCCUPATION_STATE_PAGES.filter((page) => page.state.slug === state)
}
