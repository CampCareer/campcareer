import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const WELDER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "welder",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal welding trade with a national shortage risk and current Express Entry trade-category eligibility",
    entryPathway:
      "Welder is a Red Seal trade mapped to NOC 72106. Apprenticeship and trade-certification pathways combine workplace training with technical instruction, while experienced workers may qualify through jurisdictional trade-qualification routes where available.",
    registration:
      "Trade certification is administered by provinces and territories and requirements vary by jurisdiction and work setting. The Red Seal endorsement provides an interprovincial credential for certified welders who pass the Red Seal examination.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 30.00 per hour and COPS reports about 90,900 workers in 2023. COPS classifies NOC 72106 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72106 wage, employment and shortage evidence. Point-in-time Job Bank listings do not earn vacancy intensity or trend points, employer diversity is not inferred, and no programme link is fabricated from the current Canada course catalogue.",
  },
}
