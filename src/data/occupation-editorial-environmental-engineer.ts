import type { OccupationEditorial } from "./occupation-editorial-base"

export const ENVIRONMENTAL_ENGINEER_OCCUPATION_EDITORIAL = [
  {
    id: "environmental-engineer",
    overview:
      "Environmental Engineers assess and reduce the environmental impacts of engineering projects and design systems for pollution control, waste treatment, water and wastewater management, remediation and long-term environmental sustainability. Australia's current OSCA 243935 Environmental Engineer occupation explicitly covers air, water, soil and noise impacts, environmental management plans, waste-treatment systems, sustainable infrastructure and renewable-energy planning.",
    tasks: [
      "Assess the potential effects of engineering projects on air, water, soil, noise and surrounding communities",
      "Design treatment, control and remediation systems for wastewater, solid waste, contaminated land, emissions and other environmental impacts",
      "Prepare and coordinate environmental management plans, monitoring programs and engineering controls for projects and operating facilities",
      "Analyse environmental data, modelling results, regulatory requirements and technical risks to recommend sustainable engineering solutions",
      "Liaise with regulators, planners, scientists, contractors and engineering teams to ensure projects meet environmental requirements and objectives",
      "Contribute to sustainable infrastructure, renewable-energy, circular-economy and resource-recovery projects across consulting, utilities, government and industry",
    ],
    countries: {
      AU: {
        headline: "A nationally shortage-rated, CSOL-listed professional engineering occupation with strong accredited study pathways and positive broader demand growth",
        entryPathway:
          "OSCA assigns Environmental Engineer Skill Level 1. A direct Australian route is a four-year Engineers Australia-accredited Environmental Engineering honours degree, such as RMIT University's Bachelor of Engineering (Environmental Engineering) (Honours). Suitable graduates can also enter through postgraduate professional study such as RMIT's two-year Master of Engineering (Environmental Engineering), which is accredited by Engineers Australia. Water and wastewater treatment, pollution control, contaminated-land remediation, environmental modelling, GIS, sustainability, risk and industry project experience are especially useful for graduate entry.",
        registration:
          "ABS notes that registration or licensing may be required for Environmental Engineers. Professional-engineer registration requirements vary by state, territory and the engineering services performed. For migration, legacy ANZSCO 233915 Environmental Engineer is on the current Core Skills Occupation List and Engineers Australia is the relevant assessing authority. Migration skills assessment is separate from domestic professional registration.",
        jobMarketNote:
          "The exact current occupation is OSCA 243935 Environmental Engineer and the directly aligned legacy migration occupation is ANZSCO 233915. JSA's six-digit profile reports about 1,600 Environmental Engineers, with 18% working part time, 36% female share, a median age of 36 and average full-time hours of 42 per week. Six-digit earnings are not published, while earnings, vacancy and projection series are available only at the broader ANZSCO 2339 Other Engineering Professionals level. The reviewed 2025 Occupation Shortage List records Environmental Engineer as Shortage nationally and in all eight states and territories.",
        scoreCaveat:
          "The opportunity score gives full credit to the verified 2025 national shortage signal and current CSOL inclusion. Exact six-digit employment and demographics are retained because ANZSCO 233915 is directly aligned with current OSCA 243935, but exact earnings remain unavailable and broader ANZSCO 2339 vacancy counts cannot support an occupation-specific vacancy-intensity score. Broader vacancies rose about 11.23% year on year to May 2026 and employment projections are about +12.41% to 2030 and +22.96% to 2035, so trend and growth receive partial credit. Accredited professional study routes support strong entry-level credit, while possible state registration requirements add entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
