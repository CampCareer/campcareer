import type { OccupationEditorial } from "./occupation-editorial-base"

export const ENVIRONMENTAL_SCIENTIST_OCCUPATION_EDITORIAL = [
  {
    id: "environmental-scientist",
    overview:
      "Environmental Scientists study environmental systems and human impacts, collect and analyse field and laboratory evidence, and develop plans for pollution control, rehabilitation, conservation and environmental management. In Australia's current OSCA, Environmental Scientist is the alternative title of 244432 Environmental Research Scientist, a standalone Skill Level 1 occupation.",
    tasks: [
      "Collect and analyse environmental samples and monitoring data",
      "Investigate pollution, land degradation and other adverse environmental factors",
      "Assess the environmental impacts of development and operational activities",
      "Develop conservation, rehabilitation and environmental management plans",
      "Design and conduct environmental research and monitoring projects",
      "Prepare technical reports and communicate findings to governments, communities and industry",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA Environmental Scientist mapping with a 2025 national shortage signal, but no current CSOL entry for ANZSCO 234313",
        entryPathway:
          "A bachelor degree in environmental science is the clearest entry route. RMIT's Bachelor of Environmental Science, CRICOS 110981J, is a three-year direct route. The University of Melbourne's two-year Master of Environmental Science, CRICOS 092793M, is a relevant graduate pathway for applicants with a cognate science degree.",
        registration:
          "There is no universal statutory occupational registration requirement for Environmental Scientists in Australia. VETASSESS assesses ANZSCO 234313 Environmental Research Scientist for migration skills-assessment purposes; its Group A pathway requires a highly relevant bachelor degree or higher plus relevant post-qualification employment.",
        jobMarketNote:
          "Current OSCA 244432 maps cleanly to ANZSCO 2022 occupation 234313. JSA's aligned legacy six-digit profile reports 5,500 workers but does not publish six-digit earnings. Vacancy and projection series are available only at broader ANZSCO 2343 Environmental Scientists level, so those figures remain contextual rather than exact.",
        scoreCaveat:
          "The score gives full credit for the 2025 national shortage result but no visa credit because the current CSOL lists Environmental Consultant 234312 and Environmental Scientists nec 234399, not Environmental Research Scientist 234313. Broader 2343 vacancies fell about 5.20% year on year; broader projections of about +8.90% to 2030 and +16.64% to 2035 receive only partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
