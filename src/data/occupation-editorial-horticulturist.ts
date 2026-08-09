import type { OccupationEditorial } from "./occupation-editorial-base"

export const HORTICULTURIST_OCCUPATION_EDITORIAL = [
  {
    id: "horticulturist",
    overview:
      "Horticulturists propagate, establish and maintain plants, manage plant nutrition, irrigation, pests and disease, and may work in nurseries, gardens or horticultural production. Australia does not currently use one generic six-digit OSCA Horticulturist occupation: relevant work is split across roles including 342931 Nurseryperson and 343134 Horticultural Supervisor or Specialist, with production growers classified separately.",
    tasks: [
      "Propagate, establish and maintain plants and horticultural crops",
      "Monitor plant health, nutrition, irrigation, pests and disease",
      "Apply pruning, cultivation and plant-maintenance techniques",
      "Operate and maintain horticultural tools, machinery and irrigation systems",
      "Plan or supervise horticultural work routines and production activities",
      "Apply safe chemical-use, weed-control and plant-protection practices where required",
    ],
    countries: {
      AU: {
        headline:
          "A broad horticulture career spanning several current OSCA roles, with Nurseryperson providing a representative current skilled-migration path rather than a universal Horticulturist code",
        entryPathway:
          "TAFE SA's Certificate III in Horticulture, CRICOS 117361C, is a one-year vocational route that explicitly lists Horticulturist and Gardener as possible job outcomes. ECU's Master of Horticultural Science, CRICOS 108845B, is a two-year postgraduate route covering production, postharvest science, supply chains and a substantial industry placement or project.",
        registration:
          "There is no universal occupational registration for Horticulturists, although licensing can apply to particular chemical-use or specialist activities. The current skilled occupation instrument includes Nurseryperson 362411 with TRA, but that pathway applies to nursery-focused work rather than every role called Horticulturist.",
        jobMarketNote:
          "Because generic Horticulturist spans multiple current classifications, CampCareer does not aggregate employment or earnings into a fabricated exact national total. Broader ANZSCO 3624 nursery-related labour, vacancy and projection data are contextual only. Both current Nurseryperson and Horticultural Supervisor or Specialist record 2025 national No Shortage results.",
        scoreCaveat:
          "The score gives partial migration credit only for the Nurseryperson pathway and no exact salary, shortage or vacancy-intensity credit. Broader 3624 vacancies declined sharply year on year, while long-run employment projections remain modestly positive.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
