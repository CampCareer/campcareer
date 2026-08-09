import type { OccupationEditorial } from "./occupation-editorial-base"

export const TOURISM_MANAGER_OCCUPATION_EDITORIAL = [
  {
    id: "tourism-manager",
    overview:
      "Tourism managers plan and coordinate tourism products, visitor experiences, operations and commercial partnerships. Current OSCA does not provide a single principal occupation titled Tourism Manager; CampCareer uses OSCA 161999 Hospitality, Tourism and Venue Managers nec as a related management proxy because it explicitly includes Tour Operator.",
    tasks: [
      "Plan tourism products, itineraries and visitor experiences",
      "Coordinate suppliers, transport, accommodation and activity partners",
      "Manage budgets, pricing, staffing and operating schedules",
      "Develop partnerships with destinations, attractions and travel distributors",
      "Monitor customer experience, safety and service quality",
      "Review tourism demand, sales and operating performance",
      "Support marketing and commercial development of tourism offerings",
    ],
    countries: {
      AU: {
        headline:
          "A conservative related-proxy profile using OSCA 161999 Hospitality, Tourism and Venue Managers nec rather than inventing an exact Tourism Manager code",
        entryPathway:
          "UQ's Bachelor of Tourism, Hospitality and Event Management, CRICOS 103168H, offers a Tourism and Event Management major. TAFE NSW Diploma of Travel and Tourism Management, CRICOS 112058F, is a direct vocational tourism-management route.",
        registration:
          "There is no universal statutory registration for Tourism Managers. Legacy ANZSCO 141999 Accommodation and Hospitality Managers nec is on the current skilled occupation instrument with VETASSESS, but CampCareer awards only partial migration credit because the canonical Tourism Manager title is represented by a related OSCA proxy rather than an exact principal occupation.",
        jobMarketNote:
          "The legacy ANZSCO 141999 profile has 4,400 workers, 39% part-time share, 57% female share, median age 52 and 50 average full-time hours, but these remain proxy context rather than primary metrics. Broader ANZSCO 1419 vacancies were 99 in May 2026, down about 1.33% year on year, with projections of +2.12% to 2030 and +9.27% to 2035. OSCA 161999 is No Shortage nationally in the 2025 OSL.",
        scoreCaveat:
          "Primary employment and earnings stay null because the canonical mapping is a proxy. Migration credit is partial, shortage receives none, and broader vacancy data are not used for intensity or trend scoring.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
