import type { OccupationEditorial } from "./occupation-editorial-base"

export const AGRONOMIST_OCCUPATION_EDITORIAL = [
  {
    id: "agronomist",
    overview:
      "Agronomists advise on crop and livestock production by analysing soils, growing conditions, pests, diseases, animal nutrition and other environmental and production factors. Australia's current OSCA classifies Agronomist as standalone occupation 244133, Skill Level 1; Agricultural Research Scientist is separate.",
    tasks: [
      "Collect and analyse soil, crop, pasture, livestock and production data",
      "Advise farmers and farm managers on improving crop and livestock productivity",
      "Recommend approaches for pest, weed and disease control and soil improvement",
      "Assess environmental and climatic factors affecting agricultural production",
      "Develop practical production, nutrition and resource-management strategies",
      "Monitor outcomes and communicate technical recommendations to producers and agribusinesses",
    ],
    countries: {
      AU: {
        headline:
          "A current standalone Skill Level 1 Agronomist occupation with national shortage and a current 234115/VETASSESS skilled-migration pathway",
        entryPathway:
          "A bachelor degree in agricultural science, agronomy, crop science or another highly relevant agricultural field is the clearest route. UQ's Bachelor of Agricultural Science, CRICOS 0100492, includes an Agronomy major; its Master of Agricultural Science, CRICOS 079381G, provides a graduate route.",
        registration:
          "There is no universal statutory occupational registration requirement for Agronomists. VETASSESS assesses current ANZSCO 234115 Agronomist as a Group A occupation and requires a highly relevant bachelor degree or higher plus relevant employment evidence.",
        jobMarketNote:
          "Current OSCA 244133 maps to current ANZSCO 2022 occupation 234115. CampCareer's older OSCA correspondence staging retains ANZSCO v1.3 code 225499, so that field is not rewritten as if it were the 2022 code. JSA does not provide a clean six-digit 234115 labour profile in the current ingest, so employment and earnings remain null and broader 2341 data are contextual only.",
        scoreCaveat:
          "The 2025 OSL records Agronomist in shortage nationally and across the states and territories, and the current skilled occupation instrument lists 234115 with VETASSESS. Broader 2341 vacancies fell about 12.50% year on year, while broader projections remain positive at about +8.76% to 2030 and +17.48% to 2035; only partial growth credit is used.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
