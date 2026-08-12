import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SwedenConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "SE"
  editorial: CountryOccupationEditorial
}

export const SWEDEN_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly SwedenConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 2012 carpentry trade mapped to 7111 Träarbetare, snickare m.fl.",
      entryPathway:
        "Carpenter maps directly to SSYK 2012 code 7111, which includes Byggnadssnickare, Byggnadsträarbetare and other building carpentry titles. Entry is primarily vocational and practical through construction training, workplace learning and supervised trade experience rather than a university-only route.",
      registration:
        "There is no universal Swedish state licence that every carpenter must hold before employment. Construction-site safety, employer competence and project-specific requirements apply separately.",
      jobMarketNote:
        "SCB provides a clean four-digit SSYK occupation anchor. Arbetsförmedlingen publishes occupation outlooks, but CampCareer SE v1 does not yet normalise a recurring carpenter shortage, vacancy, earnings or growth series into the common comparison model.",
      scoreCaveat:
        "SE v1 credits accessible practical entry and a low universal licensing burden only. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "electrician",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 7411 installation electrician trade with a statutory company self-audit boundary rather than universal personal authorisation",
      entryPathway:
        "Electrician maps directly to SSYK 2012 code 7411 Installations- och serviceelektriker. Vocational electrical education, workplace learning and employer-assessed competence are common entry routes; personal authorisation as an elinstallatör is a separate regulated status rather than a prerequisite for every employed electrician.",
      registration:
        "Elsäkerhetsverket states that commercial electrical installation work may be carried out by an authorised electrician or by a person covered by an electrical installation company's self-audit scheme. Every electrical installation company must have an authorised compliance electrician, but ordinary employees do not all need personal authorisation.",
      jobMarketNote:
        "The legal work boundary is strong evidence about competence and supervision, not evidence of labour shortage. SE v1 therefore leaves shortage, vacancy, salary and growth components unscored until the common market-data phase.",
      scoreCaveat:
        "The provisional score recognises a structured vocational route while applying a moderate entry-burden discount for the statutory self-audit and competence framework. Market and visa evidence remains zero.",
    },
  },
  {
    id: "plumber",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 7125 VVS trade with Säker Vatten industry credentials kept separate from state occupational licensing",
      entryPathway:
        "Plumber maps directly to SSYK 2012 code 7125 VVS-montörer m.fl., which includes Rörmokare, VVS-montör and related pipe-installation titles. Entry is primarily vocational through VVS training, workplace learning and trade experience.",
      registration:
        "There is no universal Swedish state personal licence for the broad plumber occupation. Säker Vatten operates an industry authorisation system for VVS companies and requires branch identification and training for installers working under its authorised-company rules; CampCareer does not mislabel that scheme as a state licence.",
      jobMarketNote:
        "Arbetsförmedlingen publishes current VVS job-opportunity assessments, but SE v1 does not convert one occupation-outlook snapshot into the common recurring shortage or vacancy components.",
      scoreCaveat:
        "The foundation score reflects accessible vocational entry with a modest industry-credential burden. Labour-market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 7112 tiling scope covering Kakelsättare, Klinkerläggare and Plattsättare",
      entryPathway:
        "Wall and Floor Tiler maps to SSYK 2012 code 7112 Murare m.fl. because the official title list explicitly includes Kakelsättare, Klinkerläggare, Mosaikläggare and Plattsättare and the group description covers tiles on both walls and floors.",
      registration:
        "There is no universal Swedish state occupational licence for the broad wall and floor tiler role. Site safety, wet-room systems, employer competence and client or contractor requirements remain separate from occupational registration.",
      jobMarketNote:
        "The exact SSYK mapping is retained without inferring a labour-market score from the wider 7112 group. Exact recurring shortage, vacancy, salary and growth evidence remains for later enrichment.",
      scoreCaveat:
        "SE v1 credits practical accessibility and low universal licensing burden only. Market and visa signals remain unscored.",
    },
  },
  {
    id: "welder",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 7212 Svetsare och gasskärare trade with process-specific qualification requirements",
      entryPathway:
        "Welder maps directly to SSYK 2012 code 7212 Svetsare och gasskärare, which includes MIG-, MAG-, TIG-, gas- and pipe-welding titles. Practical process training and supervised industrial or construction experience are central to entry.",
      registration:
        "There is no one universal Swedish state Welder licence covering every welding job. Employers, projects and quality systems may require procedure-, material- or process-specific welder qualifications and certification for particular work.",
      jobMarketNote:
        "The direct classification anchor is preserved, but SE v1 does not combine fabrication, construction and industrial welding demand into an unsupported exact national market series.",
      scoreCaveat:
        "The provisional score credits practical entry while allowing for process-specific competence burden. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 7112 Murare mapping shared with the official tiling titles",
      entryPathway:
        "Bricklayer maps directly to SSYK 2012 code 7112 Murare m.fl.; Murare and Murarmästare are explicit official titles in the group. The trade is mainly entered through vocational construction training and supervised practical experience.",
      registration:
        "There is no universal Swedish state personal licence for ordinary bricklaying employment. Construction-site safety and contractor or employer competence requirements remain separate.",
      jobMarketNote:
        "CampCareer keeps the direct SSYK occupation anchor while avoiding a fabricated bricklayer-only market series from broader masonry-group data.",
      scoreCaveat:
        "The foundation score reflects accessible practical entry and low universal licensing burden only; market and visa components remain zero.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 7126 refrigeration and heat-pump technician occupation with activity-based F-gas certification rules",
      entryPathway:
        "HVAC Technician maps to SSYK 2012 code 7126 Kyl- och värmepumpstekniker m.fl., which includes Kyltekniker, Kylmontör and Värmepumpsmontör. Technical VVS/refrigeration education and supervised installation and service experience are common preparation routes.",
      registration:
        "The occupation itself is broader than one universal personal licence, but Swedish and EU F-gas rules require person certification for installation, leak checking, refrigerant recovery, service and maintenance when the covered equipment contains F-gases. Company certification is also required for covered installation or service businesses.",
      jobMarketNote:
        "The SSYK code is direct, while the certification rule is activity- and refrigerant-specific. SE v1 does not treat certification as demand evidence and leaves the recurring market components unscored.",
      scoreCaveat:
        "SE v1 gives moderate technical-entry credit and a higher regulatory-burden discount because important refrigeration and heat-pump activities can require F-gas certification. Market and visa components remain zero.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "SE",
    editorial: {
      headline: "A direct SSYK 1362 site-management scope covering Byggplatschef, Platschef and Produktionschef titles",
      entryPathway:
        "Construction Manager is scoped to SSYK 2012 code 1362 Driftchefer inom bygg, anläggning och gruva, nivå 2, whose official titles include Byggplatschef, Platschef and Produktionschef in construction. Entry commonly combines built-environment or technical study with substantial project, site, contractor and people-management experience.",
      registration:
        "There is no single Swedish state occupational licence that universally authorises construction managers. Project role, work-environment responsibility, procurement and employer competence requirements can create narrower obligations without turning the broad occupation into a licensed profession.",
      jobMarketNote:
        "The profile uses the operational site-management SSYK group rather than combining it with 1361 middle-management, 3121 supervisors or 3112 construction project engineers. Exact recurring occupation-level market evidence remains for later enrichment.",
      scoreCaveat:
        "SE v1 gives moderate entry credit because management is experience-sensitive and leaves market and occupation-specific visa evidence unscored.",
    },
  },
]
