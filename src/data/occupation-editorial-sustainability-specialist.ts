import type { OccupationEditorial } from "./occupation-editorial-base"

export const SUSTAINABILITY_SPECIALIST_OCCUPATION_EDITORIAL = [
  {
    id: "sustainability-specialist",
    overview:
      "Sustainability specialists help organisations measure environmental impacts, improve environmental and sustainability performance, develop policies and management strategies, and embed environmental considerations into operations and projects. Australia does not currently classify a standalone Sustainability Specialist occupation; OSCA 244431 Environmental Consultant is the closest cross-industry professional proxy because its tasks explicitly include advice to improve organisational sustainability performance.",
    tasks: [
      "Assess environmental and sustainability impacts of operations, projects and policies",
      "Develop and improve environmental management and sustainability strategies",
      "Set sustainability objectives, measures and reporting approaches",
      "Advise teams and leaders on environmental best practice and risk mitigation",
      "Support impact assessments, compliance reviews and improvement programs",
      "Coordinate sustainability initiatives across government, consulting or private-sector organisations",
    ],
    countries: {
      AU: {
        headline:
          "A cross-industry sustainability career mapped conservatively to current OSCA 244431 Environmental Consultant rather than presented as a standalone Australian occupation",
        entryPathway:
          "Deakin's Bachelor of Environmental Science and Sustainability, CRICOS 116267J, is a three-year AQF Level 7 route. Deakin's Master of Sustainability, CRICOS 108875G, is a 1.5-year AQF Level 9 postgraduate route with environmental management and industry-practice options.",
        registration:
          "There is no universal statutory registration for Sustainability Specialists. VETASSESS assesses the related ANZSCO 234312 Environmental Consultant as Group A; that migration skills assessment is relevant only where the applicant's actual duties fit Environmental Consultant scope.",
        jobMarketNote:
          "Because Sustainability Specialist has no standalone current OSCA code, CampCareer does not use Environmental Consultant employment or earnings as exact primary metrics. The 5,100-worker ANZSCO 234312 profile and broader 2343 earnings, vacancies and projections are contextual only. The 2025 OSL records Environmental Consultant as No Shortage nationally, with shortage signals in SA and NT.",
        scoreCaveat:
          "The score is deliberately conservative: national shortage, salary and vacancy intensity receive no credit, and the current Environmental Consultant migration pathway receives only partial credit because it is a proxy rather than a one-to-one Sustainability Specialist occupation mapping.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
