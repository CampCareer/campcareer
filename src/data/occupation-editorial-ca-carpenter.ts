import type { CountryOccupationEditorial } from "./occupation-editorial-base"
import { ELECTRICIAN_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-electrician"

export type CanadaOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CARPENTER_CA_OCCUPATION_EDITORIAL: CanadaOccupationEditorialOverride = {
  id: "carpenter",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal carpenter trade with a strong national shortage risk and a current Express Entry trade-category pathway",
    entryPathway:
      "The standard route is provincial or territorial apprenticeship training leading to trade certification. NOC 72310 includes apprentices, and qualified carpenters can pursue the Red Seal endorsement after meeting the applicable jurisdictional certification requirements.",
    registration:
      "Trade certification is administered by provinces and territories rather than one national regulator. Carpenter certification is compulsory in Quebec and available voluntarily elsewhere; the Red Seal endorsement supports interprovincial recognition for qualified tradespeople.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 32.12 per hour and COPS reports 132,000 workers in 2023. COPS classifies Carpenters as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72310 national wage and COPS employment/shortage evidence. Current Job Bank posting counts are point-in-time rather than a three-month vacancy series, so vacancy intensity and trend are not scored, and the current Canada course catalogue has no verified carpenter programme link.",
  },
}

export const CANADA_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaOccupationEditorialOverride[] = [
  CARPENTER_CA_OCCUPATION_EDITORIAL,
  ELECTRICIAN_CA_OCCUPATION_EDITORIAL,
]
