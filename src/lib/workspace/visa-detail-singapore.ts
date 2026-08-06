import type { VisaCostItem, VisaDetail } from "./visa-detail"

type SingaporeDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costItems: VisaCostItem[]
  costNote: string
  minSalary?: string
}

function makeSingaporeDetail(input: SingaporeDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the correct pass",
        duration: "Before applying",
        note: "Use the linked ICA or MOM page to confirm the institution, employer, salary, nationality and age conditions that apply.",
      },
      {
        step: "Prepare the application",
        duration: "Application stage",
        note: "Collect the passport, admission, graduation, employment, training, salary and qualification evidence required for the route.",
      },
      {
        step: "Submit through the official channel",
        duration: "Application stage",
        note: "ICA applications may be applicant- or institution-led. MOM work-pass applications are normally filed by the employer, except the Work Holiday Pass.",
      },
      {
        step: "Complete issuance formalities",
        duration: input.processingTime,
        note: "After in-principle approval, complete entry, medical, payment, registration and digital-pass steps where required.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "SGD",
      items: input.costItems,
    },
    costNote: `${input.costNote} Government fees and eligibility can change; confirm the current amounts and conditions on the linked official page before applying.`,
    topCities: ["Singapore"],
  }
}

export const SINGAPORE_VISA_DETAILS: Record<string, VisaDetail> = {
  "SG:Student's Pass": makeSingaporeDetail({
    status: "Study",
    processingTime: "Usually within 1 week for institutes of higher learning; up to 2 weeks when an entry visa is required",
    duration: "Linked to the approved course and Student's Pass validity",
    costItems: [
      { item: "Student's Pass application fee", amount: 45 },
      { item: "Student's Pass issuance fee", amount: 60 },
      { item: "Multiple Journey Visa, if applicable", amount: 30, optional: true },
    ],
    costNote: "The listed amounts are ICA processing and issuance charges and exclude tuition, insurance, medical and living costs.",
    requirements: [
      "Acceptance and a Registration Acknowledgement Letter from an eligible Singapore institute of higher learning",
      "Submit the online application at least 2 months and not more than 3 months before the course begins",
      "Passport biodata, recent photograph, education and personal-history information requested by ICA",
      "Financial-support and Singapore address details where requested in the application",
      "Pay the processing fee and complete issuance formalities after approval",
      "Any employment while studying must separately satisfy the Ministry of Manpower's work-pass exemption rules",
    ],
  }),
  "SG:Graduate employment-search LTVP": makeSingaporeDetail({
    status: "Post-study job search",
    processingTime: "Most applications are processed within 6 weeks",
    duration: "As granted by ICA; approval and validity are case-specific",
    costItems: [
      { item: "LTVP application fee", amount: 45 },
      { item: "LTVP issuance fee", amount: 60 },
      { item: "Multiple Journey Visa, if applicable", amount: 30, optional: true },
    ],
    costNote: "The pass supports an eligible graduate's stay while seeking employment; it is not a substitute for the work pass required to start a job.",
    requirements: [
      "Graduate of an institute included in ICA's list of Singapore institutes of higher learning",
      "Apply under the graduate-seeking-employment category through ICA's non-Singpass application option",
      "Provide passport, qualification and other supporting documents requested by ICA",
      "Remain lawfully in Singapore while the application and completion formalities are handled",
      "Obtain the appropriate MOM work pass before starting employment",
      "Approval is discretionary and ICA may consider qualifications, age, residency and potential economic contribution",
    ],
  }),
  "SG:Employment Pass": makeSingaporeDetail({
    status: "Skilled work",
    processingTime: "Processed or given an update within 10 business days for most online applications",
    duration: "First-time pass up to 2 years; renewals up to 3 years",
    minSalary: "From SGD 5,600/month, or SGD 6,200 in financial services, increasing with age",
    costItems: [
      { item: "Employment Pass application fee", amount: 105 },
      { item: "Employment Pass issuance fee", amount: 225 },
      { item: "Multiple Journey Visa, if applicable", amount: 30, optional: true },
    ],
    costNote: "The salary shown is the current base threshold; the required salary rises with age and is higher in financial services.",
    requirements: [
      "Qualifying professional, managerial or executive job offer from a Singapore employer",
      "Fixed monthly salary meeting the current age- and sector-adjusted Employment Pass threshold",
      "Pass the Complementarity Assessment Framework (COMPASS) unless an official exemption applies",
      "Employer completes the required fair-consideration job advertising before applying, unless exempt",
      "Employer or appointed employment agent obtains written consent and files the application",
      "Qualifications and verification evidence are supplied when needed for COMPASS points or MOM assessment",
    ],
  }),
  "SG:S Pass": makeSingaporeDetail({
    status: "Work",
    processingTime: "Processed or given an update within 10 business days for most online applications",
    duration: "First-time pass up to 2 years; renewals up to 3 years",
    minSalary: "From SGD 3,300/month, or SGD 3,800 in financial services, increasing with age",
    costItems: [
      { item: "S Pass application fee", amount: 105 },
      { item: "S Pass issuance fee", amount: 100 },
    ],
    costNote: "Employers are also subject to sector quota, levy and medical-insurance requirements that are not included in the applicant-facing total.",
    requirements: [
      "Job offer in Singapore for work generally aligned with associate professional or technician skill levels",
      "Fixed monthly salary meeting the current age- and sector-adjusted S Pass threshold",
      "Employer has sufficient S Pass quota and pays the applicable monthly levy",
      "Employer or appointed employment agent submits the application and supporting documents",
      "Declared qualifications, when used, must be authentic and issued by an accredited institution",
      "A new employer must obtain a new S Pass before the worker changes jobs",
    ],
  }),
  "SG:Training Employment Pass": makeSingaporeDetail({
    status: "Professional training",
    processingTime: "Within 3 weeks for most cases",
    duration: "Up to 3 months and not renewable",
    minSalary: "SGD 3,000/month unless an eligible foreign student is studying at an acceptable institution",
    costItems: [
      { item: "Training Employment Pass application fee", amount: 105 },
      { item: "Training Employment Pass issuance fee", amount: 225 },
      { item: "Multiple Journey Visa, if applicable", amount: 30, optional: true },
    ],
    costNote: "The employer pays the official application and issuance fees; accommodation, travel and training costs are separate.",
    requirements: [
      "Foreign student whose Singapore attachment forms part of the course, or trainee from a related overseas office or subsidiary",
      "Foreign student studies at an acceptable institution or receives at least SGD 3,000 fixed monthly salary",
      "Overseas-company trainee receives at least SGD 3,000 fixed monthly salary",
      "Singapore employer submits the application with the candidate's written consent",
      "Detailed training programme states the objective, type, location and duration",
      "The pass cannot be renewed and is not available repeatedly for the same type of training",
    ],
  }),
  "SG:Work Holiday Pass": makeSingaporeDetail({
    status: "Working holiday",
    processingTime: "Within 4 weeks for most cases",
    duration: "6 months under the Work Holiday Programme; 12 months for eligible Australians and New Zealanders under the separate visa programmes",
    costItems: [
      { item: "Work Holiday Pass issuance fee", amount: 175 },
      { item: "Multiple Journey Visa, if applicable", amount: 30, optional: true },
    ],
    costNote: "Programme capacity, nationality rules and employment restrictions differ between the 6-month and 12-month routes.",
    requirements: [
      "For the 6-month programme: age 18–25 and undergraduate or graduate status at a government-recognised university in an eligible country or region",
      "For undergraduates on the 6-month programme: at least 3 months of full-time university residence and study before applying",
      "For the 12-month programme: Australian or New Zealand citizenship, age 18–30, and a degree or at least 2 years of full-time undergraduate study",
      "Candidate submits the application with passport and university or graduation evidence",
      "Professional registration remains mandatory for regulated occupations",
      "The 12-month programme does not allow freelance work or work for the same employer for more than 6 months",
    ],
  }),
}
