import type { VisaCostItem, VisaDetail } from "./visa-detail"

type NorwayDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

function makeNorwayDetail(input: NorwayDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the correct permit",
        duration: "Before applying",
        note: "Use the linked UDI page and select your citizenship to confirm the route, fee, submission location and document checklist.",
      },
      {
        step: "Secure the study, job or training basis",
        duration: "Preparation stage",
        note: "Obtain the admission, completed-education evidence, employment offer, seasonal contract, training plan or youth-mobility documents required for the route.",
      },
      {
        step: "Register and submit the application",
        duration: "Application stage",
        note: "Register online, pay the applicable fee and submit documents through the police, embassy or application centre specified by UDI.",
      },
      {
        step: "Complete residence formalities",
        duration: input.processingTime,
        note: "Wait for a decision before starting restricted work, then complete entry, police appointment and residence-card steps where required.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "NOK",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} UDI fees and documentary requirements can change and may vary by age, citizenship and submission location; confirm the current amount before applying.`,
    topCities: ["Oslo", "Bergen", "Trondheim"],
  }
}

const VARIABLE_WAIT =
  "Varies by citizenship, application type, submission location and season; check UDI's current waiting-time service"

export const NORWAY_VISA_DETAILS: Record<string, VisaDetail> = {
  "NO:University and vocational study permit": makeNorwayDetail({
    status: "Study",
    processingTime: VARIABLE_WAIT,
    duration: "Linked to the approved full-time programme and the period granted by UDI",
    costNote: "The application fee is separate from tuition, housing, insurance and the required living funds.",
    requirements: [
      "Admission to an approved full-time university, university college or vocational-school programme",
      "Funds of at least NOK 170,368 for the 2026/2027 academic year, plus tuition where it applies",
      "Housing arranged for the study period",
      "The institution or vocational school must hold the required Norwegian accreditation",
      "Circumstances must support that the applicant can return home after the studies where UDI applies that assessment",
      "The permit normally includes work for up to 20 hours per week during studies and full-time during holidays, but does not allow self-employment",
    ],
  }),
  "NO:Post-study job seeker permit": makeNorwayDetail({
    status: "Post-study job search",
    processingTime: VARIABLE_WAIT,
    duration: "Maximum 1 year",
    costNote: "Applicants must separately document their own living funds; the job-seeker permit is not a permanent-residence qualifying period.",
    requirements: [
      "Completed eligible education in Norway, recognised supplementary education, or an eligible researcher background",
      "Apply before the current permit expires, preferably at least one month in advance",
      "Seek employment that qualifies as skilled work and is not work as a religious leader or teacher",
      "Own funds of at least NOK 28,448 per month, equivalent to NOK 341,373 for one year",
      "No self-employment or operation of a personal business under this permit",
      "Full-time or part-time work is allowed while searching, including temporary work outside the skilled field, before changing to the appropriate skilled-worker permit",
    ],
  }),
  "NO:Skilled worker with employer": makeNorwayDetail({
    status: "Skilled work",
    processingTime: VARIABLE_WAIT,
    duration: "Based on the approved employment and period granted; renewable while the conditions remain met",
    minSalary: "Normal Norwegian pay and working conditions for the occupation",
    costNote: "There is no single salary threshold for every occupation; collective agreements, sector practice and regulated-profession rules may apply.",
    requirements: [
      "Completed higher education, a qualifying vocational programme, or special qualifications comparable to Norwegian skilled training",
      "A concrete offer of normally full-time employment from one Norwegian employer",
      "The position must normally require the applicant's skilled qualifications",
      "Pay and working conditions must not be poorer than normal in Norway",
      "When applying independently from abroad, the employer may need to confirm the job offer and provide the applicant with a submission code",
      "Norwegian authorisation or recognition is required before working in a regulated profession",
    ],
  }),
  "NO:Seasonal worker": makeNorwayDetail({
    status: "Seasonal work",
    processingTime: VARIABLE_WAIT,
    duration: "Maximum 6 months in any 12-month period",
    minSalary: "At least the applicable Norwegian minimum or normal sector wage",
    costNote: "The permit is tied to the approved seasonal employment and does not count toward permanent residence.",
    requirements: [
      "At least 18 years old and able to show a likely return home after the work period",
      "A concrete full-time offer for genuinely seasonal work or holiday cover",
      "Pay and working conditions at least equal to normal Norwegian standards",
      "Employer confirmation of the job offer when required for an application submitted from abroad",
      "NAV confirmation that workers cannot be recruited from Norway or the EEA, except for qualifying agriculture or forestry work",
      "No more than six months as a seasonal worker within a twelve-month period",
    ],
  }),
  "NO:Trainee permit": makeNorwayDetail({
    status: "Practical training",
    processingTime: VARIABLE_WAIT,
    duration: "Usually up to 6 months; up to 12 months where a longer traineeship is customary, and not renewable",
    minSalary: "Normal trainee pay or a grant of at least NOK 15,488 per month for 2026/2027",
    costNote: "Travel, housing and education costs are separate from the required trainee pay or grant.",
    requirements: [
      "Currently enrolled in higher education at a foreign institution and not yet finished with the programme",
      "Age 18 to 29 when applying",
      "The traineeship must be a practical and relevant part of the applicant's education",
      "A concrete full-time trainee offer from one employer and a training plan covering the entire stay",
      "Pay at the applicable trainee rate or a qualifying grant of at least NOK 15,488 per month",
      "Housing arranged and circumstances supporting return home after the traineeship",
    ],
  }),
  "NO:Working holiday for young adults": makeNorwayDetail({
    status: "Working holiday",
    processingTime: VARIABLE_WAIT,
    duration: "Nationality-specific; commonly up to 1 year per grant, with up to 2 years total for some programmes",
    costNote: "Age limits, annual quotas, insurance rules, renewal rights and total duration differ between Norway's bilateral programmes.",
    requirements: [
      "Citizenship in a country covered by an active Norwegian working-holiday arrangement",
      "Meet the nationality-specific age limit, commonly 18–30, while eligible Canadians may apply before turning 36",
      "Holiday and cultural experience must be the main purpose of the stay",
      "Funds of at least NOK 46,464 for the first three months, from savings and/or a concrete paid-work offer",
      "Health and hospital insurance where required by the relevant bilateral programme",
      "Observe nationality-specific work and study limits, including the common six-month limit with one employer and three-month study limit",
    ],
  }),
}
