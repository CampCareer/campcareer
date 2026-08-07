import type { VisaCostItem, VisaDetail } from "./visa-detail"

type DenmarkDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

function makeDenmarkDetail(input: DenmarkDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the correct SIRI scheme",
        duration: "Before applying",
        note: "Use the linked New to Denmark page to confirm the current route, fee, processing time, nationality rules and document checklist.",
      },
      {
        step: "Secure the study, job or internship basis",
        duration: "Preparation stage",
        note: "Obtain the admission, completion evidence, employment contract, internship agreement or working-holiday documents required for the route.",
      },
      {
        step: "Create the case order and submit",
        duration: "Application stage",
        note: "Create the relevant case order or application ID, pay the applicable fee, submit the form and provide the requested supporting documents.",
      },
      {
        step: "Record biometrics and await the decision",
        duration: input.processingTime,
        note: "Complete biometrics within the required deadline and do not begin restricted work until the permit or an applicable job-change rule allows it.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "DKK",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} SIRI updates fees, financial requirements, salary thresholds, occupation lists and processing times; confirm the current figures before applying.`,
    topCities: ["Copenhagen", "Aarhus", "Odense"],
  }
}

const STUDY_FEE: VisaCostItem[] = [
  { item: "SIRI residence-permit processing fee", amount: 3060 },
]

const WORK_FEE: VisaCostItem[] = [
  { item: "SIRI residence and work-permit processing fee", amount: 6810 },
]

