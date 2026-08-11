import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level infrastructure profession with sustained engineering demand and a standard Skilled Worker route",
      entryPathway:
        "Civil Engineer maps to SOC 2121 Civil engineers. A common UK entry route is an accredited civil-engineering degree or degree apprenticeship; Skills England maintains a Level 6 Civil Engineer occupation with progression from civil-engineering technician routes.",
      registration:
        "There is no single statutory UK licence required to work under the generic title civil engineer. Professional registration such as Incorporated or Chartered Engineer can be valuable for progression and responsible roles, while project-specific safety and competence requirements still apply.",
      jobMarketNote:
        "The Migration Advisory Committee reports that engineering professionals have had persistently higher vacancy rates than other professional occupations. Civil engineering also rose strongly among the engineering skills sought in online adverts, reflecting continuing infrastructure demand.",
      scoreCaveat:
        "Civil engineering receives moderate shortage credit from occupation-group vacancy evidence and rising civil-engineering skill demand, rather than from targeted shortage-list membership. SOC 2121 is an RQF 6+ occupation on the standard Skilled Worker route, so visa credit is partial rather than targeted.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A broad degree-level engineering profession with substantial recurring employer demand and standard Skilled Worker eligibility",
      entryPathway:
        "Mechanical Engineer maps to SOC 2122 Mechanical engineers. Degree and degree-apprenticeship routes are common, with specialist pathways across mechanical design, automotive, marine, rail, energy and manufacturing systems.",
      registration:
        "The generic mechanical-engineer occupation is not subject to one statutory national licence. Chartered or Incorporated Engineer registration is voluntary but can strengthen professional standing and may be expected for some senior or safety-critical responsibilities.",
      jobMarketNote:
        "Mechanical engineers and mechanical design engineers are among the most frequently advertised engineering job titles in the MAC's 2021-2024 analysis. Engineering-professional vacancy rates have also remained above those of other professional groups in the reviewed Employer Skills Survey data.",
      scoreCaveat:
        "The shortage score is moderate because strong recurring job-advert demand does not by itself establish a severe occupation-wide shortage. SOC 2122 is eligible through the standard RQF 6+ Skilled Worker route and is not treated as a current targeted TSL or ISL occupation.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A high-demand degree-level engineering profession with particularly strong electrical skills pressure and standard Skilled Worker eligibility",
      entryPathway:
        "Electrical Engineer maps to SOC 2123 Electrical engineers. Skills England provides Level 6 electrical and electronic engineering pathways, while university degrees remain a common route into power systems, rail signalling, industrial electrical systems and related professional work.",
      registration:
        "There is no universal statutory licence for the generic electrical-engineer profession. Employers can require role-specific competence, safety authorisations or professional registration for high-voltage, rail, infrastructure or other safety-critical work.",
      jobMarketNote:
        "The MAC specifically highlights the risk of insufficient electrical-engineer supply relative to current and future demand. Electrical engineers were also among the highest-volume engineering job titles in 2021-2024 adverts, and electrical engineering remained one of the most sought engineering skills.",
      scoreCaveat:
        "Electrical Engineer receives the strongest professional-engineering shortage credit in this cohort because the MAC discusses both current supply pressure and future demand risk directly. Visa credit remains partial because SOC 2123 uses the standard RQF 6+ Skilled Worker route rather than targeted TSL or ISL access.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A Level 6 production-engineering profession tied to advanced manufacturing, process improvement and industrial investment",
      entryPathway:
        "Manufacturing Engineer is scoped to manufacturing-focused work within SOC 2125 Production and process engineers, primarily the 2125/99 and 2125/03 sub-unit space. Skills England's Level 6 Manufacturing Engineer occupation is an approved route covering process design, commissioning, productivity, quality and continuous improvement.",
      registration:
        "Manufacturing engineering is not one statutorily licensed profession. Professional registration can support progression, while employers may impose sector-specific safety, quality, validation or regulatory requirements.",
      jobMarketNote:
        "The MAC finds engineering-professional vacancy rates above other professional occupations and identifies continuous-improvement skills among the fastest-rising engineering skills. Advanced manufacturing policy also depends on engineers who can design and improve production systems.",
      scoreCaveat:
        "Because SOC 2125 contains chemical, control, industrial and production engineering, only limited shortage credit is awarded to the manufacturing scope without a recurring manufacturing-engineer-specific shortage series. Standard RQF 6+ Skilled Worker access receives partial visa credit.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A production-systems engineering profession centred on efficiency, quality and process optimisation within SOC 2125",
      entryPathway:
        "Industrial Engineer is constrained to SOC 2125/03 Industrial and production engineers. Relevant entry routes include industrial, manufacturing and operations-engineering degrees and the Level 6 Manufacturing Engineer occupation, which explicitly lists Industrial Engineer among typical job titles.",
      registration:
        "Industrial engineering does not require one statutory UK professional licence. Employers may value professional registration, Lean or Six Sigma capability, quality credentials and sector-specific operational competence.",
      jobMarketNote:
        "Industrial engineering benefits from the wider engineering demand environment and from rising employer emphasis on continuous improvement and production efficiency. The evidence reviewed is stronger for the broader engineering group than for Industrial Engineer as a standalone labour-market series.",
      scoreCaveat:
        "The score deliberately avoids duplicating the whole SOC 2125 shortage signal across Manufacturing, Industrial and Chemical Engineer. Industrial Engineer receives limited broad engineering shortage credit and standard Skilled Worker visa credit only.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level process-engineering profession spanning chemicals, energy, pharmaceuticals and science-based manufacturing",
      entryPathway:
        "Chemical Engineer is constrained to SOC 2125/01 Chemical engineers within Production and process engineers. Skills England's Level 6 Science Industry Process and Plant Engineer route explicitly includes Chemical Engineer among its typical job titles.",
      registration:
        "The generic Chemical Engineer occupation is not subject to one statutory national licence, though regulated plants and high-hazard sectors impose strict process-safety, environmental and technical competence requirements. Chartered status can support senior professional progression.",
      jobMarketNote:
        "Chemical engineering sits inside the broader production-and-process engineering occupation reviewed by the MAC. Demand is supported across advanced manufacturing, chemicals, life sciences and energy, but the reviewed official data do not isolate a severe current shortage for Chemical Engineer alone.",
      scoreCaveat:
        "Only limited shortage credit is awarded because current official shortage evidence is primarily at the broader 2125 engineering level. SOC 2125 is RQF 6+ and eligible on the standard Skilled Worker route without targeted TSL or ISL treatment.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level environmental profession mapped to SOC 2152 rather than the general engineering SOC family",
      entryPathway:
        "Environmental Engineer is constrained to SOC 2152/02 Environmental and geo-environmental engineers. Relevant routes include environmental-practice degrees and engineering programmes with environmental specialisation; Skills England's environmental and rail-engineering maps explicitly recognise the 2152/02 sub-unit.",
      registration:
        "There is no single statutory UK licence for the generic environmental-engineer title. Professional environmental or engineering registration may support progression, while projects can require specialist competence in permitting, contaminated land, water, infrastructure or environmental assessment.",
      jobMarketNote:
        "Environmental engineering is eligible for the standard Skilled Worker route through SOC 2152 Environment professionals. The current evidence set supports the occupation's role in environmental and infrastructure delivery but does not provide a sufficiently direct occupation-specific shortage finding for UK v1 scoring.",
      scoreCaveat:
        "No shortage points are inferred from general green-transition demand alone. The profile deliberately uses SOC 2152/02, avoiding an inaccurate mapping to Engineering professionals n.e.c.; visa credit reflects standard RQF 6+ Skilled Worker eligibility.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3 technical engineering occupation with current Temporary Shortage List access and evidence of future demand",
      entryPathway:
        "Engineering Technician maps to SOC 3113 Engineering technicians. Skills England maintains approved Level 3 Engineering Technician pathways across mechatronics, product design and development, aerospace, maintenance and other specialisms, with progression into higher technical and professional engineering roles.",
      registration:
        "The generic engineering-technician occupation is not universally licensed. Employers can require role-specific competence, safety approvals or technical certification, and voluntary Engineering Technician professional registration is available for suitable practitioners.",
      jobMarketNote:
        "SOC 3113 is on the current Temporary Shortage List. The July 2026 MAC review reports about 100,000 employees, some evidence of historical shortage, pay growth marginally above the UK trend and expected future demand, and recommends 18-month TSL access.",
      scoreCaveat:
        "Engineering Technician receives moderate shortage credit rather than maximum credit because the MAC describes the historical evidence as present but not exceptionally strong. Current targeted TSL access receives 10/10 visa credit and is kept separate from the shortage component.",
    },
  },
]
