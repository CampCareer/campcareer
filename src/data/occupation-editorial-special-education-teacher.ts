import type { OccupationEditorial } from "./occupation-editorial-base"

export const SPECIAL_EDUCATION_TEACHER_OCCUPATION_EDITORIAL = [
  {
    id: "special-education-teacher",
    overview:
      "Special Education Teachers teach academic, communication and living skills to students with particular learning difficulties or disability, develop individualised learning and wellbeing plans, assess progress and collaborate with families and support professionals. Australia's current OSCA classifies this work as 251431 Special Education Teacher, a Skill Level 1 occupation that excludes Specialist Teachers (Vision Impairment) and Teachers of the Deaf.",
    tasks: [
      "Assess students' learning strengths, needs and barriers across academic, communication, social and functional areas",
      "Develop and implement individualised learning, behaviour and wellbeing plans",
      "Deliver differentiated teaching and adapt curriculum, materials, technology and assessment methods",
      "Monitor and document progress and use assessment results to refine teaching strategies",
      "Work with families, classroom teachers, allied health professionals and support staff",
      "Advise colleagues and families on inclusive strategies, adjustments, resources and specialist supports",
    ],
    countries: {
      AU: {
        headline:
          "An exact OSCA Skill Level 1 specialist-teaching occupation in 2025 national shortage, with aligned 241511 employment data, AITSL migration assessment and mandatory teacher registration",
        entryPathway:
          "Initial teacher education must support teacher registration and preparation for special or inclusive education practice. Australian Catholic University's Bachelor of Education (Secondary and Special Education), CRICOS 0102078, is a four-year program whose graduates are eligible for registration as secondary or special education teachers. Flinders University's Bachelor of Education (Inclusive Education), CRICOS 117254F, is a four-year international undergraduate route focused on inclusive education. Registration eligibility remains subject to the relevant state or territory authority.",
        registration:
          "Registration is required to work as a school teacher and is administered by state and territory teacher regulatory authorities. AITSL is the migration skills assessing authority for ANZSCO 241511 Special Needs Teacher. Migration assessment and teacher registration are separate, and specialist practice may also depend on the employing jurisdiction, school system and role requirements.",
        jobMarketNote:
          "The reviewed 2025 Occupation Shortage List rates current OSCA 251431 Special Education Teacher as a national shortage occupation. JSA's aligned six-digit legacy ANZSCO 241511 Special Needs Teacher profile reports about 23,000 workers, with 39% part-time, 86% female, median age 45 and average full-time hours of 43 per week. Six-digit median earnings are not published, so broader ANZSCO 2415 earnings remain context only. Broader 2415 vacancies were essentially flat at 57 in May 2026 versus 56.67 a year earlier.",
        scoreCaveat:
          "The opportunity score uses the aligned six-digit 241511 employment and demographic profile but leaves salary null because JSA does not publish six-digit earnings. Broader ANZSCO 2415 vacancy intensity and the near-flat +0.59% vacancy movement are not scored as exact Special Education Teacher demand. Broader projections of about +5.87% to 2030 and +12.64% to 2035 receive partial growth credit. National shortage and current AITSL migration evidence receive full credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
