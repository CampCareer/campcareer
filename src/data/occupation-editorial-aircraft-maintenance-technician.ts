import type { OccupationEditorial } from "./occupation-editorial-base"

export const AIRCRAFT_MAINTENANCE_TECHNICIAN_OCCUPATION_EDITORIAL = [
  {
    id: "aircraft-maintenance-technician",
    overview:
      "Aircraft maintenance technicians inspect, troubleshoot, repair and maintain aircraft systems and structures. Australia splits the current occupation into OSCA 332131 Avionics, 332132 Mechanical and 332133 Structures, so CampCareer preserves all three technician streams under the canonical umbrella.",
    tasks: [
      "Inspect aircraft systems, components and structures for defects and wear",
      "Diagnose faults using maintenance manuals, test equipment and technical data",
      "Repair, replace and adjust mechanical, avionic or structural components",
      "Complete scheduled and unscheduled maintenance tasks",
      "Record maintenance work and comply with airworthiness procedures",
      "Coordinate with engineers, licensed certifying staff and operations teams",
    ],
    countries: {
      AU: {
        headline: "A three-stream current OSCA occupation with national shortage signals and current TRA/CSOL migration coverage",
        entryPathway:
          "Australia has national Aeroskills vocational qualifications for avionics, mechanical and structures maintenance. CASA Part 147 training is relevant to Part 66 licensing pathways, but a Part 66 licence is specifically required for certifying licence privileges rather than every technician role.",
        registration:
          "A CASA Part 66 Aircraft Engineer Licence is required for licensed certifying maintenance privileges, but not every technician position is itself a licensed certifying role. Skills assessment for the legacy Aircraft Maintenance Engineer occupations is through Trades Recognition Australia.",
        jobMarketNote:
          "The three exact legacy streams contain about 4,350 workers in total: 2,300 avionics, 1,800 mechanical and 250 structures. Exact combined demographics and reviewed earnings are not fabricated. All three current OSCA technician streams are rated Shortage nationally in the 2025 OSL.",
        scoreCaveat:
          "The three exact current streams receive full shortage and migration credit. Broader ANZSCO 3231 vacancy/projection data remain contextual, and salary remains unscored.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
