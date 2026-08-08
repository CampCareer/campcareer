import type { OccupationEditorial } from "./occupation-editorial-base"

export const ENGINEERING_OCCUPATION_EDITORIAL = [
  {
    id: "civil-engineer",
    overview:
      "Civil Engineers plan, design, organise and oversee the construction and operation of major infrastructure such as roads, bridges, pipelines, airports and other built-environment systems. Australia's current OSCA classification separates Civil Engineer from Rail Engineer and Water Engineer, making the current occupation narrower than the legacy migration code used for some labour-market series.",
    tasks: [
      "Assess sites, surveys and project constraints to determine the feasibility and engineering requirements of infrastructure projects",
      "Perform engineering calculations and prepare designs, specifications, drawings and technical solutions for civil works",
      "Select construction methods, materials and quality standards that meet engineering, safety and performance requirements",
      "Evaluate environmental, planning and regulatory implications and incorporate compliance requirements into project designs",
      "Coordinate with construction teams, architects, surveyors, government agencies and other engineering disciplines throughout delivery",
      "Inspect, monitor and review construction and infrastructure performance to identify defects, risks and required remedial work",
    ],
    countries: {
      AU: {
        headline: "A nationally shortage-rated, CSOL-listed professional engineering occupation with strong direct study pathways and broad infrastructure demand",
        entryPathway:
          "OSCA assigns Civil Engineer Skill Level 1. The most direct Australian pathway is a four-year professional engineering degree with a Civil Engineering major or an equivalent accredited qualification, followed by graduate engineering or infrastructure project experience. Professional placements, design projects and practical exposure to structures, geotechnical engineering, transport, construction and project delivery are especially valuable. Postgraduate professional Civil Engineering degrees are also available for suitable graduates.",
        registration:
          "There is no single national engineering licence that applies identically to every Civil Engineer role across Australia. However, ABS notes that registration or licensing may be required, and professional-engineer registration requirements vary by state, territory and the type of engineering service performed. For migration, legacy ANZSCO 233211 Civil Engineer is on the current Core Skills Occupation List and Engineers Australia is the relevant assessing authority. A migration skills assessment is separate from domestic professional registration.",
        jobMarketNote:
          "The exact current occupation is OSCA 243231 Civil Engineer. The 2025 Occupation Shortage List records it as Shortage nationally and in every state and territory. Legacy ANZSCO 233211 remains the migration occupation, but that legacy code also corresponds to the newly separate OSCA Water Engineer occupation, so CampCareer does not treat legacy 233211 employment as an exact current Civil Engineer figure. Broader ANZSCO 2332 vacancy and projection data are shown only as context.",
        scoreCaveat:
          "The opportunity score gives full credit to the verified current shortage signal and current CSOL inclusion. Exact current OSCA employment and salary are not inferred from legacy 233211 or broader 2332, so salary and vacancy-intensity components remain zero. Broader 2332 vacancies rose about 3.94% year on year to May 2026 and long-run employment projections are positive, so trend and growth receive partial credit. Entry-level access scores strongly because clear professional degree and graduate-engineer pathways exist, while possible state registration requirements add some entry burden.",
      },
    },
  },
  {
    id: "mechanical-engineer",
    overview:
      "Mechanical Engineers plan, design, develop, test and oversee the manufacture, operation, maintenance and installation of mechanical systems, plant, machines and components. Australia's current OSCA definition includes specialisations such as building services, HVAC and hydraulic mechanical engineering and distinguishes the role from mechanical engineering technicians and draftspersons.",
    tasks: [
      "Design mechanical equipment, machines, tools, components and plant systems for industrial, infrastructure, energy and manufacturing applications",
      "Analyse mechanics, thermodynamics, fluid flow, materials and system performance to develop and validate engineering solutions",
      "Prepare engineering specifications, calculations, drawings, models and technical documentation for mechanical systems and equipment",
      "Oversee fabrication, assembly, installation, commissioning, testing and maintenance of mechanical and process plant",
      "Investigate equipment failures, reliability issues and maintenance problems and recommend corrective or design improvements",
      "Coordinate with manufacturing, operations, electrical, civil, controls and project teams to deliver safe and compliant engineering systems",
    ],
    countries: {
      AU: {
        headline: "A CSOL-listed professional engineering occupation with direct accredited study routes, positive broader demand growth and regional shortages despite a 2025 national No Shortage result",
        entryPathway:
          "OSCA assigns Mechanical Engineer Skill Level 1. The most direct Australian route is a four-year professional engineering degree in Mechanical Engineering or an equivalent Engineers Australia-accredited qualification. Graduate engineering programs, industry placements and capstone projects provide common entry routes, while postgraduate professional Mechanical Engineering programs are available for suitable engineering graduates. Employers value practical capability in mechanics, thermofluids, CAD, design, manufacturing, maintenance and multidisciplinary project work.",
        registration:
          "ABS notes that registration or licensing may be required for Mechanical Engineers. Australia does not use one identical national licence for every role; professional-engineer registration depends on the state or territory and the engineering services being performed. For migration, ANZSCO 233512 Mechanical Engineer is on the current Core Skills Occupation List and Engineers Australia is the assessing authority. Migration skills assessment and domestic professional registration are separate processes.",
        jobMarketNote:
          "The exact current occupation is OSCA 243532 Mechanical Engineer and the directly aligned legacy migration occupation is ANZSCO 233512. JSA provides a six-digit employment profile showing about 22,900 workers, but its earnings, vacancy and projection series are still published at the broader ANZSCO 2335 Industrial, Mechanical and Production Engineers level. The 2025 Occupation Shortage List records Mechanical Engineer as No Shortage nationally, with shortage signals in the Northern Territory, South Australia and Western Australia.",
        scoreCaveat:
          "The opportunity score keeps the 2025 national shortage component at zero even though NT, South Australia and Western Australia show regional shortages. Exact employment can be retained because 233512 remains directly aligned, but exact earnings are unavailable, so salary scores zero. Broader 2335 vacancies rose about 7.00% year on year to May 2026 and long-run projections are positive, so vacancy trend and growth receive partial credit. Strong professional study and graduate pathways support entry-level credit, while possible state registration requirements add some entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
