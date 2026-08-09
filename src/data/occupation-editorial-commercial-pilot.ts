import type { OccupationEditorial } from "./occupation-editorial-base"

export const COMMERCIAL_PILOT_OCCUPATION_EDITORIAL = [
  {
    id: "commercial-pilot",
    overview:
      "Commercial pilots operate aircraft for paid passenger, freight, charter and specialist operations. CampCareer maps the Australian profile to current OSCA 299131 Aeroplane Pilot, while keeping helicopter and other pilot occupations outside this scope.",
    tasks: [
      "Plan flights using weather, route, fuel, weight and operational information",
      "Conduct aircraft inspections, checks and cockpit preparation",
      "Operate aircraft safely through all phases of flight",
      "Communicate with air traffic control and operational teams",
      "Apply aviation regulations, company procedures and threat-and-error management",
      "Complete flight records, reports and post-flight duties",
    ],
    countries: {
      AU: {
        headline: "An exact current Aeroplane Pilot scope with national shortage, CASA licensing and current CSOL coverage",
        entryPathway:
          "RMIT's Bachelor of Aviation (Pilot Training), CRICOS 111190K, and UNSW's Bachelor of Aviation (Flying), CRICOS 017227G, are current international-study routes that combine academic aviation study with professional flight training.",
        registration:
          "A CASA Commercial Pilot Licence is required to fly aeroplanes for work. The pathway includes age and English requirements, theory examinations, approved flight training, aeronautical experience, a flight test and aviation medical requirements.",
        jobMarketNote:
          "The exact legacy ANZSCO 231111 Aeroplane Pilot profile reports 8,200 workers, 39% part-time share, 7% female share, median age 41 and 44 average full-time hours. Reviewed exact earnings are unavailable. The 2025 OSL rates OSCA 299131 Aeroplane Pilot as Shortage nationally.",
        scoreCaveat:
          "The occupation receives full shortage and current migration credit, but exact salary remains null. Broader ANZSCO 2311 vacancy and projection data are contextual and the licensing/training burden is high.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
