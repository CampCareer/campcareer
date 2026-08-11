import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21421 civil-engineering occupation with a clear professional-degree route and regulated PE boundaries for prescribed engineering work",
      entryPathway:
        "SSOC 2024 maps the canonical role directly to 21421 Civil engineer, while 21422 Building construction engineer remains separate. Civil-engineering degrees provide the most direct preparation, and the four approved Singapore civil programmes are retained as direct study pathways.",
      registration:
        "The broad employee occupation does not require every civil engineer to hold personal PE registration. Under Singapore's Professional Engineers Act, prescribed civil professional engineering work must be performed by a registered Professional Engineer with a practising certificate or by someone working under that PE's direction or supervision.",
      jobMarketNote:
        "The exact occupational anchor is clean, but CampCareer has not yet normalised recurring 21421 shortage, vacancy, salary or growth evidence into the shared market layer.",
      scoreCaveat:
        "SG v1 scores professional entry and the regulatory burden only. Market demand, salary, growth and occupation-specific visa components remain intentionally zero until common enrichment.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21441 mechanical-engineering occupation kept separate from machinery, HVAC and vehicle engineering specialisms",
      entryPathway:
        "SSOC 21441 directly represents general Mechanical engineer. Industrial machinery/tools engineer 21442, air-conditioning/refrigeration engineer 21443 and transport or vehicle engineering occupations remain outside the primary mapping. Four approved mechanical programmes are direct study pathways.",
      registration:
        "Mechanical engineering is a prescribed branch under the Professional Engineers Act for regulated professional engineering work. Employees can perform such work under a registered PE's direction or supervision, so CampCareer does not mark every mechanical-engineer job as personally PE-licensed.",
      jobMarketNote:
        "Registration requirements are not treated as evidence of labour demand, and exact recurring market measures remain to be added later.",
      scoreCaveat:
        "The foundation score reflects a professional-degree pathway plus the prescribed-work regulatory boundary only. Market and visa signals remain unscored.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21511 electrical-engineering occupation with PE and electrical-work regulation kept as separate legal layers",
      entryPathway:
        "SSOC 2024 maps general Electrical engineer to 21511. Power generation/distribution engineer 21512 and Lift engineer 21513 are distinct occupations. Five approved electrical and electronic engineering programmes are retained as direct academic pathways.",
      registration:
        "Electrical engineering is a prescribed PE branch for regulated professional engineering work, while EMA Licensed Electrical Worker rules apply to defined electrical-work scopes. Those legal regimes do not mean every person employed under SSOC 21511 must personally hold both registrations.",
      jobMarketNote:
        "CampCareer keeps professional-engineering and electrical-work permissions separate from labour-market evidence; market components remain pending.",
      scoreCaveat:
        "Only entry structure and regulatory burden are scored in SG v1. No shortage, vacancy, earnings, growth or visa points are inferred.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21411 manufacturing-engineering occupation inside the broader Industrial and Production Engineers family",
      entryPathway:
        "SSOC 21411 directly identifies Manufacturing engineer and keeps Production engineer 21412, Automation engineer 21413, Quality control/assurance engineer 21414 and Process engineer 21415 as separate occupations. Five reviewed manufacturing, materials and systems programmes are related study routes rather than occupational credentials.",
      registration:
        "Manufacturing engineering is not itself a prescribed PE registration branch. Particular work can cross into regulated civil, electrical, mechanical or chemical professional engineering, but that does not create universal personal registration for the broad manufacturing-engineer role.",
      jobMarketNote:
        "The direct classification is preserved without manufacturing an exact demand series from wider industrial-engineering data.",
      scoreCaveat:
        "The provisional score reflects professional entry accessibility and low universal licensing burden. Market and visa components await later enrichment.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "SG",
    editorial: {
      headline: "An industrial-engineering umbrella because SSOC 2024 has the 2141 unit group but no single five-digit occupation titled Industrial engineer",
      entryPathway:
        "CampCareer represents the canonical scope with non-rollup references to 21411 Manufacturing engineer, 21412 Production engineer, 21414 Quality control/assurance engineer and 21415 Process engineer. Industrial and systems engineering study is relevant; the three approved programmes remain related pathways.",
      registration:
        "Industrial engineering is not a standalone prescribed Professional Engineers Board branch. If actual duties become prescribed civil, electrical, mechanical or chemical professional engineering work, the relevant PE Act supervision or registration requirements apply to that work.",
      jobMarketNote:
        "The four reference occupations are not combined into a fabricated exact Industrial Engineer labour series.",
      scoreCaveat:
        "The foundation score reflects academic accessibility and no universal personal licence. Demand, salary, growth and visa evidence remain unscored.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A general chemical-engineering profile anchored to SSOC 21451, with petroleum and petrochemical variants kept as separate reference scopes",
      entryPathway:
        "The primary general anchor is 21451 Chemical engineer excluding petroleum and petrochemical. SSOC separately identifies 21452 Chemical engineer (petroleum) and 21453 Chemical engineer (petrochemical), which CampCareer retains as non-rollup references. Four reviewed chemical, biomolecular and pharmaceutical engineering programmes are related pathways.",
      registration:
        "Chemical engineering is a prescribed branch of professional engineering work in Singapore. Independent prescribed professional engineering work requires the applicable PE status and practising certificate, while employees may work under a registered PE's direction or supervision.",
      jobMarketNote:
        "General, petroleum and petrochemical classifications stay separate so broader process-industry evidence is not mislabelled as exact 21451 data.",
      scoreCaveat:
        "SG v1 scores the professional entry path and prescribed-work burden only. Current-market and visa components remain zero.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21430 environmental-engineering occupation with project-specific PE boundaries rather than blanket registration",
      entryPathway:
        "SSOC 2024 maps Environmental engineer directly to 21430. Environmental and sustainability engineering programmes provide relevant preparation, and the three reviewed Singapore programmes remain related academic pathways under the staging review.",
      registration:
        "Environmental engineering is not itself one of the Professional Engineers Board's prescribed registration branches. Specific designs or services can nevertheless fall within civil, chemical, electrical or mechanical prescribed engineering work and must then comply with that branch's PE requirements.",
      jobMarketNote:
        "Environmental regulation and compliance obligations are not converted into labour-demand points. Exact recurring market inputs remain pending.",
      scoreCaveat:
        "Only professional entry and low universal licensing burden are represented now. Market, salary, growth and visa evidence remain deferred.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "SG",
    editorial: {
      headline: "A multidisciplinary engineering-technician umbrella across SSOC's discipline-specific 311xx technician occupations",
      entryPathway:
        "SSOC separates Civil engineering technician 31121, Electrical engineering technician 31131, Electronics engineering technician 31141, Mechanical engineering technician 31151, Chemical engineering technician 31161 and Manufacturing engineering technician 31171. Diploma, polytechnic and technical training are typical direct foundations; the seven reviewed university engineering programmes are kept only as related routes.",
      registration:
        "There is no single universal Engineering Technician registration. Particular electrical, lift, building, site, safety or prescribed engineering tasks can impose narrower competency or supervision requirements.",
      jobMarketNote:
        "The six discipline codes remain separate references and are not aggregated into one unsupported exact technician vacancy, salary or shortage series.",
      scoreCaveat:
        "The foundation score recognises accessible technical entry and low universal licensing burden. All comparable market and visa components remain unscored.",
    },
  },
]
