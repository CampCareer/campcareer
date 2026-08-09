import type { OccupationEditorial } from "./occupation-editorial-base"

export const YOUTH_WORKER_OCCUPATION_EDITORIAL = [
  {
    id: "youth-worker",
    overview:
      "Youth Workers support young people experiencing social, emotional, family, housing, education or financial difficulties, build engagement and resilience, coordinate services and advocate for young people's safety and participation. Australia's current OSCA classifies Youth Worker as Skill Level 2 occupation 411733, separate from Residential Youth Worker and Youth Justice Worker.",
    tasks: [
      "Build trusted relationships with young people and assess support needs, strengths, risks and goals",
      "Plan and deliver individual, group and community youth-support activities",
      "Provide practical assistance, advocacy, referral and crisis support within professional scope",
      "Coordinate with families, schools, health services, housing providers and community organisations",
      "Maintain case notes, safeguarding documentation and service plans and review progress",
      "Support youth participation, education, employment, wellbeing and community-development initiatives",
    ],
    countries: {
      AU: {
        headline:
          "A Skill Level 2 community-services occupation with a current reviewed skilled-migration correspondence, but a 2025 national No Shortage result and legacy labour data that now spans more than one current OSCA youth occupation",
        entryPathway:
          "Youth-work degrees provide direct professional preparation, while employers may also accept relevant community-services qualifications plus experience depending on the role. RMIT's Bachelor of Youth Work and Youth Studies, CRICOS 098456B, and ACU's Bachelor of Youth Work, CRICOS 084316G, are direct three-year undergraduate routes with supervised field education.",
        registration:
          "There is no universal statutory occupational registration for Youth Workers in Australia. Working-with-children checks, police checks and employer safeguarding requirements commonly apply. Migration skills assessment is separate from occupational screening and must match the relevant ANZSCO duties.",
        jobMarketNote:
          "Current OSCA 411733 maps to legacy ANZSCO 411716 Youth Worker, but the same legacy code also corresponds to current OSCA 411732 Youth Justice Worker. CampCareer therefore does not treat the legacy 16,200-worker profile or broader 4117 earnings as exact current Youth Worker metrics. The 2025 OSL is No Shortage nationally, with shortage signals in the Northern Territory and Western Australia.",
        scoreCaveat:
          "Exact current employment and earnings are left null because the legacy 411716 scope split across current OSCA occupations. Broader 4117 vacancies were about 1.76% lower year on year and projections are +6.04% to 2030 and +11.89% to 2035, so only partial growth credit is used. The reviewed current skilled-occupation correspondence receives visa credit while the score remains provisional.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
