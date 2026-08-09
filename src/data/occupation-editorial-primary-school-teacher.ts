import type { OccupationEditorial } from "./occupation-editorial-base"

export const PRIMARY_SCHOOL_TEACHER_OCCUPATION_EDITORIAL = [
  {
    id: "primary-school-teacher",
    overview:
      "Primary School Teachers teach a broad curriculum to primary-aged students, plan differentiated learning, assess progress, manage classrooms and work with families and school communities. Australia's current OSCA classifies this work exactly as 251231 Primary School Teacher, a Skill Level 1 occupation that excludes Special Education Teachers.",
    tasks: [
      "Plan and deliver differentiated lessons across literacy, numeracy, science, humanities, arts, technology and physical education",
      "Create a safe, supportive classroom and use effective classroom-management practices",
      "Prepare and review assessments, maintain learning records and report on student progress",
      "Adapt curriculum and teaching strategies for diverse learning needs",
      "Communicate with students, parents, colleagues and support professionals about learning and wellbeing",
      "Contribute to curriculum development, school activities, professional learning and extracurricular programs",
    ],
    countries: {
      AU: {
        headline:
          "An exact OSCA Skill Level 1 teaching occupation in 2025 national shortage, with AITSL migration assessment and mandatory jurisdictional teacher registration",
        entryPathway:
          "The standard route is an accredited initial teacher education qualification. Deakin University's Bachelor of Education (Primary), CRICOS 118365B, is an AQF Level 7 VIT-accredited undergraduate route, while RMIT University's Master of Teaching Practice (Primary Education), CRICOS 113707C, is a two-year graduate-entry program accredited by the Victorian Institute of Teaching. Accredited Australian initial teacher education programs fulfil the teacher-education qualification component for school-teacher registration nationally, subject to each jurisdiction's other requirements.",
        registration:
          "Registration is required to teach in Australian schools and is administered by state and territory teacher regulatory authorities. AITSL is the migration skills assessing authority for ANZSCO 241213 Primary School Teacher, but migration assessment is separate from teacher registration. Applicants must meet the registration authority's qualification, English-language, suitability and other requirements in the jurisdiction where they intend to teach.",
        jobMarketNote:
          "The reviewed 2025 Occupation Shortage List rates current OSCA 251231 Primary School Teacher as a national shortage occupation. JSA labour-market observations available in CampCareer are broader legacy ANZSCO 2412 data: about 165,900 workers and median full-time earnings of A$2,226 per week. These are kept as context rather than exact six-digit metrics. Broader vacancies fell from 518 in May 2025 to 476 in May 2026.",
        scoreCaveat:
          "The opportunity score gives full shortage and migration credit but keeps broader ANZSCO 2412 employment, earnings and vacancy intensity outside exact Primary School Teacher scoring. Broader vacancies declined about 8.11% year on year, so trend receives no credit. Broader projections of about +5.46% to 2030 and +11.71% to 2035 receive partial growth credit. Mandatory teacher registration reduces the entry-burden bonus.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
