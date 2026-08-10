import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const OCCUPATIONAL_THERAPIST_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "occupational-therapist",
  countryCode: "CA",
  editorial: {
    headline: "A regulated rehabilitation profession with a moderate national shortage risk, high median pay and current healthcare-category immigration eligibility",
    entryPathway:
      "The Canadian route is an entry-to-practice occupational therapy degree followed by the registration requirements of the provincial regulator. Internationally educated occupational therapists generally begin with ACOTRO's Substantial Equivalency Assessment System before proceeding through the applicable provincial registration process.",
    registration:
      "Occupational therapy is regulated by provincial regulators in all ten provinces. ACOTRO states that the profession is not regulated in Yukon, the Northwest Territories or Nunavut, so the exact registration pathway depends on where the applicant intends to practise.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 46.00 per hour and COPS reports about 22,700 occupational therapists in 2023. COPS classifies NOC 31203 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 31203 labour and wage evidence. Direct entry-to-practice programmes in the verified Canada catalogue are currently either not yet open for the next international cycle, restricted, or international-ineligible, so no programme link is published in this snapshot.",
  },
}
