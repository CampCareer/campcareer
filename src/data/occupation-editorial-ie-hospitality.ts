import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "IE",
    editorial: {
      headline: "A direct shortage occupation with permit access limited to named experienced chef grades",
      entryPathway:
        "Chef is mapped to SOC 2010 5434. Ireland has a current Chef de Partie Level 7 apprenticeship and established culinary training routes, but the employment-permit route is narrower than the occupation title: the named Executive, Head, Sous, Chef de Partie and Commis grades require the applicable experience and non-fast-food setting.",
      registration:
        "No universal statutory personal registration is required for the broad Chef occupation in Ireland.",
      jobMarketNote:
        "SOLAS 2025 directly identifies Chefs as a current Hospitality shortage. The current Ineligible List nevertheless makes most SOC 5434 chef employment ineligible except the specified experienced chef grades and conditions, so shortage evidence does not mean every chef vacancy is permit-accessible.",
      scoreCaveat:
        "The direct shortage signal receives full shortage credit, while visa credit is limited to conditional General Employment Permit accessibility. Permit salary thresholds are not used as salary evidence, and exact comparable salary, vacancy and growth series remain unscored.",
    },
  },
  {
    id: "cook",
    countryCode: "IE",
    editorial: {
      headline: "An accessible culinary entry role that remains distinct from the Chef shortage and permit exception",
      entryPathway:
        "Cook is mapped to SOC 2010 5435. Practical culinary training and workplace progression can provide an accessible entry route, including progression toward more skilled chef roles over time.",
      registration:
        "No universal statutory personal registration is required for the broad Cook occupation in Ireland.",
      jobMarketNote:
        "SOLAS 2025 identifies Chefs rather than Cooks as the current Hospitality shortage. SOC 5435 Cooks is on the current Ineligible List, so the Chef shortage and chef permit exceptions are not borrowed by this profile.",
      scoreCaveat:
        "Entry accessibility does not override current employment-permit ineligibility. Salary, recurring vacancy and growth inputs remain unscored without exact comparable occupation-level evidence.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "IE",
    editorial: {
      headline: "A hotel-management role with renewed quota-based General Employment Permit access",
      entryPathway:
        "Hotel Manager is mapped to SOC 2010 1221 Hotel and accommodation managers and proprietors, constrained to genuine management duties. Hospitality-management education or progression from hotel operations is a common route.",
      registration:
        "No universal statutory personal registration is required for the broad Hotel Manager occupation.",
      jobMarketNote:
        "The 2026 employment-permit occupations review renewed a General Employment Permit quota for hotel and accommodation managers and proprietors, subject to the Labour Market Needs Test and current permit conditions. SOLAS does not publish an exact Hotel Manager shortage in the reviewed Hospitality summary.",
      scoreCaveat:
        "Quota-based permit access is scored separately from shortage evidence and is not treated as Critical Skills eligibility. Exact salary, vacancy and growth series remain unscored.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "IE",
    editorial: {
      headline: "A restaurant-management role with renewed quota-based General Employment Permit access",
      entryPathway:
        "Restaurant Manager is mapped to SOC 2010 1223 Restaurant and catering establishment managers and proprietors. Hospitality or restaurant-management study and progression from food-and-beverage operations are common pathways.",
      registration:
        "No universal statutory personal registration is required for the broad Restaurant Manager occupation.",
      jobMarketNote:
        "The current 2026 quota permits General Employment Permit applications for restaurant and catering establishment managers and proprietors, subject to the Labour Market Needs Test and other requirements. SOLAS identifies Chefs rather than Restaurant Managers as the current Hospitality shortage.",
      scoreCaveat:
        "SOC 2010 1223 is deliberately kept separate from Chef 5434 and Cook 5435. Quota access is not converted into shortage points or Critical Skills treatment.",
    },
  },
  {
    id: "baker",
    countryCode: "IE",
    editorial: {
      headline: "A Baker-specific SOC 5432 scope that stays separate from the ineligible Flour confectioner employment",
      entryPathway:
        "Baker is mapped to the Baker scope within SOC 2010 5432 Bakers and flour confectioners. Craft, further-education and workplace bakery routes provide a practical entry pathway.",
      registration:
        "No universal statutory personal registration is required for the broad Baker occupation.",
      jobMarketNote:
        "Baker was removed from the Ineligible List in the 2023 occupations expansion. The current 2026 list still names Flour confectioners under SOC 5432, so the canonical Baker is treated as ordinary General Employment Permit-accessible while the ineligible Flour confectioner employment remains separate.",
      scoreCaveat:
        "Sharing SOC 5432 does not make Baker and Flour confectioner interchangeable for permit purposes. No exact Baker shortage, salary, vacancy or growth signal is inferred.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "IE",
    editorial: {
      headline: "A travel-and-tourism management scope whose current SOC remains permit-ineligible",
      entryPathway:
        "Tourism Manager is conservatively mapped to SOC 2010 1226 Travel agency managers for travel/tourism management duties. Tourism, hospitality or business study plus operational progression is a common route, with Fáilte Ireland training available for sector development.",
      registration:
        "No universal statutory personal registration is required for the broad Tourism Manager occupation.",
      jobMarketNote:
        "SOC 1226 Travel agency managers is on the current Ineligible List. Broad tourism-sector activity is not used to reclassify the role into Hotel Manager, hospitality management or another permit-eligible management occupation.",
      scoreCaveat:
        "Tourism Manager titles can cover different real-world duties, so classification must follow the actual job. This profile receives no visa or shortage credit from unrelated hospitality-manager quotas.",
    },
  },
  {
    id: "event-planner",
    countryCode: "IE",
    editorial: {
      headline: "An event-planning occupation with useful transferable pathways but current permit ineligibility",
      entryPathway:
        "Event Planner is mapped to SOC 2010 3546 Conference and exhibition managers and organisers. Event, tourism, hospitality, marketing or business study plus practical delivery experience is a common entry route.",
      registration:
        "No universal statutory personal registration is required for the broad Event Planner occupation.",
      jobMarketNote:
        "SOC 3546 Conference and exhibition managers and organisers is on the current Ineligible List. SOLAS does not publish an exact Event Planner shortage in the reviewed Arts, Sports and Tourism summary.",
      scoreCaveat:
        "The profile is not promoted into generic Project Manager or Marketing occupations to obtain a different permit outcome. Salary, vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "IE",
    editorial: {
      headline: "A front-line hospitality supervision scope with workplace progression and quota-based permit access",
      entryPathway:
        "Hospitality Supervisor is mapped to SOC 2010 5436 Catering and bar managers for genuine front-line supervision of service and staff. Fáilte Ireland highlights workplace progression from operational roles into supervision and management.",
      registration:
        "No universal statutory personal registration is required for the broad Hospitality Supervisor occupation.",
      jobMarketNote:
        "Catering and bar managers are included in the renewed 2026 hospitality General Employment Permit quota, subject to current quota and Labour Market Needs Test requirements. SOLAS does not publish an exact Hospitality Supervisor shortage.",
      scoreCaveat:
        "Front-line supervision is not automatically Hotel Manager 1221 or Restaurant Manager 1223. Permit access is scored separately from shortage evidence, and exact salary/vacancy/growth series remain unscored.",
    },
  },
]
