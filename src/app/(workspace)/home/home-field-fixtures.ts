import type { FormValues } from "./home-search-config"

export type FieldPriority = "career-demand" | "lower-study-cost" | "faster-route" | "visa-potential"

export type FieldCareerFixture = {
  id: string
  name: string
  description: string
  dataStatus: string
}

export type FieldExplorerItem = {
  id: string
  slug: string
  name: string
  icon: "nursing" | "software" | "electrical" | "finance" | "marketing"
  relatedCareers: readonly FieldCareerFixture[]
  studyDurationLabel: string
  tuitionLabel: string
  entryRequirement: string
  registrationLabel: string
  visaRelevanceLabel: string
  priorityNotes: Record<FieldPriority, string>
}

export type FieldExplorerFixture = {
  country: "AU"
  field: "not-sure"
  status: "no-field"
  title: string
  description: string
  fields: readonly FieldExplorerItem[]
  considerations: readonly { title: string; description: string }[]
}

const sharedPriorityNotes: Record<FieldPriority, string> = {
  "career-demand": "Career data availability varies by occupation.",
  "lower-study-cost": "Compare tuition and total study costs by provider.",
  "faster-route": "Duration depends on the qualification and your prior study.",
  "visa-potential": "Check current occupation and visa requirements separately.",
}

/**
 * Local field-exploration fixtures only. They reuse Home field slugs and the
 * reviewed Australia concept-to-occupation mapping; they are not rankings.
 */
export const HOME_FIELD_EXPLORER_FIXTURES: readonly FieldExplorerFixture[] = [
  {
    country: "AU",
    field: "not-sure",
    status: "no-field",
    title: "Find the right field in Australia",
    description: "Explore study fields, career pathways, costs and requirements before choosing your direction.",
    fields: [
      {
        id: "nursing",
        slug: "nursing",
        name: "Nursing",
        icon: "nursing",
        relatedCareers: [
          {
            id: "registered-nurse",
            name: "Registered Nurse",
            description: "Plans, coordinates and provides nursing care and services.",
            dataStatus: "Australia occupation data available",
          },
          {
            id: "enrolled-nurse",
            name: "Enrolled Nurse",
            description: "Supports nursing care under the relevant care setting.",
            dataStatus: "Data being prepared",
          },
        ],
        studyDurationLabel: "3 years for reviewed bachelor programs",
        tuitionLabel: "Varies by program",
        entryRequirement: "Approved study pathway and provider requirements",
        registrationLabel: "AHPRA/NMBA registration pathway",
        visaRelevanceLabel: "Check current occupation and visa requirements",
        priorityNotes: {
          ...sharedPriorityNotes,
          "career-demand": "Australian shortage evidence is available for some nursing occupations.",
        },
      },
      {
        id: "software-engineering",
        slug: "software-engineering",
        name: "Software Engineering",
        icon: "software",
        relatedCareers: [
          {
            id: "software-developer",
            name: "Software Developer",
            description: "Designs, develops and tests software applications and systems.",
            dataStatus: "Data being prepared",
          },
          {
            id: "developer-programmer",
            name: "Developer Programmer",
            description: "Builds and maintains software using programming tools.",
            dataStatus: "Data being prepared",
          },
        ],
        studyDurationLabel: "2–3 years, by qualification",
        tuitionLabel: "Varies by program",
        entryRequirement: "Provider entry requirements vary",
        registrationLabel: "Professional registration varies by role",
        visaRelevanceLabel: "Check current occupation and visa requirements",
        priorityNotes: sharedPriorityNotes,
      },
      {
        id: "electrical-engineering",
        slug: "electrical-engineering",
        name: "Electrical Engineering",
        icon: "electrical",
        relatedCareers: [
          {
            id: "electrical-engineer",
            name: "Electrical Engineer",
            description: "Works with electrical systems and engineering projects.",
            dataStatus: "Data being prepared",
          },
        ],
        studyDurationLabel: "2–4 years, by qualification",
        tuitionLabel: "Varies by program",
        entryRequirement: "Provider entry requirements vary",
        registrationLabel: "Professional recognition may be relevant",
        visaRelevanceLabel: "Check current occupation and visa requirements",
        priorityNotes: sharedPriorityNotes,
      },
      {
        id: "finance",
        slug: "finance",
        name: "Finance",
        icon: "finance",
        relatedCareers: [
          {
            id: "financial-investment-adviser",
            name: "Financial Investment Adviser",
            description: "Advises on financial investment decisions.",
            dataStatus: "Data being prepared",
          },
          {
            id: "financial-dealer",
            name: "Financial Dealer",
            description: "Works with financial market transactions.",
            dataStatus: "Data being prepared",
          },
        ],
        studyDurationLabel: "2–3 years, by qualification",
        tuitionLabel: "Varies by program",
        entryRequirement: "Provider entry requirements vary",
        registrationLabel: "Licensing or registration varies by role",
        visaRelevanceLabel: "Check current occupation and visa requirements",
        priorityNotes: sharedPriorityNotes,
      },
      {
        id: "marketing",
        slug: "marketing",
        name: "Marketing",
        icon: "marketing",
        relatedCareers: [
          {
            id: "advertising-specialist",
            name: "Advertising Specialist",
            description: "Plans advertising activity and campaigns.",
            dataStatus: "Data being prepared",
          },
        ],
        studyDurationLabel: "2–3 years, by qualification",
        tuitionLabel: "Varies by program",
        entryRequirement: "Provider entry requirements vary",
        registrationLabel: "Varies by role",
        visaRelevanceLabel: "Check current occupation and visa requirements",
        priorityNotes: sharedPriorityNotes,
      },
    ],
    considerations: [
      { title: "Total study cost", description: "Compare tuition and living costs for each provider and location." },
      { title: "Study duration", description: "Check whether your prior study changes the available route." },
      { title: "Entry requirements", description: "Providers set course-specific academic and English requirements." },
      { title: "Professional registration", description: "Some occupations require separate registration after study." },
      { title: "Career demand", description: "Review current occupation data before treating it as a decision factor." },
      { title: "Visa relevance", description: "Confirm current visa and occupation rules from official sources." },
    ],
  },
]

export function getFieldExplorerFixture(query: FormValues) {
  return HOME_FIELD_EXPLORER_FIXTURES.find((fixture) => (
    fixture.country === query.country
    && fixture.field === query.field
    && fixture.status === query.status
  )) ?? null
}

export function toggleComparedField(
  selectedIds: readonly string[],
  fieldId: string,
  availableFieldIds: readonly string[]
) {
  if (!availableFieldIds.includes(fieldId)) return [...selectedIds]
  if (selectedIds.includes(fieldId)) return selectedIds.filter((id) => id !== fieldId)
  if (selectedIds.length >= 3) return [...selectedIds]
  return [...selectedIds, fieldId]
}

export function hasComparableFields(selectedIds: readonly string[]) {
  return selectedIds.length >= 2
}

export function getChosenFieldValues(fixture: FieldExplorerFixture, fieldSlug: string): FormValues | null {
  if (!fixture.fields.some((field) => field.slug === fieldSlug)) return null

  return {
    country: fixture.country,
    field: fieldSlug,
    status: "choosing-school",
  }
}
