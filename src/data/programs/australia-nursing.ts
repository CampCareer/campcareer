export type ProgramSource = {
  name: string
  url: string
  checkedAt: string
}

/**
 * Reviewed provider records for the Australia Nursing Home and Compare MVP.
 * This is intentionally a small, local catalog rather than a live provider search.
 */
export type AustraliaNursingProgram = {
  id: string
  institutionName: string
  programName: string
  location: string
  tuitionLabel: string
  durationLabel: string
  entryRequirement: string
  programType: string
  registrationOutcome: string
  imageKey: "campus-a" | "campus-b" | "campus-c"
  imageAlt: string
  comparisonNote?: string
  source: ProgramSource
}

export const AUSTRALIA_NURSING_PROGRAMS: readonly AustraliaNursingProgram[] = [
  {
    id: "qut-bachelor-nursing",
    institutionName: "Queensland University of Technology",
    programName: "Bachelor of Nursing",
    location: "Kelvin Grove, Brisbane, Queensland",
    tuitionLabel: "A$43,500 per year (2026)",
    durationLabel: "3 years",
    entryRequirement: "IELTS 7.0 overall; L/R/S 7.0, W 6.5",
    programType: "Bachelor degree",
    registrationOutcome: "Registered Nurse pathway — verify current approval",
    imageKey: "campus-a",
    imageAlt: "Australian university campus context",
    source: {
      name: "QUT Bachelor of Nursing",
      url: "https://www.qut.edu.au/courses/bachelor-of-nursing",
      checkedAt: "2026-07-30",
    },
  },
  {
    id: "unisc-bachelor-nursing-science",
    institutionName: "University of the Sunshine Coast",
    programName: "Bachelor of Nursing Science",
    location: "Sunshine Coast, Queensland (multiple campuses)",
    tuitionLabel: "A$32,500 per year (2026)",
    durationLabel: "3 years",
    entryRequirement: "IELTS 7.0 in all bands",
    programType: "Bachelor degree",
    registrationOutcome: "Registered Nurse pathway — verify current approval",
    imageKey: "campus-b",
    imageAlt: "Australian university campus context",
    comparisonNote: "Lower annual tuition in this comparison",
    source: {
      name: "UniSC Bachelor of Nursing Science",
      url: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science",
      checkedAt: "2026-07-30",
    },
  },
  {
    id: "unisc-graduate-entry-nursing-science",
    institutionName: "University of the Sunshine Coast",
    programName: "Bachelor of Nursing Science (Graduate Entry)",
    location: "Sunshine Coast, Queensland (multiple campuses)",
    tuitionLabel: "A$32,500 per year (2026)",
    durationLabel: "2.3 years",
    entryRequirement: "Prior bachelor degree + IELTS 7.0 in all bands",
    programType: "Graduate entry",
    registrationOutcome: "Registered Nurse pathway — verify current approval",
    imageKey: "campus-c",
    imageAlt: "Australian university campus context",
    comparisonNote: "Shorter duration for eligible graduates",
    source: {
      name: "UniSC Bachelor of Nursing Science (Graduate Entry)",
      url: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science-graduate-entry",
      checkedAt: "2026-07-30",
    },
  },
]
