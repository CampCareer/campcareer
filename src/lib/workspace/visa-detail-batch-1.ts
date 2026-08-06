import type { VisaDetail } from "./visa-detail"

type DetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  minSalary?: string
}

function makeDetail(input: DetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm eligibility",
        duration: "Before applying",
        note: "Check the linked Spanish authority page and the route-specific application channel.",
      },
      {
        step: "Prepare official documents",
        duration: "Application stage",
        note: "Obtain any required admission, contract, host-entity, funds, insurance, police and translated or apostilled documents.",
      },
      {
        step: "Submit the application",
        duration: "Application stage",
        note: "The applicant, employer, host entity or authorised representative submits through the channel specified for the route.",
      },
      {
        step: "Authority decision and registration",
        duration: input.processingTime,
        note: "After approval, complete any consular visa, entry, TIE or Social Security step that applies.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: { currency: "EUR", items: [] },
    costNote: `${input.costNote} No fixed total is shown because official charges can depend on the route, nationality, consular post and application channel. Confirm current amounts before applying.`,
    topCities: [],
  }
}

export const BATCH_1_VISA_DETAILS: Record<string, VisaDetail> = {
  "ES:Student visa": makeDetail({
    status: "Study",
    processingTime: "Up to 2 months for Immigration Office decisions; consular timing varies",
    duration: "Higher education: course duration; post-compulsory secondary study: up to 1 year",
    costNote: "An authorization fee applies and a national-visa fee may apply when filing through a Spanish consulate.",
    requirements: [
      "Admission to an authorised Spanish institution for an eligible full-time higher-education or post-compulsory secondary programme",
      "For higher education, generally at least 17 years old and registration or enrolment fees paid",
      "Funds of 100% of the monthly IPREM for living costs, excluding study costs, unless an official reduction applies for prepaid accommodation",
      "Health insurance with an insurer authorised to operate in Spain and a valid passport",
      "Criminal-record, medical, translated or legalised documents where the duration and applicant circumstances require them",
      "Any work must remain compatible with study and within the applicable 30-hour weekly limit",
    ],
  }),
  "ES:Graduate job-search residence": makeDetail({
    status: "Post-study job search",
    processingTime: "20-day official decision period",
    duration: "24 months, non-renewable; this authorization does not permit work",
    costNote: "The residence procedure uses the applicable Model 790 code 052 fee.",
    requirements: [
      "Previously held a Spanish long-term study-stay authorization",
      "Completed higher education at an authorised Spanish institution at minimum EQF Level 6, equivalent to a university degree",
      "Apply during the 60 days before the study authorization expires or within the following 90 days",
      "Public or private health insurance with an insurer authorised to operate in Spain",
      "Funds of 100% of the monthly IPREM for the residence period, with the official accommodation reduction where applicable",
      "After finding suitable work or establishing a business, obtain the separate authorization required for that activity before working",
    ],
  }),
  "ES:Internship residence": makeDetail({
    status: "Internship",
    processingTime: "30-day official decision period",
    duration: "Agreement: up to 12 months, renewable once to 2 years total; employment contract: contract duration",
    costNote: "The host entity files the residence application and the applicable Model 790 code 052 fee is payable.",
    requirements: [
      "Currently studying toward a higher-education qualification or obtained one within the previous 2 years",
      "Internship in the same academic field and at the same qualification level as the studies or degree",
      "Internship agreement or internship employment contract with an eligible public or private host entity",
      "The host entity submits the application and provides the programme, supervision, hours and legal-relationship details",
      "When there is no internship employment contract, sufficient funds and health insurance are required",
      "Foreign public documents must be translated and legalised or apostilled when required",
    ],
  }),
  "ES:Employee work permit": makeDetail({
    status: "Work",
    processingTime: "Up to 3 months for the work authorization, then up to 1 month for the consular visa decision",
    duration: "More than 90 days and less than 5 years, according to the authorization and employment contract",
    minSalary: "Contract conditions must meet Spanish law; part-time total pay must reach the full-time annual minimum wage",
    costNote: "Residence and work authorization fees are divided between the worker and employer; a consular visa fee may also apply.",
    requirements: [
      "Spanish employer or entrepreneur submits the application for a non-EU/EEA/Swiss worker over 16",
      "Signed employment contract providing continuous work during the authorization period",
      "The labour-market test is satisfied or an official exemption or difficult-to-fill occupation applies",
      "Employer is registered and current with tax and Social Security obligations and has sufficient resources",
      "Applicant has the training and professional recognition legally required for the role",
      "After approval, apply for the national visa within 1 month and complete entry, Social Security and TIE steps",
    ],
  }),
  "ES:Highly Qualified Professional / EU Blue Card": makeDetail({
    status: "Skilled work",
    processingTime: "UGE processing time varies by route and case",
    duration: "Linked to the qualifying job and authorization granted; renewal may be available",
    minSalary: "Current route-specific UGE or EU Blue Card salary threshold applies",
    costNote: "Government charges and any consular visa fee depend on the authorization and filing location.",
    requirements: [
      "Qualifying job offer in Spain for a managerial position or an activity requiring higher-education qualifications",
      "Alternatively, at least 3 years of relevant professional experience accepted as equivalent where the route permits",
      "Employer and role meet the current Law 14/2013 or EU Blue Card conditions",
      "Salary meets the current route-specific threshold and employment conditions",
      "Valid passport and qualification, experience, employment and background documents required by UGE",
      "Employer or authorised representative files through the Large Companies and Strategic Groups Unit",
    ],
  }),
  "ES:Youth Mobility / Working Holiday": makeDetail({
    status: "Working holiday",
    processingTime: "Varies by the responsible Spanish embassy or consulate",
    duration: "Usually up to 12 months under the applicable bilateral agreement",
    costNote: "Visa fees, quotas, financial evidence and appointment procedures vary by nationality and consular post.",
    requirements: [
      "Citizenship of a country covered by Spain's current youth-mobility agreements: Argentina, South Korea, Japan, Australia, Canada or New Zealand",
      "Age within the bilateral agreement, generally 18–30 and up to 35 for eligible Canadian applicants",
      "Holiday and cultural exchange remain the main purpose, with temporary or occasional work under the agreement",
      "Sufficient funds, health or travel insurance and return or onward travel arrangements",
      "No accompanying dependants where the bilateral rules prohibit them",
      "Apply through the Spanish embassy or consulate responsible for the applicant's nationality and residence",
    ],
  }),
}
