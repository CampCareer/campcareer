import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const MEDICAL_LABORATORY_TECHNICIAN_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "medical-laboratory-technician",
  countryCode: "CA",
  editorial: {
    headline: "A medical-laboratory technical occupation with a strong broader-group shortage signal and a shorter college-certificate entry route",
    entryPathway:
      "The canonical occupation maps to NOC 33101 Medical laboratory assistants and related technical occupations, where Medical Laboratory Technician is an official example title. Job Bank states that a college certificate in medical laboratory science is typically required and CSMLS certification is usually required by employers.",
    registration:
      "Job Bank records NOC 33101 as not regulated in Canada. This is distinct from the regulated or higher-qualified Medical Laboratory Technologist pathway; employer certification and competency requirements still apply, and CSMLS certification is commonly requested.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 27.00 per hour. COPS classifies the broader NOC 33101 unit group as facing a strong risk of labour shortage over 2024–2033, but the group includes assistants and other technical occupations beyond the canonical technician title.",
    scoreCaveat:
      "Broader-unit shortage credit is capped at 15 and the broader employment count is not used as a technician-only total. The programme catalogue is filtered to avoid conflating NOC 33101 with Medical Laboratory Technologist NOC 32120; only a scope-aligned approved direct Medical Laboratory Assistant route is linked in this snapshot.",
  },
}
