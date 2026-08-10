import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const BRICKLAYER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "bricklayer",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal masonry trade with a national shortage risk and current Express Entry trade-category eligibility",
    entryPathway:
      "Bricklayer is a Red Seal trade mapped directly to NOC 72320. Apprenticeship pathways combine paid workplace experience with technical training, followed by the certification requirements of the relevant province or territory.",
    registration:
      "Trade certification is administered by provincial and territorial authorities and requirements vary by jurisdiction. The Red Seal endorsement provides an interprovincial credential for certified bricklayers who pass the Red Seal examination.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 40.00 per hour and COPS reports about 10,700 workers in 2023. COPS classifies NOC 72320 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72320 wage, employment and shortage evidence. Point-in-time advertised jobs do not earn vacancy intensity or trend points, and no unverified Canada programme link is added.",
  },
}
