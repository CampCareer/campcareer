import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const CONSTRUCTION_MANAGER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "construction-manager",
  countryCode: "CA",
  editorial: {
    headline: "An exact NOC construction-management occupation with a national shortage risk, high median wage and current Express Entry trade-category eligibility",
    entryPathway:
      "NOC 70010 generally requires a university degree in civil engineering or a college diploma in construction technology plus several years of construction-industry experience, including supervisory or field experience. It is therefore not treated as a direct apprenticeship-entry occupation.",
    registration:
      "There is no single national Construction Manager occupational licence. Employers or projects may require professional engineering registration, trade certification, safety credentials or other jurisdiction-specific qualifications depending on the manager's responsibilities.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 48.72 per hour and COPS reports about 108,900 workers in 2023. COPS classifies NOC 70010 as facing a moderate risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 70010 wage, employment and shortage evidence and current IRCC trade-category eligibility. Entry-level credit is low because substantial prior construction experience is normally required; point-in-time advertised jobs are not converted into vacancy intensity or trend scores.",
  },
}
