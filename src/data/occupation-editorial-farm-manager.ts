import type { OccupationEditorial } from "./occupation-editorial-base"

export const FARM_MANAGER_OCCUPATION_EDITORIAL = [
  {
    id: "farm-manager",
    overview:
      "Farm Managers plan, organise and control agricultural production, staff, infrastructure, budgets, biosecurity and marketing. Australia does not have one generic six-digit OSCA Farm Manager occupation: farm managers are classified by the type of production they manage, such as aquaculture, dairy cattle, pigs, poultry, sheep, fruit or vegetables.",
    tasks: [
      "Plan seasonal production, livestock or crop operations and resource requirements",
      "Coordinate staff, contractors, equipment, infrastructure and daily farm routines",
      "Monitor animal or crop health, biosecurity, weather and production risks",
      "Manage purchasing, sales, transport, records, budgets and farm business capital",
      "Adopt farming technologies and analyse operational and market information",
      "Ensure production activities meet welfare, environmental and workplace requirements",
    ],
    countries: {
      AU: {
        headline:
          "A cross-production umbrella career rather than one Australian six-digit occupation, with migration options that depend on the exact farm-production code",
        entryPathway:
          "Farm management can be reached through agricultural study plus substantial practical experience. Charles Sturt's three-year Bachelor of Agricultural Business Management, CRICOS 057781F, combines agricultural and business preparation, while its three-year Bachelor of Agriculture, CRICOS 0101014, provides a production-focused route.",
        registration:
          "There is no universal occupational registration for Farm Managers. Specific production activities, chemicals, machinery, biosecurity duties and workplace roles can carry licences or compliance requirements. For migration, the exact production occupation must be identified and its assessing-authority criteria met.",
        jobMarketNote:
          "Current OSCA classifies farm managers by production type rather than under a generic Farm Manager code. Examples include Aquaculture Farm Manager under 151331, Dairy Cattle Farm Manager under 152231, Pig Farm Manager under 152934 and Poultry Farm Manager under 152935. CampCareer therefore does not aggregate multiple farmer groups into a fabricated exact employment, salary, vacancy or shortage figure.",
        scoreCaveat:
          "The score is deliberately low-resolution: no generic national OSL rating or exact labour series exists. The current skilled occupation instrument covers some production-specific farmer occupations, including aquaculture, dairy cattle, pig and poultry farming, but not every role that a user may call Farm Manager. Visa credit is therefore partial only.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
