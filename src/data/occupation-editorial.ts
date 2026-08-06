export type CountryOccupationEditorial = {
  headline: string
  entryPathway: string
  registration: string
  jobMarketNote: string
  scoreCaveat: string
}

export type OccupationEditorial = {
  id: string
  overview: string
  tasks: readonly string[]
  countries: Partial<Record<string, CountryOccupationEditorial>>
}

export const OCCUPATION_EDITORIAL: readonly OccupationEditorial[] = [
  {
    id: "registered-nurse",
    overview:
      "Registered Nurses assess patients, plan and deliver care, administer treatment, coordinate with health teams and support patients and families across hospitals, aged care, community and other health settings.",
    tasks: [
      "Assess, plan, implement and evaluate nursing care against accepted practice standards",
      "Coordinate patient care with doctors, allied health professionals and nursing teams",
      "Administer medications, treatments and therapies and monitor the response",
      "Educate patients and families about treatment, recovery and prevention",
      "Maintain clinical records and communicate changes in a patient's condition",
      "Supervise and support enrolled nurses and other care workers",
    ],
    countries: {
      AU: {
        headline: "A large, regulated occupation with strong national demand",
        entryPathway:
          "The standard direct route is an NMBA-approved Bachelor of Nursing followed by an application for general registration. Graduate-entry nursing degrees can shorten the study route for eligible applicants with a prior degree.",
        registration:
          "Registration with the Nursing and Midwifery Board of Australia is mandatory. Applicants must meet the current registration, identity, criminal-history, recency and English-language requirements before practising.",
        jobMarketNote:
          "Public health systems, private hospitals, aged-care providers and community services recruit RNs. Graduate transition programs make this occupation more accessible to new graduates than many regulated professions.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level employer counts and the share of jobs explicitly open to new graduates are ingested on a recurring basis.",
      },
    },
  },
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}
