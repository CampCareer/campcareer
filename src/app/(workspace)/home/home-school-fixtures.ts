import type { FormValues } from "./home-search-config"

export type ProgramSource = {
  name: string
  url: string
  checkedAt: string
}

export type SchoolProgramFixture = {
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

export type SchoolRequirement = {
  title: string
  description: string
}

export type SchoolResultsFixture = {
  country: string
  field: string
  status: "choosing-school"
  title: string
  description: string
  guidance: string
  programs: readonly SchoolProgramFixture[]
  requirements: readonly SchoolRequirement[]
  careerOutlook: {
    role: string
    employmentSetting: string
    careerDirection: string
    salaryNote: string
  }
}

/**
 * UI fixtures derived from already-reviewed provider records in route-guides.
 * They are intentionally local and are not a live provider search or ranking.
 */
export const HOME_SCHOOL_RESULTS_FIXTURES: readonly SchoolResultsFixture[] = [
  {
    country: "AU",
    field: "nursing",
    status: "choosing-school",
    title: "Study Nursing in Australia",
    description: "Compare nursing programs, tuition, duration and entry requirements.",
    guidance: "Start by comparing the study format and requirements that fit your background.",
    programs: [
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
    ],
    requirements: [
      { title: "Approved nursing program", description: "Confirm the current approved-program status before applying." },
      { title: "English language requirement", description: "Providers set course-specific English evidence requirements." },
      { title: "Academic prerequisites", description: "Check each provider’s current entry criteria for your education background." },
      { title: "Clinical placement requirements", description: "Placement and attendance requirements are confirmed by the provider." },
      { title: "Professional registration pathway", description: "Study eligibility and professional registration are separate checks." },
    ],
    careerOutlook: {
      role: "Registered Nurse",
      employmentSetting: "Employment settings can include hospital, community and aged-care services.",
      careerDirection: "Eligible study and registration can support a Registered Nurse career direction.",
      salaryNote: "Salary information is being prepared.",
    },
  },
]

export function getSchoolResultsFixture(query: FormValues) {
  return HOME_SCHOOL_RESULTS_FIXTURES.find((fixture) => (
    fixture.country === query.country
    && fixture.field === query.field
    && fixture.status === query.status
  )) ?? null
}

export function toggleComparedProgram(
  selectedIds: readonly string[],
  programId: string,
  availableProgramIds: readonly string[]
) {
  if (!availableProgramIds.includes(programId)) return [...selectedIds]
  if (selectedIds.includes(programId)) return selectedIds.filter((id) => id !== programId)
  if (selectedIds.length >= 3) return [...selectedIds]
  return [...selectedIds, programId]
}

export function hasComparablePrograms(selectedIds: readonly string[]) {
  return selectedIds.length >= 2
}
