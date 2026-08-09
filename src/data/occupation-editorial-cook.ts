import type { OccupationEditorial } from "./occupation-editorial-base"

export const COOK_OCCUPATION_EDITORIAL = [
  {
    id: "cook",
    overview:
      "Cooks prepare, season and cook food in dining and catering establishments. Australia classifies this work directly as OSCA 322331 Cook and explicitly separates Chefs, Fast Food Cooks and Kitchenhands.",
    tasks: [
      "Inspect and select ingredients for cooking",
      "Measure, clean, chop, blend, season, heat and cool food",
      "Monitor cooking processes and food presentation",
      "Coordinate with kitchen staff during preparation and service",
      "Clean and maintain kitchen equipment and utensils",
      "Monitor food and equipment inventories",
      "Assist with recipe and menu development",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 322331 Cook occupation with national shortage evidence and a current TRA migration pathway",
        entryPathway:
          "TAFE NSW Certificate III in Commercial Cookery, CRICOS 109770H, is a direct practical route. Certificate IV in Kitchen Management, CRICOS 109633F, is a related higher-level route that develops commercial cooking and kitchen-supervision capability.",
        registration:
          "There is no universal statutory occupational registration for Cooks. For migration, legacy ANZSCO 351411 Cook is on the current skilled occupation instrument with Trades Recognition Australia as assessing authority.",
        jobMarketNote:
          "The reviewed ingest does not provide a clean exact six-digit employment or earnings profile for the current OSCA 322331 scope. Broader ANZSCO 3514 vacancies were 1,055.33 in May 2026, down about 3.42% year on year, while broader projections are +5.97% to 2030 and +12.54% to 2035. The 2025 OSL records Cook as a national Shortage occupation.",
        scoreCaveat:
          "National shortage and current migration eligibility receive credit. Broader vacancy data are not used for intensity or trend scoring, reviewed exact earnings are unavailable, and broader projections receive partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
