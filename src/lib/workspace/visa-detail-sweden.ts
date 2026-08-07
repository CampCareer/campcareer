import type { VisaCostItem, VisaDetail } from "./visa-detail"

type SwedenDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

function makeSwedenDetail(input: SwedenDetailInput): VisaDetail {
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
        note: "Use the linked Swedish Migration Agency page to confirm the route, current fee, nationality rules and document checklist.",
      },
      {
        step: "Secure the study, work or training basis",
        duration: "Preparation stage",
        note: "Obtain the admission, completed-study evidence, signed employment contract, internship agreement or working-holiday documents required for the route.",
      },
      {
        step: "Submit the application",
        duration: "Application stage",
        note: "Complete the e-service or the designated paper process, pay the fee and upload the required passport, finance, insurance and supporting documents.",
      },
      {
        step: "Complete identity and residence formalities",
        duration: input.processingTime,
        note: "Present your passport and biometrics when requested, wait for the decision, and do not start restricted work before the permit rules allow it.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "SEK",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} Fees, maintenance amounts, salary thresholds and waiting-time statistics can change; confirm the current figures before applying.`,
    topCities: ["Stockholm", "Gothenburg", "Malmö"],
  }
}

const APPLICATION_FEE_1500: VisaCostItem[] = [
  { item: "Residence-permit application fee", amount: 1500 },
]

export const SWEDEN_VISA_DETAILS: Record<string, VisaDetail> = {
  "SE:Higher education study permit": makeSwedenDetail({
    status: "Study",
    processingTime: "75% of recently decided cases within 2 months",
    duration: "Up to 1 or 2 years depending on the institution, but not beyond the study period or passport validity",
    costItems: APPLICATION_FEE_1500,
    costNote: "Tuition, insurance, travel and the required living funds are separate from the application fee.",
    requirements: [
      "A valid passport and final admission to full-time first- or second-cycle studies or another eligible post-secondary programme",
      "University studies must normally equal 30 credits per semester; distance learning does not qualify as full-time study",
      "Any required tuition fee must be paid before the residence-permit application is submitted",
      "Financial maintenance of at least SEK 10,656 per month for applications submitted in 2026",
      "Comprehensive health insurance for a study period shorter than one year unless the institution provides equivalent cover",
      "For bachelor's and master's permits granted on or after 11 June 2026, work is normally limited to 15 hours per week during semesters, with broader rights during June, July and August and specified study-related exceptions",
    ],
  }),
  "SE:Post-study job-search permit": makeSwedenDetail({
    status: "Post-study job search",
    processingTime: "Varies by case completeness and current Swedish Migration Agency workload",
    duration: "Up to 1 year after bachelor's or master's studies; 1 to 18 months after doctoral studies",
    costItems: APPLICATION_FEE_1500,
    costNote: "Applicants must separately document maintenance for the full permit period and health insurance where required.",
    requirements: [
      "A valid passport and a current residence permit for higher education in Sweden or eligible EU study mobility completed partly in Sweden",
      "Completion with passing results of the entire higher-education programme, lasting at least two semesters",
      "Application submitted before the current study permit expires",
      "A genuine plan to look for work or investigate starting a business in Sweden",
      "Financial maintenance of at least SEK 10,656 per month for applications submitted in 2026",
      "Comprehensive health insurance if the total continuous Swedish permit period will be shorter than one year",
    ],
  }),
  "SE:Employee work permit": makeSwedenDetail({
    status: "Employment",
    processingTime: "75% of complete cases: about 1 month for highly qualified employment and 4 months for other employment",
    duration: "Up to 2 years, limited by the employment contract and passport validity; renewable",
    minSalary: "Normally at least SEK 34,470 per month and in line with the occupation's Swedish terms",
    costItems: [{ item: "Employee work-permit application fee", amount: 2200 }],
    costNote: "Some listed occupations and applicant groups may use a different statutory salary rule, while collective-agreement or industry pay may require a higher salary.",
    requirements: [
      "A valid passport and a signed employment contract with the Swedish employer",
      "Salary and other employment conditions at least on par with Swedish collective agreements or normal practice in the profession",
      "A monthly salary normally meeting 90% of Sweden's current median salary, currently SEK 34,470",
      "Employer-provided health, life, occupational-injury and occupational-pension insurance by the time employment starts",
      "Comprehensive health insurance if the employment and stay will last no more than one year",
      "The employer starts the application and the applicant normally applies from outside Sweden unless a listed in-country exception applies",
    ],
  }),
  "SE:Highly qualified job-seeker permit": makeSwedenDetail({
    status: "Highly qualified job search",
    processingTime: "75% of recently decided cases within 6 months",
    duration: "Maximum 9 months",
    costItems: [{ item: "Residence-permit application fee", amount: 2200 }],
    costNote: "Return travel, health insurance and the required monthly bank assets are separate from the application fee.",
    requirements: [
      "A valid passport and current location outside Sweden at the time of the first application",
      "Completed studies corresponding to a Swedish second-cycle qualification, professional degree or postgraduate degree",
      "A genuine plan to seek employment or investigate starting a business in Sweden",
      "Bank assets of at least SEK 13,000 for every month requested, plus funds for the return journey",
      "Comprehensive health insurance valid in Sweden for the full requested period",
      "A successful job seeker must apply for a work permit before starting work; after that application is submitted, work is limited to the employer and profession named in it",
    ],
  }),
  "SE:Higher-education traineeship permit": makeSwedenDetail({
    status: "Paid traineeship",
    processingTime: "75% of recently decided complete and incomplete cases within 4 months",
    duration: "For the offered traineeship, up to a total maximum of 18 months",
    minSalary: "At least the applicable Swedish collective-agreement or customary trainee rate",
    costItems: APPLICATION_FEE_1500,
    costNote: "The route is for paid, education-related traineeships; unpaid activity may require a visitor route instead.",
    requirements: [
      "A higher-education qualification completed no more than two years ago, or current enrolment in a programme leading to a degree",
      "A written traineeship agreement directly related to the field and level of the ongoing or completed education",
      "Salary at least equal to Swedish collective-agreement terms or normal trainee pay in the profession or industry",
      "Enough funds for the stay and return journey",
      "Comprehensive health insurance for a permit shorter than one year",
      "A valid passport and, when applying from within Sweden, completion of at least 30 higher-education credits or one doctoral semester",
    ],
  }),
  "SE:Working Holiday": makeSwedenDetail({
    status: "Working holiday",
    processingTime: "75% of complete cases within 3 months and incomplete cases within 4 months",
    duration: "Maximum 1 year; cannot be extended",
    costItems: APPLICATION_FEE_1500,
    costNote: "The programme is nationality-limited and work must remain secondary to the holiday and cultural-exchange purpose.",
    requirements: [
      "Citizenship of Australia, Canada, Hong Kong, Japan, New Zealand or South Korea",
      "Age 18 to 30 at the time of application",
      "At least SEK 15,000 in initial maintenance funds",
      "A return ticket or additional money sufficient to purchase one",
      "Comprehensive health insurance for the entire stay, except where the official rules exempt Australian citizens",
      "The primary purpose must be to experience Swedish life and culture; any work must end when the permit expires",
    ],
  }),
}
