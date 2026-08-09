import type { OccupationEditorial } from "./occupation-editorial-base"

export const COMMUNITY_WORKER_OCCUPATION_EDITORIAL = [
  {
    id: "community-worker",
    overview:
      "Community Workers help individuals, families and communities access practical support, services, education and opportunities that improve wellbeing and participation. Australia's current OSCA uses the title Community Support Worker, code 411232, and explicitly lists Community Worker and Community Services Worker as alternative titles. It is a Skill Level 2 occupation.",
    tasks: [
      "Assess individuals', families' and communities' practical support needs and available local resources",
      "Connect clients with housing, health, employment, emergency relief and other community services",
      "Plan and deliver community education, support and participation programs",
      "Provide practical and emotional support and advocate for people experiencing disadvantage or crisis",
      "Coordinate referrals, transport, outreach and collaboration with community organisations and government services",
      "Maintain records and contribute to service evaluation, community-development planning and continuous improvement",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA Community Support Worker occupation with direct community-services study routes, but no clean aligned JSA labour series or reviewed current CSOL pathway",
        entryPathway:
          "OSCA Skill Level 2 corresponds to an AQF Associate Degree, Advanced Diploma or Diploma, or relevant experience. TAFE NSW's Diploma of Community Services, CRICOS 118878K, is a one-year international vocational route with work placement, while Torrens University's Bachelor of Community Services, CRICOS 111741F, is a three-year AQF 7 route with substantial fieldwork.",
        registration:
          "There is no universal statutory occupational registration for Community Support Workers. Depending on the client group and employer, working-with-children checks, NDIS worker screening, police checks, first aid or other safeguarding requirements may apply.",
        jobMarketNote:
          "Current OSCA 411232 is the exact canonical match and lists Community Worker and Community Services Worker as alternative titles. ABS correspondence maps it to ANZSCO 411512, but that historical classification does not provide a clean Australian labour-market series for the current occupation. CampCareer therefore leaves employment, earnings, vacancies and growth null rather than borrowing legacy Community Worker or Welfare Support Worker data as if it were exact. The 2025 OSL is No Shortage nationally, with shortage signals in the Northern Territory and Western Australia.",
        scoreCaveat:
          "The score is intentionally data-conservative. National shortage, labour-market intensity, earnings, growth and visa components receive no credit because no aligned current labour series or reviewed CSOL pathway is available for OSCA 411232. Direct diploma/bachelor entry routes and broad employer diversity are retained, while setting-specific screening is reflected in entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
