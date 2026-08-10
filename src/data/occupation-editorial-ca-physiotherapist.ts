import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const PHYSIOTHERAPIST_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "physiotherapist",
  countryCode: "CA",
  editorial: {
    headline: "A regulated rehabilitation profession with a moderate national shortage risk, high median wage and current healthcare-category immigration eligibility",
    entryPathway:
      "The Canadian route is an accredited entry-to-practice physiotherapy degree followed by the Canadian Physiotherapy Examination and registration with the provincial regulator. Internationally educated physiotherapists generally complete CAPR credentialling before the examination and regulator application.",
    registration:
      "Physiotherapy is regulated provincially. CAPR provides credentialling and the Canadian Physiotherapy Examination on behalf of Canadian physiotherapy regulators outside Quebec; the actual licence is granted by the regulator in the province of practice.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 46.15 per hour and COPS reports about 38,300 physiotherapists in 2023. COPS classifies NOC 31202 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 31202 labour and wage evidence. Current direct entry-to-practice programmes in the verified Canada catalogue are either not yet open for the next international cycle, restricted, or not publicly established as currently available, so no programme link is published in this snapshot.",
  },
}
