import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 carpentry trade mapped to 71151 Carpenter",
      entryPathway:
        "Singapore's SSOC 2024 separates 71151 Carpenter from 71152 Joiner. Carpentry is primarily a practical trade entered through vocational or employer-based skills development and supervised construction experience rather than a university-only pathway.",
      registration:
        "There is no universal personal occupational licence that every Carpenter must hold before working in Singapore. Construction-site safety, employer competency and project-specific requirements apply separately.",
      jobMarketNote:
        "The SSOC provides a clean five-digit occupation anchor, but CampCareer has not yet normalised an exact recurring 71151 shortage, vacancy, salary or growth series into the common country-comparison model.",
      scoreCaveat:
        "SG v1 credits accessible practical entry and low universal licensing burden only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "electrician",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 74110 Electrician occupation with mandatory EMA Licensed Electrical Worker boundaries",
      entryPathway:
        "Electrician maps directly to SSOC 2024 code 74110. EMA recognises routes based on relevant ITE electrical qualifications plus Singapore practical experience, as well as longer experience-based routes, followed by the required assessment process for an Electrician Licence.",
      registration:
        "EMA states that electrical works must be undertaken or carried out by a Licensed Electrical Worker of the appropriate class. The Electrician Licence authorises specified low-voltage work within its load limits; Electrical Technician and Electrical Engineer licences cover different scopes.",
      jobMarketNote:
        "The statutory licensing boundary is strong evidence about entry requirements, not evidence of labour shortage or hiring demand. Those market components remain unscored in the foundation phase.",
      scoreCaveat:
        "The provisional score recognises a structured technical pathway but applies a high entry-burden discount for mandatory personal licensing. Market and visa evidence is deferred.",
    },
  },
  {
    id: "plumber",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 71261 Plumber occupation with PUB licensing for regulated water-service and sanitary plumbing",
      entryPathway:
        "Plumber maps directly to SSOC 2024 code 71261, while 71262 Pipe fitter and 71263 Pipe/Drain layer remain separate occupations. Entry is strongly practical and technical, with the regulated professional scope governed by PUB's Licensed Plumber framework.",
      registration:
        "PUB requires regulated water-service and sanitary plumbing works to be carried out by Licensed Plumbers, except for defined simple plumbing works that may be performed by handymen. CampCareer therefore treats the canonical Plumber occupation as regulated while preserving that limited exemption.",
      jobMarketNote:
        "The regulatory requirement is not converted into demand credit. Exact shortage, vacancy, earnings and growth evidence remains for the later common enrichment phase.",
      scoreCaveat:
        "SG v1 gives moderate technical-entry credit and a high burden discount for the Licensed Plumber requirement. Market and visa components remain zero.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 71220 Floor/Wall tiler occupation",
      entryPathway:
        "Wall and Floor Tiler maps directly to SSOC 2024 code 71220 Floor/Wall tiler. Entry is predominantly practical through construction-skills training, supervised site experience and demonstrated workmanship.",
      registration:
        "There is no universal personal occupational licence for the broad Floor/Wall Tiler role. Worksite safety and contractor competency requirements remain separate from occupational registration.",
      jobMarketNote:
        "The exact classification is available, but no comparable five-digit market series has yet been normalised into CampCareer SG v1.",
      scoreCaveat:
        "The foundation score reflects practical accessibility and low universal licensing burden only. Market and visa signals remain unscored.",
    },
  },
  {
    id: "welder",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 72120 Welder/Flame cutter trade with process- and project-specific competency requirements",
      entryPathway:
        "Welder maps directly to SSOC 2024 code 72120 Welder/Flame cutter. Practical process training, trade competency and supervised construction, marine or manufacturing experience are central to entry.",
      registration:
        "There is no one universal personal Welder licence covering every welding job in Singapore. Required process qualifications, employer approvals, project specifications and workplace-safety controls can differ by material, process and work environment.",
      jobMarketNote:
        "Construction, marine and manufacturing welding demand is not merged into one fabricated exact occupation market series at foundation stage.",
      scoreCaveat:
        "SG v1 credits practical entry while allowing for process-specific competency burden. Shortage, vacancy, salary, growth and visa components remain unscored.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 71120 Bricklayer/Blocklayer occupation",
      entryPathway:
        "Bricklayer maps directly to SSOC 2024 code 71120 Bricklayer/Blocklayer. The trade is principally learned through practical construction skills training and supervised site experience.",
      registration:
        "There is no universal personal Bricklayer licence for ordinary employment. Construction-site safety and employer or contractor competency requirements apply separately.",
      jobMarketNote:
        "CampCareer keeps the direct SSOC occupation anchor but leaves exact shortage, vacancy, salary and growth evidence unscored until the common market-data phase.",
      scoreCaveat:
        "The provisional score reflects accessible practical entry and low universal licensing burden only.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "SG",
    editorial: {
      headline: "A two-code SSOC air-conditioning and refrigeration technician umbrella covering mechanics and plant installers",
      entryPathway:
        "Singapore does not provide one five-digit SSOC occupation that cleanly covers the full CampCareer HVAC Technician scope. SSOC 71271 covers Air-conditioning/Refrigeration equipment mechanics and 71272 covers Air-conditioning/Refrigeration plant installers, so both are retained as non-rollup references.",
      registration:
        "There is no single universal personal HVAC Technician licence for the whole mechanic/installer umbrella. Particular electrical, pressure-system, refrigerant, workplace-safety or project duties can have narrower competency or licensing requirements.",
      jobMarketNote:
        "Mechanic and installer classifications are deliberately kept separate rather than combined into an unsupported aggregate HVAC labour-market series.",
      scoreCaveat:
        "The multi-code mapping remains provisional. Only technical-entry accessibility and moderate regulatory burden are scored; market and visa components remain zero.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 13230 Construction manager occupation, distinct from BCA builder licensing and designated statutory personnel roles",
      entryPathway:
        "Construction Manager maps directly to SSOC 2024 code 13230. Built-environment, civil-engineering and project-management study can support entry, but management responsibility normally develops through substantial project, site, contractor and commercial experience. Three reviewed Singapore programmes are retained as related study pathways.",
      registration:
        "The broad Construction Manager occupation is not one universally licensed personal profession. BCA's Builders Licensing Scheme applies to builders undertaking prescribed works and requires designated Approved Person and Technical Controller personnel; those appointments and qualifications are not attributed to every construction manager.",
      jobMarketNote:
        "The approved Infrastructure and Project Management, Infrastructure and Systems Engineering and Sustainable Built Environment programmes are related academic pathways only. They do not themselves confer BCA builder licensing or statutory appointment rights.",
      scoreCaveat:
        "SG v1 gives moderate entry credit because management is experience-sensitive. Builder licensing, programme availability and designated personnel requirements are not treated as labour-demand evidence; market and visa components remain unscored.",
    },
  },
]
