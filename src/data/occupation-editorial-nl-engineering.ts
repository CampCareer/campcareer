import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A degree-level civil-engineering profession with strong infrastructure demand and no universal statutory occupational licence",
      entryPathway:
        "Civil Engineer maps to ISCO-08 2142 Civil Engineers. A common Dutch route is an HBO bachelor Civiele Techniek, with university civil-engineering routes also available for research and advanced design work.",
      registration:
        "The generic civil-engineer occupation is not subject to one universal Dutch statutory professional register. Employers and projects can impose role-specific competence, safety or procurement requirements, but these are not treated as a nationwide licence to practise the occupation.",
      jobMarketNote:
        "UWV identifies civil engineering and construction engineering among higher-education technical fields with good job opportunities, driven by infrastructure and housing investment. This labour-market evidence is kept separate from IND work-permit eligibility.",
      scoreCaveat:
        "Salary uses the current Studiekeuze123 Civiele Techniek graduate starting-pay estimate as an early-career proxy. No vacancy-series, employer-diversity, trend or growth points are inferred until a comparable recurring Dutch dataset is ingested.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A broadly demanded mechanical-engineering profession supporting industry, energy and equipment systems",
      entryPathway:
        "Mechanical Engineer maps to ISCO-08 2144 Mechanical Engineers. The standard Dutch higher-education route is HBO Werktuigbouwkunde, with WO mechanical-engineering programmes serving more research-intensive and advanced design pathways.",
      registration:
        "Mechanical engineering is not a universally licensed Dutch profession. Employers may require sector-specific safety, quality or technical certifications, but no single national occupational registration is applied to the canonical role.",
      jobMarketNote:
        "UWV lists mechanical engineering among engineering disciplines with good job prospects and notes continuing technical demand associated with industrial renewal and the energy transition.",
      scoreCaveat:
        "The pay input is the Studiekeuze123 Werktuigbouwkunde graduate starting-pay estimate, not an occupation-wide median. Shortage credit reflects current UWV engineering evidence without assuming every vacancy is difficult to fill.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A very tight electrical-engineering labour market tied to grid expansion, electrification and industrial systems",
      entryPathway:
        "Electrical Engineer maps to ISCO-08 2151 Electrical Engineers. HBO Elektrotechniek is a direct Dutch route, with WO electrical-engineering degrees providing advanced design and research pathways.",
      registration:
        "The generic electrical-engineer profession is not universally registered by statute. Safety-critical or installation responsibilities may require separate role- or project-specific competence, which is not converted into a universal occupational licence here.",
      jobMarketNote:
        "UWV's Q1 2026 tension indicator explicitly names electrical engineers among occupations with major shortages, and UWV's higher-education outlook continues to identify electrical engineering as a strong field.",
      scoreCaveat:
        "Electrical Engineering receives the strongest Engineering shortage component because it has direct current UWV tightness evidence. Salary remains an early-career Studiekeuze123 proxy and immigration scoring remains independent of labour shortage.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A manufacturing-focused ISCO-08 2141 engineering scope linked to production systems, automation and industrial sustainability",
      entryPathway:
        "Manufacturing Engineer is scoped within ISCO-08 2141 Industrial and Production Engineers, specifically around production-system design, manufacturing processes, automation and continuous improvement. Dutch routes include Engineering, Werktuigbouwkunde and Technische Bedrijfskunde programmes.",
      registration:
        "Manufacturing engineering has no universal Dutch statutory occupational register. Employer requirements are normally tied to the technology, quality system, process-safety environment or industry rather than a national licence.",
      jobMarketNote:
        "UWV describes persistent demand for engineering skills in industry and notes that industrial decarbonisation requires higher-education specialists in process technology, mechanical engineering and electrical engineering before implementation moves into production.",
      scoreCaveat:
        "The profile shares ISCO-08 2141 with Industrial Engineer but preserves a manufacturing-specific role boundary. Salary uses Technische Bedrijfskunde as a transparent production/industrial early-career proxy rather than claiming a manufacturing-engineer national median.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "NL",
    editorial: {
      headline: "An ISCO-08 2141 industrial-engineering scope focused on process optimisation, productivity and integrated operations",
      entryPathway:
        "Industrial Engineer is also within ISCO-08 2141 Industrial and Production Engineers, but is constrained to process improvement, operations design, productivity, quality and systems integration rather than manufacturing-equipment design alone. Technische Bedrijfskunde is a common Dutch route.",
      registration:
        "Industrial engineering is not a universally licensed profession in the Netherlands. Professional competence is normally demonstrated through education and employer experience rather than mandatory national registration.",
      jobMarketNote:
        "UWV continues to identify engineering and higher technical skills as promising, while Dutch industry needs process, mechanical, electrical and digital expertise to modernise and decarbonise operations.",
      scoreCaveat:
        "Manufacturing Engineer and Industrial Engineer intentionally share ISCO-08 2141 but remain separate canonical scopes. Salary uses the Studiekeuze123 Technische Bedrijfskunde graduate estimate as a transparent early-career proxy.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A process- and chemistry-intensive engineering profession with good graduate outcomes and industrial-transition relevance",
      entryPathway:
        "Chemical Engineer maps to ISCO-08 2145 Chemical Engineers. HBO Chemische Technologie and university chemical-engineering routes are the principal Dutch education pathways into process design, production, materials and chemical-industry roles.",
      registration:
        "There is no universal Dutch statutory Chemical Engineer register. Process-safety, hazardous-substance and regulated-industry requirements may apply to particular positions without creating a single national licence for the occupation.",
      jobMarketNote:
        "UWV highlights process technology as one of the key skill domains needed for industrial sustainability and reports continuing shortages across technical occupations. Chemical Engineer therefore receives moderate, not maximum, shortage credit.",
      scoreCaveat:
        "The salary input is the Studiekeuze123 Chemische Technologie graduate starting-pay estimate. Broad industrial demand is not treated as proof of a severe occupation-specific shortage.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A sustainability-linked ISCO-08 2143 profession supported by Dutch climate, environmental and energy-transition demand",
      entryPathway:
        "Environmental Engineer maps to ISCO-08 2143 Environmental Engineers. Dutch routes can include Milieukunde, environmental technology, civil engineering or related science-and-engineering programmes depending on whether the role focuses on water, remediation, permitting or sustainable systems.",
      registration:
        "Environmental engineering is not subject to one universal statutory Dutch occupational register. Specific consultancy, permitting, safety or environmental-assessment work can require organisation- or task-level qualifications.",
      jobMarketNote:
        "UWV's higher-education outlook identifies sustainability, environment and energy-management specialists as occupations with good opportunities and links climate measures to ongoing technical demand.",
      scoreCaveat:
        "Salary uses the Studiekeuze123 Milieukunde graduate starting-pay estimate as a conservative environmental early-career proxy. Green-transition demand supports shortage credit but is not treated as an immigration fast track.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "NL",
    editorial: {
      headline: "An accessible engineering-technician pathway supported by strong Dutch technical demand and HBO associate-degree progression",
      entryPathway:
        "Engineering Technician is represented by ISCO-08 3119 Physical and Engineering Science Technicians Not Elsewhere Classified as a broad cross-discipline technician proxy. The HBO Associate Degree Engineering provides a two-year bridge between MBO level 4 and bachelor engineering and is used as the primary reviewed entry reference.",
      registration:
        "The broad Engineering Technician occupation is not universally registered in the Netherlands. Individual technical sectors can require safety, inspection or equipment-specific credentials, which are outside the generic canonical profile.",
      jobMarketNote:
        "UWV reports persistent shortages across technical occupations and says many engineering and technician roles remain structurally promising. The technician profile receives strong demand credit without inheriting the electrical-engineer maximum.",
      scoreCaveat:
        "The Engineering Associate Degree graduate starting-pay estimate is used as an early-career proxy. The ISCO-08 3119 mapping is intentionally broad and must not be read as a discipline-specific technician classification.",
    },
  },
]
