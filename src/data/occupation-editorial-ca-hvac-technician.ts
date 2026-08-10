import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const HVAC_TECHNICIAN_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "hvac-technician",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal refrigeration and air-conditioning trade with a strong national shortage risk and current Express Entry trade-category eligibility",
    entryPathway:
      "The direct trade route is apprenticeship as a Refrigeration and Air Conditioning Mechanic under NOC 72402, combining paid workplace training with technical instruction before the jurisdictional certification and Red Seal examination requirements are completed.",
    registration:
      "Apprenticeship and trade certification are administered by provinces and territories, with compulsory-certification and licensing rules varying by jurisdiction. Refrigeration and Air Conditioning Mechanic is designated Red Seal across Canada.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 37.50 per hour and COPS reports about 46,100 workers in 2023. COPS classifies NOC 72402 as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72402 wage, employment and shortage evidence. Point-in-time advertised jobs do not earn vacancy intensity or trend credit, and no unverified programme record is linked from the current Canada course catalogue.",
  },
}
