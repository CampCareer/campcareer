import type { OccupationEditorial } from "./occupation-editorial-base"

export const COUNSELLOR_OCCUPATION_EDITORIAL = [
  {
    id: "counsellor",
    overview:
      "Counsellors help individuals, families and groups identify and work through emotional, psychological and life difficulties using structured therapeutic interventions, assessment, referral and support. Australia's current OSCA classifies Counsellor (General) as the standalone Skill Level 1 occupation 261131. Family and Relationship Counsellors and other named counselling occupations are classified separately.",
    tasks: [
      "Provide individual and group counselling sessions for emotional, behavioural and life challenges",
      "Assess counselling needs, risks and suitability for different interventions or referrals",
      "Help clients understand and adjust attitudes, expectations, behaviours and coping strategies",
      "Develop counselling goals and intervention plans and review progress with clients",
      "Refer clients to health professionals, community services or specialist supports when appropriate",
      "Maintain confidential records and follow ethical, safeguarding and professional-practice requirements",
    ],
    countries: {
      AU: {
        headline:
          "An exact current Skill Level 1 Counsellor (General) occupation with clear bachelor and master study routes, but a 2025 national No Shortage result and no reviewed generic-Counsellor CSOL pathway",
        entryPathway:
          "A counselling bachelor or relevant postgraduate counselling qualification is the clearest professional route. ECU's Bachelor of Counselling, CRICOS 083640C, is a three-year AQF Level 7 undergraduate route, while Deakin's Master of Counselling, CRICOS 112781A, is a two-year AQF Level 9 postgraduate route with supervised placement experience.",
        registration:
          "There is no universal statutory licensing or registration requirement for Counsellors in Australia. Professional association membership or accreditation can matter to employers and clients. VETASSESS assesses ANZSCO 272199 Counsellors nec for migration purposes, but that skills assessment is separate from occupation-list eligibility and from professional membership.",
        jobMarketNote:
          "Current OSCA 261131 Counsellor (General) is narrower than the legacy ANZSCO 272199 Counsellors nec profile, which also includes Life Coach and excludes several separately classified counselling occupations. CampCareer therefore leaves exact current employment and earnings null. Broader ANZSCO 2721 Counsellors data and the 5,800-worker legacy 272199 profile are retained only as context. The reviewed 2025 OSL records Counsellor (General) as No Shortage nationally.",
        scoreCaveat:
          "The score is conservative because exact current employment and salary are unavailable and the reviewed current CSOL snapshot does not include generic OSCA 261131 Counsellor (General). Broader 2721 vacancies fell about 14.15% year on year, while broader projections remain strong at about +12.98% to 2030 and +23.36% to 2035, so only partial growth credit is used.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
