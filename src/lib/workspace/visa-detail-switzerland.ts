import type { VisaDetail } from "./visa-detail"

type SwitzerlandDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  minSalary?: string
}

function makeSwitzerlandDetail(input: SwitzerlandDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the canton and permit route",
        duration: "Before applying",
        note: "Use the linked SEM guidance and the competent cantonal authority to confirm the permit type, visa requirement, local fee and document checklist.",
      },
      {
        step: "Secure the study, job or placement basis",
        duration: "Preparation stage",
        note: "Obtain the admission, Swiss degree evidence, employment contract, training agreement, host-family placement or other route-specific documents.",
      },
      {
        step: "Submit through the responsible authority",
        duration: "Application stage",
        note: "Applications are normally handled by the canton, employer, Swiss representation or home-country authority depending on the route and nationality.",
      },
      {
        step: "Complete entry and registration formalities",
        duration: input.processingTime,
        note: "Wait for the required authorisation, obtain any entry visa, then register with the commune within the applicable deadline and before beginning restricted work.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "CHF",
      items: [],
    },
    costNote: `${input.costNote} Switzerland has canton-specific permit and visa fees, so no single national total is shown; confirm the amount with the responsible authority.`,
    topCities: ["Zurich", "Geneva", "Basel"],
  }
}

const CANTON_WAIT =
  "Varies by canton, nationality, permit type, visa requirement and case completeness"

export const SWITZERLAND_VISA_DETAILS: Record<string, VisaDetail> = {
  "CH:Study residence permit": makeSwitzerlandDetail({
    status: "Study",
    processingTime: CANTON_WAIT,
    duration: "Normally linked to the study period, often issued for one year and renewed while the conditions remain met",
    costNote: "Tuition, housing, health insurance and proof of living funds are separate from permit and visa fees.",
    requirements: [
      "Admission to a recognised Swiss educational institution and a credible full-time study plan",
      "Sufficient financial resources for tuition and living costs without relying on Swiss social assistance",
      "Adequate health and accident insurance for the stay",
      "Suitable accommodation and any canton-requested evidence of qualifications, language ability or intention to complete the programme",
      "Registration with the local commune and a residence-permit application under the rules for the applicant's nationality",
      "For third-country university students, supplementary work is generally possible only after six months, for up to 15 hours per week outside holidays, with university confirmation and an employer-led cantonal application",
    ],
  }),
  "CH:Swiss graduate job-search period": makeSwitzerlandDetail({
    status: "Post-study job search",
    processingTime: CANTON_WAIT,
    duration: "Maximum 6 months after completion of eligible Swiss higher education",
    costNote: "Applicants must maintain lawful residence and meet cantonal finance, insurance and registration requirements during the search period.",
    requirements: [
      "Third-country nationality and graduation from a recognised Swiss university or university of applied sciences",
      "Application to the competent canton before the existing student status ends",
      "A genuine search for employment matching the completed qualification",
      "Sufficient funds, accommodation and health insurance for the six-month period",
      "A qualifying job still requires the employer and canton to complete the relevant work-authorisation procedure",
      "The normal Swiss and EU/EFTA recruitment-precedence rule may be waived only when the graduate's employment represents an overriding scientific or economic interest",
    ],
  }),
  "CH:Non-EU/EFTA highly qualified worker": makeSwitzerlandDetail({
    status: "Highly qualified employment",
    processingTime: CANTON_WAIT,
    duration: "Usually an L or B permit linked to the approved employment, contract period and available quota",
    minSalary: "Salary and conditions customary for the Swiss location, profession and sector",
    costNote: "The route is quota-limited and the employer may bear separate cantonal and federal authorisation costs.",
    requirements: [
      "A concrete Swiss job offer for a manager, specialist or other highly qualified professional role",
      "Normally a university or higher-education degree plus several years of relevant professional experience",
      "Employer proof that no suitable worker could be recruited from Switzerland or the EU/EFTA labour market",
      "Salary, social-security contributions and employment conditions matching Swiss regional and sector standards",
      "Availability within the applicable federal and cantonal permit quotas and a positive integration assessment where relevant",
      "Employer submission to the cantonal authority, possible SEM approval, any required entry visa, and registration within 14 days of arrival before starting work",
    ],
  }),
  "CH:EU/EFTA employment mobility": makeSwitzerlandDetail({
    status: "EU/EFTA employment",
    processingTime: CANTON_WAIT,
    duration: "Notification for work up to 3 months; L permit for contracts over 3 and under 12 months; B permit generally 5 years for contracts of at least 12 months or unlimited duration",
    minSalary: "Employment conditions must comply with applicable Swiss labour rules",
    costNote: "Notification and residence-permit procedures differ by contract length and canton.",
    requirements: [
      "Citizenship of an EU or EFTA member state covered by the current free-movement rules",
      "A valid identity document and written employment confirmation or contract",
      "For work up to three months, completion of the online notification procedure where required",
      "For work longer than three months, registration with the commune within 14 days of arrival and before starting work",
      "An L EU/EFTA permit for a qualifying contract of three to twelve months, or a B EU/EFTA permit for a contract of at least twelve months or unlimited duration",
      "Compliance with Swiss pay, working-condition, social-insurance and regulated-profession requirements",
    ],
  }),
  "CH:Young Professionals permit": makeSwitzerlandDetail({
    status: "Professional training employment",
    processingTime: "Varies by partner-country procedure, canton and case completeness",
    duration: "Maximum 18 months",
    minSalary: "At least local and industry-standard entry-level remuneration",
    costNote: "The applicant and employer may face home-country, cantonal, visa and residence-permit charges.",
    requirements: [
      "Citizenship of a country covered by an active Swiss Young Professionals agreement",
      "Completed education of at least a bachelor's degree or a qualifying two-year apprenticeship",
      "A full-time Swiss position in the learned profession or field of study with a structured development purpose",
      "Local and industry-standard pay, normally at least the level of a person entering the profession",
      "No self-employment or part-time work under the programme",
      "The applicant finds the position and submits through the competent authority in the home country, meeting the agreement-specific age and document rules",
    ],
  }),
  "CH:Third-country au pair permit": makeSwitzerlandDetail({
    status: "Au pair cultural placement",
    processingTime: CANTON_WAIT,
    duration: "Maximum 12 months for third-country nationals",
    minSalary: "Canton-specific au pair pay and board conditions",
    costNote: "Agency, travel, insurance, language-course and cantonal costs vary and are not combined into a national estimate.",
    requirements: [
      "Third-country nationality and age between 18 and 25",
      "Placement through an organisation recognised and authorised in Switzerland",
      "A host-family arrangement focused on language improvement and cultural education",
      "Duties limited to the permitted combination of childcare and light household assistance",
      "Compliance with canton-specific working time, language-course, pay, room, board and insurance conditions",
      "Employer or host-family completion of the cantonal authorisation process before the placement begins",
    ],
  }),
}
