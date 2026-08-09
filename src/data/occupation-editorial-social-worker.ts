import type { OccupationEditorial } from "./occupation-editorial-base"

export const SOCIAL_WORKER_OCCUPATION_EDITORIAL = [
  {
    id: "social-worker",
    overview:
      "Social Workers assess people's social, emotional, family and environmental circumstances, plan interventions, connect clients with services, advocate for rights and safety, and support people through health, disability, family, housing and community-service systems. Australia's current OSCA classifies Social Worker as the standalone Skill Level 1 occupation 261331.",
    tasks: [
      "Assess clients' social, family, health, housing, financial and psychosocial needs and risks",
      "Develop support, intervention and case-management plans with clients and relevant services",
      "Provide counselling, advocacy, crisis support and practical assistance within professional scope",
      "Coordinate referrals and multidisciplinary support across health, community and government services",
      "Maintain case records, reports, safeguarding documentation and outcome reviews",
      "Contribute to community programs, policy responses and service improvements addressing social disadvantage",
    ],
    countries: {
      AU: {
        headline:
          "An exact Skill Level 1 profession with a current AASW migration-assessment pathway and strong long-run demand, but a 2025 national No Shortage result with shortages concentrated in selected jurisdictions",
        entryPathway:
          "The standard professional routes are an AASW-accredited four-year Bachelor of Social Work or an accredited qualifying Master of Social Work for graduates from another discipline. RMIT's Bachelor of Social Work (Honours), CRICOS 079596C, is a direct undergraduate route, while the University of Melbourne Master of Social Work, CRICOS 061212E, is a graduate-entry qualifying route.",
        registration:
          "Australia does not currently have a universal statutory registration scheme for all Social Workers. AASW accredits qualifying social-work programs and is the migration skills assessing authority for Social Worker 272511; employers may require AASW eligibility or additional screening for particular settings.",
        jobMarketNote:
          "Current OSCA 261331 corresponds to ANZSCO 272511 Social Worker. JSA's legacy 2725 Social Workers profile is tightly aligned to that occupation and reports about 47,400 workers, median full-time earnings of A$2,172 per week and A$57 per hour. The 2025 OSL is No Shortage nationally, with shortage signals in the ACT, Northern Territory and South Australia and a regional-shortage signal in Victoria.",
        scoreCaveat:
          "The score uses the aligned legacy 2725 Social Workers labour series while keeping its classification vintage explicit. May 2026 vacancies were about 8.21% lower year on year, so vacancy trend receives no credit. Strong vacancy intensity, above-median earnings, long-run employment growth and the current AASW migration pathway still differentiate Social Worker from the other community-service occupations.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
