import type { OccupationEditorial } from "./occupation-editorial-base"

export const HOSPITALITY_SUPERVISOR_OCCUPATION_EDITORIAL = [
  {
    id: "hospitality-supervisor",
    overview:
      "Hospitality supervisors coordinate frontline service teams and daily operations across bars, cafes, restaurants, accommodation, gaming and housekeeping. CampCareer maps this canonical career to current OSCA Unit Group 4715 Hospitality Supervisors rather than inventing a single six-digit occupation.",
    tasks: [
      "Allocate duties, shifts and service areas to frontline hospitality staff",
      "Monitor service standards, customer issues and operational workflow",
      "Train staff in procedures, safety and customer-service expectations",
      "Coordinate stock, supplies, room or venue readiness and handovers",
      "Support cash, booking, reception or service-control processes relevant to the venue",
      "Escalate maintenance, safety, security and staffing issues",
      "Maintain venue-specific compliance and operating records",
    ],
    countries: {
      AU: {
        headline:
          "A current OSCA 4715 Hospitality Supervisors umbrella covering five distinct supervisory occupations",
        entryPathway:
          "TAFE NSW Diploma of Hospitality Management, CRICOS 112061M, is a direct route into supervisory and management capability. UQ's Bachelor of Tourism, Hospitality and Event Management, CRICOS 103168H, provides a broader hospitality-management route.",
        registration:
          "There is no universal statutory registration for Hospitality Supervisors, although liquor, gaming and venue-specific credentials may apply. Current migration coverage is mixed: accommodation-related supervisor pathways can correspond to legacy ANZSCO 431411 Hotel Service Manager with VETASSESS, while the umbrella as a whole is not uniformly eligible.",
        jobMarketNote:
          "Because OSCA 4715 is an umbrella containing Bar Supervisor, Cafe or Restaurant Supervisor, Front Office Supervisor, Gaming Supervisor and Housekeeping Supervisor, CampCareer does not combine incompatible six-digit employment or vacancy series into a single primary metric. All five 2025 OSL occupations are No Shortage nationally. Relevant legacy unit-group projections are positive through 2030 and 2035, supporting only partial growth credit.",
        scoreCaveat:
          "Primary employment, salary, vacancy intensity and vacancy trend remain null or unscored to avoid manufacturing an aggregate. Migration credit is partial because only part of the umbrella has a current mapped pathway.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
