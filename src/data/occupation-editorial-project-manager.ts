import type { OccupationEditorial } from "./occupation-editorial-base"

export const PROJECT_MANAGER_OCCUPATION_EDITORIAL = [
  {
    id: "project-manager",
    overview:
      "Project Managers define outcomes, coordinate people and resources, manage schedules, budgets, risks and stakeholders, and guide projects from initiation through delivery and closure. Australia's current OSCA does not provide one cross-industry six-digit Project Manager occupation: it classifies sector-specific managers such as ICT Project Manager and Construction Project Manager separately, while 511231 Program or Project Administrator is the closest non-sector project-delivery occupation. CampCareer therefore treats 511231 as a related proxy, not an exact title match.",
    tasks: [
      "Define project scope, objectives, deliverables, milestones and success measures with sponsors and stakeholders",
      "Build and maintain project plans covering schedules, budgets, resources, dependencies and governance",
      "Coordinate multidisciplinary teams, vendors and stakeholders and clarify responsibilities and decision paths",
      "Identify, assess and manage delivery risks, issues, changes and constraints",
      "Track progress, costs and outcomes and communicate status, decisions and escalations to stakeholders",
      "Close projects, hand over deliverables, review outcomes and capture lessons for future delivery",
    ],
    countries: {
      AU: {
        headline:
          "A cross-industry career without one exact OSCA code; CampCareer uses Program or Project Administrator 511231 only as the closest non-sector proxy and keeps sector-specific project managers separate",
        entryPathway:
          "There is no single mandatory degree for a generic Project Manager. Bond University's Bachelor of Project Management, CRICOS 0101294, provides a direct undergraduate route across project planning, delivery and professional practice, while its Master of Project Management, CRICOS 078813G, provides a postgraduate pathway across strategy, change, leadership, risk and delivery. For migration under the proxy occupation, VETASSESS classifies legacy ANZSCO 511112 Program or Project Administrator as Group C and requires an AQF Diploma or higher plus relevant employment under the applicable pathway.",
        registration:
          "There is no universal statutory registration for cross-industry Project Managers. Voluntary professional credentials can support practice, but migration assessment is separate. The current 511112 Program or Project Administrator pathway is assessed by VETASSESS and should be used only where the applicant's duties genuinely fit that occupation rather than a general management or sector-specific project-manager code.",
        jobMarketNote:
          "The closest non-sector official occupation is OSCA 511231 Program or Project Administrator, corresponding to legacy ANZSCO 511112. JSA reports about 103,200 workers for 511112, but CampCareer does not present that as exact generic Project Manager employment because the canonical career is broader and more managerial. Broader ANZSCO 5111 has about 158,500 workers and median full-time earnings of A$2,130 per week, also retained only as context. The reviewed 2025 OSL records OSCA 511231 as No Shortage nationally.",
        scoreCaveat:
          "The opportunity score is deliberately conservative because the Australian mapping is related rather than exact. Employment, earnings and vacancy intensity are not scored as generic Project Manager observations. Broader ANZSCO 5111 vacancies were roughly flat year on year to May 2026 and broader projections are about +9.54% to 2030 and +17.33% to 2035, so only long-run growth receives partial credit. The 511112 VETASSESS/CSOL route receives partial visa credit because eligibility depends on duties matching Program or Project Administrator, not merely holding a Project Manager title.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
