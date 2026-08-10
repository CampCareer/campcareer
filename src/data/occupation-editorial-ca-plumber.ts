import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const PLUMBER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "plumber",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal plumbing trade with a national shortage risk and current Express Entry trade-category eligibility",
    entryPathway:
      "The standard route is a provincial or territorial plumbing apprenticeship combining paid workplace training with technical training, followed by the certification requirements that apply in the jurisdiction. Plumber is a Red Seal trade mapped directly to NOC 72300.",
    registration:
      "Plumbing certification is administered by provincial and territorial apprenticeship and trade authorities, and compulsory-certification rules vary by jurisdiction. The Red Seal endorsement supports mobility for certified plumbers who pass the interprovincial examination.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 34.00 per hour and COPS reports about 59,900 workers in 2023. COPS classifies NOC 72300 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72300 wage, employment and shortage evidence. Point-in-time Job Bank postings are not converted into vacancy intensity or trend, and no Canada programme link is created without a verified course record.",
  },
}