export const DENMARK_VISA_DETAILS: Record<string, VisaDetail> = {
  "DK:Higher education study permit": makeDenmarkDetail({
    status: "Study",
    processingTime: "Normally 2 months; up to 3 months if further information is needed",
    duration: "For the approved full-time programme and period granted by SIRI, limited by passport validity",
    costItems: STUDY_FEE,
    costNote: "Tuition, insurance, travel and the required maintenance funds are separate from the application fee.",
    requirements: [
      "Admission to a full-time higher educational programme in Denmark; part-time study does not qualify",
      "The institution must be publicly accredited or otherwise meet SIRI's institutional rules, and the programme must be state-approved or hold the required EVA advisory statement",
      "Language proficiency sufficient to participate in the programme",
      "Maintenance funds of DKK 7,426 per month at the 2026 level, normally documented for up to 12 months or DKK 89,112",
      "Payment of tuition where the institution requires payment before the application can be processed",
      "Students in state-approved higher education normally receive limited work rights of up to 90 hours per month from September to May and full-time work in June, July and August",
    ],
  }),
  "DK:Three-year post-study job-seeking permit": makeDenmarkDetail({
    status: "Post-study job search",
    processingTime: "Normally 3 months",
    duration: "Up to 3 years",
    costItems: STUDY_FEE,
    costNote: "An eligible study permit is often issued with the job-seeking period already included; a separate application is mainly needed when passport validity or delayed completion shortened it.",
    requirements: [
      "A valid Danish study-based residence permit",
      "Completion of a state-approved Danish professional bachelor's, bachelor's, master's or PhD programme",
      "Application before the current permit expires when a separate or extended job-seeking period is required",
      "The route is not the standard three-year option for Academy Profession programmes, non-state-approved programmes or master's programmes for working professionals, which may receive six months instead",
      "Limited work rights of up to 90 hours per month from September to May and full-time work in June, July and August",
      "A separate unrestricted work permit or job-based residence and work permit is required before working beyond the limited hours; the unrestricted job-seeking-period work permit currently has a separate DKK 840 fee",
    ],
  }),
  "DK:Positive List for People with Higher Education": makeDenmarkDetail({
    status: "Shortage occupation work",
    processingTime: "Normally 1 month; up to 3 months if further information is needed",
    duration: "Normally for the employment period, up to 4 years per grant and limited by passport validity",
    costItems: WORK_FEE,
    minSalary: "Danish-standard salary for the listed occupation and the applicant's experience",
    costNote: "The occupation list is updated twice yearly and an occupation can have a specific expiry date or regional limitation.",
    requirements: [
      "A concrete job offer in an occupation currently included on the Positive List for People with a Higher Education",
      "Completion of the higher-education level stated for the listed occupation",
      "Salary, holiday rights, notice terms and other conditions no worse than normal Danish standards in the profession",
      "Danish authorisation or official recognition before employment where the profession is regulated",
      "An employment contract or job offer containing the required salary, employment terms and job description",
      "A new application if changing to a different employer or job that is not covered by the existing permit conditions",
    ],
  }),
  "DK:Pay Limit Scheme": makeDenmarkDetail({
    status: "High-salary employment",
    processingTime: "Normally 1 month; up to 3 months if further information is needed",
    duration: "Normally for the employment period, up to 4 years per grant and limited by passport validity",
    costItems: WORK_FEE,
    minSalary: "At least DKK 552,000 per year in 2026",
    costNote: "Only qualifying cash salary, pension contributions and paid holiday allowance count toward the threshold; benefits in kind do not.",
    requirements: [
      "A concrete Danish job offer with annual qualifying salary of at least DKK 552,000 at the 2026 threshold",
      "At least 30 working hours per week, while the annual threshold applies regardless of the weekly hours",
      "Salary and other employment conditions no worse than normal Danish standards for the professional field",
      "Salary paid into a Danish bank account in the applicant's own name within the applicable deadline",
      "Danish authorisation or temporary authorisation where the offered profession is regulated",
      "No specific education or occupation-list requirement, but the permit remains linked to the approved employment",
    ],
  }),
  "DK:Internship permit": makeDenmarkDetail({
    status: "Educational internship",
    processingTime: "Normally 3 months; up to 4 months if further information is needed",
    duration: "For the approved internship; field-specific rules apply and the total can be up to 18 months in eligible sectors",
    costItems: [{ item: "SIRI internship processing fee", amount: 4305 }],
    minSalary: "Applicable Danish intern terms, or documented self-support where an unpaid internship is permitted",
    costNote: "Eligibility, age, pay and duration differ between the green sector, healthcare, architecture and other professional fields; some green-sector applications may be suspended.",
    requirements: [
      "A concrete internship offer from a qualifying host in Denmark",
      "Current enrolment in an educational programme abroad and a specific educational reason for the Danish internship, unless a field-specific recent-graduate exception applies",
      "The internship must be professionally and temporally related to the education and include an appropriate training plan",
      "Meet the field-specific age rule, commonly 18–29 in the green sector and under 35 in healthcare or architecture, with stated exceptions such as medical interns",
      "Salary and terms following the relevant Danish collective agreement when paid, or personal maintenance of DKK 7,426 per month at the 2026 level where an unpaid internship is allowed",
      "Paid salary must be transferred to a Danish bank account within the applicable deadline",
    ],
  }),
  "DK:Working Holiday": makeDenmarkDetail({
    status: "Working holiday",
    processingTime: "Normally 3 months; up to 4 months if further information is needed",
    duration: "Up to 1 year",
    costItems: STUDY_FEE,
    costNote: "Age limits, funds, insurance, quotas, study rights and employer limits differ under each bilateral agreement.",
    requirements: [
      "Citizenship of Argentina, Australia, Canada, Chile, Japan, New Zealand or South Korea",
      "Meet the nationality-specific age limit, generally beginning at 18 and ending at 30 or 35",
      "Holiday and cultural exchange must be the primary purpose of the stay",
      "Nationality-specific initial funds plus a return ticket or additional funds to buy one",
      "Health and hospital insurance where required by the relevant agreement",
      "Only limited salaried work is allowed; many programmes allow work for up to six months in a twelve-month stay and restrict time with one employer, while self-employment is not permitted",
    ],
  }),
}
