import type { OccupationEditorial } from "./occupation-editorial-base"

export const SECONDARY_SCHOOL_TEACHER_OCCUPATION_EDITORIAL = [
  {
    id: "secondary-school-teacher",
    overview:
      "Secondary School Teachers teach one or more subject areas to secondary-aged students, design differentiated learning, assess progress, manage classrooms and work with families and school communities. Australia's current OSCA classifies this work exactly as 251331 Secondary School Teacher, a Skill Level 1 occupation that excludes Special Education Teachers.",
    tasks: [
      "Plan and deliver subject-specific curriculum and differentiated learning for secondary students",
      "Prepare, administer and mark assessments and maintain records of student achievement",
      "Use classroom-management practices that support safe, positive and inclusive learning environments",
      "Adapt lessons and resources to student abilities, interests and learning needs",
      "Communicate progress and wellbeing issues with students, families, colleagues and support professionals",
      "Participate in curriculum development, professional learning, school activities and extracurricular programs",
    ],
    countries: {
      AU: {
        headline:
          "An exact OSCA Skill Level 1 teaching occupation in 2025 national shortage, with AITSL migration assessment and mandatory jurisdictional teacher registration",
        entryPathway:
          "The standard route is an accredited initial teacher education qualification with suitable teaching areas. The University of Notre Dame Australia's Bachelor of Secondary Education, CRICOS 116885E, is a four-year undergraduate route with substantial school placements. RMIT University's Master of Teaching Practice (Secondary Education), CRICOS 113706D, is a two-year graduate-entry route whose teaching areas depend on prior higher-education study. Both are professional teacher-education pathways subject to registration requirements.",
        registration:
          "Registration is required to teach in Australian schools and is administered by state and territory teacher regulatory authorities. AITSL is the migration skills assessing authority for ANZSCO 241411 Secondary School Teacher, but migration assessment is separate from teacher registration. Applicants must also meet the registration authority's qualification, English-language, suitability and subject-area requirements where applicable.",
        jobMarketNote:
          "The reviewed 2025 Occupation Shortage List rates current OSCA 251331 Secondary School Teacher as a national shortage occupation. JSA labour-market observations available in CampCareer are broader legacy ANZSCO 2414 data: about 161,400 workers and median full-time earnings of A$2,322 per week. These are context rather than exact six-digit metrics. Broader vacancies fell from 854 in May 2025 to about 762.33 in May 2026.",
        scoreCaveat:
          "The opportunity score gives full shortage and migration credit but keeps broader ANZSCO 2414 employment, earnings and vacancy intensity outside exact Secondary School Teacher scoring. Broader vacancies declined about 10.73% year on year, so trend receives no credit. Broader projections of about +5.45% to 2030 and +11.68% to 2035 receive partial growth credit. Mandatory teacher registration reduces the entry-burden bonus.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
