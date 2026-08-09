import type { OccupationEditorial } from "./occupation-editorial-base"

export const FOOD_TECHNOLOGIST_OCCUPATION_EDITORIAL = [
  {
    id: "food-technologist",
    overview:
      "Food technologists develop and improve food products and production methods, establish food-processing and packaging standards, and test products for safety, quality and regulatory compliance. Australia's current OSCA classifies Food Technologist as the standalone Skill Level 1 occupation 244232, with Food Scientist as a specialisation.",
    tasks: [
      "Develop new food products and improve existing formulations",
      "Design and improve food processing, preservation and packaging methods",
      "Develop and maintain quality systems for food processing",
      "Test raw materials, ingredients and finished products for safety and quality",
      "Check food products against health regulation and quality standards",
      "Conduct research into product quality, nutrition, shelf life and manufacturing processes",
    ],
    countries: {
      AU: {
        headline:
          "An exact current Skill Level 1 Food Technologist occupation with a current VETASSESS migration pathway, but a 2025 national No Shortage result",
        entryPathway:
          "RMIT's Bachelor of Food Technology and Nutrition, CRICOS 110979C, is a three-year undergraduate route with a food technology major and industry-linked practical work. RMIT's Master of Food Science and Technology, CRICOS 094062G, is a two-year postgraduate route covering food processing, safety, manufacturing and product innovation.",
        registration:
          "There is no universal statutory occupational registration for Food Technologists. For migration skills assessment, VETASSESS assesses ANZSCO 234212 as Group A and requires a highly relevant bachelor degree or higher plus relevant post-qualification employment.",
        jobMarketNote:
          "The aligned six-digit JSA profile for ANZSCO 234212 records 1,400 workers, but does not publish six-digit median earnings. Broader ANZSCO 2342 earnings, vacancy and projection data are retained only as context. The 2025 OSL records Food Technologist as No Shortage nationally, with a shortage signal in NSW.",
        scoreCaveat:
          "The score receives full current migration-list credit but no salary or vacancy-intensity credit because six-digit earnings and exact vacancy series are unavailable. Broader 2342 vacancies declined about 12.76% year on year, while broader employment projections remain positive.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
