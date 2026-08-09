import type { OccupationEditorial } from "./occupation-editorial-base"

export const TRUCK_DRIVER_OCCUPATION_EDITORIAL = [
  {
    id: "truck-driver",
    overview:
      "Truck drivers transport freight by road, inspect vehicles and loads, complete transport documentation and operate within fatigue, road-safety and load-restraint rules. Australia's current OSCA separates Truck Driver (General), Articulated Truck Driver and Tanker Truck Driver, so CampCareer keeps Truck Driver as an umbrella rather than inventing one six-digit current code.",
    tasks: [
      "Drive heavy vehicles safely across local, regional and interstate routes",
      "Inspect vehicles, trailers, loads and safety equipment before and during trips",
      "Secure freight and comply with mass, dimension and load-restraint requirements",
      "Plan routes and manage fatigue, rest breaks and delivery schedules",
      "Complete manifests, logs, delivery records and incident documentation",
      "Coordinate with dispatchers, depots, customers and loading teams",
    ],
    countries: {
      AU: {
        headline:
          "A current OSCA truck-driving umbrella with strong shortage signals but no current Core Skills Occupation List pathway",
        entryPathway:
          "Truck driving is primarily a licence-and-workplace pathway rather than a university route. Drivers progress through state or territory heavy-vehicle licence classes and may complete competency-based heavy-vehicle assessment or employer/RTO training for the vehicle class they operate.",
        registration:
          "A suitable state or territory heavy-vehicle driver licence is required. Licence class and progression rules vary by jurisdiction; for example NSW requires the appropriate LR, MR, HR, HC or MC class and staged prior-licence experience for higher classes.",
        jobMarketNote:
          "The legacy ANZSCO 733111 profile reports 148,400 workers, 16% part-time share, 4% female share, median age 48 and 50 average full-time hours. The 2025 OSL rates current OSCA 713131 Truck Driver (General) and 713231 Articulated Truck Driver as Shortage nationally, while 713232 Tanker Truck Driver is No Shortage. Reviewed exact earnings are unavailable.",
        scoreCaveat:
          "The mixed current shortage result receives partial rather than full shortage credit. Broader ANZSCO 7331 vacancy data are contextual, current CSOL coverage is absent, and exact salary remains unscored.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
