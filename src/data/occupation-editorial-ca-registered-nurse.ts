import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const REGISTERED_NURSE_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "registered-nurse",
  countryCode: "CA",
  editorial: {
    headline: "A regulated nursing profession with strong national shortage risk, high median wage and current healthcare-category immigration eligibility",
    entryPathway:
      "The standard Canadian route is an approved entry-to-practice nursing degree followed by registration with the nursing regulator in the province or territory of practice. Canada’s current programme catalogue includes direct BScN routes that are verified as available to international students.",
    registration:
      "Registered Nurses are licensed by provincial and territorial nursing regulators. Outside Quebec, RN applicants must pass the NCLEX-RN and meet the additional registration, language and jurisdiction-specific requirements of the regulator where they intend to practise.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 43.27 per hour. COPS reports about 363,100 workers in the NOC 31301 unit group in 2023 and classifies the occupation as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses NOC 31301 evidence, whose official unit group also includes registered psychiatric nurses. Vacancy intensity and trend remain unscored because current Job Bank postings are point-in-time. Programme links are limited to approved direct routes with current international-student availability evidence.",
  },
}
