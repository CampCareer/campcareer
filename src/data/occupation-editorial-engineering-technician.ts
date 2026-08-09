import type { OccupationEditorial } from "./occupation-editorial-base"

export const ENGINEERING_TECHNICIAN_OCCUPATION_EDITORIAL = [
  {
    id: "engineering-technician",
    overview:
      "Engineering Technician is treated as an Australian umbrella career rather than a single six-digit OSCA occupation. Current OSCA places engineering technicians in Minor Group 313 and separates the work into discipline-specific occupations such as Civil, Electrical, Electronic and Mechanical Engineering Technician, plus Engineering Technicians nec. These roles provide technical support to Engineering Professionals and Engineering Technologists through testing, installation, inspection, maintenance, data collection, drawings, estimates and practical implementation work.",
    tasks: [
      "Assist engineers and engineering technologists with testing, implementation, installation and maintenance of engineering systems and equipment",
      "Collect field, laboratory or equipment data and prepare calculations, charts, tabulations, sketches, drawings or technical records",
      "Conduct inspections, measurements and performance tests to check compliance with specifications, standards and safety requirements",
      "Install, commission, calibrate, troubleshoot, maintain or repair engineering equipment and technical systems within the relevant discipline",
      "Assist with material quantities, cost estimates, quality checks and project documentation for engineering and construction work",
      "Work with engineers, tradespeople, contractors and operations teams to implement technical changes and resolve practical engineering problems",
    ],
    countries: {
      AU: {
        headline: "A broad Skill Level 2 engineering-support pathway with several nationally shortage-rated specialisations, current CSOL coverage and direct two-year Engineering Associate study routes",
        entryPathway:
          "Australia's OSCA Minor Group 313 Engineering Technicians is Skill Level 2, corresponding to an AQF Associate Degree, Advanced Diploma or Diploma, or at least three years of relevant experience. A direct broad study route is Swinburne University's two-year Associate Degree of Engineering, which offers Civil, Electrical, Mechanical and Mechatronics majors, is accredited by Engineers Australia and prepares graduates for associate or assistant engineering work. RMIT's two-year Advanced Diploma of Engineering Technology (Civil Engineering Design) is another direct Engineering Associate pathway for civil engineering technician work and is accredited by Engineers Australia under the Dublin Accord.",
        registration:
          "There is no single national registration rule that applies identically to every Engineering Technician role. ABS notes that registration or licensing may be required for several technician occupations, particularly where regulated electrical, civil or other technical work is involved. Migration assessment also varies by nominated ANZSCO occupation: current CSOL entries include Civil Engineering Technician through VETASSESS, Electrical, Electronic and Mechanical Engineering Technician through TRA, and Building and Engineering Technicians nec through Engineers Australia and VETASSESS. Individual eligibility depends on the exact nominated occupation and duties.",
        jobMarketNote:
          "CampCareer models Engineering Technician as an umbrella across current OSCA 313132 Civil Engineering Technician, 313232 Electrical Engineering Technician, 313932 Electronic Engineering Technician, 313934 Mechanical Engineering Technician and 313999 Engineering Technicians nec. The first four have directly aligned legacy six-digit JSA profiles totalling about 15,100 workers; their weighted profile is roughly 14% part time, 8% female, median age 42 and average full-time hours 44 per week. Legacy ANZSCO 312999 is not included in the employment total because it now corresponds to multiple current OSCA occupations, including Architectural Technician and Biomedical Technician as well as Engineering Technicians nec. The reviewed 2025 OSL records the four directly aligned discipline technician occupations as national shortage occupations, while Engineering Technicians nec does not have the same exact national shortage signal in the current snapshot.",
        scoreCaveat:
          "Because this canonical career intentionally aggregates several current occupations, the opportunity score is conservative. The shortage component receives partial rather than full credit: four directly aligned discipline technician occupations are nationally shortage-rated, but the umbrella also includes Engineering Technicians nec without the same exact signal. Exact six-digit employment is summed only for the four one-to-one legacy mappings. Earnings are not combined across occupations, and broader ANZSCO 3122/3123/3124/3125/3129 vacancies cannot support an occupation-specific vacancy-intensity score. Those broader vacancy groups increased about 6.51% year on year to May 2026, while their aggregate employment projections are about +5.90% to 2030 and +11.72% to 2035, so trend and growth receive partial credit. Two-year accredited Engineering Associate pathways support strong entry-level access and the tracked specialisations all retain current CSOL pathways.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
