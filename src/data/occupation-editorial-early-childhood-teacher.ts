import type { OccupationEditorial } from "./occupation-editorial-base"

export const EARLY_CHILDHOOD_TEACHER_OCCUPATION_EDITORIAL = [
  {
    id: "early-childhood-teacher",
    overview:
      "Early Childhood Teachers design, deliver and evaluate educational programs for young children, support their learning and wellbeing, work with families and other professionals, and document children's progress. Australia's current OSCA classifies this work as 251131 Early Childhood (Pre-primary School) Teacher, a Skill Level 1 occupation that excludes early childhood educators, room leaders, preschool directors and special education teachers.",
    tasks: [
      "Develop and deliver play-based educational programs using approved early learning frameworks",
      "Observe, assess and document children's learning, development, wellbeing and participation",
      "Create safe, inclusive and engaging environments that support children's social, emotional and cognitive development",
      "Build reciprocal relationships with children and families and communicate learning progress",
      "Work with colleagues, community services and external specialists to support children's needs",
      "Provide pedagogical leadership, mentor staff and comply with education and care legislation and service policies",
    ],
    countries: {
      AU: {
        headline:
          "An exact OSCA Skill Level 1 teaching occupation in 2025 national shortage, with ACECQA as the migration assessing authority and jurisdiction-specific teacher registration requirements",
        entryPathway:
          "A recognised early childhood teaching qualification is the standard route. Deakin University's Bachelor of Early Childhood Education, CRICOS 102806B, is an AQF Level 7 initial teacher education program approved by ACECQA, while its Master of Teaching (Early Childhood), CRICOS 114296J, is an AQF Level 9 graduate-entry route. Both include supervised professional experience and support eligibility for Victorian Institute of Teaching registration as an Early Childhood Teacher, subject to current registration requirements.",
        registration:
          "OSCA states that registration or licensing is required. In practice, early childhood teacher registration requirements vary by state, territory and employment setting. ACECQA assesses Early Childhood (Pre-primary School) Teacher 241111 for migration, while teacher registration or accreditation is handled by the relevant jurisdictional authority. Applicants should confirm the rules for the state or territory and setting in which they intend to work.",
        jobMarketNote:
          "The reviewed 2025 Occupation Shortage List rates current OSCA 251131 as a national shortage occupation. JSA's current labour-market profile remains published at broader legacy ANZSCO unit group 2411, with about 71,900 workers and median full-time earnings of A$1,906 per week; CampCareer therefore keeps employment and earnings out of the exact six-digit headline metrics. Broader 2411 vacancies fell from 1,373 in May 2025 to about 1,072.67 in May 2026.",
        scoreCaveat:
          "The opportunity score gives full national-shortage and skilled-migration credit, but does not treat broader ANZSCO 2411 employment, earnings or vacancy intensity as exact Early Childhood Teacher observations. Broader vacancies fell about 21.87% year on year, so vacancy trend receives no credit. Broader projections of about +5.72% to 2030 and +12.08% to 2035 receive partial growth credit. Registration and qualification requirements reduce the entry-burden bonus.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
