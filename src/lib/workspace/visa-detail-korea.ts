import type { VisaCostItem, VisaDetail } from "./visa-detail"

type KoreaDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  currency?: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

function makeKoreaDetail(input: KoreaDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the correct status",
        duration: "Before applying",
        note: "Use the linked Korean government page and confirm the exact subcategory, nationality and activity conditions.",
      },
      {
        step: "Secure the supporting basis",
        duration: "Preparation stage",
        note: "Obtain the admission letter, training plan, graduation evidence, job-search plan, employment contract or working-holiday documents required for the route.",
      },
      {
        step: "Submit through the official channel",
        duration: "Application stage",
        note: "Apply through the Korean diplomatic mission, Korea Visa Portal, Hi Korea or the immigration office responsible for the applicant's residence, as instructed for the route.",
      },
      {
        step: "Complete stay formalities",
        duration: input.processingTime,
        note: "After approval, complete entry, foreign-resident registration, address, extension or change-of-status steps that apply.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: input.currency ?? "KRW",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} Fees, documentary requirements and local processing arrangements can change; confirm them with the responsible mission or immigration office before applying.`,
    topCities: ["Seoul", "Busan", "Daejeon"],
  }
}

export const KOREA_VISA_DETAILS: Record<string, VisaDetail> = {
  "KR:D-2 Academic Study": makeKoreaDetail({
    status: "Study",
    processingTime: "No single national service time is published; timing varies by diplomatic mission, institution and case",
    duration: "Up to 2 years per grant, with programme-specific extension limits",
    currency: "USD",
    costItems: [{ item: "Long-stay single-entry visa fee, approximately", amount: 60 }],
    costNote: "The government study portal lists an approximate USD 60 application fee for a single-entry stay longer than 90 days; missions may collect the local-currency equivalent.",
    requirements: [
      "Admission to an eligible associate, bachelor's, master's, doctoral, research, exchange or work-learning programme",
      "Standard admission letter issued by the Korean institution",
      "Passport, recent photograph and the institution's registration document",
      "Proof of highest education level and sufficient financial ability",
      "Tuberculosis result or family-relationship evidence where applicable",
      "Separate immigration permission and the applicable Korean-language and university conditions before undertaking part-time work",
    ],
  }),
  "KR:D-4-1 Korean Language Training": makeKoreaDetail({
    status: "Language study",
    processingTime: "No single national service time is published; timing varies by diplomatic mission, institution and case",
    duration: "Linked to the approved Korean-language training period and extensions granted",
    currency: "USD",
    costItems: [{ item: "Long-stay single-entry visa fee, approximately", amount: 60 }],
    costNote: "The government study portal lists an approximate USD 60 application fee for a single-entry stay longer than 90 days; missions may collect the local-currency equivalent.",
    requirements: [
      "Admission to an eligible Korean-language training programme",
      "Standard admission letter and the institution's registration document",
      "Passport, recent photograph, proof of enrolment or highest education level",
      "Proof of financial ability and a training plan",
      "Additional nationality- or programme-specific documents requested by the Korean mission",
      "At least 6 months in the qualifying status plus Korean-language, university-confirmation and immigration-permission conditions before part-time work",
    ],
  }),
  "KR:D-10-1 Job Seeker": makeKoreaDetail({
    status: "Post-study job search",
    processingTime: "Varies by the immigration office responsible for the applicant's residence",
    duration: "Extended in 6-month increments up to 2 years; internships are limited to 1 year total and 6 months per company",
    costNote: "A change- or extension-of-status fee applies, but the official guidance used here does not publish one universal applicant total.",
    requirements: [
      "Eligible Korean associate-degree graduate or expected graduate, Korean bachelor's-or-higher graduate, qualifying research-program completer, or eligible technology start-up applicant",
      "Professional job-seeking or internship activity corresponding to employment statuses E-1 through E-7; manual and unskilled work is not permitted",
      "Application form, passport, residence card and job-seeking activity plan",
      "Degree or academic evidence and Korean-language or career certificates where applicable",
      "Proof of residence and financial stability where required; first-time changes from D-2 may be exempt from the financial evidence",
      "Change to the appropriate employment status before beginning confirmed regular employment",
    ],
  }),
  "KR:E-7-1 Specific Activities": makeKoreaDetail({
    status: "Skilled work",
    processingTime: "Varies by application channel, occupation and immigration office",
    duration: "Linked to the approved occupation, employment contract and period of stay granted",
    minSalary: "Current occupation-specific E-7 remuneration and employment conditions apply",
    costNote: "Visa issuance, certificate or in-country change-of-status fees depend on the application channel and applicant circumstances.",
    requirements: [
      "Employment contract for an occupation permitted under the current Specific Activities framework",
      "Educational background, experience, licence or qualification required for the particular E-7 occupation",
      "Korean associate-degree graduates generally need employment related to their major; Korean bachelor's-or-higher graduates may change without a separate career requirement when the official conditions are met",
      "Employer satisfies the current company-size, national-employment ratio and foreign-worker restrictions or an applicable exception",
      "Employer documents, qualification and career evidence, and an employment recommendation or proof of employment necessity where required",
      "Applicant changes from D-2 or D-10, or obtains the appropriate visa issuance confirmation, before carrying out the employment",
    ],
  }),
  "KR:H-1 Working Holiday": makeKoreaDetail({
    status: "Working holiday",
    processingTime: "Varies by the Korean embassy, consulate or visa application centre responsible for the applicant",
    duration: "Usually up to 1 year; country-specific extensions and limits apply",
    costNote: "Application fees, quotas, funds and supporting documents vary under each bilateral agreement and diplomatic mission.",
    requirements: [
      "Passport from a country or region covered by Korea's current working-holiday agreement",
      "Age within the nationality-specific limit, commonly 18–30 but different limits apply to some partners",
      "Holiday and cultural exchange are the primary purpose, with short-term work only as a secondary activity",
      "No accompanying dependants under the working-holiday status",
      "Valid passport, sufficient funds, insurance and return or onward travel evidence required by the responsible mission",
      "Work is generally limited to 25 hours per week and regulated or prohibited occupations require another appropriate status",
    ],
  }),
}
