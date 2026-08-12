import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "US",
    editorial: {
      headline: "A degree-level environmental science profession with solid pay and steady national growth",
      entryPathway:
        "Environmental Scientist maps directly to SOC 2018 19-2041 Environmental Scientists and Specialists, Including Health. BLS lists a bachelor's degree in environmental science or another natural science as the typical entry route.",
      registration:
        "There is no universal federal occupational licence for environmental scientists. Some employers prefer work-specific certifications, and particular environmental-health or regulated activities can add state or local credentials.",
      jobMarketNote:
        "BLS reports 90,300 jobs in 2024, a May 2024 median annual wage of $80,060, and 4.4% projected growth for 2024–2034.",
      scoreCaveat:
        "BLS growth and replacement openings are treated as demand evidence rather than a federal shortage designation. H-1B/PERM credit remains conditional on the actual degree-specific position and employer filing.",
    },
  },
  {
    id: "agronomist",
    countryCode: "US",
    editorial: {
      headline: "A crop-and-soil science profession mapped to Soil and Plant Scientists, where Agronomist is a current O*NET reported job title",
      entryPathway:
        "Agronomist uses SOC 2018 19-1013 Soil and Plant Scientists. O*NET lists Agronomist among reported titles, and BLS identifies bachelor's-level study in plant science, soil science, agriculture or a related field as the typical entry route.",
      registration:
        "Agronomist is not one universally licensed U.S. occupation. Voluntary agronomy credentials may be employer-valued, while pesticide application or other regulated activities can require separate state credentials.",
      jobMarketNote:
        "BLS reports 20,700 Soil and Plant Scientist jobs in 2024, a 2024 median annual wage of $71,410, and 5.4% projected growth for 2024–2034.",
      scoreCaveat:
        "The national series covers the wider Soil and Plant Scientist occupation, not agronomists alone. O*NET title evidence supports the mapping, but the shared BLS figures remain a broader occupation-level series and do not create shortage status.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "US",
    editorial: {
      headline: "A very large agricultural-management occupation with strong median pay but slightly declining national employment",
      entryPathway:
        "Farm Manager maps to SOC 2018 11-9013 Farmers, Ranchers, and Other Agricultural Managers. BLS lists a high-school diploma plus five years or more of related occupational experience as the typical preparation profile.",
      registration:
        "There is no universal personal Farm Manager licence. Farming businesses and individual activities can still be subject to state and federal rules for pesticides, food safety, environmental protection, animal health and worker safety.",
      jobMarketNote:
        "BLS reports 836,100 jobs in 2024, a May 2024 median annual wage of $87,980, and a 1.3% projected employment decline for 2024–2034.",
      scoreCaveat:
        "Replacement openings are substantial but are not treated as a shortage designation. Generic H-1B fit is weak because BLS does not define this occupation as normally requiring a bachelor's degree in a specific specialty.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "US",
    editorial: {
      headline: "An exact forestry technical occupation with associate-level entry and a modestly declining national projection",
      entryPathway:
        "Forestry Technician maps directly to SOC 2018 19-4071 Forest and Conservation Technicians; O*NET explicitly lists Forestry Technician among reported job titles. BLS reports associate-level entry for the occupation.",
      registration:
        "There is no universal federal technician licence. Field assignments may require employer, agency or state credentials for pesticide use, wildfire work, vehicles, equipment or other specific activities.",
      jobMarketNote:
        "BLS reports 33,800 jobs in 2024, a 2024 median annual wage of $54,310, and a 3.2% projected decline from 2024 to 2034.",
      scoreCaveat:
        "The role is kept at technician level rather than promoted to Forester 19-1032. That preserves the associate-level entry and lower generic H-1B fit reflected in the score.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "US",
    editorial: {
      headline: "A degree-level food science profession with above-median pay and healthy projected growth",
      entryPathway:
        "Food Technologist maps directly to SOC 2018 19-1012 Food Scientists and Technologists; O*NET explicitly lists Food Technologist among reported titles. BLS lists a bachelor's degree in food science or a related agricultural or life-science field as typical entry.",
      registration:
        "Food Technologist is not a universally licensed personal occupation. Employers and facilities remain subject to food-safety, quality and regulatory requirements, with role-specific certifications varying by employer and function.",
      jobMarketNote:
        "BLS reports 15,200 Food Scientist and Technologist jobs in 2024, a May 2024 median annual wage of $85,310, and 6.5% projected growth for 2024–2034.",
      scoreCaveat:
        "O*NET's Bright Outlook and BLS growth are labor-demand signals, not a federal shortage designation. H-1B/PERM eligibility remains specific to the actual job duties, degree relationship and employer filing.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "US",
    editorial: {
      headline: "A current O*NET sustainability occupation using the broader Business Operations Specialists series transparently for national labor metrics",
      entryPathway:
        "Sustainability Specialist is the current O*NET detailed occupation 13-1199.05. Because BLS does not publish a standalone national wage/projection line for 13-1199.05, CampCareer uses parent SOC 13-1199 Business Operations Specialists, All Other as an explicit national metric proxy; BLS lists bachelor's-level entry for that parent.",
      registration:
        "There is no universal statutory Sustainability Specialist licence. Employers may value environmental, energy, carbon, reporting, building or ESG credentials depending on the work.",
      jobMarketNote:
        "The BLS parent 13-1199 series has 1,205,700 jobs in 2024, a 2024 median annual wage of $81,270, and 3.0% projected growth for 2024–2034. These are parent-series metrics, not a count of sustainability specialists alone.",
      scoreCaveat:
        "O*NET identifies Sustainability Specialists as a Bright Outlook occupation, but CampCareer does not turn that signal into a formal shortage score. Parent-series pay, employment and growth are all explicitly labeled proxies.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "US",
    editorial: {
      headline: "A plant-science pathway using Soil and Plant Scientists as a transparent national proxy for professional horticulture work",
      entryPathway:
        "Horticulturist uses SOC 2018 19-1013 Soil and Plant Scientists as the closest professional national scope. O*NET lists Horticulture Specialist among reported titles and explicitly covers trees, shrubs, nursery stock, crop production and plant growth; bachelor's-level preparation is typical.",
      registration:
        "There is no universal personal Horticulturist licence. Pesticide application and some nursery, plant-health or regulated commercial activities can require state or activity-specific credentials.",
      jobMarketNote:
        "The Soil and Plant Scientists proxy reports 20,700 jobs in 2024, a 2024 median annual wage of $71,410, and 5.4% projected growth for 2024–2034.",
      scoreCaveat:
        "This mapping is deliberately restricted to professional/scientific horticulture rather than landscaping or general nursery labor. The BLS figures are a declared proxy and do not establish horticulturist-specific shortage status.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "US",
    editorial: {
      headline: "An agricultural research-technician pathway with direct animal-research duties but broader Agricultural Technician national metrics",
      entryPathway:
        "Animal Science Technician uses SOC 2018 19-4012 Agricultural Technicians as a declared proxy. O*NET states that these technicians assist with animal breeding and nutrition, collect animal samples and support agricultural scientists; BLS lists associate-level entry as typical.",
      registration:
        "There is no universal occupational licence for Agricultural or Animal Science Technicians. Laboratory, animal-welfare, pesticide, biosecurity or institutional research requirements may add training or activity-specific controls.",
      jobMarketNote:
        "BLS reports 18,600 Agricultural Technician jobs in 2024, a May 2024 median annual wage of $46,790, and 4.3% projected growth for 2024–2034.",
      scoreCaveat:
        "The national BLS series includes plant and other agricultural technician work as well as animal research, so the metrics are not an animal-only census. Associate-level entry also makes generic H-1B specialty-occupation fit weak.",
    },
  },
]
