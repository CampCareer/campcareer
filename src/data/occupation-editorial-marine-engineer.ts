import type { OccupationEditorial } from "./occupation-editorial-base"

export const MARINE_ENGINEER_OCCUPATION_EDITORIAL = [
  {
    id: "marine-engineer",
    overview:
      "Marine engineers operate, monitor and maintain ship propulsion, power-generation and auxiliary engineering systems. Australia classifies this work directly as OSCA 313431 Marine Engineer, corresponding to legacy ANZSCO 231212 Ship's Engineer.",
    tasks: [
      "Operate and monitor propulsion, electrical and auxiliary machinery",
      "Plan and perform preventive and corrective engineering maintenance",
      "Diagnose machinery, control-system and plant faults",
      "Maintain engineering logs, safety records and technical documentation",
      "Manage fuel, lubrication, cooling and power-generation systems",
      "Coordinate engineering watchkeeping, emergency response and shipboard safety",
    ],
    countries: {
      AU: {
        headline: "An exact current Marine Engineer occupation with national shortage, AMSA certification and current CSOL coverage",
        entryPathway:
          "UTAS's Bachelor of Applied Science (Marine Engineering), CRICOS 077530D, and TAFE NSW's Diploma of Marine Engineering (Engineer Watchkeeper), CRICOS 107410D, are direct international-study routes aligned to seagoing marine-engineering pathways.",
        registration:
          "AMSA certificates of competency govern seagoing engineer-officer duties. Engineer Watchkeeper eligibility includes medical fitness, approved study, workshop skills, documented sea service, required STCW short courses and an oral examination.",
        jobMarketNote:
          "The exact legacy ANZSCO 231212 profile reports 1,900 workers, 8% part-time share, 4% female share, median age 45 and 55 average full-time hours. Reviewed exact earnings are unavailable. The 2025 OSL rates OSCA 313431 Marine Engineer as Shortage nationally.",
        scoreCaveat:
          "Full shortage and migration credit apply, but exact salary remains null. Broader ANZSCO 2312 vacancy data are contextual and AMSA certification plus sea-service requirements create a high entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
