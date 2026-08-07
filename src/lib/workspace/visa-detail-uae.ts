import type { VisaDetail } from "./visa-detail"

type UaeDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  minSalary?: string
}

function makeUaeDetail(input: UaeDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the authority and route",
        duration: "Before applying",
        note: "Use the linked UAE Government, ICP or MoHRE guidance to confirm whether ICP or GDRFA Dubai handles the case, and verify the current fee and document list.",
      },
      {
        step: "Secure the study, job or eligibility basis",
        duration: "Preparation stage",
        note: "Obtain the university sponsorship, employment offer, skill classification, academic recommendation or student-training documents required for the route.",
      },
      {
        step: "Submit through the responsible channel",
        duration: "Application stage",
        note: "The university, parent, employer or applicant submits through ICP, GDRFA or MoHRE as the route requires and pays the applicable government charges.",
      },
      {
        step: "Complete identity and residence formalities",
        duration: input.processingTime,
        note: "Complete medical fitness testing where required, biometrics and Emirates ID steps, and do not begin work until the correct work permit is active.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "AED",
      items: [],
    },
    costNote: `${input.costNote} Government fees vary by emirate, sponsor, service channel, permit duration, status adjustment, medical testing and Emirates ID, so no single national total is shown.`,
    topCities: ["Dubai", "Abu Dhabi", "Sharjah"],
  }
}

const VARIABLE_PROCESSING =
  "Varies by emirate, sponsor, service channel, security checks and case completeness"

export const UAE_VISA_DETAILS: Record<string, VisaDetail> = {
  "AE:Student residence visa": makeUaeDetail({
    status: "Study residence",
    processingTime: VARIABLE_PROCESSING,
    duration: "Linked to the approved study programme and sponsorship; students may receive a post-study grace period of up to 180 days under the applicable ICP rules",
    costNote: "Tuition, health insurance, medical testing, Emirates ID and sponsor or university service charges are separate.",
    requirements: [
      "Admission to an accredited UAE university, college or educational institution",
      "Sponsorship by the accredited institution or by an eligible UAE-resident parent",
      "A university or institute certificate stating the study duration",
      "A passport normally valid for at least six months and the general residence documents required by ICP or GDRFA",
      "Medical fitness testing, security checks and Emirates ID registration for applicants aged 18 or over",
      "The student residence does not itself create unrestricted work rights; paid training or employment requires the appropriate MoHRE permit",
    ],
  }),
  "AE:Jobseeker visit visa": makeUaeDetail({
    status: "Job-search visit",
    processingTime: VARIABLE_PROCESSING,
    duration: "Single entry for 60, 90 or 120 days",
    costNote: "A prescribed financial guarantee and service-specific issuance charges apply, with amounts shown by ICP or GDRFA at application.",
    requirements: [
      "A bachelor's degree or equivalent and an attested qualification certificate",
      "Either professional classification in MoHRE skill level 1, 2 or 3, or graduation within the past two years from a university ranked in the approved global top 500",
      "A passport normally valid for at least six months and a recent colour photograph",
      "The prescribed financial guarantee and any evidence requested by the issuing authority",
      "No UAE sponsor or host is required for this single-entry visit visa",
      "The visa permits job exploration only and does not authorise employment; an employer must obtain the correct work permit before work begins",
    ],
  }),
  "AE:Standard employer-sponsored work residence": makeUaeDetail({
    status: "Employer-sponsored employment",
    processingTime: VARIABLE_PROCESSING,
    duration: "Normally 2 years and renewable while the employment and sponsorship conditions remain met",
    costNote: "The employer-led process can include work-permit, entry, medical, Emirates ID and residence stages; workers should not be charged unlawful recruitment fees.",
    requirements: [
      "A genuine job offer and employment contract with an eligible UAE government or private-sector employer",
      "The employer initiates the relevant work permit and residence process through MoHRE and the immigration authority",
      "The worker must normally be at least 18 years old, except where a specific juvenile or student permit applies",
      "Qualifications, professional licensing and attestation where required for the occupation",
      "Medical fitness testing, security clearance and Emirates ID registration for residence issuance",
      "Employment may begin only after the required work authorisation is active and must follow the approved contract and labour rules",
    ],
  }),
  "AE:Green Residence for skilled employees": makeUaeDetail({
    status: "Self-sponsored skilled employment",
    processingTime: VARIABLE_PROCESSING,
    duration: "5 years, renewable while the eligibility conditions remain met",
    minSalary: "At least AED 15,000 per month",
    costNote: "The five-year residence is self-sponsored, but the applicant still needs a valid UAE employment contract and the related work authorisation.",
    requirements: [
      "A valid employment contract within the UAE",
      "Professional classification in MoHRE skill level 1, 2 or 3",
      "A bachelor's degree or higher qualification",
      "Monthly salary of at least AED 15,000 or the equivalent",
      "A passport, health insurance, medical fitness and identity documents required for residence issuance",
      "Continued compliance with the skilled-employee conditions for renewal of the five-year self-sponsored residence",
    ],
  }),
  "AE:Golden Residence for outstanding students and graduates": makeUaeDetail({
    status: "Long-term academic excellence residence",
    processingTime: VARIABLE_PROCESSING,
    duration: "Generally 5 years for qualifying high-school achievers and 10 years for qualifying university students or recent graduates",
    costNote: "Academic recommendation, qualification recognition and emirate-specific residence issuance steps may add separate costs.",
    requirements: [
      "Qualification in an eligible outstanding-student or graduate category under current ICP and Ministry of Education rules",
      "For high-school achievers, national-level academic excellence and the required education-authority recommendation",
      "For UAE university students or graduates, the required university classification, GPA and recommendation or accredited academic record",
      "For eligible foreign-university graduates, graduation from a university meeting the approved global-ranking rule, the required GPA and recognised qualification",
      "Recent-graduate categories generally require graduation within the preceding two years",
      "A valid passport, health insurance and the residence-issuance documents required by ICP or GDRFA",
    ],
  }),
  "AE:Student training and employment permit": makeUaeDetail({
    status: "Student training or holiday employment",
    processingTime: VARIABLE_PROCESSING,
    duration: "Up to 3 months per permit",
    costNote: "This is a MoHRE work permit for a student already lawfully resident in the UAE; it is not a standalone entry or residence visa.",
    requirements: [
      "Student status and a valid UAE residence visa and Emirates ID",
      "Age 15 or over; written consent from a parent or legal guardian for applicants aged 15 to 18",
      "A written training or employment contract setting out duties, duration, rest days, pay or allowance and other benefits",
      "Medical fitness evidence required under the student-employment rules",
      "A no-objection certificate from the educational institution when the arrangement is training",
      "Holiday employment is limited to the authorised period, generally no more than three consecutive months at a time, and work must comply with the student-safety rules",
    ],
  }),
}
