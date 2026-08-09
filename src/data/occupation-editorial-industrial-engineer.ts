import type { OccupationEditorial } from "./occupation-editorial-base"

export const INDUSTRIAL_ENGINEER_OCCUPATION_EDITORIAL = [
  {
    id: "industrial-engineer",
    overview:
      "Industrial Engineers improve how people, equipment, materials, information and operating processes work together across manufacturing, logistics, resources and other complex operations. Australia's current OSCA 243531 Industrial Engineer occupation covers production sequencing, resource use, process optimisation, quality, cost, risk and industrial safety, with Manufacturing Engineer, Process Engineer and Systems Engineer among its official specialisations.",
    tasks: [
      "Analyse workforce, equipment, material and facility utilisation to identify bottlenecks, duplication and avoidable operating cost",
      "Plan and optimise production sequences, process flows, layouts and resource allocation to improve operational efficiency",
      "Model and evaluate process changes using operational data, cost estimates, risk analysis and performance measures",
      "Design and improve quality-control, continuous-improvement and reliability systems for industrial and commercial operations",
      "Develop systems and processes that improve safety, productivity, throughput and the effective use of people and equipment",
      "Coordinate with manufacturing, logistics, supply-chain, engineering, operations and management teams to implement measurable process improvements",
    ],
    countries: {
      AU: {
        headline: "A CSOL-listed professional engineering occupation with a direct Industrial and Systems Engineering degree route, exact six-digit employment context and regional shortage signals",
        entryPathway:
          "OSCA assigns Industrial Engineer Skill Level 1. A direct Australian undergraduate route is Curtin University's four-year Bachelor of Engineering (Honours) with the Industrial and Systems Engineering major, which covers engineering design, manufacturing, quality, systems engineering, operations research, modelling, simulation and optimisation. Curtin also offers a two-year Master of Science (Industrial Engineering) for suitable graduates. More broadly, Engineers Australia-accredited professional engineering qualifications plus practical experience in operations, manufacturing, supply chains, quality, lean methods, simulation and process improvement provide strong entry foundations.",
        registration:
          "ABS notes that registration or licensing may be required for Industrial Engineers. Professional-engineer registration requirements vary by state, territory and the engineering services performed. For migration, legacy ANZSCO 233511 Industrial Engineer is on the current Core Skills Occupation List and Engineers Australia is the relevant assessing authority. Migration skills assessment is separate from domestic professional registration.",
        jobMarketNote:
          "The exact current occupation is OSCA 243531 Industrial Engineer and the directly aligned legacy migration occupation is ANZSCO 233511. JSA's six-digit occupation profile reports about 4,700 Industrial Engineers, with 11% working part time, 18% female share, a median age of 39 and average full-time hours of 42 per week. Six-digit earnings are not published, while vacancy and projection data remain at the broader ANZSCO 2335 Industrial, Mechanical and Production Engineers level. The reviewed 2025 Occupation Shortage List records Industrial Engineer as No Shortage nationally, with shortage signals in the ACT, Northern Territory, Queensland and South Australia.",
        scoreCaveat:
          "The opportunity score keeps the 2025 national shortage component at zero despite regional shortage signals. Exact six-digit employment and demographics are retained because ANZSCO 233511 is directly aligned with current OSCA 243531, but exact earnings remain unavailable and broader ANZSCO 2335 vacancy counts cannot support an occupation-specific vacancy-intensity score. Broader vacancies rose about 7.00% year on year to May 2026 and long-run projections are positive, so trend and growth receive partial credit. Direct Industrial and Systems Engineering study pathways and verified CSOL inclusion support entry and visa components, while possible state registration requirements add entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
