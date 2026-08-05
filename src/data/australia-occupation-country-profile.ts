export type CountryProfileSource = {
  label: string
  url: string
}

export type CountryStrongMajor = {
  id: string
  label: string
  reason: string
}

export type CountryInstitutionType =
  | "university"
  | "college_polytechnic"
  | "vocational_provider"
  | "public_technical_institute"
  | "specialist_institution"

export type CountryMajorInstitution = {
  name: string
  type: CountryInstitutionType
  location: string
}

export const COUNTRY_INSTITUTION_TYPE_LABELS: Record<CountryInstitutionType, string> = {
  university: "Research university",
  college_polytechnic: "College / Polytechnic",
  vocational_provider: "Vocational provider",
  public_technical_institute: "Public TAFE / VET",
  specialist_institution: "Specialist institution",
}

export const AUSTRALIA_OCCUPATION_COUNTRY_PROFILE = {
  countryCode: "AU",
  countryName: "Australia",
  introduction:
    "Australia combines a large university and vocational sector with clear study, labour-market and student-cost pathways across major cities.",
  academicYear: {
    headline: "Two main university semesters",
    summary:
      "Most undergraduate and postgraduate courses begin in February or March. Selected providers and courses also offer a July intake, while some institutions use trimester calendars.",
    intakes: ["February–March", "July (selected courses)"],
    source: {
      label: "Study Australia — Australia’s education system",
      url: "https://www.studyaustralia.gov.au/en/plan-your-studies/australias-education-system",
    },
  },
  strongMajors: [
    {
      id: "nursing-health",
      label: "Nursing & Allied Health",
      reason: "Persistent national shortages across health occupations.",
    },
    {
      id: "teaching-education",
      label: "Teaching & Education",
      reason: "Continued shortages in qualified teaching roles.",
    },
    {
      id: "construction-built-environment",
      label: "Construction & Built Environment",
      reason: "Construction remains a major shortage area.",
    },
    {
      id: "skilled-trades",
      label: "Skilled Trades & Engineering Technologies",
      reason: "Many trade occupations continue to face shortages.",
    },
    {
      id: "selected-engineering",
      label: "Selected Engineering Fields",
      reason: "Employers report persistent experience and suitability gaps.",
    },
    {
      id: "community-care",
      label: "Community Services & Care",
      reason: "Care roles continue to face recruitment pressure.",
    },
  ] satisfies CountryStrongMajor[],
  majorInstitutions: [
    { name: "Adelaide University", type: "university", location: "South Australia" },
    { name: "Australian National University", type: "university", location: "Australian Capital Territory" },
    { name: "University of Melbourne", type: "university", location: "Victoria" },
    { name: "Monash University", type: "university", location: "Victoria" },
    { name: "UNSW Sydney", type: "university", location: "New South Wales" },
    { name: "University of Queensland", type: "university", location: "Queensland" },
    { name: "University of Sydney", type: "university", location: "New South Wales" },
    { name: "University of Western Australia", type: "university", location: "Western Australia" },
    { name: "TAFE NSW", type: "public_technical_institute", location: "New South Wales" },
    { name: "TAFE Queensland", type: "public_technical_institute", location: "Queensland" },
  ] satisfies CountryMajorInstitution[],
  sources: [
    {
      label: "Jobs and Skills Australia — 2025 Occupation Shortage List",
      url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
    },
    {
      label: "Group of Eight — member universities",
      url: "https://go8.edu.au/about/the-go8",
    },
    {
      label: "Study Australia — list of Australian universities",
      url: "https://www.studyaustralia.gov.au/en/plan-your-studies/list-of-australian-universities",
    },
  ] satisfies CountryProfileSource[],
} as const
