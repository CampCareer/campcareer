import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "US",
    editorial: {
      headline: "A large infrastructure profession with solid national growth and state PE licensure at public-practice boundaries",
      entryPathway:
        "Civil Engineer maps to SOC 2018 17-2051. BLS says a bachelor's degree in civil engineering or a related field is the typical entry route.",
      registration:
        "Licensure is not required for entry-level civil engineering, but state-issued Professional Engineer licensure is typically required when providing engineering services directly to the public or signing regulated work.",
      jobMarketNote:
        "BLS reports 368,900 civil-engineer jobs in 2024, a May 2024 median annual wage of $99,590, and 5% projected employment growth for 2024–2034.",
      scoreCaveat:
        "Infrastructure demand and replacement openings are not treated as a federal shortage designation. H-1B and PERM credit remains conditional on the specific employer filing, degree relationship and any required state licence.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "US",
    editorial: {
      headline: "A broad engineering profession with strong automation-driven growth and conditional professional-visa fit",
      entryPathway:
        "Mechanical Engineer maps to SOC 2018 17-2141. BLS describes a bachelor's degree in mechanical engineering or mechanical engineering technology as typical.",
      registration:
        "Entry-level mechanical engineering does not universally require licensure, but all states and the District of Columbia require licensure for engineers who sell professional engineering services to the public.",
      jobMarketNote:
        "BLS reports 293,100 mechanical-engineer jobs in 2024, a May 2024 median annual wage of $102,320, and 9% projected growth for 2024–2034.",
      scoreCaveat:
        "Strong growth is scored directly rather than relabeled as shortage. H-1B requires the specific position to qualify as a specialty occupation, while PERM remains employer and labor-certification based.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "US",
    editorial: {
      headline: "A high-pay engineering profession spanning power, controls and infrastructure with healthy projected growth",
      entryPathway:
        "Electrical Engineer maps specifically to SOC 2018 17-2071, separate from Electronics Engineers, Except Computer 17-2072. A related engineering bachelor's degree is the normal entry route.",
      registration:
        "There is no single federal engineering licence. State PE licensure can be required for regulated public-practice work, while many private-industry entry roles do not require a PE licence.",
      jobMarketNote:
        "BLS reports 192,000 electrical-engineer jobs in 2024, a May 2024 median annual wage of $111,910, and 7% projected growth for 2024–2034.",
      scoreCaveat:
        "The profile does not combine electronics-engineer employment or pay into the canonical Electrical Engineer. Immigration access remains job-specific rather than occupation-guaranteed.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "US",
    editorial: {
      headline: "A bright-outlook manufacturing systems specialty using an explicit Industrial Engineer parent-series proxy",
      entryPathway:
        "Manufacturing Engineer uses O*NET 17-2112.03, nested under the Industrial Engineers family. O*NET describes the role as designing, integrating or improving manufacturing systems and processes.",
      registration:
        "There is no universal federal manufacturing-engineer licence. State PE rules may apply when the work crosses regulated professional-engineering practice boundaries.",
      jobMarketNote:
        "Because BLS does not publish a separate national wage/projection series for O*NET 17-2112.03, this profile explicitly uses parent SOC 17-2112 Industrial Engineers: 351,100 jobs in 2024, $101,140 median annual wage, and 11% projected growth for 2024–2034.",
      scoreCaveat:
        "Industrial Engineer metrics are a declared proxy, not an exact census of Manufacturing Engineer titles. H-1B and PERM remain conditional on the actual job and employer filing.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "US",
    editorial: {
      headline: "A fast-growing production and systems profession benefiting from automation, efficiency and supply-chain demand",
      entryPathway:
        "Industrial Engineer maps to SOC 2018 17-2112. BLS says a bachelor's degree in industrial engineering or a related engineering field is typical.",
      registration:
        "No universal personal licence is required across all industrial-engineering employment. State PE rules can apply to regulated professional services or work requiring signed engineering responsibility.",
      jobMarketNote:
        "BLS reports 351,100 industrial-engineer jobs in 2024, a May 2024 median annual wage of $101,140, and 11% projected growth for 2024–2034.",
      scoreCaveat:
        "The strong 11% projection receives maximum U.S. v1 growth credit but does not create formal shortage status. Immigration routes remain filing-specific.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "US",
    editorial: {
      headline: "A smaller high-pay process-engineering profession with modest net growth and specialized degree entry",
      entryPathway:
        "Chemical Engineer maps to SOC 2018 17-2041. BLS says a bachelor's degree in chemical engineering or a related field is typically required.",
      registration:
        "There is no single federal licence for every chemical-engineering job. State PE licensure can matter when the engineer provides regulated professional services to the public.",
      jobMarketNote:
        "BLS reports 21,600 chemical-engineer jobs in 2024, a May 2024 median annual wage of $121,860, and 3% projected growth for 2024–2034.",
      scoreCaveat:
        "High salary is not treated as shortage evidence. H-1B and PERM may fit degree-specific professional roles only when the specific filing satisfies federal requirements.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "US",
    editorial: {
      headline: "A licensed-at-public-practice-boundaries environmental profession with above-$100k median pay and steady growth",
      entryPathway:
        "Environmental Engineer maps to SOC 2018 17-2081. BLS identifies environmental engineering or a related civil, chemical or general engineering bachelor's degree as the typical pathway.",
      registration:
        "Entry roles do not universally require a PE licence, but state professional-engineering rules may apply to public-practice, signoff and other regulated engineering responsibilities.",
      jobMarketNote:
        "BLS reports 39,400 environmental-engineer jobs in 2024, a May 2024 median annual wage of $104,170, and 4% projected growth for 2024–2034.",
      scoreCaveat:
        "Environmental-policy demand is not converted into shortage status. Immigration access remains tied to the specific employer, role and degree requirements.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "US",
    editorial: {
      headline: "A broad associate-degree technician pathway using the BLS all-other engineering-technologist series as a declared proxy",
      entryPathway:
        "The canonical Engineering Technician is broader than one discipline. This profile uses SOC 2018 17-3029 Engineering Technologists and Technicians, Except Drafters, All Other as a broad national proxy; BLS assigns associate-degree entry to that series.",
      registration:
        "There is no single nationwide engineering-technician licence. Employer certifications and project-specific requirements may apply, while PE licensure is a professional-engineer boundary rather than a generic technician requirement.",
      jobMarketNote:
        "BLS reports 67,300 jobs in the 17-3029 proxy in 2024, a 2024 median annual wage of $77,390, and 1.5% projected growth for 2024–2034.",
      scoreCaveat:
        "The 17-3029 series is intentionally treated as a broad proxy and does not represent every civil, electrical, mechanical or industrial technician. H-1B credit is limited because the proxy normally has associate-degree entry.",
    },
  },
]
