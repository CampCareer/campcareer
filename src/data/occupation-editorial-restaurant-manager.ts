import type { OccupationEditorial } from "./occupation-editorial-base"

export const RESTAURANT_MANAGER_OCCUPATION_EDITORIAL = [
  {
    id: "restaurant-manager",
    overview:
      "Restaurant managers organise and control the operations of cafes and restaurants, including staffing, service standards, stock, budgets and customer experience. Australia classifies this work directly as OSCA 161231 Cafe or Restaurant Manager.",
    tasks: [
      "Plan menus, service standards and operating procedures with kitchen and service teams",
      "Manage staffing, training, rostering and performance",
      "Control purchasing, stock, cash handling and operating costs",
      "Monitor dining-room service and resolve customer issues",
      "Coordinate bookings, functions and daily service capacity",
      "Maintain food-safety, workplace-safety and venue compliance requirements",
      "Review sales and operating results and improve service efficiency",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 161231 Cafe or Restaurant Manager occupation with no current CSOL inclusion",
        entryPathway:
          "TAFE NSW Diploma of Hospitality Management, CRICOS 112061M, is a direct vocational management route. UQ's Bachelor of Tourism, Hospitality and Event Management, CRICOS 103168H, provides a broader hospitality-management route.",
        registration:
          "There is no universal occupational registration for Cafe or Restaurant Managers, although liquor and venue-specific licensing can apply. VETASSESS assesses legacy ANZSCO 141111 Cafe or Restaurant Manager as Group C, but the occupation is not on the current Core Skills Occupation List.",
        jobMarketNote:
          "The reviewed ingest does not provide a clean exact six-digit employment or earnings profile for current OSCA 161231. Broader ANZSCO 1411 vacancies were 597.67 in May 2026, down about 7.77% year on year, with projections of +1.75% to 2030 and +7.17% to 2035. The 2025 OSL records Cafe or Restaurant Manager as No Shortage nationally.",
        scoreCaveat:
          "No shortage or current CSOL credit is assigned. Broader vacancy data remain contextual, exact earnings are unavailable, and management roles generally require practical service responsibility beyond completion of a course.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
