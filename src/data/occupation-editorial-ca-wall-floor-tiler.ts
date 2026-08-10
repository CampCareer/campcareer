import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const WALL_FLOOR_TILER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "wall-floor-tiler",
  countryCode: "CA",
  editorial: {
    headline: "An exact NOC Tilesetter and Red Seal trade, but without a current national shortage or Express Entry trade-category signal",
    entryPathway:
      "Tilesetter is a Red Seal trade under NOC 73101. Apprenticeship and trade-certification pathways are administered by participating provinces and territories, combining workplace experience with technical training before certification and the optional Red Seal endorsement.",
    registration:
      "Certification rules vary by jurisdiction and the Red Seal designation is not administered as a single national licence. Applicants should check the apprenticeship and certification authority for the province or territory where they plan to train or work.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 34.76 per hour and COPS reports about 10,100 workers in 2023. COPS projects national labour demand and supply for NOC 73101 to remain broadly balanced over 2024–2033.",
    scoreCaveat:
      "No shortage or visa credit is awarded: COPS shows national balance and NOC 73101 is not in the current Express Entry trade-category list. Vacancy metrics remain unscored because current Job Bank postings are point-in-time, and no verified Canada course record is available in courses_ca.",
  },
}
