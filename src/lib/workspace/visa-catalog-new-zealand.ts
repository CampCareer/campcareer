import type { VisaEntry } from "./visa-catalog"

export const NEW_ZEALAND_VISA_ENTRIES: readonly VisaEntry[] = [
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "Fee Paying Student Visa",
    kind: "Study",
    note: "Full-time study with an approved New Zealand education provider while paying international tuition fees.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/visas/fee-paying-student-visa/",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "English Language Student Visa",
    kind: "Study",
    note: "Full-time English-language study with an approved New Zealand education provider.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/visas/english-language-student-visa/",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "Post Study Work Visa",
    kind: "Work",
    note: "Post-study work rights for eligible graduates of approved New Zealand qualifications.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/visas/post-study-work-visa/",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "Student and Trainee Work Visa",
    kind: "Work",
    note: "Practical work experience linked to eligible study, professional training or a recognised traineeship.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/visas/student-and-trainee-work-visa/",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "Accredited Employer Work Visa",
    kind: "Work",
    note: "Employer-specific work visa for a qualifying full-time job offered by an accredited New Zealand employer.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/visas/accredited-employer-work-visa/",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "Skilled Migrant Category Resident Visa",
    kind: "Skilled",
    note: "Points-based residence pathway for people with qualifying skilled work or a skilled job offer from an accredited employer.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/visas/skilled-migrant-category-resident-visa/",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    name: "Working Holiday",
    kind: "Working holiday",
    note: "Holiday-first youth mobility route with temporary work and short study for eligible partner-country citizens.",
    authority: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/work/working-holiday-visas/who-can-apply-for-a-working-holiday-visa/",
  },
]

export function applyNewZealandVisaCatalog(
  base: readonly VisaEntry[],
): readonly VisaEntry[] {
  return [
    ...base.filter((visa) => visa.countryCode !== "NZ"),
    ...NEW_ZEALAND_VISA_ENTRIES,
  ]
}
