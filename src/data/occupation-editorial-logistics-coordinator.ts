import type { OccupationEditorial } from "./occupation-editorial-base"

export const LOGISTICS_COORDINATOR_OCCUPATION_EDITORIAL = [
  {
    id: "logistics-coordinator",
    overview:
      "Logistics coordinators organise the movement, receipt and dispatch of goods, maintain shipment records and coordinate carriers, warehouses and customers. OSCA 571131 Logistics Officer explicitly lists Logistics Coordinator as an alternative title, allowing an exact current Australian mapping.",
    tasks: [
      "Coordinate inbound and outbound freight movements and delivery schedules",
      "Prepare shipping, dispatch and receiving documentation",
      "Track consignments and resolve delays, shortages or damaged freight",
      "Liaise with carriers, suppliers, warehouses and customers",
      "Maintain inventory movement and transport records",
      "Support compliance, service-level and cost-control reporting",
    ],
    countries: {
      AU: {
        headline: "An exact OSCA 571131 alternative-title match with a broad logistics labour market but no direct current CSOL pathway",
        entryPathway:
          "Logistics and supply-chain degrees or diplomas provide direct preparation, while many roles are also entered through operations experience. UTAS's Bachelor of Global Logistics and Maritime Management and RMIT's Master of Supply Chain and Logistics Management are current international-study routes in the catalogue.",
        registration: "There is no statutory occupational registration for Logistics Coordinators.",
        jobMarketNote:
          "The exact legacy ANZSCO 591211 Despatching and Receiving Clerk context reports 25,900 workers, 14% part-time share, 34% female share, median age 42 and 44 average full-time hours. The broader ANZSCO 5912 vacancy series rose about 13.36% year on year to May 2026, but is kept contextual. The 2025 OSL records OSCA 571131 as No Shortage nationally.",
        scoreCaveat:
          "No shortage, salary or visa credit is awarded. Broader vacancy data do not earn intensity or trend points; positive broader projections receive partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
