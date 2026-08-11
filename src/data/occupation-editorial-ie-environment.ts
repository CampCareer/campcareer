import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "IE",
    editorial: {
      headline: "An environmental-science career with green-transition demand context but no inferred exact shortage",
      entryPathway:
        "Environmental Scientist is mapped to SOC 2010 2142 Environment professionals and constrained to environmental-science work. Degree-level environmental science or a related natural-science route is common, followed by field, laboratory, consulting, regulatory or environmental-management experience.",
      registration:
        "No universal statutory personal registration is required for the broad Environmental Scientist occupation in Ireland.",
      jobMarketNote:
        "SOLAS 2025 expects the green agenda to sustain demand for scientists and engineers, but the reviewed public summary does not publish an exact Environmental Scientist shortage. SOC 2142 is not explicitly on the current Critical Skills list and is not treated as ineligible, so ordinary General Employment Permit access may apply subject to current conditions.",
      scoreCaveat:
        "Green-transition demand is contextual only and is not converted into occupation-specific shortage or growth points. Exact comparable salary and recurring vacancy series remain unscored.",
    },
  },
  {
    id: "agronomist",
    countryCode: "IE",
    editorial: {
      headline: "An exact Critical Skills agronomy role added to Ireland's 2026 occupations list",
      entryPathway:
        "Agronomist is mapped to SOC 2010 2112 Biological scientists and biochemists, using the exact Agronomist employment named in the current permit list. Agricultural science, crop science, soil science or related degree study plus applied advisory, research or production experience is the typical professional route.",
      registration:
        "No universal statutory personal registration is required for the broad Agronomist occupation.",
      jobMarketNote:
        "Agronomist was added to the Critical Skills Occupations List in the 2026 employment-permit occupations review and is explicitly named under SOC 2112 on the list effective 13 May 2026.",
      scoreCaveat:
        "The direct shortage and visa signals apply to the exact Agronomist employment. Broader biological-scientist or food-manufacturing specialisms are not substituted into this profile, and salary/vacancy/growth remain unscored without comparable occupation-level evidence.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "IE",
    editorial: {
      headline: "A professional farm-management scope with a current Level 7 apprenticeship and ordinary permit access",
      entryPathway:
        "Farm Manager maps to SOC 2010 1211 Managers and proprietors in agriculture and horticulture, restricted to genuine management duties. Teagasc's current Level 7 Farm Manager Apprenticeship provides a two-year earn-while-you-learn route through a SOLAS-approved employer.",
      registration:
        "No universal statutory personal registration is required for the broad Farm Manager occupation.",
      jobMarketNote:
        "SOLAS 2025 reports low recent employment growth across Agriculture and Animal Care and does not publish an exact Farm Manager shortage. The managerial SOC 1211 scope is kept separate from hands-on Farmers SOC 5111, which is on the current Ineligible List except Pig Manager.",
      scoreCaveat:
        "The structured apprenticeship improves entry accessibility, but no shortage, salary or growth signal is inferred. Permit treatment is based on the managerial scope rather than the ineligible hands-on farmer code.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "IE",
    editorial: {
      headline: "A practical forestry-technician profile tied to the explicit speciality harvesting permit exception",
      entryPathway:
        "Forestry Technician is centred on the skilled SOC 2010 5119 speciality forestry harvesting technician scope. Teagasc recommends the Level 5 Certificate in Forestry followed by the Level 6 Advanced Certificate in Forestry for practical forestry employment and supervisory progression.",
      registration:
        "No universal statutory personal registration is required for this practical technician scope.",
      jobMarketNote:
        "SOC 5119 is generally on the current Ineligible List, but speciality forestry harvesting technician is an explicit exception. That exact exception can support ordinary permit access; generic forestry work is not assumed eligible.",
      scoreCaveat:
        "Professional Forester under SOC 1213 is a separate Critical Skills employment and is not borrowed by the canonical Forestry Technician. No exact current forestry-technician shortage, salary or growth series is inferred.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "IE",
    editorial: {
      headline: "A SOC 2129 food-technology scope that does not borrow scientist-only Critical Skills treatment",
      entryPathway:
        "Food Technologist is mapped to SOC 2010 2129 Engineering professionals n.e.c., Food Technologist scope. Degree-level food science, food technology, process, quality or related study plus manufacturing experience is a common route.",
      registration:
        "No universal statutory personal registration is required for the broad Food Technologist occupation; employer and food-safety compliance duties remain separate from personal occupational licensing.",
      jobMarketNote:
        "SOLAS reports science and engineering skills demand, but the reviewed summary does not identify an exact Food Technologist shortage. The current Critical Skills list covers specified SOC 2112 food-manufacturing biological scientists and selected SOC 2129 employments, but does not name generic Food Technologist.",
      scoreCaveat:
        "Food Technologist is not silently reclassified as a SOC 2112 manufacturing scientist to obtain Critical Skills credit. Exact salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "IE",
    editorial: {
      headline: "A broad sustainability role where green-economy demand remains context rather than fabricated shortage",
      entryPathway:
        "Sustainability Specialist is mapped to SOC 2010 2142 Environment professionals. Common routes combine sustainability, environmental science, engineering, business or policy study with applied ESG, resource-efficiency, carbon, circular-economy or environmental-management experience.",
      registration:
        "No universal statutory personal registration is required for the broad Sustainability Specialist occupation.",
      jobMarketNote:
        "SOLAS expects continued green-agenda demand for science and engineering capability, but the reviewed public evidence does not publish an exact Sustainability Specialist shortage. SOC 2142 is not explicitly on the current Critical Skills list.",
      scoreCaveat:
        "Broad green-transition demand is not converted into shortage or growth points, and the profile is not promoted into an engineer, Professional Forester or other Critical Skills code without matching duties.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "IE",
    editorial: {
      headline: "An accessible practical horticulture pathway whose current permit status remains ineligible",
      entryPathway:
        "Horticulturist is deliberately constrained to SOC 2010 5112 Horticultural trades. Teagasc offers a current NFQ Level 6 Horticulturist Apprenticeship plus Level 5 and Level 6 horticulture programmes covering nursery, landscape, food-production and related practical fields.",
      registration:
        "No universal statutory personal registration is required for the broad practical Horticulturist occupation.",
      jobMarketNote:
        "SOC 5112 Horticultural trades is on the current Ineligible List effective 13 May 2026. SOLAS reports job churn within Agriculture and Animal Care but almost no employment growth since 2023 and no exact Horticulturist shortage in the reviewed summary.",
      scoreCaveat:
        "The strong structured entry route does not override current permit ineligibility. The practical canonical occupation is not promoted to a professional biological-scientist classification merely to obtain a different immigration outcome.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "IE",
    editorial: {
      headline: "A laboratory animal-science technician scope with partial credit from the wider lab-technician shortage",
      entryPathway:
        "Animal Science Technician is mapped to SOC 2010 3111 Laboratory technicians and constrained to non-clinical animal-science or laboratory-animal technical work. SOLAS's Laboratory Assistant traineeship is retained as a related technical route rather than labelled an exact Animal Science Technician apprenticeship.",
      registration:
        "No universal statutory personal registration is required for this non-clinical technical scope. Veterinary nursing and other regulated clinical occupations remain separate.",
      jobMarketNote:
        "SOLAS 2025 directly identifies lab technicians among Science and Engineering shortages. Because Animal Science Technician is narrower than the published lab-technician group, the opportunity model uses only partial shortage credit.",
      scoreCaveat:
        "General animal care, veterinary nursing and farm-worker roles are excluded. The wider lab-technician shortage is deliberately discounted, while exact salary, vacancy and growth series remain unscored.",
    },
  },
]
