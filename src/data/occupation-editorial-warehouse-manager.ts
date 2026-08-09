import type { OccupationEditorial } from "./occupation-editorial-base"

export const WAREHOUSE_MANAGER_OCCUPATION_EDITORIAL = [
  {
    id: "warehouse-manager",
    overview:
      "Warehouse managers organise storage, receiving, dispatch, inventory and warehouse teams. Australia does not publish a single current OSCA principal occupation titled Warehouse Manager, so CampCareer models the canonical role conservatively between operational OSCA 721132 Warehouse Supervisor and higher-level OSCA 133331 Supply and Distribution Manager.",
    tasks: [
      "Plan warehouse receiving, storage, picking and dispatch operations",
      "Manage inventory accuracy, stock movement and space utilisation",
      "Coordinate warehouse teams, rosters, safety and productivity",
      "Monitor service levels, transport handoffs and customer requirements",
      "Improve warehouse processes, systems and cost control",
      "Coordinate with suppliers, carriers, procurement and distribution teams",
    ],
    countries: {
      AU: {
        headline: "A related Australian scope rather than a fabricated exact Warehouse Manager code",
        entryPathway:
          "Logistics and supply-chain study provides a relevant route, including UTAS's Bachelor of Global Logistics and Maritime Management and RMIT's Master of Supply Chain and Logistics Management. Warehouse management itself is commonly reached through operational experience and supervisory progression.",
        registration: "There is no statutory occupational registration for warehouse managers.",
        jobMarketNote:
          "Primary employment and earnings are intentionally null because no exact current OSCA Warehouse Manager code exists. Broader management context from legacy ANZSCO 133611 Supply and Distribution Manager and operational warehouse-supervision context remain supporting evidence only. The 2025 OSL records the representative current warehouse and distribution scopes as No Shortage nationally.",
        scoreCaveat:
          "No exact shortage or salary credit is awarded. Partial migration credit reflects only the related higher-level Supply and Distribution Manager CSOL pathway; it is not presented as a direct Warehouse Manager visa route.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
