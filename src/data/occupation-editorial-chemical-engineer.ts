import type { OccupationEditorial } from "./occupation-editorial-base"

export const CHEMICAL_ENGINEER_OCCUPATION_EDITORIAL = [
  {
    id: "chemical-engineer",
    overview:
      "Chemical Engineers design, develop and improve chemical process systems, equipment and large-scale production methods that transform raw materials through physical, chemical and biological processes. Australia's current OSCA 243131 Chemical Engineer occupation covers process design, plant specifications, process optimisation, safety, environmental controls, troubleshooting and technical support, with Process Control Engineer and Process Engineer (Chemical) listed as specialisations.",
    tasks: [
      "Research, design, develop and improve chemical processes, process systems, reactions and materials for commercial-scale production",
      "Prepare process designs, equipment specifications, control strategies and operating requirements for chemical plants and industrial facilities",
      "Monitor plant and process performance and use operating data to improve efficiency, product quality, reliability and energy use",
      "Develop safety procedures, environmental controls and methods for handling by-products, waste, solids, liquids and gases",
      "Diagnose process and equipment problems and recommend technical, operational or design changes to restore safe performance",
      "Collaborate with plant, mechanical, electrical, controls, production and project teams to commission and improve industrial process systems",
    ],
    countries: {
      AU: {
        headline: "A CSOL-listed professional engineering occupation with exact six-digit employment data and accredited study pathways, but a 2025 national No Shortage result and weaker broader vacancy trend",
        entryPathway:
          "OSCA assigns Chemical Engineer Skill Level 1. A direct Australian route is a four-year Engineers Australia-accredited Chemical Engineering honours degree, such as RMIT University's Bachelor of Engineering (Chemical Engineering) (Honours). The degree combines engineering science, process design and industrial practice and is also recognised by IChemE for specified intakes. Suitable engineering graduates can continue through professional postgraduate study such as the University of Queensland's two-year Master of Chemical Engineering (Professional), which is accredited by Engineers Australia. Industry placements, process simulation, thermodynamics, transport phenomena, process control, safety and plant-design experience strengthen graduate entry.",
        registration:
          "ABS notes that registration or licensing may be required for Chemical Engineers. Professional-engineer registration requirements vary by state, territory and the engineering services performed. For migration, legacy ANZSCO 233111 Chemical Engineer is on the current Core Skills Occupation List and Engineers Australia is the relevant assessing authority. Migration skills assessment is separate from domestic professional registration.",
        jobMarketNote:
          "The exact current occupation is OSCA 243131 Chemical Engineer and the directly aligned legacy migration occupation is ANZSCO 233111. JSA's six-digit profile reports about 3,100 Chemical Engineers, with 13% working part time, 23% female share, a median age of 38 and average full-time hours of 43 per week. Six-digit earnings are not published, while earnings, vacancy and projection series are available at the broader ANZSCO 2331 Chemical and Materials Engineers level. The reviewed 2025 Occupation Shortage List records Chemical Engineer as No Shortage nationally, with shortage signals in the Northern Territory and Queensland.",
        scoreCaveat:
          "The opportunity score keeps the 2025 national shortage component at zero despite NT and Queensland shortage signals. Exact six-digit employment and demographics are retained because ANZSCO 233111 is directly aligned with current OSCA 243131, but exact earnings remain unavailable and broader ANZSCO 2331 vacancy counts cannot support an occupation-specific vacancy-intensity score. Broader vacancies fell about 24.16% year on year to May 2026, so vacancy trend receives no credit, while broader employment projections of about +13.15% to 2030 and +23.18% to 2035 receive partial growth credit. Accredited professional study routes and verified CSOL inclusion support entry and visa components, while possible state registration requirements add entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
