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
  {
    id: "carpenter",
    overview:
      "Carpenters set out, construct, install, renovate and repair timber and lightweight structural systems, fixtures and finishes across residential, commercial and infrastructure projects.",
    tasks: [
      "Interpret plans, specifications and building details and set out the work area",
      "Select, measure, cut, shape and assemble timber and other construction materials",
      "Erect wall, floor and roof framing and verify that structures are level, plumb and square",
      "Install doors, windows, cladding, partitions, linings, mouldings and other fixtures",
      "Construct formwork, temporary structures and specialised timber components where required",
      "Repair, renovate and replace damaged structural and finishing components",
    ],
    countries: {
      AU: {
        headline: "A large apprenticeship trade in national shortage across every state and territory",
        entryPathway:
          "The standard route is a paid carpentry apprenticeship combined with the CPC30220 Certificate III in Carpentry. A training contract links employment and registered training, while approved recognition pathways may be available to experienced workers.",
        registration:
          "There is no single national carpenter licence. A White Card is required for construction-site work, and state or territory builder, contractor or trade-licensing rules may apply depending on the work and whether the carpenter contracts directly.",
        jobMarketNote:
          "Residential builders, commercial contractors, infrastructure projects and specialist carpentry firms use carpenters. Large builders often engage trade subcontractors, while apprenticeship and group-training networks connect apprentices with host employers.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level unique-employer counts and the share of advertisements open to apprentices or newly qualified carpenters are ingested regularly.",
      },
    },
  },
  {
    id: "electrician",
    overview:
      "Electricians install, test, commission, maintain and repair electrical wiring, equipment and control systems across homes, commercial buildings, infrastructure, utilities, manufacturing and industrial sites.",
    tasks: [
      "Interpret technical drawings, wiring diagrams, equipment schedules and electrical standards",
      "Install wiring, switchboards, protection devices, lighting, controls and electrical equipment",
      "Connect systems to power supplies and test continuity, resistance and safe operation",
      "Diagnose faults with electrical and electronic test instruments",
      "Repair, replace and maintain wiring, components, machinery and control systems",
      "Document completed work and confirm compliance with the relevant electrical safety rules",
    ],
    countries: {
      AU: {
        headline: "A licensed trade with national shortage and broad infrastructure demand",
        entryPathway:
          "The standard domestic route is a paid electrical apprenticeship combined with the UEE30820 Certificate III in Electrotechnology Electrician. The training contract, workplace experience and final licensing requirements are administered through the relevant state or territory system.",
        registration:
          "Electrical work is licensed. After completing the required trade training and assessments, workers must obtain the correct electrical licence from the state or territory regulator for the jurisdiction and type of work.",
        jobMarketNote:
          "Construction contractors, utilities, mining, manufacturing and maintenance employers recruit electricians. Apprenticeship intakes create a structured entry route, while licensed vacancies span metropolitan, regional and remote locations.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level unique-employer counts and the share of advertisements open to apprentices or newly licensed electricians are ingested regularly.",
      },
    },
  },
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}
