import type { OccupationEditorial } from "./occupation-editorial-base"

export const HOTEL_MANAGER_OCCUPATION_EDITORIAL = [
  {
    id: "hotel-manager",
    overview:
      "Hotel managers organise and control hotel or motel operations across accommodation, guest services, staffing, food and beverage, facilities and financial performance. Australia classifies this work directly as OSCA 161431 Hotel or Motel Manager.",
    tasks: [
      "Direct reservation, reception, room-service and housekeeping operations",
      "Manage staff hiring, training, rostering and performance",
      "Oversee property security, maintenance and service standards",
      "Plan and supervise hotel food, beverage, function and conference activities",
      "Monitor guest satisfaction and resolve service issues",
      "Manage operating budgets, revenue and purchasing",
      "Maintain compliance with health, safety and venue-specific licensing requirements",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 161431 Hotel or Motel Manager occupation with a current VETASSESS Group C migration pathway",
        entryPathway:
          "UQ's Bachelor of Tourism, Hospitality and Event Management, CRICOS 103168H, includes a Hotel and Hospitality Management major. TAFE NSW Diploma of Hospitality Management, CRICOS 112061M, is a direct vocational management route into supervisory and management capability.",
        registration:
          "There is no universal occupational registration for Hotel or Motel Managers, although venue-specific liquor, gaming or other licensing can apply. VETASSESS assesses legacy ANZSCO 141311 Hotel or Motel Manager as Group C and requires relevant qualification and employment evidence under the applicable pathway.",
        jobMarketNote:
          "The reviewed ingest does not provide a clean exact six-digit employment or earnings profile for the current OSCA 161431 scope. Broader ANZSCO 1413 vacancies were 572 in May 2026, down about 2.39% year on year, with projections of +0.94% to 2030 and +7.40% to 2035. The 2025 OSL records Hotel or Motel Manager as No Shortage nationally.",
        scoreCaveat:
          "Current migration eligibility receives credit, but No Shortage receives none. Broader vacancy data remain contextual, exact earnings are unavailable, and management roles generally require practical responsibility beyond completion of a course.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
