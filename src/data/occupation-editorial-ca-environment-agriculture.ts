import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaEnvironmentAgricultureOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_ENVIRONMENT_AGRICULTURE_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaEnvironmentAgricultureOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "CA",
    editorial: {
      headline: "A science-heavy environmental career with strong pay and study options, but a balanced national outlook and no current occupation-category immigration credit",
      entryPathway:
        "Environmental Scientist is represented conservatively through the environmental-biologist science scope within NOC 21110 Biologists and related scientists. Job Bank indicates university study is normally required, with advanced degrees commonly expected for research-scientist roles.",
      registration:
        "There is no single Canada-wide environmental-scientist licence. The biology profession is regulated in Alberta and British Columbia, while requirements elsewhere depend on the exact scientific role, employer and protected professional title.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.00 per hour for Environmental Biologist. COPS classifies the broader NOC 21110 group as balanced over 2024–2033.",
      scoreCaveat:
        "The canonical title is broader than the specific Environmental Biologist Job Bank title used for pay evidence, so the broader NOC employment total is not presented as an Environmental Scientist-only count. No shortage or current Express Entry occupation-category credit is awarded.",
    },
  },
  {
    id: "agronomist",
    countryCode: "CA",
    editorial: {
      headline: "A regulated agricultural science profession with high median pay, balanced national supply and a clear agronomy study pathway",
      entryPathway:
        "Agronomist is an official title within NOC 21112 Agricultural representatives, consultants and specialists. Job Bank states that a bachelor's or master's degree in agriculture or a related science is required.",
      registration:
        "Membership or eligibility for membership in a provincial institute of agrology is usually required, and Quebec requires membership in the Ordre des agronomes du Québec. Regulatory requirements therefore need to be checked for the province where the applicant intends to practise.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.00 per hour. COPS classifies NOC 21112 as balanced nationally over 2024–2033.",
      scoreCaveat:
        "Agronomist is a narrower title inside NOC 21112, so the broader employment total is not treated as an agronomist-only count. No shortage or current Express Entry occupation-category credit is awarded, and programme links are marked conservatively when they do not by themselves satisfy the usual bachelor's-level entry requirement.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "CA",
    editorial: {
      headline: "A large agriculture-management occupation with practical entry routes and a balanced national outlook, but no current category-based immigration bonus",
      entryPathway:
        "Farm Manager maps to NOC 80020 Managers in agriculture. Job Bank describes this as a management occupation in which workers plan and direct farm operations, crop or livestock production, marketing and technology adoption. Formal education varies widely and substantial farm experience is common.",
      registration:
        "Farm Manager is not treated as a nationally licensed occupation. Requirements depend mainly on the farm type, ownership model, production system and employer rather than a universal professional regulator.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 30.00 per hour and COPS reports 122,400 workers in 2023. The national 2024–2033 outlook is balance.",
      scoreCaveat:
        "The score uses the exact NOC 80020 national wage and COPS employment evidence. No shortage or current Express Entry occupation-category credit is awarded, and Agribusiness study is treated as a related pathway rather than a guaranteed Farm Manager qualification.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "CA",
    editorial: {
      headline: "A regulated forestry-technology pathway with a direct college route and solid median pay, while national long-term demand remains balanced",
      entryPathway:
        "Forestry Technician maps directly to NOC 22112 Forestry technologists and technicians. A one- to three-year forestry technology, renewable-resources or forest-ranger college program is normally required.",
      registration:
        "NOC guidance states that registration with a regulatory body is required for forestry technologists or technicians in all provinces except Prince Edward Island and Manitoba, with additional scaler licensing required for some positions.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 32.97 per hour and COPS reports 6,200 workers in 2023. The national 2024–2033 outlook is balance.",
      scoreCaveat:
        "The profile receives no shortage or current Express Entry occupation-category points. Registration requirements lower entry accessibility relative to unregulated technician roles, while the verified Forestry Technician diploma provides a direct study route.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "CA",
    editorial: {
      headline: "A food-science technology role with an aligned diploma route and moderate pay, but a balanced national labour outlook",
      entryPathway:
        "Food Technologist is an official title within NOC 22100 Chemical technologists and technicians. Job Bank normally expects a college program in chemical, biochemical, food or closely related technology, depending on the role.",
      registration:
        "National certification is available and provincial engineering or applied-science technologist certification may be required by employers. The broader NOC is regulated in Alberta and Quebec, so applicants should verify title and practice rules in the destination province.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 29.80 per hour for Food Technologist. COPS classifies NOC 22100 as balanced over 2024–2033.",
      scoreCaveat:
        "Food Technologist is narrower than all of NOC 22100, so the broader employment total is not presented as food-technologist-only. No shortage or current Express Entry occupation-category credit is awarded.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "CA",
    editorial: {
      headline: "A high-paying sustainability policy and consulting role with strong study options, but balanced national supply and no current occupation-category visa credit",
      entryPathway:
        "Sustainability Specialist is an official title in NOC 41400 Natural and applied science policy researchers, consultants and program officers. Job Bank normally expects a bachelor's degree or college diploma in a related scientific or technical discipline, and some roles may prefer graduate study.",
      registration:
        "Job Bank does not treat Sustainability Specialist itself as a regulated occupation in Canada. Certain specialized duties inside the broader NOC can carry separate professional certification requirements, but there is no single sustainability licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 43.27 per hour. COPS classifies the broader NOC 41400 group as balanced nationally over 2024–2033.",
      scoreCaveat:
        "The canonical title is narrower than the full policy-and-program-officer NOC, so the broader employment total is not presented as sustainability-specialist-only. No shortage or current Express Entry occupation-category credit is awarded; the selected sustainability programme is published as related rather than a guaranteed occupational credential.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "CA",
    editorial: {
      headline: "A practical horticulture career with a direct technician route and optional Red Seal pathway, while national labour supply remains balanced",
      entryPathway:
        "Horticulturist is an official title within NOC 22114 Landscape and horticulture technicians and specialists. A two- to three-year college program in horticulture, agronomy, arboriculture, landscaping or related technology is usually required, and apprenticeship routes are available.",
      registration:
        "Landscape Horticulturist trade certification is available voluntarily across provinces, with Red Seal endorsement available to qualified workers. Some provinces regulate specific horticulture, arborist or professional-technologist titles, and pesticide licences may be required for certain duties.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 30.00 per hour for Horticulturist. COPS reports the broader NOC 22114 group as balanced over 2024–2033.",
      scoreCaveat:
        "Because Horticulturist is one title within broader NOC 22114, the broader employment total is not presented as horticulturist-only. No shortage or current Express Entry occupation-category credit is awarded.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "CA",
    editorial: {
      headline: "An animal-health technician pathway with a moderate national shortage and current Healthcare-category immigration eligibility",
      entryPathway:
        "The CampCareer Animal Science Technician intent is anchored to its canonical animal-health-technician alias and maps to NOC 32104 Animal health technologists and veterinary technicians. A two- or three-year animal health or veterinary technology college program is required.",
      registration:
        "A national registration examination may be required in some employment settings. Registration with provincial animal-health-technologist or veterinary-technician associations is available and mandatory in some provinces.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 23.00 per hour and COPS reports 25,800 workers in 2023. COPS classifies NOC 32104 as facing a moderate risk of labour shortage over 2024–2033.",
      scoreCaveat:
        "The score uses the animal-health-technician interpretation of the canonical role, not general animal-care or farm-labour occupations. NOC 32104 is in the current Express Entry Healthcare and social services category, while salary remains modest relative to the other careers in this cohort.",
    },
  },
]
