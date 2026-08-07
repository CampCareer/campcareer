import type { VisaEntry } from "./visa-catalog"

export const SWITZERLAND_VISA_ENTRIES: readonly VisaEntry[] = [
  {
    country: "Switzerland",
    countryCode: "CH",
    name: "Study residence permit",
    kind: "Study",
    note: "Residence for recognised education with canton-led financial, insurance and accommodation checks.",
    authority: "State Secretariat for Migration",
    url: "https://www.sem.admin.ch/sem/en/home/themen/fza_schweiz-eu-efta/eu-efta_buerger_schweiz/faq.html",
  },
  {
    country: "Switzerland",
    countryCode: "CH",
    name: "Swiss graduate job-search period",
    kind: "Temporary",
    note: "Six months for eligible third-country graduates of recognised Swiss higher education to seek qualification-matched work.",
    authority: "State Secretariat for Migration",
    url: "https://www.sem.admin.ch/sem/en/home/themen/arbeit/faq.0006.html",
  },
  {
    country: "Switzerland",
    countryCode: "CH",
    name: "Non-EU/EFTA highly qualified worker",
    kind: "Skilled",
    note: "Employer-led and quota-limited admission for highly qualified third-country managers, specialists and professionals.",
    authority: "State Secretariat for Migration",
    url: "https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige.html",
  },
  {
    country: "Switzerland",
    countryCode: "CH",
    name: "EU/EFTA employment mobility",
    kind: "Work",
    note: "Free-movement route for EU/EFTA nationals with notification, L-permit or B-permit rules based on contract length.",
    authority: "State Secretariat for Migration",
    url: "https://www.sem.admin.ch/sem/en/home/overview-arbeit.html",
  },
  {
    country: "Switzerland",
    countryCode: "CH",
    name: "Young Professionals permit",
    kind: "Work",
    note: "Up to 18 months of full-time, field-related professional development for eligible partner-country nationals.",
    authority: "State Secretariat for Migration",
    url: "https://www.sem.admin.ch/sem/en/home/themen/arbeit/berufspraktikum.html",
  },
  {
    country: "Switzerland",
    countryCode: "CH",
    name: "Third-country au pair permit",
    kind: "Temporary",
    note: "Maximum 12-month language and cultural placement for eligible 18–25-year-olds through a recognised Swiss agency.",
    authority: "State Secretariat for Migration",
    url: "https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige/grundlagen_zur_arbeitsmarktzulassung.html",
  },
]

export function applySwitzerlandVisaCatalog(
  base: readonly VisaEntry[],
): readonly VisaEntry[] {
  return [
    ...base.filter((visa) => visa.countryCode !== "CH"),
    ...SWITZERLAND_VISA_ENTRIES,
  ]
}
