import type { OccupationEditorial } from "./occupation-editorial-base"

export const EVENT_PLANNER_OCCUPATION_EDITORIAL = [
  {
    id: "event-planner",
    overview:
      "Event planners organise conferences, exhibitions, festivals, corporate functions and other events from concept through delivery. Current OSCA classifies Event Planner as an explicit specialisation of OSCA 172231 Event Manager.",
    tasks: [
      "Develop event concepts, scopes, budgets and delivery schedules",
      "Coordinate venues, suppliers, catering, transport and production services",
      "Manage registrations, guest logistics and stakeholder communications",
      "Negotiate contracts and monitor event expenditure",
      "Coordinate event staff, contractors and on-site operations",
      "Manage safety, contingency planning and venue requirements",
      "Review event outcomes, participant feedback and financial performance",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA specialisation pathway through 172231 Event Manager, where Event Planner is explicitly listed",
        entryPathway:
          "TAFE NSW Diploma of Event Management, CRICOS 112057G, is a direct vocational route. UQ's Bachelor of Tourism, Hospitality and Event Management, CRICOS 103168H, offers a Tourism and Event Management major.",
        registration:
          "There is no universal statutory occupational registration for Event Planners. VETASSESS assesses legacy ANZSCO 149311 Conference and Event Organiser as Group C and recognises Event Manager and Event Planner as related titles, but 149311 is not on the current Core Skills Occupation List.",
        jobMarketNote:
          "Primary employment and earnings remain null because the reviewed ingest does not provide a clean exact six-digit current profile. Broader ANZSCO 1493 vacancies were 447.67 in May 2026, up about 1.90% year on year, with projections of +5.62% to 2030 and +12.23% to 2035. The 2025 OSL records OSCA 172231 Event Manager as No Shortage nationally.",
        scoreCaveat:
          "The exact specialisation mapping is retained, but no shortage or current CSOL credit is assigned. Broader vacancy data are contextual only, exact earnings are unavailable, and broader projections receive partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
