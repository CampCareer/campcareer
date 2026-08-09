import type { OccupationEditorial } from "./occupation-editorial-base"

export const CHEF_OCCUPATION_EDITORIAL = [
  {
    id: "chef",
    overview:
      "Chefs plan and organise food preparation and cooking in dining and catering establishments. Australia classifies this work directly as OSCA 321131 Chef and explicitly separates Senior Chef roles such as Executive Chef, Head Chef and Sous Chef into OSCA 161631.",
    tasks: [
      "Assist with menu planning and determine food quantities and costs",
      "Prepare and cook food using recipes, techniques and professional judgement",
      "Monitor food quality, presentation and service timing",
      "Guide Cooks and Kitchenhands in preparation, cooking and food-safety practices",
      "Order and maintain kitchen food and supply inventories",
      "Coordinate with front-of-house teams during service",
      "Support recipe development and menu improvement",
      "Maintain kitchen health and safety standards",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 321131 Chef occupation with regional shortage pressure and a current TRA migration pathway",
        entryPathway:
          "TAFE NSW Certificate III in Commercial Cookery, CRICOS 109770H, is a direct practical cooking route. Certificate IV in Kitchen Management, CRICOS 109633F, extends commercial cookery into chef and kitchen-supervision capability.",
        registration:
          "There is no universal statutory occupational registration for Chefs. For migration, legacy ANZSCO 351311 Chef is on the current skilled occupation instrument with Trades Recognition Australia as assessing authority; TRA assessment requirements vary by pathway and applicant circumstances.",
        jobMarketNote:
          "The current ingest does not contain a clean six-digit labour profile restricted to the current OSCA 321131 scope, so primary employment and earnings remain null. Broader ANZSCO 3513 vacancies were 2,708.33 in May 2026, down about 6.34% year on year, while broader projections are +5.76% to 2030 and +12.47% to 2035. The 2025 OSL rates Chef as a regional shortage nationally.",
        scoreCaveat:
          "Regional-shortage evidence receives partial rather than full national-shortage credit. Broader vacancy data are not used for intensity or trend scoring, reviewed exact earnings are unavailable, and broader projections receive partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
