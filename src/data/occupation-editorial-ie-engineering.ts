import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A directly identified shortage profession with exact Critical Skills eligibility",
      entryPathway:
        "Civil Engineer maps to SOC 2010 2121. Degree-level civil engineering is the standard professional route, and Engineers Ireland accreditation is the strongest education signal for Irish engineering formation.",
      registration:
        "Generic Civil Engineer work is not modelled as universally requiring one personal statutory licence. Engineers Ireland registered professional titles such as Chartered Engineer are separate professional-recognition pathways.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies civil engineers as a current construction shortage. SOC 2121 Civil Engineers, including structural and site engineers, is explicitly on the current Critical Skills Occupations List.",
      scoreCaveat:
        "Direct shortage and CSEP access are scored, but no exact occupation-level Irish salary or recurring growth series is fabricated.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A current SOLAS shortage profession with broad Critical Skills eligibility",
      entryPathway:
        "Mechanical Engineer maps directly to SOC 2010 2122. Accredited degree-level mechanical engineering is the standard professional route, followed by employer-based professional development.",
      registration:
        "Engineers Ireland professional titles are valuable competence recognition, but generic Mechanical Engineer employment is not treated as universally dependent on one statutory personal registration.",
      jobMarketNote:
        "SOLAS 2025 directly identifies mechanical engineers as a current science and engineering shortage. SOC 2122 is explicitly included on the current Critical Skills Occupations List.",
      scoreCaveat:
        "The shortage signal is direct. Salary and occupation-specific growth remain unscored until comparable Irish evidence is normalised.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A shortage engineering profession with exact Critical Skills access, distinct from the electrician trade",
      entryPathway:
        "Electrical Engineer maps to SOC 2010 2123 and normally follows degree-level electrical or electronic engineering education. This is a professional engineering profile, not the craft Electrician SOC 5241 route.",
      registration:
        "No universal personal registration is asserted for the broad professional occupation. Restricted electrical contracting and installation rules belong to separate craft/contractor scopes and are not rolled into this profile.",
      jobMarketNote:
        "SOLAS 2025 directly identifies electrical engineers as a current shortage, and SOC 2123 is explicitly included on the current Critical Skills Occupations List.",
      scoreCaveat:
        "Direct shortage and CSEP evidence are scored separately from salary and growth, which remain unscored without exact comparable series.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A production/process engineering role aligned to current shortage evidence but with specialist-dependent CSEP treatment",
      entryPathway:
        "Manufacturing Engineer is constrained to SOC 2010 2127 Production and process engineers. Typical entry is through manufacturing, mechanical, production or related accredited engineering education.",
      registration:
        "The broad occupation is not treated as universally licensed. Engineers Ireland professional titles remain optional professional-recognition pathways unless a specific role imposes additional requirements.",
      jobMarketNote:
        "SOLAS 2025 identifies quality control/assurance, process and design engineers as shortages. The current CSEP list covers SOC 2127 only for specified production/process specialisms or related relevant specialist skills, so generic Manufacturing Engineer is not treated as automatically CSEP-eligible.",
      scoreCaveat:
        "Strong but non-maximal shortage credit and conditional visa credit are used to avoid turning a specialist permit rule into a universal claim.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A process-optimisation engineering scope with strong demand evidence and conditional Critical Skills access",
      entryPathway:
        "Industrial Engineer is represented within SOC 2010 2127 Production and process engineers, focused on process design, systems optimisation, productivity and production engineering.",
      registration:
        "No universal statutory personal registration is asserted for the generic Industrial Engineer occupation. Engineers Ireland titles are professional-recognition credentials rather than a blanket legal licence for all roles.",
      jobMarketNote:
        "SOLAS 2025 reports shortages for process and design engineers. CSEP eligibility within SOC 2127 remains dependent on the listed process, automation, quality, power or related relevant specialist skills.",
      scoreCaveat:
        "The score reflects overlap with direct process-engineering shortage evidence while retaining a conditional, not universal, CSEP assumption.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A process-engineering shortage role explicitly named on Ireland's Critical Skills list",
      entryPathway:
        "For Irish employment-permit classification, Chemical Engineer is explicitly carried under SOC 2010 2127 Production and process engineers. Degree-level chemical or process engineering is the standard route.",
      registration:
        "Generic Chemical Engineer practice is not modelled as universally dependent on a single personal statutory registration. Professional-title and employer competence requirements remain separate.",
      jobMarketNote:
        "SOLAS 2025 identifies process engineers as a shortage, and Chemical Engineer is explicitly named under SOC 2127 on the current Critical Skills Occupations List.",
      scoreCaveat:
        "The shortage score is slightly below the maximum because SOLAS publishes the shortage at process-engineer group level rather than as a separate chemical-engineer count.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A green-transition engineering role kept conservative where exact shortage and CSEP evidence is not published",
      entryPathway:
        "Environmental Engineer is represented conservatively in SOC 2010 2129 Engineering professionals n.e.c. where duties do not resolve to a more specific civil, process or other engineering SOC. Degree routes commonly span environmental, civil and process engineering.",
      registration:
        "Chartered Engineer and Chartered Environmentalist are professional-recognition titles, not treated here as universal legal licences for every environmental-engineering job.",
      jobMarketNote:
        "SOLAS expects sustained engineering demand from the green agenda, but the reviewed 2025 shortage summary does not identify Environmental Engineer as a separate current shortage. Generic Environmental Engineer is also not explicitly named as a CSEP employment under SOC 2129.",
      scoreCaveat:
        "Green-transition narrative is disclosed as context only; it does not generate shortage or growth points without exact occupation evidence.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "IE",
    editorial: {
      headline: "A technical engineering pathway with current technician shortage evidence and accessible Level 6 routes",
      entryPathway:
        "Engineering Technician maps to SOC 2010 3113. Level 6 engineering-technician education is a common route, and the national Civil Engineering Technician Level 6 apprenticeship is one verified structured technician pathway without being treated as the only route for the broad occupation.",
      registration:
        "Engineers Ireland awards the registered professional title Engineering Technician to eligible members, but the broad SOC 3113 occupation is not treated as universally requiring that title as a legal licence to work.",
      jobMarketNote:
        "SOLAS 2025 identifies maintenance/manufacturing/lab technicians as shortages. Because canonical Engineering Technician is broader than those exact shortage scopes, only partial shortage credit is assigned. SOC 3113 is not explicitly on the current Critical Skills list, so ordinary permit accessibility is used where applicable.",
      scoreCaveat:
        "The broader technician title receives limited shortage credit, and no salary or exact growth figures are inferred from group-level engineering evidence.",
    },
  },
]
