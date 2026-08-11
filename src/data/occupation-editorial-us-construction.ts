import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "US",
    editorial: {
      headline: "A large apprenticeship-friendly trade with steady national demand but no occupation-specific visa preference",
      entryPathway:
        "Carpenter maps to SOC 2018 47-2031. BLS says a high school diploma is typical and workers commonly learn on the job or through apprenticeship. Registered apprenticeship opportunities vary by employer, union and state.",
      registration:
        "There is no single nationwide personal carpenter licence. State and local contractor or specialty-trade rules can apply depending on the work and whether the worker is acting as a contractor.",
      jobMarketNote:
        "BLS reports 959,000 carpenter jobs in 2024, a May 2024 median annual wage of $59,310, and 4% projected employment growth for 2024–2034. These are national demand indicators, not a formal U.S. shortage designation.",
      scoreCaveat:
        "Visa credit is intentionally limited: H-2B requires an employer to prove temporary need, while permanent sponsorship normally requires employer-led PERM labor certification. Neither route is automatic for carpenters.",
    },
  },
  {
    id: "electrician",
    countryCode: "US",
    editorial: {
      headline: "Strong projected growth and apprenticeship entry, with licensing determined mainly by state and local law",
      entryPathway:
        "Electrician maps to SOC 2018 47-2111. BLS says most electricians learn through apprenticeship, with technical-school entry also possible.",
      registration:
        "The United States has no single nationwide electrician licence, but BLS says most states require electricians to be licensed. Exact journeyman, master, contractor and specialty requirements must be checked in the work jurisdiction.",
      jobMarketNote:
        "BLS reports 818,700 electrician jobs in 2024, a May 2024 median annual wage of $62,350, and 9% projected growth for 2024–2034.",
      scoreCaveat:
        "High growth is scored through the growth component rather than being relabeled as a national shortage. H-2B and PERM remain employer- and case-specific immigration routes.",
    },
  },
  {
    id: "plumber",
    countryCode: "US",
    editorial: {
      headline: "A licensed-in-many-states apprenticeship trade with solid pay and steady national growth",
      entryPathway:
        "Plumber is constrained to the plumber scope within SOC 2018 47-2152 Plumbers, pipefitters, and steamfitters. BLS says apprenticeship is the usual training route.",
      registration:
        "There is no single nationwide plumbing licence, but BLS says most states require plumbers to be licensed. Requirements and permitted work differ by state and locality.",
      jobMarketNote:
        "BLS reports 504,500 jobs for the combined 47-2152 group in 2024, a May 2024 median annual wage of $62,970, and 4% projected growth for 2024–2034.",
      scoreCaveat:
        "The profile does not treat pipefitter or steamfitter specialty work as identical to the canonical plumber. Immigration access remains conditional on the specific employer route rather than a plumber-specific visa list.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "US",
    editorial: {
      headline: "A low-formal-entry tile trade with the strongest projected growth in the first U.S. construction cohort",
      entryPathway:
        "Wall/Floor Tiler maps to SOC 2018 47-2044 Tile and stone setters. BLS says flooring installers and tile/stone setters typically need no formal educational credential and learn on the job.",
      registration:
        "No single nationwide personal tile-setter licence is recorded. State or local contractor licensing can apply when operating as a contractor or within regulated specialty scopes.",
      jobMarketNote:
        "BLS reports 52,600 Tile and stone setter jobs in 2024, a May 2024 median annual wage of $52,240, and 10% projected growth for 2024–2034.",
      scoreCaveat:
        "The 10% projection receives full U.S. v1 growth credit but is not converted into a formal shortage score. Carpet installers and other floor-layer occupations remain outside this canonical profile.",
    },
  },
  {
    id: "welder",
    countryCode: "US",
    editorial: {
      headline: "A broadly employed technical trade with many replacement openings but modest net employment growth",
      entryPathway:
        "Welder maps to the welder scope of SOC 2018 51-4121 Welders, cutters, solderers, and brazers. BLS describes high school plus technical and on-the-job training as typical, with some employer-based apprenticeships.",
      registration:
        "There is no single nationwide welder licence. BLS notes that some states and localities license welders and that employers or projects may require specific certifications.",
      jobMarketNote:
        "BLS reports 457,300 jobs in the combined 51-4121 occupation in 2024, a May 2024 median annual wage of $51,000, and 2% projected growth for 2024–2034 despite substantial replacement openings.",
      scoreCaveat:
        "Replacement openings are not treated as a shortage finding. Project-specific welding credentials can matter materially even though the broad national profile is not universally licensed.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "US",
    editorial: {
      headline: "An apprenticeship-compatible masonry trade with above-median pay and modest projected growth",
      entryPathway:
        "Bricklayer maps to SOC 2018 47-2021 Brickmasons and blockmasons. BLS says masonry workers generally enter with a high school diploma and learn through apprenticeship or on the job.",
      registration:
        "No single nationwide personal brickmason licence is recorded. Contractor and specialty-trade requirements can vary by state and locality.",
      jobMarketNote:
        "BLS reports 74,100 Brickmason and blockmason jobs in 2024, a May 2024 median annual wage of $60,800, and 3% projected growth for 2024–2034.",
      scoreCaveat:
        "The profile stays specific to brick/block masonry rather than rolling in stonemasons, cement masons or terrazzo workers. Immigration routes remain employer-specific.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "US",
    editorial: {
      headline: "A fast-growing technical trade with a federal refrigerant-certification boundary",
      entryPathway:
        "HVAC Technician maps to SOC 2018 49-9021 Heating, air conditioning, and refrigeration mechanics and installers. BLS says a postsecondary nondegree award is typical, followed by lengthy on-the-job training.",
      registration:
        "There is no single nationwide HVAC occupational licence, but EPA Section 608 certification is federally required for technicians whose maintenance, service, repair or disposal work could release covered refrigerants. State and local licensing may add further requirements.",
      jobMarketNote:
        "BLS reports 425,200 jobs in 2024, a May 2024 median annual wage of $59,810, and 8% projected growth for 2024–2034.",
      scoreCaveat:
        "Section 608 is preserved as a sub-scope federal certification rather than marking every possible HVAC task as nationally licensed. Strong BLS growth is scored directly, not labeled a formal shortage.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "US",
    editorial: {
      headline: "A high-pay, high-growth management occupation with degree-level entry and job-specific professional visa potential",
      entryPathway:
        "Construction Manager maps to SOC 2018 11-9021. BLS says a bachelor's degree is typically needed and management techniques are developed through on-the-job training and construction experience.",
      registration:
        "There is no single nationwide personal construction-manager licence. General-contractor licensing and project-specific requirements vary by state and locality and should not be treated as one federal occupation licence.",
      jobMarketNote:
        "BLS reports 550,300 construction-manager jobs in 2024, a May 2024 median annual wage of $106,980, and 9% projected growth for 2024–2034.",
      scoreCaveat:
        "PERM can support employer-sponsored permanent hiring. H-1B credit is only partial because a specific position must independently qualify as a specialty occupation requiring a bachelor's degree or equivalent in a specific specialty; the BLS typical-entry degree alone does not guarantee H-1B eligibility.",
    },
  },
]
