import type { OccupationEditorial } from "./occupation-editorial-base"

export const BAKER_OCCUPATION_EDITORIAL = [
  {
    id: "baker",
    overview:
      "Bakers prepare and bake breads, rolls, pastries and related products in bakeries, food manufacturing and retail settings. Australia classifies this work directly as OSCA 322131 Baker and keeps Pastrycook as a separate occupation.",
    tasks: [
      "Measure and mix flour, yeast, liquids and other ingredients",
      "Knead, shape, prove and prepare doughs for baking",
      "Operate ovens and baking equipment and monitor temperature and timing",
      "Finish and decorate breads and baked products",
      "Maintain ingredient stocks and production schedules",
      "Apply food-safety, hygiene and workplace-safety procedures",
      "Check finished products for consistency and quality",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 322131 Baker occupation with national shortage evidence and a current TRA migration pathway",
        entryPathway:
          "Charles Darwin University Certificate III in Baking, CRICOS 107364E, is a direct trade route. TAFE NSW Certificate III in Patisserie, CRICOS 109757E, is a related pastry-focused route that develops overlapping commercial baking skills.",
        registration:
          "There is no universal statutory occupational registration for Bakers. Legacy ANZSCO 351111 Baker is on the current skilled occupation instrument with Trades Recognition Australia as assessing authority.",
        jobMarketNote:
          "The current ingest provides an exact legacy ANZSCO 351111 context with 18,700 workers, 34% part-time share, 28% female share, median age 36 and 43 average full-time hours; reviewed exact earnings remain unavailable. Broader ANZSCO 3511 vacancies were 424.67 in May 2026, up about 8.89% year on year. The 2025 OSL records Baker as a national Shortage occupation.",
        scoreCaveat:
          "National shortage, direct training and current migration evidence receive credit. Broader vacancy data are not used for intensity or trend scoring, exact earnings remain null, and broader projections receive partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
