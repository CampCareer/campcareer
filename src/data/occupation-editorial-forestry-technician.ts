import type { OccupationEditorial } from "./occupation-editorial-base"

export const FORESTRY_TECHNICIAN_OCCUPATION_EDITORIAL = [
  {
    id: "forestry-technician",
    overview:
      "Forestry Technicians provide technical field and laboratory support for forest, ecology and environmental work, including surveys, specimen and data collection, site monitoring and operational reporting. Current OSCA no longer names Forestry Technician as a standalone occupation; the closest current occupation is Skill Level 2 Life Science Technician 311535, while ANZSCO 311413 explicitly recognises Forestry Technician and Forestry Technical Officer within its scope.",
    tasks: [
      "Collect and identify plant, ecological and other biological field samples",
      "Assist with forest, vegetation, habitat and site-condition surveys",
      "Maintain field records, maps, specimens and monitoring datasets",
      "Support environmental and life scientists with field and laboratory studies",
      "Assist with conservation, rehabilitation and land-management monitoring",
      "Prepare technical observations and reports for forestry and environmental teams",
    ],
    countries: {
      AU: {
        headline:
          "A forestry-specific technician career nested within the broader current Life Science Technician occupation, with a VETASSESS assessment route but no current CSOL entry",
        entryPathway:
          "Diploma-level technical study is consistent with the current Skill Level 2 classification. RMIT's two-year Diploma of Conservation and Ecosystem Management, CRICOS 104848J, is the closest forestry and land-management route; its one-year Diploma of Laboratory Technology, CRICOS 112044A, is a broader technical science route relevant to laboratory-based support work.",
        registration:
          "There is no universal statutory occupational registration for Forestry Technicians. VETASSESS assesses ANZSCO 311413 Life Science Technician as Group C and explicitly accepts Forestry Technician and Forestry Technical Officer; qualification and highly relevant employment requirements apply.",
        jobMarketNote:
          "Current OSCA 311535 Life Science Technician is broader than Forestry Technician and includes technical support across biology, agriculture and environmental science. The legacy 311413 profile reports 2,500 workers but also covers multiple non-forestry technical occupations, so CampCareer leaves Forestry Technician's exact employment and earnings null. Broader ANZSCO 3114 demand data are context only.",
        scoreCaveat:
          "The 2025 OSL records current OSCA 311535 as No Shortage nationally. Broader 3114 vacancies rose about 7.45% year on year and projections are modestly positive, but they are not forestry-specific. The current CSOL includes Chemistry Technician 311411, Earth Science Technician 311412 and Science Technicians nec 311499, but not Life Science Technician 311413, so no visa-list credit is awarded.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
