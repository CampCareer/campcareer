import type { OccupationEditorial } from "./occupation-editorial-base"

export const AUTOMOTIVE_SERVICE_TECHNICIAN_OCCUPATION_EDITORIAL = [
  {
    id: "automotive-service-technician",
    overview:
      "Automotive service technicians inspect, service, diagnose and repair light motor vehicles and their mechanical, electrical and electronic systems. Australia classifies the general light-vehicle scope directly as OSCA 351131 Automotive Technician (General), with Light Vehicle Mechanic and Motor Mechanic (General) recognised alternative titles.",
    tasks: [
      "Inspect vehicles and diagnose mechanical, electrical and electronic faults",
      "Service engines, transmissions, brakes, steering and suspension systems",
      "Use diagnostic equipment and manufacturer technical information",
      "Repair or replace worn and faulty components",
      "Test vehicles after repair and document completed work",
      "Communicate repair findings, estimates and maintenance requirements",
    ],
    countries: {
      AU: {
        headline: "An exact current Automotive Technician occupation with national shortage and a current TRA/CSOL pathway",
        entryPathway:
          "TAFE SA's Certificate III in Light Vehicle Mechanical Technology, CRICOS 103612D, is the direct trade route in the current catalogue. Its Diploma of Automotive Technology, CRICOS 091697G, is an advanced related route for diagnostics and higher-level automotive technology.",
        registration:
          "There is no single national occupational registration scheme for automotive technicians. Trade licensing or repairer requirements can vary by state and work type; Trades Recognition Australia assesses the migration occupation.",
        jobMarketNote:
          "The exact legacy ANZSCO 321211 Motor Mechanic (General) profile reports 79,300 workers, 15% part-time share, 2% female share, median age 36 and 43 average full-time hours. Reviewed exact earnings are unavailable. The 2025 OSL rates OSCA 351131 Automotive Technician (General) as Shortage nationally.",
        scoreCaveat:
          "Full shortage and migration credit apply, while exact salary remains null. Broader ANZSCO 3212 vacancy and projection data are contextual and do not earn vacancy intensity or trend points.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
