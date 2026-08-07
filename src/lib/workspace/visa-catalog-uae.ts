import type { VisaEntry } from "./visa-catalog"

export const UAE_VISA_ENTRIES: readonly VisaEntry[] = [
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    name: "Student residence visa",
    kind: "Study",
    note: "University- or parent-sponsored residence for study at an accredited UAE institution.",
    authority: "Federal Authority for Identity, Citizenship, Customs & Port Security",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-studying-in-the-uae",
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    name: "Jobseeker visit visa",
    kind: "Temporary",
    note: "Sponsor-free single-entry visit of 60, 90 or 120 days for eligible graduates and skilled professionals to explore jobs.",
    authority: "Federal Authority for Identity, Citizenship, Customs & Port Security",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/visit-visas/jobseeker-visit-visa",
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    name: "Standard employer-sponsored work residence",
    kind: "Work",
    note: "Two-year renewable employment residence initiated by a qualifying UAE employer.",
    authority: "Ministry of Human Resources and Emiratisation",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-working-in-the-uae",
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    name: "Green Residence for skilled employees",
    kind: "Skilled",
    note: "Renewable five-year self-sponsored residence for eligible skill-level 1–3 employees.",
    authority: "Federal Authority for Identity, Citizenship, Customs & Port Security",
    url: "https://icp.gov.ae/en/uae-green-residency/",
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    name: "Golden Residence for outstanding students and graduates",
    kind: "Skilled",
    note: "Five- or ten-year self-sponsored residence for qualifying high-achieving school and university students or recent graduates.",
    authority: "Federal Authority for Identity, Citizenship, Customs & Port Security",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    name: "Student training and employment permit",
    kind: "Work",
    note: "Three-month training or holiday-employment permit for eligible students already holding UAE residence.",
    authority: "Ministry of Human Resources and Emiratisation",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/job-offers-and-work-permits-and-contracts/work-permits",
  },
]

export function applyUaeVisaCatalog(
  base: readonly VisaEntry[],
): readonly VisaEntry[] {
  return [
    ...base.filter((visa) => visa.countryCode !== "AE"),
    ...UAE_VISA_ENTRIES,
  ]
}
