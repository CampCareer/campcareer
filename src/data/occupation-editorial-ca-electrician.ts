import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const ELECTRICIAN_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "electrician",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal construction-electrician trade with a national shortage risk and current Express Entry trade-category eligibility",
    entryPathway:
      "The standard route is a provincial or territorial construction-electrician apprenticeship combining paid workplace training with technical training, followed by the certification requirements that apply in the jurisdiction. The Red Seal trade maps directly to NOC 72200.",
    registration:
      "Electrical trade certification and licensing are administered by provinces and territories, and the permitted scope and compulsory-certification rules vary by jurisdiction. Construction Electrician is designated Red Seal across Canada, supporting interprovincial recognition after certification and the Red Seal examination.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 35.00 per hour and COPS reports about 119,300 workers in 2023. COPS classifies NOC 72200 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72200 wage, employment and shortage evidence. Current Job Bank advertised-job counts are not treated as a three-month vacancy series, employer diversity is not inferred from listings, and no Canada programme link is added without a verified course record.",
  },
}
