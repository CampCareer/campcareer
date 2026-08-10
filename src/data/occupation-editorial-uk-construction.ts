import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "UK",
    editorial: {
      headline: "A Level 2 carpentry trade with a current Immigration Salary List route and strong future construction demand",
      entryPathway:
        "Carpenter maps to SOC 5316 Carpenters and joiners. A common entry route is an employer apprenticeship; in England, Skills England's Level 2 Carpentry and Joinery standard includes Site Carpenter and Architectural Joiner options and is approved for delivery.",
      registration:
        "Skills England does not classify the occupation itself as regulated. Site-access, safety and employer competence requirements can still apply, and self-employed contracting can bring additional business or scheme requirements.",
      jobMarketNote:
        "The current Skilled Worker rules place SOC 5316 on the Immigration Salary List until 31 December 2026. The Migration Advisory Committee reports 69,000 employees in 2025 and recommends 18-month Temporary Shortage List access, citing mixed historical shortage evidence but strong future demand.",
      scoreCaveat:
        "The shortage score is deliberately moderate because the MAC describes historical evidence as limited and mixed. Visa credit reflects the current targeted Immigration Salary List route, while vacancy intensity, employer diversity and trend remain unscored until recurring UK posting data are ingested.",
    },
  },
  {
    id: "electrician",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3 electrical trade with relatively strong shortage evidence and current Temporary Shortage List access",
      entryPathway:
        "Electrician maps to SOC 5241 Electricians and electrical fitters. In England, the Level 3 Installation and Maintenance Electrician apprenticeship is approved for delivery and covers installation, verification, testing, commissioning, maintenance and repair across industrial, commercial and residential environments.",
      registration:
        "Skills England does not classify Installation and Maintenance Electrician as a regulated occupation. Electrical work remains subject to statutory safety, building-regulation and wiring-standard requirements, and employers may require recognised competence schemes or cards for particular sites and duties.",
      jobMarketNote:
        "SOC 5241 is on the current Temporary Shortage List. The MAC reports 124,000 employees in 2025, describes historical shortage evidence as relatively strong and recommends 18-month TSL access because of elevated job adverts and substantial future demand.",
      scoreCaveat:
        "Electrician receives strong but not maximum shortage credit because the MAC recommendation still notes structural limits on visa uptake from self-employment and small firms. Current TSL access receives targeted visa credit; posting-level vacancy and employer-diversity components remain zero.",
    },
  },
  {
    id: "plumber",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3 plumbing trade with current Temporary Shortage List access and credible forward-looking shortage risk",
      entryPathway:
        "Plumber maps to SOC 5315 Plumbers and heating and ventilating installers and repairers. In England, the Level 3 Plumbing and Domestic Heating Technician standard provides an apprenticeship route with core plumbing training and specialist pathways including non-domestic plumbing.",
      registration:
        "The generic plumbing occupation is not treated as one universally licensed profession. Specific activities can carry additional legal competence or registration requirements, so the profile does not imply that a general plumbing qualification authorises every gas, heating or specialist installation task.",
      jobMarketNote:
        "SOC 5315 is on the current Temporary Shortage List. The MAC reports 71,000 employees in 2025 and recommends 18-month access, describing historical shortage evidence as mixed but identifying a credible risk of future shortage and a need to expand training and apprenticeships.",
      scoreCaveat:
        "The shortage component is kept below Electrician because the MAC explicitly describes the historical evidence as mixed. Visa credit reflects current targeted TSL access, while vacancy intensity and trend are not inferred from one-off advert observations.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "UK",
    editorial: {
      headline: "A Level 2 finishing trade with current Temporary Shortage List access and a persistent supply-demand gap",
      entryPathway:
        "Wall and Floor Tiler maps to SOC 5322 Floorers and wall tilers. In England, the Level 2 Wall and Floor Tiler apprenticeship is approved for delivery and covers preparation, setting out, cutting and fixing ceramic, porcelain and natural-stone tiles in new-build and refurbishment work.",
      registration:
        "Skills England treats Wall and Floor Tiler as a technical occupation rather than a nationally regulated profession. Construction-site safety, competence and client or contractor requirements still apply.",
      jobMarketNote:
        "SOC 5322 is on the current Temporary Shortage List. The MAC reports 10,000 employees in 2025 and recommends 18-month access; historical shortage indicators are mixed, but the report identifies a sizeable and persistent supply-demand gap linked to housing and retrofit activity.",
      scoreCaveat:
        "Shortage credit is moderate rather than strong because the MAC's historical indicators are mixed and domestic actions are modest. Current TSL access receives targeted visa credit; no synthetic vacancy intensity or trend score is added.",
    },
  },
  {
    id: "welder",
    countryCode: "UK",
    editorial: {
      headline: "A Level 2 welding trade with current Temporary Shortage List access and one of the stronger shortage cases in the cohort",
      entryPathway:
        "Welder maps to SOC 5213 Welding trades. Skills England provides an approved Level 2 Welder apprenticeship, with progression into specialist Level 3 Plate Welder or Pipe Welder routes where higher-integrity work requires additional process and quality competence.",
      registration:
        "Skills England does not classify Welder as a regulated occupation. Employers and sectors can nevertheless require recognised welding procedure qualifications, third-party certification, inspection standards or project-specific competence evidence.",
      jobMarketNote:
        "SOC 5213 is on the current Temporary Shortage List. The MAC reports 46,000 employees in 2025, finds shortage evidence particularly in job adverts with wage evidence also above trend, and recommends 18-month TSL access. The Immigration Salary List separately covers only experienced high-integrity pipe welders.",
      scoreCaveat:
        "The profile awards maximum shortage credit within UK v1 because the reviewed MAC evidence is among the strongest in this cohort. Generic welders receive current TSL visa credit; the narrower Immigration Salary List condition for high-integrity pipe welders is not applied to every welder.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "UK",
    editorial: {
      headline: "A Level 2 masonry trade with current Immigration Salary List access and moderate evidence of shortage",
      entryPathway:
        "Bricklayer maps directly to SOC 5313 Bricklayers. In England, Skills England's Level 2 Bricklayer apprenticeship is approved for delivery and covers brick, block and related masonry work across new-build and refurbishment projects.",
      registration:
        "Skills England does not classify Bricklayer as a regulated occupation. Construction-site safety, competence-card and contractor requirements can still apply even though there is no single statutory national bricklayer licence.",
      jobMarketNote:
        "SOC 5313 is on the current Immigration Salary List until 31 December 2026. The MAC reports 11,000 employees in 2025, identifies a moderate likelihood of shortage based mainly on job adverts and recent wage evidence, and recommends 18-month TSL access.",
      scoreCaveat:
        "The shortage score follows the MAC's moderate assessment rather than treating list membership itself as proof of maximum shortage. Visa credit reflects the current targeted Immigration Salary List route and is kept separate from labour-market scoring.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3 refrigeration and air-conditioning trade with current TSL access but weak historical shortage evidence",
      entryPathway:
        "HVAC Technician is constrained to the refrigeration and air-conditioning scope in SOC 5225 Air-conditioning and refrigeration installers and repairers, avoiding overlap with plumbing and heating SOC 5315. In England, the Level 3 Refrigeration Air Conditioning and Heat Pump Engineering Technician apprenticeship is approved for delivery.",
      registration:
        "Skills England does not label the occupation itself as regulated, but the current apprenticeship requires an F Gas and ODS Regulations Category 1 award alongside refrigeration and air-conditioning qualifications. Legal competence requirements therefore depend on the refrigerants and activities undertaken.",
      jobMarketNote:
        "SOC 5225 remains on the current Temporary Shortage List. However, the MAC reports only 7,000 employees in 2025, finds no signs of historical shortage in the reviewed data and recommends no future TSL access despite substantial forecast demand.",
      scoreCaveat:
        "Current visa access and shortage evidence are deliberately separated. HVAC receives targeted current TSL visa credit but zero shortage points because the July 2026 MAC review found no historical shortage and recommended no future access.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "UK",
    editorial: {
      headline: "A Level 6 construction site-management profession with a standard higher-skilled Skilled Worker route rather than shortage-list access",
      entryPathway:
        "Construction Manager is scoped to SOC 2455 Construction project managers and related professionals, matching Skills England's Construction Site Management occupation and the canonical Site Manager alias. In England, a Level 6 Construction Site Management degree apprenticeship is an approved route, while experienced progression from technical and supervisory construction roles also remains common.",
      registration:
        "There is no single statutory UK licence that universally authorises construction managers. Employers can require professional membership, chartership, safety-management credentials and role-specific competence depending on project scale and responsibility.",
      jobMarketNote:
        "SOC 2455 is classified as RQF level 6 or above and is eligible for the standard Skilled Worker route. It is not treated here as a current targeted shortage-list occupation, so the profile does not infer a shortage score from general construction-sector demand alone.",
      scoreCaveat:
        "The canonical profile uses SOC 2455 project and site management rather than the broader SOC 1122 production managers and directors in construction. Visa credit is partial because the occupation has a standard higher-skilled Skilled Worker route but no current TSL or all-jobs ISL treatment in this scope; shortage remains unscored pending direct occupation-specific evidence.",
    },
  },
]
