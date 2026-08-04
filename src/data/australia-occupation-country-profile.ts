export type AustraliaProfileSource = {
  label: string
  url: string
}

export type AustraliaStrongMajor = {
  id: string
  label: string
  reason: string
}

export type AustraliaMajorInstitution = {
  name: string
  type: "research_university" | "public_vet"
  location: string
}

export const AUSTRALIA_OCCUPATION_COUNTRY_PROFILE = {
  countryCode: "AU",
  countryName: "Australia",
  academicYear: {
    headline: "Two main university semesters",
    summary:
      "Most undergraduate and postgraduate courses use two semesters and usually begin in March. Some providers use three trimesters, and selected courses offer a mid-year or second-semester start.",
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
      reason: "Health occupations remain a major area of persistent skills shortage.",
    },
    {
      id: "teaching-education",
      label: "Teaching & Education",
      reason: "Qualified applicant shortages continue across teaching and education roles.",
    },
    {
      id: "construction-built-environment",
      label: "Construction & Built Environment",
      reason: "Construction remains one of Australia’s clearest shortage areas.",
    },
    {
      id: "skilled-trades",
      label: "Skilled Trades & Engineering Technologies",
      reason: "Nearly half of trade occupations were assessed as being in shortage in 2025.",
    },
    {
      id: "selected-engineering",
      label: "Selected Engineering Fields",
      reason: "Some engineering employers continue to report experience and suitability gaps.",
    },
    {
      id: "community-care",
      label: "Community Services & Care",
      reason: "Care and service roles continue to face recruitment and retention pressure.",
    },
  ] satisfies AustraliaStrongMajor[],
  majorInstitutions: [
    { name: "Adelaide University", type: "research_university", location: "South Australia" },
    { name: "Australian National University", type: "research_university", location: "Australian Capital Territory" },
    { name: "University of Melbourne", type: "research_university", location: "Victoria" },
    { name: "Monash University", type: "research_university", location: "Victoria" },
    { name: "UNSW Sydney", type: "research_university", location: "New South Wales" },
    { name: "University of Queensland", type: "research_university", location: "Queensland" },
    { name: "University of Sydney", type: "research_university", location: "New South Wales" },
    { name: "University of Western Australia", type: "research_university", location: "Western Australia" },
    { name: "TAFE NSW", type: "public_vet", location: "New South Wales" },
    { name: "TAFE Queensland", type: "public_vet", location: "Queensland" },
  ] satisfies AustraliaMajorInstitution[],
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
  ] satisfies AustraliaProfileSource[],
} as const
