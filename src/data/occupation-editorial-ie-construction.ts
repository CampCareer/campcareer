import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5315 skilled trade with a national craft-apprenticeship route and current SOLAS shortage evidence",
      entryPathway:
        "Carpenter is mapped to SOC 2010 5315 Carpenters and joiners. Ireland's national craft-apprenticeship system includes Carpentry and Joinery, and construction-site workers are legally required to hold a valid SOLAS Safe Pass card.",
      registration:
        "Carpentry is not a universally statutorily registered profession in Ireland. Craft qualification, site competence and employer requirements matter, while Safe Pass is a separate mandatory construction-site safety credential rather than professional registration.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies Carpenters as a current skills-shortage occupation. Carpenters and joiners are not on the current Ineligible List, so qualifying non-EEA hires can generally use the General Employment Permit route subject to its normal conditions.",
      scoreCaveat:
        "No occupation-specific current median wage, recurring vacancy-intensity series or employment-growth series is normalised in CampCareer for Ireland yet. The provisional score uses direct shortage, entry-route and employment-permit evidence only.",
    },
  },
  {
    id: "electrician",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5241 electrical trade with an established apprenticeship route, future-shortage pressure and regulated contractor work",
      entryPathway:
        "Electrician maps to SOC 2010 5241 Electricians and electrical fitters. Electrical is a national craft apprenticeship in Ireland; construction-site work also requires Safe Pass where the worker falls within the Construction Regulations.",
      registration:
        "The broad electrician occupation is not treated as a universal personal register. However, restricted electrical works and electrical contracting are legally regulated through the CRU's Safe Electric scheme, and a Registered Electrical Contractor is required for regulated work within that scope.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies Electricians as a potential future skills shortage. The occupation is not on the current Ineligible List and can generally be considered for a General Employment Permit subject to normal permit requirements.",
      scoreCaveat:
        "Potential-future-shortage evidence receives less weight than a current shortage finding. Salary, recurring vacancies and growth remain unscored until an exact comparable Irish occupation series is ingested.",
    },
  },
  {
    id: "plumber",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5314 plumbing and heating trade with a national apprenticeship route and potential future shortage",
      entryPathway:
        "Plumber maps to SOC 2010 5314 Plumbers and heating and ventilating engineers. Plumbing is a national craft apprenticeship and site-based construction workers require Safe Pass under the applicable construction-safety rules.",
      registration:
        "General plumbing is not represented as one universal statutory personal register. Gas work is different: regulated gas work must be carried out by a Registered Gas Installer under the CRU's RGI scheme, so gas-fitting scope carries an additional legal credential boundary.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies Plumbers as a potential future skills shortage. Plumbers and heating and ventilating engineers are outside the current Ineligible List and can generally use the General Employment Permit route subject to normal criteria.",
      scoreCaveat:
        "The v1 score separates the broad plumbing occupation from RGI-only gas work. Current median salary, vacancy intensity and growth are left unscored rather than inferred from construction-sector averages.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5322 building-finishing trade with General Employment Permit access but no direct shortage signal in the current SOLAS bulletin",
      entryPathway:
        "Wall and Floor Tiler maps to SOC 2010 5322 Floorers and wall tilers. A dedicated current craft apprenticeship for this exact occupation is not asserted from the national apprenticeship directory; site entry still requires the relevant trade competence and a valid Safe Pass for construction work.",
      registration:
        "Wall and floor tiling is not a universally statutorily registered profession in Ireland. Safe Pass is a legally required site-safety credential for construction workers but is not treated as occupational registration.",
      jobMarketNote:
        "Floorers and wall tilers are not on the current Ineligible List, so the occupation can generally be considered for a General Employment Permit. The National Skills Bulletin 2025 construction summary does not identify this exact occupation as a confirmed shortage, so no shortage points are inferred.",
      scoreCaveat:
        "No exact shortage, current median wage, recurring vacancy or growth series is available in the current evidence package. Those components remain zero instead of borrowing signals from the wider construction sector.",
    },
  },
  {
    id: "welder",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5215 welding trade with direct SOLAS shortage evidence and an established metal-fabrication training pathway",
      entryPathway:
        "Welder maps to SOC 2010 5215 Welding trades. Ireland's national craft-apprenticeship directory lists Metal Fabrication as a closely related formal route; it is treated as a common welding pathway rather than an exact one-to-one occupational equivalence.",
      registration:
        "Welding is not a universally statutorily registered profession in Ireland. Project, process and employer-specific welding qualifications can be required, and welders working on construction sites must also satisfy applicable Safe Pass requirements.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies Welders/fabricators as a current shortage. Welding trades are not on the current Ineligible List, allowing General Employment Permit consideration subject to the standard conditions.",
      scoreCaveat:
        "The shortage finding is direct, but exact current median earnings, recurring vacancies and growth are not yet normalised. The Metal Fabrication apprenticeship is scored as a related structured route, not as proof that every welder must complete that apprenticeship.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5312 bricklaying and masonry trade with a national Brick and Stonelaying apprenticeship route",
      entryPathway:
        "Bricklayer maps to SOC 2010 5312 Bricklayers and masons. Brick and Stonelaying is listed in Ireland's national craft-apprenticeship system, while construction-site workers must also hold the applicable Safe Pass credential.",
      registration:
        "Bricklaying is not a universally statutorily registered profession in Ireland. Formal apprenticeship and craft competence are strong entry signals, while Safe Pass is a mandatory site-safety requirement rather than professional registration.",
      jobMarketNote:
        "Bricklayers and masons are outside the current Ineligible List and can generally be considered for a General Employment Permit. The National Skills Bulletin 2025 construction summary does not identify Bricklayers as a separate confirmed shortage, so broader housing demand is not converted into shortage points.",
      scoreCaveat:
        "Salary, vacancy intensity and growth remain unscored until exact recurring Irish occupation data is normalised. General construction demand is kept separate from occupation-specific shortage evidence.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 5225 refrigeration and air-conditioning trade with a national refrigeration apprenticeship and F-gas certification boundary",
      entryPathway:
        "HVAC Technician is constrained to SOC 2010 5225 Air-conditioning and refrigeration engineers. Refrigeration is included in Ireland's national craft-apprenticeship system and provides the closest direct structured entry route for the canonical refrigeration/air-conditioning scope.",
      registration:
        "There is no single universal HVAC register covering every task. Personnel who install, service, maintain, repair, decommission, leak-check or recover refrigerants from covered F-gas equipment must hold the appropriate F-gas personnel certification under EU and Irish law.",
      jobMarketNote:
        "Air-conditioning and refrigeration engineers are outside the current Ineligible List and can generally be considered for a General Employment Permit. The National Skills Bulletin 2025 summaries reviewed do not provide an exact current HVAC shortage finding, so shortage is not inferred.",
      scoreCaveat:
        "The entry-burden score reflects the F-gas certification requirement for regulated refrigerant work. Current median salary, recurring vacancies and growth remain unscored pending exact Irish occupation-level series.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "IE",
    editorial: {
      headline: "A high-skill construction-management profile spanning SOC 2436 project management and SOC 1122 site-management scope with Critical Skills access",
      entryPathway:
        "Construction Manager is centred on SOC 2010 2436 Construction project managers and related professionals, with SOC 1122 Site Manager retained as a second included management scope. Entry commonly relies on construction-management education and/or substantial project experience; no Ireland university-programme link is published from the current CampCareer programme cohort because Ireland has no Tier A programme rows yet.",
      registration:
        "Construction management is not a universally statutorily registered profession in Ireland. Site-based managers can still face project-specific competence and safety requirements, including Safe Pass where the construction-worker rules apply.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies Construction project managers as a current skills shortage. The current Critical Skills Occupations List includes both SOC 2436 Construction project managers and SOC 1122 Site Manager, giving this profile stronger non-EEA recruitment access than the general construction trades.",
      scoreCaveat:
        "The v1 profile does not infer a salary or vacancy trend from broad construction-management data. Critical Skills eligibility and direct SOLAS shortage evidence are scored separately to avoid double counting the same labour-market signal.",
    },
  },
]
