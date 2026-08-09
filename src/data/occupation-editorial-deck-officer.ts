import type { OccupationEditorial } from "./occupation-editorial-base"

export const DECK_OFFICER_OCCUPATION_EDITORIAL = [
  {
    id: "deck-officer",
    overview:
      "Deck officers navigate and operate commercial vessels, maintain bridge watches and coordinate deck operations and safety. OSCA 313436 Ship's Officer explicitly lists Deck Officer as an alternative title, giving the canonical career an exact current Australian title match.",
    tasks: [
      "Plan passages and maintain safe navigational watches",
      "Operate bridge navigation, radar, communications and safety equipment",
      "Monitor weather, traffic, vessel position and voyage progress",
      "Supervise deck crews, cargo operations and emergency procedures",
      "Maintain statutory logs, records and safety documentation",
      "Coordinate with masters, engineers, ports, pilots and shore operations",
    ],
    countries: {
      AU: {
        headline: "An exact Deck Officer alternative-title match with national shortage and mandatory AMSA certification, but no current CSOL pathway",
        entryPathway:
          "UTAS's Bachelor of Applied Science (Nautical Science), CRICOS 077531C, and TAFE NSW's Diploma of Maritime Operations, CRICOS 105105G, are direct international-study routes aligned to deck-watchkeeping careers.",
        registration:
          "AMSA Watchkeeper Deck certification requires medical fitness, approved training, documented sea service, required STCW safety training, radio certification and a final oral examination.",
        jobMarketNote:
          "The exact legacy ANZSCO 231214 Ship's Officer profile reports 550 workers, 6% part-time share, 10% female share, median age 40 and 61 average full-time hours. Reviewed exact earnings are unavailable. The 2025 OSL rates OSCA 313436 Ship's Officer as Shortage nationally.",
        scoreCaveat:
          "Full shortage credit applies, but the current CSOL does not include Ship's Officer and exact salary remains null. Broader 2312 vacancy data remain contextual and AMSA sea-service/certification requirements make entry demanding.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
