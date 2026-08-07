import type { VisaCostItem, VisaDetail } from "./visa-detail"

type FinlandDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

function makeFinlandDetail(input: FinlandDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the correct Migri application",
        duration: "Before applying",
        note: "Use the linked Finnish Immigration Service page to confirm the permit, current fee, income threshold, processing estimate and document checklist.",
      },
      {
        step: "Secure the study, work or internship basis",
        duration: "Preparation stage",
        note: "Obtain the admission, degree evidence, employment terms, internship agreement or working-holiday documents required for the route.",
      },
      {
        step: "Submit through Enter Finland",
        duration: "Application stage",
        note: "Complete the online application, pay the processing fee and ask the employer to supplement the application where the route requires it.",
      },
      {
        step: "Prove identity and await the decision",
        duration: input.processingTime,
        note: "Book the required identity appointment abroad for a first permit, provide biometrics and do not begin restricted work before the permit rules allow it.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "EUR",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} Migri updates fees, income thresholds and processing estimates annually; confirm the current figures before applying.`,
    topCities: ["Helsinki", "Tampere", "Turku"],
  }
}

export const FINLAND_VISA_DETAILS: Record<string, VisaDetail> = {
  "FI:Residence permit for studies": makeFinlandDetail({
    status: "Study",
    processingTime: "Varies; first study applications are handled as urgent and the current student queue should be checked",
    duration: "For the approved study period; higher-education degree students normally receive a continuous A permit",
    costItems: [{ item: "Online first study-permit application", amount: 600 }],
    costNote: "The paper first-permit fee is higher, and tuition, insurance and living funds are separate.",
    requirements: [
      "Acceptance to a Finnish educational institution for a degree, vocational qualification or eligible exchange programme",
      "Living funds of at least EUR 800 per month, normally EUR 9,600 for the first year",
      "Separate funds for tuition if the fee has not already been paid or covered by a scholarship",
      "Private medical insurance unless an accepted Finnish, EU or UK health-coverage exception applies",
      "A valid passport and a first-permit application normally submitted from abroad",
      "Paid work in any field for an average of up to 30 hours per week over the year; degree-related practical training and thesis work are not subject to that limit",
    ],
  }),
  "FI:Post-study job-search and business permit": makeFinlandDetail({
    status: "Post-study job search or business",
    processingTime: "Varies by application type, completeness and current Migri workload",
    duration: "Maximum 2 years, either continuously or in up to three parts of at least 6 months each",
    costItems: [{ item: "Online first job-search permit application", amount: 750 }],
    costNote: "An online extended application currently has a lower fee than a first permit, and applicants must separately prove maintenance funds.",
    requirements: [
      "A current or previous Finnish residence permit for studies or research",
      "Completion of a degree or research work in Finland",
      "Application within five years after the previous study or research permit expired",
      "At least EUR 800 per month for the requested permit period",
      "A valid passport and the appropriate first-permit or extended-permit procedure based on current location",
      "The permit includes an unrestricted right to work in any field and may also be used to start a business",
    ],
  }),
  "FI:Residence permit for an employed person": makeFinlandDetail({
    status: "Employment",
    processingTime: "Varies; labour-market testing and incomplete employer information can extend processing",
    duration: "For the approved employment and period granted by Migri; renewable while the conditions remain met",
    minSalary: "At least EUR 1,600 gross per month in 2026, plus any higher collective-agreement requirement",
    costItems: [{ item: "Online first employed-person permit application", amount: 750 }],
    costNote: "The paper first-permit fee is higher, and labour-market testing may apply depending on the role and region.",
    requirements: [
      "Confirmed employment with a Finnish employer or another employer operating in Finland",
      "Regular minimum working hours; zero-hours and on-demand contracts do not satisfy the permit requirement",
      "Total gross salary of at least EUR 1,600 per month in 2026, excluding evening and night supplements",
      "Professional qualifications and any regulated-profession authorisation required for the role",
      "Employer submission of the terms of employment and supporting documents through Enter Finland for Employers or the paper process",
      "A first application normally submitted from abroad and possible labour-market testing for the field of employment",
    ],
  }),
  "FI:Specialist residence permit": makeFinlandDetail({
    status: "Highly skilled employment",
    processingTime: "Eligible first applications can use the two-week fast track; otherwise processing varies",
    duration: "First permit for up to 2 years, or the shorter employment period",
    minSalary: "At least EUR 3,937 gross per month in 2026, excluding fringe benefits",
    costItems: [{ item: "Online first specialist permit application", amount: 530 }],
    costNote: "A D visa may be requested with an eligible first application, and the paper application fee is higher.",
    requirements: [
      "Confirmed employment in Finland before applying",
      "Expert duties requiring special expertise",
      "Gross salary of at least EUR 3,937 per month in 2026 without counting fringe benefits",
      "Normally a higher-education degree, or equivalent special expertise gained through work experience or other education",
      "Employer verification of the duties, expertise and employment terms",
      "A first application submitted abroad; fast track is available only for an eligible first permit",
    ],
  }),
  "FI:Internship residence permit": makeFinlandDetail({
    status: "Paid educational internship",
    processingTime: "Varies by application completeness and current Migri workload",
    duration: "Maximum 18 months",
    minSalary: "Collective-agreement salary, or at least EUR 1,463 gross per month in 2026 where no agreement applies",
    costItems: [{ item: "Online first internship permit application", amount: 530 }],
    costNote: "A paid internship always requires a residence permit, while narrow unpaid-training exceptions follow separate rules.",
    requirements: [
      "Current higher-education study, application within two years of graduation, or another qualifying exchange or language-study basis",
      "For the youth student categories, age 18 to 30 and an internship matching the studies or degree",
      "A signed employment and internship agreement stating the objectives, supervision, hours, duration and salary",
      "The internship must not replace a normal job",
      "Salary at the applicable collective-agreement level or at least EUR 1,463 gross per month in 2026 when no agreement applies",
      "Work is limited to the approved internship and cannot begin before the permit is granted",
    ],
  }),
  "FI:Working Holiday": makeFinlandDetail({
    status: "Working holiday",
    processingTime: "Varies by application completeness and current Migri workload",
    duration: "Nationality-specific, generally up to 12 months",
    costItems: [{ item: "Standard online working-holiday application", amount: 530 }],
    costNote: "New Zealand citizens are exempt from the processing fee, and insurance and work limits differ by nationality.",
    requirements: [
      "Citizenship of Australia, New Zealand, Japan or Canada",
      "Age 18 to 30 for Australia and Japan, or 18 to 35 for New Zealand and Canada",
      "Holiday as the primary purpose and no previous Finnish working-holiday permit",
      "Approximately EUR 2,450 for the first three months plus a return ticket or funds to buy one",
      "Health and hospital insurance for Canada, Japan and New Zealand, with nationality-specific health requirements",
      "Australian citizens may work for up to nine months in the twelve-month stay and no more than three months for one employer; the other agreements do not impose the same employer restriction",
    ],
  }),
}
