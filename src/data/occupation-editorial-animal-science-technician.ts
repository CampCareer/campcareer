import type { OccupationEditorial } from "./occupation-editorial-base"

export const ANIMAL_SCIENCE_TECHNICIAN_OCCUPATION_EDITORIAL = [
  {
    id: "animal-science-technician",
    overview:
      "Animal science technicians support applied animal production and research through livestock breeding, nutrition, health and welfare monitoring, technical procedures and data collection. Australia does not use the exact title Animal Science Technician; current OSCA 311132 Animal Husbandry Technician is the closest non-clinical technical occupation. Veterinary Technologist 269532 is kept separate because it is centred on diagnostic and clinical animal care.",
    tasks: [
      "Assist with breeding, raising and managing livestock",
      "Monitor livestock nutrition, feeding programs, health and welfare",
      "Support controlled breeding experiments and collect research data",
      "Conduct technical husbandry procedures such as pregnancy testing or artificial insemination where qualified",
      "Provide technical advice on breeding selection, nutrition and animal management",
      "Maintain accurate records for animal husbandry, research and production programs",
    ],
    countries: {
      AU: {
        headline:
          "A conservative related mapping to current OSCA 311132 Animal Husbandry Technician, with a current VETASSESS skilled-migration path but no standalone Animal Science Technician occupation",
        entryPathway:
          "Charles Sturt's Bachelor of Animal Science, CRICOS 068972G, is a four-year animal-science route with access to farm, laboratory and animal-research facilities. UQ's Bachelor of Veterinary Technology, CRICOS 087886D, is a three-year related route that includes animal husbandry placements, animal breeding, nutrition and technology alongside clinical training.",
        registration:
          "There is no universal national occupational registration for Animal Science Technicians, although licensing may apply to particular technical procedures. VETASSESS assesses ANZSCO 311113 Animal Husbandry Technician as Group C and requires an AQF Diploma or higher plus relevant employment evidence under the applicable pathway.",
        jobMarketNote:
          "The current ingest does not contain a six-digit 311113 labour profile, so exact employment and earnings remain null. Broader ANZSCO 3111 Agricultural Technicians data record 2,800 workers and median weekly earnings of A$1,808, but these figures are context only. The 2025 OSL records current OSCA 311132 Animal Husbandry Technician as No Shortage nationally.",
        scoreCaveat:
          "The current 311113 skilled-migration pathway receives partial rather than full credit because Animal Science Technician is a related canonical title rather than an exact Australian occupation. Broader 3111 vacancies declined about 14.29% year on year and broader growth is modest, so only partial growth credit is used.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
